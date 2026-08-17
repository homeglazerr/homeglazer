/**
 * Single source of truth for sitemap origins (mirrors src/lib/sitemapBaseUrl.ts).
 * All generated <loc> URLs must use https://homeglazer.com (no www) for GSC.
 */

const CANONICAL_ORIGIN = 'https://homeglazer.com';

/** Strip trailing slash and force apex for production host. */
function apexHomeglazerBase(input) {
  const s = String(input || CANONICAL_ORIGIN)
    .trim()
    .replace(/\/$/, '');
  return s.replace(/^https?:\/\/www\.homeglazer\.com(?::\d+)?/i, CANONICAL_ORIGIN);
}

/** Fix a full URL if it mistakenly used www (e.g. bad env at build time). */
function apexHomeglazerLoc(loc) {
  const s = String(loc || '');
  return s.replace(/^https?:\/\/www\.homeglazer\.com(?::\d+)?/i, CANONICAL_ORIGIN);
}

module.exports = {
  CANONICAL_ORIGIN,
  apexHomeglazerBase,
  apexHomeglazerLoc,
};
