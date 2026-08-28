import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

export interface Blessing {
  id: number;
  num: string;
  date: string;
  name: string;
  message: string;
}

const here = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(here, '../../data/blessings.env');

let cache: Blessing[] | null = null;

function parseEnv(text: string): Blessing[] {
  const out: Blessing[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    const [numRaw, dateRaw, nameRaw, ...messageParts] = line.split('|');
    if (!numRaw || !dateRaw || !nameRaw) continue;

    const id = Number.parseInt(numRaw, 10);
    if (!Number.isFinite(id)) continue;

    out.push({
      id,
      num: String(id).padStart(2, '0'),
      date: dateRaw.trim(),
      name: nameRaw.trim(),
      message: messageParts.join('|').trim(),
    });
  }
  return out;
}

export function loadBlessings(): Blessing[] {
  if (cache) return cache;
  const text = readFileSync(DATA_PATH, 'utf8');
  cache = parseEnv(text);
  return cache;
}

export function loadBlessingsNewestFirst(): Blessing[] {
  return [...loadBlessings()].sort((a, b) => b.id - a.id);
}
