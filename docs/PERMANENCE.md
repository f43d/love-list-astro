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
| Subdomain in use | `buc.ketli.st` (CNAME → `f43d.github.io`, DNS-only at Cloudflare, no proxy) |
| **Registrar** | **Netim** — the `.st` domain is registered and renewed HERE. See "Registrar (Netim)" below. |
| DNS provider | **Cloudflare** — hosts the DNS records that point `buc.ketli.st` at GitHub Pages. Cloudflare is NOT the registrar. |
| **Renewal date** | **6 June 2027** — set a calendar reminder ~2 weeks before. Renew at Netim. |
| **Auto-renew** | Confirm it is ON at Netim (paid by card on file). If the card expires, renewal silently fails and the domain lapses. |

> **If the domain lapses**, visitors can still reach the site at the
> `f43d.github.io/love-list-astro/` fallback URL until GitHub Pages is
> decommissioned (likely decades away). But renewing at Netim is what
> keeps `buc.ketli.st` alive.

### Registrar (Netim)

- The `.st` domain registration lives at **Netim** (https://www.netim.com).
- Log in with the Netim account credentials (email + password in the
  family Bitwarden vault — see the private handover letter, NOT this
  public file).
- Renew `ketli.st` before **6 June 2027**. Netim sends renewal reminders
  to the registered account email — make sure that inbox is monitored.
- Netim may use a different login than Cloudflare — they are two separate
  accounts.

### Cloudflare account (DNS only)

- Email: as above (single email; add a backup email if you can).
- Cloudflare only hosts the **DNS records**. The domain itself is NOT
  registered here — it is at Netim.
- If the Cloudflare account is lost, the DNS can be recreated at Netim's
  own DNS panel, or on any DNS host, pointing `buc.ketli.st` at
  `f43d.github.io` (CNAME). Losing Cloudflare delays but does not kill
  the site; losing Netim access is the serious one.
- Contact support: https://support.cloudflare.com/

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

1. Check the registrar (**Netim** — not Cloudflare); pay the renewal there.
2. Netim → your account → `ketli.st` → Renew / pay the invoice.

### Netim (registrar) account inaccessible

1. This is the serious one — the domain registration lives here. Contact
   Netim support (https://www.netim.com) with proof of identity (owner's
   ID, death certificate if applicable, account email).
2. **Prevent this**: make sure the Netim account email + password are in
   the family Bitwarden vault, and that the account has a recovery email.

### Cloudflare account inaccessible (DNS only)

1. The site still works — Cloudflare only serves the DNS records. If
   locked out, either contact Cloudflare support, or recreate the DNS at
   Netim (or any DNS host) pointing `buc.ketli.st` → `f43d.github.io`
   (CNAME). Losing Cloudflare is an inconvenience, not a loss.
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
