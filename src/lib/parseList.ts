/* ============================================================================
 * data/list.env — bucket list items, one per line:
 *
 *     NN|checked|text|link|photo
 *
 *   NN      : zero-padded id
 *   checked : "true" or "false"
 *   text    : the item's full text
 *   link    : external URL (or empty for self-anchor)
 *   photo   : gallery photo id (optional; empty if not linked)
 *
 * The 5th column (photo) was added later. Old rows with only 4 columns
 * still parse correctly because parseLine merges any extra fields.
 *
 * Server-side only. Used by Astro components.
 * ========================================================================== */

import { readCached, parseLines } from './parseEnv';
import type { BucketItem } from './types';

let cache: BucketItem[] | null = null;

export function loadList(): BucketItem[] {
  if (cache) return cache;
  cache = parseLines<BucketItem>(readCached('list.env'), 4, (f) => {
    const id = Number.parseInt(f[0], 10);
    if (!Number.isFinite(id)) {
      throw new Error(`Invalid bucket-list line: ${f.join('|')}`);
    }
    return {
      num: f[0].padStart(2, '0'),
      id,
      checked: f[1].toLowerCase() === 'true',
      text: f[2],
      link: f[3],
      // f[4] is the optional photo id (5th column). If absent (older rows
      // with only 4 columns), parseLine returns just 4 fields and this
      // is undefined → treat as empty.
      photo: f[4] ?? '',
    };
  });
  return cache;
}

export function loadListSorted(): BucketItem[] {
  return [...loadList()].sort((a, b) => a.id - b.id);
}
