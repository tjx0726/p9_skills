# Evidence and manifest

Read this before reconciling physical goods with supplier records. Use a small reviewable table or JSON document; a database, formal schema or automation framework is unnecessary.

## Acquire complete evidence

1. Establish the supplier identity for each batch or supplier group from the request and actual issuer evidence. Confirm that supplier's account/store mapping, SKU namespace, document references, currency, tax, discount and selling units. Keep suppliers separate even when names or SKUs look alike. Use the runtime reference's Asmodee branch only for an identified Asmodee batch.
2. Read each photo's actual printed barcode, enlarging it when useful. Keep every digit, including leading zeros, and identify its product and packaging level. A UPC/EAN check digit is only a sanity check. It cannot prove correct reading or derive a missing parent/child barcode. Never replace a photographed value with a similar historical code without resolving the discrepancy.
3. Search the available authorized email and/or Drive sources using supplier identity, an explainable business-date/dispatch window, customer/account, delivery/invoice/packing/sales-order references and product code/name. Expand the window when references point to older documents. Use the relevant supplier's verified sender for email. File names, email subjects and Drive creation/modified times are search hints, not business-date or batch-linkage proof. The newest invoice may be unrelated; one invoice can be dispatched in parts. Do not force an Asmodee search for another supplier or require email to corroborate an adequate Drive original.
4. Open complete dispatch notes, packing slips and invoices. For email, use the attachment identifier returned by the actual search/parent message or an exact filename when documented; do not guess IDs or submit unsupported MIME types. For Drive, inspect file metadata and read/download the complete original, recording file ID/URL and revision when available. A `content_truncated` preview is insufficient. Retrieve all relevant pages/full extraction before relying on a line.
5. Match issuer, account, ship-to, supplier-scoped SKU, packaging, quantities, price/discount and delivery/packing/sales-order references. Approval, packing, dispatch, invoicing and physical receipt are separate states. Use multiple matching facts, not one similar subject, filename, bill-to address or date. Identify copies across email and Drive using document content/fingerprint and issuer/account/document references; the same original is one evidence item with several locations, not two receipts or independent corroboration. Preserve differing revisions and resolve material differences.
6. Download originals only to an authorized task-temporary directory when useful. Inspect important PDF rows on rendered pages for column alignment and unit basis. Cite email message/attachment references or Drive file ID/URL/revision, plus document number and page/line for material fields. Return relevant summaries, not full metadata, repeated extraction JSON or signed URLs. Check usable connected sources before asking for originals; continue supported fields when another supplier's documents are incomplete. Do not bundle private originals with this skill.

## Manifest contract

Keep these fields as columns or equivalent structured keys. Use stable batch and line labels in the task checkpoint. Record a source reference per material field, such as a user statement, photo label, document/page/line or derivation. Tag evidence as `user-confirmed`, `photo`, `document`, `derived`, `user-business-default` or `unknown`. A business default is not independent documentary evidence.

| Field | Meaning |
| --- | --- |
| Batch / supplier context | Store, business date/time and precision, timezone, processor if known, verified supplier identity, supplier account and document references. Record confirmed facts separately from inferences. |
| Product / item code | Identified product and supplier-scoped SKU; preserve identifiers and do not merge another supplier's similar SKU without an evidenced product mapping. |
| Product hierarchy | Parent/child line or product IDs, packaging level (`case`, `display/booster box`, `individual pack/unit`, or other named level), each level's own SKU/barcode and the source for each conversion factor. Unknown identifiers remain unknown. |
| Barcode / barcode level | Exact observed string for this level, source and verification state; specify what a `unit` means. Retain verified packaging codes when correcting an each-level field. A parent label never supplies a child's missing barcode. |
| Identifier aliases | For ISBN-backed products, raw scanner/label value, normalized ISBN-10 and ISBN-13, validation/conversion status and provenance for each. Equivalent ISBNs identify the same edition/format at the same level, not another receipt or parent/child item. |
| Receipt / representation | Actual received level/count; mark derived equivalents, included components or `barcode reference only` rows so they are not additional arrivals. Link every representation to its physical receipt and cost owner. |
| Cases / supply packs | Confirmed count of outer cases or supplied kits, with the packaging type. Leave unknown if only loose boxes are confirmed. |
| Units / sales unit | Total physically received sellable units and their unit, such as booster boxes, B&B boxes or collection sets. State the conversion from confirmed packaging. |
| Physical source / document quantity | User/photo evidence for actual receipt, alongside supplier quantities. A document's ordered/dispatched quantity does not by itself prove receipt. |
| Price basis | Currency, supplier selling unit/pack size, gross or list price, discount/net basis, VAT status and the quantity priced. |
| Cost / cost owner | Received-line cost and any parent kit owning shared cost. Child rows point to the owner; do not allocate or count shared cost twice. |
| RRP / release date | Only values with a verified unit/date basis; identify a per-pack RRP when recording boxes. |
| Operational fields | Only independently supported processor, processed, allocation and transfer facts. |
| Sources / uncertainty | Field-level provenance with original-document identity, email/Drive locations, page/line, calculation and unresolved conflicts. Multiple locations of one original do not add quantity or cost. |

