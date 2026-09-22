# Making Humane a better editor

17 September 2026. This is source research and a development evaluation, not proof that Humane outperforms another skill.

Someone receiving a long proposal needs to understand what is being asked and what remains uncertain. Someone sending a short personal note needs it to sound like them. Humane already protected many factual details; it gave much less concrete help with paragraph structure, natural rhythm, or deciding what not to change.

The revision keeps the one-skill installation. It adds a practical editing method instead of a catalog of supposedly forbidden words. The website design and authored copy are outside this change.

## Sources actually inspected

Full primary instructions were read at the following revisions. These links are pinned; popularity and installation counts were not used as evidence of effectiveness. No upstream skill was installed or run as a competing baseline.

| Source                                                                                                                                                    | Revision and version                                                                                      | Licensing observed                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Humanizer, Siqi Chen / blader](https://github.com/blader/humanizer/blob/9862685f575c65a8247f90369951df1b3416e3d6/SKILL.md)                               | 9862685f575c65a8247f90369951df1b3416e3d6; skill 3.0.0; 25 grouped patterns                                | [MIT, copyright 2025 Siqi Chen](https://github.com/blader/humanizer/blob/9862685f575c65a8247f90369951df1b3416e3d6/LICENSE)                                                                                                                                                                                                            |
| [Copy Editing, Corey Haines](https://github.com/coreyhaines31/marketingskills/blob/5b2c0007766c6a1cf1d53fd8fc73e979e0821022/skills/copy-editing/SKILL.md) | 5b2c0007766c6a1cf1d53fd8fc73e979e0821022; skill 2.0.0; blob 33110f4bb1be5f2152f838d95191705328760ddd      | [MIT, copyright 2025 Corey Haines](https://github.com/coreyhaines31/marketingskills/blob/5b2c0007766c6a1cf1d53fd8fc73e979e0821022/LICENSE)                                                                                                                                                                                            |
| [Doc Co-authoring, Anthropic](https://github.com/anthropics/skills/blob/34040c9c568585f6929bedeaad110ad08f079624/skills/doc-coauthoring/SKILL.md)         | 34040c9c568585f6929bedeaad110ad08f079624; no version field; blob a5a69839ef4a161131d80b6daef10037a9686f4a | The [README](https://github.com/anthropics/skills/blob/34040c9c568585f6929bedeaad110ad08f079624/README.md) describes many skills as Apache 2.0 and distinguishes four source-available document tools. This directory has no license file and no license field; no specific license is inferred from the repository-wide description. |

These are acknowledgments of ideas studied. Humane's new wording and fictional illustrations are original; no upstream pattern catalog, example passage, or workflow was copied wholesale. In particular, no Anthropic instruction text is redistributed. This is not a claim of affiliation or a legal opinion about upstream licensing.

## What transfers, and what does not

### Humanizer: diagnose an actual writing problem

Humanizer 3.0.0 starts with structural habits: staging before a point, repeated closers, formulaic rhythm, inflated significance and formatting. It also covers voice samples, deliberate author choices, and a check for lost or added information. These are more useful than treating an individual word as proof of AI authorship.

Humane now asks the editor to repair an awkward paragraph around its point, make each retained sentence useful, and preserve prose that already works. It explicitly uses a writing sample for cadence, diction, formality and punctuation, never for facts.

Not adopted: the default em/en-dash prohibition, permission to add a personal reaction when the voice calls for it, or the default pasted-text output of draft plus critique plus final rewrite. A genuine contrast, three real items, a personal sign-off and necessary uncertainty are not defects by themselves. Inventing memories is not a way to preserve voice.

Upstream examples also need scrutiny. Humanizer's gallery rewrite changes “over 3,000 square feet” to “totaling 3,000 square feet.” The lower-bound qualifier disappears. Humane's new quantity test checks this class of problem with different fictional material, alongside ranges and approval scope.

### Copy Editing: separate relevance from proof

Copy Editing's focused sweeps distinguish clarity, voice, reader relevance, evidence and specificity. Later edits are checked against earlier goals. This informed Humane's separate reader/prose checks and final comparison back to the inputs.

Not adopted: seven mandatory passes, repeated user questionnaires, heightened emotion by default, assumed risk reversals, or simulated expert scores as proof. A useful feature can be connected to its supplied mechanism; it does not need invented hours saved, a testimonial, an urgency claim or a guarantee. Those constraints matter for both marketing drafts and summaries of marketing claims.

### Doc Co-authoring: remove dependence on the drafting conversation

Doc Co-authoring tests whether a fresh assistant can answer realistic reader questions using only the document. Humane applies the smaller useful question: does the artifact itself contain the point, reason and necessary context?

Not adopted: mandatory multi-stage brainstorming, repeated 5–10-question rounds, automatic subagents or treating successful AI answers as proof of human understanding. A short note should remain a short task. Actual reader feedback has priority over an assistant's self-review.

## Applied changes and checks

| Change in the skill                                    | Concrete check                                                                                                   |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Diagnose before rewriting; leave effective prose alone | A clear workroom note with real salutations, three required items and deliberate dashes                          |
| Voice sample controls style, not events or claims      | A reading-room note paired with an unrelated ferry sample; no ferry details may transfer                         |
| Repair structure before replacing words                | A padded library update retaining timing, fallback procedure, returns operations and overtime status             |
| Preserve conditions and exact technical content        | More-than qualifier, range, distinct approval scopes; YAML, command, identifier, quotation and link-target bytes |
| Explain relationships rather than merely shorten       | Offline check-ins, syncing and why another device cannot yet show them                                           |
| Attribute material unsupported claims                  | A vendor's claimed 30% saving beside missing verification and annual obligations                                 |
| State useful uncertainty once and stop                 | The existing payment notice, including its duplicate-charge warning                                              |

The original 33 scenarios remain; seven were added before the rewrite. New examples inside the skill are authored teaching illustrations, not measured results. Some are conceptually close to these development cases, so these are not held-out tests.

## Evaluation method

The [preparation helper](../scripts/prepare-evaluation.mjs) copies the canonical skill and generates one task/source file per case under a skill-hash directory. It deliberately excludes acceptance criteria and protected-text assertions. It does not invoke a model or install a skill. The same request serializer and all forty input bytes are used for both revisions, with input-manifest fingerprint a362ef0da20a6288a6cfc5e31ac09ad6d12477883d8d227a58f236b1219e85f8.

The [baseline record](editorial-baseline-2026-09-17.json) contains nine selected tasks plus two repeats under the old 530d07ba728c3f6bb934aea8242dde4bb32dcc8443dc31d5bf5a49aa8317f487 skill. A provider-demand error produced no answer; the same frozen inputs were retried and the error is recorded. Every successful result is retained, not just preferred wording.

The [first revised responses](smoke-results-2026-09-17-editorial.json) retain forty outputs and two repeats under fingerprint 6828674df3ba89a20ce538293dba339d4021bacafa40eae3f0523ad559fde89e. Review found no clear material factual error, but identified trade-offs: the notice lost potentially useful waiting-time uncertainty, the procedure compressed its failure branch into one dense bullet, and “hosts” was less precise than “venue for.” These were not failures in the old baseline. The entire intermediate record is retained, not replaced with improved answers.

The final refinement makes timing expectations, scannable operational branches and quantity meanings explicit. [All forty final responses and both repeats](smoke-results-2026-09-17-editorial-final.json) were then generated afresh under fingerprint 49b6aed9f6a49b4eb2beb09e9c4ead044a6531ecc5ca1c590e9261d0652b3072. Each invocation sees one case, not the acceptance list, other outputs or a preferred answer. Read-only/no-action restrictions also appear in the harness, so safe behavior cannot be credited solely to Humane. The provider's model identifier is not exposed through this interface.

The preparation helper rejects source/output symlinks, including dangling links, and refuses to replace a frozen file with different bytes. Repository tests bind the current skill and exact task inputs to the current response record. They also check declared word limits, the explicit sentence/bullet shapes and protected literal bytes. These are integrity checks, not automated judgments of meaning or writing quality.

One intermediate review assistant reported two mistaken workflow-checkpoint requests, both rejected before state updates. They were outside the requested read-only review and were not part of answer generation. The final reviewer was explicitly restricted to reading the case, source and response files; no such calls were reported. Tool availability and host instructions are part of the evaluation environment, not behavior controlled by this skill alone.

This setup checks whether the instructions help on realistic development tasks. It does not establish superiority over Humanizer, a plain prompt, another model, or the old skill in general. Human comprehension and time savings still need real reader testing.

## What the trials actually show

The implementing assistant and a separate read-only reviewer inspected all forty final answers and both repeats against the prompts and sources. Neither identified a clear material factual error or consequential prompt violation. Hard-shape and protected-byte assertions passed. That is not a claim that all forty answers are strongly edited, nor that all nuances of the acceptance criteria are equally explicit.

The nine matched comparisons do not show a clear overall improvement. This matters: better-written instructions and broader safeguards are worthwhile, but they are not the same as demonstrated better outputs.

| Matched task                                    | Observation, not a quality score                                                                                                                                                                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payment notice, two responses per revision      | Final responses keep pending status, no retry, duplicate-charge risk and unknown timing. The old responses already did too. Final lengths were 28 and 31 words; old lengths were 29 and 26. Shortness alone would give a misleading verdict. |
| Already-good note                               | Both revisions leave it unchanged. This is appropriate restraint, not a newly demonstrated gain.                                                                                                                                             |
| Voice sample                                    | Both keep the specific visit and ambivalence without importing the ferry sample's events. Cadence changes are matters of preference.                                                                                                         |
| Operational update                              | Final and baseline both give the failure branch its own bullet. The final interruption bullet still groups more facts than the baseline; it may be slightly harder to scan.                                                                  |
| Quantities and approval scope                   | Both retain “venue for more than 90,” the conditional estimated range, approval contrast and different quote days. No clear advantage.                                                                                                       |
| Technical Markdown                              | Both preserve every protected literal and improve the prose. The final omits the outer display fence; no semantic advantage is established.                                                                                                  |
| Sync explanation                                | The final states the consequence for the second device immediately. That is a more direct opening; the baseline already explained the mechanism adequately.                                                                                  |
| Vendor claim and obligation                     | Both preserve the unsupported claim and all financial commitments. Attribution format changes, not factual understanding.                                                                                                                    |
| Humane introduction, two responses per revision | Both connect excess text, an existing assistant and understandable/checkable explanations. The new wording is not evidence of a more compelling introduction.                                                                                |

The final ambiguous-notices answer leaves the governing period unresolved, but could state the uncertainty about common applicability more explicitly. This remains a minor explanation opportunity, not a reason to invent a precedence rule or claim a perfect result. The old thirty-three-case record's padded notice and awkward photo introduction also remain available as historical evidence; they are not the matched baseline for this task.

## What changed for users and maintainers

The skill now gives concrete structural editing actions, explicit voice-sample discipline, restraint on effective prose, a reader-context check and a post-edit meaning check. It avoids mechanical punctuation bans, invented personality, guaranteed benefits, mandatory visible passes and automatic agents. Its four short instructional illustrations are original and fictional.

The final instruction is 14,893 bytes and approximately 2,211 whitespace-separated words, up from 14,004 bytes and 2,098 words. The installed payload still has only the instruction and matching MIT license. Both generated archives are 7,246 bytes. No new runtime dependency or user configuration was introduced.

Verification completed locally: 42 Node tests, isolated Skills CLI 1.5.26 installation with exact-byte checks, and 52 Chromium/WebKit browser tests in one 42.6-second run. A clean locked dependency installation reported zero vulnerabilities. The editor's test discovery found no native Node tests, so the repository's tested npm command was used.

Website source, authored copy, styles, animation, source/download behavior and deployment workflows are unchanged. Only the generated instruction text and downloadable skill bytes were refreshed. The repository remains private, Pages is disabled, and the preview remains local and non-indexable. No new Lighthouse measurement was taken.

The next useful validation is unfamiliar people using the outputs, not more self-awarded model scores. The [existing human-reader plan](design.md) remains unexecuted. See the [verification record](verification.md) for client and hosted-CI limits.
