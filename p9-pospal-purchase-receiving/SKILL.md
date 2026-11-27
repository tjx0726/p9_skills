---
name: p9-pospal-purchase-receiving
description: >-
  Prepare or create supplier purchase orders and receive an authorized full/partial
  delivery into the specified PosPal store, with cost, gift quantity, duplicate and
  stock-ledger verification. Use for 采购单、指定门店入库、部分收货、赠品入库、采购恢复.
  Callable independently with verified SKU/unit mappings and sufficient batch facts;
  requires p9-pospal-web. Product intake and upstream publishing are separate scopes.
---

# P9 PosPal Purchase Receiving

## Purpose and language

Use the confirmed batch quantities, costs and current records to perform exactly the
requested procurement stage in the target receiving store. This skill works without
running product intake first when valid SKU/unit mappings are supplied. Accept
English/Chinese; use the requested language, otherwise the user's primary language.
Preserve document numbers, barcodes, currency and exact IDs.
Use the same execution workflow for English and Chinese requests.

## Inputs and dependencies

- **Required task choices:** target receiving store, supplier and stage: `prepare`,
  `createPurchase`, `purchaseAndReceive`, or receipt against an existing purchase.
  Use already supplied authorization without asking again. Never inherit a prior
  CW/Bow target when this batch's store is unknown. Normalize RR to Bow once.
- **Lines:** current store-specific SKU/record IDs, barcode/unit mapping, ordered
  quantities and sourced cost basis. Actual paid/gift received quantities are needed
  for receipt, not for an order-only stage before arrival. Include explicit unknowns,
  provenance and existing purchase/receipt status. A complete intake manifest or
  equivalent direct user input is acceptable; a particular file format is not required.
- **Required foundation:** load installed `p9-pospal-web` via host discovery or
  `$p9-pospal-web`, then its stock-flow and relevant products/access/direct-API
  references. Pass the authorized store/stage, exact objects/units/fields, source
  pointers and non-secret checkpoint. Reuse its session, permissions, verified
  contracts, projections, exact IDs, write recovery and independent readback.
  Expect real record IDs/numbers, actual state/line quantities, stock deltas and gaps.
  If unavailable/incompatible, pause backend work and explain its installation route.
- **Upstream prerequisite:** load installed `p9-incoming-delivery-processing` when
  actual receipt evidence still needs reconciliation; give it the supplier/store/date
  and source pointers and expect a reconciled manifest. Complete supplied manifests
  or sufficient direct facts satisfy that prerequisite without rerunning Slack/Sheets.
  Apply its currency/runtime/evidence policy for source work. If this conditional
  route is required but unavailable, pause affected lines and identify the setup need.
- `p9-pospal-product-intake` can produce the input, but is **not a required dependency**.
  If identity or unit mappings remain unresolved, return only those lines for product
  matching; do not guess or force an independent caller through the whole first skill.
- Discover/load installed dependencies through the host and its returned entry points,
  including registered links/junctions; never hard-code a source-checkout sibling path.
  Keep credentials/cookies in the private foundation runtime. Connected Gmail/Drive
  is needed only for missing original-document evidence; suitable supplied originals
  are sufficient. Secure setup and permission denials follow the owning skill.

## Workflow

1. **Scope the stage and refresh inputs.** Read [Costs and recovery](references/costs-and-recovery.md).
   Confirm receiving store/supplier/stage and latest actual scope/exclusions. Read
   complete relevant messages/threads, delivery rows and originals when used as
   evidence. Recheck the foundation's current store identity, exact SKU/barcode/unit
   mapping and receiving configuration; an old manifest is a plan, not current state.
2. **Resolve cost, quantities and references.** Match the correct supplier/account,
   business date, products and order/dispatch/invoice linkage. Establish currency,
   VAT-exclusive unit purchase price, paid versus gift quantities and any explicit
   kit allocation. Distinguish existing moving-average cost from this batch's price.
   Preserve an approved order-level discount separately. Ask only about missing or
   conflicting material fields; missing cost is not zero. Group separate suppliers
   into separate purchases.
3. **Reconcile existing backend work before creating anything.** Through the foundation,
   search store/supplier/reference/time/SKU/quantity combinations across relevant
   states and pending inbound records. Re-read matching purchases/receipts and stock.
   Reuse an existing purchase; independently confirmed already-received lines require
   no new receipt. When a request repeats CW and RR, verify each and execute only
   the missing authorized segment. An uncertain previous write is reconciled here,
   not treated as absent because a local checkpoint/file is missing.
4. **Prepare or create the purchase.** Preserve a reviewable exact plan and stock
   baseline. In `prepare`, return without mutation. Otherwise have `p9-pospal-web`
   create only the missing purchase with its current generated internal number,
   sourced price/unit fields and precise paid/gift lines. External business references
   are included only when sourced or form-required. Re-read the returned real ID,
   list/detail and actual approval state. Reuse auto-approved results; do not invent
   an audit test or repeatedly approve. `createPurchase` stops here without stock movement.
5. **Receive only the outstanding authorized goods.** Use the same purchase and the
   foundation's permitted direct or staged receipt path. Respect partial quantities,
   units, areas, quality and confirmation requirements. Check paid and gift remaining
   quantities separately; a combined HTML pending quantity can include both. Keep
   one chosen physical receiving level and do not also receive its component/reference
   rows. Submit once. If an assertion stops after purchase creation, refresh that
   original purchase and complete only its missing receipt when safely resolved.
6. **Independently reconcile and report.** Ask the foundation for fresh purchase and
   receipt lines, confirmation state, inventory ledger and per-SKU stock. Reconcile
   paid/gift/base-unit increments, cost/amount and remaining lines as in the reference.
   Check non-target stores and reference units remain unchanged except their separately
   authorized catalog changes. Update the same checkpoint with real IDs/numbers,
   evidence and `purchaseCreated`, `received`, `partial` or `uncertain`; do not claim
   completion from a DTO total, request response or local artifact alone.

## Output and failures

Return store, supplier, stage/status, paid/gift physical quantities with units,
currency/VAT-exclusive amount, actual purchase/receipt numbers and independent
readback basis. Retain material unresolved fields and accepted side effects. Distinguish
`prepared` from a created order and actual receipt. Do not mix unlike units/currencies
into one total. Mention native checkout/physical scan verification if not performed.

Denied access, missing scope or an unknown write outcome pauses dependent mutation
under the foundation's rules. Continue independent authorized preparation. Never
replay a create/receipt through another skill, browser or new purchase. Do not exceed
remaining paid/gift quantities or erase audit history to hide uncertainty.

Procurement scope does not authorize supplier payments/refunds, Slack/email messages,
source-sheet updates or inventory in unselected stores. Creating/validating this
skill authorizes no live business tests. Normal accepted supplier-filling effects
are recorded and preserved; do not issue an unrelated save to clear them again.

## Example requests

- “Using these verified SKU rows, create and receive this delivery in the specified
  store; reconcile existing orders first and retain gift quantities.”
- “独立调用：只收货到CW，RR旧单先回读确认；沿用已有采购，只补尚未完成的实收部分。”
- “Prepare an order with these mapped products and ordered quantities; nothing has
  arrived yet, so do not create a receipt.”

Validation and tested limitations: [Validation](references/validation.md).
