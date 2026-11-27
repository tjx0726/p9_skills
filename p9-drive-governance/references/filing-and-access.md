# Filing, access and review cleanup

Read for generated-output routing, moves, renames or review cleanup. Apply the locations reference's scope exclusions first. Keep the operation checkpoint private; it may contain file IDs, original locations and access facts that must never become guide content.

## Create and file agent-generated outputs

1. **Select purpose, destination and audience before generation.** A validated result with a known authorised business destination can be saved there directly. A draft, unverified result or unresolved destination goes to the existing `My Drive / 99 Inbox / 01 ChatGPT` staging folder. Resolve and reuse it; do not create a duplicate root ChatGPT folder because another tool defaults there.
2. **Choose a usable name and actual period.** Keep a clear existing name. For new work use its subject/purpose and actual reporting period/version where helpful, not an arbitrary timestamp. Derive reporting dates from records or user confirmation, not file-creation metadata. If a necessary period is unknown, stage/label it and ask only for that fact.
3. **Check the content before calling it official.** Use the appropriate content skill/reader for the artifact. If validation fails, it remains a draft/staged result. A successful upload or readable title alone does not verify its business contents.
4. **File by function, then game/project/event/year.** For validated attendance reports use `05 Events & Community / 02 Pokemon / [Year] / Attendance Reports`, with the actual reporting year. A final report is not forced through staging when purpose, validation, target and authority are already established.
5. **Preserve the working master.** Move the existing original file with its ID and links, not a replacement copy solely for filing. Preserve linked forms, response sheets, fulfilment records and scripts. Do not relink responses, rewrite automation or convert file types incidentally. An explicitly requested copy/conversion is a separate, recorded action with its own ID.
6. **Reconcile tool-created staging deliberately.** If a tool recreates root ChatGPT, inspect its actual contents, references/dependencies, current access and ownership. Consolidate only within scope into an access-compatible existing target. Do not automatically delete the folder, working files or a link target; leave unresolved items in place and explain them.

Routine generated outputs do not each create a major-change entry. If a change to the staging/filing **policy** is being continued, use its existing live register entry as described in the maintenance reference.

## Preserve access before and after moves

| Object/state | Required treatment |
| --- | --- |
| Existing file | Read current audience/principals, roles, ownership and relevant direct/inherited access; compare the target's inheritance before moving and verify the same effective scope afterwards. Preserve both broad and restricted existing access unless a specific change is authorised. |
| Previously unshared file | It remains unshared. Moving under a domain-shared folder is not acceptable merely because that folder matches the business category. |
| New output, no other authorised audience | Restrict to P9 admin. A domain-readable guide does not authorise domain/link/public sharing for outputs. Verify the actual initial destination and created file. |
| Target would broaden, reduce or change ownership | Prepare an access-compatible/restricted alternative before asking for any missing authority. Reuse a compatible existing target or stage the file if that preserves its access; do not silently add/remove permissions to force the desired path. |
| Shared-drive transfer | Check actual ownership/inheritance and dependencies. A same-name folder or available move button does not authorise an ownership transfer or prove compatibility. |
| Permission/owner evidence omitted or denied | Treat it as unknown. Use a permitted supported sharing view if available; otherwise pause that move and report the precise missing check. Do not infer restricted access from an empty/normalised metadata field. |

Record before/expected/after principal-role/owner facts in the private checkpoint. Existing approved named collaborators remain; “make everything admin-only” would be an unapproved reduction for already shared files. Do not add a domain/public/link grant or revoke collaborators as an incidental filing action.

Read current parents immediately before the operation. Replace only the verified source parent(s) intended by the move, preserving unrelated parents/relationships. Read back actual ID, name, parents, audience, roles and ownership. If they differ unexpectedly, stop further dependent moves, retain evidence and prepare the specific correction within actual authority; do not automatically roll back over a newer owner decision.

## Archive, review folder and system Bin

| Destination/state | Meaning and boundary |
| --- | --- |
| Functional folder/year or `90 Archive` | Retained historical business material. Do not treat archived records as disposable or confuse a My Drive archive with a separate shared drive. |
| `98 Trash (for reviewing)` | Ordinary pending-owner-review folder, not system trash. Preserve the original location and review reason privately; retain identity and access. Move only the selected items authorised for review. |
| System Bin | Recoverable trash action, only under the user's deletion scope. Independently inspect content, templates and dependencies before treating a file as verified empty. A title such as `Untitled`, missing size or empty search result is not evidence of emptiness. |
| Permanent deletion | Outside routine cleanup. Do not empty the Bin or permanently delete material under a general filing request. |

Keep owner-retained blank templates and manually restored files. A previous review recommendation is not permission to override a later return/keep decision. Do not move a restored item back merely to complete an old plan. Distinguish verified-empty content from an intentional template or linked input; preserve unresolved items rather than guessing.

## Checkpoint, concurrency and bounded recovery

Before each mutation retain object ID, current version/time when available, names/parents, relevant access/dependencies, the exact intended effect and operation state (`planned`, `confirmed`, `failed`, `unknown`). Re-read material facts before the write; reconcile changed inputs instead of overwriting a newer state from cached data.

- After success, read back the result; an initial response or folder listing alone does not verify all required facts.
- After timeout/lost response, inspect the original object/current destination before repeating. If the intended move/name is present with the required access, record that result instead of moving/copying again.
- If current facts prove the operation did not occur and no owner change is pending, retry that missing operation at most once within original authority. A restored/moved/edited object is not simply a failed write to replay.
- For uncertain creation, look for the specific returned object or narrowly matched intended output before creating another copy. If state remains ambiguous or the retry fails, stop that mutation, preserve the checkpoint and report the confirmed partial work.
- Listings must cover the relevant authorised pages; omissions cannot prove deletion. Continue independent verified actions rather than treating one blocked item as success for the whole batch.
