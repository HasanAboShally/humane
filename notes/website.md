# Website and Pages hosting

## Current state

The owner originally selected **local preview only** on 17 September 2026. On 22 September the owner separately approved the public repository, experimental v0.1.0 release, and GitHub Pages site and skill downloads. The [launch record](release-v0.1.0.md) records pre-publication checks; the versioned release and Actions runs record live outcomes. No domain registration, DNS change, directory submission, or marketing campaign is included.

The website is static HTML, CSS, and a small progressive-enhancement script. It is English-only at the owner's request. Light is the first-visit default; explicit dark/light preferences are saved and restored. Keyboard-operated examples, inspectable sources, real ZIP downloads, and manual copy fallbacks remain. The hero names the reading burden, the free Agent Skill, and one coherent explanation with a way back to the originals. MIT licensing and experimental-release status remain a separate line. The remaining Manrope font is self-hosted. The installed skill still contains only instructions and its license, and can respond in the user's requested language.

## Run and check locally

From this repository:

```sh
npm ci --ignore-scripts
npm run dev:site
```

Open [the local preview](http://127.0.0.1:4178/humane/). The server binds to 127.0.0.1 only and serves the built website directory, not the repository. There is no language switch or alternate-language route. A custom port can be supplied through PORT.

To build without starting a server, use `npm run build:site`. The output is dist/site; the skill download bytes come from the canonical package, not a duplicated website prompt. `npm run pack:skill` separately creates the standalone archives.

For browser checks:

```sh
npx playwright install chromium webkit
npm run test:site
```

`npm test` runs repository, package, evidence-integrity, static-build, and deployment-gate checks. Browser tests are separate. They use isolated contexts, never the user's shared browser storage.

## Historical palette rollback

The owner found the neutral-surface experiment too gray and requested reverting the last change. The original green-tinted palette was restored across the page, paper, sections, dividers, browser chrome, 404 and social card. At that point the site, scripts and tests were byte-for-byte identical to the pre-palette revision d48d072; dark mode, subtle animation, copy, skill and SEO/GEO work were preserved. The following measurements describe that development step, not the later release-copy changes.

All **37 Node checks and 52 Chromium/WebKit tests passed** in the rollback verification; the browser run took 52.1 seconds. The preview was rebuilt without enabling indexing or Pages. The neutral-palette results below describe the rejected experiment, not the current appearance.

## Earlier neutral-surface experiment, reverted

The owner approved retaining green as the signature rather than tinting every light surface. The light page is now neutral off-white (#f7f7f5), document sheets and fields white (#ffffff), section backgrounds pale gray (#ececea), and dividers neutral (#d3d3cf). Pine text/actions and sage artwork keep their previous colors. The entire stylesheet outside those four light tokens is unchanged, including the dark palette, paper geometry, layout and subtle animation.

Browser chrome, the styled 404 and generated social-card ground were synchronized with the light page. Visible copy, the canonical skill and its evidence, generated Markdown, indexing restrictions and publication settings are unchanged. No dependency was added. This is an owner-approved design refinement, not a claim that the palette improves comprehension or conversion.

All **38 Node checks and 54 Chromium/WebKit tests passed**, with the final browser run taking 37.9 seconds. Tests cover the actual neutral backgrounds, retained accents, readable text and focus contrast, theme persistence, social-image pixels and existing responsive/interaction behavior. Desktop, mobile, paper-detail, dark-mode and social-card images were inspected. Lighthouse was not rerun; scores below belong to earlier builds.

## Earlier subtle-motion restoration

The owner found the repeated zoom dull and allowed a return to the earlier subtle motion. The original 1.3-second entrance from the pre-loop revision is restored: rotation −14° and scale 0.98 settle to −9° and scale 1, while opacity moves from 0.65 to 1. It plays once, then stays still. Replay text remains absent. The loop controller and pause/resume button were removed; no D3 or other dependency was added.

All **37 Node checks and 52 Chromium/WebKit tests passed** in the verified restoration; the browser run took 53.0 seconds. Obsolete loop-control cases were replaced by tests for the exact original endpoints, single iteration, no restart after scrolling/theme/page events, static reduced-motion/no-JavaScript behavior, and unchanged search routes. Desktop/mobile endpoints were inspected. The main browser specification mentioned in the editor's change notice was inspected and left untouched. SEO/GEO metadata, generated Markdown, compact geometry, hero copy, skill and publication settings are preserved. Lighthouse was not rerun; all scores below remain measurements of earlier revisions.

## Earlier animation, polish and discovery revision

The user requested a continuously playing, more noticeable shape without the replay caption. The original band now expands from scale 0.8 to 1.08 and returns over seven seconds, with a small pause/resume control beside the theme toggle. The loop holds its current phase when paused, stops offscreen or while the document is hidden, and becomes a still illustration under reduced motion. Text no longer has a competing entrance animation and remains selectable. No per-frame path rebuilding or new motion dependency is used.

All original plotted coordinates are preserved by an exact checksum regression while relative SVG serialization reduces the artwork from 80,261 to 59,882 bytes. Homepage HTML, including new metadata, is 105,568 bytes compared with 122,054 before this round. The desktop/mobile image review includes the smallest and largest states; sampled contour points remain within the artwork and viewport at desktop, mobile and doubled text.

Search and social metadata now identify the Agent Skill explicitly, with canonical/Open Graph URL agreement, complete image cards, and a factual CreativeWork description rather than a fabricated hosted-app listing. Generated page Markdown and an optional agent index preserve the visible copy, source documents, fictional-example disclosure and privacy/compatibility limits. Ordinary links expose the Markdown page and raw skill. FAQ fragments open the appropriate disclosure. Missing routes now get a styled, real noindex 404.

All **37 Node checks and 54 Chromium/WebKit tests passed**; the final browser batch took 40.7 seconds. One local Lighthouse 13.4.1 mobile run returned **99 performance, 100 accessibility, 100 best practices, and 66 SEO**; LCP 1.8 seconds, CLS 0, total blocking time 20 milliseconds. The only failed automated SEO audit was the intentional indexing restriction. A local performance score is not a real-user outcome, and passing these checks does not mean perfect SEO, guaranteed AI citation, or proven human comprehension.

See [search readiness](search-readiness.md) for the exact preview/release distinction, the explicit indexing flag, the optional agent-index proposal, and the host-root robots limitation on GitHub Pages project sites. Neither the repository nor the website was published; the existing Pages gates remain unchanged. The canonical skill and all behavioral-response records are unchanged in this round.

## Earlier reader-first copy revision

The owner rejected the earlier defensive non-service phrase and generic feature description. The current 35-word introduction instead explains the reading burden and a concrete receiver outcome. The visuals, source-example text, dark-paper treatment, and light-default behavior are unchanged. The updated download and copy field use the revised canonical skill, not a website fork.

The [copy review](website-copy-review.md) records the actual writing failure, one-paragraph sender-guidance revision, five added scenarios, three old-skill baselines, and 33 new trial responses. The matched introduction pairs do not establish a causal writing improvement, and the recorded payment notice still overexplains. The new hero is an editorial choice awaiting owner feedback, not a demonstrated quality result.

All **31 repository tests and 44 Chromium/WebKit browser tests passed**, and the revised skill passed the isolated installer check. These prove technical checks passed, not that the writing is good. No styles, runtime JavaScript, dependencies, or publishing controls changed in this round. Lighthouse was not rerun. The following sections and their scores describe earlier versions.

## Earlier light-default and hero-clarity follow-up

The owner found that the dark paper effect did not read clearly despite earlier passing scans. Inspection confirmed identical front/back colors and a faint light-theme shadow copied onto the dark desk. Dark appearance now uses a deeper desk, lighter front sheets, distinct backing sheets, a fine top-edge highlight, and stronger offset shadows. The muted text-to-paper contrast is approximately 5.14:1; ordinary text is approximately 7.65:1. Surface separation thresholds in the tests are design regressions, not WCAG requirements.

The default is light even if the OS is dark, storage fails, or JavaScript is unavailable. Explicit saved choices restore before CSS and main enhancement; OS theme changes do not override them. Defaulting does not rewrite stored values. All dark matrix cases now select and assert dark appearance explicitly instead of relying on OS emulation.

Humane's own instructions guided the hero copy: “Humane is a free Agent Skill, not a separate AI service.” The next sentence explains adding its instructions to an existing assistant for document understanding and clearer drafts. “MIT open-source license” links to the actual license, while “Private preview” keeps licensing separate from public availability. All non-hero copy, example facts, skill instructions and model evidence, dependencies, and publishing controls are unchanged.

A read-only screenshot review found one remaining mobile defect: equal backing-sheet inset and translation hid the backing completely. One scoped correction exposes a 0.35rem edge below each stack; the refreshed mobile image and a geometry regression confirm its presence. The review otherwise found the hero and desktop treatment clear. This is an AI screenshot/source review, not human comprehension evidence.

All **31 Node checks and 44 Chromium/WebKit tests passed**, with the final browser batch completing in 41.7 seconds. Coverage includes default/saved themes, early bootstrap with main enhancement unavailable, storage failures, explicit dark screenshots, paper contrast and exposed edges, source navigation, enlarged text, forced colors, no JavaScript, and downloads. Sampled axe scans and the scoped design scan reported no findings; no page errors or external subresource requests were observed in the matrix. Lighthouse was not rerun. The scores below belong to earlier builds.

## Earlier document-example treatment

The owner asked for “See an example” to look more like a worked example, suggesting floating A4 pages. The section now has a tinted desk, layered source sheets, an open first original, and a separate portrait response page. All real text stays upright and selectable; only empty, noninteractive backing sheets tilt. The result has a preferred 210:297 ratio on desktop, a content-based minimum height, and no imposed ratio on narrow layouts. No animation, dependency, source rewrite, or skill change was added.

The first read-only screenshot review found excessive blank area in oversized desktop result pages. One sizing adjustment capped the source/result columns at 27rem/34rem without shrinking text; the implementing assistant inspected the refreshed screenshots. Mobile, dark appearance, and enlarged-text behavior were preserved. The scoped design scan reported only three advisory findings for the intentional 2px paper radius, now documented in [DESIGN.md](../DESIGN.md). No claim of human-reader validation follows from this review.

All **34 browser tests passed in one final Chromium/WebKit run** (31.6 seconds), and all **28 repository/build checks passed**. Tests inspect both example modes in desktop/mobile and light/dark variants, complete source bodies, narrow/200% text bounds inside papers, native keyboard expansion, source return links, forced colors, no-JavaScript behavior, clipboard recovery, and exact downloads. Sampled axe scans had no violations; no external subresource requests or page errors were observed in the matrix. The wording, canonical skill and model records, hero artwork, other sections, and deployment guard remain unchanged.

**One final-build local mobile Lighthouse 13.4.1 run:** performance 98, accessibility 100, best practices 100; LCP 1.8 seconds, CLS 0, total blocking time 30 milliseconds, no runtime error. SEO was not included in this run. This is a single local lab measurement, not real-user evidence or a controlled improvement over the older score. The ignored report is named lighthouse-document-desk.json in the existing local review directory. No report or screenshot was uploaded publicly.

## Earlier English-only copy review

The owner found “What comes in” unclear and asked the site to demonstrate its own reader-first principles. Humane was used to edit the copy. “Example documents” and “Original notes” now name the source columns, prewritten examples are stated plainly, setup paths are distinct, and redundant slogan sections were removed. The approved artwork, colors, typography, and interactions remain. See [the copy review](website-copy-review.md).

All **30 browser tests passed in one Chromium/WebKit run**, including English-only route and asset checks, explicit example labels, both themes at desktop/mobile and enlarged text, source round trips, clipboard states, no JavaScript, and exact skill downloads. All **27 repository/build tests passed**. The skill's bytes and previous model-trial evidence were unchanged. The following sections describe earlier revisions, including their then-existing Arabic website.

## Earlier follow-up improvements on 17 September

The [extra improvement round](improvement-round2.md) adds a return path from each source to the citation that opened it, a complete wrapping install command, actionable instruction-copy feedback, and protection against delayed or out-of-order clipboard responses stealing focus or replacing newer feedback. The colors, artwork, general layout, and private/local-only scope are unchanged.

All **26 browser tests passed together in Chromium and WebKit** after the source-fragment regression was fixed. The complete command is verified at 320px with doubled text in both languages, and copy failure selects its exact text for manual use. All **27 repository/build checks passed**. The scoped mechanical design scan returned no findings. This follow-up did not repeat the Lighthouse run or claim broader human or assistive-technology validation.

## Original website verification on 17 September

**27 repository/build checks passed.** The site-output test excludes private notes, test fixtures, repository metadata, and dependency folders. The build refuses out-of-tree destinations and symbolic-link output ancestors. Both language dictionaries have matching structures.

**16 browser checks passed together in Chromium and WebKit.** They covered desktop/mobile, English/Arabic, light/dark, source navigation and direct fragments, keyboard tabs, byte-accurate ZIP downloads, clipboard success/failure, denied storage, 320px with 200% root text, and no JavaScript. Required fonts loaded, no external subresource requests or page errors were observed, and the sampled axe scans had no violations.

A subsequent normal-motion accessible-name check found the replay control's visible label was missing from its accessible name. The label was corrected in both languages, and **two focused Chromium/WebKit regressions passed**. These 18 passing test results were obtained in a 16-test batch plus a focused two-test run, not a single 18-test run.

The first visual review found narrow enlarged-text columns, overflowing example tabs, 10px of desktop artwork overflow, and an unnecessary label above the result headline. One grouped correction was followed by recapture. The reviewer scored all four findings resolved; its final disposition was **ship**, scoped to those four fixes and the local preview. The requested named review agent was not registered, so a separate general-purpose subagent performed the supplied review role. The mechanical design scan returned no findings. The built visual system is documented in [DESIGN.md](../DESIGN.md).

**One local mobile Lighthouse run:** performance 93, accessibility 100, best practices 100, SEO 63; LCP 2.7 seconds, CLS 0.009, total blocking time 0 milliseconds. These are a single lab result on the local development server, not real-user performance. The replay-label defect above was in that report and was subsequently fixed with a targeted test; the score run was not repeated. Search indexing is intentionally blocked, and the local server's no-store behavior affects caching. Neither should be silently changed to improve a preview score.

Screenshots and the raw Lighthouse report are local ignored artifacts under .impeccable/review. Asset origins and font/icon licenses are recorded in [site/asset-provenance.json](../site/asset-provenance.json); the built social PNG embeds its provenance. No generated benchmark badges or fictional customer claims appear on the site.

These checks do not establish complete WCAG conformance, assistive-technology coverage, every viewport/font setting, or real-user performance. The skill's separate behavioral tests and human-reader limitations remain in [the verification record](verification.md).

## Approved manual publication

The [manual Pages workflow](../.github/workflows/pages.yml) has no push trigger. A run requires both the manual publish checkbox and a repository variable named HUMANE_PAGES_ENABLED set to true. The v0.1.0 launch authorizes enabling this gate and the github-pages deployment environment for this repository only. Future deployment changes still require approval.

The owner approved both **the source repository** and **the website with its included skill downloads** becoming public. Before a release, review the entire repository as well as the built artifact: the website allowlist does not protect files made public on GitHub. Preserve private backups outside all public refs. An earlier Actions job was blocked before running by an account billing/spending restriction; do not change payment settings or weaken tests to bypass it. If it still blocks the approved deployment, report it rather than claiming publication succeeded.

Configure Pages to use GitHub Actions, configure the deployment environment and enabling variable, and manually start the workflow with the publish checkbox. It tests, builds and uploads only dist/site; it never uploads the whole repository. The configured Pages base URL feeds the build so project paths are correct. The approved address is [the Humane project site](https://hasanaboshally.github.io/humane/).

The manually approved workflow sets `HUMANE_SITE_INDEXABLE=true`, which changes the homepage directive and emits a sitemap. Default local builds remain unindexed; the build flag alone does not deploy anything. Review the origin-root robots policy and real hosting headers separately; the local server's headers and a project-subdirectory robots file do not establish the public crawl policy. Do not modify the owner's root site or DNS without separate permission. Details and verification steps are in [search readiness](search-readiness.md).

Robots rules and noindex are crawler hints, not access control. Verify actual public responses and downloads after deployment rather than treating a passing local build as proof that the site is live.
