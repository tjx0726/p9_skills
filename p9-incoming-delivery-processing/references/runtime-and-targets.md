# Runtime and targets

Read this before resolving accounts, destinations or tools. This package supplies instructions, not connections, permissions or a fixed connector version.

## Settings and account connections

An explicit destination in the current request takes precedence. Otherwise resolve each applicable non-secret setting in this order: its named runtime environment variable; the same named entry in the host's authorized settings/vault/account configuration; then the verified P9 hint below or a question for the user. No local `.env`, `env.txt` or credential-file fallback is declared. Inspect only the named entries. An access denial or rejected credential goes to the approved reconnect flow; do not bypass it through another account or a bundled hint.

| Optional setting | Value and purpose | If absent from runtime/configuration |
| --- | --- | --- |
| `P9_DELIVERIES_SLACK_CHANNEL` | Channel ID or URL in the authorized P9 workspace | Check the deliveries hint below live. |
| `P9_DELIVERIES_CW_SPREADSHEET` | Existing Canary Wharf workbook ID or URL | Check the CW hint below live. |
| `P9_DELIVERIES_RR_SPREADSHEET` | Existing Roman Road workbook ID or URL | Check the RR hint below live. |

Use the authorized **P9 Gmail** (email evidence), **P9 Google Drive** (saved originals), **P9 Slack**, and **P9 Google Sheets** (native log) account connections provided by the host. Gmail and Drive are alternative or combined evidence paths; neither is mandatory when suitable originals are already available through another authorized path. Names may be presented differently; verify the connected account/workspace and its scope. This skill declares no raw password, token or API-key inputs. If access is missing, explain the affected action and direct the user to the host's secure connection settings or their P9 access administrator. Recheck after setup. Do not request secrets in chat.

## Non-secret P9 hints, observed 27 November 2026

These are starting points, not permanent configuration or authorization. Verify current metadata and user-selected destinations every run. Never infer that another store shares the CW workbook.

