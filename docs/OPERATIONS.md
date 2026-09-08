# Operations

Day-2 maintenance guide. Goal: anyone (human or AI) can fix any common problem in &lt;10 minutes.

**If you're taking over the site** (the owner is no longer available), start
with `docs/PERMANENCE.md` — it explains where everything lives and what to do
if a piece breaks. This file is the day-to-day reference.

## Local development

```bash
npm install                   # first time
npm run dev                   # http://localhost:4321
npm run build                 # outputs to ./dist
npm run preview               # serve ./dist locally
```

## Environment variables

| Var | Where set | Used by | Where to obtain |
| --- | --- | --- | --- |
| `PUBLIC_WEB3FORMS_KEY` | `.env` locally; GitHub Variables in CI | `BlessingForm.astro` (build time, embedded in HTML) | https://web3forms.com — paste your email → copy access key |

Never commit `.env`. `.env.example` is committed and shows the schema.

To set in GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**.

## Pages

| Path | Purpose | Linked from |
| --- | --- | --- |
| `/` | 100-item bucket list | everywhere |
| `/gallery/` | Photos + lightbox | bucket-list camera badges |
| `/video/` | Video clips grouped by bucket item | bucket-list video badges |
| `/comment/` | Blessing form + wall | footer |
| `/100-reasons-why/` | The couple's prose | header |
| `/settings/` | Owner-only management UI | **nowhere** (visit the URL directly) |

## Deploy

Push to `main` triggers `.github/workflows/deploy.yml`:

1. `npm ci`
2. `npm run build` with `PUBLIC_WEB3FORMS_KEY` from Variables
3. Uploads `dist/` as Pages artifact
4. GitHub Pages deploys

**Manual re-deploy**: visit Actions → pick run → "Re-run all jobs". Needed if env vars change.

**Gotcha**: a push made *by a GitHub Action using `GITHUB_TOKEN`* does not
auto-trigger other workflows. The blessing-approval workflow therefore
explicitly dispatches the deploy after it pushes (see DECISIONS.md 2026-09-08).

## Blessing approval

A visitor submits on `/comment/` → Web3Forms emails the registered address.
**The email now includes a pre-built `approval_link`** — a GitHub Issue URL
with the name/email/message already filled in. So approving is:

1. Click the `approval_link` in the email → a pre-filled Issue opens.
2. (Optional) Edit the name/message if you want.
3. Click **Submit new issue**.
4. `approve-blessing.yml` appends to `data/blessings.env`, pushes, and fires
   the Pages deploy.
5. Blessing appears on `/comment/` ~30 s later.

To approve by hand instead (e.g. if you reply to the email from your phone),
use this template — replace `<name>`, `<message>`:

```
https://github.com/f43d/love-list-astro/issues/new?title=[blessing-approval]&body=<!-- blessing-approval -->%0A%0A**Name:** <name>%0A**Date:** <YYYY-MM-DD>%0A**Message:** <message>%0A%0A<!-- /blessing-approval -->
```

To reject: just don't open the link. To edit/delete an approved blessing,
use `/settings/` → 💌 Blessings tab.

## Adding / editing items

The owner/family should prefer the **`/settings/` page** (see below) over
hand-editing. If editing files directly:

- **Bucket item**: edit `data/list.env` (5 columns now — `NN|checked|text|link|photo`), commit, push.
- **Gallery photo**: `data/gallery.env` + the webp in `public/images/gallery/`.
- **Video clip**: `data/videos.env` + the mp4 in `public/videos/`.
- **Reasons-why prose**: `src/pages/100-reasons-why.astro`.
- **New page**: create `src/pages/<path>.astro` extending `Base.astro`, add nav in the header/footer as appropriate.

## Changing colours / fonts

Edit `src/styles/global.css` `:root` block. The site has one source of truth — no component-level overrides.

```css
:root {
  --color-text: #2f5061;
  --color-text-hover: #e57f84;
  ...
}
```

## Common gotchas

- **`PUBLIC_WEB3FORMS_KEY` not set** → form shows a "form not enabled" warning and inputs are disabled. Check GitHub Variables or `.env`.
- **Blessing count gap** — the approve action computes next id as `max(ids) + 1`, so deleting old entries leaves gaps. That's fine; do not re-number.
- **Pipe character in items** — all four `.env` data files treat `|` as the field separator. Replace with `/` in any user content.
- **`data/list.env` is 5 columns now** — `NN|checked|text|link|photo`. `parseList.ts` uses `fieldCount=5`. If a future schema change is made, keep the parser and data file in sync (a mismatch silently breaks photo badges — see DECISIONS.md 2026-09-07).
- **Approved blessing not appearing?** — check whether a `Deploy to GitHub Pages` run exists for the blessing commit. If not, the approve action's explicit `workflow_dispatch` may have failed; check the approve workflow's permissions (`actions: write`) and re-run it.
- **Trailing newline missing in `.env`** — the parsers handle it, but a CI edit adding a line WITHOUT a final newline can produce one big line. Always end files with `\n`.
- **Long Chinese strings** — the CSS line-heights assume ~1.5× font size; if a string contains many `…` or unusual punctuation, test on mobile.
- **Custom domain not resolving** — wait 5–30 min after DNS edit. Re-check with:
  ```bash
  dig +short buc.ketli.st A @1.1.1.1
  ```
  Expected: 4 GitHub IPs (or the CNAME target).

