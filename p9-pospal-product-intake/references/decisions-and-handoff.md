# Product decisions and purchasing handoff

## Establish actual scope

Treat the latest user correction and confirmed physical receipt table as authoritative
for this batch. A packing slip can supply a product code without authorizing receipt
of every listed line. Retain excluded/not-arrived items separately; an explicit
“do not receive” line never becomes intake quantity. Activity materials/promotional
items requested as notes stay notes unless the user gives another instruction.

When using Slack, read the full relevant message, continuations and thread, not only
the first post or a rendered table. Reconcile the applicable delivery-sheet rows for
each involved store with photos and complete supplier originals. Reuse an already
completed predecessor manifest and its publishing status; do not send or append again.
RR and Bow name the same store. Canonicalize that alias before counting stores or work.
Use Europe/London for the business delivery date; preserve a different server-generated
document date/number rather than editing it or treating the difference alone as a duplicate.

## Product identity before barcode

Through the installed foundation, read all relevant stores' current main and extended
codes, product names/aliases, supplier product code, series, language, edition/version,
pack quantity, specifications, group/parent links and relevant inventory/history.
Use bounded complete searches, not a first-page barcode miss. Preserve scanned codes
as text with leading zeros. Product code, short code and barcode are separate fields:
for example, a GW short code such as `83-113` is not its full supplier Product code.

| Evidence after identity lookup | Decision | Required preservation/check |
| --- | --- | --- |
| Same existing product/sale unit and matching identifiers | `reuse` | Keep the SKU and history; change only this request's authorized fields. |
| Exactly the same product and sale unit; another evidenced scanning code | `alternateBarcode` (一品多码) | Keep original SKU/main code, stock and sales history; add a non-colliding alias. Different package scanning codes, UPC/EAN representations or equivalent ISBNs can fit this branch. |
| Same product family but a real specification/version difference, or an explicit user classification as a new version | `newSpecification` (多规格) | Add to the existing family, preserve old specs and map the new spec in every actual store. A barcode change alone is insufficient. |
| Genuinely new product identity, with no evidenced existing match | `newProduct` | Use appropriate existing metadata; create a zero-opening-stock SKU in every actual store. |
| Conflicting identity, code ownership or unit/edition evidence | `unresolved` | Gather the missing evidence or ask only about the affected difference; no guessed write. |

A box and a pack are different sale units even when their contents are linked.
Never solve that relationship by adding the box code as a pack alias. Multi-spec
grouping also does not create a stock-conversion relationship by itself.

The P9 GW example is a **confirmed** 2026 new version with new packaging/code/part
number: add spec `2026`, or `2026 X3` for a three-piece pack. This user-confirmed rule
does not mean every new barcode or changed package must become a specification.

For ISBN-bearing books/magazines, load the predecessor's installed ISBN procedure
and `scripts/isbn.py` helper (or its documented deterministic fallback). Validate
checksums and edition/format, calculate the `978` ISBN-10/13 pair, retain the current
main code and add the other as an alias. A `979` ISBN-13 has no ISBN-10 equivalent.
Do not copy that helper into this package. Search all target stores for collisions
with another SKU before saving; normalization does not establish product identity.

## All-store catalog scope

The current P9 starting roster is London head office, Bow (RR) and CW. Obtain the
actual current roster and per-store IDs through the foundation and authorized project
context. A selector's visible rows alone do not prove organization completeness.
Include newly confirmed actual stores; do not freeze three stores or historical IDs.
If the roster/access is incomplete, disclose the missing stores instead of claiming
all-store completion. Never switch credentials to evade a store permission denial.

New products are always created across the verified full actual-store set. Necessary
aliases/new specs and currently authorized price changes follow the user's all-store
catalog rule too. The receipt target controls inventory only, not this catalog scope.
Use a verified copy-to-store capability when the foundation provides one; otherwise
use its established per-store workflow. Map returned IDs independently in each store.
If a target lacks the parent/family, establish it with a verified method; do not borrow
another store's UID or manufacture a group. Avoid a second create when copying already
created that target. Independently verify each result and retain old specs/history.

Copy/create does not copy inventory quantities or receive goods. Preserve unrelated
existing prices, member/tier prices, tags, tax, suppliers and stock. Zero opening stock
is required for a new catalog record here; opening inventory needs its own authorization.

## Physical hierarchy and stock semantics

For each line record physical packaging edges, source of each factor, actual receipt
level, sale unit, parent/child SKU/codes and active inventory strategy. Examples are
case → display/box → individual pack; the word “unit” alone is insufficient.

- An evidence-confirmed regular Pokémon booster box can be `36 packs`; the confirmed
  ordinary YGO booster-box example is `24 packs`. Do not use either factor for every
  series/product. Packaging, supplier or explicit user evidence governs exceptions.
