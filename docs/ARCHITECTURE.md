# Architecture

## Data flow

```
                      ┌─────────────────────┐
   owner edits ──────►│   data/*.env files  │   via GitHub API
                      └──────────┬──────────┘      (/settings/ UI)
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
                 git push main │   (or approve-blessing action push)
                                 ▼
       ┌────────────────  GitHub Actions  ────────────────┐
       │                                                  │
       │  deploy.yml              approve-blessing.yml    │
       │  build + upload          appends data/blessings  │
       │  artifact on push        .env on Issue opened,   │
       │         │                then EXPLICITLY fires   │
       │         │                a workflow_dispatch on  │
       │         │                deploy.yml (GITHUB_TOKEN │
       └─────────┼──────────────── pushes don't cascade)  │
                 ▼                                        │
        GitHub Pages CDN ─────────────────────────────────┘
       → buc.ketli.st
```

## Site content

| File | Purpose | Mutability |
| --- | --- | --- |
| `data/list.env` | 100 bucket items | Owner edits, parsed by `parseList.ts` |
| `data/gallery.env` | Gallery photo metadata | Owner edits via /settings/ |
| `data/videos.env` | Video clip metadata | Owner edits via /settings/ |
| `data/blessings.env` | Approved blessings | Appended by `approve-blessing.yml` action; editable via /settings/ |
| `public/CNAME` | Custom domain | Locked to `buc.ketli.st` |
| `public/fonts/*` | DC-CST, awkwardblack, wenwrite (woff2) | Frozen |
| `public/images/*` | Profile photo (`profile.jpg`, feathered via CSS mask), `background.jpg`, gallery webps | Photos owned; gallery webps via /settings/ |
| `public/svg/checkboxes/checked1-4.svg`, `unchecked1-4.svg` | Per-state checkbox SVGs (4 variants) | Frozen |

## Source layout

```
src/
├── components/        Reusable .astro components
│   ├── Header.astro           Site header + marriage counter
│   ├── Footer.astro           Footer + back-to-top
│   ├── BucketList.astro       Renders data/list.env (+ photo/video badges)
│   ├── BlessingForm.astro     Web3Forms-bound form (validated client-side)
│   ├── BlessingsWall.astro    Renders data/blessings.env
│   └── Gallery.astro          Grid + native <dialog> lightbox
├── layouts/
│   └── Base.astro             <html> shell, fonts, head meta, robots prop
├── lib/                Build-time + client data loaders
│   ├── types.ts               Shared data types (BucketItem, GalleryItem, VideoItem, Blessing)
│   ├── parseEnv.ts            Generic pipe-separated env parser + cache
│   ├── parseList.ts           data/list.env     → BucketItem[]
│   ├── parseGallery.ts        data/gallery.env  → GalleryItem[]
│   ├── parseVideos.ts         data/videos.env   → VideoItem[]
│   ├── parseBlessings.ts      data/blessings.env → Blessing[]
│   ├── settingsClient.ts      Client-side GitHub API helpers for /settings/
│   └── utils.ts               pickRandomInt, formatBytes, escapeHtml
├── pages/              File-based routes
│   ├── index.astro            → /
│   ├── 100-reasons-why.astro  → /100-reasons-why/
│   ├── gallery.astro          → /gallery/
│   ├── comment.astro          → /comment/
│   ├── video.astro            → /video/  (clip player)
│   └── settings.astro         → /settings/  (owner-only, noindex)
└── styles/
    └── global.css             Tokens + component styles
```

## Data model

### `data/list.env`

```
NN|checked|text|link|photo
```

- `NN` — two-digit number, parsed as integer
- `checked` — `true` / `false`
- `text` — Traditional Chinese (or English) item title
- `link` — external URL, or `https://example.com` placeholder (treated as "no link")
- `photo` — (optional 5th column) gallery photo id. A checked item with a
  `photo` deep-links to `/gallery/#<photo>` and shows the camera badge.

Every row now carries all 5 columns. `parseList.ts` uses `fieldCount=5` —
do not drop it back to 4, or the photo id merges into `link` and badges
disappear.

### `data/gallery.env`

```
NN|date|location|caption|url
```

- `NN` — two-digit id (kept stable; gaps are fine, don't re-number)
- `date` — YYYY-MM-DD when the photo was taken
- `location` / `caption` — free text (caption shows in the lightbox)
- `url` — repo path `/images/gallery/NN.webp` or a full URL

Photos are stored in-repo as WebP (~1600px long edge). Managed via
`/settings/` Photos tab.

### `data/videos.env`

```
NN|date|caption|file|item
```

- `NN` — two-digit id
- `date` — YYYY-MM-DD when the clip was filmed (optional)
- `caption` — free text
- `file` — repo path `/videos/NN.mp4` or a full URL
- `item` — bucket-list item number this clip belongs to (optional). Clips
  sharing an item group under one heading on `/video/`.

Managed via `/settings/` Videos tab.

### `data/blessings.env`

```
NN|YYYY-MM-DD|name|message
```

- `NN` — two-digit number (auto-incremented by Action)
- `YYYY-MM-DD` — ISO date
- `name` — visitor's display name (1–40 chars after sanitising)
- `message` — blessing (1–300 chars after sanitising)

Managed via `/settings/` Blessings tab (edit/delete). New entries are
appended by `approve-blessing.yml` on Issue approval.

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

1. Visitor submits at `/comment/`. The form validates client-side
   (name = letters/CJK/spaces only; email pattern; message ≤300 chars).
2. Web3Forms POST → email to owner. The email includes a pre-built
   `approval_link` (a GitHub Issue URL with name/email/message filled in),
   so approving is one click — no copy-pasting.
3. Owner clicks the link (or uses the template in README / OPERATIONS).
4. `.github/workflows/approve-blessing.yml` triggers on the Issue:
   - Parses `<!-- blessing-approval -->` block.
   - Appends sanitised entry to `data/blessings.env` with next id.
   - Commits + pushes to `main`.
   - **Explicitly dispatches `deploy.yml`** (a `GITHUB_TOKEN` push does not
     auto-trigger other workflows — see DECISIONS.md 2026-09-08).
   - Comments on Issue + closes it.
5. Pages deploy runs — new blessing appears ~30 s later.

Rejecting a blessing = simply don't open the approval link. Approved
blessings can be edited/deleted later via `/settings/` 💌 Blessings tab.

## Browsers &amp; performance

- Modern evergreen browsers only.
- Two preloaded webfonts per page; total CSS ~10 KB gzipped.
- All images `loading="lazy"` except hero profile.
- Native HTML elements (`<dialog>`) over JS libraries.
