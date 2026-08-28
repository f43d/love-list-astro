# Architecture

## Data flow

```
                      ┌─────────────────────┐
   owner edits ──────►│   data/*.env files  │
                      └──────────┬──────────┘
                                 │ parsed at build time by
                                 ▼
                       src/lib/parse*.ts
                                 │
                                 ▼
                       Astro components (.astro)
                                 │ rendered to
                                 ▼
                          dist/ (static HTML/CSS/JS)
                                 │
                  git push main │
                                 ▼
       ┌────────────────  GitHub Actions  ────────────────┐
       │                                                  │
       │  deploy.yml         approve-blessing.yml         │
       │  build + upload     appends data/blessings.env   │
       │  artifact           on Issue opened              │
       │         │                       │                │
       └─────────┼───────────────────────┼────────────────┘
                 ▼                       ▼
        GitHub Pages CDN         (new commit on main
       → buc.ketli.st            → triggers deploy.yml)
```

## Site content

| File | Purpose | Mutability |
| --- | --- | --- |
| `data/list.env` | 100 bucket items | Owner edits, parsed by `parseList.ts` |
| `data/blessings.env` | Approved blessings | Appended by `approve-blessing.yml` action |
| `public/CNAME` | Custom domain | Locked to `buc.ketli.st` |
| `public/fonts/*` | DC-CST, awkwardblack (woff/woff2) | Frozen |
| `public/images/*` | Profile photo, background, gallery | Frozen for now |
| `public/svg/checkboxes/*` | Per-state checkbox SVGs (4 variants) | Frozen |
| `public/svg/numbers/*` | Number-glyph SVGs (legacy, unused now) | Frozen |

## Source layout

```
src/
├── components/        Reusable .astro components
│   ├── Header.astro           Site header + marriage counter
│   ├── Footer.astro           Footer + back-to-top
│   ├── BucketList.astro       Renders data/list.env
│   ├── BlessingForm.astro     Web3Forms-bound form
│   ├── BlessingsWall.astro    Renders data/blessings.env
│   └── Gallery.astro          Grid + native <dialog> lightbox
├── layouts/
│   └── Base.astro             <html> shell, fonts, head meta
├── lib/                Build-time data loaders
│   ├── parseList.ts           → BucketItem[]
│   └── parseBlessings.ts      → Blessing[]
├── pages/              File-based routes
│   ├── index.astro            → /
│   ├── 100-reasons-why.astro  → /100-reasons-why/
│   ├── gallery.astro          → /gallery/
│   └── comment.astro          → /comment/
└── styles/
    └── global.css             Tokens + component styles
```

## Data model

### `data/list.env`

```
NN|checked|text|link
```

- `NN` — two-digit number, parsed as integer
- `checked` — `true` / `false`
- `text` — Traditional Chinese (or English) item title
- `link` — URL or empty. For checked items, point at a photo on Cloudflare R2 / Immesh.

### `data/blessings.env`

```
NN|YYYY-MM-DD|name|message
```

- `NN` — two-digit number (auto-incremented by Action)
- `YYYY-MM-DD` — ISO date
- `name` — visitor's display name (1–40 chars after sanitising)
- `message` — blessing (1–280 chars after sanitising)

## Design tokens (`src/styles/global.css` `:root`)

| Token | Value | Use |
| --- | --- | --- |
| `--color-text` | `#2f5061` | Primary text |
| `--color-text-hover` | `#E57F84` | Coral hover |
| `--color-divider` | `silver` | List dividers |
| `--color-footer` | `#111` | Footer text |
| `--font-hand` | `DC-CST` family | Hand-written list text |
| `--font-display` | `awkwardblack` family | Display / content text |

## Deploy flow

1. Owner pushes to `main`.
2. `.github/workflows/deploy.yml`:
   - `npm ci`
   - `npm run build` (env: `PUBLIC_WEB3FORMS_KEY` from Variables)
   - Uploads `dist/` as Pages artifact.
3. GitHub Pages serves at custom domain.

## Moderation flow

1. Visitor submits at `/comment/`.
2. Web3Forms POST → email to owner's mailbox.
3. Owner opens a pre-filled GitHub Issue (link template in README).
4. `.github/workflows/approve-blessing.yml` triggers on Issue:
   - Parses `<!-- blessing-approval -->` block.
   - Appends sanitised entry to `data/blessings.env` with next id.
   - Commits + pushes to `main`.
   - Comments on Issue + closes it.
5. Push triggers `deploy.yml` — new blessing appears ~30 s later.

## Browsers &amp; performance

- Modern evergreen browsers only.
- Two preloaded webfonts per page; total CSS ~10 KB gzipped.
- All images `loading="lazy"` except hero profile.
- Native HTML elements (`<dialog>`) over JS libraries.
