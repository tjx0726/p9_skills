# Members, custom fields and Games

## Member lookup, creation, editing and deletion

Use known member APIs first: `/Customer/LoadCustomerSummary`, `/Customer/LoadCustomersByPage`
and `/Customer/FindCustomer` within the exact target store/sharing scope. Search only the
requested scope and independently inspect the matched detail. Member number, business
UID, row ID, phone and display name are different identifiers; do not act on a name-only
match. Keep credentials, unrelated personal details and other people's records out
of logs and committed artifacts. For an authorized query/export, return the specified
fields through the user's private output route or controlled destination; avoid
echoing raw responses or including extra member fields in progress messages.

- **Read:** inspect the current list/detail, sharing store and actual visible fields.
  Do not claim all members were searched without completing the required pagination.
- **Create:** check for an existing member first. Use the current form's required
  fields, level, ownership and store defaults. If the creation contract is already
  verified, use it directly; otherwise observe the normal create form under tier 2,
  then tier 3 only when needed. Do not guess a write endpoint. Do not fabricate a phone/email or clone
  another member's data. Reopen the result independently. Initial balance, points,
  card rights remain separate from basic creation. Apply the deployment-specific
  Games initialization rule below after confirming the current definition.
- **Edit:** query a fresh member and use the verified writable projection. Change only
  the authorized fields. Preserve number/UID, contact fields, remarks, level, birthday
  and lunar/calendar flags, salesperson attribution, custom base fields and private
  fields unless explicitly in scope. Do not send an empty example object as a real
  member. Level/expiry changes can affect discounts and entitlements; inspect those
  effects rather than assuming a cosmetic edit.
- **Delete:** confirm exact identity, shared-store scope, balances, points, coupons,
  remaining count-card uses and history. Use current authorized delete/archive
  controls/contract; do not guess whether deletion is reversible or removes history.
  When only the documented page route is known, observe it under the headless-then-
  Tabbit fallback, establish the request and return to API when possible. An
  explicitly designated test member may be cleaned up under the test policy, but
  real linked rights/stock/financial effects still need their own scope. A deletion
  blocker is a result to report, not a reason to clear balances or detach real records.

Query an independent list/detail after each write. Check requested changes and
protected fields; querying the pre-save object in memory is not verification. Member
CRUD and a recharge/refund/redemption are different actions. Use only the requested
web workflow; native checkout commands and old private API scripts are outside this skill.

