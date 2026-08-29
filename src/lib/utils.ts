/* ============================================================================
 * Tiny shared utilities used across the site and the /settings/ page.
 * Pure functions, no side effects.
 * ========================================================================== */

/** Pick an integer in [1, max] inclusive. */
export function pickRandomInt(max: number): number {
  return 1 + Math.floor(Math.random() * max);
}

/** Format a byte count as a short human-readable string. */
export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

/** Minimal HTML escape for safely inserting text via innerHTML. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
