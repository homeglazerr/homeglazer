/**
 * Single source of truth for sitemap origins (mirrors src/lib/sitemapBaseUrl.ts).
 * All generated <loc> URLs must use https://www.homeglazer.com (with www) for GSC.
 */

const CANONICAL_ORIGIN = 'https://www.homeglazer.com';

/** Strip trailing slash and force www for production host. */
function apexHomeglazerBase(input) {
  const s = String(input || CANONICAL_ORIGIN)
    .trim()
    .replace(/\/$/, '');
  if (/^https?:\/\/(www\.)?homeglazer\.com(?::\d+)?$/i.test(s)) {
    return CANONICAL_ORIGIN;
  }
  return s;
}

/** Fix a full URL if it mistakenly used non-www (e.g. bad env at build time). */
function apexHomeglazerLoc(loc) {
  const s = String(loc || '');
  return s.replace(/^https?:\/\/homeglazer\.com(?::\d+)?/i, CANONICAL_ORIGIN);
}

module.exports = {
  CANONICAL_ORIGIN,
  apexHomeglazerBase,
  apexHomeglazerLoc,
};
