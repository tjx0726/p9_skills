# Validation and limits

Validate metadata/links and install this package separately from its declared upstream
and foundational skills in an isolated host layout. Exercise standalone mapped-SKU
requests as well as intake handoffs; use synthetic purchase/receipt/ledger snapshots,
not production scripts. Compare resulting action traces, paid/gift amounts and stock
deltas with current stage, store, supplier and known/unknown prior outcomes.

Historical learning supplied the combined pending-quantity and split paid/gift ledger
lesson and a purchase-created/receipt-not-sent recovery. That evidence does not make
an old order an execution parameter or authorize replay. The package carries the
general decisions only, with no private account, order or source-document data.

## Verification record — 2026-11-27

An independent evaluator inherited the current Codex model/settings and used a
separately installed mock host, foundation/upstream references and anonymous inputs.
It did not see expected answers. Mock purchases/receipts were persisted and read
independently; a separate assert-based replay checked the action traces, exact SKU
strings, stage/store constraints, paid/gift movements and net amounts. These are
business-flow simulations, not executed PosPal requests.

| Case | Observed outcome |
| --- | --- |
| R1 standalone mapped boxes | One CW purchase/receipt: 2 paid +1 gift box, net 20, stock +3; packs/other stores untouched and order discount separate. No intake rerun. |
| R2 explicit kit allocation | One CW purchase/receipt: 20 paid small B&B boxes at 10 plus 2 zero-cost gift booster boxes; net 200. Outer kits and packs not received again. |
| R3 repeat CW and RR / guard stopped after purchase | Bow/RR old receipt verified without another write; only CW receipt against the existing purchase, paid 1 + gift 2. No duplicate purchase. |
| R4 previous timeout with fresh completed backend state | Verified no-op despite the absent local final file. |
| R5 previous create unknown / readback unavailable | `uncertain`, no create or receipt replay. |
| R6 standalone order-only before arrival | One Bow/RR order, EUR 36 from explicit EUR source; no invented external reference, receipt or stock movement. |
| R7 missing target/unit/tax/allocation facts | Preparation with explicit blockers and focused questions; no inherited CW target or zero-cost substitution. |
| RM missing required foundation | Prepared supplied facts but paused all backend steps, naming the required installation route. |
| RU missing upstream with incomplete arrival evidence | Paused reconciliation/dependent writes, retaining unknown counts; no claim of production access denial. |
| H1 actual intake-output composition | Accepted the independent product evaluator's P3 manifest and exact SKU IDs; newly supplied cost/target facts produced one CW purchase/receipt for 5 each, net GBP 16, while other stores and catalog prices stayed unchanged. No intake rerun. |

**Result: 10/10 offline cases passed.** Mock mutation count was four purchases and
four receipts across R1/R2/R3/R6/H1. The other cases produced no backend mutations.
Chinese/English output and precise IDs were checked; no payment, message, source-sheet
update or non-target inventory action occurred.

Reproduce with [anonymous cases](../tests/scenarios.json): install dependencies in a
separate host, supply request/facts without `expected` (resolving `baseCase`), and compare
the action trace and replayed stock/amount effects. No fixed trace format is imposed
on real user manifests.

Metadata, internal links, independent package boundary and private-path exclusion
were checked; the catalog lists required/conditional dependencies without requiring
product intake. Independent Codex app-server evidence reported this skill enabled
with user scope via an existing repository junction. That proves metadata discovery,
not natural-language selection or completed business actions.

No production API, login, stock movement, payment, message or source-sheet mutation
was tested. Automatic selection, another/least-capable model, actual connections,
current live purchasing and native checkout/scanning remain unverified.

## P9 review checklist

- [x] **Metadata correctness:** valid matching `p9-` name/description; no scaffold placeholders.
- [x] **Chinese and English discovery:** bilingual task terms/examples; enabled user-scope metadata reported. Automatic selection unverified.
- [x] **Instruction clarity:** standalone mapped input, stages, target store and deliverables are explicit.
- [x] **Workflow determinism:** existing-state reconciliation precedes creation/receipt and three-view proof.
- [ ] **Weak-model compatibility:** least-capable configuration not run; current model/settings were preserved.
- [x] **Context efficiency:** one cost/recovery reference and declared installed dependencies; no second backend implementation.
- [ ] **Output language behaviour:** English/Chinese defaults observed; explicit cross-language override not separately tested in this package.
- [x] **Output and verification:** stage, paid/gift units, net amounts, IDs, mock ledger/stock and unresolved facts checked.
- [x] **Error handling:** unknown outcomes, incomplete scope and missing dependencies held without replay.
- [x] **Skill dependencies:** foundation required, upstream conditional, intake not required; installed/missing paths and actual handoff tested without cycles.
- [x] **Runtime configuration:** no new settings; uses dependency policies and explicit-source/default currency. Live bindings unverified.
- [x] **Setup guidance:** precise named-skill setup; no secret or invented account-denial request.
- [x] **Security:** synthetic data, scoped mock actions, no payment/publishing/source-sheet authority expansion.
- [x] **Package boundaries:** independent isolated copy and valid internal links; no source/private path dependency.
- [x] **Documentation completeness:** entry/reference/fixtures/catalog agree; no new runtime scripts.
- [ ] **Cross-model testing:** second family/full host matrix/live business execution not run; no such claim.
