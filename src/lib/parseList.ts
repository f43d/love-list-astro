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
  // fieldCount=5: every row now has all five columns
  // (NN|checked|text|link|photo). The older forward-compat hack used
  // fieldCount=4 so 4-column rows (pre-photo column) still parsed; now
  // that all 100 rows carry the photo column, an exact 5-field parse is
  // correct — otherwise the photo id gets merged into link (link becomes
  // "https://example.com|08", photo is lost) and the photo icon silently
  // disappears from the public list.
  cache = parseLines<BucketItem>(readCached('list.env'), 5, (f) => {
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
      photo: f[4] ?? '',
    };
  });
  return cache;
}

export function loadListSorted(): BucketItem[] {
  return [...loadList()].sort((a, b) => a.id - b.id);
}
