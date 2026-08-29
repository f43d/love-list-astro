/* ============================================================================
 * data/blessings.env — approved visitor blessings, one per line:
 *
 *     NN|date|name|message
 *
 *   NN      : zero-padded id
 *   date    : YYYY-MM-DD
 *   name    : visitor's display name
 *   message : the blessing (may contain newlines, escaped as '|')
 *
 * Server-side only. Used by Astro components.
 * ========================================================================== */

import { readCached, parseLines } from './parseEnv';
import type { Blessing } from './types';

let cache: Blessing[] | null = null;

export function loadBlessings(): Blessing[] {
  if (cache) return cache;
  cache = parseLines<Blessing>(readCached('blessings.env'), 4, (f) => {
    const id = Number.parseInt(f[0], 10);
    if (!Number.isFinite(id)) {
      throw new Error(`Invalid blessings line: ${f.join('|')}`);
    }
    return {
      num: f[0].padStart(2, '0'),
      id,
      date: f[1],
      name: f[2],
      message: f[3],
    };
  });
  return cache;
}

export function loadBlessingsNewestFirst(): Blessing[] {
  return [...loadBlessings()].sort((a, b) => b.id - a.id);
}
