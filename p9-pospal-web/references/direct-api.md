# Direct business API execution

Use the applicable verified web contract first. A current authorized request channel
or an isolated memory-only HTTP session is sufficient; do not launch a browser or
reopen an editor for every known read/save. The complete fallback order is in
[Access and scope](access-and-scope.md#execution-priority-and-session-identity).

## Establish or reuse a session

Prefer an existing authorized context's request channel, preserving its identity.
For Playwright, `browserContext.request` / `page.request` share that context's cookies;
an independent `request.newContext()` has its own in-memory cookie storage and does
not require browser launch. See the official [APIRequestContext documentation](https://playwright.dev/docs/api/class-apirequestcontext)
and [request factory](https://playwright.dev/docs/api/class-apirequest#api-request-new-context).
An agent/fingerprint browser's equivalent channel is usable when its tool supports
the same authorized session and encoding; do not copy cookies through logs or files.

The historical owner protocol is executable without a browser:

1. Create a fresh in-memory CookieJar/request context for the trusted HTTPS tenant.
   Resolve only the selected owner block through `access.cjs`, retaining secrets in
   that same private process. Do not replace an already authorized user's identity.
2. `GET /account/signin`, retaining the server's cookies in memory.
3. `POST /account/SignIn?noLog=` as URL-encoded form: `userName`, `password`, empty
   `returnUrl` and `screenSize` (ordinary screen metadata, not a signature).
4. Require JSON `successed === true`. Resolve its `msg` next hop against the trusted
   origin, accept only same-origin HTTPS and visit it with the same cookies. Stop on
   rejection, verification/WeChat requirements, a foreign destination or session expiry.
   Do not retry a password through another tool. Continue a genuine interactive
   challenge only through the normal tier-2 web flow, with tier 3 reserved as documented.
5. Independently `GET /Setting/Info`; match `var userId = '…'` to the expected
   session/store mapping from authorized project/user context. Do not learn an
   arbitrary logged-in ID and declare it the intended target. Keep owner identity,
   field owner and cross-store query scope separate.

A member being invisible in one store is a scoped business result, not proof that
login failed. Historical multi-account queries included exactly that case. Stop that
denied lookup; do not select another identity or widen the query to make it succeed.

Employee independent HTTP login was not verified. Use normal employee web login
when needed, then pass that same context's request channel. No client `X-Sign`, appId
or native private API credentials belong in this verified owner web protocol. Other
business endpoints can require additional protections; a denial never permits removing them.

## Request encoding and response handling

- URL-encoded arrays use repeated keys, for example `userIds[]=a&userIds[]=b`.
  `formEncode` accepts pair lists, or arrays under explicit `[]` keys. A field such
  as `categorysJson` / `tableUids` is already a **JSON string**; pass `'[]'` as one
  form value rather than silently turning it into repeated keys.
- Product single-save uses a form containing `productJson` as JSON text. Member
  base/private saves use actual **application/json** objects. Do not conflate them.
- `parseEnvelope` supports bare JSON arrays and named HTML fields such as `contentView`,
  `view`, `mainTableView`, `historySummaryView` and `summaryView`. Parse only the named
  HTML content; do not treat the whole JSON serialization as a page.
- Capture raw text before parsing IDs. `games.parseLossless` preserves large integer
  tokens as exact decimal strings. Do not use `response.json()` first or coerce a
  business UID into `Number`. A form's record `id`, business UID and store ID differ.
- Requests keep cookies in the context, disable automatic retries/redirects and stop
  on rejected access or changed origin. The helper bounds response size and parses
  UTF-8 strictly. It neither evaluates page scripts nor discovers arbitrary endpoints.

## Bundled executable helper

`scripts/direct.cjs` requires Node.js 24+ and an injected Playwright-compatible
APIRequestContext (or installed Playwright 1.46+ request factory, for explicit
`maxRetries:0` support). It uses `access.cjs`
for independent owner credentials and `games.cjs` for exact IDs/metadata/value checks.
It has no hard-coded tenant, account, member, cookie, browser instance or live call
on import. It never launches a browser, exports storage state or logs a response.

Resolve helper paths from the installed skill root; the examples assume that root
as the working directory. `projectDir` still identifies the separately authorized
project credential location. Use the installed request library in a private local process with tracing, credential
debug logging and raw-result printing disabled. Identifiers/settings below are
already authorized in-memory variables, not values to paste into CLI arguments.

```javascript
const { request } = require('playwright'); // Installed request library; no launch().
const { openSession } = require('./scripts/direct.cjs');
const session = await openSession({
  origin: independentlyTrustedTenantOrigin,
  expectedUserId: expectedSessionStoreId,
  requestFactory: request,
  accessOptions: { block: selectedStoreBlock, mode: 'owner',
    projectDir: authorizedProjectRoot, projectCredentialFile: establishedCredentialFile,
    bindings: authorizedSecureBindings },
});
try {
  const product = await session.readProduct(requestedProductRecordId);
  // Keep this result private; return only the requested fields through the approved route.
} finally { await session.close(); }
```

For an existing owner/employee session, pass `requestContext: authorizedContext.request`
instead of a factory/access options. No credentials or login submission are then
needed; `close()` does not dispose the borrowed context. A normal read checks both
the returned product `id` and `userId`. `readMember(number)` also reconfirms the store.

For the requested one-interest update, use that session:

```javascript
const result = await session.updateGames({
  number: requestedMemberNumber, key: requestedInterestKey, bit: requestedBit,
  initializeUnset: explicitInitializationScope,
});
// Check result.verified / reviewRequired; do not print member payloads or retry a save.
```

`updateGames` reads the current definition and fresh member/detail archives, validates
the full title/schema/key/owner and 76-character value, then re-reads before the save
to detect conflicts. It sends one normal base-profile JSON save and obtains fresh
`CustomerDetail`, definition and profile responses afterward. It compares both
archive groups and protected fields, not the textbox preview or HTTP success.
An unchanged interest is a verified no-op with no save.

Sparse profiles are supported: the historical writable optional fields map missing
values to `null`; existing values and dates are preserved. The known **unset birthday
type → Gregorian `0`** normalization is detected separately. If it occurs without
specific authorization, the result is `verified:false`, `changed:true`,
`reviewRequired:true` with `sideEffects:['unsetBirthdayTypeBecameGregorian0']` and
further writes blocked. Report that exact side effect; do not invent a birthday or
automatically restore/re-save. If the current task expressly permits that exact flag
normalization, pass `allowBirthdayTypeNormalization:true`. Actual birth-date or other
field changes still fail verification. Missing optional fields alone do not block Games.

A timeout, malformed/truncated reply or business failure after submission is followed
by fresh readback, never another write. A fully matching result can be reported as
verified with `responseUncertain:true`; otherwise writes remain blocked. Do not switch
to a browser and click Save to resolve uncertainty. If readback itself is unavailable,
report the unknown outcome and pause dependent mutation.

## Scope of the helper and fallback

The helper executes owner bootstrap, store confirmation, exact product read, member
read and a Games-only update. It does not invent a general writer, employee HTTP login,
native API adapter, crawler, stock order or promotion contract. Other verified domain
contracts below can use the same authorized request context and encoding functions.
For an unknown/drifting field/endpoint, inspect the same business form under the
headless/Tabbit priority, establish its request and response, then return to direct
API. Use the UI itself only for interactions or branches that require it.

Run `node --test tests/access.test.cjs tests/games.test.cjs tests/direct.test.cjs`
from the skill root. The bundled fixtures reconstruct stored definition/hidden-input
archive schemas with synthetic data and no network connection. Their boundary model
is not a new production capacity claim; see [Members](members-and-games.md) and
[Evidence](evidence-and-validation.md) for historical versus current validation.
