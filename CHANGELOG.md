# Changelog

User-facing changes. Newest entries at top. Format: `## YYYY-MM-DD — summary`.

---

## 2026-08-29 — Blessing form live, focal zoom, performance

### Added

- Blessing form at `/comment/` now accepts real submissions (Web3Forms).
- Bucket list: scroll-driven focal zoom — items near the centre of the
  viewport grow and turn a darker coral as you scroll.
- Noto Sans HK for all visitor-facing content on `/comment/` (form,
  wall, intro paragraphs).

### Changed

- Header link to /100-reasons-why/: underline → palette accent colour.
- All links site-wide: underline → palette accent, opacity 0.65 on hover.
- Footer: line order (祝福我們 ❤️ on top, copyright joined with 抄橋必屌).
- Header text fixed: `24年前` (was `24前`); trailing `。` removed.

### Fixed

- Inherited typos: 籍口 → 藉口 ×3, 牆 → 留言板, single → double em-dash in Chinese contexts, button font switched from awkwardblack to body
  font for full glyph coverage.
- Layout: `/100-reasons-why/` and `/comment/` top margin added so content
  clears the fixed header.
- Performance: dropped `.woff` font fallbacks (~2.7 MB); dropped unused
  weight 500 from Noto Sans HK (~1.5 MB).

---

## 2026-08-28 — Astro rewrite, comment system swap

Brand new site, brand new stack.

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
