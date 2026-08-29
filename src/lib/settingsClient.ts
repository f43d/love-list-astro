/* ============================================================================
 * Client-side helpers for the /settings/ page.
 *
 * Talks to the GitHub Contents API using a user-supplied Personal Access
 * Token (Contents: Read+write on this repo). The token is held in
 * sessionStorage (cleared on tab close), never sent to anything but
 * api.github.com.
 * ========================================================================== */

import type { BucketItem, GalleryItem } from './types';
import { formatBytes, escapeHtml } from './utils';

const REPO = 'f43d/love-list-astro';
const API = 'https://api.github.com';

export type { BucketItem, GalleryItem };

export interface GithubFile {
  path: string;
  content: string;
  sha: string;
}

export interface PatVerifyResult {
  ok: boolean;
  user?: string;
  error?: string;
}

/* ============================================================================
 * PAT (Personal Access Token) storage
 *
 * sessionStorage is used (not localStorage) so the token is cleared
 * when the tab closes — limits exposure to a single session.
 * ========================================================================== */

const PAT_KEY = 'settings-pat';

export function setPat(pat: string): void {
  sessionStorage.setItem(PAT_KEY, pat);
}

export function getPat(): string | null {
  return sessionStorage.getItem(PAT_KEY);
}

export function clearPat(): void {
  sessionStorage.removeItem(PAT_KEY);
}

/* ============================================================================
 * GitHub Contents API — generic file ops
 * ========================================================================== */

function authHeaders(pat: string): HeadersInit {
  return {
    Authorization: `Bearer ${pat}`,
    Accept: 'application/vnd.github+json',
  };
}

function b64encode(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

function b64decode(s: string): string {
  return decodeURIComponent(escape(atob(s.replace(/\n/g, ''))));
}

async function errorFromResponse(prefix: string, r: Response): Promise<Error> {
  const body = await r.json().catch(() => ({} as { message?: string }));
  return new Error(`${prefix} ${r.status} ${body.message ?? ''}`);
}

export async function verifyPat(pat: string): Promise<PatVerifyResult> {
  try {
    const r = await fetch(`${API}/user`, { headers: authHeaders(pat) });
    if (!r.ok) return { ok: false, error: `HTTP ${r.status}` };
    const data = await r.json();
    return { ok: true, user: data.login };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function getFile(path: string, pat: string): Promise<GithubFile | null> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    headers: authHeaders(pat),
  });
  if (r.status === 404) return null;
  if (!r.ok) throw await errorFromResponse(`GET ${path}:`, r);
  const data = await r.json();
  return { path: data.path, content: b64decode(data.content), sha: data.sha };
}

async function putFileAtPath(
  path: string,
  content: string,
  sha: string | null,
  message: string,
  pat: string,
  contentType: 'application/json',
): Promise<string> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { ...authHeaders(pat), 'Content-Type': contentType },
    body: JSON.stringify({
      message,
      content,
      sha: sha ?? undefined,
    }),
  });
  if (!r.ok) throw await errorFromResponse(`PUT ${path}:`, r);
  const data = await r.json();
  return data.commit.sha;
}

export function putFile(
  path: string,
  content: string,
  sha: string | null,
  message: string,
  pat: string,
): Promise<string> {
  return putFileAtPath(path, b64encode(content), sha, message, pat, 'application/json');
}

export function putBinaryFile(
  path: string,
  base64Content: string,
  sha: string | null,
  message: string,
  pat: string,
): Promise<string> {
  return putFileAtPath(path, base64Content, sha, message, pat, 'application/json');
}

export async function deleteFile(
  path: string,
  sha: string,
  message: string,
  pat: string,
): Promise<void> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'DELETE',
    headers: { ...authHeaders(pat), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha }),
  });
  if (!r.ok) throw await errorFromResponse(`DELETE ${path}:`, r);
}

export async function getBinaryFileSha(path: string, pat: string): Promise<string | null> {
  const r = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    headers: authHeaders(pat),
  });
  if (r.status === 404) return null;
  if (!r.ok) throw await errorFromResponse(`HEAD ${path}:`, r);
  const data = await r.json();
  return data.sha;
}

/* ============================================================================
 * Pipe-separated env serialisers (mirror the parser format)
 * ========================================================================== */

const GALLERY_HEADER = [
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

const LIST_HEADER = [
  '# Bucket list — pipe-separated (.env style)',
  '# Format: NN|checked|text|link|photo',
  '#   NN      : zero-digit id, zero-padded',
  '#   checked : true | false',
  '#   text    : the item\'s full text',
  '#   link    : external URL (or empty for self-anchor)',
  '#   photo   : gallery photo id (or empty)',
  '# Lines beginning with \'#\' are ignored.',
  '',
].join('\n');

export function parseGallery(text: string): GalleryItem[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split('|'))
    .filter((p) => p.length >= 5)
    .map(([num, date, location, caption, url]) => ({
      num: num.trim().padStart(2, '0'),
      id: Number.parseInt(num, 10),
      date: date.trim(),
      location: location.trim(),
      caption: caption.trim(),
      url: url.trim(),
    }));
}

export function serialiseGallery(
  items: GalleryItem[],
  existingHeader = '',
): string {
  const header = existingHeader || GALLERY_HEADER;
  const body = items
    .map((it) => [it.num, it.date, it.location, it.caption, it.url].join('|'))
    .join('\n');
  return header + body + '\n';
}

export function parseList(text: string): BucketItem[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split('|'))
    .filter((p) => p.length >= 4)
    .map(([num, checked, text, link, photo]) => ({
      num: num.trim().padStart(2, '0'),
      id: Number.parseInt(num, 10),
      text: text.trim(),
      checked: checked.trim().toLowerCase() === 'true',
      link: (link ?? '').trim(),
      photo: (photo ?? '').trim(),
    }));
}

export function serialiseList(items: BucketItem[]): string {
  const body = items
    .map((it) =>
      [it.num, it.checked ? 'true' : 'false', it.text, it.link, it.photo].join('|'),
    )
    .join('\n');
  return LIST_HEADER + body + '\n';
}

/* ============================================================================
 * Client-side image processing
 *
 * Reads the user's selected file, resizes it to maxWidth (no upscaling)
 * and converts to WebP at the given quality. Returns a Blob (for local
 * preview) and a base64 string (for uploading to GitHub).
 * ========================================================================== */

export interface ProcessedImage {
  blob: Blob;
  width: number;
  height: number;
  base64: string;
}

export async function processImage(
  file: File,
  maxWidth = 1600,
  quality = 0.85,
): Promise<ProcessedImage> {
  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, 'image/webp', quality);
  const base64 = await blobToBase64(blob);
  return { blob, width, height, base64 };
}

function readAsDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('canvas.toBlob returned null'))),
      type,
      quality,
    );
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip "data:image/webp;base64," prefix.
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export { formatBytes, escapeHtml };
