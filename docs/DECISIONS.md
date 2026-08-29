# Decision log

Append-only. Newest entry at the bottom. Each entry captures one design decision plus its context and rejected alternatives.

---

## 2026-08-28 — Stack: Astro 5 over Hugo

- **Decision**: rewrite the bucket-list site from Hugo (paperMod theme) to Astro 5.
- **Context**: site is essentially static content — a single list page, three secondary pages, JSON-driven data. Hugo works but the user prefers a more modern toolchain.
- **Rejected**:
  - **Stay on Hugo**: same outputs, but Go templates + PaperMod feel dated; user wants something newer.
  - **Next.js (static export)**: heavier than needed; brings React ecosystem overhead.
  - **Eleventy**: similar simplicity to Hugo; no clear upside for one project.
- **Consequence**: gained components, real TypeScript, modern CSS pipeline. Lost: zero-dep build (`node_modules` shipped in CI).
- **Cost to revisit**: if Astro's direction changes (e.g. moves to Vue-only), plan an escape route via `astro build` static output that any 11ty/Next/Hand-rolled static site can re-host.

## 2026-08-28 — Data file: pipe-separated `.env`

- **Decision**: store the 100 bucket items in `data/list.env` using `NN|checked|text|link` instead of the original `data/list.json`.
- **Context**: user explicitly requested a `.env`-style file. The site has 92 rows with fixed columns — almost flat.
- **Rejected**:
  - **Markdown front matter per item**: 92 files vs 1; harder to scan, harder to diff.
  - **JSON via build hook**: same content, more syntax friction for human edits.
  - **TOML / YAML**: less of an "env" feel than the user asked for.
- **Format rules** (see header in `data/list.env`):
  - Lines starting with `#` ignored.
  - Pipe is reserved → use `/` in payloads if needed.
  - Last field (`link`) may be empty.
- **Cost to revisit**: if items ever gain &gt;4 fields (e.g. image, location, season), switch to per-item `.md` files with frontmatter. The parser interface (`loadListSorted`) won't change.

## 2026-08-28 — Comment system: Web3Forms + GitHub Issues (not Artalk, not Giscus)

- **Decision**: replace the Hugo-era Artalk setup with a Web3Forms-bound form + GitHub-Issues approval queue + auto-publish Action.
- **Context**: site is private, very low expected comment volume, owner explicitly wants moderation-before-publish. Previous setup required running a separate server (`wish.sorio.us`) — extra moving piece with no benefit at this volume.
- **Rejected**:
  - **Keep Artalk**: requires owner to keep `wish.sorio.us` running; no additional value at this volume.
  - **Giscus (GitHub Discussions backed)**: zero infra, but reads are public and require commenter sign-in via GitHub — too public for the user's taste.
  - **Staticman**: largely abandoned project; not a fit for current ecosystem.
  - **Cloudflare Worker for one-click approve**: doable, but adds a serverless function + another GitHub PAT to maintain; not worth it at low volume.
- **How it works**: see `docs/ARCHITECTURE.md` §"Moderation flow".
- **Privacy**: emails collected but not stored on the site. Only `name + message` are surfaced.
- **Cost to revisit**: if comment volume becomes &gt;10/week OR if multi-page comments are wanted (per-item discussion), move to Giscus or a self-hosted Artalk.

## 2026-08-28 — No jQuery / no nanogallery2

- **Decision**: gallery is implemented with native CSS Grid + native `<dialog>` for the lightbox. Marriage counter, back-to-top, and lightbox are all vanilla JS.
- **Context**: original site loaded jQuery 3.7.1 and nanogallery2 3.0.5 purely to render thumbnails and a lightbox. Same effect achievable in ~150 lines without dependencies.
- **Rejected**: keep nanogallery2 (deprecated maintenance, large bundle).
- **Consequence**: drop two CDN dependencies (~80 KB pre-gzip). No jQuery Sizzle for legacy browsers.
- **Cost to revisit**: if a future feature needs a heavy client lib (image filters, swipe, video playback), re-evaluate.

## 2026-08-28 — Fonts: keep DC-CST + awkwardblack as static assets

- **Decision**: ship hand-written Chinese fonts (`DC-CST.woff2`, `awkwardblack.woff2`) under `/fonts/`, preloaded as `font-display: swap`.
- **Context**: design language is built around these. Replacing them would lose the "handwritten" personality of the original site.
- **Rejected**: self-host via Google Fonts (no equivalent for DC-CST).
- **Cost to revisit**: if browsing on slow 4G causes visible text swap, consider subsetting DC-CST to Latin + common CJK punctuation only.

