import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { userAgent } from 'next/server';

const APEX_HOST = 'homeglazer.com';
const PERMANENT_REDIRECT = 301;

function shouldSkipPathNormalization(pathname: string): boolean {
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) return true;
  // Leave asset-like URLs unchanged (case-sensitive on disk / CDN)
  return /\.[a-zA-Z0-9]{1,16}$/.test(pathname);
}

/**
 * Host + HTTPS + path normalization (www → apex, lowercase, no trailing slash except root).
 * Uppercase paths (e.g. /About, /products/Foo/bar) get a 301 to the lowercase canonical URL.
 * Paths ending in a file extension are skipped so mixed-case static filenames under /uploads stay valid on case-sensitive hosts.
 */
export function middleware(request: NextRequest) {
  const skipPath = shouldSkipPathNormalization(request.nextUrl.pathname);
  const target = request.nextUrl.clone();

  if (target.hostname === `www.${APEX_HOST}`) {
    target.hostname = APEX_HOST;
  }
  if (target.hostname === APEX_HOST && target.protocol !== 'https:') {
    target.protocol = 'https:';
  }

  if (!skipPath) {
    let path = target.pathname;
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    target.pathname = path === '/' ? '/' : path.toLowerCase();
  }

  const r = request.nextUrl;
  const redirectNeeded =
    target.hostname !== r.hostname ||
    target.protocol !== r.protocol ||
    target.pathname !== r.pathname;

  if (redirectNeeded) {
    target.search = r.search;
    return NextResponse.redirect(target, PERMANENT_REDIRECT);
  }

  const { device } = userAgent(request);
  const isMobileDevice = device.type === 'mobile' || device.type === 'tablet';
  const response = NextResponse.next();
  response.cookies.set('x-is-mobile-device', String(isMobileDevice), {
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: 'lax',
  });
  return response;
}
