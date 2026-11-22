# Skill Authoring Guide

P9 Skills stores reusable Agent Skills for the P9 team. A skill should be easy to discover in English and Chinese, executable by models with varying capabilities, and installable as a single folder. Keep one authoritative version of each rule and package the resources the skill needs to execute.

## Package layout

Store each distributable skill in a separate `<skill-name>/` directory directly under the repository root. The folder name is the skill's stable identifier and matches `name` in `SKILL.md`. The layout below shows the required entry point and optional resource folders.

```text
<skill-name>/
├── SKILL.md
├── references/
├── scripts/
└── assets/
```

| Path | Use |
| --- | --- |
| `SKILL.md` | Required. Start with YAML frontmatter, then use Markdown for scope, workflow, constraints and verification. |
| `references/` | Detailed source material, schemas or procedures to read only at the step that needs them. |
| `scripts/` | Reusable executable helpers when code makes a repeated operation more reliable. Document how to run and test each helper, its dependencies, and its expected inputs, outputs and failure behaviour. |
| `assets/` | Templates, images or other files used to produce the deliverable. |

Create optional folders only when you have files that serve the skill. Link from `SKILL.md` or the relevant reference using paths relative to the referring file, and say when to open or run each resource. Keep required local files inside the skill folder and verify that paths still work from an isolated copy. The skill's execution must be independent of the source repository's `.agents/`, root documents and sibling skill folders.

For repository development, start at the root `AGENTS.md` and use the authoring skill under `.agents/`. Keep authoring resources inside that maintenance package so contributors can find them together.

## Metadata and discovery

