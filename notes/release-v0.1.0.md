# v0.1.0 launch record

22 September 2026. This records release preparation, not an already completed deployment. Actual public-access, hosted-CI and live-site outcomes belong in the [versioned release](https://github.com/HasanAboShally/humane/releases/tag/v0.1.0) and [Actions runs](https://github.com/HasanAboShally/humane/actions).

## Approved scope

The owner explicitly approved a private backup, replacing main's 17 development commits with one initial public commit, making the source repository public, publishing an experimental v0.1.0 release with skill archives and checksums, and deploying the static GitHub Pages site and downloads. This supersedes the earlier private/local-only restriction. It does not authorize billing changes, domains or DNS, directory submissions, marketing, or unrelated projects.

The skill remains one portable Markdown instruction file and its matching MIT license. It needs no Node.js, Git, service or executable runtime. The optional installer and maintainer tools have their own prerequisites. The npm package deliberately retains its private flag to prevent publishing maintainer tooling to npm; that flag does not control GitHub visibility.

## Preservation and review

A Git bundle and a working-tree archive were created outside this repository in an owner-only local directory before any edits. A test restoration recovered all 17 commits and verified all 70 working files byte-for-byte, including the five pending formatting edits. No backup branch or tag is intended to remain in the public repository.

Gitleaks 8.30.1 scanned all 17 commits and the pending diff locally with redacted output and reported no leaks. A separate 211-blob history check found no local-user paths, the known private reading-trial markers, or unrelated-workspace project markers. Source, note, fixture and workflow inspection found no private case-study material. These are bounded checks, not a guarantee of secret absence; rewriting history is not secret erasure. No source content was uploaded to a scanning service.

Historical model responses, failures, source-input hashes and metadata audit records are retained unchanged. Old abbreviated Git commit IDs in dated notes identify development snapshots; they are not promised public refs after the one-commit launch. The private backup retains those snapshots. Byte-level evidence fingerprints remain the basis for the recorded model comparisons, not a fabricated claim that the launch revision was rerun behaviorally.

## Release changes

Private-preview labels become experimental-release labels. Public setup no longer asks for private GitHub access. Default/local builds stay unindexed; the manually approved Pages workflow explicitly enables indexing and emits a sitemap. The canonical skill, fictional example facts, fonts, palette, artwork, motion and interaction behavior are unchanged.

The Pages workflow requires both a manual publish confirmation and the repository's enabling variable. It tests before building and uploads only the static website output, not repository notes or tests. Making the source repository public is a separate exposure of those reviewed source files.

## Checks and remaining limits

Fresh local checks on the release-facing source completed before the launch commit:

- A clean locked installation audited 29 packages and reported zero vulnerabilities. These are development dependencies, not the installed skill's runtime.
- All 48 Node.js repository, package, evidence-integrity, build and deployment-gate checks passed. An initially incorrect deployment-permission assertion was corrected to match the actual scoped workflow; no production test failure was hidden or skipped.
- Isolated Skills CLI 1.5.26 installation produced the exact skill and license bytes for Copilot, Claude Code and Codex project locations. Copilot CLI 1.0.81-8 also discovered the enabled skill offline. No model ran and no personal skill installation changed.
- All 52 Chromium/WebKit browser checks passed together in 42.0 seconds. These cover current release copy, both themes, narrow/enlarged text, source navigation, no JavaScript, clipboard recovery and exact downloads. The sampled accessibility scans reported no findings; this is not complete accessibility certification.
- A separate indexable artifact contained exactly 19 allowlisted site/assets/download files, correct HTTPS canonical and sitemap URLs, and no obsolete private-access claim. Default preview output remained separate and unindexed.
- The canonical instruction file, installed license, fictional task inputs and historical JSON evidence matched the prior revision byte-for-byte. Only release documentation, availability copy and publication configuration changed.

Both skill archives contain exactly humane/SKILL.md and humane/LICENSE, are identical and reproducible, and measure 7,152 bytes. Archive SHA-256: e4668e80d0ae2f3e4b60c070203581f010f0a54638480b7ede8693113c868217. Canonical skill SHA-256: e8576434acd0b980473aeda7f0f255faa335a3a08d89a2f8a302d88eb214ea53. Checksums are distributed beside the archives.

No hosted success, anonymous remote installation or live publication is inferred from these local results. Those checks happen after the reviewed source becomes public and their actual outcomes belong in the versioned release.

The last private-hosted check for the prior revision did not start: GitHub reported recent account payments failed or the spending limit needs increasing. The API did not distinguish the alternatives. Billing settings were not changed; a new hosted result and actual Pages availability must be verified separately.

No new model trials, human-reader study, held-out evaluation, universal client invocation test, or Claude upload-interface test is claimed. No measured reading-speed, comprehension, SEO-ranking or AI-citation improvement is established. The [verification record](verification.md) preserves the detailed limits.
