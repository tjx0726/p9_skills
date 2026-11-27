# Evidence, package review and validation boundaries

## Evidence vocabulary

- **Historical executed:** a dated prior operation had independent record readback.
  This does not establish the current session, role, configuration or deployment.
- **Inspected:** a form/page/static handler or source was read. No business write is
  implied. Inspection of a control does not prove its execution permission.
- **Official documented:** a linked PosPal instruction describes the general workflow.
  Recheck the current tenant; this package did not exercise that branch merely by reading it.
- **Template / unverified:** an operational procedure still needs the live page,
  authorized task and independent result before being called successful.

Do not collapse these levels into “tested”. Upgrade evidence only after an actual
authorized run, and describe the result without secrets, real account values, member
records, cookies, browser endpoints or historical production payloads.

## Execution revision

This revision changes the default route, preserving the invocation name:
**verified reverse-engineered business API → configured lightweight headless browser
→ Tabbit control**. A request-only context needs no browser process. Reuse a current
authorized request channel; otherwise the established owner login can use in-memory
cookies. Browser interaction is conditional on a real interaction, unresolved identity,
unknown/drifting contract or UI-only step; return to API afterward. Employee standalone
HTTP login remains unverified. No Tabbit startup/diagnosis, production login retry or
historical write replay was performed for this revision.

`direct.cjs` adds a runnable ordinary product read and complete Games
read/prepare/single-save/independent-readback flow. It composes the existing access
and Games helpers. The new fixture uses the stored definition and hidden-input archive
structures, with synthetic IDs/data only. Existing callers/credential formats remain
available; callers can now select the API route without opening an editor. The only
additional helper transport prerequisite is an available APIRequestContext or
Playwright request factory; no browser executable or persisted cookies are required.

## Provenance and coverage

The authoring input was the user's local PosPal analysis reports and product-workflow
references. The package includes the necessary generalized facts; those original files
and their absolute machine paths are not runtime dependencies. Historical scripts,
orders, IDs, account files, member rows and raw captures were not bundled.

