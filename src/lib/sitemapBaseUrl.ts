export const CANONICAL_SITEMAP_ORIGIN = 'https://www.homeglazer.com';

/** Force production sitemap base to www; leaves staging/preview URLs unchanged. */
export function canonicalSitemapBase(input: string): string {
  const s = input.trim().replace(/\/$/, '');
  if (/^https?:\/\/(www\.)?homeglazer\.com(?::\d+)?$/i.test(s)) {
    return CANONICAL_SITEMAP_ORIGIN;
  }
  return s;
}