## 2026-08-28 — Custom domain: GitHub Pages, not Cloudflare Pages

- **Decision**: serve the site from GitHub Pages, not Cloudflare Pages.
- **Context**: user is comfortable with GitHub deployment. Cloudflare Pages would require moving DNS to Cloudflare (already happens) but adds another CI provider.
- **Rejected**: Cloudflare Pages (wrangler, Workers alignment, but extra product to learn).
- **DNS scheme** (apex-friendly since `buc.ketli.st` cannot be a CNAME):
  - Four A records at `buc` → `185.199.108.153`, `.154`, `.155`, `.156`, all **DNS only**.
  - Cert is auto-issued by GitHub via Let's Encrypt.
- **Cost to revisit**: if build time grows beyond ~1 min or image count exceeds a few hundred, Cloudflare Pages will out-perform.

## 2026-08-28 — Documented-but-not-implemented helper: blessing-approval URL generator

- **Status**: described in README, not built.
- **Reason**: at expected volume (a few per year), a one-time pre-filled link copy-pasted from the README is enough. A helper page would save ~10 s per approval at the cost of building another route and form. Will build only if volume grows.

## 2026-08-28 — Don't install oh-my-opencode-slim (yet)

- **Decision**: do not install oh-my-opencode-slim (a multi-agent orchestration plugin for opencode).
- **Context**: asked about it after seeing praise online; the bucket-list site is already live on Astro + GitHub Pages and the remaining work (blessing form, content tweaks) is single-file and small.
- **Rejected**: install and use it for the bucket-list project — adds API cost, configuration overhead, and a second rate-limit surface for negligible gain on a 4-page static site.
- **Cost to revisit**: revisit if any project needs a multi-file refactor that a single AI context can't comfortably hold (e.g. a full visual redesign, a major framework swap, a multi-service integration).

## 2026-08-28 — Reusable project-scaffold repo for future projects

- **Decision**: publish `f43d/project-scaffold` as a public starter template containing the AGENTS.md + docs/ + scripts/end-of-day.mjs + CHANGELOG.md convention.
- **Context**: the documentation discipline just established for `love-list-astro` would benefit any future project; cloning/hand-rebuilding it per project is friction.
- **Rejected**: keep it as an unstated convention (re-discovery cost too high for future me / future agents); vendor it inside `love-list-astro` (couples unrelated projects).
- **Consequence**: one-line `git clone https://github.com/f43d/project-scaffold.git my-thing` produces a complete scaffold with end-of-day routine baked in.
- **Cost to revisit**: if the convention needs to fork (e.g. Python projects get a different parseX script), split into `project-scaffold-js` / `project-scaffold-py`.

## 2026-08-28 — Lesson: verify @font-face when migrating a site, not just font-family tokens

- **Context**: after migrating `love-list-astro` from Hugo, the deployed CSS had `font-family: 'DC-CST'` and `font-family: 'awkwardblack'` in design tokens but **zero `@font-face` declarations**. Result: every browser silently fell back to the system default for CJK. The site *looked* styled (colours, layout all correct), so the bug was invisible during code review and during HTTP-based testing from this sandbox.
- **What I missed on the original rewrite**: I copied the design *tokens* (colour palette, font-family fallback chains) but not the *registration* step. The original Hugo/PaperMod site had `@font-face` blocks because it was the only way to use a custom font. With Astro + plain CSS, the same `@font-face` blocks are needed — but easy to overlook because the rest of the styling works without them.
- **Detected when**: owner opened the live site in a real browser and reported "the Chinese font never correctly render, default browser font". From the sandbox, `curl https://buc.ketli.st/assets/*.css | grep -c '@font-face'` returned `0` — instant diagnosis.
- **Fix**: add `@font-face` declarations for DC-CST and awkwardblack at the top of `src/styles/global.css` (commit `8c233b4`).
- **Rejected**:
  - **Auto-detect by AST scan** of CSS files for unmatched `font-family` references — too clever, prone to false positives (some font names are system fonts).
  - **Move `@font-face` into a build step** — Astro doesn't need this; plain CSS is fine.
- **Consequence**: AGENTS.md now has a one-line guardrail under "Things to never do".
- **Cost to revisit**: if Astro / Vite ever adds built-in `@font-face` hinting (CSS Modules-style), drop the guardrail.

## 2026-08-28 — Inherited typos from the Hugo original: log each fix to keep the trail

