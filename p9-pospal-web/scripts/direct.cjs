'use strict';

const { isDeepStrictEqual } = require('node:util');
const { resolveCredentials } = require('./access.cjs');
const games = require('./games.cjs');

function failure(code) {
  const error = new Error(`PosPal ${code}; no automatic retry.`);
  error.code = code;
  return error;
}

function trustedOrigin(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password ||
        url.pathname !== '/' || url.search || url.hash) throw failure('ORIGIN');
    return url.origin;
  } catch { throw failure('ORIGIN'); }
}

function formEncode(fields) {
  const pairs = Array.isArray(fields) ? fields : Object.entries(fields);
  const encoded = new URLSearchParams();
  for (const [key, value] of pairs) {
    const values = Array.isArray(value) ? value : [value];
    if (Array.isArray(value) && !key.endsWith('[]')) throw failure('FORM_ARRAY_CONTRACT');
    for (const item of values) {
      if (!['string', 'boolean', 'number', 'bigint'].includes(typeof item) ||
          (typeof item === 'number' && (!Number.isFinite(item) ||
            (Number.isInteger(item) && !Number.isSafeInteger(item))))) {
        throw failure('FORM_VALUE');
      }
      encoded.append(key, String(item));
    }
  }
  return encoded.toString();
}

function parseEnvelope(raw) {
  const text = raw.replace(/^\uFEFF/, '').trim();
  if (/^[\[{]/.test(text)) {
    const json = games.parseLossless(text);
    if (json?.successed === false || json?.success === false ||
        json?.result?.successed === false) throw failure('BUSINESS_REJECTED');
    const htmlFields = {};
    for (const key of ['contentView', 'view', 'mainTableView', 'historySummaryView', 'summaryView']) {
      if (typeof json?.[key] === 'string') htmlFields[key] = json[key];
    }
    return { json, htmlFields };
  }
  if (text.startsWith('<')) return { html: text, htmlFields: {} };
  throw failure('RESPONSE_CONTRACT');
}

function responseHtml(response) {
  if (response.html !== undefined) return response.html;
  const parts = Object.values(response.htmlFields);
  if (parts.length !== 1) throw failure('HTML_ENVELOPE');
  return parts[0];
}

function decodeAttribute(value) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (_all, entity) => {
    const named = { quot: '"', apos: "'", amp: '&', lt: '<', gt: '>', nbsp: '\u00a0' };
    if (Object.hasOwn(named, entity)) return named[entity];
    if (!entity.startsWith('#')) throw failure('HTML_ENTITY_CONTRACT');
    const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    if (code <= 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) throw failure('HTML_ENTITY_CONTRACT');
    return String.fromCodePoint(code);
  });
}

function extractDefinitions(response) {
  if (Array.isArray(response.json)) return response.json;
  const html = responseHtml(response);
  const initializers = [...html.matchAll(/\bvar\s+customerArchives\s*=\s*/g)];
  if (initializers.length !== 1) throw failure('DEFINITION_CONTRACT');
  const start = initializers[0].index + initializers[0][0].length;
  if (html[start] !== '[') throw failure('DEFINITION_CONTRACT');
  let depth = 0, quoted = false, escaped = false;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') quoted = false;
    } else if (ch === '"') quoted = true;
    else if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) return games.parseLossless(html.slice(start, i + 1));
  }
  throw failure('DEFINITION_TRUNCATED');
}

function extractArchives(response) {
  const html = responseHtml(response), result = {};
  for (const match of html.matchAll(/<input\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi)) {
    const attributes = {};
    for (const attr of match[0].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)) {
      if (Object.hasOwn(attributes, attr[1].toLowerCase())) throw failure('ARCHIVE_CONTRACT');
      attributes[attr[1].toLowerCase()] = attr[2] ?? attr[3] ?? attr[4];
    }
    const id = attributes.id;
    if (!['baseCustomerArchives', 'privateCustomerArchives'].includes(id)) continue;
    if (Object.hasOwn(result, id) || attributes.value === undefined) throw failure('ARCHIVE_CONTRACT');
    result[id] = games.parseLossless(decodeAttribute(attributes.value));
    if (!Array.isArray(result[id])) throw failure('ARCHIVE_CONTRACT');
  }
  if (Object.keys(result).length !== 2) throw failure('ARCHIVE_CONTRACT');
  return result;
}

function projectCustomer(customer) {
  const fields = ['number', 'email', 'address', 'remarks', 'qq', 'birthday', 'lunarYear', 'lunarMonthDay'];
  const ext = customer?.customerExt ?? {};
  if (!customer || typeof customer.number !== 'string' || !customer.number ||
      typeof ext !== 'object' || Array.isArray(ext)) {
    throw failure('CUSTOMER_PROJECTION');
  }
  return { ...Object.fromEntries(fields.map(key => [key, customer[key] ?? null])),
    customerExt: { sex: ext.sex ?? null, lastBirthdayType: ext.lastBirthdayType ?? null } };
}

