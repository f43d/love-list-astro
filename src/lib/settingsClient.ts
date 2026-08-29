// Client-side helpers for the /settings/ page.
// All file ops are against the GitHub Contents API using the user's PAT.

const REPO = 'f43d/love-list-astro';
const API = 'https://api.github.com';

export interface GithubFile {
  path: string;
  content: string;
  sha: string;
}

export interface GalleryItem {
  num: string;
  date: string;
  location: string;
  caption: string;
  url: string;
}

export interface BucketItem {
  num: string;
  text: string;
  checked: boolean;
  link: string;
  photo: string;
}

function b64encode(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

function b64decode(s: string): string {
  return decodeURIComponent(escape(atob(s.replace(/\n/g, ''))));
}

export function setPat(pat: string): void {
  sessionStorage.setItem('settings-pat', pat);
}

export function getPat(): string | null {
  return sessionStorage.getItem('settings-pat');
}

export function clearPat(): void {
  sessionStorage.removeItem('settings-pat');
}

export async function verifyPat(pat: string): Promise<{ ok: boolean; user?: string; error?: string }> {
  try {
    const r = await fetch(`${API}/user`, {
      headers: { Authorization: `Bearer ${pat}`, Accept: 'application/vnd.github+json' },
    });
    if (!r.ok) return { ok: false, error: `HTTP ${r.status}` };
    const data = await r.json();
    return { ok: true, user: data.login };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function getFile(path: string, pat: string): Promise<GithubFile | null> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    headers: { Authorization: `Bearer ${pat}`, Accept: 'application/vnd.github+json' },
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GET ${path}: ${r.status}`);
  const data = await r.json();
  return { path: data.path, content: b64decode(data.content), sha: data.sha };
}

export async function putFile(
  path: string,
  content: string,
  sha: string | null,
  message: string,
  pat: string,
): Promise<string> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: b64encode(content),
      sha: sha ?? undefined,
    }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(`PUT ${path}: ${r.status} ${(err as { message?: string }).message ?? ''}`);
  }
  const data = await r.json();
  return data.commit.sha;
}

export async function deleteFile(path: string, sha: string, message: string, pat: string): Promise<void> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sha }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(`DELETE ${path}: ${r.status} ${(err as { message?: string }).message ?? ''}`);
  }
}

export async function putBinaryFile(
  path: string,
  base64Content: string,
  sha: string | null,
  message: string,
  pat: string,
): Promise<string> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: base64Content,
      sha: sha ?? undefined,
    }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(`PUT ${path}: ${r.status} ${(err as { message?: string }).message ?? ''}`);
  }
  const data = await r.json();
  return data.commit.sha;
}

export async function getBinaryFileSha(path: string, pat: string): Promise<string | null> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    headers: { Authorization: `Bearer ${pat}`, Accept: 'application/vnd.github+json' },
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`HEAD ${path}: ${r.status}`);
  const data = await r.json();
  return data.sha;
}

// === Parse / serialise pipe-separated env files ===

export function parseGallery(text: string): GalleryItem[] {
  const out: GalleryItem[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split('|');
    if (parts.length < 5) continue;
    const [num, date, location, caption, url] = parts;
    out.push({
      num: num.trim(),
      date: (date ?? '').trim(),
      location: (location ?? '').trim(),
      caption: (caption ?? '').trim(),
      url: (url ?? '').trim(),
    });
  }
  return out;
}

export function serialiseGallery(items: GalleryItem[], existingHeader = ''): string {
  const header = existingHeader || [
    '# Gallery metadata — pipe-separated (.env style)',
    '# Format: NN|date|location|caption|url',
    '#   NN       : two-digit id, zero-padded',
    '#   date     : YYYY-MM-DD (when the photo was taken)',
    '#   location : free text (city, place)',
    '#   caption  : free text (brief description)',
    '#   url      : full URL or /-prefixed repo path',
    '# Lines beginning with \'#\' are ignored.',
    '',
  ].join('\n');
  const body = items
    .map((it) => [it.num, it.date, it.location, it.caption, it.url].join('|'))
    .join('\n');
  return header + body + '\n';
}

export function parseList(text: string): BucketItem[] {
  const out: BucketItem[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split('|');
    if (parts.length < 4) continue;
    const [num, checked, text_, link, photo] = parts;
    out.push({
      num: num.trim(),
      text: (text_ ?? '').trim(),
      checked: (checked ?? '').trim().toLowerCase() === 'true',
      link: (link ?? '').trim(),
      photo: (photo ?? '').trim(),
    });
  }
  return out;
}

export function serialiseList(items: BucketItem[]): string {
  return items
    .map((it) => [it.num, it.checked ? 'true' : 'false', it.text, it.link, it.photo].join('|'))
    .join('\n') + '\n';
}

// === Image processing ===

export async function processImage(
  file: File,
  maxWidth = 1600,
  quality = 0.85,
): Promise<{ blob: Blob; width: number; height: number; base64: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('canvas.toBlob returned null'))),
      'image/webp',
      quality,
    );
  });

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip "data:image/webp;base64,"
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return { blob, width: w, height: h, base64 };
}

// === Convenience: format bytes ===

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}