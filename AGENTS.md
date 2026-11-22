# P9 Skills repository instructions

- Use the [P9 Skill Authoring skill](.agents/skills/p9-skill-authoring/SKILL.md) before creating, updating or reviewing skills in this repository. Read its entry point directly if your host does not discover repository skills.
- Every skill in this repository, including those under `.agents/`, must have a `p9-` name and a matching folder.
- Keep distributable skills in their own top-level `<skill-name>/` folder with a `SKILL.md` entry point. Bundle all required local resources in that folder. Use `.agents/` for this repository's authoring workflow, standards and template.
- Follow the [authoring guide](.agents/skills/p9-skill-authoring/references/SKILL_AUTHORING_GUIDE.md) for language, workflow, dependency and runtime setup rules. Use the [starter template](.agents/skills/p9-skill-authoring/assets/SKILL.template.md) for new skills.
- Preserve existing invocation names, inputs, outputs, and supported environments where possible. Document breaking changes and provide migration steps.
- Update the [Skill Catalog in README.md](README.md#skill-catalog) when a distributable skill is added, removed, moved or its catalog information changes.
- Complete the [Skill Review Checklist](.agents/skills/p9-skill-authoring/references/SKILL_REVIEW_CHECKLIST.md) and report any verification gaps before handing off the change.
- Limit edits to the requested skills and their related repository documents. Leave unrelated skills untouched.
