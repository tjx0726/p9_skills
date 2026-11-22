# P9 Skills

This is the P9 team's internal repository for Agent Skills. Each shared skill has its own folder at the repository root, with a name that starts with `p9-`. Its `SKILL.md` is the entry point and the same folder contains its supporting files.

## Get one skill

1. Find the skill in the [Skill Catalog](#skill-catalog). Check the tasks and dependencies for the skill you want.
2. Copy the complete `<skill-name>/` folder from the root of an existing checkout. If you need a fresh checkout, use Git sparse checkout to retrieve that folder and the top-level files. Set `skill_name` to the exact folder name from the catalog and use an account with repository access.

   ```sh
   skill_name='REPLACE_WITH_CATALOG_NAME'
   git clone --filter=blob:none --sparse https://github.com/tjx0726/p9_skills.git p9-skills-source
   git -C p9-skills-source sparse-checkout set "$skill_name"
   ```

## Install the skill

Choose a location for your local agent host. Project paths are relative to the project where you will run the skill. Copy only the complete selected skill folder into the chosen location so that `SKILL.md` is at `<location>/<skill-name>/SKILL.md`. Agents using the skill start with that file and follow its bundled references as needed.

| Local agent host | Personal location | Project location relative to the project root | Official instructions |
| --- | --- | --- | --- |
| Codex | `~/.agents/skills/` | `.agents/skills/` | [Codex skills](https://learn.chatgpt.com/docs/build-skills) |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` | [Claude Code skills](https://code.claude.com/docs/en/skills) |

If the catalog lists another skill as required, install that skill's folder in the same host as well. Check the host's skill list and try an example request from `SKILL.md`. If the skill does not appear, check the path and follow the host's instructions to reload or restart. For other agents, check the host's own installation and invocation instructions and the skill's tested requirements.

Skills use access the team has already set up where available. If something is missing, the agent explains what it needs and how to connect an account or ask your P9 contact for help. Keep passwords and access keys out of chat.

## Update a skill

Update the source checkout with `git pull --ff-only` and review the change notes for dependency or behaviour changes. Save any local edits you need, then replace the installed folder with the complete updated folder so removed files are cleared. Confirm that the host loads the updated skill and run an example request again. Record the Git revision if you need to reproduce the installation.

## Skill Catalog

Each entry links directly to the `SKILL.md` of a distributable folder at the repository root and identifies any dependencies.

| Skill Name | Purpose | Path | Supported Tasks | Dependencies | Maintenance Owner |
| --- | --- | --- | --- | --- | --- |

## Develop skills in this repository

Read [AGENTS.md](AGENTS.md) and use the [P9 Skill Authoring skill](.agents/skills/p9-skill-authoring/SKILL.md) for creating, updating or reviewing skills here. The authoring skill bundles the [development guide](.agents/skills/p9-skill-authoring/references/SKILL_AUTHORING_GUIDE.md), [review checklist](.agents/skills/p9-skill-authoring/references/SKILL_REVIEW_CHECKLIST.md) and [starter template](.agents/skills/p9-skill-authoring/assets/SKILL.template.md). Keep each new distributable skill in its own root directory and update the catalog as part of the change.
