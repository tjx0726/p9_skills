# Products, alternate barcodes and stock strategies

Evidence levels and source dates are in [Evidence](evidence-and-validation.md).
The paths below include historically executed direct HTTP contracts. Prefer those
same-origin business requests when the deployment, schema and authorization match;
they are not a public API guarantee. Inspect the same form only for an unknown or
drifting contract, using lightweight headless first and Tabbit only as the third tier.

## Read, edit and create

1. Query `/Product/LoadProductSummary` and `/Product/LoadProductsByPage` under the
   requested store, then `/Product/FindProduct` for exact details. Search the exact
   barcode and alternate barcodes, then inspect all plausible matches and the detail.
   Use name, product code, packaging and specification to resolve identity. Read all
   pages in the selected scope before claiming absence; a first-page miss is not proof.
2. Keep record `id`, business `uid` / `productUid`, store `userId`, `categoryUid` and
   `supplierUid` separate. Category/supplier links use their UID, not their list-row ID.
   Capture numeric JSON IDs losslessly before ordinary JavaScript parsing; see the
   [Games helper](members-and-games.md#pure-local-helper) for a raw-text parser.
3. Reuse an existing product for the same sale unit. An alternate barcode is an alias;
   a different specification or independently stocked package may need its own SKU.
   Do not use a changed package barcode as automatic proof of a new product.
4. For edits, read fresh details, use the verified writable projection and change
   only requested fields. Opening the editor again is unnecessary unless its
   contract is unknown or the response/configuration has drifted. Preserve non-target prices, tax,
   stock flags, category, supplier, units, brand, tags, images and custom attributes.
   A lookup DTO may contain derived/null fields the save contract cannot accept safely.
5. For creation, reuse valid store metadata and explicitly set the requested defaults.
   Product creation is not purchasing or receiving; use zero opening stock unless the
   user has authorized opening stock. Do not turn a reference price into cost or vice
   versa. Do not synchronize to additional stores without the requested store mapping.
6. Submit the verified direct save once, request the product detail independently,
   and compare the exact requested
   fields plus protected non-target fields. Verify there is one intended product per
   barcode and that creation/edit alone caused no unrequested stock movement.

Verified direct HTTP reads include `/Product/LoadProductSummary`, `/Product/LoadProductsByPage` and
`/Product/FindProduct` (`productId`). A single save used `/Product/SaveProduct`
with `productJson` as a JSON string; multi-spec saves used `/Product/SaveProducts`.
Use the established form projection without a browser prerequisite; inspect a handler
only if applicability is unresolved. A success message does not
replace a fresh product query.

Do not assign a universal meaning to `attribute1`..`attribute10`. Their meanings vary
with industry/settings. In particular, a custom field labelled purchase price is not
necessarily the actual `buyPrice`. Use current metadata, not a historical label.

## Extra barcodes

1. Search each proposed alias in the selected store's main and extended barcodes.
   If it belongs to another SKU, stop that alias change and resolve the identity
   conflict. Do not merge or delete products to make the collision disappear.
2. Merge with the product's current aliases, deduplicate exact strings and exclude
   the main barcode. Preserve leading zeros and existing unrelated aliases.
3. The directly saved projection was
   `productExtBarcodes: [{"extBarcode":"TEST-ALIAS-001"}]`, an object array rather
   than a string array. Preserve the current contract; generated lookup IDs should
   not be blindly echoed as writable alias fields.
4. Save the existing SKU through the known API, query it and the alias independently. Check that it
   resolves to that same business UID and did not change price, specification or stock.

For books, ISBN-10 and its convertible `978` ISBN-13 may be aliases of one edition.
Validate checksums and edition identity first. `979` ISBN-13 has no ISBN-10 equivalent.
Do not create a separate product solely for the other ISBN or replace a working main
barcode. This skill does not impose another project's ISBN or brand/tax defaults.

## Multiple specifications and conversion relationships

Ordinary multi-spec groups have distinct SKU UIDs/barcodes. Historical mappings were
`attribute5` = group/SPU string, `attribute6` = specification label and
`attribute7="1"` = main specification. Other group members could have `"0"` or an empty
main flag; do not normalize every blank to zero. The group key is not a product UID.

For adding a specification, preserve the current group and existing specs. Choose
the requested sale unit, barcode, label and price; confirm which SKU is the default.
Independently query every affected spec and its shared group after saving. Packaging with an
explicit size conversion needs a relationship in addition to shared group membership.

Historical new multi-spec saves carried `productsJson`, `caseproductsJson`,
`specProductOrders` and `isMulColorSize=false`. Packaging links contained:

```text
caseProductBarcode, caseProductUnitUid,
itemProductBarcode, caseItemProductUnitUid, caseItemProductQuantity
```

These link the actual big and small barcodes and units at creation. A historical
direct HTTP save/readback also established a `1:36` packaging relationship; that is
evidence of the tested contract, not a default pack size. Confirm positive
conversion quantities from the user's physical pack size. For `1 box = 10 pieces`,
the relationship is not a price ratio. Read `moreSpecProducts` and `caseproductItems`
from the independent product detail. Unit mappings such as `productUnitExchangeList`
do not by themselves prove that a multi-spec or assembly relation exists.

`/Product/LoadCaseProductWithItems` and `/Product/SaveCaseProduct` provide the known
existing-pack relationship route. The separate `/Product/CaseProductItem` page is a
fallback for observing an unresolved configuration contract. Use the current mode
and verified request, not a
guessed `isCaseProduct` flag. Avoid multiple competing parent packs for one small SKU
without understanding the current selection behavior.

## Two different inventory strategies

| Strategy | Meaning and verification |
| --- | --- |
| Separately stocked big and small SKUs; assemble/unpack | An unpack of one big pack reduces big stock by 1 and increases small stock by the conversion quantity. Assembly reverses those movements. Read both SKUs and both movement records. |
| Minimum-unit inventory with virtual large packs | Large availability is derived from small-unit stock. A large sale consumes small stock times the conversion factor; it is not a shortage-triggered unpack of separately stocked big items. |

In historical source/page inspection, the minimum-unit path used `attribute9="5"`
and a store setting which can migrate/clean existing relationships. This branch's
live sales/refunds were not established by traditional unpack tests. Do not set the
flag, flip the store setting or migrate relations as a shortcut to add one package.
Read the current configuration and choose the already active strategy.

The relationship API save proves configuration only. For requested web assemble/unpack
execution, prefer an already verified web execution contract. If none is known, inspect
the actual control under tier 2, then tier 3 only when needed; do not invent a native
endpoint. Record the current pair of stocks, units and conversion,
perform the isolated authorized action once and reconcile both resulting stocks and
the inventory ledger. If execution exists only in native checkout, report the web
configuration result and the execution gap; do not switch to native automation.

Do not count both one received box and its constituent pieces as two receipts.
Deleting a test relation/product does not undo inventory movement. Reconcile stock
and dependent objects before authorized cleanup, and preserve audit records.
