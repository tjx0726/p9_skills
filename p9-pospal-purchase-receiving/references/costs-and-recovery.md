# Cost evidence, receiving units and recovery

## Accept a standalone input or intake handoff

Use one reviewable manifest/table or equivalent supplied facts. Accept the product
intake handoff without a second Slack/Sheets publication or mandatory intake run.
Before acting, refresh current foundation identity, supplier, precise SKU/record IDs,
codes, units and existing order/receipt state. Keep IDs and codes as exact text.

| Input semantics | Minimum for the current stage |
| --- | --- |
| `batch`, `sources`, `businessDate` | Stable batch/line labels; field-level user/original-document provenance, dates/precision and Europe/London business day. |
| `scope`, `exclusions`, `receivingStore` | Latest authorized product subset, canonical target store and supplier; RR=Bow. Note-only/not-arrived/do-not-receive lines are not quantities. |
| `identity`, `codes`, `storeSkus` | Verified receiving-store record ID/business UID/main/extra codes, product code/version/level. A whole all-store intake run is not a standalone prerequisite. |
| `units`, `relationships`, `representation` | Actual physical receiving level, sale/stock units, sourced factors and active strategy; reference/derived/component rows identified so they cannot be received twice. |
| `quantities`, `costOwner` | Ordered paid/gift quantities; actual outstanding paid/gift quantities when receiving; shared kit owner/allocation where relevant. |
| `cost`, `currency`, `tax`, `documents` | Batch net unit price, amount/rounding basis, VAT/currency provenance, sourced external references and retained order discount. Unknowns are not zero. |
| `sellingPrice`, `catalogActions`, `readiness` | Any already authorized catalog effects/status and unresolved SKU mapping; price suggestions remain unapplied. |
| `operations`, `unresolved` | Existing purchase/receipt IDs/numbers and independently checked states, predecessor publishing status, uncertain writes, pending facts and their affected steps. |

For `createPurchase` before goods arrive, ordered quantities and a verified order cost
basis can be sufficient; actual receipts remain unknown and no stock is changed.
External numbers are optional unless sourced or required by the form. For receiving,
the target store and actual quantity/unit are required; no previous batch supplies them.

## Complete documentary cost linkage

Use the authorized supplier/business mailbox or Drive connection, or adequate supplied
originals. Confirm the correct supplier account and receiving-store linkage without
publishing account values. Search with the explainable business-date window, product
code/name and order/dispatch/invoice references, expanding only when those links require it.
Read complete relevant messages/threads and all important attachment/document pages.

Distinguish ordering mail, order confirmation, packing/dispatch note and invoice.
Deduplicate repeated attachments/copies across Gmail/Drive; retain differing revisions.
Bill-to alone can name another store, and the latest document can be another batch.
Match issuer/account, ship-to/reference chain, exact product and sale/pack unit before
using a price. A packing slip may identify a product without proving actual receipt.

Find the **VAT-exclusive price for the actual procurement unit**. MSRP is a selling
price, gross is not net, and a case/kit price is not automatically one component's
cost. Convert tax only when both the inclusive/exclusive basis and applicable VAT
rate are evidenced. Use exact decimal arithmetic and the source's rounding basis.
Do not infer tax from a custom product attribute or apply a blanket rate to unknown goods.

Apply the predecessor's P9 currency policy: preserve explicit source/user currency;
otherwise GBP is the business default with `user-business-default` provenance, not
an invented invoice label. Do not silently convert or add different currencies.

For this P9 workflow, the user's selected basis is the **ordering mail's stated net
unit price with whole-order discount retained separately**. Record that choice and
its batch applicability; do not silently spread the discount over each line. If
sources conflict with this basis, retain both and resolve only the material difference.
A remark about discount is not proof the procurement amount was financially discounted.

Use that batch's evidenced net price for procurement and actual `buyPrice` when cost
maintenance is authorized. Do not overwrite it from an old batch, a custom field
labelled “purchase price”, or a historical moving-average figure. A normal receipt
may apply the store's cost algorithm; compare that result with the actual mode rather
than replacing the source price. The user accepts normal automatic default-supplier
filling during receipt: record and retain it instead of clearing it in another save.

## Paid, gift, kit and physical quantity

Separate physical count, paid quantity, gift quantity and monetary allocation. A
verified free gift has quantity even when its allocated cost is zero. An unknown gift
or kit cost is not zero; get the missing allocation/evidence before that affected write.

A user-approved allocation can, for example, put a two-kit net total of 232 onto 20
small B&B boxes at 11.60 each and two gift booster boxes at zero. This is an explicit
allocation example, not a supplier-wide rule. Preserve its source and cost owner;
never multiply the full kit price by every component or count that cost again on
the outer-kit row. Without an approved allocation, do not invent one.

