# Handoff Brief

> **Read this file first** before doing anything in a new session on this
> project. It contains the full project context, the current state, the
> open items, and the conventions the previous session established.

## What this project is

A static personal site at **https://buc.ketli.st** for 翁強 and his wife
Josephine. It is intentionally permanent — the site must remain
accessible after the owner is gone, with no ongoing maintenance.

Tech stack (chosen and recorded in `docs/DECISIONS.md`):

- **Astro 5** static-site, `output: 'static'`
- **Plain CSS** with custom properties, no framework
- **Vanilla JS** only — no React/Vue/Svelte/jQuery/nanogallery2
- **GitHub Pages** hosting, custom domain `buc.ketli.st` via CNAME
- **No server-side runtime** — fully static, runs from `dist/`
- **No external image host** — all photos in repo under `public/images/`
- **Web3Forms** for the blessing form submission (public access key in
  GitHub Variables, NOT in source)
- **GitHub Issues + Actions** for blessing moderation (a submission
  emails the owner; the owner clicks an "approve" link which opens a
  pre-filled Issue; the `approve-blessing.yml` action appends to
  `data/blessings.env` and triggers deploy)

## The most important docs to read

Read these in this order before doing anything:

1. `AGENTS.md` — project context, stack, conventions, "things to never do",
   and the **end-of-day routine** (triggered by "call it a day").
2. `docs/ARCHITECTURE.md` — data flow, deploy flow, moderation flow.
3. `docs/DECISIONS.md` — every major decision with the rejected
   alternatives. If the next AI is tempted to re-argue a settled
   question, this is where the answer is.
4. `docs/OPERATIONS.md` — env vars, the blessing workflow, day-2 ops.
5. `docs/PERMANENCE.md` — registrar info, renewal date, GitHub
   designated successor, backup locations, "what to do if X breaks"
   scenarios. This is the doc a family member would read.
6. `docs/sessions/` — chronological log, one file per working day.
   Latest file is the most recent state.
7. `git log --oneline -20` — code-level history.

## Repo conventions (don't deviate without updating DECISIONS.md)

- **TS strict, ESM only**, server code in `src/lib/*.ts` (Node `fs`),
  browser code in client `<script>` blocks of `.astro` files.
- **CSS tokens** in `src/styles/global.css :root` — change colours /
  fonts there, not in component styles.
- **Data files** in `data/*.env` are pipe-separated (`NN|field1|...|fieldN`).
  Parse via `src/lib/parseEnv.ts`. The 5th column was added to
  `data/list.env` later; older rows with 4 columns still parse (the
  parser merges extras into the last field). Don't break this.
- **Three shared modules** in `src/lib/`: `types.ts` (data shapes),
  `parseEnv.ts` (env parser + cache), `utils.ts` (`pickRandomInt`,
  `formatBytes`, `escapeHtml`). Use them; don't re-implement.
- **Commit messages**: `<type>(<scope>): <summary>`. End-of-day commits
  prefix with `docs:`. Include a body paragraph explaining the **why**
  for non-trivial changes.
- **AI-authored commits** carry `Co-authored-by: opencode <noreply@opencode>`
  in the trailer.
- **End-of-day routine** (see `AGENTS.md`): when the user says "call
  it a day", run `npm run end-of-day:md --silent`, draft session log +
  DECISIONS + CHANGELOG entries, show drafts, wait for confirmation,
  commit, push, then remind ONCE about PAT revocation.

## Current state at handoff (commit 4345f22)

### What works

