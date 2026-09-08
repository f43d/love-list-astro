# love-list-astro

A static bucket-list site for a married couple (翁強 & Josephine) — a gift that
is meant to outlive its owner. Lists 100 things to do together, with a photo
gallery, videos, a "100 reasons not to marry" page, and a public blessing wall
with private moderation.

Live at **https://buc.ketli.st** · Source on GitHub
(f43d/love-list-astro). If you are here to maintain the site, read
`docs/PERMANENCE.md` first, then `AGENTS.md`.

## Stack

- [Astro 5](https://astro.build) — static output (`output: 'static'`), no server
- Plain CSS with custom properties (tokens in `src/styles/global.css` `:root`)
- Vanilla JS only — no React / Vue / Tailwind / jQuery
- [Web3Forms](https://web3forms.com) for the blessing form (no backend)
- GitHub Issues + Actions for blessing moderation
- GitHub Pages hosting via Actions, custom domain via `public/CNAME`

## Pages

| Path | Purpose |
| --- | --- |
| `/` | The 100-item bucket list (photo/video badges deep-link into the gallery / video page) |
| `/gallery/` | Photo grid + native lightbox |
| `/video/` | Video clips, grouped by bucket item |
| `/comment/` | Blessing form + approved blessing wall |
| `/100-reasons-why/` | The couple's "reasons not to marry" prose |
| `/settings/` | **Owner-only.** Not linked anywhere. Manage photos, videos, list items, and blessings. `noindex`. |

## Where content lives

All site content is pipe-separated `.env` files in `data/` (never JSON/YAML —
they're hand-editable). See `docs/ARCHITECTURE.md` §"Data model" for the exact
formats of each file:

- `data/list.env` — the 100 bucket items (`NN|checked|text|link|photo`)
- `data/gallery.env` — gallery photos (`NN|date|location|caption|url`)
- `data/videos.env` — video clips (`NN|date|caption|file|item`)
- `data/blessings.env` — approved blessings (`NN|date|name|message`)

## Editing content

The **recommended** way for the owner/family is the hidden `/settings/` page:

1. Open `https://buc.ketli.st/settings/`
2. Paste a GitHub **fine-grained PAT** with `Contents: Read and write` on
   this repo (kept in `sessionStorage`, cleared on tab close).
3. Use the tabs: List editor, List links, Photos, Videos, Blessings.
   Every save commits to the repo via the GitHub API and deploys ~30 s later.

To edit files directly instead, change `data/*.env`, commit, push.

## Blessings (comment wall) — moderation

A visitor's blessing goes through the owner before it appears:

```
Visitor → form on /comment/ (client-side validated)
   ↓ POST → Web3Forms → email to owner
   ↓ The email includes a ready-to-click approval link
   ↓ Owner clicks it → a pre-filled GitHub Issue opens
   ↓ approve-blessing.yml appends to data/blessings.env,
   │   pushes, and explicitly fires the Pages deploy
   ↓
Blessing appears on /comment/  (~30 s later)
```

Rejecting = just don't click the approval link. To edit or remove a blessing
later, use `/settings/` → 💌 Blessings.

Details: `docs/ARCHITECTURE.md` §"Moderation flow", `docs/OPERATIONS.md`
§"Blessing approval", and the DECISIONS.md note about why approval explicitly
dispatches the deploy.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist (committed by Actions, never by you)
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The custom domain is
fixed by `public/CNAME` → `buc.ketli.st`. Pushes made by GitHub Actions'
`GITHUB_TOKEN` do **not** auto-trigger deploys — workflows that need a deploy
after their own push (blessing approval) dispatch it explicitly.

## Documentation map (for future maintainers)

- `docs/PERMANENCE.md` — how the site survives (domain, backups, successor). **Read first if you're taking over.**
- `AGENTS.md` — project conventions + guardrails for an AI agent.
- `docs/ARCHITECTURE.md` — data flow, deploy flow, moderation flow, data model.
- `docs/OPERATIONS.md` — day-2 ops, env vars, settings page, common gotchas.
- `docs/DECISIONS.md` — every design decision and why (append-only).
- `docs/HANDOFF.md` — how to hand the project to the next AI session.
- `docs/sessions/` — chronological session log.