Use `null` or an explicit unknown label in the manifest, blank cells in Sheets, and an intelligible marker such as `not confirmed` in Slack. Zero means a verified zero, not missing information. Treat a genuine zero-priced standalone line as such only when supported by its own pricing evidence.

## Barcode amendments and retained levels

New label evidence for a recorded batch is an identifier amendment, not new physical receipt. Match the supplier/account, store/date/batch references, product/edition and packaging level before replacing a value.

- If a verified display/case code was placed on an each-counted row, replace that row's BARCODE with the newly verified each code and retain the former code, its level and source in that product's notes/parent mapping. If the former value was misread or never verified, retain it as `superseded`/unverified rather than inventing a parent-code relationship. Resolve material identity conflicts first.
- A newly identified child pack keeps its parent's box receipt and code. An optional `barcode reference only` child row links its own SKU/code/level to the parent receipt and cost owner; CASES, UNITS, UNIT PRICE and TOTAL PRICE are genuinely blank with no formulas, not zero. Do not copy parent quantities, allocate cost, or turn a box-to-pack conversion into extra receipt.
- Look for the existing child/reference mapping before adding one. An amendment's identity includes original batch/line, code level and new normalized code/target field; neither an existing batch nor an isolated barcode proves that this specific amendment is already complete.

## Book and periodical identifiers

Use this branch when the product evidence identifies an ISBN, not merely because an arbitrary SKU happens to pass a checksum. Confirm the same book edition/format, supplier SKU and packaging level. ISBN-10/13 are aliases of that item, not a parent/child packaging conversion. Magazines can use ISSN or a `977` EAN; retain those and issue/add-on information separately rather than forcing them into ISBN conversion. `979-0` is ISMN, not ISBN.

1. Retain the exact scanner/label input as text. Normalize only an ISBN label, whitespace, hyphen separators and final lowercase `x`; preserve leading zeros and uppercase `X`. Do not pad missing digits, remove unknown characters, truncate a 2/5-digit barcode add-on or silently repair an invalid check digit.
2. Validate before conversion. For ISBN-10, the weighted sum of all ten positions with weights 10 through 1 (final X = 10) must be divisible by 11. For ISBN-13, alternating weights 1 and 3 across all thirteen digits must give a multiple of 10, and its ISBN prefix must be valid for this procedure.
3. ISBN-10 → ISBN-13: discard the old check character, prefix the first nine digits with `978`, then append `(-weighted_sum(first_12_digits)) mod 10` using alternating 1/3 weights. ISBN-13 → ISBN-10 is possible only for `978`: take positions 4–12 and append `(-sum(body_digits × weights_10_to_2)) mod 11`, writing 10 as `X`. Revalidate the result. A valid `979` ISBN has no ISBN-10: store `isbn10=null` and `not_applicable_979`, not an invented number or an unresolved request for one.
4. Run the bundled [helper](../scripts/isbn.py) from the installed skill folder: `python3 scripts/isbn.py -- "ISBN-10: 0-393-04002-X" "9789889701000"`. It uses only Python 3's standard library, performs no I/O beyond CLI JSON, and returns raw/normalized input, both codes, checksum status and observed-normalized/derived provenance. Exit 0 means every supplied input passed; exit 1 includes per-input errors and preserves valid results. Invalid input must be reread; do not accept a repaired code. `checksum_valid` does not establish publisher allocation or correct product identity.
5. Keep both valid codes in the manifest/intake handoff, with actual observation provenance on the scanned/printed one and `derived` plus input/algorithm on the calculated one. Compare two supplied ISBNs by their validated canonical ISBN-13; a mismatch is a product/identifier conflict. Use an existing alias field or explicit `ISBN-10: …; ISBN-13: …` note if the log has only one BARCODE column; preserve its current primary-code convention. Keep all codes as text. Do not create a second physical row, double-count cost, change SKU/edition or operate POS just to store the alias.

If Python is unavailable, another authorized local deterministic implementation of these formulas may be used after checking the bundled known-pair fixtures. If no execution capability is available, preserve observed identifiers and mark the computed alias unverified until it can be calculated; continue independent receipt work. Do not install a runtime or invent a converted value. The [tests](../tests/test_isbn.py) run with `python3 -m unittest discover -s tests -p 'test_isbn.py' -v` from the skill folder and need no external packages.

