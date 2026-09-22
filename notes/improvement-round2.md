# One more focused improvement round

17 September 2026. The repository remains private and the website remains local-only. The working tree was inspected before editing; the two files reported as changed matched the current commit, so there were no uncommitted user changes to overwrite.

## Skill

Clarified three source-reading distinctions without adding modes or configuration:

- A status note's date is different from an event date. An old plan is not current confirmation, and an undated “tomorrow” cannot be resolved from the chat date.
- Match people, organizations, projects, and scope before merging claims. A shared nickname does not establish a shared identity.
- Keep denominators and distinguish percentages from percentage points. A higher rate in a different population does not establish a causal improvement.

Four baseline probes already preserved those distinctions. The edits make the written guidance more explicit; they are not presented as fixes for unobserved failures. After editing, all 28 cases were exercised separately. [The captured responses](smoke-results-2026-09-17-round2.json) match the revised skill fingerprint, and no material violation of the case criteria was observed by the implementing assistant. Both older evidence records remain unchanged.

Some outputs are still longer or more formal than necessary, notably the security-source brief. This round does not claim uniform writing taste, perfect reliability, human comprehension gains, or a measured advantage over ordinary prompting.

## Website

An isolated browser reproduced a clipped install command: 227 pixels of visible width for 478 pixels of text at 320px with doubled text. The command is now a wrapping, selectable code block. Copying retains the exact command bytes; no shortened or invalid substitute is used.

A delayed clipboard rejection previously moved focus back to the instructions even after the reader moved elsewhere. The new handler preserves the reader's focus, gives specific manual-recovery guidance, and ignores older copy results when a newer action has finished. Successful instruction copying tells the reader what to do next.

Source disclosures now offer a return link to the exact citation that opened them; direct source visits fall back to the result heading. A regression caught the browser overriding focus when the same fragment was selected again. Preventing that duplicate default action fixed the issue in both tested engines.

The established colors, typography, artwork, layout, private-access warning, bilingual content, and no-JavaScript baseline were preserved. No new dependency, upload endpoint, account, public artifact, or deployment was added.

## Verification and stop

All **26 browser tests passed in one final Chromium/WebKit run**, including source round trips, repeated fragments, complete command wrapping and selection, delayed failures, out-of-order copy results, and the existing language/theme/accessibility cases. All **27 repository/build checks passed**. The revised 6,634-byte ZIP passed the isolated three-client placement check and native Copilot discovery. The scoped mechanical design scan returned no findings.

This finishes the requested extra round. Earlier Lighthouse scores and hosted-CI restrictions were not remeasured or changed; see the [website record](website.md) and [verification record](verification.md). Model trials, browser tests, and human evidence remain separate.
