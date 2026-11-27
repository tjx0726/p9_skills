'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parseCredentials, resolveCredentials, createTemplate, fillLogin } = require('../scripts/access.cjs');
const stores = 'master_account=FAKE-HQ\nmaster_password=FAKE-HQ-PASS\naccount1=FAKE-A\naccount1_password=FAKE-A-PASS\naccount2=FAKE-B\naccount2_password=FAKE-B-PASS';
const resolve = options => resolveCredentials({ runtime: {}, bindings: {}, localTexts: [stores], ...options });

test('legacy English/Chinese delimiters, BOM, quoted values and leading zeros survive', () => {
  const entries = parseCredentials('\uFEFF[门店测试]\n门店账号："000123"\n密码: \'FAKE=a:b：c#d\'\n工号 = 0007\n员工密码：FAKE-EMPLOYEE\nOTHER_KEY=ignored');
  assert.deepEqual(entries.get('门店测试.account'), ['000123']);
  assert.deepEqual(entries.get('门店测试.password'), ['FAKE=a:b：c#d']);
  assert.equal(entries.has('OTHER_KEY'), false);
  const access = resolve({ block: '门店测试', mode: 'staff', localTexts: [
    '[门店测试]\n账号：000123\n密码：FAKE-OWNER\n工号：0007\n工号密码：FAKE-EMPLOYEE',
  ] });
  assert.deepEqual(access, { mode: 'staff', account: '000123', staffId: '0007', password: 'FAKE-EMPLOYEE' });
});

test('store selection keeps head-office and per-store account/password pairs separate', () => {
  assert.equal(resolve({ block: 'master' }).account, 'FAKE-HQ');
  assert.equal(resolve({ block: 'account1' }).password, 'FAKE-A-PASS');
  assert.equal(resolve({ block: 'account2' }).password, 'FAKE-B-PASS');
  assert.throws(() => resolve({ block: 'account3' }));
  const chinese = '总店账号：FAKE-HQ\n主账号密码：FAKE-HQ-PASS\n门店2账号：FAKE-B\n门店2密码：FAKE-B-PASS';
  assert.equal(resolve({ block: 'account2', localTexts: [chinese] }).password, 'FAKE-B-PASS');
  assert.equal(resolve({ localTexts: [`POSPAL_STORE=account2\nPOSPAL_LOGIN_MODE=owner\n${stores}`] }).account, 'FAKE-B');
});

test('runtime precedes secure bindings, which precede authorized local values', () => {
  const localTexts = [`${stores}\naccount1_password=conflicting-unused-value`];
  const access = resolve({ block: 'account1', mode: 'owner', localTexts,
    runtime: { account1: 'FAKE-A', account1_password: 'FAKE-RUNTIME' },
    bindings: { account1_password: 'FAKE-BOUND' },
  });
  assert.equal(access.password, 'FAKE-RUNTIME');
  assert.equal(resolve({ block: 'account2', mode: 'owner', bindings: { account2_password: 'FAKE-BOUND' } }).password, 'FAKE-BOUND');
  assert.throws(() => resolve({ block: 'account2', mode: 'owner', runtime: { account2: 'FAKE-OTHER' } }));
  assert.throws(() => resolve({ block: 'account2', mode: 'staff',
    runtime: { account2: 'FAKE-OTHER' }, localTexts: [`${stores}\nstaff_id=0007\nstaff_password=FAKE-STAFF`] }));
});

test('employee mode does not need or select the owner password', () => {
  const localTexts = ['account2=FAKE-B\nstaff_id=0009\nstaff_password=FAKE-STAFF'];
  assert.deepEqual(resolve({ block: 'account2', localTexts }), {
    mode: 'staff', account: 'FAKE-B', staffId: '0009', password: 'FAKE-STAFF',
  });
  const both = [`${stores}\nstaff_id=0009\nstaff_password=FAKE-STAFF`];
  assert.throws(() => resolve({ block: 'account2', localTexts: both }), /ambiguous/);
  assert.equal(resolve({ block: 'account2', localTexts: both, expectedAccount: 'FAKE-B' }).mode, 'owner');
  assert.equal(resolve({ block: 'account2', localTexts: both, identityMode: 'staff' }).mode, 'staff');
  assert.throws(() => resolve({ block: 'account2', expectedAccount: 'FAKE-OTHER' }));
});