| Item | Observed context |
| --- | --- |
| Workspace/channel | P9 Card Game, `#deliveries`, channel `C090S771RD5`: [channel](https://p9cardgame.slack.com/archives/C090S771RD5). `deliveries-toto-claw` is a different channel. |
| CW workbook | [CW delivery log](https://docs.google.com/spreadsheets/d/1vAuMpWMNxejhD0q474xDonrAlPZP1VZz_shCTg6eT98/edit), observed title `CW DELIVERIES`. Find the current template through metadata and recent practice; its title/month can change. |
| RR workbook | [RR delivery log](https://docs.google.com/spreadsheets/d/13oB8QmfDAZqb0DJNylDAzUiCLIyp18PsN3N7Vs87XTE/edit?gid=803013598#gid=803013598), supplied by the user and verified as `RR DELIVERIES`. The supplied `gid=803013598` currently opens the RR template, not a receipt-date tab. Discover the current RR template, headers and date tab live; do not assume the CW layout or treat this initial-view gid as the destination for receipt rows. |
| Business time | Europe/London unless the user explicitly specifies another business timezone. |

Observed CW headers were `TIME DELIVERED`, `PRODUCT`, `BARCODE`, `CASES`, `UNITS`, `PROCESSED (Y/N)`, `FOR CW`, `TO RR`, `TRANSFERRED (Y/N)`, `RELEASE DATE`, `RRP`, `DISTRIBUTOR`, `UNIT PRICE`, `TOTAL PRICE`, `ITEM CODE`, `Delivery/Invoice No.` (then A:P). Discover the actual headers and positions anew. Do not assume a tab named `Sheet1`, a fixed template sheetId, or that old date tabs have this layout.

### Asmodee branch only

Use these overridable hints only after identifying Asmodee as this batch's supplier. Expected accounts email: `accounts@asmodee.co.uk`. Observed account mapping: `CP9C002` = Canary Wharf; `CP9C001` = Roman Road. Confirm against ship-to and document references; bill-to can be Roman Road on a CW delivery. Asmodee's sender, account codes, SKU namespace and packaging terminology are not defaults for other suppliers. Obtain another supplier's own issuer, account/store mapping and document conventions from its evidence.

## Capabilities, skills and fallback

Prefer purpose-built connected tools. Discover live schemas, IDs, attachment MIME support and response pagination/truncation before using them. Use the same platform access path across the workflow and pass the shared manifest once to any assisting skill.

| Capability | Needed for | If unavailable |
| --- | --- | --- |
| Gmail search, read and complete attachment access | Email-only or mixed supplier evidence | Check authorized Drive originals or supplied originals. Missing email does not invalidate a Drive original. |
| Google Drive file search, metadata and complete original-file reading/download | Drive-only or mixed supplier evidence, with file ID/URL and revision when available | Check authorized email or supplied originals. If Drive access is denied, reconnect normally; do not change sharing or bypass permissions. Ask for originals only after checking usable connected sources. If none works, leave document-backed fields unresolved. |
| Slack history, thread readback, authorized send/edit and permalink lookup | Learn format; publish and verify a notice; edit the original sender's message for barcode amendments | Preserve the manifest and prepared draft/patch. Mark style unverified without history. If the sender/tool cannot edit the target, report the limitation and pause that edit; do not silently send a new top-level receipt. |
| Native Google Sheets metadata, bounded cell reads, duplicate-tab and range updates | Inspect template/history; write and verify the existing log | Pause sheet writes. Preserve a row plan; an exported workbook or new `.xlsx` upload cannot replace the requested native update. |
| Image viewing and readable PDF text/page rendering | Verify labels, document rows and units | Use another authorized reader or ask for a readable label/page. A transcription is user-provided evidence, not a visually verified photo. |
| Python 3, standard library only | Bundled offline ISBN validation/conversion helper for ISBN-bearing products | Use the evidence reference's tested deterministic fallback, or retain observations and defer unverified aliases. No extra package installation; ordinary non-ISBN processing is unaffected. |
| Browser rendering | Optional visual check after API readback | Follow the configured browser's recovery, then a permitted fallback. If none works, report visual inspection unverified; do not claim to have seen the page. |

Optional assisting skills, loaded from the current host's available skill catalog or installed `SKILL.md`:

- **Google Drive:** `google-drive:google-drive` where available. Give it supplier/store/date-window and document references or a known file link; expect matching file metadata and readable complete originals with file IDs/URLs and available revisions. Prefer the connected Drive tools/skill over browser downloads. If the optional skill is absent, equivalent authorized Drive tools may perform this evidence path; if both are absent use email or supplied originals. A host-required missing skill pauses that step until enabled.
- **Google Sheets:** `google-drive:google-sheets` and/or `spreadsheets:Spreadsheets`, as exposed or required by the host. Give them the existing workbook/tab, shared manifest and bounded plan; expect native edits and cell/formula readback. Obey their output citation rules. If optional skills are absent but equivalent native tools are available, follow this package's native-sheet procedure. If the host requires a particular skill and it is missing, pause that step and explain how to enable it.
- **PDF:** `pdf:pdf` where available. Give it authorized source PDFs; expect relevant text and rendered rows. Otherwise use a native reader or discover `pdftotext` and `pdftoppm` at runtime. For a safe local PDF, `pdftotext -layout input.pdf output.txt` and `pdftoppm -png -r 140 input.pdf page` are useful; inspect the page image as well as the important extracted rows. Do not install software or assume a binary exists merely because it is named here.
- **Browser:** `tabbit` where configured. Give it the exact result-tab URL; expect an observed render and task cleanup. In the P9 Skills authoring environment use `/Users/tony/.local/bin/tabbit-cli`; on other hosts use their configured default browser capability. Load the installed Tabbit skill before use, run `diagnose`, pin the observed instance, acquire only permitted task tabs and finish while retaining the result page. `--group` is a boolean flag; JavaScript goes through stdin. Honor explicit browser/profile/tab selections. Follow the skill's recovery before another browser and state the reason for a fallback. Do not copy temporary instance/tab IDs into reusable instructions.
