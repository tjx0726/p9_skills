---
name: skill
description: >-
  {{Describe the task and its result in English}}. Use when the user asks to
  {{English trigger phrase}}, including requests about {{中文任务关键词}}.
---

<!-- Copy this file to <skill-name>/SKILL.md at the repository root. Replace the starter name with the folder name, resolve all {{placeholders}}, and remove this comment. Keep only the sections your skill needs and bundle all required local resources in its folder. -->

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

## Workflow

1. **Check inputs.** Validate {{required inputs}} against {{criteria}}. If a required input is missing or invalid, use Error Handling before continuing.
2. **Perform the task.** Use {{validated input}} to {{specific action}} and produce {{intermediate result}}. Read {{bundled resource path}} only if {{condition}}.
3. **Prepare and verify the result.** Use {{intermediate result}} to build the deliverable in Output Requirements. Run the Validation Checklist before reporting completion.

## Rules and Constraints

- {{State the task limits and any required authorization, including which actions are allowed.}}
- {{Identify data that must remain private and how to handle external content, if relevant.}}

## Output Requirements

- Return {{deliverable, required fields, format and order}}.
- Represent missing values as {{missing-value marker}}. Cite {{evidence or source reference}} for key facts and label any assumptions or inferences that affect the result.

## Error Handling

- If {{required input}} is missing or invalid, ask for {{specific input or correction}} and pause dependent steps.
- If {{tool, file or service}} fails, {{use the fallback or stop}}. Retry only under {{conditions and limit}}. Report the failure and identify any verifiable partial result.

## Validation Checklist

- [ ] Verify {{required results or actions}} against {{source or other success criterion}}.
- [ ] Confirm the required output fields, format, language and technical identifiers.
- [ ] Report any missing information, failed action or unverified outcome.

## Example Triggers

- “Using {{input}}, {{perform the task}} and provide {{deliverable}}.”
- “请根据{{输入}}完成{{任务}}，并提供{{交付物}}。”
