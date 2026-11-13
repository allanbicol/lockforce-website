import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH are set by the GitHub Pages workflow so the same code
// deploys under https://<user>.github.io/<repo>/ and at the lockforce.com.au root.
export default defineConfig({
  site: process.env.SITE_URL || 'https://lockforce.com.au',
  base: process.env.BASE_PATH || '/',
  compressHTML: true,
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
