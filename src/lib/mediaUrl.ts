/**
 * Resolves media paths to S3 URLs in production when NEXT_PUBLIC_S3_MEDIA_URL is set.
 * In dev or when S3 URL is not set, returns the path as-is (served from public/).
 *
 * S3 setup (required for Amplify production):
 * 1. Set NEXT_PUBLIC_S3_MEDIA_URL in Amplify = https://<bucket>.s3.<region>.amazonaws.com
 * 2. Run: npm run upload:visualiser  (room images for advanced/basic visualiser)
 * 3. Run: npm run upload:media       (uploads/, media/)
 */

const S3_BASE = (process.env.NEXT_PUBLIC_S3_MEDIA_URL || '').trim().replace(/\/+$/, '');

// Room folders uploaded by npm run upload:visualiser to S3 key visualiser/assets/images/<folder>/...
const VISUALISER_ROOM_FOLDERS = [
  'bedroom',
  'bathroom',
  'kitchen',
  'livingroom',
  'homeoffice',
  'kidsroom',
  'office',
  'outdoor',
  'maingate',
  'visualizer-thumbnails',
];

export function getMediaUrl(path: string): string {
  if (!path || typeof path !== 'string') return path;

  // Already absolute URL or Data URI - return as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const normalized = path.replace(/^\/+/, '');
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (S3_BASE && !isDevelopment) {
    // Room images: S3 key is visualiser/assets/images/<room>/...
    if (normalized.startsWith('assets/images/')) {
      const rest = normalized.slice('assets/images/'.length);
      const firstSegment = rest.split('/')[0];
      if (VISUALISER_ROOM_FOLDERS.includes(firstSegment)) {
        const s3Url = `${S3_BASE}/visualiser/${normalized}`;
        if (typeof window !== 'undefined') {
          console.log('[getMediaUrl] Converting to S3:', path, '->', s3Url, 'S3_BASE:', S3_BASE);
        }
        return s3Url;
      }
      // Brand logos: S3 key is assets/images/brand-logos/...
      // Only use S3 in production - in development, serve from local public folder
      if (rest.startsWith('brand-logos/')) {
        const s3Url = `${S3_BASE}/${normalized}`;
        return s3Url;
      }
    }

    // uploads/* and media/*: S3 key matches path (uploaded by npm run upload:media)
    if (normalized.startsWith('uploads/') || normalized.startsWith('media/')) {
      return `${S3_BASE}/${normalized}`;
    }
  } else {
    // Log warning only in production if S3_BASE is not set but we're trying to load room images
    // In development, we serve from local public folder, so no warning needed
    if (!isDevelopment && normalized.startsWith('assets/images/') && typeof window !== 'undefined') {
      const rest = normalized.slice('assets/images/'.length);
      const firstSegment = rest.split('/')[0];
      if (VISUALISER_ROOM_FOLDERS.includes(firstSegment)) {
        console.warn('[getMediaUrl] NEXT_PUBLIC_S3_MEDIA_URL not set. Room images may not load in production:', path);
      }
    }
  }

  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Transforms <img src="..."> URLs inside an HTML string so that relative
 * paths (e.g. /uploads/*, media/*) go through getMediaUrl(). This is
 * primarily used for blog content that is stored as raw HTML.
 */
export function transformHtmlImageUrls(html: string): string {
  if (!html || typeof html !== 'string') return html;

  return html.replace(
    /<img([^>]*)\ssrc=["']([^"']+)["']/gi,
    (match, attrs, src) => {
      const resolved = getMediaUrl(src);
      return `<img${attrs} src="${resolved}"`;
    }
  );
}

/**
 * Ensures every <img> in HTML has a non-empty alt for accessibility and image SEO.
 * Preserves existing meaningful alt text; fills missing or empty alt with fallbackAlt.
 * Unquoted or unusual alt syntax is left unchanged to avoid duplicate attributes.
 */
export function ensureHtmlImageAlts(html: string, fallbackAlt: string): string {
  if (!html || typeof html !== 'string') return html;
  const escaped = fallbackAlt.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

  return html.replace(/<img\b([^>]*)>/gi, (_full, attrs) => {
    const attrStr = String(attrs);
    const quoted = /\balt\s*=\s*(["'])([\s\S]*?)\1/i.exec(attrStr);
    if (quoted) {
      if (quoted[2].trim().length > 0) {
        return `<img${attrStr}>`;
      }
      const newAttrs = attrStr.replace(/\s*\balt\s*=\s*(["'])\s*\1/gi, '').trim();
      const prefix = newAttrs ? ` ${newAttrs}` : '';
      return `<img${prefix} alt="${escaped}">`;
    }
    if (/\balt\s*=/i.test(attrStr)) {
      return `<img${attrStr}>`;
    }
    const trimmed = attrStr.trim();
    const prefix = trimmed ? ` ${trimmed}` : '';
    return `<img${prefix} alt="${escaped}">`;
  });
}

/**
 * WordPress/Elementor exports often wrap post HTML in a full document
 * (<html><head>…</head><body>…</body></html>). Rendering that with dangerouslySetInnerHTML
 * nests invalid document elements and triggers "duplicate head/body" SEO findings.
 * Safe for any embedded HTML fragment (blog body, server-rendered widgets, etc.).
 */
export function stripNestedDocumentShell(html: string): string {
  if (!html || typeof html !== 'string') return '';
  let s = html.trim();
  if (!s) return s;

  s = s.replace(/^<!DOCTYPE[^>]*>\s*/i, '');

  for (let i = 0; i < 8; i++) {
    const before = s;
    const bodyMatch = s.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      s = bodyMatch[1].trim();
      if (s !== before) continue;
    }
    if (/^<html[\s>]/i.test(s)) {
      s = s.replace(/^<html[^>]*>\s*/i, '').replace(/\s*<\/html>\s*$/i, '').trim();
      s = s.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '').trim();
      continue;
    }
    break;
  }

  s = s.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '').trim();
  s = s.replace(/^<body[^>]*>/i, '').replace(/<\/body>\s*$/i, '').trim();
  return s;
}

/** Blog body pipeline: unwrap accidental full documents, then fix image URLs. */
export function prepareBlogContentHtml(html: string): string {
  const stripped = stripNestedDocumentShell(html);
  const withUrls = transformHtmlImageUrls(stripped);
  return ensureHtmlImageAlts(
    withUrls,
    'Illustration from the Home Glazer blog article'
  );
}

/** Returns absolute URL for media (for og:image, etc). Uses S3 when set, else siteUrl + path. */
export function getAbsoluteMediaUrl(path: string, siteUrl: string): string {
  const url = getMediaUrl(path);
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${siteUrl.replace(/\/$/, '')}${url.startsWith('/') ? url : `/${url}`}`;
}

const DEFAULT_OG_FALLBACK = '/uploads/hero-banner.png';

/**
 * Returns URL for og:image meta tags. Uses same-domain API proxy when S3 is set
 * so Facebook/WhatsApp crawlers can fetch reliably (they often fail with amazonaws.com URLs).
 * When path is empty/null, uses fallbackPath or homepage hero-banner.png.
 */
export function getOgImageUrl(
  path: string,
  siteUrl: string,
  fallbackPath?: string
): string {
  const effectivePath = path || fallbackPath || DEFAULT_OG_FALLBACK;
  const normalized = effectivePath.replace(/^\/+/, '');

  if (S3_BASE && process.env.NODE_ENV !== 'development') {
    return `${siteUrl.replace(/\/$/, '')}/api/og-image?path=/${encodeURIComponent(normalized)}`;
  }

  return getAbsoluteMediaUrl(effectivePath, siteUrl);
}
