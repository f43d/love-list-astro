import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

export interface GalleryItem {
  id: number;
  num: string;
  date: string;
  location: string;
  caption: string;
  url: string;
}

const here = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(here, '../../data/gallery.env');

let cache: GalleryItem[] | null = null;

function parseEnv(text: string): GalleryItem[] {
  const out: GalleryItem[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    const [numRaw, dateRaw, locationRaw, captionRaw, urlRaw] = line.split('|');
    if (!numRaw || !urlRaw) continue;

    const id = Number.parseInt(numRaw, 10);
    if (!Number.isFinite(id)) continue;

    out.push({
      id,
      num: String(id).padStart(2, '0'),
      date: (dateRaw ?? '').trim(),
      location: (locationRaw ?? '').trim(),
      caption: (captionRaw ?? '').trim(),
      url: urlRaw.trim(),
    });
  }
  return out;
}

export function loadGallery(): GalleryItem[] {
  if (cache) return cache;
  const text = readFileSync(DATA_PATH, 'utf8');
  cache = parseEnv(text);
  return cache;
}

export function loadGallerySorted(): GalleryItem[] {
  return [...loadGallery()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function findGalleryItem(id: string): GalleryItem | undefined {
  return loadGallery().find((g) => g.num === id || String(g.id) === id);
}