function verifyArchives(before, after, update, group = 'baseCustomerArchives') {
  const rows = before[group].filter(row => row.AttributeKey === update.AttributeKey);
  if (rows.length !== 1) throw failure('ARCHIVE_BINDING');
  const expected = { ...before, [group]: before[group].map(row => row.AttributeKey === update.AttributeKey
    ? { ...row, AttributeValue: update.AttributeValue, CustomerValue: update.CustomerValue } : row) };
  if (!isDeepStrictEqual(expected, after)) throw failure('ARCHIVE_READBACK_MISMATCH');
}

function protectedCustomer(customer) {
  const { updateDateTime, ...rest } = customer;
  return { ...rest, ...projectCustomer(customer), customerExt: {
    ...customer.customerExt, sex: customer.customerExt?.sex ?? null,
    lastBirthdayType: customer.customerExt?.lastBirthdayType ?? null,
  } };
}

class DirectSession {
  #context; #origin; #userId; #owned; #busy = false; #writesBlocked = false;
  constructor(context, origin, userId, owned) {
    this.#context = context; this.#origin = origin; this.#userId = games.idString(userId); this.#owned = owned;
  }
  async close() { if (this.#owned) await this.#context.dispose(); }

  async #send(relative, { method = 'GET', form, json, referer = '/Report/Tickets' } = {}) {
    let url;
    try {
      url = new URL(relative, this.#origin);
      if (url.origin !== this.#origin || url.username || url.password || url.hash) throw failure('ORIGIN');
    } catch { throw failure('ORIGIN'); }
    const headers = { Accept: 'application/json,text/html;q=0.9', Referer: this.#origin + referer };
    if (method === 'POST') { headers.Origin = this.#origin; headers['X-Requested-With'] = 'XMLHttpRequest'; }
    let data;
    if (form !== undefined) { data = formEncode(form); headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'; }
    if (json !== undefined) {
      data = JSON.stringify(json);
      headers['Content-Type'] = 'application/json; charset=UTF-8';
    }
    let response;
    try {
      response = await this.#context.fetch(url.href, { method, headers, data,
        maxRedirects: 0, maxRetries: 0, timeout: 25000, failOnStatusCode: false });
      if (new URL(response.url()).origin !== this.#origin) throw failure('ORIGIN');
      const status = response.status();
      if (status === 401 || status === 403 || (status >= 300 && status < 400)) throw failure('ACCESS_OR_SESSION');
      if (status < 200 || status >= 300) throw failure('HTTP_OUTCOME');
      const body = await response.body();
      if (body.length > 8 * 1024 * 1024) throw failure('RESPONSE_TOO_LARGE');
      return parseEnvelope(new TextDecoder('utf-8', { fatal: true }).decode(body));
    } catch (error) {
      if (error?.code && /^PosPal /.test(error.message)) throw error;
      throw failure('TRANSPORT_OR_RESPONSE');
    } finally { if (response?.dispose) await response.dispose().catch(() => {}); }
  }

  async loginOwner(access) {
    if (!this.#owned) throw failure('REUSE_EXISTING_IDENTITY');
    if (access.mode !== 'owner') throw failure('EMPLOYEE_REQUIRES_EXISTING_WEB_SESSION');
    await this.#send('/account/signin');
    const answer = await this.#send('/account/SignIn?noLog=', { method: 'POST', form: {
      userName: access.account, password: access.password, returnUrl: '', screenSize: '1920*1080',
    } });
    if (answer.json?.successed !== true || typeof answer.json.msg !== 'string') throw failure('LOGIN_NOT_COMPLETED');
    let route;
    try {
      route = new URL(answer.json.msg, this.#origin);
      if (route.origin !== this.#origin || route.username || route.password || /\/signin/i.test(route.pathname)) throw failure('LOGIN_DESTINATION');
    } catch { throw failure('LOGIN_DESTINATION'); }
    await this.#send(route.pathname + route.search);
  }

  async confirmStore() {
    const response = await this.#send('/Setting/Info');
    const matches = [...responseHtml(response).matchAll(/\bvar\s+userId\s*=\s*['"](\d+)['"]/g)];
    if (matches.length !== 1 || matches[0][1] !== this.#userId) throw failure('STORE_MISMATCH');
    return { verified: true, userId: this.#userId };
  }

  async readProduct(productId) {
    await this.confirmStore();
    const result = await this.#send('/Product/FindProduct', { method: 'POST', form: { productId: games.idString(productId) } });
    if (result.json?.successed !== true || !result.json.product) throw failure('PRODUCT_CONTRACT');
    if (games.idString(result.json.product.userId) !== this.#userId) throw failure('PRODUCT_STORE_MISMATCH');
    if (games.idString(result.json.product.id) !== games.idString(productId)) throw failure('PRODUCT_ID_MISMATCH');
    return result.json.product;
  }

  async #definitions() {
    return games.findGamesDefinition(extractDefinitions(await this.#send('/Customer/CustomerBaseSetting')));
  }

  async readMember(number) {
    if (typeof number !== 'string' || !number) throw failure('MEMBER_NUMBER');
    await this.confirmStore();
    const response = await this.#send('/Customer/FindCustomer', { method: 'POST', form: { number } });
    if (response.json?.successed !== true || response.json.customer?.number !== number) throw failure('MEMBER_CONTRACT');
    return { customer: response.json.customer, archives: extractArchives(await this.#send(
      '/CustomerReport/CustomerDetail?' + new URLSearchParams({ number }))) };
  }

  async updateGames({ number, key, bit, initializeUnset = false, allowBirthdayTypeNormalization = false }) {
    if (typeof initializeUnset !== 'boolean' || typeof allowBirthdayTypeNormalization !== 'boolean') throw failure('AUTHORIZATION_FLAGS');
    if (this.#busy || this.#writesBlocked) throw failure('WRITE_BLOCKED');
    this.#busy = true;
    try {
      await this.confirmStore();
      const definition = await this.#definitions(), before = await this.readMember(number);
      const rows = before.archives.baseCustomerArchives.filter(row => row.AttributeKey === definition.attributeKey);
      if (rows.length !== 1 || rows[0].AttributeValue !== definition.attributeValue ||
          ![0, '0'].includes(rows[0].AttributeDataType) || ![0, '0'].includes(rows[0].GroupType)) throw failure('ARCHIVE_BINDING');
      const next = games.setInterest(rows[0].CustomerValue, key, bit, { initializeUnset });
      const update = games.gamesAttribute(definition, next);
      if (next === rows[0].CustomerValue) return { verified: true, changed: false };
      const customer = projectCustomer(before.customer);
      const freshDefinition = await this.#definitions(), fresh = await this.readMember(number);
      if (!isDeepStrictEqual(definition, freshDefinition) ||
          !isDeepStrictEqual(protectedCustomer(before.customer), protectedCustomer(fresh.customer)) ||
          !isDeepStrictEqual(before.archives, fresh.archives)) throw failure('CONCURRENT_CHANGE');
      await this.confirmStore();
      this.#writesBlocked = true;
      let acknowledged = false, responseUncertain = false;
      try {
        const answer = await this.#send('/CustomerReport/UpdateCustomerBaseInfo', {
          method: 'POST', json: { customer, updateAttributes: [update] },
          referer: '/CustomerReport/CustomerDetail?' + new URLSearchParams({ number }),
        });
        acknowledged = answer.json?.result?.successed === true || answer.json?.successed === true || answer.json?.success === true;
        responseUncertain = !acknowledged;
      } catch { responseUncertain = true; }
      const after = await this.readMember(number), afterDefinition = await this.#definitions();
      await this.confirmStore();
      verifyArchives(before.archives, after.archives, update);
      if (!isDeepStrictEqual(definition, afterDefinition)) throw failure('PROTECTED_READBACK_MISMATCH');
      const beforeCustomer = protectedCustomer(before.customer), afterCustomer = protectedCustomer(after.customer);
      let normalization = false;
      if (!isDeepStrictEqual(beforeCustomer, afterCustomer)) {
        const normalized = structuredClone(beforeCustomer);
        normalized.customerExt.lastBirthdayType = 0;
        normalization = beforeCustomer.customerExt.lastBirthdayType === null &&
          afterCustomer.customerExt.lastBirthdayType === 0 && isDeepStrictEqual(normalized, afterCustomer);
        if (!normalization) throw failure('PROTECTED_READBACK_MISMATCH');
      }
      if (normalization && !allowBirthdayTypeNormalization) return {
        verified: false, changed: true, acknowledged, responseUncertain, reviewRequired: true,
        sideEffects: ['unsetBirthdayTypeBecameGregorian0'],
      };
      this.#writesBlocked = false;
      return { verified: true, changed: true, acknowledged, responseUncertain,
        ...(normalization ? { sideEffects: ['unsetBirthdayTypeBecameGregorian0'] } : {}) };
    } finally { this.#busy = false; }
  }
}

async function openSession({ origin, expectedUserId, requestContext, requestFactory, accessOptions } = {}) {
  const trusted = trustedOrigin(origin);
  games.idString(expectedUserId);
  const owned = !requestContext;
  let access;
  if (owned) {
    access = resolveCredentials(accessOptions);
    if (access.mode !== 'owner') throw failure('EMPLOYEE_REQUIRES_EXISTING_WEB_SESSION');
    if (!requestFactory?.newContext) throw failure('REQUEST_CONTEXT_REQUIRED');
    try { requestContext = await requestFactory.newContext({ baseURL: trusted, ignoreHTTPSErrors: false }); }
    catch { throw failure('REQUEST_CONTEXT_REQUIRED'); }
  }
  if (typeof requestContext.fetch !== 'function') throw failure('REQUEST_CONTEXT_REQUIRED');
  const session = new DirectSession(requestContext, trusted, expectedUserId, owned);
  try {
    if (owned) await session.loginOwner(access);
    await session.confirmStore();
    return session;
  } catch (error) {
    if (owned) await session.close().catch(() => {});
    throw error;
  }
}

module.exports = { openSession, formEncode, parseEnvelope, extractDefinitions, extractArchives,
  projectCustomer, verifyArchives };
