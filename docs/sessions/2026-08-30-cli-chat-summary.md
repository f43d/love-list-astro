# 2026-08-30 — CLI chat session summary

A condensed, technical-only summary of the chat session. Not a verbatim
transcript (chats are not saved to the repo by default; only work
products are). This file captures *what was decided and why*, not the
back-and-forth that led there.

## Context

- User is翁強 (~70), the project's owner.
- The bucket-list site is a gift for his wife Josephine's 60th birthday.
- The site's primary success criterion is **permanence**: it must remain
  accessible and maintainable after the owner is gone.

## Major work this session (in order)

### 1. Resumed the responsive-design work

The previous session had stopped after a CSS source-order bug fix. This
session continued with the user's iterative feedback on the header /
font sizes / padding for portrait vs landscape iPhone.

- Header photo / counter / title / subtitle sizes all `clamp()`-fluid
- Portrait header is now a real hero element (~50vw photo with 3
  stacked text lines below)
- Landscape header was grown ~70% (from 41px photo to 86px photo)
- Bumped `padding-top` on `.page` and `.bucket-list` so the big header
  + its bottom blur-fade always clears the content
- Reordered `@media` rules so the portrait rule comes after the 1024px
  rule on `.page` (CSS source-order tie-breaker)

### 2. Cleaned up the source code

Created three new shared modules in `src/lib/`:

- `types.ts` — `BucketItem` / `GalleryItem` / `Blessing` (previously
  duplicated server-side and client-side)
- `parseEnv.ts` — generic pipe-separated env parser + cached file reader
- `utils.ts` — `pickRandomInt`, `formatBytes`, `escapeHtml`

Slimmed the three `parse*.ts` files to use the shared parser. Consolidated
the two PUT paths in `settingsClient.ts` into a single `putFileAtPath`
helper. Added comment blocks to each component explaining what it does.

### 3. New wenwrite font for the vows page

The user had a 15MB TTF of "wenwrite Proportional" they wanted to use
on the long-form prose of `/100-reasons-why/`. Workflow:

- They uploaded it to FerriShare (end-to-end encrypted file share)
- I downloaded it on the LXC, ran a Python cryptography script to
  decrypt + verify the file
- Subsetted it to 82KB woff2 covering only the 244 codepoints used
  in the body text (99.5% reduction)
- Added a new CSS variable `--font-prose: 'wenwrite', 'DC-CST', …`
  and a modifier class `.content-text--wenwrite`
- Bug discovered: 淚/涙 didn't render → diagnosed with `fontTools` as
  a codepoint confusion (U+6D9A vs U+6DDA), audited the cmap, found
  10 missing characters total
- Final fix: substitute 強→强, 氹→哄, 為→爲, 錄→録 (all in DC-CST),
  leave 說 alone (already in wenwrite, used elsewhere in the page)

### 4. Documentation

Wrote three new docs and filled in two existing ones:

- `docs/HANDOFF.md` — full project brief a fresh session reads in 2-3
  minutes. Includes the start prompt and the read order.
- `docs/AI-WORKFLOW.md` — when to install which opencode plugin
  (current site: nothing; new codebases: obra/superpowers; big
  refactors: oh-my-opencode-slim temporarily).
- `docs/PERMANENCE.md` — filled in. Cloudflare is the registrar
  (single email, no backup). Domain renews 6 June 2027 (auto-renew,
  card on file). GitHub designated successor: a son or daughter
  (name TBD when set up). Action items at the top: set the GitHub
  successor, set calendar reminder, set up GitLab mirror, add a
  local backup.
