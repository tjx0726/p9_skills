# Validation record

This is a package-maintenance record, not instructions to run during a receipt. Cases use only the bundled [synthetic inputs](../assets/synthetic-cases.json). They contain no real customer documents, invoices, photos or live write results.

## Scope

- Revision: package based on repository `81cae40`; initial operational guidance tested through isolated revision4, with scoped follow-ups recorded below.
- Review date: 27 November 2026.
- Authoring host: Codex desktop; installed application/model version is not exposed in this task.
- Intended runtime: an agent host with the declared authorized capabilities. No installed-host or cross-model compatibility claim is made by this review.
- Method: isolated-copy static validation and offline synthetic forward-testing, with no business-record writes or global installation. The user separately authorized committing and pushing this skill and its README catalog update on 27 November 2026.

## Changed files

- `SKILL.md`: supplier-neutral entry point, bilingual discovery, workflow and language/permission contract.
- `agents/openai.yaml`: Codex display name and short description.
- `references/runtime-and-targets.md`: settings, connections, optional skills, P9 targets and isolated Asmodee context.
- `references/evidence-and-manifest.md`: complete email/Drive evidence, original-copy identity, product hierarchy, quantities, costs and authoritative currency policy.
- `references/publishing-and-recovery.md`: narrow Slack/Sheets writes, readback, visual checks and duplicate-safe recovery.
- `assets/synthetic-cases.json`: eight synthetic cases with quantity/currency, ISBN and recorded-barcode amendment variants; no private originals.
- `scripts/isbn.py`: offline standard-library ISBN checksum validation and equivalent identifier conversion.
- `tests/test_isbn.py`: known vectors, error handling, CLI and modular/roundtrip tests.
- `references/validation.md`: this review, results, matrix coverage and verification gaps.
- Source repository `README.md`: new catalog entry and dependencies; not required by the installed package.

## Initial static and package checks (before follow-ups)

| Check | Result | Evidence / limit |
| --- | --- | --- |
| Codex `skill-creator` quick validator | Pass | Run against isolated copies; valid name/frontmatter and no unfinished scaffold. |
| YAML and Codex UI metadata | Pass | Matching folder/name, bilingual description within limits, requested display name and valid short-description length. |
| Markdown links, exact path case and anchors | Pass | 14 local links and 3 anchors in the package and README; target existence, exact case and package boundaries checked. External web links were not fetched. |
| Standalone copy | Pass | All seven package files copied outside the checkout; no symlinks or access to root/`.agents` resources required. Named assisting skills are external optional/host-conditional dependencies. |
| Fixture integrity and money oracle | Pass | Six raw cases parse. Independent decimal calculations establish 1,086.00 GBP received scope, 54.00 EUR box/pack scope and 24.00 GBP known Prism-only scope. |
| Offline output invariants | Pass | Parent reviewed the evaluator's outputs against raw fixtures and independent oracles: 19 quantity/cost assertions and 14 currency/provenance assertions passed. These test artifacts, not executed service requests. |
| Private data / scaffold review | Pass | Synthetic fixtures and non-secret operational hints only; no original receipt constants, customer documents, private images, credential values or temporary tool IDs. Common secret-signature scan passed. |
| Dependency entry-point presence | Partial | This host's Google Drive, Google Sheets and Tabbit entry points were found. Catalog-provided PDF and general Spreadsheets filesystem paths did not resolve. This checks file presence only; account access, skill execution and runtime installation are not established. |
| New/changed executable helpers | Not applicable | No runtime scripts added; temporary authoring checks are outside the package. |
| Git whitespace and edit scope | Pass | Only this new package and its README catalog entry are changed. No commit, push or installed-skill change. |

The authoring checks used temporary Python dependencies, PyYAML 6.0.4 and markdown-it-py 4.3.0. These are not delivery-runtime requirements.

## Offline forward-test cases

