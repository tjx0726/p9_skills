---
name: p9-skill-name
description: >-
  {{Describe the task/result in English and, for a foundational skill, its reusable role for other skills}}. Use when the user asks to
  {{English trigger phrase}}, including requests about {{中文任务关键词}}.
---

<!-- Copy this file to p9-<task-name>/SKILL.md at the repository root. Use the same p9- name in frontmatter and the folder. Resolve all {{placeholders}} and remove this comment. Keep only the sections your skill needs and bundle its required local resources in the folder. -->

# {{Skill title}}

## Purpose / Scope

- Use this skill for {{in-scope task and result}}.
- For {{similar out-of-scope task}}, {{stop or identify the appropriate next step}}.

## Language Policy

- Accept user requests in English or Chinese.
- Follow the user's explicitly requested output language.
- Otherwise, respond in the primary language of the user's request.
- Preserve technical identifiers, file paths, API names, contract references, and other elements that should not be translated.
- Use the same execution workflow regardless of the request language.

## Inputs and Preconditions

- **Required input.** {{File, fields or other information and how to recognise valid input.}}
- **Optional input.** {{Input and the default when absent.}}
- **Prerequisites.** {{Required tools, versions, access or runtime conditions.}}
- **Skill dependencies, if any.** {{Existing foundational skill names, required or optional, when to use/load them on this host, passed context, expected result and missing-dependency fallback.}}
- **Settings or account connections, if any.** {{Exact names, purpose, required or optional, supported runtime sources and any permitted local fallback path.}}

## Workflow

1. **Check task inputs.** Validate {{required inputs}} against {{criteria}}. If a required task input is missing or invalid, use Error Handling before continuing.
2. **Check prerequisites when needed.** Confirm the named skill dependencies in the current host. For declared settings, check named runtime environment variables first, then authorized secrets manager, vault or account connections. If access is denied or a credential is rejected, go directly to Error Handling. Otherwise, read the named entry in a documented local fallback file such as `.env` or `env.txt` only when allowed and the runtime entry is unavailable. Use Error Handling if a required dependency or setting remains unavailable.
3. **Perform the task.** Use {{validated input}} to {{specific action}} and produce {{intermediate result}}. Read {{bundled resource path}} only if {{condition}}. If the step uses another skill, pass {{its required input or shared manifest}} and verify {{its expected result}} before continuing.
4. **Prepare and verify the result.** Use {{intermediate result}} to build the deliverable in Output Requirements. Run the Validation Checklist before reporting completion.

## Rules and Constraints

- {{State the task limits and any required authorization, including which actions are allowed.}}
- {{Identify data that must remain private and how to handle external content, if relevant.}}
- Where credentials are needed, use authorized connections or named values without exposing secrets in prompts, tool output, logs or responses.

## Output Requirements

- Return {{deliverable, required fields, format and order}}.
- Represent missing values as {{missing-value marker}}. Cite {{evidence or source reference}} for key facts and label any assumptions or inferences that affect the result.

## Error Handling

- If {{required input}} is missing or invalid, ask for {{specific input or correction}} and pause dependent steps.
- If a required skill is unavailable, explain what it does and how to add it, then pause the work that requires it. For an optional skill, use {{documented fallback}}.
- If a required setting or connection is unavailable, explain what is needed, why and the next step. Use everyday words in the user's language. Ask only for a non-sensitive detail in chat. Direct account access or secrets to the approved secure setup route and recheck after setup. Never ask the user to paste a password, key or token.
- If an optional setting is unavailable, use {{documented default or skip the affected step}}.
- If {{tool, file or service}} fails, {{use the fallback or stop}}. Retry only under {{conditions and limit}}. Report the failure and identify any verifiable partial result.

## Validation Checklist

- [ ] Verify {{required results or actions}} against {{source or other success criterion}}.
- [ ] Confirm the required output fields, format, language and technical identifiers.
- [ ] Report any missing information, failed action or unverified outcome.

## Example Triggers

- “Using {{input}}, {{perform the task}} and provide {{deliverable}}.”
- “请根据{{输入}}完成{{任务}}，并提供{{交付物}}。”
