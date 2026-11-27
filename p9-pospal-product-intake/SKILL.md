---
name: p9-pospal-product-intake
description: >-
  Match a delivery's confirmed product scope to PosPal SKUs, distinguish reuse,
  alternate barcodes, genuine new specifications and new products, maintain the
  authorized catalog across all actual stores, and hand off a verified SKU manifest.
  Use for 商品匹配、商品建档、一品多码、多规格、大小商品换算、新品全门店同步.
  Requires p9-pospal-web for backend work; follows delivery reconciliation or sufficient
  supplied facts. Purchasing and receipt are a separate downstream workflow.
---

# P9 PosPal Product Intake

## Purpose and language

Turn this batch's confirmed scope into verified store-specific product mappings and
catalog changes. This skill ends at product verification and handoff; creating a SKU
does not receive goods. Accept English/Chinese and use the requested output language,
otherwise the user's primary language. Preserve barcodes, product codes and exact IDs.
Use the same execution workflow for English and Chinese requests.

## Inputs and dependencies

- **Batch input:** an approved delivery manifest, or equivalent user-supplied products,
  actual quantities/levels, supplier, business date and exclusions. User corrections
  override earlier documents; establish scope before searching or creating products.
- **Required foundation:** load installed `p9-pospal-web` through host discovery or
  explicit `$p9-pospal-web`, then its product reference and relevant access/direct-API
  guidance. Give it the authorized catalog store scope, objects/fields and shared
  non-secret manifest. Reuse its identity checks, request context, current contracts,
  exact IDs, single submissions and independent readback. Expect per-store mappings,
  verified changes and unresolved outcomes. A missing/incompatible foundation pauses
  backend work; explain how to install/enable that skill, rather than reimplement it.
- **Required upstream prerequisite when evidence is incomplete:** load installed
  `p9-incoming-delivery-processing` for raw photos/messages/documents or an incomplete
  receipt manifest, following its evidence, runtime and recovery references. Give it
  supplier/store/date/source pointers; expect actual receipt levels, provenance,
  exclusions and publishing status. A complete manifest or sufficient direct user
  facts satisfy this prerequisite: do not resend Slack or append Sheets again.
  If that route needs a missing skill/connection, pause only the affected work and
  give the specific secure setup step. Its ISBN helper may also be reused when needed.
- Resolve dependencies from the host's installed registry and the entry points it
  returns, including registered user links/junctions. Do not hard-code sibling
  checkout paths or an author's private project as dependencies. Keep
  credentials/cookies in the foundation's private runtime, outside the manifest.
- Source lookup may use authorized Gmail/Drive, supplied originals and current UK
  retail evidence. Use the predecessor's runtime/currency policy; an absent connection
  does not block adequate supplied originals. Do not ask for secrets in chat.

## Workflow

1. **Confirm this batch's scope.** Read [Decisions and handoff](references/decisions-and-handoff.md).
   Use the latest user-confirmed receipt/exclusions, not every line on a packing slip.
   When Slack is evidence, read the complete relevant message and thread plus the
   applicable CW/RR delivery-sheet rows and supplier originals. Normalize RR to Bow
   once. Record Europe/London business time and its precision; retain differing server
   document dates. Finish independent research while asking only for material gaps.
2. **Inspect existing identity before deciding.** Through the foundation, verify the
   current full actual-store set, authorized access and per-store product data. The
   current P9 baseline is London, Bow/RR and CW, not historical IDs or a permanent
   store count. Query main/extra codes, names/aliases, product code, series, language,
   version, sale unit, specifications, packaging links and relevant history. A failed
   barcode search alone never establishes a new product.
3. **Choose one action per sale unit.** Apply the four-branch decision table: reuse,
   alternate barcode, genuine specification/version, or new product. Keep box and pack
   SKUs distinct. Resolve ambiguous identity or a collision before that line's write;
   continue independent resolved lines within scope. Record why each action follows
   the evidence, including the current user's explicit version decision.
4. **Prepare catalog and unit changes.** Read the reference's metadata, pricing and
   hierarchy rules. Map the actual physical/receiving/selling/stock units and active
   stock strategy. Verify each conversion edge and the exact parent/child spec. Prepare
   a per-store plan preserving existing non-target fields and history. New products
   go to all verified actual stores with zero opening stock; a receiving-store choice
   does not narrow that catalog obligation. Never copy stock or implicitly unpack it.
5. **Execute the authorized catalog segment.** Call `p9-pospal-web` using its verified
   API-first workflow and normal fallback order. Prefer a verified copy-to-store
   capability where available; otherwise use its established per-store create/update
   procedure. Do not guess a copy endpoint or reuse one store's UID in another. Query
   actual results independently in every target store. An unknown write outcome stops
   that object across skills; do not retry through another tool or start purchasing it.
6. **Deliver the verified handoff.** Update the same manifest with the fields below.
   Distinguish `prepared`, `catalogVerified`, `partial` and `uncertain`; report missing
   store mappings, unapplied price suggestions and blocked lines. The independent
   consumer `p9-pospal-purchase-receiving` can accept this manifest; it is not a
   prerequisite or a purchase/receipt side effect of this skill. The caller checks
   results and current authorization before starting that next segment.

## Output and completion

Return a concise per-line decision/change table and the reviewable manifest described
in the reference. Include source/exclusion scope, actual-store mappings, unit links,
paid/gift quantities, price/cost provenance or explicit unknowns, and each action's
verification state. Preserve predecessor publishing identifiers/status without
replaying those operations. Use `unknown` / `未确认`, never zero for missing costs.

Completion requires unique intended main/extra-code ownership per store, preserved
old specs and protected fields, correct packaging links and zero stock movement from
catalog work. Mark a line ready for purchase only when its necessary mappings/units
are independently verified; cost may remain pending for the purchasing workflow.
Do not claim native checkout synchronization or physical scanner testing without evidence.

## Scope and failures

Catalog authorization does not authorize procurement, stock changes, payment/refund,
Slack/email sending or source-sheet edits. Upstream publishing retains its own scope.
Creating/testing this skill authorizes no production transaction. For missing identity,
store, quantity or packaging evidence, withhold the dependent line and ask only for
that fact. For denied access or uncertain writes use the foundation's stopping and
readback rules; carry `uncertain` forward rather than treating local file absence as failure.

## Example requests

- “Match this reconciled delivery to our products, decide which codes are aliases
  versus new specifications, and verify the catalog in every actual store.”
- “按本批实收清单核对商品；相同商品补一品多码，确认的新版建多规格，新品全门店建档，先不采购。”

Validation and tested limitations: [Validation](references/validation.md).
