# Access, identity, permissions and scope

## Execution priority and session identity

Use this single default order:

1. **Verified direct business API.** Reuse an authorized agent/fingerprint/Playwright
   session's request channel, preserving its identity, or establish the known owner
   session in an independent in-memory CookieJar / `request.newContext()`. No browser
   launch, page opening, mouse input or cookie export is needed for a known contract.
2. **Configured lightweight headless browser.** Use an installed, suitable Obscura,
   CloakBrowser, Playwright headless or equivalent route for employee login, WeChat,
   verification challenges, unresolved identity, unknown/drifting contracts, UI-only
   branches or necessary visual checks. Do not assume these packages are installed,
   benchmark them without evidence or install all of them. Observe the same business
   form read-only until a write contract and scope are established.
3. **Tabbit browser control.** Use only if the first two tiers cannot complete that
   step, or the user explicitly requests Tabbit. Load its installed skill before use.

Honor an explicitly selected profile/tool. Once a browser establishes a session or
clarifies a contract, return to tier 1 where possible. A permission/credential rejection
does not authorize another channel, identity or guessed endpoint. An uncertain write
must be read back before any further mutation; do not save once per tier.

Do not diagnose or start Tabbit for a task that can be completed through the first
two tiers. A tool-registration error is not a login/permission verdict. Do not print
profile IDs, debugging URLs, ports, browser instance inventories or session artifacts.

Enter through the user's authorized tenant or the [official PosPal site](https://www.pospal.cn/).
Historical work used `https://beta43.pospal.cn`; that is evidence of one deployment,
not a universal URL or authorization to select that tenant. Verify HTTPS and the
destination before entering secrets. Follow the official site's backend link when
the correct tenant entry is unknown.

Before a task, independently read `/Setting/Info` and bind its identity/store ID to
the expected target in memory. A known API's scoped result or refusal establishes
its actual access outcome; opening its menu is not a prerequisite. Use a browser
only if that identity cannot be reconciled or the step needs interaction. Do not
treat login account, head office, field owner and operational store as interchangeable.
Recheck after a store/session change. Login success is not proof of edit or cross-store rights.

Use [Direct API](direct-api.md) for the owner login sequence and request helper.
Independent employee HTTP login is unverified: use normal employee web login under
tier 2 (tier 3 only when necessary), then reuse that same context's request channel.

## Login modes

Public login-page inspection on 2026-11-27 verified these two modes and placeholders:

| Mode | Visible input sequence | Credential meaning |
| --- | --- | --- |
| `账号登录` | `请输入账号`, `请输入密码` | Store account and its password |
| `工号登录` | `请输入账号`, `请输入员工工号`, `请输入工号密码` | Store account, employee job ID and employee password |

The same password control changes meaning when the mode changes. Select the mode
first, then locate controls by the current label/placeholder and inspect the form.
Do not enter the owner's password into the employee-password field. Historical
successful logins cover owner mode; switching the employee form was verified without
submitting employee credentials. Employee login success and rights require a live check.

Use private same-process HTTP credentials/bindings without displaying values. When
interactive login is actually needed, use secure browser filling. If the available tool
would echo a secret in call arguments or logs, use a private user sign-in handoff or a
secure tool binding instead. Captchas, MFA, lockouts and rejected credentials go to
the approved sign-in/reconnect route; do not try other account blocks automatically.

## Read store information

For **current-store details**, `GET /Setting/Info` is the established direct read.
Match its store ID to the intended session/store, then privately return only the
requested fields. Parse the returned markup/data in memory; a page visit is a fallback,
and no save is needed to inspect details.

For a **visible chain-store list**, reuse the established selector data request
`/Account/LoadSubStoresWithGradeDDLJson`, with
`withParent` when the selector included the parent store. Use the known request
contract and returned scope; inspect the selector only if that contract is unknown
or changed. Preserve exact IDs in memory. Verify which entries can
actually be opened. A dropdown is evidence of visible choices, not a complete
organization roster or proof of cross-store read/write rights. Recheck identity and
permissions after a requested store switch.

## Named settings and credential sources

Do not require a new settings system. The selected session can supply access; for a
new login resolve only the target block and mode. Reuse established identity/store
mapping without asking again. If a known store account matches an existing owner
block and no employee identity was requested, use that owner identity. Infer the
mode when only one credential set is available; clarify only when both modes are
usable and there is no established identity. These are supported names, not values:

