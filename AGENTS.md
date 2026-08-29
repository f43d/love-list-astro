# AGENTS.md — Context for future AI agents (and humans)

If you are an AI agent reading this: hi. **Read this file first.** Then read `docs/ARCHITECTURE.md` and `docs/DECISIONS.md` before doing any work.

## What this project is

A static personal bucket-list site for a married couple. Lists 100 things to do together. Includes a gallery, a "100 reasons not to marry" page, and a public blessing wall with private moderation.

Live at: **https://buc.ketli.st** (GitHub Pages with custom domain).
Source: https://github.com/f43d/love-list-astro

## Stack — do not deviate without updating DECISIONS.md

- **Astro 5** with `output: 'static'`. No SSR. No serverless functions.
- **Plain CSS** with custom properties (tokens in `src/styles/global.css` `:root`).
- **Vanilla JS only** — no React / Vue / Svelte / jQuery / Tailwind / nanogallery2.
- **Web3Forms** for the blessing form (free, no backend, see `OPERATIONS.md`).
- **GitHub Issues + Actions** for blessing moderation (no comments service to run).
- **GitHub Pages** for hosting via Actions, custom domain via `public/CNAME`.

## Build / dev / deploy

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist (committed by Actions, not by you)
```

Deploy is automatic: push to `main` → `.github/workflows/deploy.yml` → GitHub Pages. **Never commit `dist/`.**

## Conventions

- File naming: `PascalCase.astro` for components, `kebab-case.ts` for non-component scripts, `kebab-case.env` for data files.
- All content text uses Traditional Chinese (zh-Hant). Match existing tone.
- Design tokens live exclusively in `src/styles/global.css` `:root` block — change colours/fonts there.
- New pages follow the existing `Base.astro` layout (see `src/pages/` for examples).
- **Pipe-separated `.env` files** for tabular site content (see `docs/ARCHITECTURE.md` §"Data model"). Never JSON/YAML for content the owner edits manually.
- Commit messages: `<type>(<scope>): <summary>` (e.g. `gallery: replace lightbox`, `blessings: switch from Artalk to Web3Forms`).
- AI-authored commits get `Co-authored-by: opencode <noreply@opencode>` in the trailer.
- When making a non-trivial decision, append to `docs/DECISIONS.md`. State the decision, context, alternatives, and consequence.
- When finishing a session of work, run `npm run end-of-day --silent` to gather git context, then draft the 3 doc updates per `docs/OPERATIONS.md` §"End-of-day routine".

## End-of-day routine

Triggered when the user says **"call it a day"** (or similar). The agent MUST:

1. Run `npm run end-of-day --silent` and read the JSON to know what changed.
2. Generate **draft text** for:
   - `docs/sessions/<today>.md` (or append if today's file exists)
   - `docs/DECISIONS.md` (only if a real decision was made — `suggestions.appendDecisions` is a hint, not a mandate)
   - `CHANGELOG.md` (only if user-visible — `suggestions.updateChangelog` is a hint)
3. Show drafts to the user as readable preview (no automatic edits yet).
4. Wait for explicit confirmation. The user may edit the drafts.
5. On confirmation: write the files, commit with a `docs(session): ...` message, push.

Do **not** invent decisions that weren't discussed. If unsure, ask. Prefer to skip `DECISIONS.md` and `CHANGELOG.md` rather than guess.

## Things to never do

- Don't add a runtime backend (Workers, Functions, Edge functions) without explicit ask.
- Don't switch off the historical colour palette (`#2f5061`, `#e57f84`).
- Don't replace the DC-CST / awkwardblack handwritten fonts.
- Don't enable a dark mode unless asked — the original site is light-only.
- Don't add analytics / trackers — the site is private.
- Don't create issues on the user's behalf; the moderation flow expects the user to drive approvals.
- Don't commit secrets (`PUBLIC_WEB3FORMS_KEY` lives in `.env` / GitHub Variables, not source).
- **Don't ship a site without verifying `@font-face` declarations exist for every named font.** Token references (`font-family: 'DC-CST'`) are not enough — the browser needs `@font-face` to know where to download the font files. If only fallbacks are referenced, fonts silently render as system defaults and the bug is invisible until a non-Latin user visits. See DECISIONS.md entry 2026-08-28.
- **Don't add `text-decoration: underline` to any link.** All links in this site use `color: var(--color-text-hover)` (coral) with opacity 0.65 on hover/focus. The pattern lives in `.site-header__title a`, `.content-text a`, `.site-footer a`. New links must follow the same pattern. See DECISIONS.md entry 2026-08-28.

## Owners / context

- Owner: `f43d` on GitHub.
- Domain owner: managed via Cloudflare DNS for `ketli.st`. **Current DNS** (changed on 2026-08-28 morning): `buc.ketli.st` is a **CNAME → `f43d.github.io`** (grey cloud / DNS only). Earlier used four A records to GitHub IPs; both work but CNAME is the documented GitHub-preferred path for subdomains.
- The previous Hugo repo `papermod-lovelist4` is left untouched — it stays as a historical reference.

## Where to look first

1. `docs/DECISIONS.md` — every trade-off explained
2. `docs/HISTORY.md` — what came from Hugo, what changed in Astro
3. `docs/ARCHITECTURE.md` — data flow + deploy flow
4. `docs/OPERATIONS.md` — env vars, secrets, debugging
5. `docs/sessions/` — chronological log of recent changes
