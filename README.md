# Humane

Understand documents and write clearly—without losing what matters.

AI makes it easy to produce more text than people can reasonably read. Humane is a free Agent Skill for your existing assistant, focused on the person who has to make sense of it.

When several documents arrive before a meeting, ask for one explanation of what they say together, what disagrees, and where to check. When you are writing, ask for a draft that respects the next person's time and keeps your meaning and voice.

**Experimental v0.1.0.** [Website and examples](https://hasanaboshally.github.io/humane/) · [Download the skill](https://github.com/HasanAboShally/humane/releases/tag/v0.1.0)

## Try it

**No Node.js or Git required.** Copy the [complete skill](skills/humane/SKILL.md) into a new chat as instructions, then attach or paste your material. This applies only to that conversation; it does not install the skill or grant access to other files.

Ask in ordinary words:

> Use Humane on these files. Explain what matters, what remains uncertain, and where I should check. Keep the originals unchanged.

For a reusable installation, [copy the skill folder into your assistant](CONTRIBUTING.md#manual-installation)—also without Node.js or Git. The command-line installer below is another option.

No account with Humane, mode picker, or special document markup. Some clients also expose `/humane`; discovery and invocation vary by client.

### Optional command-line installation

In your project, install with the [Skills CLI](https://skills.sh/docs/cli):

```sh
npx skills add HasanAboShally/humane
```

Choose your assistant when prompted. This installer uses Node.js to run `npx` and Git to retrieve the public repository; neither is a dependency of the skill itself. No GitHub sign-in is needed. Start a new assistant session if it does not discover the skill.

## What to ask for

- **Understand:** “I have one minute before this meeting. What needs my attention?”
- **Write:** “Tighten this proposal for the person approving it. Keep my voice and the important conditions.”
- **Compare:** “What changed, and what obligations still apply?” Supply both versions.

Humane asks the assistant to combine repeated information, keep uncertainty beside the claim it qualifies, and reference important source passages. Shorter is not always better: an explanation or necessary caveat can earn its space. It also works in your requested language.

See the fictional [document brief](examples/receiver/brief.md), [proposal](examples/sender/proposal.md), and [version comparison](examples/changes/brief.md). These are authored illustrations with linked inputs, not measured results.

## Before sharing material

The skill is Markdown instructions with no executable runtime, dependencies, service, or telemetry. **Your assistant and its provider still process your material under their own policies.** Humane does not make a cloud assistant private or offline. Use approved tools for confidential documents; the third-party installer has its own network and telemetry policies.

File support depends on the host. Humane asks the assistant to disclose unreadable or missing material and leave originals unchanged unless you request edits. These are instructions, not guarantees: check important claims against the sources, especially for high-stakes decisions.

## Testing and feedback

Installation has been checked for GitHub Copilot, Claude Code, and Codex; native discovery has been checked in Copilot CLI. This does not verify every client's task behavior. The [verification record](notes/verification.md) separates those checks from model-output trials. No measured reading-speed or comprehension improvement is claimed.

Found something confusing, omitted, or invented? Share the request and a fictional or safely anonymized example—not private documents. See [contributing and maintainer checks](CONTRIBUTING.md).

## License

[MIT](LICENSE). Created by Hasan Abo-Shally using the open [Agent Skills format](https://agentskills.io/specification).

_This README was drafted and edited with an AI assistant using Humane._
