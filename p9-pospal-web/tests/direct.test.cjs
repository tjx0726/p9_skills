'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const direct = require('../scripts/direct.cjs');
const g = require('../scripts/games.cjs');
const f = require('./fixtures.cjs');
const target = { number: 'TEST-0001', key: 'magic', bit: 1 };
const accessOptions = { block: 'account1', mode: 'owner', runtime: {}, bindings: {},
  localTexts: ['account1=FAKE-OWNER\naccount1_password=FAKE-PASSWORD'] };
const open = (service, options = {}) => direct.openSession({ origin: f.ORIGIN, expectedUserId: '100',
  requestContext: service.context(true), ...options });

test('isolated owner context performs login, an ordinary read and complete Games read/write/readback', async () => {
  const service = f.service({ wrappedHtml: true });
  const session = await direct.openSession({ origin: f.ORIGIN, expectedUserId: '100', requestFactory: service.requestFactory, accessOptions });
  assert.equal((await session.readProduct('321')).uid, '9223372036854775805');
  const baseline = structuredClone(service.db);
  const result = await session.updateGames(target);
  assert.deepEqual(result, { verified: true, changed: true, acknowledged: true, responseUncertain: false });
  assert.equal(service.db.archives.baseCustomerArchives[0].CustomerValue, f.ZERO.replace('magic=0', 'magic=1'));
  assert.deepEqual(service.db.archives.privateCustomerArchives, baseline.archives.privateCustomerArchives);
  assert.equal(service.db.definitions[0].attributeValue, f.TITLE);
  assert.equal(service.writes, 1);
  const write = service.calls.find(call => call.path.endsWith('UpdateCustomerBaseInfo'));
  assert.equal(write.headers['X-Requested-With'], 'XMLHttpRequest');
  assert.equal(new URL(write.headers.Referer).pathname, '/CustomerReport/CustomerDetail');
  assert.equal(service.calls.find(call => call.path === '/Setting/Info').headers['X-Requested-With'], undefined);
  assert.equal(g.parseLossless(write.data).updateAttributes[0].AttributeValue.length, 237);
  assert(service.calls.slice(service.calls.indexOf(write) + 1).some(call => call.path.endsWith('CustomerDetail')));
  await session.close();
  assert.equal(service.disposals, 1);
});

test('an existing owner/employee request context retains identity and needs no credential source or login', async () => {
  const service = f.service({ bareDefinitions: true });
  const session = await open(service);
  await session.updateGames(target);
  assert.equal(service.calls.some(call => call.path.toLowerCase().includes('signin')), false);
  await assert.rejects(session.loginOwner({ mode: 'owner' }), { code: 'REUSE_EXISTING_IDENTITY' });
  await session.close();
  assert.equal(service.disposals, 0);
});

test('wire forms preserve repeated keys and JSON-string fields; envelopes and raw numeric IDs parse correctly', () => {
  const encoded = new URLSearchParams(direct.formEncode({ 'userIds[]': ['100', '101'], tableUids: '[]', categorysJson: '["x"]' }));
  assert.deepEqual(encoded.getAll('userIds[]'), ['100', '101']);
  assert.equal(encoded.get('categorysJson'), '["x"]');
  assert.throws(() => direct.formEncode({ categorysJson: [] }));
  assert.throws(() => direct.formEncode({ productUid: Number('9223372036854775807') }));
  assert.equal(direct.parseEnvelope('[{"uid":9223372036854775807}]').json[0].uid, '9223372036854775807');
  assert.equal(direct.parseEnvelope('{"successed":true,"contentView":"<table></table>"}').htmlFields.contentView, '<table></table>');
});

test('a rejected/challenged login and a foreign next hop stop without a retry or business read', async () => {
  for (const options of [{ loginRejected: true }, { foreignRoute: true }]) {
    const service = f.service(options);
    await assert.rejects(direct.openSession({ origin: f.ORIGIN, expectedUserId: '100', requestFactory: service.requestFactory, accessOptions }));
    assert.equal(service.calls.filter(call => call.path === '/account/SignIn').length, 1);
    assert.equal(service.calls.some(call => call.path === '/Setting/Info'), false);
    assert.equal(service.disposals, 1);
  }
});

