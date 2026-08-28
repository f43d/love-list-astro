import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://buc.ketli.st',
  trailingSlash: 'always',
  build: {
    assets: 'assets',
  },
  compressHTML: true,
  });
