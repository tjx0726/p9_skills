'use strict';

const fs = require('node:fs');
const path = require('node:path');

function fail(message) { throw new Error(message); }
function present(value) {
  return typeof value === 'string' && value.trim() !== '' &&
    !/^(<[^>]+>|\{\{.*\}\}|REPLACE_.*|YOUR_.*)$/.test(value.trim());
}

function canonical(key) {
  const name = key.replace(/\s+/g, '').toLowerCase();
  if (/^pospal_(url|store|login_mode)$/.test(name)) return name.toUpperCase();
  const aliases = {
    '账号': 'account', '门店账号': 'account', '密码': 'password', '门店密码': 'password',
    '总店账号': 'master_account', '主账号': 'master_account',
    '总店密码': 'master_password', '主账号密码': 'master_password',
    '工号': 'staff_id', '员工工号': 'staff_id',
    '工号密码': 'staff_password', '员工密码': 'staff_password',
  };
  if (aliases[name]) return aliases[name];
  const numbered = /^(?:门店|子账号)(\d+)(账号|密码)?$/.exec(name);
  if (numbered) return `account${numbered[1]}${numbered[2] === '密码' ? '_password' : ''}`;
  if (/^account\d+密码$/.test(name)) return name.replace('密码', '_password');
  return /^(master_account|master_password|account\d+(?:_password)?|account|password|staff_id|staff_password)$/.test(name)
    ? name : null;
}

function parseCredentials(text) {
  const entries = new Map();
  let section = '';
  for (let line of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith('#') || line.startsWith(';')) continue;
    if (/^\[[^\]]+\]$/.test(line)) { section = line.slice(1, -1).trim(); continue; }
    const delimiter = line.search(/[=:：]/);
    if (delimiter < 0) continue;
    const label = line.slice(0, delimiter).trim();
    let value = line.slice(delimiter + 1).trim();
    const key = canonical(label);
    if (!key && !value) { section = label; continue; }
    if (!key) continue;
    if (value.length >= 2 && ['"', "'"].includes(value[0]) && value.at(-1) === value[0]) {
      value = value.slice(1, -1);
    }
    const qualified = section && ['account', 'password', 'staff_id', 'staff_password'].includes(key)
      ? `${section}.${key}` : key;
    entries.set(qualified, [...(entries.get(qualified) || []), value]);
  }
  return entries;
}