test('wrong stores and unverified independent employee login stop before a business write', async () => {
  const service = f.service({ wrongStore: true });
  await assert.rejects(open(service), { code: 'STORE_MISMATCH' });
  await assert.rejects(direct.openSession({ origin: f.ORIGIN, expectedUserId: '100', requestFactory: service.requestFactory,
    accessOptions: { block: 'account1', mode: 'staff', runtime: {}, localTexts: ['account1=FAKE-OWNER\nstaff_id=0007\nstaff_password=FAKE-STAFF'] } }),
  { code: 'EMPLOYEE_REQUIRES_EXISTING_WEB_SESSION' });
  assert.equal(service.writes, 0);
});

test('text flags cannot silently authorize initialization or birthday normalization', async () => {
  const service = f.service(), session = await open(service);
  await assert.rejects(session.updateGames({ ...target, initializeUnset: 'false' }), { code: 'AUTHORIZATION_FLAGS' });
  await assert.rejects(session.updateGames({ ...target, allowBirthdayTypeNormalization: 'false' }), { code: 'AUTHORIZATION_FLAGS' });
  assert.equal(service.writes, 0);
});

test('current schema drift, fresh conflicts and malformed customer structures cannot trigger a save', async () => {
  for (const options of [{ schemaDrift: true }, { conflict: true }, {}]) {
    const service = f.service(options);
    if (!Object.keys(options).length) service.db.customer.customerExt = 3;
    const session = await open(service);
    await assert.rejects(session.updateGames(target));
    assert.equal(service.writes, 0);
  }
});

test('sparse historical profiles use null projection without fabricating dates; exact birthday normalization is separate', async () => {
  for (const birthdayNormalization of [false, true]) for (const allowBirthdayTypeNormalization of [false, true]) {
    const service = f.service({ sparse: true, birthdayNormalization }), session = await open(service);
    const result = await session.updateGames({ ...target, allowBirthdayTypeNormalization });
    assert.equal(result.verified, !birthdayNormalization || allowBirthdayTypeNormalization);
    if (birthdayNormalization) assert.deepEqual(result.sideEffects, ['unsetBirthdayTypeBecameGregorian0']);
    const payload = g.parseLossless(service.calls.find(call => call.path.endsWith('UpdateCustomerBaseInfo')).data);
    for (const field of ['address', 'remarks', 'birthday', 'lunarYear', 'lunarMonthDay']) assert.equal(payload.customer[field], null);
    assert.equal(payload.customer.customerExt.lastBirthdayType, null);
    assert.equal(service.db.customer.birthday, null);
    assert.equal(service.writes, 1);
    if (!result.verified) await assert.rejects(session.updateGames(target), { code: 'WRITE_BLOCKED' });
  }
});

test('readProduct binds both returned record ID and store; public member reads recheck a reused identity', async () => {
  const service = f.service({ wrongProductId: true }), session = await open(service);
  await assert.rejects(session.readProduct('321'), { code: 'PRODUCT_ID_MISMATCH' });
  const options = {}, changing = f.service(options), changingSession = await open(changing);
  options.wrongStore = true;
  await assert.rejects(changingSession.readMember(target.number), { code: 'STORE_MISMATCH' });
  assert.equal(changing.calls.some(call => call.path === '/Customer/FindCustomer'), false);
});

test('an uncertain response is reconciled by fresh independent reads without a second save', async () => {
  for (const options of [{ afterSaveTimeout: true }, { truncatedReply: true }]) {
    const service = f.service(options), session = await open(service);
    const result = await session.updateGames(target);
    assert.equal(result.verified, true);
    assert.equal(result.responseUncertain, true);
    assert.equal(service.writes, 1);
  }
  const service = f.service({ beforeSaveTimeout: true }), session = await open(service);
  await assert.rejects(session.updateGames(target), { code: 'ARCHIVE_READBACK_MISMATCH' });
  await assert.rejects(session.updateGames(target), { code: 'WRITE_BLOCKED' });
  assert.equal(service.writes, 1);
});