Official [member management](https://blog.pospal.cn/kb/1177) documents creation under
`会员 → 会员资料 → 新增`, editing the selected member, and single deletion through
`编辑` then the lower-left trash icon. It documents no bulk deletion. These are
official navigation instructions, not proof that deletion was tested in this tenant.

## Text capacity, normal fields and exact readback

Use the API-supported field capacity rather than treating a textbox limit as the
server limit. The 2026-10-09/10 historical experiments established:

| Field | Observed UI limit | Verified web API behavior |
| --- | --- | --- |
| Ordinary remarks | 128 characters | English/common Chinese through 255 complete; 256 stored only the first 255 |
| Basic/private custom value | 20 characters | 20/21/128/255 complete for English and common Chinese; 256 stored only the first 255 |
| Custom-field title | 10 characters | English/common Chinese 255 complete; 256 truncated |

These requests could return HTTP 200 and business success despite truncation. At 255,
the common-Chinese value occupied 765 UTF-8 bytes. A 255-character JSON value/title
remained parseable; 256 lost its closing delimiter. Emoji/combining-character boundaries
were not verified. Do not extend these observations into a universal Unicode/byte rule.
The 30-definition quota was **shared by basic and private groups**; the 31st was
rejected. Do not consume quota or probe the limit as part of an ordinary task.

For remarks/base values use `POST /CustomerReport/UpdateCustomerBaseInfo` with real
JSON: the fresh projected `customer` and only intended `updateAttributes`. For a private
value use separate `POST /CustomerReport/UpdateCustomerPrivateInfo` with `customerNumber`
and its own `updateAttributes`. Do not route private fields or remarks through Games.
Read `GET /CustomerReport/CustomerDetail?number=…` afterward and compare the complete
`baseCustomerArchives` / `privateCustomerArchives` values and titles, not a success flag.
Re-read `/Customer/FindCustomer` for remarks and protected profile fields.

The historical customer projection carries `number`, `email`, `address`, `remarks`,
`qq`, `birthday`, `lunarYear`, `lunarMonthDay`, plus `customerExt.sex` and
`customerExt.lastBirthdayType`. Preserve supplied values; missing optional entries
map to null as in the verified sparse-return contract. Do not invent dates, empty
another field or reject every sparse/new profile. An unset birthday-type flag can
normalize to Gregorian `0`; detect/report this separately from actual date changes
and other profile edits. [Direct API](direct-api.md) describes the exact-scope review
result/authorization option; it never authorizes changing a real birthday implicitly.

## Discover the current Games definition

`GET /Customer/CustomerBaseSetting` reads current **basic-profile** definitions over
the same request session. Parse its `var customerArchives = […]` data without
evaluating scripts, or the applicable direct JSON array. Do not use a historical
definition export. For each definition parse the
`attributeValue` title string as JSON, then match the object's `title === "Games"`.
Require one match. Do not compare the complete raw string to `Games`, and do not
hard-code a former `attribute1`, definition ID, UID or account owner.

Bind the exact current definition UID, `attributeKey` and owning `userId` to the
selected member/store scope in memory. Preserve the **entire original title string**,
including schema, note, whitespace and future metadata. Historical title JSON carried
the 76-character schema. Its full string is the save row's `AttributeValue`; the
member's value goes in `CustomerValue`. Before writing, require a text basic field
(`attributeDataType=0`) and a live title `schema` with `type="string"`, `minLength=76`,
`maxLength=76` and the exact supported eight-key `pattern`. If absent, non-text or
incompatible, stop this write and inspect the schema change. The helper enforces this
at `gamesAttribute`, while retaining the original complete title string.

If editing the definition itself is requested, use its actual record `id` and owner
`userId` with the current form, preserving UID/key, group/type, required/editable flags
and all options. Do not substitute the current branch's store ID for the definition
owner, or delete/recreate the definition just to rename it. A missing/ambiguous or
legacy literal-title definition needs inspection; do not silently create a replacement.

## Exact value contract

The one supported value format is **76 ASCII characters**, with exactly these keys
in this order, lowercase names, a single `0` or `1`, and a final semicolon:

```text
pokemon=0;magic=0;yugioh=0;fab=0;elestrals=0;gundam=0;riftbound=0;digimon=0;
```

`1` means selected, `0` unselected. Reject unknown/duplicate/missing keys, reordered
keys, whitespace, other values or a missing final semicolon. Do not translate keys,
revive older misspellings or put a nested object in `CustomerValue`.

An absent/null/empty value is **unset**, distinct from the valid all-zero string.
For the user's configured P9 deployment, the 2026-10-10 standing rule requires an
explicit Games write for a **new** member: after confirming this deployment and the
current compatible definition, save specified interests, or save the complete all-zero
string when none were specified, then independently read it back. Preserve any already
established value. This default is specific to that confirmed P9 configuration; do
not apply it to another deployment merely because it has a field titled Games.
Do not bulk-initialize existing unset members. For a one-interest update, parse the current
complete value, change that one bit and preserve seven others. If unset, obtain the
initialization intent; the helper requires `initializeUnset: true` to create a baseline.
That switch is appropriate for the confirmed P9 new-member rule, not an existing
member's unset value without the necessary initialization scope.
If malformed, do not repair by silently replacing it with all zero.

## Authorized web save and independent readback

The runnable `openSession(...).updateGames(...)` flow in [Direct API](direct-api.md)
implements the following sequence and independent archive checks. It reuses the
normal web business requests; no browser process is required for this known contract.

Use the verified direct API for the full 76-character value. The historical
`maxlength=20` textbox cannot represent it, but that is not the API's capacity.
No page opening or DOM-limit modification is needed for the known contract. Observe
the same business form only if its schema/contract drifts, under tier 2 then tier 3.
Do not use expired cookies, copied tokens, native/private API credentials or another
account to bypass the UI's permissions.

Historical normal web behavior:

| Operation | Contract established in historical evidence |
| --- | --- |
| Basic custom value | `POST /CustomerReport/UpdateCustomerBaseInfo`, **application/json**, containing the current form's `customer` projection and `updateAttributes` |
| One Games update row | `{AttributeKey: currentDefinition.attributeKey, AttributeValue: currentDefinition.attributeValue, CustomerValue: complete76CharacterString}` |
| Private custom values | Separate `POST /CustomerReport/UpdateCustomerPrivateInfo`; not needed for a Games edit |
| Success indicator | `result.successed`, followed by independent readback; not success from HTTP status alone |

Check current definition/data/ownership against this known contract; do not reopen
the editor on every update. For an unknown/drifting contract, observe its normal
form before further writing. Preserve
the freshly read base data required by that handler; do not send a blank scaffold or
the whole unprojected lookup DTO. Send only the intended custom-field update row
where the live contract supports it. Leave other basic custom fields and private
fields untouched. Do not invoke the private-field save as part of Games.

Immediately before submitting, re-read the member and definition and compare them
with the preparation snapshot. Rebase/stop if another edit changed relevant or
protected values. This is a conflict check, not a claim of server-side atomic locking.
Submit once; on an uncertain response, read the member before considering any retry.

Make a **new** member-detail/current data request after saving. Retrieve raw response
text and parse IDs losslessly before any numeric coercion. Verify the full 76-character
string and intended bit, seven preserved bits, complete title string and field
binding. Compare other base/private values against the private baseline, allowing
only expected update timestamps. Do not expose those comparison values. A truncated
textbox preview or an unchanged JS object is insufficient. If full readback is not
available, report the result as unverified and do not overwrite it with a second save.

## Pure local helper

`scripts/games.cjs` exports `idString`, `parseLossless`, `findGamesDefinition`, `parseGames`,
`encodeGames`, `setInterest` and `gamesAttribute`. It performs no IO, browser access,
network calls or logging. Require it inside the authorized session's local process;
keep member payloads in memory. Do not pass them as command-line arguments or print
the results. `parseLossless(rawText)` retains unsafe integer tokens as exact decimal
strings using Node.js 24's JSON reviver source. It cannot recover an ID already
rounded by `JSON.parse`/`response.json()`; reacquire raw text in that case.

Keep exact decimal strings in memory. If the verified save contract requires numeric
JSON tokens, use a supported lossless serializer/raw-JSON primitive for those decimal
IDs, never `Number(...)`. Do not assume a quoted string and numeric token are accepted
interchangeably by every deployment.

Synthetic example (not a live request):

```javascript
const g = require('./scripts/games.cjs');
const definitions = g.parseLossless(rawDefinitionResponseText);
const definition = g.findGamesDefinition(definitions);
const next = g.setInterest(currentValue, 'magic', 1);
const updateAttributes = [g.gamesAttribute(definition, next)];
// Keep this in memory; wrap it in the freshly verified web form's customer projection.
```

The definition array must be extracted from the live response's actual envelope.
The helper rejects ambiguous/non-basic definitions and unsafe already-parsed IDs.
Test from the skill root with `node --test tests/games.test.cjs` using bundled fake
data only. The helper does not create a definition, save a member or validate a login.