| Entry | Purpose and requirement |
| --- | --- |
| `POSPAL_URL` | Optional authorized HTTPS entry URL; otherwise use the selected tenant/session or official entry |
| `POSPAL_STORE` | Optional credential block/section; map a display alias through existing project context. The current request takes precedence. |
| `POSPAL_LOGIN_MODE` | Optional `owner` / `staff`; reuse an established identity or infer the sole viable mode, clarifying only an actual ambiguity |
| `POSPAL_CREDENTIALS_FILE` | Optional runtime path to an explicitly selected private credential file; otherwise reuse the project's established file convention |
| `master_account`, `master_password` | Head-office block, only when that is the requested identity |
| `account1`, `account1_password`, `account2`, `account2_password`, `accountN`, `accountN_password` | Existing per-store blocks; `N` denotes the actual selected block number, not a literal variable name |
| `staff_id`, `staff_password` | Employee credentials for the explicitly selected store; required only for employee mode |

The environment and authorized secret manager/vault may expose these same names.
Resolve each declared entry in this order:

1. Check its named runtime environment entry. Return availability only, never values.
2. If absent, use that named entry from the authorized secret manager, vault or account
   connection through the host's secure binding.
3. If absent/unavailable and local fallback is allowed, use an explicitly selected
   file, then the project's already authorized credential-file convention, otherwise
   the current workspace root `.env` / `env.txt`. Existing PosPal project instructions
   can point to a sibling `PosPalTouch Custom` project; resolve that established path
   instead of asking the user to select it again. Never crawl directories for secrets.
   A runtime value wins over a local value. A denial or rejected configured credential
   stops this path; it is not permission to fall back to another credential source.

Keep a store account and password in their selected block; an `account1` password
must not be borrowed for `account2`. Do not assume a block number identifies a known
store. Confirm the authenticated store. Employee mode uses that store's account
and `staff_id` / `staff_password`; it does not need the owner's password.

Accept an existing local file as UTF-8 data with an optional BOM. Split on the first
`=`, `:` or `：`, not later delimiters inside a value. Accept quoted values and legacy
Chinese store sections (`[section]` or an empty heading) using labels such as `账号` / `密码`,
`门店账号` / `门店密码`, `工号` / `员工工号` and `工号密码` / `员工密码`.
Preserve section boundaries and exact strings, including leading zeros, punctuation
and Unicode. Never execute/source the file. Do not split a password on every `=` or
infer labels from their secret values. Duplicate keys or ambiguous sections require
only a store/section clarification; never show the conflicting values in chat.

## Missing setup

Check the declared runtime/secure sources and existing session first. If credentials
are missing, copy the bundled
[placeholder template](../assets/pospal.env.template) to the project's established
private settings location or a selected private directory outside the skill package.
An ignored workspace credential file is allowed; confirm it is ignored before private
filling. The template contains no working values.
Tell the user to fill it privately, keep only needed store blocks and retain their
existing multi-store format if already present. Do not overwrite an existing file.
Do not add the completed file, screenshots of it or session cookies to the package.

Example Chinese guidance: “请在已约定的安全设置或本地凭据文件里私下配置对应门店；若本次需要员工、
微信或验证码交互，再在选定浏览器里登录。没有凭据文件时我可以先创建只含占位符的模板。只需告诉我仍缺少的门店别名；
不要在聊天里发送账号、密码或验证码。”
After secure setup is confirmed, recheck availability and live identity. Work such as
offline formatting or guide authoring can continue without credentials.

## Same-process access helper

The optional `scripts/access.cjs` uses Node.js 24+ standard library. It does not print,
submit login or open a browser. `resolveCredentials` checks runtime, secure bindings
and authorized local data in order, filters the selected block, and returns values
**only inside that process**. `bindings` is an in-memory object populated by the host's
authorized secure binding, not a secret pasted into code. `block` is `master`, an
existing `accountN`, or a named local store section. Map a user's alias to that block
using established project/session context. `expectedAccount` is an optional already
known account kept in memory; it is not a request for an account value in chat.

A legacy file with one unsectioned `账号` / `门店密码` pair is supported as `default`,
including its `工号` / `工号密码`. It may be selected without a block only when no
other account blocks exist. Never use that unsectioned pair to guess a multi-store
mapping. Local `POSPAL_STORE` / `POSPAL_LOGIN_MODE` are actually read by the resolver;
use the block key or existing section name, not an unmapped display alias.