Keep `paid` and `gift` on real purchase lines and verify physical stock equals both,
after the foundation's actual unit conversion. Use **one** chosen receipt layer:
if boxes are received, their included pack rows are references, not another receipt.
A confirmed `box=36 packs` or `box=24 packs` relationship alone is not an unpack or a
decision to receive packs. Existing stock strategy determines the ledger unit; do
not switch strategies, define a relation and silently convert stock.

## Purchase, receipt and duplicate decisions

Catalog changes across all actual stores do not authorize purchase/receipt in all
stores. Only the current specified receiving store changes inventory; split suppliers
into their appropriate separate purchases. Do not send supplier payments, refund,
post messages or amend source sheets as part of that authority.

Before creation, have the foundation check actual records using store, supplier,
business references, exact SKU/unit/quantity and an appropriate date/state window.
Read pending inbound records too. Server-generated internal numbering/date can differ
from the Europe/London business day; preserve it and use combined evidence, not a
date-only duplicate decision. A local artifact's existence/absence is not backend state.

| Current independently read state | Next permitted segment |
| --- | --- |
| No matching order; sufficient inputs; creation authorized | Create one purchase per relevant supplier/store, then independently query its real ID/number/state. |
| Matching purchase exists, approval pending | Follow the foundation's actual approval workflow/rights; do not duplicate it or claim automatic approval proves an independent audit write. |
| Matching purchase exists, approved/pending receipt | Reuse it and receive only the currently outstanding authorized paid/gift amounts. |
| Partially received | Reconcile previous paid/gift receipts and pending inbound, then use the same purchase for the authorized remainder. |
| Already fully received and ledger/stock agree | Report independently verified `received`; no create or receipt, even if the user repeats CW and RR together. |
| Prior write unknown or multiple plausible records | Read back the actual outcome and narrow the match. Keep `uncertain` and stop dependent mutation if unresolved. |

For a prepare-only request, perform research/readback and return a plan without
mutation. A purchase-only request stops at `purchaseCreated`. Full/partial receipt
uses the foundation's linked direct/staged path, preserving warehouse/area, tax,
quality, units and approval/confirmation rules. Do not guess or rebuild its payload.

Save returned real IDs/numbers and readback status in the private task checkpoint.
After timeout, HTTP 500, an empty/HTML response or a protective assertion, reconcile
the **same** object before proceeding. For example, a confirmed purchase creation
followed by a pre-receipt guard failure requires fresh purchase reading and only the
missing receipt, not a second purchase. If receipt may already have succeeded, query
purchase lines, pending records, ledger and fresh stock before any further mutation.

## Completion proof and the gift pending-quantity trap

Require three independent backend views through `p9-pospal-web`:

1. **Purchase:** correct store/supplier, exact SKU/unit and paid/gift/cost/amount lines;
   actual received and remaining paid/gift quantities match this partial/full stage.
2. **Receipt and ledger:** real linked receipt ID/number, required confirmation and
   correct movements in actual stock units. In the observed contract, `updateStock`
   carried paid quantity while `stockFlowItemExt.giftBaseUnitQuantity` carried gift
   base units. Use the foundation's actual structure/conversion; neither alone proves
   the complete physical increment.
3. **Fresh inventory:** each target SKU's delta equals its authorized physical paid
   plus gift receipt in the real stock unit. Non-target stores and reference packs
   stay unchanged unless a separately authorized stock action exists. Catalog price
   synchronization alone must not move their stock.

The observed purchase HTML `unConfirmedStockFlowQuantity` could be **paid + gift**
pending units: a gift-only line may have purchase quantity zero but nonzero pending
quantity. Reconcile `stockFlowQuantity` and `stockFlowGiftQuantity` separately before
checking totals. Do not reject a gift as an overreceipt merely because paid quantity
is zero, or count it twice by adding an already combined pending value again.
Unit bases must agree before comparing these fields.

Derived DTO `StockFlowQuantity` / `ConfirmQuantity` or aggregate totals can remain zero
despite consistent list/line/ledger/stock evidence. Conversely, an “in stock” label
does not prove line quantities. Keep discrepancies explicit and let the foundation
explain its current contract; do not manufacture success or write a compensating
order just to make a derived value look tidy.

Report `prepared`, `purchaseCreated`, `partial`, `received` or `uncertain` by affected
store/supplier/line. Include paid/gift units, net amount/currency, real document numbers
and independent evidence. Do not claim an invoice paid or native checkout/scanning
verified without the respective authorized action and evidence.
