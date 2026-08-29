/* ============================================================================
 * data/list.env — bucket list items, one per line:
 *
 *     NN|checked|text|link|photo
 *
 *   NN      : zero-padded id
 *   checked : "true" or "false"
 *   text    : the item's full text
 *   link    : external URL (or empty for self-anchor)
 *   photo   : gallery photo id this item links to (or empty)
 *
 * Server-side only. Used by Astro components.
 * ========================================================================== */

import { readCached, parseLines } from './parseEnv';
import type { BucketItem } from './types';

let cache: BucketItem[] | null = null;

export function loadList(): BucketItem[] {
  if (cache) return cache;
  cache = parseLines<BucketItem>(readCached('list.env'), 5, (f) => {
    const id = Number.parseInt(f[0], 10);
    if (!Number.isFinite(id)) {
      // Skip lines with non-numeric id (shouldn't happen in well-formed data).
      throw new Error(`Invalid bucket-list line: ${f.join('|')}`);
    }
    return {
      num: f[0].padStart(2, '0'),
      id,
      text: f[2],
      checked: f[1].toLowerCase() === 'true',
      link: f[3],
      photo: f[4],
    };
  });
  return cache;
}

export function loadListSorted(): BucketItem[] {
  return [...loadList()].sort((a, b) => a.id - b.id);
}
