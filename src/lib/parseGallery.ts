/* ============================================================================
 * data/gallery.env — gallery photo metadata, one per line:
 *
 *     NN|date|location|caption|url
 *
 *   NN       : zero-padded id
 *   date     : YYYY-MM-DD when the photo was taken
 *   location : city / place
 *   caption  : short description
 *   url      : full URL or repo-relative path
 *
 * Server-side only. Used by Astro components.
 * ========================================================================== */

import { readCached, parseLines } from './parseEnv';
import type { GalleryItem } from './types';

let cache: GalleryItem[] | null = null;

export function loadGallery(): GalleryItem[] {
  if (cache) return cache;
  cache = parseLines<GalleryItem>(readCached('gallery.env'), 5, (f) => {
    const id = Number.parseInt(f[0], 10);
    if (!Number.isFinite(id)) {
      throw new Error(`Invalid gallery line: ${f.join('|')}`);
    }
    return {
      num: f[0].padStart(2, '0'),
      id,
      date: f[1],
      location: f[2],
      caption: f[3],
      url: f[4],
    };
  });
  return cache;
}

export function loadGallerySorted(): GalleryItem[] {
  return [...loadGallery()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function findGalleryItem(id: string): GalleryItem | undefined {
  return loadGallery().find((g) => g.num === id || String(g.id) === id);
}
