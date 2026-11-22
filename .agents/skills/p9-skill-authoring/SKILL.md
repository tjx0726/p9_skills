---
name: p9-skill-authoring
description: >-
  Create, update or review distributable Agent Skills in the P9 Skills repository.
  Use for changes to this repository's skill packages and review against P9 authoring
  standards (创建 Skill、更新 Skill、技能规范、技能审查).
---

# P9 Skill Authoring

Use this workflow when developing skills in the P9 Skills repository. Work from its Git root and use its `AGENTS.md` as the repository instructions. Treat the skill's intended task and, for updates, its existing folder as inputs.

Apply the bundled [language policy](references/SKILL_AUTHORING_GUIDE.md#runtime-language-policy).

## Workflow

1. Read the [authoring guide](references/SKILL_AUTHORING_GUIDE.md). Use the README catalog and the actual root directories to find an existing package or check for overlap. If the task or existing package cannot be identified, ask for the missing detail before editing that package.
2. For a review only, skip to step 5. For a new skill, copy the [starter template](assets/SKILL.template.md) to `p9-<task-name>/SKILL.md` at the repository root. Use the same `p9-` name in frontmatter and the folder. Resolve the placeholders and remove the author comment. For an update, edit the requested package in place and document any breaking changes. Keep its required local resources in the package.
3. Declare any [skill dependencies](references/SKILL_AUTHORING_GUIDE.md#skill-dependencies) and how the workflow uses them. If the skill needs settings or account access, follow the [runtime setup rules](references/SKILL_AUTHORING_GUIDE.md#runtime-configuration-and-credentials) for source order and plain-language requests.
4. Update the Skill Catalog in `README.md` when a distributable skill is added, removed, moved or its catalog details change. Link directly to the package's `SKILL.md` and record its dependencies.
5. Apply the [review checklist](references/SKILL_REVIEW_CHECKLIST.md) and verify the package from an isolated copy. Run the applicable tests and report the changed files, results and any unverified cases or migration steps.

## Example requests

- “Create an invoice summary skill in this repository following the P9 authoring standards.”
- “请按本仓库的规范更新现有 Skill，并检查它能否独立安装。”
