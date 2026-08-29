/* ============================================================================
 * Shared data types.
 *
 * Single source of truth for the three pipe-separated env files
 * (data/list.env, data/gallery.env, data/blessings.env).
 *
 * Used by both server-side (Astro components) and client-side
 * (the /settings/ page) code.
 * ========================================================================== */

export interface BucketItem {
  /** Zero-padded two-digit display id (e.g. "14"). */
  num: string;
  /** Numeric id parsed from the env file. */
  id: number;
  /** The full text of the bucket-list item. */
  text: string;
  /** Has the owner marked this item as done? */
  checked: boolean;
  /** External link (or empty for self-anchor / placeholder). */
  link: string;
  /** Gallery photo id this item links to, or empty. */
  photo: string;
}

export interface GalleryItem {
  num: string;
  id: number;
  /** YYYY-MM-DD when the photo was taken. */
  date: string;
  /** City / place. */
  location: string;
  /** Short description of what's in the photo. */
  caption: string;
  /** Full URL or repo-relative path. */
  url: string;
}

export interface Blessing {
  num: string;
  id: number;
  date: string;
  /** Display name of the visitor. */
  name: string;
  /** The blessing text (may contain newlines). */
  message: string;
}