An independent evaluator explicitly loaded an isolated `SKILL.md` and its three operational references, without reading this validation record or the parent's expected answers. The first four cases ran on the initial revision; the two added cases ran on the supplier/Drive/hierarchy revision. A focused final regression checks changed guidance and fixture identity. These are recorded-data simulations, not real API calls or natural skill discovery.

| Case / prompt and raw input | Expected result | Observed result / verdict |
| --- | --- | --- |
| `receipt-cn`: Chinese receipt request, photos, older matched invoice and newer unrelated invoice | Six physical/component rows; unknown outer case; single kit cost; received scope excludes unrelated invoice rows; Chinese response with English notice | Pass in initial run and focused final regression: units 6/10/20/2/6/12; costs 486/120/300/blank/60/120; total 1,086.00 GBP ex VAT; display-level barcode retained; per-packet RRP not labelled per box. Latest explicit supplier identity supports Asmodee; no real writes claimed. |
| `recovery-en`: prior Slack success, sheet timeout, matching persisted row; later distinct partial dispatch | No resend/reappend for existing batch; new delivery reference remains a separate batch despite the same barcode | Pass in offline reasoning. Matching row retained; later three-box dispatch prepared separately. Full formula/cost/message verification unavailable from the reduced recording was reported as incomplete. |
| `conflict-cn-english`: Chinese request for English draft, conflicting case ratio, missing receiving store/time, embedded posting command | English draft, explicit 24-versus-40 conflict, grouped questions and no write/transfer flag | Pass in offline reasoning. Actual receiving store was not equated with document ship-to; source instructions were ignored and missing history was disclosed. |
| `setup-en-chinese`: English request for Chinese, runtime override, supplied original without currency, denied Slack and read-only Sheets | Runtime target wins; no local-file/account bypass or replacement workbook; 25.00 GBP with currency tagged `user-business-default`; secure setup guidance | Pass in final regression. Initial output gave the right amount but wrongly attributed GBP to the document. Final output separates default GBP from document-sourced numeric price/tax and derived total; no question solely about omitted currency. Access, fallback, language and target-precedence decisions passed. |
| `setup-en-chinese` explicit USD and conflicting USD/EUR variants | Explicit user USD overrides the default; conflicting explicit USD/EUR claims stay visible and only dependent monetary work is held | Pass in final regression. USD 25.00 uses user-confirmed currency; the conflict retains both claims, asks one currency question and does not fall back to GBP. No automatic FX or unrelated confirmation request. |
| `parent-drive-en`: non-Asmodee Drive-only original; distinct box/pack labels; two boxes plus three loose packs; plan to open one box | Drive file/revision/page provenance; distinct codes; 27 packs equivalent without extra receipt; proposed result one box plus 15 packs; 54.00 EUR cost once | Pass in recorded-data reasoning. Supplier/account/currency came from Prism's original, not Asmodee hints or misleading filename/Drive timestamp. No email prerequisite, POS operation or external write was introduced. |
| `parent-drive-en` unreadable-child-label variant | Child barcode unknown; do not substitute parent code or reverse a check digit; independent parent receipt and verified conversion can proceed | Pass in recorded-data reasoning. Child barcode-dependent work alone remains unresolved; actual loose-pack quantity and documented cost remain supported. |
| `mixed-suppliers-cn`: same Prism original in email and Drive, plus an unpriced Glyph item with identical SKU text | One Prism original at two locations, supplier-scoped products kept separate; Prism cost counted once; Glyph price unknown | Pass in recorded-data reasoning and final currency delta. Two distinct originals and two product keys retained; 24.00 GBP subtotal explicitly Prism-only. Glyph currency defaults to GBP with business-default provenance, while price/cost/tax remain unknown. No zero price, cross-merge or forced Asmodee search. |

### Focused final regression

The revision4 evaluator returned structured fields, Chinese responses, English drafts, conditional native-row plans and a completion report. Its 29 artifact consistency checks passed; the parent independently checked 14 currency/provenance invariants in addition to the 19 earlier quantity/cost invariants.