- **Decision**: when fixing typos inherited from the original Hugo site, append a note to this log (DECISIONS.md) so future agents / future-you can spot patterns.
- **Context**: three Chinese-text fixes happened in this session, two of which were inherited from the Hugo original and only noticed on the live site:
  1. `籍口` → `藉口` ×3 (in `Base.astro` and `100-reasons-why.astro`) — wrong homoglyph; correct word is 藉 (jiè, "pretext").
  2. `前` → `年前` + remove trailing `。` in `Header.astro` — missing 年 between year count and 前.
  3. Em-dash inconsistency in `BlessingForm.astro` — single `—` vs site-wide `——` (this one is mine, not inherited; included for completeness).
- **Pattern**: a static-site migration that copies content "verbatim" inherits *all* the typos of the original. The original was the source of truth, so I copied character-for-character — including typos that look plausible to a non-native reader.
- **Rejected**:
  - **Don't log individual fixes** (too noisy for the file's purpose of recording decisions). — but they're not decisions, they're typo fixes; lumping them obscures the actual decision being recorded here, which is *the meta-policy of logging them*.
  - **"Fix all typos in the original Hugo"** as one big commit. — would be unreviewable; better to fix one at a time so each is reviewable in PR.
- **Consequence**: future me / future agents reading this file will see (a) the existence of inherited typos, (b) the convention to log them, (c) a small but growing list of "things the original Hugo got wrong". When the project-scaffold convention is reused for a future migration, this entry is a reminder to audit the source for typos BEFORE copy-paste.
- **Cost to revisit**: when the typo list grows past ~20 entries, consider extracting to a dedicated `docs/TYPOS.md` so DECISIONS.md stays focused on architecture/strategy decisions.

## 2026-08-28 — Link style: palette accent color, no underlines

- **Decision**: all links in this site use `color: var(--color-text-hover)` (coral `#e57f84`) with no text-decoration underline. Hover/focus drops opacity to 0.65.
- **Context**: original Hugo site had `text-decoration: underline` on every link. Owner found this "old school" and visually clashing with the handwritten DC-CST aesthetic. Asked to switch to a more subtle indicator using a color from the existing palette.
- **Rejected**:
  - **Different colour per link context** (e.g., teal in header, coral in body) — adds visual noise; one rule is cleaner.
  - **Dotted underline in subtle colour** — still a 1990s link affordance.
  - **Underline on hover only** — common modern pattern, but the user explicitly wanted no underline.
  - **Use `--color-text` (teal) for the link** — the link needs a different colour from surrounding text to be distinguishable; teal is the body colour, not the accent.
- **Affected selectors** (all three get the same treatment):
  - `.site-header__title a` — header link to `/100-reasons-why/`
  - `.content-text a` — links inside `/100-reasons-why/` and `/comment/` body prose
  - `.site-footer a` — footer links
- **Consequence**: any future link added to the site should inherit the same coral accent. Add to AGENTS.md so future agents don't accidentally re-introduce underlines.
- **Cost to revisit**: if a long-form-prose context ever has accessibility constraints (low-vision users, high-contrast mode), reconsider — underlines are more discoverable than colour alone. For now, the photo-led design + DC-CST handwriting keeps the page calm and underlines would over-emphasise.
- **Commits**: `e7d2545` (header), `5215eae` (body + footer).

## 2026-08-29 — Don't subset DC-CST, optimise gallery instead

- **Decision**: keep DC-CST at full 2.2 MB. Optimise gallery images (~6.8 MB savings) before considering font subsetting.
- **Context**: asked whether subsetting DC-CST was needed when adding new list items. Subsetting would drop the font to ~200 KB but requires re-subsetting on every data change — silent failure mode if forgotten (new glyphs render as □).
- **Rejected**:
  - **Subset and add a build hook** that auto-detects new characters — adds ~80 LOC + a build dependency (`pyftsubset`) for marginal benefit on a private site.
  - **Subset only the static site text, fall back to full font for variable content** — splits the source of truth into two files; confusing.
- **Cost to revisit**: if the site moves to a CDN with image-budget concerns, or traffic spikes, revisit font subsetting with a proper build hook.

## 2026-08-29 — Noto Sans HK for visitor-facing content

- **Decision**: Google Fonts Noto Sans HK backs all text on /comment/ (form + wall + intro paragraphs + headings + empty state). Main site keeps DC-CST and awkwardblack.
- **Context**: DC-CST (Taiwan handwritten font) and awkwardblack have incomplete CJK glyph coverage. Discovered when 牆 and 墻 both rendered as missing glyphs on the blessing form. Also discovered awkwardlyblack's submit button only rendered 出 — 祝福 fell back to a system font.
- **Rejected**:
  - **Fix the submit button to use DC-CST instead of awkwardblack** — works for the static button text, but doesn't help visitor-typed content in the message field.
  - **Self-host a comprehensive CJK font** — adds ~3 MB to the dist, same problem solved.
