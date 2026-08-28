# love-list-astro

Static bucket-list site (Astro rewrite of the Hugo paperMod version), hosted on GitHub Pages and served from **https://buc.ketli.st**.

## Stack

- [Astro 5](https://astro.build) — static output
- Plain CSS with custom properties (no Tailwind, no jQuery, no nanogallery2)
- Vanilla JS for the marriage counter, back-to-top, and gallery lightbox
- [Artalk](https://artalk.js.org/) for comments (server: `wish.sorio.us`)

## Editing the list

The 100 bucket items live in a single human-readable file:

```
data/list.env
```

Format per line:

```
NN|checked|text|link
```

- `NN` — two-digit number (e.g. `14`)
- `checked` — `true` or `false`
- `text` — the item title
- `link` — optional; for checked items point this at a photo URL on Cloudflare R2 / Immesh

Lines beginning with `#` are ignored. After editing, run `npm run build` to see changes.

## Local development

```bash
npm install
npm run dev    # http://localhost:4321
npm run build  # outputs to ./dist
npm run preview
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages. The custom domain is fixed by `public/CNAME` → `buc.ketli.st`.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | The 100-item bucket list with marriage counter |
| `/100-reasons-why/` | Long-form "reasons not to marry" page |
| `/gallery/` | Photo grid + lightbox |
| `/comment/` | Artalk comments |