- Missing currency: GBP / `user-business-default`; numeric unit price 12.50 and ex VAT remain document-sourced; total 25.00 is derived. No currency-only question.
- Explicit user USD: USD / `user-confirmed`; no GBP default or conversion. Explicit Drive EUR: EUR / `document`, cost 54.00 unchanged.
- Explicit USD-versus-EUR conflict: both claims preserved; only dependent monetary writes held and the affected currency fact queried.
- Latest explicit Asmodee identity: confirmed from the updated raw case, never inferred merely from an account code; received cost remains 1,086.00 GBP.
- Glyph's unpriced line: currency defaults to GBP, but price/cost/tax remain unknown and the 24.00 GBP subtotal remains Prism-only.

No blocking guidance contradiction was reported. Earlier artifacts were preserved separately; a stopped interim currency experiment was marked superseded and is not current package behavior. Final instructions implement the user's GBP default.

## Release matrix coverage

| Authoring-guide case | Coverage and status |
| --- | --- |
| Chinese/English automatic discovery and near-match boundary | Not run; not globally/project-installed for automatic selection. Metadata/examples reviewed only. |
| Chinese output, English output, both language overrides | Pass for the recorded-data explicit-load cases above; fresh installed-host sessions not run. Slack drafts remained English. |
| Missing input / incomplete source | Pass in offline reasoning for conflicted count/store/time, missing component barcode, unknown price and partial document coverage; the default-GBP provenance regression is recorded separately. |
| Unavailable tool / denied access | Pass in offline reasoning for supplied-original fallback, missing history, denied Slack, read-only Sheets and unavailable browser. Real connector fault injection not run. |
| Skill dependency presence/missing | Presence check and offline optional-skill fallback only. Actual host loading/execution of separately installed assisting skills is Unverified. |
| Runtime configuration / missing setup | Pass for synthetic environment-versus-config precedence, forbidden local fallback and secure reconnect guidance. Real account/secret-store setup not run; package declares no raw secrets. |
| Permission boundary | Pass for draft-only scope, embedded instruction rejection and no POS/split execution in the synthetic cases. No external side effects performed. |
| Native writes, real readback and browser rendering | Not run. Schema discovery, typed cells/formulas/validation, atomic batch behavior and clipping repair require a later authorized host integration test. |
| Cross-model / least-capable target | Not run. One inherited Codex evaluator; exact hosted model/version/settings were not exposed. No two-family, weak-model or other-host compatibility claim. |

Token counts were not exposed. Execution resources were the entry point, runtime, evidence and publishing references plus the synthetic fixture; no unrelated repository instructions or validation answers were given to the evaluator. The fixtures provide reader records, so image/PDF extraction and source-search recall remain untested.

## Skill Review Checklist

Completed as an authoring review; unchecked items identify genuine release-verification gaps.

