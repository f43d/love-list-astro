# AI Tooling — when to install what

Personal notes from翁強 on which opencode / AI agent extensions are
worth installing, and which are not. Recorded so future-me (or a
family member setting up tooling) doesn't have to re-derive these
conclusions.

## TL;DR

- **This site (`love-list-astro`)**: install **nothing**. The repo's
  `AGENTS.md` already establishes the conventions; methodology plugins
  would just be extra friction.
- **A new code project with real logic worth testing**: install
  **obra/superpowers** for TDD discipline + mandatory brainstorming
  step.
- **A one-shot big refactor on this site or another codebase**: install
  **oh-my-opencode-slim** for multi-agent parallelism, then remove it
  when the refactor is done.

## The plugins we considered

### oh-my-opencode-slim

- **What it is**: Multi-agent orchestration. The AI can spawn sub-agents
  that work in parallel, e.g. one exploring the codebase while another
  edits code.
- **Source**: https://github.com/alvinunreal/oh-my-opencode-slim
- **Pros**: Speeds up big refactors. Good for one-shot large changes.
- **Cons**: Adds API cost (each sub-agent is a separate LLM call). Adds
  friction on small tasks (the model may want to delegate when it
  shouldn't).
- **Verdict for this site**: Skip. The site is small, the changes are
  small, multi-agent parallelism doesn't pay off.
- **Verdict for a new big codebase**: Install temporarily for the
  refactor, then uninstall.

### obra/superpowers

- **What it is**: A methodology layer. The AI must brainstorm before
  coding, write tests first, do code review between tasks, etc. The
  workflow is:
  brainstorm → spec → plan → TDD → subagent-dev → review → finish.
- **Source**: https://github.com/obra/superpowers
- **Pros**: Catches real bugs. TDD discipline works. The brainstorming
  step forces the model to think about the **why** before the **how**.
- **Cons**: Mandatory — adds steps to every interaction. Slows down
  trivial work. The "subagent-driven development" loop is overkill for
  static sites.
- **Verdict for this site**: Skip. Too heavy for a 4-page static site.
- **Verdict for a new big codebase**: Worth it. Especially if the
  project will be touched many times — the upfront discipline saves
  debugging time later.

### mattpocock/skills (TypeScript engineering)

- **What it is**: A bundle of TypeScript-engineering skills for AI agents.
- **Source**: https://github.com/mattpocock/skills
- **Pros**: Good for projects where the hard part is "make TypeScript do
  the right thing" (library design, type-level correctness).
- **Cons**: Very TypeScript-specific. Not useful outside the TS world.
- **Verdict**: Install when you have a project where types are the
  hard part. Skip otherwise.

## How the choice was made

These conclusions are recorded in `docs/sessions/2026-08-29.md` and
`docs/DECISIONS.md` (look for "oh-my-code" / "superpowers" / "mattpocock").
The short version:

> Static sites don't benefit from methodology plugins. They benefit
> from the conventions already in this repo (AGENTS.md, DECISIONS.md).
> A real codebase benefits from the discipline.

## How to install/uninstall

These are opencode plugins, installed via the opencode CLI:

```bash
# Install (if you decide later)
npx oh-my-opencode-slim@latest install
npx -y @anthropic-ai/skills@latest   # or the mattpocock/skills path

# Uninstall (cleanup)
# Edit ~/.config/opencode/opencode.json and remove the plugin entry.
```

## When to re-read this

- Before starting a new big project (when the methodology layer
  actually helps).
- After a long break, if you forget which plugin to install where.
- If a new promising plugin appears that you want to evaluate.

---

_Last updated: 2026-08-30._