test('a unique legacy unsectioned store works without guessing a multi-store identity', () => {
  const text = '账号：FAKE-SINGLE\n门店密码：FAKE-OWNER\n工号：0007\n工号密码：FAKE-STAFF';
  assert.equal(resolve({ mode: 'owner', localTexts: [text] }).account, 'FAKE-SINGLE');
  assert.equal(resolve({ block: 'default', mode: 'staff', localTexts: [text] }).staffId, '0007');
  assert.throws(() => resolve({ mode: 'owner', localTexts: [`${text}\n${stores}`] }), /multi-store/);
  assert.throws(() => resolve({ block: 'account2', mode: 'owner', localTexts: [text] }));
});

test('placeholders, duplicate selected keys and conflicting files fail without echoing values', () => {
  for (const localTexts of [
    ['account1=<ACCOUNT>\naccount1_password=<PASSWORD>'],
    [`${stores}\naccount1_password=FAKE-DUPLICATE`],
    [stores, 'account1_password=FAKE-CONFLICT'],
  ]) {
    assert.throws(() => resolve({ block: 'account1', mode: 'owner', localTexts }), error => !/FAKE|<PASSWORD>/.test(error.message));
  }
  assert.equal(resolve({ block: 'account2', localTexts: [`${stores}\naccount1_password=FAKE-UNUSED-DUPLICATE`] }).account, 'FAKE-B');
  assert.throws(() => resolve({ block: 'account2', denied: true }), /reconnect/);
  const bindings = { get account2() { throw new Error('FAKE-SECRET'); } };
  assert.throws(() => resolve({ block: 'account2', bindings }), error => !error.message.includes('FAKE-SECRET'));
});

test('project conventional files work; placeholder creation never overwrites an existing file', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'p9-pospal-fake-'));
  try {
    const file = path.join(temp, '.env');
    assert.equal(createTemplate(file), true);
    assert.equal(createTemplate(file), false);
    assert.throws(() => resolveCredentials({ block: 'account1', mode: 'owner', runtime: {}, projectDir: temp }));
    fs.writeFileSync(file, stores);
    assert.equal(resolveCredentials({ block: 'account2', mode: 'owner', runtime: {}, projectDir: temp }).account, 'FAKE-B');
    const alternate = path.join(temp, 'env.txt');
    fs.writeFileSync(alternate, 'account2=FAKE-CONFLICT\naccount2_password=FAKE-ALTERNATE');
    assert.throws(() => resolveCredentials({ block: 'account2', mode: 'owner', runtime: {}, projectDir: temp }));
    assert.equal(resolveCredentials({ block: 'account2', mode: 'owner', runtime: {}, projectDir: temp, projectCredentialFile: file }).account, 'FAKE-B');
    assert.equal(fs.readFileSync(file, 'utf8'), stores);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});

test('in-process filling chooses the current password meaning and never submits', async () => {
  for (const mode of ['owner', 'staff']) {
    const actions = [];
    const page = {
      url: () => 'https://tenant.example.test/signin',
      getByText: label => ({ click: async () => actions.push(['mode', label]) }),
      getByPlaceholder: label => ({ fill: async value => actions.push([label, value]) }),
    };
    await fillLogin(page, { mode, account: 'FAKE-A', staffId: '0007', password: 'FAKE-PASS' }, { trustedOrigin: 'https://tenant.example.test' });
    assert.equal(actions[0][1], mode === 'staff' ? '工号登录' : '账号登录');
    assert.equal(actions.at(-1)[0], mode === 'staff' ? '请输入工号密码' : '请输入密码');
    assert.equal(actions.length, mode === 'staff' ? 4 : 3);
  }
  await assert.rejects(fillLogin({ getByText() { throw new Error('FAKE-SECRET'); } }, { mode: 'owner' }), error => !error.message.includes('FAKE-SECRET'));
});

test('an untrusted origin or a redirect on mode change stops before any credential fill', async () => {
  const access = { mode: 'owner', account: 'FAKE-A', password: 'FAKE-PASS' };
  for (const redirect of [false, true]) {
    let origin = redirect ? 'https://tenant.example.test' : 'https://wrong.example.test';
    let fills = 0;
    const page = {
      url: () => origin,
      getByText: () => ({ click: async () => { origin = 'https://wrong.example.test'; } }),
      getByPlaceholder: () => ({ fill: async () => { fills++; } }),
    };
    await assert.rejects(fillLogin(page, access, { trustedOrigin: 'https://tenant.example.test' }));
    assert.equal(fills, 0);
  }
  await assert.rejects(fillLogin({}, access, { trustedOrigin: 'http://tenant.example.test' }));
  await assert.rejects(fillLogin({}, access));
});