- [x] **Metadata correctness.** Name/folder, YAML, lengths, UI metadata and scaffold checks passed.
- [x] **Chinese and English discovery.** Relevant terms, distinct scope and representative prompts are present. Actual automatic selection remains Not run in the matrix.
- [x] **Instruction clarity.** Scope, evidence paths, inputs, prerequisites, output and authority boundaries reviewed against the raw cases.
- [x] **Workflow determinism.** Ordered steps and explicit ask/skip/stop/retry conditions; per-service checkpoint and bounded retry documented.
- [ ] **Weak-model compatibility.** Lowest-capability planned target not tested; no claim made.
- [x] **Context efficiency.** Focused entry point; three operational references loaded at their use points; validation record is maintenance-only.
- [ ] **Output language behaviour.** Recorded-data defaults/overrides tested, but fresh installed-host language matrix not run.
- [x] **Output and verification.** Manifest provenance, unknowns, quantity/cost units, result links and actual readback requirements defined. Simulated success is not production completion.
- [x] **Error handling.** Missing evidence/access, optional dependencies, conflicts and ambiguous writes have specific fallback/stop behavior; initial currency error is tracked, not hidden.
- [ ] **Skill dependencies.** Declared with inputs/results/fallbacks and catalog coverage; separate installed-host execution is Unverified.
- [x] **Runtime configuration.** Named non-secret runtime settings precede authorized configuration and hints; no local credential-file fallback. Synthetic precedence/denial case exercised.
- [x] **Setup guidance.** Plain-language secure reconnect route; no request to paste secrets or bypass an access denial.
- [x] **Security.** Source instructions cannot grant authority; external write/POS scope explicit; fixture/private-data review complete.
- [x] **Package boundaries.** Root package and relative links verified in isolated copies, without authoring resources.
- [x] **Documentation completeness.** Runtime prerequisites/fallbacks, README catalog, raw cases and this record are included. The additive ISBN helper has documented usage and offline tests; no breaking migration is required.
- [ ] **Cross-model testing.** Release matrix not run across hosts/model families or automatic invocation.

Suggested improvements: repeat the natural discovery cases and least-capable target when a deployment target is selected; retain the raw fixtures and remove guidance only when actual runs support doing so. These gaps do not authorize a production smoke test or global installation.

## RR target follow-up — 27 November 2026

- Updated only `references/runtime-and-targets.md` and this record. Added the user's RR workbook as the bundled fallback for `P9_DELIVERIES_RR_SPREADSHEET`, replacing the prior instruction to ask for an RR link. Explicit request/runtime/configuration precedence is unchanged.
- Read-only Google Sheets metadata confirmed workbook `13oB8QmfDAZqb0DJNylDAzUiCLIyp18PsN3N7Vs87XTE`, title `RR DELIVERIES`, timezone `Europe/London`, and supplied gid `803013598` as the current `RR TEMPLATE DUPLICATE THIS DD/11/26`. The reusable guidance treats this gid as the initial template view and discovers the actual receipt-date destination each run.
- Re-ran the quick validator, isolated-copy local-link/case/anchor checks and whitespace checks. The package still has seven files, 14 local links and 3 checked anchors. No new runtime scripts or behavior/model tests were needed for this configuration-only update.
- Metadata was verified; RR cell contents, template formulas/validation, recent completed-page format and rendered layout were not inspected in this follow-up. No Slack send, spreadsheet write, commit, push or installed-skill change occurred. Existing release-matrix gaps remain.
- README catalog details and dependencies are unchanged, so no catalog edit was needed for this follow-up.

## ISBN and recorded-barcode amendment follow-up — 27 November 2026

### Change and authority

- Added the ISBN helper and tests, updated the entry point, three operational references, synthetic cases, UI summary and README catalog. The source rules for identifier normalization, ISBN aliases and packaging-code retention live in the evidence reference; the amendment execution branch lives in the publishing reference.
- ISBN aliases are the same edition/format at the same physical level. Both codes remain text with observed/derived provenance for later intake, without an extra receipt or POS action. Valid 979 ISBNs have no ISBN-10; magazine ISSN/977 EAN and ISMN/979-0 are not converted as ISBNs. Checksums do not establish publisher allocation or physical product identity.
- Recorded-batch amendments reuse the original message/date tab, retain verified outer-packaging codes or mark unverified old values superseded, and leave original quantities, costs, formula text and flags unchanged. Optional child reference rows are explicitly non-receipt and have blank quantity/price/total cells with no formulas. Recovery checks the particular amendment, not merely batch existence.
- RR workbook context, supplier neutrality, complete email/Drive originals and the GBP business default are retained. A deep comparison confirmed the original six synthetic cases are unchanged. Only the two new cases/variants are subject to this focused behavior regression; unchanged earlier scenarios were not re-run through a model.

### Actual checks

