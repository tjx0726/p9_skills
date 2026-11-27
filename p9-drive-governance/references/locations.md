# Locations, settings and operating boundaries

Read before resolving the P9 account, folders or guide. All bundled locations are non-secret lookup hints from the supplied policy, checked as text on 27 November 2026. Verify current IDs, names, parents and access at runtime; a location is not authority to write or share.

## Runtime configuration

Use an explicit current-task value first. Otherwise check the named environment entry, then the same named entry in authorised host settings/vault/account configuration, then the baseline below. No local `.env`, `env.txt`, credential-file fallback or raw password/token input is declared. Access denial/rejected credentials go to secure reconnect; do not bypass them with another account or baseline value.

| Optional non-secret setting | Purpose | Baseline when absent |
| --- | --- | --- |
| `P9_DRIVE_ACCOUNT_EMAIL` | Identify the intended P9 account/connection | `admin@p9card.games`. Verify the connected identity; Personal is outside scope unless explicitly added by the user. |
| `P9_DRIVE_RULES_FILE_ID` | Current Drive-root `AGENTS.md` | `1YTDJABPy9TrCS0WykIMQuvCESfbdtdGL`. Read as the current raw Markdown policy; do not assume cloud storage installs it. |
| `P9_DRIVE_STAGING_FOLDER_ID` | Existing generated-output staging folder | `1dU6tMFrWNgCl_bxqJe7qzewd-farvnGf`, observed at `My Drive / 99 Inbox / 01 ChatGPT`. |
| `P9_DRIVE_GUIDE_FILE_ID` | Existing native Google Sites file | `1bX1QRu3qhaIJbeMHl3_RkR6BHbk3x8Ns`, retained at My Drive root. |
| `P9_DRIVE_GUIDE_URL` | Canonical published guide | [P9 Drive Guide](https://sites.google.com/p9card.games/p9drive). |

Resolve My Drive from the authorised account rather than another account's cached root. Observed `99 Inbox` ID is `1MmvVgWrTgID52XVgzV4lG8pGfcEcT9pq`; verify staging is still its intended child. If a hint now points to a renamed/moved object, reconcile current policy and owner changes instead of silently recreating the old path.

## Protected scope and names

- **Employee workspaces:** `40 Tony`, `51 Serena`, `52 Sara`, `53 El`, `54 Adam`, `61 Gabriel`, `62 Steven` and all descendants are excluded from routine organisation. Resolve their current identities at the root and exclude them before traversal; do not inspect their children to find cleanup work. An extension needs explicit task scope.
- **Automation:** preserve `My Drive / 04 Purchasing & Inventory / 03 Account Backorders`, observed ID `1rzIgtbytV2fEP4ygim_ZYOiScZspxhgc`, and its whole subtree, including the Asmodee archive. Do not rename/move it or its monthly files as a numbering/cleanup step. A request specifically changing it must address the actual automation dependency before that change.
- **Naming:** top-level and second-level business folders use the two-digit `NN Folder Name` pattern (the `00 Folder Name` convention). Preserve the existing correct number/order and reuse categories; do not prefix every folder literally with `00`. Deeper game/campaign/year folders can use descriptive names. Technical `.agents` and owner-designated exceptions remain exceptions.
- **Root objects:** keep the native Drive Guide and Drive-root `AGENTS.md` at My Drive root. Cloud guidance belongs under `.agents/skills/`; this repository package is installed separately through the host, not by moving cloud folders.
- **Retained decisions:** preserve `P9 Card Game Staff Handbook` at My Drive root, technical `Tony's Code` naming exception and approved sales-record placements. Use current owner exceptions to identify exact affected objects; do not package private file inventories or publish those file details in the guide.
- **Restricted deliverables:** preserve the limited-access boundary of Pixie deliverables under `06 Marketing & Design / 01 Design / Pixie / Deliverables`. A shared business parent is not permission to widen that subfolder's audience.
- **Connected records:** keep preorder forms, response sheets and fulfilment records in their existing game/campaign relationships. Retain case invoices when reviewing claim photographs; one removed photograph does not make its invoice disposable.
- **Legacy scope:** My Drive `90 Archive / 01 TOM` and the separate TOM shared drive are different locations. Preserve any owner-approved distinction between an externally owned original retained in My Drive and a company-owned shared-drive copy. That exception does not authorise other copies or ownership transfers.

For guide publication, exclude the entire Finance & Admin area and private report details using the maintenance reference. This is a publication boundary, not a ban on separately authorised private finance work. Avoid collecting excluded contents just to build the guide.

## Capabilities and skill handoff

Prefer current purpose-built connectors over a browser when they fully support the operation and verification. Discover schemas/account selectors at runtime; never persist a session `link_id` in this package.

| Capability / assisting skill | Input and expected result | Missing/limited behavior |
| --- | --- | --- |
| Authorised P9 Drive lifecycle and effective-access inspection; optional `google-drive:google-drive` | Scoped IDs/selection and plan; current names/parents, owner, principal roles/inheritance, file create/move/rename/review actions and readback | Load the host's available skill/entry point when present or required. Equivalent authorised tools/UI may be used; otherwise pause dependent writes. Missing ACL fields or `shared=null` are unknown, not private-access proof. |
| Optional/host-required `google-drive:google-docs`, `google-drive:google-sheets`, `google-drive:google-slides` or the host's applicable artifact-authoring skill | Shared purpose, validation target, selected destination ID, audience and existing master ID if any; expected file ID/link, validation outcome and observed permissions | Load only the applicable installed skill via the host catalog. Respect host-required authoring routes/citations. This explicit P9 destination overrides a generic root ChatGPT default. Do not let a returned artifact's assumed audience substitute for permission readback. |
| Existing native Google Sites editor, via a sufficient connector or configured browser | Exact existing site/file/page, current embed and requested data/rule patch; saved draft, canonical publication and audience proof | A generic website/Sites-plugin builder is not an equivalent target. If native editing or verification is unavailable, keep the prepared patch and report that segment incomplete. |
| Configured browser skill; normally installed `tabbit` here | Exact existing editor/verification URL, authorised actions and checkpoint; visible state and task cleanup | Load its installed `SKILL.md`. Follow user-selected browser/profile/tab, stable launcher, diagnose/observed instance pinning, ownership and recovery. Keep result/user tabs and finish. After recovery, state why another permitted browser is needed; do not assume installation from a tool declaration. |

These are conditional capabilities, not automatically installed dependencies. None of the current P9 PosPal foundations provide Drive/Sites lifecycle work; do not add that unrelated dependency. Do not implement platform login or credential storage here.

Use paginated folder listings and exhaust relevant continuation tokens within the authorised scope. A search omission or default 100-child preview is not a full inventory. Check capability for the exact object type and action: an unsupported whole-folder transfer does not prove that individual-file transfer is unsupported. If the required trash-state/transfer capability is missing, use a supported native view only when needed; do not repeatedly call an unsupported mutation. Preserve raw Markdown MIME type and file ID if specifically authorised to update cloud instructions; never silently convert them into native Docs or upload duplicate replacements.
