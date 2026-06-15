import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig } from '@/lib/auth.config';
import { can, type Role } from '@/lib/constants';

const { auth } = NextAuth(authConfig);

const SURFACE = process.env.APP_SURFACE ?? 'all';

const CMS_PATHS = ['/cms'];
const ADMIN_PATHS = ['/admin'];
const SHARED_PATHS = ['/login', '/api', '/images'];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function redirectTo(port: number, pathname: string, request: NextRequest) {
  const url = request.nextUrl.clone();
  if (process.env.NODE_ENV === 'production') {
    const host = request.headers.get('host') || '';
    // Extract base domain by removing leading subdomains (cms. or admin.)
    const baseDomain = host.replace(/^(cms\.|admin\.)/, '');
    
    if (port === 3001) {
      url.host = `cms.${baseDomain}`;
    } else if (port === 3002) {
      url.host = `admin.${baseDomain}`;
    } else {
      url.host = baseDomain;
    }
    url.port = ''; // Reset port for production standard ports (80/443)
  } else {
    url.port = String(port);
  }
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;
  const role = session?.user?.role as Role | undefined;

  if (SURFACE === 'public' && (matchesPrefix(pathname, CMS_PATHS) || matchesPrefix(pathname, ADMIN_PATHS))) {
    const port = matchesPrefix(pathname, CMS_PATHS) ? 3001 : 3002;
    return redirectTo(port, pathname, request);
  }
  if (SURFACE === 'cms' && !matchesPrefix(pathname, CMS_PATHS) && !matchesPrefix(pathname, SHARED_PATHS)) {
    if (matchesPrefix(pathname, ADMIN_PATHS)) return redirectTo(3002, pathname, request);
    if (!pathname.startsWith('/_next')) return redirectTo(3001, '/cms', request);
  }
  if (SURFACE === 'admin' && !matchesPrefix(pathname, ADMIN_PATHS) && !matchesPrefix(pathname, SHARED_PATHS)) {
    if (matchesPrefix(pathname, CMS_PATHS)) return redirectTo(3001, pathname, request);
    if (!pathname.startsWith('/_next')) return redirectTo(3002, '/admin', request);
  }

  if (matchesPrefix(pathname, ADMIN_PATHS)) {
    if (!session) {
      const login = new URL('/login', request.url);
      login.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(login);
    }
    if (!can(role, 'user.view')) {
      return NextResponse.redirect(new URL('/cms', request.url));
    }
  }

  if (matchesPrefix(pathname, CMS_PATHS)) {
    if (!session) {
      const login = new URL('/login', request.url);
      login.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(login);
    }
    if (!can(role, 'article.create')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads|images/).*)'],
};