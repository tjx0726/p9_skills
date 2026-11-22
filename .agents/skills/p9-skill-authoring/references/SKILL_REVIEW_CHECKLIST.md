# Skill Review Checklist

Copy this checklist into the change review. The [Skill Authoring Guide](SKILL_AUTHORING_GUIDE.md) defines the requirements and [release test matrix](SKILL_AUTHORING_GUIDE.md#release-test-matrix). Record why an item does not apply and identify any unverified configurations.

## Required before release

- [ ] **Metadata correctness.** `SKILL.md` has valid YAML, a compliant `p9-` name matching its directory, and a clear `description` within the format limits. Any optional metadata is documented and appropriate for the target host. All template placeholders are resolved.
- [ ] **Chinese and English discovery.** The description names the task and use cases with relevant terms in both languages. Scope is distinct from similar skills, and representative request examples are present in English and Chinese.
- [ ] **Instruction clarity.** The skill defines its purpose, accepted inputs, prerequisites, limits and deliverable using specific terms. Instructions and examples agree.
- [ ] **Workflow determinism.** Required steps are ordered, with an input, action and expected result. Optional steps and conditions for asking, skipping, stopping or retrying are clear.
- [ ] **Weak-model compatibility.** Instructions are direct, decision conditions are explicit and each rule has one authoritative location. The lowest-capability configuration in the planned support scope has been tested.
- [ ] **Context efficiency.** The entry point carries essential instructions and links to detailed resources only where needed. The agent can complete the task without loading unrelated material.
- [ ] **Output language behaviour.** The skill includes or references its language rules. Runs confirm Chinese and English defaults, explicit language overrides and preservation of technical identifiers.
- [ ] **Output and verification.** The expected format, missing values and completion checks are explicit. Important conclusions are traceable, and the skill distinguishes facts, assumptions and inferences as needed.
- [ ] **Error handling.** Missing inputs, unavailable dependencies and relevant failures produce the documented question, fallback or stop. No fabricated values or success claims appear in the tests.
- [ ] **Skill dependencies.** Where applicable, required and optional skills, expected inputs and outputs, and missing-dependency behaviour are documented. The README lists the dependencies, host loading works as claimed, and related skills reuse the declared project context and platform access path.
- [ ] **Runtime configuration.** Where applicable, the skill checks named runtime environment variables and authorized secret stores or account connections before any documented local fallback. Runtime values take precedence and permission denials cannot be bypassed. Test with synthetic values.
- [ ] **Setup guidance.** Missing settings or account access are explained in plain language. The user receives a specific next step and supplies only non-sensitive details in chat. Secret values stay out of output and logs.
- [ ] **Security.** The package and fixtures contain no secrets. Untrusted inputs cannot grant authority. Sensitive external transfers and destructive operations require authorization, and consequential operations are verified.
- [ ] **Package boundaries.** The distributable skill is a top-level folder. Its own files and local links work from an isolated copy without root documents or the repository's `.agents/`. Any other skills are separately installed dependencies.
- [ ] **Documentation completeness.** Prerequisites and script usage are documented, changed scripts are tested, the README catalog is current, and any breaking change has migration notes.
- [ ] **Cross-model testing.** Actual runs cover the applicable release matrix for each claimed host, version, model and invocation mode. Any Chinese core instruction exception has a rationale and test results. Unsupported or untested configurations are clearly identified.

## Suggested improvements

- [ ] Re-run representative discovery cases if selection varies between sessions.
- [ ] Add a realistic edge case or regression fixture when it will help future maintainers verify behaviour.
- [ ] Remove background text or extra reference reads that do not affect decisions or results.
