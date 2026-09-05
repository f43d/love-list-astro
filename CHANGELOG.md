# Changelog

User-facing changes. Newest entries at top. Format: `## YYYY-MM-DD — summary`.

---

## 2026-08-31 — OpenChamber installed (morning), iOS Firefox dark-mode investigation + UI tweaks (evening)

### Added (morning)

- **OpenChamber 1.22.0** installed alongside `opencode-web` on the
  Proxmox LXC at `http://192.168.1.40:3001/`. Same PAT as the opencode-web
  service. Documented in `docs/sessions/2026-08-31.md`.

### Changed (evening)

- **Theme: light-mode enforcement for the wallpaper.** html + body now
  explicitly use the warm cream `#faf3e0`; the wallpaper lives on a
  fixed-position body::before with `z-index: -1` so the three layers
  stack correctly (html bg → wallpaper → body content). Verified
  working on macOS Firefox + Android Firefox. Known limitation:
  iOS Firefox still renders with a black background — accepted per
  `docs/DECISIONS.md` "Don't chase iOS Firefox dark-mode fix".
- **`.content-text` font** on `/100-reasons-why/` bumped ~20 % on
  desktop (`clamp(1.15rem, 0.72rem + 1.32vw, 2.04rem)`); mobile stays
  the same at the 1.15 rem min.
- **`.site-header__text` padding in portrait** — 12 px top + 16 px
  bottom inside the portrait @media block for breathing room around
  the title lines (no change to photo or text sizes).

---

## 2026-09-05 — Hero photo replaced with feathered PNG

### Changed

- **Hero photo** (`src/components/Header.astro`) now uses a 900 ×900
  PNG with a 30 px transparent ring around the rectangular edge
  instead of the original JPEG. CSS clips the square to a circle
  via `border-radius: 50%`, so the rectangle's feather becomes the
  visible circle's feather — a "natural" Photoshop-feather look
  without a CSS halo.
- **CSS `box-shadow` on `.site-header__photo`** removed (4-stop white
  halo). The PNG's own feather replaces it. Kept the 2 px white
  border for definition.
- **Hero image src includes a cache-bust query string**
  (`?v=20260905`) — GitHub Pages serves `/images/*` with
  `max-age=31536000`; without the cache-buster iOS Safari was
  showing the cached pre-deploy image.

---

## 2026-08-30 — OpenCode web UI setup, AI-WORKFLOW doc, last DC-CST fixes

### Added

- `docs/HANDOFF.md` — full project brief a fresh session can read in
  ~3 minutes and be productive. Includes the exact prompt the user
  pastes to start a session.
- `docs/AI-WORKFLOW.md` — when to install which opencode plugin
  (current site: nothing; new codebases: obra/superpowers; big
  refactors: oh-my-opencode-slim temporarily).
- `docs/PERMANENCE.md` filled in (Cloudflare registrar, 6 June 2027
  renewal, son/daughter as GitHub designated successor, GitLab mirror
  + local backup as action items).
- `docs/sessions/2026-08-30.md` — same-day log of the morning
  session.
- **`/settings/` page can now edit the bucket list** — new section
  4 ("Edit bucket list") with one row per item: checkbox + text
  input + Save button. One GitHub commit per row (message
  `list: update item NN`). Rows with empty text are hidden from
  the editor and from the public list, matching the
  data-file-is-source-of-truth convention. The `link` (external
  URL) and `photo` (gallery id) fields are intentionally not
  editable here — section 3 already handles `photo`, and `link`
  rarely changes.

### Changed (UI polish, evening)

- **Header subtitle font-size** now matches title in all viewports
  (default, landscape, portrait) — was smaller in two of three blocks.
- **Header mask gradient** softened from a hard 70 % cutoff to a
  4-stop fade so the bottom 30 % no longer reads as a separate layer.
- **Header backdrop / content split** — the blur-backdrop and mask
  now live on a dedicated `.site-header__backdrop` behind the
  content, so the hero photo is never see-through and the list text
  scrolling past the header stays consistently behind it.
