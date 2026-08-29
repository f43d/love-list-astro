# 2026-08-28 — Initial rewrite (Hugo → Astro) + first deploy

Owner: f43d (翁強)

## What was done

1. Cloned the reference repo `f43d/papermod-lovelist4` (Hugo + PaperMod) and inventoried its content, colours, fonts, layouts.
2. Scaffolded a fresh Astro 5 project at `/tmp/opencode/love-list-astro`:
   - Project structure (`package.json`, `astro.config.mjs`, `tsconfig.json`)
   - Tailwind explicitly avoided — single `global.css` with tokens in `:root`
3. Migrated assets byte-for-byte: `fonts/`, `images/`, `svg/`, `gallery/`.
4. Converted `data/list.json` (92 items) to `data/list.env` (pipe-separated).
5. Wrote `src/lib/parseList.ts` and `src/lib/parseBlessings.ts` build-time loaders.
6. Built 4 pages:
   - `/` — bucket list with marriage counter, header, divider lines
   - `/100-reasons-why/` — long-form prose, copied verbatim
   - `/gallery/` — CSS-Grid + native `<dialog>` lightbox (replaces jQuery + nanogallery2)
   - `/comment/` — blessing form + blessing wall (replaces Artalk)
7. Comment system refactor:
   - Removed `src/components/Artalk.astro`
   - Added `BlessingForm.astro` (Web3Forms-bound) + `BlessingsWall.astro`
   - `data/blessings.env` as pipe-separated store
   - `.github/workflows/approve-blessing.yml` to publish on Issue open
   - `PUBLIC_WEB3FORMS_KEY` as a build-time public env var (Variables in GitHub, `.env` locally)
8. GitHub setup:
   - Created `f43d/love-list-astro` (public)
   - Three deploys total:
     - **#1**: failed at `actions/configure-pages@v5` because Pages hadn't been enabled yet
     - **#2**: succeeded after enabling Pages via the API + pushing a no-op commit
     - **#3**: succeeded after replacing Cloudflare-proxy DNS records with the four GitHub Pages IPs
9. DNS work on Cloudflare zone `ketli.st`:
   - Old `buc` records (`104.21.60.53`, `172.67.192.114`) deleted
   - New `buc` records (`185.199.108.153`–`.156`) added, all **DNS only**
10. Custom domain `buc.ketli.st` set in repo's Pages settings — Let's Encrypt cert provisioning in progress at session end.

## Decisions taken

See `docs/DECISIONS.md` for full text. Summary:

- Astro over Hugo (modern toolchain; same static output).
- Pipe-separated `.env` over JSON for content (owner preference).
- Web3Forms + GitHub Issues over Artalk (no server to run).
- Vanilla JS / native `<dialog>` over jQuery / nanogallery2 (lighter, same UX).

## Known issues / open items

- **Cert propagation**: `https://buc.ketli.st/` currently serves GitHub's CDN cert (`*.githubassets.com`). Let's Encrypt cert for `buc.ketli.st` is being issued; should be green in 5–30 min. **Custom fonts (DC-CST) currently unavailable over `https://buc.ketli.st`** until cert is valid — the browser blocks insecure font loads. Workaround at this exact moment: load via `https://f43d.github.io/love-list-astro/` (default cert is valid).
- **3 checked items** still have `link: https://example.com` — owner to fill in R2 URLs.
- **`PUBLIC_WEB3FORMS_KEY`** not yet set. Until set, form shows "form not enabled" warning.
- **`f43d/papermod-lovelist4`** is preserved unchanged — decide later whether to archive.
- **PAT used for the initial push** (`github_pat_11AQ7DQCI01FzE8ADBsDAG_…`) should be **revoked**.
- **Cert was at 2/3 keys** in `x509 -ext subjectAltName`: only `*.githubassets.com, githubassets.com`. Confirms it's not yet validated for `buc.ketli.st`.

## What the user should do next

In priority order:

1. Confirm the Astro site renders correctly at `https://buc.ketli.st/` once cert is valid (≤30 min).
2. Set `PUBLIC_WEB3FORMS_KEY` in GitHub Variables.
3. Update the three checked items' `link` field with real R2 URLs.
4. Revoke the GitHub PAT used for the initial push.
5. Test the blessing form end-to-end (submit → email → Issue URL → published).
6. Optionally archive `papermod-lovelist4`.

## Files changed this session