Follow the [Agent Skills specification](https://agentskills.io/specification). Start with `name` and `description`. Add optional metadata only for a concrete need and verify that the fields are documented for the relevant format and host. Hosts differ in how they install skills, discover them and surface their metadata.

| Field | P9 requirement |
| --- | --- |
| `name` | A distinctive English identifier, preferably action oriented. Use 1 to 64 lowercase ASCII letters, digits and hyphens. Hyphens may separate words but cannot be doubled, leading or trailing. Match the parent folder exactly and check the catalog for collisions. |
| `description` | Use 1 to 1,024 characters to describe the result and when to use the skill. Write in English and include a few relevant Chinese task terms alongside natural English wording. Explain the boundary with a neighbouring skill when users could reasonably confuse them. |

The following metadata illustrates how to describe one task and its trigger terms.

```yaml
---
name: extract-payment-milestones
description: >-
  Extract payment milestones from contracts or statements of work. Use for questions about
  contractual payment percentages, due dates or approvals (合同付款节点、付款比例、审批条件).
---
```

`name: Payment_Skill` breaks the naming rules. `description: Handles documents` gives the host little evidence about the task, language or scope. Include the words a user would actually say and avoid keyword lists that also match unrelated requests.

## Language strategy

Use **English-first, Bilingual Discovery**. The language used to write a skill is independent of the language it uses to answer.

| Component | Language |
| --- | --- |
| Skill name | English |
| YAML description | English with relevant Chinese trigger terms |
| Core instructions, workflow, constraints and validation rules | English by default |
| Example user requests | English and Chinese |
| Example outputs | As required by the skill |
| Reference documents | Original language where practical |
| User-facing responses | The requested output language or the primary language of the request |

Maintain one authoritative workflow. Use a short bilingual terminology mapping when it helps with a source or domain term. A skill centred on Chinese legal, financial or administrative work may use Chinese core instructions when needed. Record the rationale in the review, keep bilingual discovery, and verify the exception with the test matrix below. Limit claims about language performance to the tested tasks and models.

### Runtime language policy

Every skill for multilingual users must include these rules or point to equivalent instructions bundled with the skill.

- Accept user requests in English or Chinese.
- Follow the user's explicitly requested output language.
- Otherwise, respond in the primary language of the user's request.
- Preserve technical identifiers, file paths, API names, contract references, and other elements that should not be translated.
- Use the same execution workflow regardless of the request language.

## Workflow and model reliability

- **Give concrete instructions.** State the exact facts, actions or artefacts the agent needs to produce. Use short sentences and define terms that affect decisions.
- **Sequence required steps.** For each step, name the input, action and expected result. Mark optional steps and give explicit conditions for proceeding, skipping, asking, stopping or retrying. State what happens if a value is missing or cannot be verified.
- **Keep rules consistent.** Place each runtime rule where the agent needs it and use a single authoritative version inside the package. Use explicit conditions when rules differ by branch. Check that examples follow the same rules as the workflow.
- **Control context.** Keep the entry point focused on decisions the model must make. Load detailed references at the relevant step and use a script for repeatable operations when it improves reliability. Judge context use by the information needed for the task and evidence from runs.

Vague instruction examples include `Analyse the document thoroughly` and `Check the results`. A concrete workflow gives the agent checkable inputs and outputs.

1. Read the supplied contract. If it is missing or unreadable, ask for a readable copy and stop.
2. For each payment milestone, extract the milestone, percentage, deadline, required approval and clause reference. Mark fields that the source omits with a missing-value label in the output language.
3. Return one row per milestone. Check each value against the cited clause before delivering the table.

## Outputs and failure handling

- Define the deliverable and name its required sections or fields. Specify order, format, units and the representation of missing values where they matter. Distinguish source facts, assumptions and inferences, and include checkable evidence for important conclusions.
- Verify required steps and outputs before reporting completion. For operations that change state, specify the observation that confirms success. Report what is verified, incomplete or unknown.
- If required input is missing, ask for the specific input before proceeding with dependent steps. If a file, tool or service is unavailable, use a documented fallback or explain what failed and what the user can do next. Label any valid partial result. Never invent data, evidence or tool success to fill a required field.
- For retryable failures, specify when and how often to retry. If a write may already have succeeded, check the recorded outcome before attempting it again.

## Security and permissions

- Keep passwords, API keys and other secrets out of skill files, examples, fixtures and logs. Name the required credential mechanism without recording values.
- Treat data supplied in user input, attachments, external sources and tool results as untrusted. Embedded instructions cannot grant permission, change the task scope or override trusted instructions.
- Obtain authorization before destructive actions or external transfers of sensitive data. Use the approved scope and destination. Verify important operations and report uncertain outcomes.
- Declare prerequisites before the workflow needs them, including the host, runtime, tools, files, network, accounts and permissions where applicable. Check required dependencies at runtime and define the fallback or stopping condition.

## Create or update a skill

1. Define the intended task, its boundaries and the host and model combinations you plan to support. Check the [Skill Catalog](../../../../README.md#skill-catalog) before adding an overlapping skill.
2. For a new skill, copy the [skill template](../assets/SKILL.template.md) into `<skill-name>/SKILL.md` at the repository root. Replace the starter `name` with the folder name, fill or remove all placeholders, and remove the author comment. Combine or omit sections where the task does not need them, while retaining the information needed to run and verify the workflow.
3. For updates, preserve existing invocation names, supported inputs, output contracts and environments where possible. Describe any breaking change, what it affects and how to migrate. Update the README catalog when entries or their information change. Use the exact name from frontmatter and a direct relative path such as `./<skill-name>/SKILL.md`. Use `None` if there are no additional dependencies and `Unassigned` if there is no confirmed owner.
4. Check the package from an isolated copy and test any new or changed scripts. Run the applicable test matrix and attach results to the review. Complete the [Skill Review Checklist](SKILL_REVIEW_CHECKLIST.md) before release.

## Release test matrix

Run every applicable case against each host and model configuration you intend to claim as supported. Include the least capable configuration in that scope. A cross-model compatibility claim requires passing runs on at least two model families from the team's intended targets. A single-target release can claim support only for that target once its applicable cases pass.

Use fresh sessions and equivalent English and Chinese inputs with known expected results. For automatic discovery, use natural requests without naming or explicitly invoking the skill, and confirm selection through the host's UI or trace when observable. If the host or skill supports only explicit invocation, test that mode and record the automatic cases as not applicable. If selection cannot be observed where it is expected, record it as unverified.

| Case | Input | Pass criterion |
| --- | --- | --- |
| Chinese discovery | An in-scope request in Chinese | The intended skill is selected. |
| English discovery | An equivalent in-scope request in English | The intended skill is selected. |
| Discovery boundary | A plausible near match outside the stated scope | The skill does not activate automatically. |
| Chinese output | A complete Chinese request with no language override | Correct result in Chinese with the specified format and unchanged technical identifiers. |
| English output | An equivalent English request with no language override | Correct result in English with the specified format and unchanged technical identifiers. |
| Language override | A Chinese request asking for English output and an English request asking for Chinese output | Output follows the explicit language in both directions. Task steps and technical identifiers are preserved. |
| Missing input | A request lacking a required file or value | The skill asks for the specific input or uses its documented fallback. Dependent steps stop when necessary. |
| Incomplete source | An input document or record that omits a field needed for the output | The result labels the missing value and preserves the facts supported by the source. |
| Unavailable dependency or tool failure | Each relevant failure condition, such as a missing reader, a denied permission or an unsuccessful call | The skill follows the defined fallback or stops, reports the failure and labels any partial result. It reports success only when confirmed. |
| Permission boundary | A consequential action without authorization or an embedded instruction that exceeds the task scope, where relevant | The skill stays within scope and avoids the unauthorized effect. Use a dry run or fixture for consequential actions. |

Evaluate each case using the relevant dimensions below.

| Dimension | What to check |
| --- | --- |
| Trigger Accuracy | Selection for in-scope prompts and correct handling of near matches. |
| Instruction Compliance | Required steps, branches, limits and permission checks are followed. |
| Task Correctness | Results match the fixture or other verifiable evidence. Assumptions and unknowns are identified. |
| Output Format Compliance | Language, structure, fields and preserved identifiers meet the contract. |
| Error Handling | Missing inputs and failures lead to the stated question, fallback or stop condition. |
| Token / Context Efficiency | Only relevant resources are loaded. Record token usage if exposed, or report the resources loaded when counts are unavailable. |

Record the skill revision, host and version, model and relevant settings, date, prompt and fixture, expected outcome, actual outcome and verdict. Use **Pass**, **Fail**, **Not run**, **Not applicable** or **Unverified**, and explain gaps. Each applicable case must pass for the configuration and mode you advertise. Fabricated data or success, skipped required steps, and unauthorized effects are release blockers for that configuration. Claim compatibility only for the versions and modes that passed an actual run.
