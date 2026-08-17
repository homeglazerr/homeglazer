/**
 * Sitemap <loc> URLs must use one canonical origin (non-www) so GSC and crawlers
 * do not see duplicate sitemap entries for www vs apex.
 *
 * Node build scripts mirror this in scripts/lib/sitemap-base-url.js (keep in sync).
 */
export const CANONICAL_SITEMAP_ORIGIN = 'https://homeglazer.com';

/** Force production sitemap base to apex; leaves staging/preview URLs unchanged. */
export function canonicalSitemapBase(input: string): string {
  const s = input.trim().replace(/\/$/, '');
  return s.replace(/^https?:\/\/www\.homeglazer\.com(?::\d+)?/i, CANONICAL_SITEMAP_ORIGIN);
}