```
A  .env.example
A  .github/workflows/approve-blessing.yml
A  .github/workflows/deploy.yml
M  .gitignore
A  AGENTS.md                                          (created at end of session)
A  astro.config.mjs
A  CHANGELOG.md                                       (created at end of session)
A  data/blessings.env
A  data/list.env
A  docs/ARCHITECTURE.md                                (created at end of session)
A  docs/DECISIONS.md                                  (created at end of session)
A  docs/HISTORY.md                                    (created at end of session)
A  docs/OPERATIONS.md                                 (created at end of session)
A  docs/sessions/2026-08-28-initial-rewrite.md        (this file)
A  package.json
A  package-lock.json
A  public/CNAME
A  public/fonts/DC-CST.woff, .woff2
A  public/fonts/awkwardblack.woff, .woff2
A  public/images/background.jpg
A  public/images/gallery/test-*.jpg
A  public/images/profile.jpg
A  public/svg/checkboxes/*
A  public/svg/divider.svg
A  public/svg/numbers/*
A  README.md
A  src/components/BlessingForm.astro
A  src/components/BlessingsWall.astro
A  src/components/BucketList.astro
A  src/components/Footer.astro
A  src/components/Gallery.astro
A  src/components/Header.astro
A  src/layouts/Base.astro
A  src/lib/parseBlessings.ts
A  src/lib/parseList.ts
A  src/pages/100-reasons-why.astro
A  src/pages/comment.astro
A  src/pages/gallery.astro
A  src/pages/index.astro
A  src/styles/global.css
A  tsconfig.json
D  src/components/Artalk.astro
```

(`A` = added, `M` = modified, `D` = deleted)

---

# End of day — additional notes (00:20)

## What was done in the second half

- Built the documentation discipline / "end-of-day" routine:
  - `scripts/end-of-day.mjs` — snapshot tool that diffs against the latest session file.
  - `AGENTS.md` updated with end-of-day protocol for future agents.
  - `docs/OPERATIONS.md` updated with the user ↔ agent procedure.
  - `npm run end-of-day` / `npm run end-of-day:md` exposed.
- Discussed installing `oh-my-opencode-slim`; **decided against** (see DECISIONS).
- Created `f43d/project-scaffold` as a reusable starter for future projects
  (template AGENTS.md, docs/, scripts/end-of-day.mjs, CHANGELOG, MIT).

## Open items (carry-over)

- Set `PUBLIC_WEB3FORMS_KEY` in GitHub Variables.
- Verify the cert for `buc.ketli.st` — was provisioning at session end;
  fonts should now load over HTTPS.
- Test blessing form end-to-end (submit → email → Issue → published).
- Replace the 3 placeholder `https://example.com` links for items 14, 28, 43
  with real Cloudflare R2 URLs.
- **Revoke both PATs** pasted today:
  `…jdrra` (love-list-astro) and `…0bft3` (project-scaffold).
- Mark `f43d/project-scaffold` as a GitHub template repo
  (Settings → "Template repository").

## What's next time

The site is feature-complete enough to pause on. Next session can be:
- finish blessing form setup,
- link real images for checked items, or
- start a brand-new project with `project-scaffold` as the starting point.

---

# Second half (2026-08-29, morning) — design polish + blessing form activation

## What was done

- **Blessing form** — registered at web3forms.com, set `PUBLIC_WEB3FORMS_KEY`
  in GitHub Variables, redeployed. Form is now live at /comment/ and accepts
  submissions. End-to-end flow (visitor → email → GitHub Issue → published)
  is wired and waiting for the first real submission.

- **Header polish**:
  - Fixed `24前` → `24年前` and removed trailing `。` in the site header.
  - Replaced underline link style with palette accent (`color: var(--color-text-hover)`)
    across header, body prose, and footer. New `--color-focal` token for
    darker accent on focal-band items.
  - Added `.page` top margin (320/240/120px responsive) so /100-reasons-why/
    and /comment/ clear the fixed header on load.

- **Footer restructure** — moved 祝福我們 ❤️ to top, joined "翁強用愛發電"
  and "Astro 全力支持" on one line with `·`, replaced formal copyright
  with "版權所有 抄橋必屌 © 2026 buc.ketli.st" (final order).

- **Bucket list focal zoom** — added CSS Scroll-Driven Animations
  (`animation-timeline: view()` + `animation-range: cover`).
  3-4 items near the viewport center grow to 1.3× and turn darker coral;
  edges stay calmer. Checked items keep a slightly larger font-size so
  they don't feel dwarfed by neighbours.

- **Visitor-facing font** — Google Fonts Noto Sans HK now backs the
  blessing form, all blessing wall content, and the blessing page's intro
  paragraphs. DC-CST missing 牆/墻 glyphs forced this. Main site
  (header, body, prose, footer) keeps DC-CST.

- **Performance** — dropped `.woff` fallbacks (kept `.woff2` only).
  Saves ~2.7 MB. Also dropped unused 500-weight from Noto Sans HK
  load (~1.5 MB saved on /comment/).

- **Inherited typos fixed**: 籍口→藉口 ×3, 牆→留言板, single → double em-dash
  in Chinese contexts.

## Open items

- Test the blessing form end-to-end with a real submission.
- Optionally: gallery JPEG recompression (~6.8 MB savings, one-time).
- Optionally: subset DC-CST for ~2 MB savings (build hook complexity).
