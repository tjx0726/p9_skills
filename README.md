# P9 Skills

This is the P9 team's internal repository for developing, sharing and maintaining reusable Agent Skills. Each skill is distributed as a single folder with its instructions and any supporting files.

## Get one skill

1. Open the [Skill Catalog](docs/SKILL_CATALOG.md). Check the tasks and dependencies for the skill you want.
2. Copy the complete `skills/<skill-name>/` folder from an existing checkout. If you need a fresh checkout, Git sparse checkout can retrieve the selected skill folder and the repository's root files. Set `skill_name` to the exact folder name from the catalog and use an account with repository access.

   ```sh
   skill_name='REPLACE_WITH_CATALOG_NAME'
   git clone --filter=blob:none --sparse https://github.com/tjx0726/p9_skills.git p9-skills-source
   git -C p9-skills-source sparse-checkout set "skills/$skill_name"
   ```

## Install the skill

Choose a location for your local agent host. For a project installation, use the root of the project where you will run the skill. Copy the selected folder directly into the chosen location so that `SKILL.md` is at `<location>/<skill-name>/SKILL.md`.

| Local agent host | Personal location | Project location relative to the project root | Official instructions |
| --- | --- | --- | --- |
| Codex | `~/.agents/skills/` | `.agents/skills/` | [Codex skills](https://learn.chatgpt.com/docs/build-skills) |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` | [Claude Code skills](https://code.claude.com/docs/en/skills) |

Check the host's skill list and try an example request from `SKILL.md`. If the skill does not appear, check the path and follow the host's instructions to reload or restart. For other agents, check the host's own installation and invocation instructions and the skill's tested requirements.

## Update a skill

Update the source checkout with `git pull --ff-only` and review the change notes for dependency or behaviour changes. Save any local edits you need, then replace the installed folder with the complete updated folder so removed files are cleared. Confirm that the host loads the updated skill and run an example request again. Record the Git revision if you need to reproduce the installation.

## Contribute a skill

Read the [repository instructions](AGENTS.md) and the [Skill Authoring Guide](docs/SKILL_AUTHORING_GUIDE.md). Start from the [skill template](templates/skill/SKILL.md), add or update the catalog entry, and include the results from the [Skill Review Checklist](docs/SKILL_REVIEW_CHECKLIST.md) with your proposed change.
