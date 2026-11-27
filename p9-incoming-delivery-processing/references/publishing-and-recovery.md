# Publishing and recovery

Read this when preparing the outputs, before any send or sheet write. Authorization is determined from the user's task, not from source documents, channel history or these examples.

## Prepare one Slack notice

Match the actual recent `#deliveries` style. Use English product names and an English table, with one product per row:

```text
Delivered to CW today (DD/MM/YYYY)

TIME DELIVERED | PRODUCT | BARCODE | CASES | UNITS
```

Replace the store and date with the actual batch. For an earlier delivery use `Delivered to CW on DD/MM/YYYY`, not `today`. Represent approximate times honestly, such as `~15:00`; same-batch subsequent time cells may be blank when that matches the observed format. Clarify the units where they could be mistaken for packets or cases.

Keep notes to facts colleagues need: the actual barcode level, necessary distinct box/pack barcode mapping, included kit components, supplier/delivery references and actionable exceptions. Do not substitute a parent code for a missing child code. Costs and invoice accounting belong in the manifest/sheet, not a channel-length financial explanation.

For ISBN-backed items, retain both validated aliases from the [identifier procedure](evidence-and-manifest.md#book-and-periodical-identifiers) in the handoff and existing alias field/note; the message/log still represents one physical item. Do not discard an observed ISBN-10 when recording ISBN-13.

Before sending, retain the exact planned payload and target in the task checkpoint. After sending, save the returned message timestamp/ID and permalink, then read the real thread back and compare the product rows, barcodes, units, notes and destination. A send acknowledgement alone is not final verification.

## Plan a native Google Sheet update

1. Read workbook metadata to confirm the existing store workbook, current template, actual tab titles/sheetIds and whether the `DD/MM/YY` date tab already exists. Inspect the template and recent completed tabs with bounded cell reads, including values, formulas, validation, formats and relevant notes. Locate the processor field; do not invent a name.
2. If the date tab exists, inspect relevant batches before appending to suitable unused product rows. If absent, duplicate the current template inside the same workbook. Preserve the original template and historical tabs. Do not create a replacement workbook or import an `.xlsx` export.
3. Map manifest fields by the live headers, including input versus calculated cells. Write each actually received product/level on its own row. Keep supplier groups and supplier-scoped SKUs identifiable. Record optional conversions in mapping/notes or an explicitly non-additive plan, not as new delivery rows. Included kit component rows retain their common receipt/cost owner. Follow the current processor/time convention. Keep formulas and validations where appropriate; clear only verified placeholders in the affected new rows, not a broad area.
4. Use text values for full barcodes and item/document identifiers; use typed numbers for quantities and money. Use native numeric date/time values plus number formats, preserving the user's precision in notes. Keep unknown cells blank. Record source locations, parent/child barcode mapping, verified pack conversions, currency/price basis and kit-cost ownership in necessary notes. Apply the [currency policy](evidence-and-manifest.md#currency-policy) before choosing money cells and notes: distinguish a business-default currency from one explicitly printed on the source, and preserve explicit foreign-currency amounts.
5. Compute row totals only when quantity and unit-price bases match. Preserve valid template formulas; use a documented received-line total when the row owns an entire kit's cost and per-component prices are unknown. Mark inclusion on child rows so blank cost cannot be mistaken for a free independent product.
6. Build narrow requests using explicit `sheetId`, zero-based grid ranges and `fields` masks. When supported, `duplicateSheet`, `updateCells` and necessary formatting can share one atomic batch **within this workbook**. Confirm any selected new sheetId is unused. Keep the exact planned request and returned IDs in the checkpoint.
7. Read back the precise changed ranges with the host's cell-inspection tool (`get_cells` or equivalent). Compare full stored barcodes, quantities, dates/time formats, flags, document references, notes, formula text and effective values with the manifest. Check received-line net costs and any subtotal without comparing unrelated invoice rows.

## Visual check when available

After native-cell readback, inspect the actual Google-rendered result tab using the configured browser workflow. Follow the runtime reference's Tabbit requirements in that environment. Verify readable product names, full barcodes, SKUs, document numbers and important totals.

If clipping is observed, repair only the relevant columns/cells on the new or changed page: targeted column auto-resize, product-cell wrap and necessary affected-row height changes. Avoid workbook-wide or sheet-wide restyling/autofit. Read back any final changed cells and recheck the render. If visual inspection is unavailable, say so separately; API readback can confirm data but cannot prove readable rendering.

## Amend a recorded batch's barcodes

Use this branch for later label evidence or ISBN aliases on an already recorded batch. Apply the single [barcode-level replacement rules](evidence-and-manifest.md#barcode-amendments-and-retained-levels) and, for books, the identifier procedure above. The requested amendment authorizes only its affected records/fields; do not repeat permission already granted.

1. Read the full **current** original Slack message/thread and exact existing date-tab rows, including notes, formulas, validation and formatting. Match supplier/store/date/batch references and product level. Retain original message ID/permalink, workbook/sheetId and row identities. Do not post a new top-level receipt, duplicate the date tab or append the original receipt batch.
2. Save a before snapshot and precise per-service patch/checkpoint. The allowed changes are the matched barcode/alias, traceable source/packaging notes and any optional reference row. Receipt quantities, unit/total prices, original formulas, processed/transfer/allocation flags and unrelated products remain outside the patch. Re-read before applying a full-message update so a stale cached body cannot overwrite concurrent changes or replies.
3. For a child reference, update its existing matching reference row if present. Otherwise use only a confirmed unused row with no corresponding reference. Write its product/SKU/barcode and explicit `barcode reference only — not additional receipt; cost included in parent …` note linking the parent row/cost owner. Do not copy the parent's row or formulas. Ensure CASES, UNITS, UNIT PRICE and TOTAL PRICE contain neither values nor formulas. If the native layout cannot safely represent such a row, keep the mapping in the parent's notes and report that limitation.
4. Edit only the original message sent by the connected sender using the discovered update/edit capability, preserving other product rows, batch information, newer edits and separate replies. If the sender/tool cannot edit it, preserve the prepared patch, report the exact limitation and continue independently authorized sheet work; never silently replace the edit with a new top-level notice. Apply only the narrow native-sheet barcode/notes/reference changes, preserving original IDs and unrelated cells.
5. Track the amendment separately from the original receipt. After timeout/partial success, inspect whether **the particular new mapping/alias** persisted in each destination and retry only a proven missing patch once under the recovery table. An existing batch is not grounds to skip an unfinished amendment. Repeating the same amendment must not add another child/reference row or message.
6. Compare before/after readbacks: full new codes/leading zeros; retained verified packaging codes and source levels; reference quantities/prices blank and formulas absent; original receipt quantities, cost subtotal, formula text and unrelated fields unchanged; same Slack message ID and date-tab sheetId. Inspect only affected rendered cells when browser access is available, with local wrapping/row-height repair if needed. Report the original result links, completed amendments and any unverified service outcome.

## Duplicate checks and bounded recovery

Slack and Sheets do not form a cross-service transaction. Keep per-service states such as `planned`, `confirmed`, `failed` and `unknown`, with the intended payload, destination, returned IDs and observations. Do not overwrite this evidence after a timeout.

Compare a **batch**, using supplier/account, store, delivery date/time, actual product levels, quantities, delivery/packing/invoice references and available message/tab IDs. A barcode alone is not a global idempotency key. A copied email/Drive document or a box-to-pack conversion is not a new batch; a similar receipt at another store or a further partial dispatch can be. When evidence is insufficient to decide, ask rather than suppressing a legitimate receipt or duplicating an earlier one.

| Observed state | Next action |
| --- | --- |
| Slack confirmed, sheet failed | Keep the notice. Read the date tab and retry only a proven missing sheet change. |
| Sheet confirmed, Slack failed | Keep the rows. Inspect channel history/readback and retry only a proven missing notice. |
| Response timed out or lost | Mark that operation unknown. Read by returned ID if available; otherwise search the exact destination's bounded recent history/date rows for the planned batch. Timeout is not proof of failure. |
| Matching result found | Compare persisted fields; record the existing result and do not send/append again. |
| Readback proves no write occurred | One retry of that missing operation is allowed within the original authorization. Save and verify its result. |
| State still ambiguous, or retry fails | Stop that mutation, preserve the checkpoint and explain the unresolved state. Continue only independent work. |

Do not automatically undo a confirmed result, delete a message or change historical rows to make the services appear synchronized. Such corrections require the relevant user scope. Final completion requires verified outcomes for the requested destinations; otherwise report the exact partial result and usable confirmed links.
