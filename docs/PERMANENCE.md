# Permanence Plan

> **Status: in progress.** A few open action items are tracked at the bottom
> of this file. Update this document whenever one of them is completed.

This site is a gift for 翁強's wife Josephine (60th birthday). It is intended
to remain accessible for as long as the underlying services exist — ideally
for decades. This document is written so that anyone — including future
翁強 or a family member — can keep it running without prior knowledge.

If you're reading this and 翁強 is no longer available, you are welcome
to maintain, archive, or migrate this site. The full source is in the
GitHub repository linked below.

## Open action items (read these first)

These are the loose ends identified when this doc was filled in
(2026-08-30). They are listed at the top so they don't get lost in the
longer narrative below.

1. **Set the GitHub designated successor** — see "GitHub account" section
   for the name/relation. The link to GitHub's docs is in that section.
   ~5 min, one-time.
2. **Set a calendar reminder for the domain renewal** on **6 June 2027**
   (see "Domain ownership" section). One reminder ~2 weeks before is enough.
3. **Mirror the repo to GitLab** — see "Backups" section. The git remote
   is a one-line command; the mirror syncs on every push.
4. **Add a local backup** — `git clone` the repo to a personal Mac or
   external drive. The "Backups" section is currently templated
   ("<whose machine, where stored>") until this is done.

## Where the site lives

| Piece | Where |
| --- | --- |
| Live URL | https://buc.ketli.st |
| Source code (GitHub) | https://github.com/f43d/love-list-astro |
| Source code (GitHub Pages CDN) | https://f43d.github.io/love-list-astro/ (fallback URL if custom domain breaks) |
| Static build output | `dist/` directory in the repo — fully self-contained, deployable to any static host |
| Photos | Stored in the repo itself, in `public/images/gallery/` as WebP files. No external image host. |
| GitLab mirror | <to be created> — see "Backups" section below. |

## Domain ownership

| Item | Detail |
| --- | --- |
| Domain name | `ketli.st` |
| Subdomain in use | `buc.ketli.st` (CNAME → `f43d.github.io`, DNS-only, no Cloudflare proxy) |
| DNS provider | **Cloudflare** (also acts as the registrar) |
| Cloudflare account email | <single email; no backup email set — add one if you can> |
| Account / customer number | <look up in the Cloudflare dashboard under Account > Manage account> |
| **Renewal date** | **6 June 2027** — set a calendar reminder ~2 weeks before |
| **Auto-renew** | Yes (paid by card on file). If the card on file expires, the renewal will silently fail and the domain will lapse. Update the card details when they change. |
| Payment method on file | <last4 digits + card type> (look up in Cloudflare Billing) |

> **If the domain lapses**, visitors can still reach the site at the
> `f43d.github.io/love-list-astro/` fallback URL until GitHub Pages is
> decommissioned (likely decades away).

### Cloudflare account

- Email: as above (single email, no backup).
- The Cloudflare account owns **both** the DNS records and the domain
  registration. If you lose access, contact Cloudflare support
  (https://support.cloudflare.com/) with proof of identity.
- The DNS records can be edited directly at the registrar if Cloudflare
  is just the DNS provider — but here Cloudflare IS the registrar, so
  that's not an option. Keep this account secure.

## GitHub account

| Item | Detail |
| --- | --- |
| Account holder | f43d |
| Repo | https://github.com/f43d/love-list-astro (public, MIT-licensed) |
| **Designated successor** | A son or daughter (name to be filled in). The repo is already public, so anyone can clone it. The GitHub "designated successor" feature specifically covers the case where your account is locked/deleted and the repo would otherwise be lost. Set it up at: <https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/maintaining-ownership-continuity-of-your-personal-repositories> |
| 2FA on the GitHub account | <confirm 2FA is enabled at https://github.com/settings/security> |
| Personal Access Tokens | None currently in the repo. (One was used historically to push from a development sandbox; the user revoked it after the project was complete.) |

## Backups

The repo is the source of truth. Three places should hold a complete copy:

1. **GitHub** (the primary) — https://github.com/f43d/love-list-astro
2. **GitLab mirror** — to be created. One-line setup:
   ```bash
   git remote add gitlab https://gitlab.com/f43d/love-list-astro.git
   git push gitlab main
   ```
   The `deploy.yml` GitHub Action will push to both remotes on every push
   (once the workflow is updated to add a second `git push` step — open a
   PR for that). For now, `git push gitlab main` manually after each
   push works fine.
3. **Local clone on a personal machine** — _to be set up._ Run:
   ```bash
   git clone https://github.com/f43d/love-list-astro.git ~/backups/love-list-astro
   ```
   Then `cd` into that directory and `git pull` periodically. External
   drive recommended for off-machine backup.

archive.org's Wayback Machine also crawls public sites periodically;
verify at https://web.archive.org/web/*/buc.ketli.st.

## What to do if X breaks

### Domain expires / lapses

1. Check the registrar (Cloudflare) account; pay the renewal.
2. Cloudflare → **Websites** → `ketli.st` → **Renew**.

### Cloudflare account inaccessible

1. Single email + no backup email = the most fragile link. If locked out,
   Cloudflare support is the only path: https://support.cloudflare.com/
2. **Prevent this**: add a backup email + 2FA on the Cloudflare account.

### GitHub inaccessible / repo deleted

1. **Push the local clone to a new host** (GitLab, Codeberg, Bitbucket, your
   own server). The repo is plain git, so it pushes anywhere.
2. Re-deploy the `dist/` directory to any static host (Netlify, Vercel,
   Cloudflare Pages, your own nginx).
3. Update the custom domain DNS to point at the new host.

### The site breaks visually but stays online

1. The site is fully static — no runtime dependencies. A broken page is
   almost always a single broken link or missing image.
2. Clone the repo, edit, redeploy. `npm run build` regenerates `dist/`.

### All services are gone (apocalyptic scenario)

The repo is plain HTML/CSS/JS in `dist/`. Open the `index.html` file in
any browser. It works without any server.

## For family members

If you are a family member reading this — the site is at **buc.ketli.st**
(or, if the domain is gone, at f43d.github.io/love-list-astro).

The repository is public and contains everything: source code, photos,
the vows (in `src/pages/100-reasons-why.astro`), and any future blessings
left by visitors. If 翁強 is no longer available, feel free to keep
the site running, archive it, or migrate it. The licence (MIT) explicitly
allows this.

The four "Open action items" at the top of this file are the things that
haven't been completed yet. If they're still open when you read this,
they're the place to start.

---

_Last filled in: 2026-08-30 (morning, end-of-day docs)._
_Last reviewed: 2026-08-29._

## Related docs in this repo

- [`docs/HANDOFF.md`](./HANDOFF.md) — brief for the next AI session on this
  project. Read first.
- [`docs/AI-WORKFLOW.md`](./AI-WORKFLOW.md) — when to install which
  opencode plugin (oh-my-opencode-slim, obra/superpowers, etc.). Read
  before starting any new project.