Primary references (rules and formulas are bundled above; runtime web access is unnecessary): [Hong Kong Public Libraries conversion/check calculation](https://www.hkpl.gov.hk/en/about-us/services/book-registration/13-digit.html), [Library of Congress converter and 979 limitation](https://www.loc.gov/programs/preassigned-control-number/isbn-converter/), [Library of Congress ISBN structure and applicability](https://www.loc.gov/marc/bibliographic/bd020.html), [GS1 publication identifier types](https://www.gs1greece.org/en/gs1-standards/gs1-identification-numbers-for-products-gtin/gtin-rule-for-the-non-reuse-of-gtin/gtin-13-numbers/identification-and-labelling-for-publications).

## Quantity and cost decisions

Keep the packaging hierarchy explicit. A case may contain displays/booster boxes, which may contain individual booster packs; establish every edge from actual evidence. Do not add counts in different units into one total. A requested split is an optional plan containing the parent quantity to open, verified factor, resulting children and remaining unopened parents. It is not a second receipt or authorization to assemble/split POS inventory. Missing one level's barcode blocks only work requiring that barcode; valid parent receipt records can proceed with the missing child value identified.

| Situation | Required treatment |
| --- | --- |
| Six booster boxes received; outer case not confirmed | Units = 6 booster boxes; cases unknown. Do not infer one case from a common pack size. |
| Two confirmed display cartons, ten boxes each | Cases/supply packs = 2 displays; units = 20 boxes. If the photographed barcode labels the display, retain it with that note. Do not multiply 20 again. |
| Supplier quantity is in sales packs | Convert only with a verified pack size; record both source quantity and received-unit conversion. |
| One booster box contains 12 packs; the user plans to open it | Keep the actual box receipt. Record 12 packs as a conversion of that receipt with the box's and packs' distinct barcodes; never add both as independent stock received or cost. If the pack barcode is missing, leave it unknown instead of deriving it. |
| Two boxes and three separately delivered loose packs arrive | Record two box receipts and three loose-pack receipts at their own levels. A later split of one box would leave one box plus 15 packs when the verified factor is 12; that is a representation of the same goods, not 15 additional arrivals. |
| A supplied kit includes several B&B boxes plus a booster box | Physical components can have separate rows. Put the whole kit cost on one identified parent/owner row and leave child costs blank with an inclusion note unless a separate price is supported. Never silently split the cost. |
| Price per case, RRP per packet, receipt in boxes | Preserve these unit bases in notes. Convert only using known pack sizes. Do not present packet RRP as box RRP. If the sheet has no unambiguous place for a mismatched price basis, leave that price cell blank and note the source value/unit. |
| Invoice covers more than this receipt | Reconcile the received lines/quantities only, including discounts and justified conversions. Do not force the batch subtotal to the invoice grand total. |
| Some cost evidence is missing | Leave those costs blank and identify a partial known subtotal. Do not label it a complete batch cost. |

Use exact decimal arithmetic and the supplier document's rounding basis for money, with the currency policy below. Distinguish ex VAT, discount/net and VAT-inclusive amounts. A derived per-unit cost is valid only when its denominator matches the recorded sales unit. If inherited sheet formulas use a different basis, leave the cost unresolved or document the correct authorized formula; never multiply a kit price by component units. Count each physical receipt/cost once across parent, child and conversion representations.

## Currency policy

- **P9 business default: GBP unless explicitly stated otherwise.** When neither the user nor supplier evidence specifies another currency, use GBP without asking again. Mark that currency's provenance `user-business-default`; do not claim the invoice contained a GBP label. Numeric prices and tax/discount evidence retain their own sources.
- Preserve an explicit currency from the user or supplier document, such as EUR or USD, with the actual source. A Drive original stating EUR remains EUR even for a CW receipt or a GBP-formatted log.
- Do not automatically convert currencies or add unlike currencies into one subtotal. A currency-specific sheet column must not silently relabel an explicit foreign-currency amount; keep its currency visible in an appropriate supported field/note or withhold that cost-cell write until its representation is resolved.
- If explicit sources materially disagree on currency, or clearly establish a non-GBP amount but leave the actual currency unresolved, retain the conflict and ask only about that affected fact. The default does not override contrary evidence. A simple omission is covered by the default and is not such a conflict.

Receipt alone does not mean POS intake, processing, allocation, transfer or payment occurred. Do not set `PROCESSED (Y/N)` or `TRANSFERRED (Y/N)` to `Y`, or fill allocation fields, from arrival alone. Retain native validation and use blank or the template's verified unprocessed default for new rows. Preserve unrelated existing operational values.

When sources materially disagree on identity, quantity, store, price basis or shipment linkage, keep both claims and their provenance. Ask only about the affected facts; withhold dependent values and external writes until resolved. Continue independent, authorized work and identify any withheld lines.
