import type { ImageMetadata } from 'astro';

const files = import.meta.glob<ImageMetadata>('../assets/images/*', { eager: true, import: 'default' });

/** Look up an optimisable image in src/assets/images by file name. */
export function img(name: string): ImageMetadata {
  const hit = files[`../assets/images/${name}`];
  if (!hit) throw new Error(`Missing image: src/assets/images/${name}`);
  return hit;
}
