# Validation and limits

This package contains business instructions, not another backend implementation.
Validate metadata and links from an isolated copy with its dependencies installed
separately. Exercise realistic English/Chinese requests using synthetic catalog,
receipt and source snapshots; compare action traces with the authorized scope and
expected catalog/history/stock invariants. Dependency lookup must use the simulated
host's installed-skill registry, not the source checkout.

Historical learning material supplied product-matching, packaging and barcode lessons.
Its execution parameters, private originals, real IDs/accounts and business scripts
are not bundled. Current user corrections override the older supplier-specific
“changed package implies new spec” shortcut.

## Verification record — 2026-11-27

An independent evaluator used the current inherited Codex model/settings, an isolated
installed-skill registry, the required foundation and upstream entry points/references,
and anonymous source/catalog snapshots. It did not receive expected answers. Mock
catalog writes/readbacks were recorded, then a separate assert-based review checked
their scopes, exact string IDs, preserved fields, quantities and language behavior.
These are business-flow simulations, not executed PosPal requests.

| Case | Observed outcome |
| --- | --- |
| P1 identical sale unit / different scanning code | Three alias additions on the original store SKUs; main codes, stock, price and history preserved. |
| P2 user-confirmed new GW version | Three `2026 X3` specs at sourced MSRP; each links to its own store's new 2026 single ×3, preserving old links and zero stock movement. |
| P3 genuinely new ordinary product | New SKU in all three simulated actual stores, opening stock/selling price 0; suggested retail 14 remains unapplied and missing cost remains unknown. |
| P4 confirmed two boxes versus five on slip | Reuse, two boxes retained; 72 included packs are reference-only, poster note-only, excluded line withheld; RR/Bow deduplicated. |
| P5 ambiguous identity/collision | No write; affected edition/unit/code facts requested instead of guessing. |
| PM missing required foundation | Offline plan retained; backend steps paused with the named installation route. |
| PU missing upstream with incomplete arrival evidence | Reconciliation/catalog writes paused; unknown receipt count retained. No fabricated access-denial claim. |

**Result: 7/7 offline cases passed.** Chinese/English defaults and an explicit English
override were observed; IDs were retained as strings. No purchasing, receiving,
payment or republishing action appeared. The separately installed predecessor's
existing offline ISBN suite also passed 9 tests; its helper was reused, not copied.
The actual P3 handoff was then consumed by the independent purchasing evaluator:
its exact new SKU mapping was reused and only the newly specified CW receipt moved
stock. Catalog prices and the other stores stayed unchanged (consumer case H1).

Reproduce with [anonymous cases](../tests/scenarios.json): install this package and
named dependencies separately; give an evaluator the request/facts (resolving any
`baseCase`) without the `expected` fields, then compare its trace to those expectations.
The test trace format is not a required runtime manifest format.

Metadata, portable internal links, package boundaries and absence of private runtime
paths were checked. The README records conditional/required dependencies with no
cycle. The package adds no secret setting or duplicated backend implementation.
Independent host evidence reported both new names from Codex app-server
`skills/list(forceReload:true)` as `enabled=true`, `scope=user`, through an existing
user-level repository junction. This proves metadata registration, not task execution.

No production API, login, stock movement, Slack/email send or source-sheet write was
tested. Natural-language automatic selection, a second/least-capable model, real
source connections, live catalog writes and checkout/scanner behavior remain unverified.

## P9 review checklist

- [x] **Metadata correctness:** valid matching `p9-` name/description; no scaffold placeholders.
- [x] **Chinese and English discovery:** bilingual task terms/examples; installed metadata reported enabled. Automatic selection remains unverified.
- [x] **Instruction clarity:** scope, four decisions, inputs, prerequisites and deliverable are explicit.
- [x] **Workflow determinism:** ordered source/identity/decision/write/readback/handoff steps and stop conditions.
- [ ] **Weak-model compatibility:** least-capable configuration not run; current settings were preserved.
- [x] **Context efficiency:** one business reference plus installed dependencies; no copied backend code.
- [x] **Output language behaviour:** English/Chinese defaults and explicit English override observed; exact IDs retained.
- [x] **Output and verification:** source/rationale/readiness fields and independent mock readback checked.
- [x] **Error handling:** ambiguity/collision and both missing-dependency routes produced scoped holds.
- [x] **Skill dependencies:** named requirements, input/output/loading/fallback, separate installations and no dependency cycle.
- [x] **Runtime configuration:** no new settings; delegates source/secret precedence to the declared dependencies. Live bindings unverified.
- [x] **Setup guidance:** missing-skill steps were specific, non-sensitive and distinct from account denial.
- [x] **Security:** synthetic fixtures; no credentials, private originals, production IDs or authority expansion.
- [x] **Package boundaries:** isolated complete copy, internal links and no hidden sibling/private runtime files.
- [x] **Documentation completeness:** entry/reference/fixtures and README catalog agree; no runtime scripts added.
- [ ] **Cross-model testing:** another model family and full live host matrix not run; no such compatibility claim.