- **Bucket list focal zoom** bumped from 1.3× → 1.45× and now uses
  `--color-text-focal: #c4364a` (deeper coral than the hover
  accent) for more contrast at the focal peak.
- **Bucket list checked items** now share the same font-size and
  focal animation as unchecked items (previously inherited body 1 rem
  and skipped the animation).
- **Hero photo border** now has a 4-stop white-halo feather
  (~20 px reach) so the edge fades into the page background instead
  of reading as a cut-and-paste ring.

### Changed (settings page)

- `/settings/` restructured into 3 tabs: **List editor** (default),
  **List links**, **Photos**. One click between concerns; no more
  scrolling past unrelated sections.
- List editor paginated to 10 items per page (Prev/Next + "Page X of
  Y" indicator). Item 89 is now reachable via page 9 instead of
  scrolling through 88 rows above it.
- Editor now shows all items (including blank-text rows) so newly-
  added empty rows can be edited immediately. The public list still
  omits blank-text rows.
- "➕ Add item" button at the top of the List editor tab creates a
  row with the lowest missing NN (fills 90, 91, … 97 in order, then
  100+). After add, the page jumps to the new item.

### Fixed (final)

- 為 → 爲 (data/list.env item 74) — Traditional variant, in DC-CST.
- 錄 → 録 (data/list.env item 89) — Japanese shinjitai, in DC-CST.
  After this, no DC-CST-missing char is rendered in a DC-CST context.

### Operations (outside the repo)

- OpenCode web UI deployed on the Proxmox LXC at
  `http://192.168.1.40:3000` (LAN IP, systemd service, auto-restart).
  Auth via `OPENCODE_SERVER_PASSWORD` env var. Started with
  `opencode web --port 3000 --hostname 0.0.0.0 --pure`; the
  `--pure` flag skips OpenCode's hosted-service billing check.
- The user will switch to this web UI for future sessions
  (iPhone-friendly chat + screenshot paste + file upload).

### Documentation

- `docs/HANDOFF.md` is the canonical "start here" brief for any
  future AI session on this project.
- `docs/AI-WORKFLOW.md` is the canonical "what plugin to install
  when" reference.
- `docs/PERMANENCE.md` updated to link to both new docs.

## 2026-08-29 — Responsive design overhaul + wenwrite font

### Added

- **Wenwrite Proportional** font on `/100-reasons-why/` body prose.
  Subsetted to 82 KB woff2 covering only the 244 codepoints used in
  the body.
- **Hidden `/settings/` page** for owner-only photo management. Auth
  via PAT in sessionStorage; upload/edit/delete photos; link to checked
  bucket items. All client-side — no server added.
- Responsive design rewrite using `clamp()` for fluid type/spacing,
  `@container` queries on the header, and a portrait-specific
  `@media` rule that bumps padding for the hero photo + 3-line text
  block.

### Changed

- Header layout now responds to the actual header width (not the
  viewport) via `@container (max-width: 30rem)` for the column-stack
  trigger.
- Header photo / counter / title / subtitle sizes all use `clamp()` —
  scale fluidly with viewport on both iPhone and desktop.
- Landscape header grown ~70% (from 41px photo + cramped text to 86px
  photo + roomy text). Portrait header is a real hero element
  (~50vw photo with 3 stacked text lines below).
- Bucket list / page / gallery top-padding is now `clamp(20–30rem,
  vh, 28–40rem)` depending on orientation, so the fixed header + its
  bottom blur-fade always clear the content.
- All site links removed `text-decoration: underline` — they use
  `color: var(--color-text-hover)` (coral) with `opacity: 0.65` on
  hover/focus instead.
- Header border removed — `background-color: transparent`,
  `border-radius: 0`, plus a `mask-image` gradient that fades the
  blur at the bottom for a seamless blend into the page.
- "100-reasons-why" link in header now reads "是笑與**泪**的同行"
  (泪 = Simplified, since DC-CST is missing both 淚/涙).
- 4 DC-CST-missing characters substituted with forms that ARE in
  DC-CST: 强 (footer), 哄 (item 28), 爲 (item 74), 録 (item 89).
  Other 6 previously-missing chars were never rendered in a DC-CST
  context to begin with — they're in the comment page (Noto Sans HK),
  the 100-reasons-why page (wenwrite), or a non-visual meta tag.
- Footer third line now reads "版權所有 抄橋必屌 © 2026 buc.ketli.st"
  (the previous order had a stray period and the year was missing).

### Fixed

- **"牆" → 留言板**: "牆" missing from DC-CST, used a different word
  instead in the blessing form warning copy.
- **Header on /100-reasons-why/**: a CSS source-order bug had the
  `padding-top: clamp(6rem, 24vw, 14rem)` rule (1024px block) winning
  over the portrait `clamp(15rem, 30vh, 22rem)` rule on iPhone
  portrait. Reordered so the portrait rule is last.
- **Header on .page was blocking the title** on iPhone portrait — fixed
  by adding more headroom in the portrait @media rule.
- **Page-top margin on /comment/ and /100-reasons-why/** was too small
  — added `.page { padding-top: clamp(7rem, 28vw, 18rem) }` and
  bumped it under the portrait @media.
- **89 bucket list items disappeared silently** when the end-of-day
  cleanup refactored the env parser with fieldCount=5 while only 3
  rows had a 5th column. parseList now uses fieldCount=4 with extras
  merged into the last field — old rows parse correctly.

### Code quality

- Shared `src/lib/types.ts` for `BucketItem` / `GalleryItem` / `Blessing`.
- Shared `src/lib/parseEnv.ts` for the generic pipe-separated env parser
  + cached file reader.
- Shared `src/lib/utils.ts` for `pickRandomInt`, `formatBytes`,
  `escapeHtml`.
- `parseList.ts` / `parseGallery.ts` / `parseBlessings.ts` slimmed to
  ~30 lines each, using the shared parser.
- `settingsClient.ts` consolidated the two PUT paths into a single
  `putFileAtPath` helper.
- Component comment blocks describing what each file does and why.

### Documentation

- `docs/PERMANENCE.md` filled in (Cloudflare registrar, 6 June 2027
  renewal, son/daughter as GitHub designated successor, GitLab mirror
  + local backup as action items).
- `docs/HANDOFF.md` — self-contained brief a future AI session can
  read in 2-3 minutes to be productive.
- `docs/AI-WORKFLOW.md` — when to install which opencode plugin.

---

## 2026-08-28 — Astro rewrite, comment system swap

### Added

- Astro 5 static site, deployed to GitHub Pages with `buc.ketli.st` as custom domain.
- Web3Forms-backed blessing form on `/comment/`.
- Auto-publish pipeline: visitor submits → email to owner → one-click GitHub Issue → blessing appears on the wall in ~30s.
- All existing assets preserved (fonts, photos, gallery, checkbox SVGs).
- 100-reasons-why prose copied word-for-word from the Hugo original.

### Changed

- **Stack**: Hugo + PaperMod → Astro 5 + plain CSS + vanilla JS.
- **Data file**: `data/list.json` → `data/list.env` (pipe-separated, easier to hand-edit).
- **Gallery lightbox**: jQuery 3.7 + nanogallery2 3.0 → native CSS Grid + `<dialog>` (~150 LOC, no deps).
- **Header counter**: now uses `Math.random()` for the random checkbox variant per build (was `shuffle`).
- **No more 404s** for unchecked items — `link` defaults to item-anchor if it still equals the `https://example.com` placeholder.

### Removed

- jQuery 3.7 (CDN).
- nanogallery2 3.0.5 (CDN).
- Artalk 2.9 + `wish.sorio.us` self-hosted comment server.
- PaperMod 2024 (submodule).
- Hugo 0.142 (Go).
- 386-line `custom.css` with its `!important` collisions.

### Migration notes

- The original Hugo repo `f43d/papermod-lovelist4` is left untouched as historical reference.
- 92 bucket items transferred 1:1 (same `id`, `text`, `checked` state).
- The three items already checked (`id` 14, 28, 43) currently still have `link: https://example.com` — set real photo URLs in `data/list.env` to make them clickable.
