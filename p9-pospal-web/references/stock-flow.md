# Purchasing, receipt and two-store transfers

Read [Products](products.md) when product/unit identity or packaging is involved.
Use current permissions and the [test policy](access-and-scope.md#action-scope-and-tests).
Use applicable verified direct HTTP contracts first. Only an unknown/drifting or
UI-only branch needs form observation under the headless-then-Tabbit fallback order.
Historical order IDs and scripts are never a new batch's parameters.

## Purchase creation and confirmation

1. Establish purchase store, supplier, exact SKU mappings, ordered quantities, units,
   costs and tax basis as required by the actual form. An external order/invoice
   reference is needed only when available from a source or required by the form.
   Actual received quantities are required at receipt time, not to create an order
   for goods that have not arrived.
   Resolve net/gross price and currency from the current request and source; do not
   borrow a tax rate or purchase store from a previous batch.
2. Search current purchase and stock-flow lists for the supplier/reference/remark,
   relevant dates and target store before creation. Include drafts, pending receipts
   and relevant stock-flow types; do not search only completed type-12 receipts.
3. Read the purchase-create defaults/configuration directly from
   `GET /ProductPurchase/AddNewProductPurchase` using the authorized request context.
   Parse its known data/input values in memory; a browser page visit is not required.
   Keep its generated internal number,
   date-input value and defaults. Put external references in their proper field or
   remarks; do not manufacture an internal number from an older order.
4. Add the exact mapped lines. Convert pack quantities to the chosen receiving unit
   once. Use the procurement form's own tax fields, not product custom attributes.
   Confirm warehouse/area, supplier restrictions and quality/approval requirements.
5. `POST /ProductPurchase/CreateProductPurchase` once and obtain `purchaseId` with
   `successed=true`. Independently query the
   purchase list/detail and check store, supplier, lines, units, quantities and amount.
   Creation alone does not prove approval or receipt.
6. Read actual state/workflow from `POST /ProductPurchase/FindProductPurchaseWithItems`
   (`id`, `mergeModify=false`) and the list. If pending approval, use an applicable
   authorized confirm/audit contract and reread the state. The mapped
   `/ProductPurchase/AuditProductPurchase` is source-derived, not independently executed
   in the cited auto-approved batch; observe that form if its applicability is unresolved.
   If already approved/waiting
   for receipt with reviewer information, do not approve again. An approved order
   may redirect away from its original editor; this does not justify a duplicate.

### Known purchase form contract

`CreateProductPurchase` is a URL-encoded form with **one JSON-string**
`productPurchaseJson`. Its observed header includes `id=0`, current `userId`,
`supplierUid`, default `orderNumber`, `createdDatetime`, `rationBeginDate`,
`deliveryDate`, actual `limitSupplierProduct`, `remarks` and `productPurchaseFiles`.
Each `items[]` entry carries `productUid`, `barcode`, `quantity`, `giftQuantity`,
`purchasePrice`, `remark`, existing `productSellPrice`, `amount` and `ItemTagMappings`,
plus actually configured unit/file fields. Read current defaults/configuration over
HTTP; preserve omission of undefined `ProductRequestId`, `ConvertUnit` and `files`.
Do not add nulls or guessed status/operator/totals. Native procurement tax fields apply
only when enabled; a known tax-free branch is not a universal tax contract.

For a truly pending approval, the mapped audit form uses `id`, `auditRemarks`,
`productPurchaseFiles` as JSON text and the original spelling `eidtFile=true`.
This is a source-mapped branch; independent audit execution was not proven by an
automatically approved purchase. Follow current workflow/rights and inspect that
same form only when its applicability is not established.

## Direct receipt or staged inbound

Read current received, pending-confirmation and remaining quantities before every
receipt. Do not receive the same units twice or exceed the outstanding authorized
amount. A duplicate/pending warning requires reconciliation, not suppression.

- **Direct route:** from the existing approved purchase use the verified
  `POST /ProductPurchase/CreateStockFlowIn` contract for `商品直接入库`.
  Use only when the actual workflow permits it and required warehouse,
  quality and confirmation selections are satisfied. Continue from the real purchase
  ID; do not create an unrelated generic inbound order to make the stock match.
- **Staged route:** use the known receive/create-inbound contract when that pending
  workflow is established; otherwise observe it under tier 2, then tier 3 if needed.
  Save the actual
  received lines, then inspect the generated pending inbound record. Confirm receipt
  only when that role and the request authorize it. Partial receipt remains partial;
  keep the outstanding lines and do not mark them received for a tidy status.
- If a required area, batch, serial, quality result or approver is unknown, complete
  independent preparation and ask only for that necessary non-sensitive choice.
  Do not disable configuration or bypass required confirmation.

The verified direct form has `productPurchaseId`, `continueNotifyWhenPending=false`
and `stockOrderJson` as JSON text. The latter includes `needCorfirm="0"` (actual
spelling), `remarks`, `expressInfo` and `items`; lines carry `barcode`, `quantity`,
`giftQuantity`, `buyPrice` and `productUnitExchange`, with `SFTaxRate` only when the
real procurement row has that tax field. No shipping information used `expressInfo=null`.
An unassigned/undefined `ProductAreaUid` is omitted, not forced to null. The ordinary
unit builder used null, or `{productUnitName: actualName}` for a real named unit.
Multi-area/quality branches need their actual assignment contract, not this shortcut.
Do not import guessed payment/cost-algorithm/price-update flags from generic inbound.

Submit once. `continueNotifyWhenPending=false`, where present, is not an idempotency
key. After a timeout/500/blank response inspect the purchase's actual received and
pending quantities, generated stock-flow records and product inventory. Do not retry
the receipt until its previous outcome is established; leave it unresolved if needed.

Historical normal purchase receipt returned `sfId`. `/StockFlow/LoadStockFlowJson`
used `stockFlowId` for independent detail. Normal purchase inbound was type 12 with
`confirmed=1` and the correct purchase/store/supplier links. Do not substitute transfer
types 13/15, or `FinishProductPurchase`, for an actual receipt.

### Completion proof

Reconcile three independent views, not just the save response:

1. Purchase list/detail: actual received quantities, pending receipts and remaining
   quantities match this receipt and its partial/full state.
2. Inbound detail/ledger: correct purchase, store, supplier, confirmation and each
   `stockFlowItems` line's product UID, `updateStock`, unit cost and amount.
3. Fresh product stock: increments equal the receipt in the actual stock unit. Do not
   double-count box and piece quantities. Non-target stores and old specs are intact.

Historical derived fields such as detail DTO `StockFlowQuantity` / `ConfirmQuantity`
or `TotalQuantity` / `TotalAmount` sometimes remained zero while purchase-list totals,
HTML row `data-json`, actual stock-flow lines and fresh stock agreed. Preserve and
explain such a discrepancy; do not override independent facts with one derived total.
Check any normal supplier/cost side effect against current authorization. Another
project accepted automatic default-supplier filling; do not assume every user did.
Receipt and invoice payment are separate: do not report an invoice settled without
its authorized financial action and independent proof.

## Independent inbound without a purchase order

Official [inbound instructions](https://blog.pospal.cn/kb/2129) document
`商品 → 货流 → 货流管理 → 进货`. Use this for an authorized independent receipt.
If a matching purchase already exists, continue that original purchase instead of
creating a second inbound for the same goods.

This independent-inbound section has a documented page workflow, rather than a
fully established request payload in this package. Prefer any already verified
applicable business contract; otherwise observe this form with the configured
lightweight headless route and use Tabbit only at tier 3. Return to direct API once
the exact contract is established. Do not substitute the purchase-linked endpoint
without a purchase ID or guess a similarly named generic endpoint.

Select the current store and, when applicable, supplier. Add the exact SKU, actual
quantity in the receiving unit and authorized purchase price; inspect tax/warehouse
requirements. At confirmation, change prepayment and `进货商品更新供货商` only within
the request's financial/metadata scope. Do not infer payment from a receipt request.

Choose `提交货单` for a pending inbound, or `提交并入库` when completed receipt is
requested and permitted. A pending submission does not prove stock changed. Confirm
that same record later when required; do not create another receipt. Reopen its
detail, reconcile actual movement lines and fresh stock increments, and check cost
or supplier side effects. The official branch is documented; this package did not
execute it live. Preserve the same once-only and uncertain-outcome rules as above.

## Two-store transfer

1. Confirm source and destination separately, including their live roles, exact SKU
   mapping, units, transfer quantity, valuation basis and available stock. Capture both
   baselines. Name matching alone does not establish cross-store SKU identity.
2. Read the transfer workflow configuration and visible action labels. Historical
   `/StockFlow/LoadUserProcessSetting` used `processType=5`. `ConfirmStockOut` and
   `ConfirmStockIn` influenced whether submission, dispatch and receipt were separate.
   An empty workflow object is not proof that all approvals are disabled.
3. In the source context submit the established `/StockFlow/CreateStockFlowOut`
   form once. Independently query it, check
   the exact destination/lines and distinguish the outward numeric ID, inward numeric
   ID, business UID, displayed document number and any merged display ID.
4. If dispatch is pending, use the applicable captured
   `/StockFlow/ConfirmStockFlowOutAndCreateStockFlowIn` contract. If the known workflow
   combines submit/dispatch, use that branch once; observe an unestablished combined
   branch with tier 2 / tier 3 rather than guessing its request.
   Reread the source state and the generated destination inbound record.
5. In the destination session/store query that exact inbound record and use
   `/StockFlow/ConfirmStockFlowIn` when required. Do not use the outward ID in an inward-confirm request. If the role
   can dispatch but cannot receive, report the dispatched/pending-receipt state.
6. Independently request both records and fresh source/destination stock and movement ledgers.
   Expected movement in equivalent base units is source `-q`, destination `+q`.
   Explain pending/in-transit stock from the actual state instead of forcing balance.

Historical browser submissions captured the three request contracts, with dual-store
record/inventory reconciliation. They were not an independent HTTP transport trial;
the established same-origin contracts can nevertheless use the current request
channel first. The chain is `/StockFlow/CreateStockFlowOut`, then
`/StockFlow/ConfirmStockFlowOutAndCreateStockFlowIn` (`stockFlowOutId`), then
`/StockFlow/ConfirmStockFlowIn` (the **inbound** `stockFlowId`).
`/StockFlow/LoadStockFlow` provided independently reopened display detail;
`/Inventory/LoadStockChangeHistory` provided movements. Match the current serializer
and workflow instead of constructing a request from these path names alone. Creation
used form `stockOrderJson` plus `updateOriginalStockFlowId=true`; the JSON carried
source/destination IDs, `stockflowTypeNumber="13"`, line `barcode/quantity/buyPrice`,
valuation/workflow fields and its unique business UID. Preserve actual `needCorfirm`
and process settings; do not force confirmation off to simplify a transfer.

Do not run a reverse transfer to hide an uncertain first transfer. A return/reversal
is a separate authorized operation with its own source/destination and stock check.
Historical complete forward/reverse tests prove that tested workflow only; combined
branches and another store's rights still need current validation.
