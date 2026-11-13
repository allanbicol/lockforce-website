# Lockforce International website

A redesign of [lockforce.com.au](https://lockforce.com.au), built as a static site with Astro, GSAP, Lenis and Three.js.

## Run it

```sh
npm install
npm run dev      # local dev server
npm run build    # static site in dist/
npm run preview  # serve the built site
```

Requires Node 22.23 or newer.

## Where things live

- `src/data/site.ts` holds all copy: navigation, services, products, FAQs, news and contact details.
- `src/assets/images/` holds the photography, optimised at build time.
- `src/pages/` has one file per page.
- `src/scripts/main.ts` drives scroll, cursor and reveal behaviour; `src/scripts/globe.ts` is the hero globe.
- `npm run gen:globe` regenerates the globe's land dots (`src/data/land-dots.json`).

## Deployment

Pushing to `main` builds and publishes to GitHub Pages through `.github/workflows/deploy.yml`. The workflow passes the Pages URL and sub-path to the build as `SITE_URL` and `BASE_PATH`; without them the site builds for the `lockforce.com.au` root. Builds for any other host are marked `noindex`.

## Known gaps

- The contact form opens the visitor's email app; it has no backend.
- News cards and product flyers link to the existing lockforce.com.au site.