- Site builds clean (`npm run build` → 5 pages, no errors).
- `npx astro check` → 0 errors, 0 warnings.
- All 10 previously-missing DC-CST characters are now resolved (either
  substituted with chars DC-CST has, or rendered via Noto Sans HK /
  wenwrite where DC-CST isn't used).
- Blessing form works end-to-end (Web3Forms → email → GitHub Issue →
  approved → published).
- Photo management: `/settings/` page lets the owner upload, edit,
  delete photos; client-side canvas resizes to WebP.
- Custom domain: `buc.ketli.st` (CNAME → `f43d.github.io`).
- TLS via Let's Encrypt (auto-provisioned by GitHub Pages).

### What's in scope to do (open items, in priority order)

1. **Test the blessing form end-to-end** (owner action) — submit on
   /comment/, check email, click the Issue approve link, verify the
   blessing lands on the wall in ~30s. Web3Forms key has been set.
2. **Set a GitHub designated successor** (owner action, 5 min) — see
   `docs/PERMANENCE.md` for the link to GitHub's docs.
3. **Set a calendar reminder for 6 June 2027** (domain renewal).
4. **Mirror the repo to GitLab** (one-time setup):
   `git remote add gitlab https://gitlab.com/f43d/love-list-astro.git`
   then `git push gitlab main`. Optionally update `.github/workflows/deploy.yml`
   to also push to gitlab after each build.
5. **Add a local backup**: `git clone … ~/backups/love-list-astro`.
6. **Tighten the security of the Cloudflare account** — add a backup
   email and 2FA. Currently single email, no 2FA mentioned.
7. **Update the dev workflow** to push to the GitLab mirror automatically
   (only if you set one up in step 4).

### Last-session artifacts (still need the user's eyes)

- `docs/PERMANENCE.md` is filled in (registrar, renewal, successor,
  backups). Action items at the top of that file are the "next-session
  to-do" list — read it first.
- `docs/DECISIONS.md` has the 2026-08-29 entries covering the
  responsive overhaul, the wenwrite font, the DC-CST substitutions,
  the schema-migration rule (parseLine accepts extra fields), and
  the permanence plan.

### Things the next AI should NOT do

- Don't add a runtime backend. The site is intentionally static.
  If a feature "needs a server", the right answer is almost always
  Web3Forms, GitHub Issues, GitHub Actions, or Cloudflare Workers
  (if truly needed — none of these are deployed today).
- Don't add Tailwind, jQuery, or any framework. The site is plain
  CSS + vanilla JS by design. See `AGENTS.md` for the rationale.
- Don't change DC-CST, awkwardblack, or wenwrite. The handwritten
  identity is the point. If a character is missing, substitute or
  rephrase — don't add a fallback font.
- Don't refactor for refactoring's sake. If the user asks to "clean
  up" code, do the minimum, document in DECISIONS.md, commit.
- Don't push to main without the user's confirmation when the change
  is non-trivial (CSS, data file edits, public-facing text). For
  doc-only changes (end-of-day docs, etc.), push directly.

## How to start a session on this project

The user will paste a prompt. It should be:

> Read these files in this order, then summarise back to me what you
> know about this project before doing anything:
> 1. AGENTS.md
> 2. docs/ARCHITECTURE.md
> 3. docs/DECISIONS.md
> 4. docs/OPERATIONS.md
> 5. docs/PERMANENCE.md
> 6. docs/HANDOFF.md
> 7. git log --oneline -20
> 8. docs/sessions/ (latest file)
>
> Today's task: [whatever the user wants]

That's all the next session needs.

## How the user uses the end-of-day routine

When the user says "call it a day" (or "wrap up", "let's call it a day",
or similar):

1. Run `npm run end-of-day:md --silent` in `love-list-astro/` to get
   the snapshot.
2. Draft three things:
   - Session log entry (append to today's file in `docs/sessions/` —
     usually 2026-08-29 or later; if a new file is needed, create one
     per working day).
   - `docs/DECISIONS.md` entry only if a real architectural /
     strategic decision was made (refactors don't qualify; explicit
     "I chose X over Y" calls do).
   - `CHANGELOG.md` entry if anything user-visible changed.
3. Show drafts. **Wait for explicit confirmation** — don't write
   anything until the user says "yes" (or similar). The user may
   edit drafts before approving.
4. Commit and push. Ask for the GitHub PAT if the token is gone from
   the sandbox. Use the canonical one if it's still in `.git/config`,
   else ask.
5. After push, remind ONCE about PAT revocation. Per `AGENTS.md`,
  do not nag about this at any other time.

## Repo info quick reference

- **Repo URL**: https://github.com/f43d/love-list-astro
- **Live URL**: https://buc.ketli.st
- **Default branch**: main
- **Workflows**: `.github/workflows/deploy.yml` (builds + deploys to
  GitHub Pages), `.github/workflows/approve-blessing.yml` (moderates
  blessings)
- **Hidden pages**: `/settings/` (no public link — owner-only)
- **Public data files**: `data/list.env`, `data/gallery.env`,
  `data/blessings.env`
- **GitHub Variables needed**: `PUBLIC_WEB3FORMS_KEY` (Actions
  variables, scope: repo). Without it the blessing form is disabled.

## Last session summary (2026-08-30)

- Filled in `docs/PERMANENCE.md` placeholders (registrar = Cloudflare,
  renewal 6 June 2027, successor = son or daughter, GitLab mirror to
  be set up, local backup as an action item).
- 4 DC-CST missing characters substituted:
  - 強 → 强 (Footer.astro)
  - 氹 → 哄 (data/list.env item 28)
  - 為 → 爲 (data/list.env item 74)
  - 錄 → 録 (data/list.env item 89)
- After these, no DC-CST-missing char is rendered in a DC-CST context.
  The other 6 of the original 10 missing chars are rendered via Noto
  Sans HK or wenwrite or in a non-visual meta tag — those were always
  fine.
- Previous-day cleanup pass: `src/lib/{types,parseEnv,utils}.ts` as
  shared modules; `parseList/Gallery/Blessings.ts` slimmed to ~30
  lines each; `settingsClient.ts` consolidated; components got
  comment blocks.

---

_Last updated: 2026-08-30 (handoff written)._