- `docs/OPERATIONS.md` — added a "Settings page" section.
- `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `CHANGELOG.md`,
  `docs/HISTORY.md` — updated in earlier sessions.

### 5. Operational discussion: OpenCode web UI vs CLI

The user is running opencode on a Proxmox LXC, accessible via Termius
on an iPhone. They asked about switching to the web UI for the
screenshot-paste / file-upload UX. Walked through:

- Web UI vs CLI trade-offs (CLI is keyboard-driven; web UI is
  iPhone-friendly with native screenshot paste)
- Set up the web UI on the LXC with
  `opencode web --port 3000 --hostname 0.0.0.0 --pure`
- The `--pure` flag skips OpenCode's hosted-service billing check
  (the user's MiniMax M3 key is the relevant API key, not OpenCode's
  own subscription)
- The web UI service was set up at `/etc/systemd/system/opencode-web.service`
  with `OPENCODE_SERVER_PASSWORD` env var
- WSL / Termius / web UI each have their place; the repo is the
  continuity layer, not the session

### 6. End-of-day routine

Ran the standard end-of-day (per `AGENTS.md`):

- Updated session log
- Updated CHANGELOG
- Recorded the day in `docs/sessions/2026-08-30.md`

The repo is now the canonical source of truth for everything except
the chat conversation itself. If the user wants the chat preserved, the
recommended path is: drop a screenshot of the conversation somewhere
the LXC can reach, then have the next session transcribe it to a text
file (grep-able, diffable, AI-readable in any future session).

## Code commits this session (high-level)

- `feat: clean up source code` — consolidated data types, env parser,
  utils; slimmed parse files; added comment blocks
- `fix(responsive): compact header for short viewports (landscape)`
- `fix(responsive): add portrait-phone top-padding + smaller header photo`
- `fix(responsive): bigger fonts + more headroom for title on portrait`
- `fix(responsive): shrink portrait photo + bump text + add padding`
- `style(header): enlarge hero photo in portrait + landscape`
- `fix(css): reorder @media rules so portrait-padding wins`
- `fix(responsive): more headroom + hide subtitle in portrait`
- `fix(responsive): rebalance header text hierarchy in portrait`
- `fix(responsive): landscape header +30% (then +30% again)`
- `feat(100-reasons-why): use wenwrite Proportional for body prose`
- `fix(css): add @font-face for wenwrite (was missing)`
- `fix(text): swap 淚→涙` (later reversed to 淚→泪 Simplified)
- `fix(text): revert Noto Serif TC fallback + use 泪 (SC)`
- `fix(text): 牆 → 留言板` (later: 牆 → 壁)
- `fix(text): 强 → 强 (footer), 氹 → 哄 (bucket #28)`
- `fix(text): 為 → 爲, 錄 → 録 (bucket items 74, 89)`
- `fix(css): add @font-face for wenwrite (was missing, hence falling back to DC-CST)`
- `fix(parseList): make photo column optional, restore 89 missing items`
- `fix(responsive): landscape header +30% (second bump)`
- `style(header): remove visible border — transparent, square corners, mask gradient`
- `docs: PERMANENCE.md + GitHub-only photos decision`
- `docs: AGENTS.md rule out token-revoke spam during active sessions`
- `docs: log link-style decision and add guardrail to AGENTS.md`
- `docs: log @font-face lesson to DECISIONS.md and add guardrail to AGENTS.md`
- `docs: log inherited-typo policy from session fixes`
- `docs: log link-style decision and add guardrail to AGENTS.md`
- `docs: 2026-08-29 morning — append session log, decisions, changelog`
- `docs: HANDOFF.md` — handoff brief
- `docs: AI-WORKFLOW.md` — when to install which plugin
- `docs: end-of-day 2026-08-30 (late session) — session log + changelog`
- `docs: end-of-day 2026-08-30 (evening) — web UI setup + handoff`

The web UI deployment was outside the repo (systemd service on the
LXC), so there's no git commit for it.

## What the user should do at the end of the day

1. Save this chat if they want it preserved: drop a screenshot on
   the LXC, have the next session transcribe it.
2. Switch from CLI to the web UI for future sessions (more
   iPhone-friendly).
3. Use the start prompt in `docs/HANDOFF.md` to begin the next session.
4. Continue the open items in `docs/PERMANENCE.md`.
