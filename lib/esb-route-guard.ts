import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  hostContextFromRequest,
  isStaffRole,
  redirectUrlForRequest,
  resolvePostLoginPath,
} from '@/lib/auth-routing';
import { authContinuePath, needsAuthHandoff } from '@/lib/auth-handoff';
import { getMiddlewareSession } from '@/lib/middleware-auth';
import { getSessionRole, hasSessionRole } from '@/lib/session-role';
import { can, canAccessAdminPanel } from '@/lib/constants';

const SURFACE = process.env.APP_SURFACE ?? 'all';
const USE_SPLIT_SURFACES = process.env.NODE_ENV === 'development' && SURFACE !== 'all';

const CMS_PATHS = ['/cms'];
const EDITOR_ALIASES = ['/editor'];
const ADMIN_PATHS = ['/admin'];
const SHARED_PATHS = ['/api', '/images', '/auth'];
const PUBLIC_SITE_PATHS = [
  '/',
  '/articles',
  '/magazine',
  '/categories',
  '/search',
  '/tags',
  '/data-reports',
];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isPublicSitePath(pathname: string) {
  if (pathname === '/') return true;
  return PUBLIC_SITE_PATHS.some(
    (prefix) => prefix !== '/' && (pathname === prefix || pathname.startsWith(`${prefix}/`)),
  );
}

function redirectTo(port: number, pathname: string, request: NextRequest, search = '') {
  const url = request.nextUrl.clone();
  if (process.env.NODE_ENV === 'production') {
    const host = request.headers.get('host') || '';
    const baseDomain = host.replace(/^(cms\.|admin\.)/, '');

    if (port === 3001) {
      url.host = `cms.${baseDomain}`;
    } else if (port === 3002) {
      url.host = `admin.${baseDomain}`;
    } else {
      url.host = baseDomain;
    }
    url.port = '';
  } else {
    url.port = String(port);
  }
  url.pathname = pathname;
  url.search = search;
  return NextResponse.redirect(url);
}

/** In split dev, staff login lives on the public surface (port 3000). */
function staffLoginRedirect(request: NextRequest, callbackPath: string) {
  let callback = callbackPath;
  if (USE_SPLIT_SURFACES && (SURFACE === 'cms' || SURFACE === 'admin')) {
    const port = SURFACE === 'cms' ? 3001 : 3002;
    const { hostname, protocol, pathname, search } = request.nextUrl;
    callback = `${protocol}//${hostname}:${port}${pathname}${search}`;
    return redirectTo(3000, '/login', request, `callbackUrl=${encodeURIComponent(callback)}`);
  }
  const login = new URL('/login', request.url);
  login.searchParams.set('callbackUrl', callback);
  return NextResponse.redirect(login);
}

/** Split-dev surface routing and NextAuth protection for staff + member panels. */
export async function runEsbRouteGuard(
  request: NextRequest,
): Promise<NextResponse | undefined> {
  const { pathname } = request.nextUrl;

  if (pathname === '/editor' || pathname.startsWith('/editor/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/editor/, '/cms');
    return NextResponse.redirect(url);
  }
  const session = await getMiddlewareSession(request);
  const role = getSessionRole(session);
  const signedIn = hasSessionRole(session);
  const staffSignedIn = signedIn && isStaffRole(role);
  const memberSignedIn = signedIn && role === 'SUBSCRIBER';

  if (
    USE_SPLIT_SURFACES &&
    SURFACE === 'public' &&
    (matchesPrefix(pathname, CMS_PATHS) ||
      matchesPrefix(pathname, EDITOR_ALIASES) ||
      matchesPrefix(pathname, ADMIN_PATHS))
  ) {
    const port = matchesPrefix(pathname, CMS_PATHS) ? 3001 : 3002;
    return redirectTo(port, pathname, request, request.nextUrl.search);
  }
  if (
    USE_SPLIT_SURFACES &&
    (SURFACE === 'cms' || SURFACE === 'admin') &&
    (pathname === '/login' || pathname.startsWith('/members'))
  ) {
    return redirectTo(3000, pathname, request, request.nextUrl.search);
  }
  if (
    USE_SPLIT_SURFACES &&
    (SURFACE === 'cms' || SURFACE === 'admin') &&
    isPublicSitePath(pathname) &&
    !pathname.startsWith('/_next')
  ) {
    return redirectTo(3000, pathname, request, request.nextUrl.search);
  }
  if (USE_SPLIT_SURFACES && SURFACE === 'cms' && !matchesPrefix(pathname, CMS_PATHS) && !matchesPrefix(pathname, SHARED_PATHS)) {
    if (matchesPrefix(pathname, ADMIN_PATHS)) return redirectTo(3002, pathname, request, request.nextUrl.search);
    if (!pathname.startsWith('/_next')) return redirectTo(3001, '/cms', request);
  }
  if (USE_SPLIT_SURFACES && SURFACE === 'admin' && !matchesPrefix(pathname, ADMIN_PATHS) && !matchesPrefix(pathname, SHARED_PATHS)) {
    if (matchesPrefix(pathname, CMS_PATHS)) return redirectTo(3001, pathname, request, request.nextUrl.search);
    if (!pathname.startsWith('/_next')) return redirectTo(3002, '/admin', request);
  }

  const hostContext = hostContextFromRequest(
    request.nextUrl.hostname,
    request.headers.get('host') ?? request.nextUrl.host,
    request.nextUrl.protocol,
  );

  const isStaffLogin = pathname === '/login';
  const isMemberLogin = pathname === '/members/login';
  const isMemberPanel =
    pathname === '/members' ||
    (pathname.startsWith('/members/') && !isMemberLogin);

  if (isStaffLogin && staffSignedIn) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    const dest = resolvePostLoginPath(role, { callbackUrl, audience: 'staff' }, hostContext);
    const host = request.headers.get('host') ?? request.nextUrl.host;
    const target = needsAuthHandoff(dest, host) ? authContinuePath(dest) : dest;
    return NextResponse.redirect(redirectUrlForRequest(target, request.url));
  }

  if (isMemberLogin && memberSignedIn) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    const dest = resolvePostLoginPath(role, { callbackUrl, audience: 'member' }, hostContext);
    const host = request.headers.get('host') ?? request.nextUrl.host;
    const target = needsAuthHandoff(dest, host) ? authContinuePath(dest) : dest;
    return NextResponse.redirect(redirectUrlForRequest(target, request.url));
  }

  if (isMemberPanel && !memberSignedIn) {
    const login = new URL('/members/login', request.url);
    login.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(login);
  }

  if (isMemberPanel && signedIn && role !== 'SUBSCRIBER') {
    const dest = resolvePostLoginPath(role, { audience: 'staff' }, hostContext);
    return NextResponse.redirect(redirectUrlForRequest(dest, request.url));
  }

  if (matchesPrefix(pathname, ADMIN_PATHS)) {
    if (!staffSignedIn) {
      return staffLoginRedirect(request, pathname);
    }
    if (role === 'SUBSCRIBER') {
      return NextResponse.redirect(new URL('/members?notice=member-area', request.url));
    }
    if (!canAccessAdminPanel(role)) {
      return NextResponse.redirect(new URL('/cms', request.url));
    }
  }

  if (matchesPrefix(pathname, CMS_PATHS)) {
    if (!staffSignedIn) {
      return staffLoginRedirect(request, pathname);
    }
    if (role === 'SUBSCRIBER') {
      return NextResponse.redirect(new URL('/members?notice=member-area', request.url));
    }
    if (!can(role, 'article.create')) {
      return staffLoginRedirect(request, pathname);
    }
  }

  return undefined;
}