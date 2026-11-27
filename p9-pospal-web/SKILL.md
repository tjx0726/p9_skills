---
name: p9-pospal-web
description: >-
  Provide reusable PosPal web back-office operations as a foundational skill for
  higher-level P9 workflows and direct user tasks. Prefer verified business APIs,
  then a configured lightweight headless browser, then Tabbit control when needed.
  Load as a skill dependency when another workflow needs store and permission
  checks, products and barcodes, purchasing and stock transfers, members and Games
  interests, price schedules, promotions, coupons and count cards
  (底层技能、技能依赖、银豹网页后台、门店权限、商品规格、采购入库、调货、会员兴趣、调价、优惠券、次卡).
  Scope is the web back office; native checkout automation is separate.
---

# P9 PosPal Web

## Purpose and language

Use the account's existing permissions to complete the requested web task and verify
the resulting business records. Creating, reading or installing this skill does not
request a business transaction. Accept English and Chinese; use the user's requested
output language, otherwise the primary language of the request. Preserve identifiers,
field names and menu labels. Use the same workflow in either language.

## Reuse by higher-level skills

Business workflows can declare `p9-pospal-web` as a required dependency for their
PosPal web operations. The caller loads the installed skill through host discovery
or explicit `$p9-pospal-web` invocation, then reads only the relevant references.
Install the dependency separately in the same host; if it is required but unavailable,
pause the affected step and use the host's skill setup route.
Pass the authorized stores, operation, exact objects/fields/quantities and task scope,
plus non-secret project context. Reuse the existing request/session reference inside
the private runtime; do not put credentials or cookies in a shared manifest.

Keep business selection and domain rules in the caller. Reuse this skill's access,
API/browser priority, contracts and independent verification rather than copying
them into each business skill. Return the scoped verified result, side effects and
unresolved outcomes; the caller checks them before its next dependent step. An
uncertain write remains paused across skill boundaries and is never replayed by the
caller. A dependency does not extend the user's authorization or account permissions.

## Inputs and prerequisites

- Required for operations: the intended action, target store or stores, target objects
  and relevant quantities or field changes. Complete independent work before asking
  for a missing non-sensitive detail. Do not infer a receiving store from a prior task.
- Required: an authorized same-origin request session or the verified owner HTTP
  login contract, target store mapping and the operation's applicable business contract.
  A browser process is unnecessary for known direct HTTP operations.
- Use this order: **verified direct API → configured lightweight headless browser →
  Tabbit browser control**. Reuse an existing authorized agent/fingerprint/Playwright
  context's request channel at tier 1. Tier 2 may use an already configured Obscura,
  CloakBrowser or Playwright headless route; do not assume installation or claim speed
  measurements. Tier 3 applies only when the earlier tiers cannot complete that step,
  or the user explicitly chooses Tabbit. Load the chosen tool's installed guidance.
- Settings, credential aliases, private local fallback and test authorization are in
  [Access and scope](references/access-and-scope.md). Read it before the first login
  or business operation. An existing valid session does not need a fresh password.
- Bundled helpers use Node.js 24+ standard library. The direct helper accepts an
  existing APIRequestContext or an installed Playwright 1.46+ `request.newContext()` factory;
  it never launches a browser. Another authorized in-memory HTTP/CookieJar transport
  may use the same contracts. See [Direct API](references/direct-api.md) for executable
  examples, encoding and independent readback. No persistent cookie export is needed.

## Workflow

1. **Establish context.** Apply Access and scope and Direct API. Reuse the current
   request session or establish the verified owner HTTP session. Independently query
   `/Setting/Info` and match the expected store/identity. Use the known API's actual
   result to check access; inspect a page only for an unresolved identity, interaction
   or unknown/drifting contract, following the three-tier order. Keep
   session credentials in memory; report non-sensitive aliases and capability results.
   Deliver requested member fields only through the authorized private output route.
   A missing menu is not permission to try another account.
2. **Choose the operation.** Read only the relevant reference below. Distinguish
   historical execution, page/static inspection, official instructions and a workflow
   still awaiting tenant validation using [Evidence](references/evidence-and-validation.md).

   | Requested work | Read |
   | --- | --- |
   | Product lookup/edit/create, extra barcodes, multi-spec or unit conversions, assembly strategy | [Products](references/products.md) |
   | Purchase creation/confirmation, linked or independent receipt, two-store transfer | [Stock flow](references/stock-flow.md) |
   | Member lookup/create/edit/delete, custom fields or one Games interest | [Members and Games](references/members-and-games.md) |
   | Price schedule, discount/package activity, owned coupon or independent count card | [Pricing and marketing](references/pricing-and-marketing.md) |
   | Other visible modules, missing setup, permissions or failure | [Access and scope](references/access-and-scope.md) |

3. **Prepare the exact change.** Read fresh objects through the applicable verified
   business API. Do not reopen the editor for every known operation. Observe that
   same form only when its contract is unknown or has drifted.
   Match store-scoped IDs without losing 64-bit precision. Establish the fields,
   stock, entitlements and related objects the requested action can affect. Apply the
   existing authorization; ask only if a necessary scope decision is still missing.
4. **Execute and reconcile.** Prefer the verified same-origin business API with the
   current identity and in-memory cookies. Preserve encoding, ownership and request
   protections. Submit each mutation once. Make new independent detail/list requests
   and, for inventory or entitlements, query the relevant ledger and balance.
   Use a page only for an interaction/UI-only branch or contract observation; return
   to API when possible. Switching tiers never repeats an uncertain save.
   Saving a definition is not evidence that a sale, redemption or receipt occurred.
5. **Hand over.** Report the result, verification and remaining gaps below. Keep all
   production information outside this package and version control. Do not import
   historical scripts, orders, account files, member records or browser state.

## Output and failure handling

Return a concise result in the user's language: target store alias and task scope,
completed actions, independent verification, and anything incomplete. For a discovery
task, include visible/readable/editable/blocked status by module. Use `Unverified` or
`待核对` for unknowns; label assumptions. Routine status uses counts and redacted aliases.
For an explicitly authorized member query/export, return only the requested fields
privately or deliver a controlled export to the approved destination. Keep unrelated
people/fields, credentials, coupon secrets and session identifiers out of reports,
logs and version control. Do not deny an authorized query merely because it concerns members.

On permission denial, rejected credentials or required missing setup, pause dependent
work and use the secure setup guidance in Access and scope. Do not switch to a more
privileged account or evade a control. A timeout, HTTP 500, blank body, unexpected
HTML or a lost browser connection can leave a successful write behind: read the
business outcome before any further mutation. Retry a failed read once after checking
the session; never automatically replay a write whose outcome is uncertain. Report
the partial result and unresolved state if independent reconciliation is unavailable.

## Completion checks

- The actual session, store and role match the request; only permitted controls were used.
- The saved result is independently read back, including full strings and exact IDs.
- Stock/entitlement changes reconcile to the requested units and affected objects;
  unrelated member fields, private fields and non-target objects remain intact.
- The response distinguishes backend state from an untested checkout/client outcome.
- Secrets and browser connection details stay private; requested member exports use
  only the approved fields/destination and never enter the skill package or logs.

## Example requests

- “Using the authorized PosPal session API, check this store's permissions and add an alternate
  barcode to the specified existing product without changing stock.”
- “请在银豹网页后台核对指定门店的采购单，按本批实收数量入库并回查库存。”
- “For the selected member, change only the specified Games interest and verify that
  the complete custom value and other details are preserved.”
