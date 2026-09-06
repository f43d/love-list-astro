/* ============================================================================
 * data/videos.env — video clip metadata, one per line:
 *
 *     NN|date|caption|file|item
 *
 *   NN      : zero-padded id
 *   date    : YYYY-MM-DD when the clip was filmed (optional)
 *   caption : short description
 *   file    : full URL or repo-relative path (/videos/...)
 *   item    : bucket-list item number this clip belongs to (optional)
 *
 * Server-side only. Used by Astro components (e.g. /video/).
 * ========================================================================== */

import { readCached, parseLines } from './parseEnv';
import type { VideoItem } from './types';

let cache: VideoItem[] | null = null;

export function loadVideos(): VideoItem[] {
  if (cache) return cache;
  cache = parseLines<VideoItem>(readCached('videos.env'), 5, (f) => {
    const id = Number.parseInt(f[0], 10);
    if (!Number.isFinite(id)) {
      throw new Error(`Invalid videos line: ${f.join('|')}`);
    }
    return {
      num: f[0].padStart(2, '0'),
      id,
      date: f[1],
      caption: f[2],
      file: f[3],
      item: f[4] ?? '',
    };
  });
  return cache;
}

export function loadVideosSorted(): VideoItem[] {
  return [...loadVideos()].sort((a, b) => a.id - b.id);
}

export function findVideoItem(id: string): VideoItem | undefined {
  return loadVideos().find((v) => v.num === id || String(v.id) === id);
}
