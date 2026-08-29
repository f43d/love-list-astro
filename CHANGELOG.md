# Changelog

User-facing changes. Newest entries at top. Format: `## YYYY-MM-DD — summary`.

---

## 2026-08-29 — Responsive design overhaul + wenwrite font

### Added

- **Wenwrite Proportional** font on `/100-reasons-why/` body prose. Subsetted
  to 82 KB woff2 covering only the 244 codepoints used in the body.
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
- Landscape header grown ~70% (from 41px photo + cramped text to
  86px photo + roomy text). Portrait header is a real hero element
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
  — added `.page { padding-top: clamp(7rem, 28vw, 18rem) }` and bumped
  it under the portrait @media.

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