- **Consequence**: every visitor-typed character renders correctly. One Google Fonts load (~3 MB cached after first visit) per /comment/ visit.
- **Cost to revisit**: if visitor volume grows or Google Fonts becomes a privacy concern, switch to self-hosted `noto-sans-hk` subsetted to site-used glyphs.

## 2026-08-29 — Scroll-driven focal zoom on the bucket list

- **Decision**: CSS Scroll-Driven Animations (`animation-timeline: view()` + `animation-range: cover`) make 3-4 items near the viewport centre grow to 1.3× and turn a darker coral as the user scrolls.
- **Context**: original Hugo site had a flat list with all items at the same weight. Owner wanted a more "modern" feel without adding JS or scroll listeners.
- **Rejected**:
  - **Pure-CSS scroll-snap** — locks scrolling, terrible UX on long pages.
  - **IntersectionObserver + JS** — adds runtime cost, requires hydration.
  - **CSS `:has()` + scroll-driven** — too clever, no real benefit.
- **Consequence**: pure CSS, GPU-accelerated, ~0 ms of JS. Requires Chrome 115+, Firefox 136+, Safari 18.0+ (basically universal by 2026).
- **Cost to revisit**: if the focal zone feels too narrow on tall viewports, adjust `animation-range` to `cover 10% cover 90%`.

## 2026-08-29 — Photos stored in the repo, no external image hosting

- **Decision**: All gallery photos live in the repo (`public/images/gallery/` as WebP). No Cloudflare R2, no Backblaze B2, no ImgBB, no Immich.
- **Context**: This site is a 60th-birthday gift for the owner's wife. The owner is ~70. Bucket list item 98 is about the owner's own funeral arrangements. **The site's primary success criterion is that it remains accessible after the owner is gone**, with the wife (non-technical) able to view it without any maintenance.
- **Rejected**:
  - **Cloudflare R2** — free egress but requires the account to remain active indefinitely. The owner's wife can't manage Cloudflare credentials. Account lapse = photos gone.
  - **Backblaze B2** — same fundamental problem. Free tier can change, accounts lapse, billing fails.
  - **ImgBB / Imgur / similar** — third-party hotlinking breaks when the host changes terms; not owned.
  - **Self-hosted photo manager (Immich, PhotoPrism, etc.)** — requires a running server. Maintenance burden exactly opposite to the goal.
- **Consequence**:
  - Repo size grows by ~150 KB per photo. 100 photos ≈ 15 MB total — well within GitHub's recommended 1 GB per repo.
  - Image quality capped at web-friendly (~2000 px wide JPEG/WebP). Original raws not stored.
  - `data/gallery.env` already supports both repo paths and full URLs — same code works either way.
  - One source of truth (the repo) for everything: code, content, photos, history.
- **Cost to revisit**: only if (a) photo count exceeds ~500 and pushes repo size toward GitHub's soft cap, or (b) the owner wants to share full-resolution originals — both can be solved by attaching a USB drive separately, not by introducing an external service.

## 2026-08-29 — `docs/PERMANENCE.md` written

- **Decision**: Add a plain-language document listing where the site lives, who owns the domain, who has GitHub access, where backups are, and what to do if each piece breaks.
- **Context**: see above. The owner asked for a written record that doesn't depend on him explaining things verbally one day.
- **Rejected**:
  - **Putting the plan in OPERATIONS.md** — that's for day-2 ops; permanence is a different topic.
  - **Encrypting the document** — defeats the purpose (the document needs to be readable without 翁強 to be useful).
  - **Including passwords** — the document is in a public repo; credentials go elsewhere.
- **Consequence**: One glance at the file tells a future-you (or anyone) how to recover the site. Placeholder sections (`<fill in>`) for the owner's specific registrar info.
- **Cost to revisit**: when domain or GitHub account changes.

## 2026-08-29 — Photos managed via in-browser settings page

- **Decision**: a hidden `/settings/` page lets the owner upload, edit, and
  delete photos through a UI instead of editing `data/gallery.env` in
  the GitHub web UI. Owner-only — no link anywhere on the public site.
- **Context**: the user wanted to streamline the upload workflow
  (resize + WebP convert + commit) without running a server.
- **Rejected**:
  - **Cloudflare R2 / Backblaze B2** — adds a third-party dependency
    and a recurring account to maintain. The "GitHub is the only
    storage" rule (see 2026-08-29 decisions) wins again.
  - **Self-hosted photo manager (Immich / PhotoPrism / Lychee)** —
    requires a running server. Maintenance burden opposite to the
    project's goal.
  - **Downloadable .zip patch (no PAT)** — usable but every upload
    becomes multi-step (download → GitHub web upload → edit env file).
    With a fine-grained PAT scoped to one repo, the all-in-one UI
    wins on time spent.
