# History

Migration from `papermod-lovelist4` (Hugo + PaperMod) to `love-list-astro` (Astro 5).

## TL;DR

Same look-and-feel, fewer moving parts, modern toolchain.

| Layer | Before (Hugo) | After (Astro) |
| --- | --- | --- |
| Generator | Hugo 0.142 + PaperMod 2024 | Astro 5.18 |
| Build runtime | Go binary | Node 20 + Vite |
| Templating | Go `html/template` | `.astro` components |
| Styles | PaperMod SCSS + bespoke `custom.css` (386 lines, a few `!important` collisions) | Single `global.css` with custom properties |
| Scripts | jQuery 3.7 + nanogallery2 3.0 + bespoke header counter | Vanilla JS only (counter, lightbox, back-to-top) |
| Comments | Artalk 2.9 + `wish.sorio.us` server | Web3Forms + GitHub Issues |
| Content format | `data/list.json` with `id/text/checked/link` | `data/list.env` `NN|checked|text|link` |
| Data count | 92 bucket items | 92 — same |

## What we kept

- **Design palette**: text `#2f5061`, hover `#e57f84`, divider `silver`. Background photo, profile photo, header layout, list-item layout, random checkbox variant from set {1,2,3,4} per render.
- **Marriage counter**: shows days + years since `2002-03-03`.
- **100-reasons-why prose**: identical word-for-word. It's a personal artifact.
- **Headlines**: "笑淚同行 X 天", "Y 年前，我有 [一百個不結婚的理由]"
- **Gallery**: 8 sample images, 4:3 thumbs, click-to-zoom.
- **All browser-side assets** (`/fonts/`, `/images/`, `/svg/`).

## What we dropped

- **jQuery**, **nanogallery2**, **Artalk JS/CSS** CDN deps.
- **`!important` stack-fights** in the original `custom.css` (e.g. `.bucket-list` had `margin-top: 300px` defined twice).
- **`.gitmodules` + PaperMod submodule** — bespoke styles only now, no theme.
- **Two-language `baseURL`** logic, archive pages, RSS, sitemap (no need for a 4-page site).
- **Hugo's text rendering of `[shortcode]`-style partials.**
- **jQuery-based scroll-to-top** → CSS-only + a `requestAnimationFrame`-style scroll listener.

## What we changed semantically

- **Bucket list item ordering** — now sorted by `NN` integer, **not** by file order. The original Hugo version iterated `range .Site.Data.list`, preserving JSON order (which was already by `id`). New parser sorts explicitly to remove ambiguity.
- **Random checkbox variant** — original Hugo used `{{ $randomChecked := shuffle (seq 1 4) | first 1 }}` per render, which is genuinely random per build. Astro version uses `Math.random()` per build, equivalent effect.
- **Checked-item click target** — original linked to `.link` (always `https://example.com`). New version still uses `.link` BUT if it equals the placeholder, the link targets the item anchor instead (no surprise 404s while owner hasn't filled in image URLs yet).
- **Gallery lightbox** — `<dialog>` element, modal, Esc-to-close, click-outside-to-close.

## Migration steps performed (chronological)

1. Cloned `papermod-lovelist4` reference. Catalogued tokens, fonts, data layout, page count.
2. Generated `data/list.env` from `data/list.json` via Python (no Node available yet).
3. Scaffolded Astro project (`astro 5.18.2`, `astro check` clean).
4. Authored design tokens in `global.css` to match originals.
5. Built 4 pages: `/`, `/100-reasons-why/`, `/gallery/`, `/comment/`.
6. Replicated 8 test gallery images under `/images/gallery/`.
7. Migrated comments: dropped Artalk, added Web3Forms + GitHub-Issues-driven approval workflow.
8. Set GitHub Actions: `deploy.yml` (Pages), `approve-blessing.yml` (blessing auto-publish).
9. Set custom domain `buc.ketli.st` via `public/CNAME`.
10. Pushed to new public repo `f43d/love-list-astro`.
11. Three deploys total: first failed (Pages not yet enabled), then succeeded.

## Open historical items

- **`f43d/papermod-lovelist4`** is preserved as-is. Decision: leave untouched (history + rollback target). Optionally archive later.
- **Cloudflare DNS** for `buc.ketli.st`: had two stale A records pointing to old Cloudflare proxy IPs (`104.21.60.53`, `172.67.192.114`). Replaced with four DNS-only GitHub IPs. Anyone watching the zone will see the change in zone history.
- **Let's Encrypt cert** for the new custom domain: takes 5–30 min after DNS verification. Watch `https://github.com/f43d/love-list-astro/settings/pages` for green ✓.
