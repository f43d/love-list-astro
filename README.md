# love-list-astro

Static bucket-list site (Astro rewrite of the Hugo paperMod version), hosted on GitHub Pages and served from **https://buc.ketli.st**.

## Stack

- [Astro 5](https://astro.build) — static output
- Plain CSS with custom properties (no Tailwind, no jQuery, no nanogallery2)
- Vanilla JS for the marriage counter, back-to-top, and gallery lightbox
- [Web3Forms](https://web3forms.com) for the blessing form (no backend to run)
- GitHub Issues → GitHub Actions for blessing moderation & publishing

## Pages

| Path | Purpose |
| --- | --- |
| `/` | The 100-item bucket list with marriage counter |
| `/100-reasons-why/` | Long-form "reasons not to marry" page |
| `/gallery/` | Photo grid + lightbox |
| `/comment/` | Blessing form + blessing wall |

## Editing the bucket list

The 100 bucket items live in `data/list.env` (pipe-separated). Format:

```
NN|checked|text|link
```

For checked items, point `link` at a Cloudflare R2 / Immesh photo URL.

## Blessings (comment wall)

### How it works

```
Visitor → form on /comment/
   ↓ POST → Web3Forms → email to owner
   ↓
Owner copies the form data into a GitHub Issue (one click from a pre-filled link)
   ↓
.github/workflows/approve-blessing.yml appends to data/blessings.env, pushes
   ↓
deploy.yml rebuilds the site
   ↓
Approved blessing appears on /comment/  (~30 s later)
```

### Setup

1. **Get a Web3Forms access key** at https://web3forms.com — enter the email where you want submissions to land, copy the key.
2. **Set the secret in GitHub**: repo → Settings → Secrets and variables → Actions → Variables → `PUBLIC_WEB3FORMS_KEY` → paste the key.
3. **Local dev**: copy `.env.example` to `.env` and add the same key.

### Moderation workflow

When you get a Web3Forms email, click this link (replace placeholders):

```
https://github.com/f43d/love-list-astro/issues/new?title=[blessing-approval]&body=%3C%21%2D%2D+blessing-approval+%2D%2D%3E%0A%0A%2A%2AName%3A%2A%2A+%3Cname%3E%0A%2A%2AEmail%3A%2A%2A+%3Cemail%3E+%28private%29%0A%2A%2BMessage%3A%2A%2A+%3Cmessage%3E%0A%0A%3C%21%2D%2D+%2Fblessing-approval+%2D%2D%3E
```

It opens a pre-filled Issue. Edit if you want, click **Submit**. The Action appends the entry and closes the Issue.

### Manual addition

You can also just edit `data/blessings.env` directly:

```
NN|YYYY-MM-DD|name|message
```

Commit and push.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The custom domain is fixed by `public/CNAME` → `buc.ketli.st`.
