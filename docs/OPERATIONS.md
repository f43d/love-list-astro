# Operations

Day-2 maintenance guide. Goal: anyone (human or AI) can fix any common problem in &lt;10 minutes.

## Local development

```bash
npm install                   # first time
npm run dev                   # http://localhost:4321
npm run build                 # outputs to ./dist
npm run preview               # serve ./dist locally
```

## Environment variables

| Var | Where set | Used by | Where to obtain |
| --- | --- | --- | --- |
| `PUBLIC_WEB3FORMS_KEY` | `.env` locally; GitHub Variables in CI | `BlessingForm.astro` (build time, embedded in HTML) | https://web3forms.com — paste your email → copy access key |

Never commit `.env`. `.env.example` is committed and shows the schema.

To set in GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**.

## Deploy

Push to `main` triggers `.github/workflows/deploy.yml`:

1. `npm ci`
2. `npm run build` with `PUBLIC_WEB3FORMS_KEY` from Variables
3. Uploads `dist/` as Pages artifact
4. GitHub Pages deploys

**Manual re-deploy**: visit Actions → pick run → "Re-run all jobs". Needed if env vars change.

## Blessing approval

When `support@web3forms.com` (or whatever address was registered) emails a new submission:

1. Open this URL (paste into the email body to make it a one-tap link, or copy-paste now):
   ```
   https://github.com/f43d/love-list-astro/issues/new?title=[blessing-approval]&body=<!-- blessing-approval -->%0A%0A**Name:** %3Cname%3E%0A**Email:** %3Cemail%3E (private)%0A**Message:** %3Cmessage%3E%0A%0A<!-- /blessing-approval -->
   ```
2. Replace `<name>`, `<email>`, `<message>` (URL-encode newlines as `%0A`).
3. Click **Submit new issue**.
4. `approve-blessing.yml` runs: appends to `data/blessings.env`, commits, closes Issue.
5. `deploy.yml` runs: new blessing live in ~30 s.

To moderate by hand instead: edit `data/blessings.env` directly, commit, push.

## Adding / editing items

- **Bucket item**: edit `data/list.env`, commit, push.
- **Blessing**: see above.
- **Reasons-why page**: edit `src/pages/100-reasons-why.astro`, commit, push.
- **New page**:
  - Create `src/pages/<path>.astro` (extends `Base.astro` from `src/layouts/`).
  - Use `import Base from '../layouts/Base.astro'` and `<Base title="..."><main>...</main></Base>`.
  - Add to navigation by editing `src/components/Footer.astro` or wherever the nav lives.

## Changing colours / fonts

Edit `src/styles/global.css` `:root` block. The site has one source of truth — no component-level overrides.

```css
:root {
  --color-text: #2f5061;
  --color-text-hover: #e57f84;
  ...
}
```

## Common gotchas

- **`PUBLIC_WEB3FORMS_KEY` not set** → form shows a "form not enabled" warning and inputs are disabled. Check GitHub Variables or `.env`.
- **Blessing count gap** — `parseBlessings.ts` computes next id as `max(ids) + 1`, so deleting old entries leaves gaps. That's fine; do not re-number.
- **Pipe character in items** — both `.env` files treat `|` as the field separator. Replace with `/` in any user content.
- **Trailing newline missing in `.env`** — `parseList.ts` handles it but adding a line WITHOUT a final newline then a CI edit can lead to one big line. Always end files with `\n`.
- **Long Chinese strings** — the CSS line-heights assume ~1.5× font size; if a string contains many `…` or unusual punctuation, test on mobile.
- **Custom domain not resolving** — wait 5–30 min after DNS edit. Re-check with:
  ```bash
  dig +short buc.ketli.st A @1.1.1.1
  ```
  Expected: 4 GitHub IPs.

## Backup / restore

- Source is git in GitHub — that's the canonical backup.
- No user-generated data lives in the database — content is committed to `data/*.env`.
- Approved blessings live in git history; restoring is `git checkout data/blessings.env@<sha>`.

## Sources / credentials checklist

Owner should have access to:

- ✓ GitHub account `f43d`, repo `love-list-astro` (admin)
- ✓ Cloudflare account owning zone `ketli.st` (DNS editor)
- ✓ `wish.sorio.us` is **no longer needed** — was the Artalk server, retired
- ✓ Web3Forms account (email registration)
- ✓ Fine-grained GitHub PAT (rotate annually)

Rotate/revoke the GitHub PAT used for the initial push once no longer needed.
