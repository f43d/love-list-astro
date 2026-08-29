/* ============================================================================
 * Generic pipe-separated env parser.
 *
 * Shared by parseList, parseGallery, parseBlessings so each file just
 * declares its own field list + header text.
 *
 * Format (one record per non-blank, non-comment line):
 *
 *     field1|field2|field3|...|fieldN
 *
 * Lines starting with '#' are comments. Blank lines are ignored.
 * ========================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

/** Resolve a path relative to this file. */
export function dataPath(file: string): string {
  return resolve(here, '../../data', file);
}

/** Read a data file and return its contents as a string. */
export function readDataFile(file: string): string {
  return readFileSync(dataPath(file), 'utf8');
}

/**
 * Parse a single line into the fields it declares. Pipe characters inside
 * the LAST field are preserved (joined back with '|') — useful for text
 * fields that may contain the separator (e.g. blessing messages).
 */
export function parseLine(
  line: string,
  fieldCount: number,
): string[] | null {
  const parts = line.split('|');
  if (parts.length < fieldCount) return null;
  // For the first (fieldCount - 1) fields, no joining. The rest is joined.
  const head = parts.slice(0, fieldCount - 1).map((p) => p.trim());
  const tail = parts.slice(fieldCount - 1).join('|').trim();
  return [...head, tail];
}

/**
 * Generic line-by-line parser. Calls `parseLine` for each non-blank,
 * non-comment line. Returns the parsed records.
 */
export function parseLines<T>(
  text: string,
  fieldCount: number,
  build: (fields: string[]) => T,
): T[] {
  const out: T[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const fields = parseLine(line, fieldCount);
    if (fields) out.push(build(fields));
  }
  return out;
}

/**
 * Module-level cache so each data file is parsed at most once per build.
 * Keyed by the absolute file path.
 */
const cache = new Map<string, string>();

/** Read a data file, caching the result for the rest of the build. */
export function readCached(file: string): string {
  const path = dataPath(file);
  let text = cache.get(path);
  if (text === undefined) {
    text = readDataFile(file);
    cache.set(path, text);
  }
  return text;
}