test('a successful reply with a truncated value, changed title/private data/birthday never counts as success', async () => {
  for (const options of [{ truncateValue: true }, { titleSideEffect: true }, { privateSideEffect: true }, { birthdaySideEffect: true }]) {
    const service = f.service(options), session = await open(service);
    await assert.rejects(session.updateGames(target));
    await assert.rejects(session.updateGames(target), { code: 'WRITE_BLOCKED' });
    assert.equal(service.writes, 1);
  }
});

test('saved archive structures round-trip quotes, entities and large definition IDs without evaluating scripts', () => {
  const sample = f.state();
  assert.deepEqual(direct.extractArchives(direct.parseEnvelope(f.archiveHtml(sample.archives))), sample.archives);
  const defs = direct.extractDefinitions(direct.parseEnvelope(`<script>var customerArchives = ${f.rawJson(sample.definitions)}; throw new Error('never execute');</script>`));
  assert.equal(defs[0].uid, '9223372036854775807');
  assert.throws(() => direct.extractDefinitions(direct.parseEnvelope('<script>var customerArchives = [</script>')));
  assert.throws(() => direct.extractArchives(direct.parseEnvelope('<input id="baseCustomerArchives" value="[]">')));
});

test('ordinary base/private values model the observed 255-character server cap independently of UI limits', async () => {
  for (const group of ['baseCustomerArchives', 'privateCustomerArchives']) for (const char of ['x', '汉']) {
    for (const size of [20, 21, 128, 255, 256]) {
      const service = f.service(), request = service.context(true), session = await open(service, { requestContext: request });
      const before = await session.readMember(target.number), privateGroup = group.startsWith('private');
      const update = { AttributeKey: privateGroup ? 'attribute2' : 'attribute3', AttributeValue: privateGroup ? 'Private notes' : 'Notes', CustomerValue: char.repeat(size) };
      const body = privateGroup ? { customerNumber: target.number, updateAttributes: [update] }
        : { customer: direct.projectCustomer(before.customer), updateAttributes: [update] };
      const reply = await request.fetch(f.ORIGIN + '/CustomerReport/' + (privateGroup ? 'UpdateCustomerPrivateInfo' : 'UpdateCustomerBaseInfo'),
        { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' }, data: JSON.stringify(body), maxRedirects: 0, maxRetries: 0 });
      assert.equal(g.parseLossless((await reply.body()).toString()).result.successed, true);
      const after = await session.readMember(target.number);
      if (size <= 255) direct.verifyArchives(before.archives, after.archives, update, group);
      else assert.throws(() => direct.verifyArchives(before.archives, after.archives, update, group), { code: 'ARCHIVE_READBACK_MISMATCH' });
      if (char === '汉' && size === 255) assert.equal(Buffer.byteLength(update.CustomerValue), 765);
    }
  }
});

test('value and title JSON boundaries are distinct: 255 survives and 256 loses its final brace', () => {
  for (const size of [255, 256]) {
    const start = '{"note":"', end = '"}', value = start + 'x'.repeat(size - start.length - end.length) + end;
    assert.equal(value.length, size);
    for (const isTitle of [false, true]) {
      const sample = f.state(), stored = value.slice(0, 255);
      let readback;
      if (isTitle) {
        sample.definitions[0].attributeValue = stored;
        readback = direct.extractDefinitions(direct.parseEnvelope(`<script>var customerArchives = ${f.rawJson(sample.definitions)};</script>`))[0].attributeValue;
      } else {
        sample.archives.baseCustomerArchives[1].CustomerValue = stored;
        readback = direct.extractArchives(direct.parseEnvelope(f.archiveHtml(sample.archives))).baseCustomerArchives[1].CustomerValue;
      }
      if (size === 255) assert.deepEqual(JSON.parse(readback), JSON.parse(value));
      else { assert.notEqual(readback, value); assert.throws(() => JSON.parse(readback)); }
    }
  }
});
