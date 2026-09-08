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

## Current state at handoff (2026-09-08, commit ac29fd3 / site public 2026-09-09)

### What works

- Site builds clean (`npm run build` → 6 pages: /, /gallery/, /video/,
  /comment/, /100-reasons-why/, /settings/ — no errors).
- `npx astro check` → 0 errors, 0 warnings.
- All fonts render (DC-CST, awkwardblack, wenwrite + Noto Sans HK from
  Google Fonts); every named custom font has an `@font-face` declaration.
- **Blessing wall works end-to-end** — a real submission was tested:
  form (client-side validated) → Web3Forms email with a ready-to-click
  approval link → GitHub Issue → approve action appends + explicitly
  dispatches the Pages deploy → blessing live ~30s. See
  DECISIONS.md 2026-09-08 for the deploy-dispatch gotcha.
- `/settings/` owner-only UI (PAT in sessionStorage): List editor,
  List links, Photos, Videos, and 💌 Blessings tabs. `noindex`.
- Gallery photos deep-link from checked bucket items (camera badge);
  videos deep-link from the play badge.
- Custom domain `buc.ketli.st` (CNAME → `f43d.github.io`), TLS via
  GitHub Pages.

### What's in scope to do (open items, in priority order)

1. **GitHub designated successor** (owner action, ~5 min) — see
   `docs/PERMANENCE.md`.
2. **Calendar reminder for 6 June 2027** (domain renewal).
3. **Mirror the repo to GitLab** (one-time): `git remote add gitlab
   https://gitlab.com/f43d/love-list-astro.git` then `git push gitlab main`.
4. **Add a local backup**: `git clone … ~/backups/love-list-astro`.
5. **Cloudflare account**: add a backup email + 2FA (single email today).
6. **The test blessing** (小吉, "Happy Birthday !") is on the wall — the
   owner may want to remove it via /settings/ → 💌 Blessings now that the
   site is public.

### Last-session artifacts

- `docs/PERMANENCE.md` action items at the top are the standing to-do list.
- `docs/DECISIONS.md` has the full decision history through 2026-09-08
  (incl. blessing-deploy dispatch, settings photo 409 fix, camera-icon
  click-through rule).
- The site goes fully public 2026-09-09 — everything is verified working.

### Things the next AI should NOT do

- Don't add a runtime backend. The site is intentionally static.
  If a feature "needs a server", the right answer is almost always
  Web3Forms, GitHub Issues, GitHub Actions (none of which are a "server"
  to run).
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
- Don't simplify away the blessing workflow's explicit
  `workflow_dispatch` (GITHUB_TOKEN pushes don't cascade — see
  DECISIONS.md 2026-09-08).

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
  GitHub Pages; also fires on manual `workflow_dispatch`),
  `.github/workflows/approve-blessing.yml` (moderates blessings; dispatches
  the deploy after its own push)
- **Hidden pages**: `/settings/` (no public link — owner-only, noindex)
- **Public data files**: `data/list.env`, `data/gallery.env`,
  `data/videos.env`, `data/blessings.env`
- **GitHub Variables needed**: `PUBLIC_WEB3FORMS_KEY` (Actions
  variables, scope: repo). Without it the blessing form is disabled.

## Last session summary (2026-08-30 — original handoff)

Historical note: the first handoff was written 2026-08-30 after the Hugo →
Astro rewrite. It covered: PERMANENCE placeholders filled, 4 DC-CST
substitutions (強→强, 氹→哄, 為→爲, 錄→録), and the shared-module cleanup
(`src/lib/{types,parseEnv,utils}.ts`).

## Most recent state (2026-09-08 — launch eve)

The site went fully public 2026-09-09. Latest verified facts are in
§"Current state at handoff" above and in `docs/sessions/2026-09-08.md`.
Key additions since the original handoff: the gallery (in-repo WebP),
the /video/ clips page, the owner-only /settings/ UI (now 5 tabs
including Blessings), form validation + one-click approval, and the
deploy-dispatch fix so approved blessings actually publish.

---

_Last updated: 2026-08-30 (handoff written)._
