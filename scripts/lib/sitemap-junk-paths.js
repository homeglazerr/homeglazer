/**
 * Legacy WordPress-style paths that must never appear in sitemaps.
 * Shared by: scripts/validate-sitemaps.js, next-sitemap.config.js transform
 */

/**
 * @param {string} loc - Full URL or pathname starting with /
 * @returns {string} pathname only, no trailing slash (except root)
 */
function pathnameFromLoc(loc) {
  if (!loc || typeof loc !== 'string') return '';
  const trimmed = loc.trim();
  if (trimmed.startsWith('/')) {
    const path = trimmed.split('?')[0].split('#')[0];
    if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
    return path || '/';
  }
  try {
    const u = new URL(trimmed);
    let p = u.pathname;
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  } catch {
    return '';
  }
}

/**
 * Canonical sitemap URLs use lowercase paths (matches edge middleware).
 * @param {string} loc - pathname starting with / or absolute URL
 * @returns {string}
 */
function normalizeLocLowercase(loc) {
  if (!loc || typeof loc !== 'string') return loc;
  const trimmed = loc.trim();
  if (trimmed.startsWith('/')) {
    const q = trimmed.indexOf('?');
    const h = trimmed.indexOf('#');
    let cut = trimmed.length;
    if (q >= 0) cut = Math.min(cut, q);
    if (h >= 0) cut = Math.min(cut, h);
    const pathPart = trimmed.slice(0, cut);
    const suffix = trimmed.slice(cut);
    const lowerPath = pathPart.length <= 1 ? pathPart : pathPart.toLowerCase();
    return lowerPath + suffix;
  }
  try {
    const u = new URL(trimmed);
    u.pathname = u.pathname.toLowerCase();
    return u.toString();
  } catch {
    return loc;
  }
}

/**
 * @param {string} pathname - e.g. /blog/foo
 * @returns {boolean}
 */
function isJunkPathname(pathname) {
  const p = pathname || '';
  if (!p || p === '/') return false;

  if (/^\/\d+\.htm$/i.test(p)) return true;
  if (/^\/\d+\.html$/i.test(p)) return true;
  if (p.startsWith('/category/')) return true;
  if (/\/\.html\/?$/i.test(p)) return true;
  if (/\.htm$/i.test(p)) return true;
  if (/^\/[^/]+\.html$/i.test(p)) return true;

  return false;
}

/**
 * @param {string} loc
 * @returns {{ ok: boolean, reason?: string, path?: string }}
 */
function validateSitemapLoc(loc) {
  const path = pathnameFromLoc(loc);
  if (isJunkPathname(path)) {
    return { ok: false, reason: 'legacy/junk URL pattern', path };
  }
  return { ok: true };
}

module.exports = {
  pathnameFromLoc,
  normalizeLocLowercase,
  isJunkPathname,
  validateSitemapLoc,
};
