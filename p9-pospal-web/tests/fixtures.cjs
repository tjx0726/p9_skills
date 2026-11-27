'use strict';

const g = require('../scripts/games.cjs');
const ORIGIN = 'https://pospal.example.test';
const ZERO = g.encodeGames(Object.fromEntries(g.KEYS.map(key => [key, 0])));
const TITLE = JSON.stringify({ title: 'Games', schema: {
  type: 'string', minLength: 76, maxLength: 76,
  pattern: '^pokemon=[01];magic=[01];yugioh=[01];fab=[01];elestrals=[01];gundam=[01];riftbound=[01];digimon=[01];$',
}, note: 'TCG interests; 0=unselected,1=selected' });

function rawJson(value) {
  return JSON.stringify(value, (_key, item) => typeof item === 'string' && /^\d{16,}$/.test(item)
    ? JSON.rawJSON(item) : item);
}
function attributeEscape(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function archiveRow(key, title, value, group) {
  return { AttributeKey: key, AttributeValue: title, AttributeDataType: 0,
    CustomerValue: value, GroupType: group, IsRequire: 0, IsDefault: false, OptionValues: [] };
}
function state() {
  return {
    definitions: [{ isDefault: false, optionValues: [], id: 123,
      uid: '9223372036854775807', userId: 100, attributeKey: 'attribute7',
      attributeValue: TITLE, isRequire: 0, isEditable: 0, groupType: 0, attributeDataType: 0 }],
    customer: { uid: '9223372036854775806', number: 'TEST-0001', name: 'Synthetic only',
      userId: 101, createUserId: 100, email: 'private@example.test', address: 'Synthetic address',
      remarks: 'Keep this note', qq: '', birthday: null, lunarYear: null, lunarMonthDay: null,
      customerExt: { sex: null, lastBirthdayType: 0, extra: 'preserve' }, level: 'synthetic', updateDateTime: 'before' },
    archives: { baseCustomerArchives: [archiveRow('attribute7', TITLE, ZERO, 0),
      archiveRow('attribute3', 'Notes', 'Keep base <&> "quoted"', 0)],
    privateCustomerArchives: [archiveRow('attribute2', 'Private notes', 'Keep private', 1)] },
  };
}
function archiveHtml(archives) {
  return '<html>' + Object.entries(archives).map(([id, rows]) =>
    `<input type="hidden" id="${id}" value="${attributeEscape(rawJson(rows))}" />`).join('') + '</html>';
}

// This service never opens a network connection. All identifiers/data are synthetic.
function service(options = {}) {
  const db = state(), calls = [], contexts = [];
  if (options.sparse) db.customer = { number: db.customer.number, email: db.customer.email, qq: '', customerExt: {} };
  let definitionReads = 0, writes = 0, disposals = 0;
  const response = (url, value, status = 200) => ({
    url: () => url, status: () => status,
    body: async () => Buffer.from(typeof value === 'string' ? value : rawJson(value)),
    dispose: async () => {},
  });
  function context(authenticated = false) {
    let signedIn = authenticated, bootstrap = false;
    const request = {
      dispose: async () => { disposals++; },
      fetch: async (url, input) => {
        const parsed = new URL(url), p = parsed.pathname;
        if (parsed.origin !== ORIGIN) throw new Error('Synthetic transport blocks every other origin.');
        calls.push({ path: p, query: parsed.search, ...input });
        if (input.maxRedirects !== 0 || input.maxRetries !== 0) throw new Error('Automatic retry/redirect must be disabled.');
        if (p === '/account/signin') { bootstrap = true; return response(url, '<html>Account login</html>'); }
        if (p === '/account/SignIn') {
          const form = new URLSearchParams(input.data);
          if (!bootstrap || form.get('userName') !== 'FAKE-OWNER' || form.get('password') !== 'FAKE-PASSWORD') throw new Error('Synthetic login protocol mismatch.');
          if (options.loginRejected) return response(url, { successed: false, showVerification: true });
          signedIn = true;
          return response(url, { successed: true, msg: options.foreignRoute ? 'https://wrong.example.test/Home' : ORIGIN + '/Home?fromSource=synthetic' });
        }
        if (!signedIn) return response(url, '', 302);
        if (p === '/Home') return response(url, '<html>Home</html>');
        if (p === '/Setting/Info') return response(url, `<script>var userId = '${options.wrongStore ? '200' : '100'}';</script>`);
        if (p === '/Product/FindProduct') {
          if (new URLSearchParams(input.data).get('productId') !== '321') throw new Error('Wrong synthetic product.');
          return response(url, { successed: true, product: { id: options.wrongProductId ? 322 : 321, uid: '9223372036854775805', userId: 100, barcode: 'TEST-PRODUCT' } });
        }
        if (p === '/Customer/CustomerBaseSetting') {
          definitionReads++;
          if (options.conflict && definitionReads === 2) db.definitions[0].isEditable = 1;
          if (options.schemaDrift) {
            const title = JSON.parse(db.definitions[0].attributeValue); title.schema.maxLength = 255;
            db.definitions[0].attributeValue = JSON.stringify(title);
          }
          if (options.bareDefinitions) return response(url, db.definitions);
          return response(url, `<script>var customerArchives = ${rawJson(db.definitions)};</script>`);
        }
        if (p === '/Customer/FindCustomer') return response(url, { successed: true, customer: db.customer });
        if (p === '/CustomerReport/CustomerDetail') {
          if (parsed.searchParams.get('number') !== db.customer.number) throw new Error('Wrong synthetic member.');
          const html = archiveHtml(db.archives);
          return response(url, options.wrappedHtml ? { successed: true, contentView: html } : html);
        }
        if (['/CustomerReport/UpdateCustomerBaseInfo', '/CustomerReport/UpdateCustomerPrivateInfo'].includes(p)) {
          writes++;
          if (input.headers['Content-Type'] !== 'application/json; charset=UTF-8') throw new Error('Real JSON is required.');
          if (options.beforeSaveTimeout) throw new Error('Synthetic timeout; no state update.');
          const payload = g.parseLossless(input.data), privateGroup = p.endsWith('UpdateCustomerPrivateInfo');
          if (!privateGroup) {
            if (payload.customer.number !== db.customer.number || 'uid' in payload.customer || 'name' in payload.customer) throw new Error('Fresh projection mismatch.');
            const ext = db.customer.customerExt;
            Object.assign(db.customer, payload.customer);
            db.customer.customerExt = { ...ext, ...payload.customer.customerExt };
            if (typeof db.customer.remarks === 'string') db.customer.remarks = db.customer.remarks.slice(0, 255);
          } else if (payload.customerNumber !== db.customer.number) throw new Error('Wrong private holder.');
          for (const update of payload.updateAttributes) {
            const row = db.archives[privateGroup ? 'privateCustomerArchives' : 'baseCustomerArchives'].find(item => item.AttributeKey === update.AttributeKey);
            row.AttributeValue = update.AttributeValue;
            row.CustomerValue = update.CustomerValue.slice(0, options.truncateValue ? 20 : 255);
          }
          db.customer.updateDateTime = 'after';
          if (options.privateSideEffect) db.archives.privateCustomerArchives[0].CustomerValue = 'Unexpected synthetic change';
          if (options.birthdaySideEffect) db.customer.customerExt.lastBirthdayType = 1;
          if (options.birthdayNormalization) db.customer.customerExt.lastBirthdayType = 0;
          if (options.titleSideEffect) db.archives.baseCustomerArchives[0].AttributeValue = TITLE.slice(0, -1);
          if (options.afterSaveTimeout) throw new Error('Synthetic timeout after update.');
          if (options.truncatedReply) return response(url, '{"result":{"successed":true');
          return response(url, { result: { successed: true } });
        }
        throw new Error('No synthetic contract for this route.');
      },
    };
    contexts.push(request);
    return request;
  }
  return { db, calls, context, get writes() { return writes; }, get disposals() { return disposals; },
    requestFactory: { newContext: async options => {
      if (options.baseURL !== ORIGIN || options.ignoreHTTPSErrors !== false || options.storageState) throw new Error('Unexpected context configuration.');
      return context();
    } },
  };
}

module.exports = { ORIGIN, ZERO, TITLE, rawJson, state, archiveHtml, service };