For direct owner access, pass these options to `openSession` in [Direct API](direct-api.md).
The following `fillLogin` example applies only to a required tier-2 interactive step
or tier-3 Tabbit-equivalent supported input, not every login or operation.
Use an already authorized Playwright-compatible `page` whose current origin/form
has been verified. Disable tracing, input-value logging, network credential capture
and filled-form screenshots before handling secrets. If the tool cannot suppress
secret recording, use private manual sign-in or a supported secure binding instead.

```javascript
const { resolveCredentials, fillLogin } = require('./scripts/access.cjs');
const access = resolveCredentials({
  block: selectedStoreBlock,
  identityMode: establishedIdentityMode,
  expectedAccount: knownAccountInMemory,
  bindings: secureBindings,
  projectDir: authorizedProjectRoot,
  projectCredentialFile: establishedProjectCredentialFile,
});
await fillLogin(page, access, { trustedOrigin: independentlyTrustedTenantOrigin });
// Submit the observed login form only when authorized; then verify fresh session identity.
```

Execute this within the browser's private local runtime; do not interpolate values
into CLI arguments, tool calls, generated scripts, console output or returned REPL
objects. Let the invocation finish with no credential-bearing result. `fillLogin`
chooses the proper mode and password meaning but intentionally does not submit.
The trusted HTTPS origin must come from the authorized tenant configuration or user
selection, not merely be copied from whatever page happens to be open. `fillLogin`
checks it initially and again after mode selection before every value is filled.
The helper cannot prove authentication or decide a store's business permissions.

If all required sources are missing, `createTemplate(privateFilePath)` creates the
bundled placeholder content using exclusive creation and returns only a boolean;
it never overwrites a file. Use a private location outside the distributable package.
For an established ignored workspace credential file, confirm it is ignored before
private filling. On Windows confirm suitable account-only file access: the POSIX
mode argument is not a Windows ACL guarantee. Do not create a new credential file
to bypass a denial. Run fake-data checks with `node --test tests/access.test.cjs`.

## Action scope and tests

Apply the current user's instructions and existing account permissions. Once a
specific business change is authorized, carry out its required form submission and
verification without a second generic confirmation. Missing target stores, units or
affected non-test objects are real scope questions; historical defaults from another
project do not answer them.

The user permits testing clearly designated `临时`, `temp`, `test` or equivalent
objects. Use an unambiguous name/prefix and verify the object is intended for testing;
a substring in a real customer's name does not make it a test object. Test permission
covers related test-only create/edit/delete and reversible trials within the requested
workflow. Do not rename a real object to acquire test permission.

The user designates `void` as the test payment method, excluded from store accounts.
If a requested web test needs payment, select the current exact `void` option and
verify that the tenant's payment record and amount match the test. This does not
remove inventory deductions, coupon/count-card consumption, member balances or
relationships to real objects. Check those effects separately. A missing `void`
option is not permission to substitute cash, bank payment, balance or a real refund.

Before testing, identify every related stock item, member entitlement, coupon rule,
store and payment record. Test labels do not authorize changes to linked non-test
objects, general ledger settings, bulk customer lists, public campaigns or staff rights.
Use existing authorization for those effects, or ask for the precise missing scope.
Retain audit history; cleanup means the authorized compensating action, not erasing it.

## Discover other visible modules

For known modules use the established scoped API response/denial first. For unknown
modules, inspect navigation/search under tier 2, then tier 3 only when needed. Typical
families include stores, product/category/supplier/unit metadata, purchasing,
inventory/stocktake/loss, transfers, members/levels/custom fields, promotions/cards,
reports, employee roles, store settings and online channels. This is a discovery list,
not a claim that all tenants expose them or that every visible action is authorized.

For each requested module record: visible menu name, store scope, readable list/detail,
available create/edit/confirm/delete controls, blocked controls and verification state.
Read-only inspection is enough to establish a form exists. Only a requested isolated
test or authorized business operation can establish a write succeeds. Do not submit
forms merely to enumerate capabilities. Do not alter permissions to reveal a menu.

Third-party coupons and courses were outside an older API investigation. That history
does not disable owned coupons, independent count cards or discovery of currently
visible web modules. A new visible module follows the current task, role and live
form; do not invent an endpoint or silently broaden the operation into native checkout.
