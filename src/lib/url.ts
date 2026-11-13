// Prefixes internal links with the deploy base path, so the site works both at a
// domain root (lockforce.com.au) and under a sub-path (GitHub Pages project sites).
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function link(path: string): string {
  return path.startsWith('/') ? `${base}${path}` : path;
}