- **Consequence**:
  - The settings page holds the PAT in `sessionStorage` (cleared on
    tab close) — NOT `localStorage`. Limits exposure to a single
    session. User must re-paste next time.
  - The image-processing pipeline (canvas → `toBlob('image/webp', 0.85)`,
    max 1600 px wide) runs entirely in the browser.
  - AGENTS.md gets a rule: never link to `/settings/` from public pages.
- **Cost to revisit**: if multi-user editing is ever needed (e.g.
  wife also wants to add photos), this won't work. Switch to a
  proper backend or a host with native multi-user support.

## 2026-08-29 — 泪 (SC) replaces 淚 / 涙 in site text

- **Decision**: use the Simplified Chinese 泪 (U+6CEA) for the "tears"
  glyph in the header and 100-reasons-why prose. NOT 淚 (TC, U+6DDA)
  and NOT 涙 (JP, U+6D99), both of which are in DC-CST's coverage gap.
- **Context**: a custom handwritten font (DC-CST) is used throughout.
  It has ~9k CJK glyphs but misses several common Traditional
  Chinese characters. My earlier codepoint check had the wrong hex
  for 淚 (used 6D9A instead of 6DDA) and reported it as in-cmap. The
  user noticed the title was still not rendering correctly, which
  triggered a full audit.
- **Rejected**:
  - **Self-host a comprehensive CJK font as fallback (Noto Serif TC)**
    — owner prefers pure custom-font render. Adds ~3 MB to the
    bundle and creates a visual mismatch (handwritten vs serif).
  - **Switch primary font to Noto Serif TC** — loses the handwritten
    identity of the original site.
  - **Re-spell the phrase** — "笑泪同行" is the established text in
    the original Hugo site; changing it loses the personal continuity.
- **Consequence**:
  - One "tears" character used consistently across the site (header,
    100-reasons-why, HISTORY.md). 泪 reads identically in Cantonese
    ("leoi4") to 淚.
  - The visual glyph is the Simplified form, not Traditional. Visitors
    familiar with the TC form may notice. Owner accepted this trade.
  - A future font with broader coverage (or font subsetting) could
    swap 泪 back to 淚 in one place.
- **Cost to revisit**: only if a future font has 淚 and not 泪 (unlikely).

## 2026-08-29 — Schema migration in pipe-separated env files is forward-compatible by design

- **Decision**: the `parseLine` helper in `src/lib/parseEnv.ts` treats `fieldCount` as the *required* number of fields. Lines with more fields are accepted, with extras merged into the last required field. Lines with fewer fields are dropped (return `null`).
- **Context**: when the bucket list grew a 5th column (`photo` id) earlier in the session, only 3 of the 92 rows in `data/list.env` were updated. The 89 un-updated rows had only 4 columns. If `parseLine` had required an exact match, all 89 rows would have failed to parse and the home page would have dropped to 3 items.
- **Why this matters**: the shared `parseLines()` helper in `src/lib/parseEnv.ts` was written specifically to allow additive schema changes without retroactive data-file edits. New fields can be appended; old rows with fewer columns still parse (the missing trailing field is `undefined` in the builder, which the caller treats as empty).
- **Rejected**:
  - **Strict field count** — would have broken the bucket list. Rejected.
  - **Migrate the data file in one go** — 89 rows × at least 2 lines per row = lots of churn. Rejected.
- **Consequence**:
  - Future schema additions (e.g. adding `date` to bucket items) need only an edit to `parseList.ts` and a header comment in `data/list.env`. Old rows keep working.
  - Each data file is now ~30 lines instead of ~50 because `parseLines()` replaces the per-file boilerplate.
  - The `serializeGallery` / `serializeList` helpers in `settingsClient.ts` are NOT forward-compatible by design (they always emit the full schema). If a row in `gallery.env` is added with an extra column, it'll round-trip fine via the parser, but writing it back will collapse the extras into the last field. This is acceptable for the current use case (the /settings/ page only edits known fields).
- **Cost to revisit**: if multi-row data migrations become common, consider versioning the format (e.g. `## v1.0` header comment in the env file) and teaching the parser to migrate older versions on read.
- **Captured by**: the post-end-of-day regression where 89 bucket list items silently disappeared because the field count was bumped to 5 in the refactor without a corresponding data-file migration. Fixed in commit `47210fa`.
