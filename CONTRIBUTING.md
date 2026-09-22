# Contributing

Make a real reading task easier without hiding what matters. Small improvements with a reproducible example are more useful than a longer list of writing rules.

## A useful report

Share the request, the assistant/client if known, a fictional or anonymized input, what the output got wrong, and the fact or condition a better output must preserve. Never attach private documents, credentials, personal records, or confidential source excerpts to an issue.

If a failure reveals sensitive material, do not reproduce it in a public report. Contact the repository owner through an existing private channel before sharing details. A public repository is not permission to upload other people's data.

## A useful change

Keep one skill and one plain-language entry point. Put reusable behavior in the canonical skill, author illustrations under examples, and add a behavioral case under tests. Do not add a mode flag where an ordinary request suffices. New scripts are for maintainers, not a required runtime for users.

Run the maintainer checks below. The two license files must stay identical so both the repository and installed skill carry the license. Generated ZIPs must contain only the allowlisted skill and license, never the full repository, test fixtures, credentials, or development dependencies.

## Improve through use

Start with an observed problem, not a new rule. Reproduce it with fictional material and identify what a better answer must preserve. Check whether the existing instructions already cover the failure; execution, source access or context limits may be responsible instead of a missing instruction.

If a skill change is justified, make the smallest useful change and compare the old and revised versions on identical inputs. Keep acceptance criteria out of the generating assistant's context. Preserve the raw outputs and their actual instruction fingerprints, including failures. Add regression coverage without turning one preferred sentence into the required answer.

For long folders, check whether the reader gets a short first layer and can find the exact supporting document. A thorough investigation does not automatically justify a long response. These are checks to apply in practice, not a reason to append another checklist to every output.

Real-use feedback may suggest a fictional test, but permission to read someone's documents is not permission to copy them, their paths, or their generated summaries into this repository. Ask before retaining any identifiable material. A proposed improvement is not permission to publish it or rewrite Git history.

## Manual installation

No Node.js, Git, or GitHub account is needed for this route.

1. Choose **Code → Download ZIP** on the repository page and extract it.
2. Copy the entire [Humane skill folder](skills/humane), not the whole repository, into the project where you use your assistant. Use the target below; preserve any customized installation before replacing it.

| Assistant               | Target folder inside your project |
| ----------------------- | --------------------------------- |
| GitHub Copilot or Codex | `.agents/skills/humane/`          |
| Claude Code             | `.claude/skills/humane/`          |

The final folder should contain [the instructions](skills/humane/SKILL.md) and [their license](skills/humane/LICENSE). Start a new assistant session in that project. These are the locations checked by our installer test; placement is not proof of correct invocation in every client.

**Claude's upload interface uses a different ZIP:** download the skill-only archive from the [v0.1.0 release](https://github.com/HasanAboShally/humane/releases/tag/v0.1.0), not GitHub's repository ZIP. The maintainer command below builds the same archive. Follow [Claude's upload instructions](https://support.claude.com/en/articles/12512180-using-skills-in-claude). That interface has not been tested end to end, and account or organization settings may restrict it.

## Maintainer checks

Use Node.js 22 or newer. Dependencies are development-only; they are not needed to use the installed skill.

```sh
npm ci --ignore-scripts
npm test
npm run pack:skill
```

The packer produces a ZIP, an equivalent .skill archive and SHA-256 checksums under the ignored build output directory. Each archive contains only the skill and license. Nothing is automatically uploaded or published. The checks workflow has read-only repository permissions.

Optional checks:

- `npm run test:install` runs Skills CLI 1.5.26 in a disposable home and project with installer telemetry disabled. It needs network access to obtain the installer, but changes no personal skill installation. Set `HUMANE_COPILOT_BIN` to an installed Copilot CLI to also check native discovery offline. Discovery is not end-to-end invocation.
- `npm run prepare:eval` freezes the current skill and one source/request file per behavioral case, without reviewer criteria. It invokes no model and refuses to replace existing snapshots with different input bytes. The [evaluation method](notes/editorial-research-2026-09-17.md#evaluation-method) describes the trials and their limits.
- `npm run build:site` rebuilds the local preview; `npm run test:site` checks it in Chromium and WebKit when the test browsers are installed. See the [website notes](notes/website.md) and [search-readiness notes](notes/search-readiness.md). Public hosting still requires separate approval.

The [authoring audit](notes/skill-authoring-audit-2026-09-17.md) covers metadata and structure. The [verification record](notes/verification.md) distinguishes current checks from historical results and records the hosted-CI restriction. See the [design and reader-test plan](notes/design.md) for human evaluation and the [editorial research](notes/editorial-research-2026-09-17.md) for upstream ideas and mixed comparison findings.

## Evaluation honesty

Keep packaging checks, installer checks, model smoke tests, and human reader tests distinct. A model following the instructions once does not prove reliability. An author-written example does not prove it beats another prompt. Do not advertise a percentage improvement until a recorded comparison with actual readers supports it.

Release publication, hosting changes, repository visibility changes, and directory submissions require explicit owner approval. The approved v0.1.0 launch does not grant continuing permission to publish unrelated material or future changes.
