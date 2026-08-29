# Permanence Plan

This site is a gift for 翁強's wife Josephine (60th birthday). It is intended to
remain accessible for as long as the underlying services exist — ideally
for decades. This document is written so that anyone — including future
翁強 or a family member — can keep it running without prior knowledge.

If you're reading this and 翁強 is no longer available, you are welcome
to maintain, archive, or migrate this site. The full source is in the
GitHub repository linked below.

## Where the site lives

| Piece | Where |
| --- | --- |
| Live URL | https://buc.ketli.st |
| Source code (GitHub) | https://github.com/f43d/love-list-astro |
| Source code (GitHub Pages CDN) | https://f43d.github.io/love-list-astro/ (fallback URL if custom domain breaks) |
| Static build output | `dist/` directory in the repo — fully self-contained, deployable to any static host |
| Photos | Stored in the repo itself, in `public/images/gallery/` as WebP files. No external image host. |

## Domain ownership

| Item | Detail |
| --- | --- |
| Domain name | `ketli.st` |
| Subdomain in use | `buc.ketli.st` (CNAME → `f43d.github.io`, DNS-only, no Cloudflare proxy) |
| DNS provider | Cloudflare (account owner's email: <fill in>) |
| Domain registrar | <fill in> |
| Account / customer number | <fill in> |
| Renewal date | <fill in — set calendar reminder> |
| Auto-renew enabled? | <yes / no> |
| Payment method on file | <last4 digits + type> |

> **If the domain lapses**, visitors can still reach the site at the
> `f43d.github.io/love-list-astro/` fallback URL until GitHub Pages is
> decommissioned (likely decades away).

## GitHub account

| Item | Detail |
| --- | --- |
| Account holder | f43d |
| Repo | https://github.com/f43d/love-list-astro (public, MIT-licensed) |
| Designated successor | <set on GitHub: https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/maintaining-ownership-continuity-of-your-personal-repositories> |
| Personal Access Token | (none in the repo; one was used historically to push from this sandbox — likely rotated already) |

## Backups

The repo is the source of truth. Three places hold a complete copy:

1. **GitHub** (the primary)
2. **A local clone** on `<whose machine, where stored>`
3. **A mirror on GitLab / Codeberg** — `<URL or "(not yet set up)">`

archive.org's Wayback Machine also crawls public sites periodically; you
can verify with `https://web.archive.org/web/*/buc.ketli.st`.

## What to do if X breaks

### Domain expires / lapses

1. Check the registrar account; pay the renewal.
2. If Cloudflare is the registrar: log into Cloudflare → **Websites** → `ketli.st` → **Renew**.
3. If registrar is elsewhere: contact them.

### Cloudflare account inaccessible

1. The DNS records can be edited directly at the registrar if Cloudflare is just the DNS provider (not registrar).
2. Or call Cloudflare support: https://support.cloudflare.com/

### GitHub inaccessible / repo deleted

1. **Push the local clone to a new host** (GitLab, Codeberg, Bitbucket, your own server).
2. Re-deploy the `dist/` directory to any static host (Netlify, Vercel, Cloudflare Pages, your own nginx).
3. Update the custom domain DNS to point at the new host.

### The site breaks visually but stays online

1. The site is fully static — no runtime dependencies. A broken page is almost always a single broken link or missing image.
2. Clone the repo, edit, redeploy. The `npm run build` command regenerates `dist/`.

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

---

_Last reviewed: 2026-08-29._