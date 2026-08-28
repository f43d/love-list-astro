# Changelog

User-facing changes. Newest entries at top. Format: `## YYYY-MM-DD — summary`.

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