function resolveCredentials({ block, mode, identityMode, expectedAccount,
  runtime = process.env, bindings = {}, projectDir = process.cwd(),
  credentialFile, projectCredentialFile, localTexts, denied = false } = {}) {
  if (denied) fail('Access was denied or rejected; use the approved reconnect route.');
  let locals;
  function localValue(key) {
    if (!locals) {
      let texts = localTexts;
      if (!texts) {
        const selected = credentialFile || runtime.POSPAL_CREDENTIALS_FILE || projectCredentialFile;
        const files = selected ? [path.resolve(projectDir, selected)]
          : [path.join(projectDir, '.env'), path.join(projectDir, 'env.txt')];
        texts = files.flatMap(file => {
          try { return [fs.readFileSync(file, 'utf8')]; }
          catch (error) {
            if (error.code === 'ENOENT') return [];
            fail('Cannot read the authorized credential source; check access privately.');
          }
        });
      }
      locals = texts.map(parseCredentials);
    }
    const values = locals.flatMap(entries => {
      const records = entries.get(key) || [];
      if (records.length > 1) fail('Duplicate keys in the selected credential block.');
      return records.filter(present);
    });
    if (new Set(values).size > 1) fail('Authorized local sources conflict for the selected block.');
    return values[0];
  }
  function get(key) {
    if (present(runtime[key])) return { value: runtime[key], source: 'runtime', key };
    let bound;
    try { bound = bindings[key]; }
    catch { fail('Secure binding access failed; use the approved reconnect route.'); }
    if (present(bound)) return { value: bound, source: 'binding', key };
    return { value: localValue(key), source: 'local', key };
  }
  block ||= get('POSPAL_STORE').value;
  if (!block && get('account').value) block = 'default';
  if (!block) fail('Select the target store block or provide an established store mapping.');
  if (block === 'default') {
    localValue('account');
    const names = new Set([...Object.keys(runtime), ...Object.keys(bindings),
      ...locals.flatMap(entries => [...entries.keys()])]);
    if ([...names].some(key => /^(master_account|account\d+|.+\.account)$/.test(key) && get(key).value)) {
      fail('Unsectioned credentials cannot identify a store in a multi-store source.');
    }
  }
  const accountKey = block === 'default' ? 'account' : block === 'master' ? 'master_account'
    : /^account\d+$/.test(block) ? block : `${block}.account`;
  const passwordKey = block === 'default' ? 'password' : block === 'master' ? 'master_password'
    : /^account\d+$/.test(block) ? `${block}_password` : `${block}.password`;
  const account = get(accountKey);
  if (!account.value) fail('Store account is missing; sign in privately or fill the local template.');
  if (expectedAccount && account.value !== expectedAccount) fail('The selected account does not match the established identity.');
  mode ||= identityMode || get('POSPAL_LOGIN_MODE').value;
  const scopedStaff = key => {
    if (!/^account\d+$/.test(block) && !['master', 'default'].includes(block)) {
      const scoped = get(`${block}.${key}`);
      if (scoped.value) return scoped;
    }
    return get(key);
  };
  function checkLocalAccount(credential) {
    if (credential.source === 'local' && account.source !== 'local') {
      const localAccount = localValue(accountKey);
      if (localAccount && localAccount !== account.value) fail('Local credentials belong to a different store account.');
    }
  }
  let ownerPassword, staffId, staffPassword;
  if (!mode) {
    ownerPassword = get(passwordKey);
    if (expectedAccount && ownerPassword.value) mode = 'owner';
    else {
      staffId = scopedStaff('staff_id');
      staffPassword = scopedStaff('staff_password');
      const staffReady = Boolean(staffId.value && staffPassword.value);
      if (ownerPassword.value && !staffReady) mode = 'owner';
      else if (!ownerPassword.value && staffReady) mode = 'staff';
      else fail('Login identity is missing or ambiguous; select owner or staff without sharing secrets.');
    }
  }
  if (mode === 'owner') {
    ownerPassword ||= get(passwordKey);
    if (!ownerPassword.value) fail('Owner password is missing; use private sign-in or the local template.');
    checkLocalAccount(ownerPassword);
    return { mode, account: account.value, password: ownerPassword.value };
  }
  if (mode === 'staff') {
    staffId ||= scopedStaff('staff_id');
    staffPassword ||= scopedStaff('staff_password');
    if (!staffId.value || !staffPassword.value) fail('Employee credentials are missing; use private sign-in or the local template.');
    checkLocalAccount(staffId);
    checkLocalAccount(staffPassword);
    if (staffPassword.source === 'local' && staffId.source !== 'local') {
      const localStaffId = localValue(staffId.key);
      if (localStaffId && localStaffId !== staffId.value) fail('Local password belongs to a different employee identity.');
    }
    return { mode, account: account.value, staffId: staffId.value, password: staffPassword.value };
  }
  fail('Login mode must be owner or staff.');
}

function createTemplate(file) {
  const template = fs.readFileSync(path.join(__dirname, '../assets/pospal.env.template'), 'utf8');
  try { fs.writeFileSync(file, template, { flag: 'wx', mode: 0o600 }); return true; }
  catch (error) {
    if (error.code === 'EEXIST') return false;
    fail('Cannot create the private placeholder file; choose an accessible private location.');
  }
}

async function fillLogin(page, access, { trustedOrigin } = {}) {
  if (!access || !['owner', 'staff'].includes(access.mode) || !present(access.account) ||
      !present(access.password) || (access.mode === 'staff' && !present(access.staffId))) {
    fail('Resolve complete credentials in the same private process before filling.');
  }
  try {
    const trusted = new URL(trustedOrigin);
    if (trusted.protocol !== 'https:' || trusted.username || trusted.password ||
        trusted.pathname !== '/' || trusted.search || trusted.hash) {
      fail('An independently trusted HTTPS origin is required.');
    }
    const checkOrigin = () => {
      if (new URL(page.url()).origin !== trusted.origin) fail('The login origin changed.');
    };
    checkOrigin();
    await page.getByText(access.mode === 'staff' ? '工号登录' : '账号登录', { exact: true }).click();
    const fill = async (label, value) => {
      checkOrigin();
      await page.getByPlaceholder(label, { exact: true }).fill(value);
    };
    await fill('请输入账号', access.account);
    if (access.mode === 'staff') {
      await fill('请输入员工工号', access.staffId);
    }
    await fill(access.mode === 'staff' ? '请输入工号密码' : '请输入密码', access.password);
  } catch { fail('Login form filling failed; inspect the current form privately.'); }
}

module.exports = { parseCredentials, resolveCredentials, createTemplate, fillLogin };
