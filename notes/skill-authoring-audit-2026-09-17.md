# Skill authoring audit

17 September 2026. Scope: the portable Humane skill's metadata, instruction style, size and package structure. No website redesign or new editing workflow.

## Finding and correction

The previous description was valid at 454 characters, but mixed discovery information with execution instructions such as “Lead with what matters.” The new description uses third-person capability wording followed by concrete “Use when” triggers. It is 266 characters / 36 whitespace-separated words. The body still carries the detailed process and safeguards.

The name and Markdown body are byte-for-byte unchanged. The skill remains one instruction file plus its matching MIT license, without runtime dependencies or client-specific metadata.

## Requirements versus recommendations

| Check                        | Result                                                                                                   | Basis                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Required metadata            | Only `name` and `description`, valid quoted YAML with unique keys                                        | Required fields in the open specification; extra fields are optional, not universally invalid                     |
| Name                         | `humane`, 6 characters, lowercase and matching the containing directory                                  | 1–64 characters; no leading, trailing or repeated hyphens; ASCII form compatible with the reviewed clients        |
| Description length           | 266 characters, down from 454                                                                            | Specification limit is 1–1,024 characters, not words or bytes; there is no official 266-character target          |
| Description style            | Third-person capability statement plus specific task triggers                                            | Anthropic authoring recommendation; implementation details belong in the body                                     |
| Discovery scope              | Synthesis, version comparison, drafting and prose editing; explicit Humane invocation                    | Describes what the skill does and when to load it without broad “use for everything” instructions                 |
| Markup                       | No XML/HTML tags in metadata                                                                             | Anthropic constraint, now covered by local validation                                                             |
| Body size                    | 120 content lines / 2,138 whitespace-separated words; entire file 125 lines / 2,179 words / 14,705 bytes | Below the 500-line recommendation and Humane's own 2,500-word / 20 KB maintenance budgets                         |
| Body style                   | Direct action instructions, conditional branches and concrete fictional examples                         | High freedom for editorial judgment, explicit checks for fragile factual and permission constraints               |
| Progressive disclosure       | Metadata for discovery; one body loaded when selected                                                    | No unnecessary reference hierarchy; scripts, research and tests remain outside the installed payload              |
| Dependencies and permissions | No runtime, hardcoded tool requirements, machine paths, profiles or automatic agents                     | No need for `compatibility` or experimental `allowed-tools`; omitted host flags retain default discovery behavior |

The open specification also recommends an instruction body below 5,000 tokens. Word counts are not token counts, and tokenization varies by model; this audit does not claim a universal token measurement. The 500-line and local word/byte budgets are checked directly. The 20 KB and 2,500-word limits are this project's choices, not additional Agent Skills specification requirements.

An activity-based name can be useful, but a gerund is a recommendation, not a format requirement. Renaming the established `humane` invocation solely for that preference would not benefit existing users.

## Verification and evidence limits

The official `skills-ref` 0.1.0 validator, pinned to repository revision 69ef37e9424c0a7ea9dd2293b559e43ec8176379, returned **Valid skill**. It ran in an isolated tool environment without adding project dependencies or installing a personal skill. Local tests additionally cover blank descriptions, XML tags and the Unicode-aware 1,024-character boundary.

The [metadata audit record](metadata-audit-2026-09-17.json) retains the original frontmatter and both fingerprints. Tests reconstruct the previously evaluated document from that frontmatter and the current body, then require its exact original hash. A mutation test confirms that updating the audit's hashes cannot hide an altered body.

The existing [forty-case response record](smoke-results-2026-09-17-editorial-final.json) remains unchanged. Those trials were not rerun or rebranded as current-description results. Native automatic triggering, cross-model reliability and human comprehension are not certified by metadata validation or an unchanged body. See the [verification record](verification.md) for packaging, installation and browser checks.

Completed local checks: 48 Node tests, reproducible 7,152-byte archives, exact-byte installation using Skills CLI 1.5.26 in a disposable project/home, and 52 Chromium/WebKit browser tests in one 50.6-second run. The locked dependency audit reported zero vulnerabilities. Website source and styling are unchanged; its generated copyable/downloadable instructions now carry the new description. Publication remains disabled.

## Primary guidance checked

- [Agent Skills specification](https://agentskills.io/specification): required fields, name/description bounds, optional fields, file structure and progressive disclosure.
- [Anthropic skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices): third-person descriptions, conciseness, body length, examples, appropriate constraints and testing.
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills): discovery fields, directory matching, default invocation and optional client settings.
- [Pinned reference validator](https://github.com/agentskills/agentskills/tree/69ef37e9424c0a7ea9dd2293b559e43ec8176379/skills-ref): source and CLI behavior inspected before running validation.