- A B&B display may hold ten small boxes, and a collection outer may hold six sets.
  Verify that batch; containing boosters does not make either `1:36`.
- Re-read existing assembly/disassembly links before adding them. Check direction,
  factor, units and the exact new child spec, not an obsolete SKU. Do not add a duplicate
  link, reverse it, or let a new three-piece version refer to the old single-piece spec.
- Ask the foundation to distinguish separate big/small stock from minimum-unit virtual
  stock. A physical pack count is not automatically the receiving-to-stock factor.
  For separately stocked boxes, receiving two boxes increases box stock by two; the
  reference packs do not also arrive. Preserve the existing store strategy.
- Defining a relation does not assemble/unpack or sell anything. Any real inventory
  conversion requires separate scope and its own verified movement. Hand off only
  one selected receiving level per physical receipt; mark components/alternate
  representations as `referenceOnly` rather than additional received rows.

## Metadata, selling prices and costs

Match first, then reuse appropriate existing category, brand, supplier and tax-field/
tag definitions. Do not create near-duplicate metadata. Unknown tax treatment is an
unresolved fact, not a reason to default every product to 20%.

For an ordinary new product with no authorized selling price, create at `0` and
research current matched UK retail evidence for a separate suggestion. A suggestion
does not authorize a price update. An explicit user selling price is applied across
the authorized all-store catalog. Ordinary YGO series can use comparable existing
PosPal prices as a reference, with matching product/unit context; no fixed unit price
is a permanent default.

GW new products/specs use the sourced order-document **MSRP** as their supplier-domain
rule. Reuse an existing GW / Games Workshop / Warhammer brand and GW / Games Workshop
supplier. Do not generalize MSRP to unrelated suppliers or confuse it with cost.
Books/magazines use existing 0% tax configuration when supported by the evidence;
other applicable batch items can use the evidenced 20% configuration. Unclear products
need their own evidence. Preserve unrelated current metadata on existing products.

For authorized cost research, reuse the declared upstream evidence procedure: match
complete supplier originals to this batch/account/store and product unit, distinguish
net from gross/MSRP/case price, retain currency/VAT/discount provenance and resolve
material conflicts. Cost maintenance uses the foundation's actual `buyPrice`; a custom
field with the same display label is not actual cost. Unknown cost stays unknown.
New-price `0` is not a zero-cost claim. Hand unresolved cost/allocation to purchasing
without needing a file from that downstream package or inventing a value.

## One reviewable handoff

Extend the existing receipt manifest/table instead of forcing a new file format.
Keep stable batch/line labels and field-level sources; the following semantics can
be columns or equivalent structured keys. IDs/codes stay exact text. Private runtime
secrets, cookies and browser instance details never enter it.

| Handoff content | Required meaning |
| --- | --- |
| `batch`, `sources`, `businessDate` | Supplier/source pointers, original identity/revision/page/line, latest user correction, Europe/London date/precision and any distinct server date. |
| `scope`, `exclusions`, `catalogStores`, `receivingStore` | Actual received/product scope and excluded/note-only lines; canonical store aliases, verified full catalog roster and separately authorized receipt target or explicit unknown. |
| `identity`, `codes` | Product code versus short code, name/family/language/version, original scanned code, normalized main/alias codes, level and verification status. |
| `units`, `relationships` | Physical parent/child hierarchy and factor sources; sale/receiving/stock units, active stock strategy, mapped parent/child specs and receiving-to-stock conversion. |
| `decision`, `catalogActions`, `storeSkus` | Four-branch conclusion/rationale; per-store product record ID/business UID/main/extra codes/group or parent map; planned/completed changes and independent verification. |
| `quantities`, `representation`, `costOwner` | Ordered/actual paid/gift quantities at the chosen receiving level, physical versus derived/reference-only rows and any shared kit cost owner. |
| `cost`, `currency`, `tax`, `documents` | Sourced net unit cost/amount, explicit unknowns, VAT/currency provenance, unapportioned discount, supplier order/invoice/delivery references and approved allocation or pending conflict. |
| `sellingPrice` | Authorized current value versus unapplied suggestion, evidence/unit basis and store synchronization status. |
| `operations`, `readiness`, `unresolved` | Predecessor publishing status/links, actual existing purchase/receipt state, catalog verified/pending stores, receiving-map readiness, unresolved facts and uncertain writes. |

State catalog completeness separately from receiving-map readiness. The purchase
consumer can accept supplied equivalent SKU facts independently, but must reread its
current identity/SKU/order states. A linked uncertain write blocks dependent mutation
until reconciled, even if the next skill starts in another chat. Product intake itself
does not create a procurement order, alter stock or republish the receipt log.
