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