## Backup / restore

- Source is git in GitHub — that's the canonical backup.
- No user-generated data lives in the database — content is committed to `data/*.env`.
- Approved blessings live in git history; restoring is `git checkout data/blessings.env@<sha>`.

## End-of-day routine

When you (or your AI agent) say **"call it a day"**, follow this disciplined close-out so future-you and future-agents have full context.

### What the AI does

1. Run `npm run end-of-day --silent` — outputs a JSON snapshot:
   ```json
   { "today": "...", "commits": [...], "filesChanged": [...], "suggestions": {...} }
   ```
   Or `npm run end-of-day:md` for a Markdown rendering.
2. Draft **three** updates based on what's changed:
   - `docs/sessions/<today>.md` (or append to the existing one for today) — a short log of what was done, why, open questions.
   - `docs/DECISIONS.md` — append-only entry if any non-trivial decision was made. Format: **decision** + **context** + **alternatives rejected** + **consequence**.
   - `CHANGELOG.md` — user-facing entry if anything visitors will see changed (pages, components, styles).
3. Show the drafts in chat — **do not write them to disk yet**.
4. Wait for the user to approve / edit / drop them.
5. On approval: write the files, stage, commit (`docs(session): end-of-day <date>`), and ask for a token to push.

### Heuristics the script uses

- **Decisions to log** when files in `src/components/`, `.github/workflows/`, or top-level config (`package.json`, `astro.config.mjs`) change.
- **CHANGELOG entry** when files in `src/pages/`, `src/components/`, or `src/styles/` change.
- **Session log**: every working day always gets one — append if same day, new file if later.

### What you (the user) do

1. Read the drafts.
2. Confirm, edit, or ask for changes. Be specific: "drop the CHANGELOG entry", "shorten the rationale in DECISIONS", etc.
3. Say **"yes, push"** (or similar). Provide a fresh GitHub PAT when asked (the one used to push the day before won't be needed any longer — revoke it).

### Discipline

- If a session has **no real decision** (e.g. just typo fixes, dependency bumps), it's still worth a session log but skip `DECISIONS.md`.
- If a session only touches internal plumbing (CI, types, no user-visible), it's still worth a session log but skip `CHANGELOG.md`.

## Sources / credentials checklist

Owner should have access to:

- ✓ GitHub account `f43d`, repo `love-list-astro` (admin)
- ✓ Cloudflare account owning zone `ketli.st` (DNS editor)
- ✓ `wish.sorio.us` is **no longer needed** — was the Artalk server, retired
- ✓ Web3Forms account (email registration)
- ✓ Fine-grained GitHub PAT (rotate annually)

Rotate/revoke the GitHub PAT used for the initial push once no longer needed.

## Settings page (owner-only)

The site has a hidden `/settings/` page (no link anywhere; `noindex`) that lets
the owner/family manage all content through a UI instead of editing env files.

**Auth**: paste a GitHub **fine-grained PAT** (Contents: Read+write on
`f43d/love-list-astro`). Token is held in `sessionStorage` (cleared when the
tab closes) — not `localStorage`, to limit exposure.

**Capabilities** (tabs, left to right):
- **List editor** — edit item text + checked state, add items (auto-fills
  the lowest missing NN). 10 per page.
- **List links** — link a checked bucket item to a gallery photo (this is
  what makes the camera badge + deep-link appear).
- **Photos** — view/edit/delete gallery photos; upload new ones (browser
  resizes to 1600 px wide WebP and commits). Also edit date/location/caption.
- **Videos** — upload or reference video clips, group them under a bucket
  item.
- **Blessings** — edit or delete approved blessings on the wall.

**Every commit triggers the existing GitHub Actions deploy.** Changes go live
~30 s after a save.

**PAT scope requirements**: Contents: Read and write on `love-list-astro` only. Token has no other scopes.

**For family / future maintainers**: see `docs/PERMANENCE.md`. The `/settings/`
page is owner-only — visitors don't see it, and it must never be linked from a
public page.
