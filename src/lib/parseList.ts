import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

export interface BucketItem {
  id: number;
  num: string;
  text: string;
  checked: boolean;
  link: string;
  photo: string;
}

const here = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(here, '../../data/list.env');

let cache: BucketItem[] | null = null;

function parseEnv(text: string): BucketItem[] {
  const out: BucketItem[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

const [numRaw, checkedRaw, textRaw, linkRaw, photoRaw] = line.split('|');
    if (!numRaw) continue;

    const id = Number.parseInt(numRaw, 10);
    if (!Number.isFinite(id)) continue;

    out.push({
      id,
      num: String(id).padStart(2, '0'),
      checked: checkedRaw?.trim().toLowerCase() === 'true',
      text: textRaw.trim(),
      link: (linkRaw ?? '').trim(),
      photo: (photoRaw ?? '').trim(),
    });
  }
  return out;
}

export function loadList(): BucketItem[] {
  if (cache) return cache;
  const text = readFileSync(DATA_PATH, 'utf8');
  cache = parseEnv(text);
  return cache;
}

export function loadListSorted(): BucketItem[] {
  return [...loadList()].sort((a, b) => a.id - b.id);
}