| Capability | Source and established boundary |
| --- | --- |
| Public owner/employee login forms | `web-login-ui-20261127/visible-fields.json`: Playwright/Chrome inspection switched both modes and observed their input placeholders, including the shared password control. No employee login submission was made. |
| Current owner authentication | `web-login-ui-20261127/owner-readback.json`: the separate browser session's owner login submission did **not** yield an authenticated session (`authenticated=false`, `storeVerified=false`, `memberProfileRead=false`). The cause was not established. No other identity was tried; no live member/store state was verified afterward. |
| Historical owner login and store-scoped reads | `网页后台无浏览器访问与核对.md`: earlier owner logins and bounded reads, including the historical beta43 deployment. Those are not a successful 2026-11-27 login. Employee credential success remains unverified. |
| Independent HTTP query coverage | 2026-09-23 recorded 52 queries/51 business successes; 2026-09-24 recorded 20/19 across three accounts, one store-invisible result and 6/6 matching summary comparisons. This establishes tested contracts/scopes, not unlimited access, a global roster or current authentication. |
| Store detail versus visible chain list | The same historical read-only guide identifies `/Setting/Info` and `/Account/LoadSubStoresWithGradeDDLJson` with the selector's `withParent` option. A dropdown establishes its returned visibility only, not organization completeness or edit rights. |
| Browser availability | The independent 2026-11-27 probe found Tabbit's `CLI_REGISTRATION_UNAVAILABLE`; the Playwright route could inspect the public form. This is a tool-availability observation, not a permission bypass or proof of authenticated access. |
| Product read/edit/create, extra barcodes and multi-spec saves | `商品数据与计价.md` (including 2026-11-20/22/27) and the product workflow's `backend-contracts.md` / `isbn.md`: direct HTTP summary/list/detail and SaveProduct(form productJson), SaveProducts, alternate-barcode and multi-spec/1:36 relation saves with independent lookup. Reuse their applicable projections first; current metadata and units still govern. |
| Packaging strategies | `商品数据与计价.md`, 2026-10-11: traditional pack configuration and unpack/assembly had historical stock/readback evidence; minimum-unit virtual stock was inspected in source/configuration, not validated by those traditional tests. Native sales/refunds in the report do not authorize native work here. |
| Purchases and linked direct receipt | Product workflow `purchase.md` / `backend-contracts.md` and product report: direct HTTP CreateProductPurchase and ProductPurchase/CreateStockFlowIn with purchase, stock-flow lines and fresh-stock readback. Some batches auto-approved; independent AuditProductPurchase was source-mapped, not tested by that success. Unknown staged/warehouse/quality branches need their actual contract. Derived DTO totals were not sole evidence. |
| Independent inbound | Official [inbound guide](https://blog.pospal.cn/kb/2129): documented pending versus completed receipt, prepayment and supplier-update options. No independent inbound was executed to author this package. |
| Two-ended transfer | `门店调货流程.md`: three-stage browser submission/capture plus two-store records/stocks/ledgers. Those captured web contracts can use the request channel first; the original transport was not an independent HTTP trial. One reverse request body was not retained. Combined branches were inspected, not all executed. |
| Member base/private fields and Games | `会员功能调用链.md`, 2026-10-10 sections on structured titles, capacity/text limits and cross-store initialization: title JSON, actual owner/key binding, JSON save and independent complete readback. Confirmed P9 new-member default explicitly initializes all zero when no interests are specified; it is not a universal tenant default. |
| Separate member experiments and limits | The 2026-10-09/10 sequence tested remarks, base/private values, shared field count, Games and title metadata separately. UI limits were remarks 128, values 20, title 10; web API English/common Chinese 255 complete, 256 truncated despite success. The 255-Chinese value was 765 bytes; emoji/combining boundaries remain unknown. Basic/private share 30 definitions. The 76-character test/restoration, later three-store/202-member zero initialization and in-place 237-character title change were separate historical experiments, never a default bulk action. |
| Member single deletion | Official [member guide](https://blog.pospal.cn/kb/1177) documents the edit/trash route and no bulk deletion. No current-tenant deletion was tested here. |
| Price schedule | Product report/frozen mapping 2026-10-11: local editor inspection; separate Mac scheduled Save and subsequent fresh-state observation, no Batch. Immediate Save→Batch was source-mapped, not executed. Exact missing serialization must be observed before new writes. Official [price guide](https://blog.pospal.cn/kb/2479) is general guidance; no current production execution was tested. |
| Discount, stepped and package promotions | Official [discount guide](https://blog.pospal.cn/kb/2195), [stepped guide](https://blog.pospal.cn/kb/28774) and [package guide](https://blog.pospal.cn/kb/28778): documented menus/conditions, not tenant-specific save or checkout verification. |
| Owned coupons | `优惠券核销与有效期.md`: historical bounded rule/instance behavior; official [coupon guide](https://blog.pospal.cn/kb/2082) supplies web navigation. Single-instance expiry extension was not proven; fixed-rule changes must not be generalized to relative validity. |
| Independent count cards | Official [count-card guide](https://blog.pospal.cn/kb/109): definitions and web detail routes; current-role purchase/redemption controls are unverified. No course/third-party API prerequisite is imposed. |
| Other modules | Discovery procedure only. Determine visibility/read/write status in the actual role without submitting arbitrary tests. |

Official pages above were opened on 2026-11-27. They contain both older and newer
navigation; use the page version actually available. Backend verification does not
certify native display, checkout pricing, synchronization, accounting or a new role.

## Local verification record

Authoring date: 2026-11-27. Target: locally discoverable Codex skill on this Windows
host. Independent discovery used **Codex 0.169.0-alpha.11.1**; the authoring desktop/model
build was not recorded. No cross-model or weakest-model compatibility claim is made.
Helper verification used Node.js **v24.22.3** and fake
data only, without business/network calls.

Run from the installed/copied skill root:

```text
node --test tests/access.test.cjs tests/games.test.cjs tests/direct.test.cjs
```

| Check | Result / scope |
| --- | --- |
| Games exact serialization and 2,048 one-bit transitions | **Pass**: all 256 bit combinations, each of eight single-interest changes, preserve the other bits and 76-character format. |
| Games malformed/unset/zero handling | **Pass**: missing, duplicate, reordered, truncated, unknown and invalid values fail; unset needs explicit initialization. |
| Definition binding and schema drift | **Pass**: actual synthetic UID/key/owner and complete title are preserved; changed type/length/pattern or non-text definition cannot produce a save row. |
| 64-bit IDs | **Pass**: raw numeric JSON IDs remain exact strings; an already rounded ID is rejected. No claim of repairing previously rounded data. |
| Private access helper | **Pass**: fake owner/staff, BOM, first `=` / `:` / `：`, quoted delimiters, leading zeros, named blocks, unique unsectioned legacy format, runtime/binding/local priority, placeholder/duplicate/conflict/denial handling and exclusive template creation. |
| Form fill and origin checks | **Pass with fake pages** in the local tests: correct mode/password meaning, no submission, and rejection before any fill for a wrong origin or a redirect after mode selection. Independent acceptance additionally reported actual Playwright/Chrome filling of both modes on fake pages with all external traffic blocked, leading-zero preservation, wrong-origin fields remaining empty and zero submissions. Neither is a live authentication test. |
| Direct request pipeline | **Pass in synthetic tests**: owner bootstrap, memory-only context, Setting/Info, exact product ID/store, Games current definition/owner/schema, conflict re-read, single JSON save and independent two-group/profile readback. Sparse historical profiles map missing optional fields to null without fake dates; exact null→Gregorian-0 flag normalization is reported separately and needs only that specific scope. |
| Response/limit negatives | **Pass in synthetic tests**: repeated form keys versus JSON-string fields, bare arrays, JSON/HTML envelopes, raw 64-bit IDs, 20/21/128/255/256 English/common-Chinese archive boundaries, value/title JSON 255/256 distinction, success with a 20-character truncated value, private/title/birthday side effects and uncertain write replies. No automatic write replay or UI retry. |
| Independent transport acceptance | Reported **Pass** using real Playwright APIRequestContext against a TLS mock listening only on 127.0.0.1, with no browser and zero PosPal online requests: owner login/cookies, store confirmation, product read, full Games readback, no-op suppression and successful-response truncation detection. Two distinct changes produced exactly two writes with no replay. This is not current production authentication. |
| Helper test total | **29 passed**, zero failed, from source, isolated temporary copy and global installation; includes the prior 15-test access/Games baseline and 14 direct-flow tests. |
| Skill Creator metadata validator | **Pass** on the isolated revision. Validator-only PyYAML is in the temporary review directory and Python UTF-8 mode is used; neither is a skill runtime dependency. |
| Isolated copy and local links | **Pass**: the 16-file package has 21 resolving internal links/anchors and 11 placeholder-only configuration entries; isolated tests require no source checkout or local analysis report. |
| Global installed/source equality | **Pass**: all 16 source, installed and isolated files match by per-file SHA-256. The updated installed entry also passes Skill Creator validation. The installation follows the existing user-level `.agents/skills` convention; the prior installed package was retained privately for recovery. |
| User-level discovery | **Pass, independently verified**: a fresh Codex 0.169.0-alpha.11.1 app-server outside this repository returned `p9-pospal-web` from `skills/list`, with `enabled=true` and `scope=user`. This confirms registration/discovery, not natural-language automatic selection or a completed business task. |

## P9 review checklist and release gaps

| Checklist area | Review result |
| --- | --- |
| Metadata, bilingual description/examples and scope | Defined in `SKILL.md`; final parser/link verification recorded above. Web-only scope is separate from native checkout and supplier-specific delivery policy. |
| Clear inputs, ordered workflow, output and failures | Static review: store/role, relevant reference, scoped change, once-only execution and independent readback are explicit. Unknown results stop replay; missing setup uses private routes. |
| Context efficiency and dependencies | Entry point routes to the needed domain and shared direct/access references. Request-only execution precedes lightweight headless, then Tabbit. No required sibling package or local report path; Node helpers use an injected request context/factory. |
| Runtime settings and setup | Declared names, runtime/binding/local order and private template are documented; synthetic helper tests pass. Live secret-manager/browser bindings remain unverified. |
| Security and permissions | No working credentials, member records or browser state are packaged. Current user/test authorization and linked non-test/financial scope are distinct. Requested member query/export remains available through the approved private destination. |
| Package boundary and catalog | Self-contained top-level folder; README catalog entry added. Verify the isolated copy and installed equality above before handoff. |
| New scripts and fixtures | Pure Games/access helpers plus the direct workflow use synthetic fixtures shaped from stored definitions/archive inputs. No historical executable business script, real ID/account/member row or cookie was imported. |
| Output language and instruction behavior | Rules and bilingual examples exist. Fresh-session English/Chinese behavior and explicit output-language overrides are **Not run**. |
| Discovery and model coverage | Fresh-session automatic/explicit skill selection, negative native-only prompts, the least-capable model and a second model family are **Not run**. Do not claim those configurations passed. |
| Live workflows | Current authenticated identity, member write, receipt/transfer, price/promotion/coupon/card writes are **Unverified** in this authoring task. The unsuccessful owner-login probe is preserved above. |

Fresh-session acceptance should use equivalent English/Chinese requests: a read-only
store capability check, a specified alternate-barcode edit, an existing unset member
versus a newly created P9 member's Games initialization, a schema-drift rejection,
missing/denied setup, an uncertain receipt result and a native-only near match. Use
fake artifacts/read-only access or isolated authorized tests, record the actual host,
model, prompt, selected resources and outcome, and never fabricate a pass to fill a matrix.

## Reconciliation with related skills

The existing supplier-specific product workflow contributed generic identity,
projection, alternate-barcode, purchase-unit and uncertain-outcome facts. This package
adds a general web entry point, employee-mode form handling, private access parsing,
Games logic and broader marketing routes. It intentionally does not carry that
workflow's automatic three-store updates, brand/MSRP/tax defaults, local report writes
or native-input adapters: those depend on a different task's authorization and inputs.
The repository's delivery-reconciliation skill remains separate; mail/Drive originals,
spreadsheet manifests and publishing are not required for a PosPal web task.