| Check | Result and scope |
| --- | --- |
| ISBN executable tests | Pass: Python 3.15.0, nine standard-library unittest methods, including three known pairs in both directions, zero/X check characters, labels/separators, malformed or corrupted codes, ISSN/ISMN rejection, 979 without ISBN-10, CLI partial failure and 1,000 seeded roundtrips with independent modular invariants. |
| Known pairs | `9889701006` ↔ `9789889701000`; `039304002X` ↔ `9780393040029`; `0306406152` ↔ `9780306406157`. The first is published by Hong Kong Public Libraries; the X-valued ISBN-10 is a standard calculation example. Other generated numbers are checksum fixtures, not claimed allocated publications. |
| Isolated package/metadata/links | Pass: nine files, 20 local links and 7 anchors, with valid frontmatter/UI metadata and no source-checkout dependency. The final source is compared with the tested execution snapshot; only this maintenance record changes after the behavior test. |
| Independent focused behavior test | Pass for the two new recorded-data cases and their variants below. Evaluator explicitly loaded only the isolated entry point, three operational references, two raw cases and executed ISBN helper; no validation answers/source checkout/earlier QA were supplied. Exact model/application version was not exposed; this is not automatic discovery or a cross-model claim. |
| Independent parent artifact checks | Pass: 38 checks compare identifier outputs, original and hypothetical amended snapshots, blank reference values/formulas, original identities, cost/quantity vectors and recovery/repeat decisions against the raw fixtures. These are concrete offline output invariants, not production persistence. |

| New case / variant | Expected and observed outcome |
| --- | --- |
| `books-isbn-cn` | BK-A retains observed `039304002X` and derived `9780393040029`; BK-B retains `9791090636071` with ISBN-10 not applicable. The magazine keeps its own ISSN/EAN and add-on `03`. Exactly one physical row per product, Chinese response and no external/POS action. |
| Later conflicting ISBN label | New `9789889701000` maps to `9889701006`, not the original pair. Both source claims retained; only the affected SKU/edition association is queried and held. No silent pairing/replacement. |
| `recorded-barcode-amendment-cn` | Original message and sheetId/date tab preserved; each code replaces the display field while verified display code/source remains in notes. Existing box stays received; one child reference has null CASES/UNITS/UNIT PRICE/TOTAL PRICE and no total formula. Six original quantity/price/formula/flag records and GBP 655.00 subtotal remain unchanged; unrelated rows, latest sender note and separate replies preserved. |
| Sheet timeout after confirmed Slack edit | Provided readback proves the sheet patch is absent; one sheet-only retry is prepared. Slack is neither resent nor edited again. No real API invoked. |
| Same completed amendment repeated | Specific mappings/reference row rechecked; zero further writes and still one reference row. Batch existence alone is not the check. |
| Original message cannot be edited | Exact Slack patch retained, limitation reported, no replacement top-level message; independent authorized sheet amendment remains possible. |
| Prior code was unverified, not a confirmed packaging code | Old value retained as superseded/unverified with unknown packaging level; the historical verification claim is explicitly superseded, not promoted into a parent mapping. Verified new each code can proceed absent another material identity conflict. |

The evaluator and parent both reported no blocking operational guidance contradiction. Native note anchors, the SKU column location and current provider schemas were absent from the fixtures; artifacts correctly leave a runnable provider payload unresolved instead of inventing one. Before/after snapshots are explicitly hypothetical offline results. Fresh live reads and rendering remain required for real execution.

### Remaining limits

- Tests are local/offline, using mocked book identity and service readback records. No scanner hardware, publisher allocation service, live Slack edit/ownership, real concurrent updates, Google Sheets formulas/validation or rendered amendment was exercised.
- Only the available Python version was executed; other runtimes/hosts/models and automatic skill discovery remain unverified. The alternate-execution/no-execution fallback is documented, not an observed host integration result.
- No production message or delivery row was changed, and these verification runs did not install a skill or publish code. Commit/push is covered by the later explicit user request; it does not authorize production delivery processing or global installation.
