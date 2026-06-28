import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import {
  canAccessPath,
  roleHomePath,
  resolveWorkspaceUrl,
  hostContextFromHeaders,
} from '@/lib/auth-routing';
import { isCronAuthorized } from '@/lib/api/cron-auth';
import { isProxyProtectedApi } from '@/lib/api/protected-routes';
import { resolveEdgeSession } from '@/lib/supabase/edge-session-gate';
import { can, type Role } from '@/lib/constants';

function apiRoleAllowed(pathname: string, role: Role): boolean {
  if (pathname === '/api/members/grid-export' || pathname.startsWith('/api/members/grid-export/')) {
    return role === 'SUBSCRIBER';
  }
  if (pathname === '/api/analytics' || pathname.startsWith('/api/analytics/')) {
    return can(role, 'analytics.view_all');
  }
  if (pathname === '/api/upload' || pathname.startsWith('/api/upload/')) {
    return can(role, 'media.upload');
  }
  return false;
}

function unauthorizedApi(response: NextResponse): NextResponse {
  const denied = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  response.cookies.getAll().forEach((cookie) => {
    denied.cookies.set(cookie.name, cookie.value);
  });
  return denied;
}

function redirectWithCookies(
  request: NextRequest,
  response: NextResponse,
  destination: string,
): NextResponse {
  const hostContext = hostContextFromHeaders(
    request.headers.get('host'),
    request.headers.get('x-forwarded-proto'),
  );
  const resolvedUrl = resolveWorkspaceUrl(destination, hostContext);
  const finalUrl = /^https?:\/\//i.test(resolvedUrl)
    ? new URL(resolvedUrl)
    : new URL(resolvedUrl, request.url);

  const redirectResponse = NextResponse.redirect(finalUrl);
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value);
  });
  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Strict Bot & Headless Scraper Prevention
  const BLOCKED_BOT_REGEX = /ahrefsbot|semrushbot|mj12bot|dotbot|rogerbot|exabot|screamingfrog|petalbot|coccocbot|yandexbot|baiduspider|sogou|adsbot-google|amazonbot|claude-web-crawler|claudebot|gptbot|chatgpt-user|perplexitybot|coherebot|blexbot|bytespider|python-requests|node-fetch|got|axios|urllib|curl|wget|headless|phantomjs|selenium|playwright|puppeteer/i;

  if (!userAgent || userAgent.trim() === '' || BLOCKED_BOT_REGEX.test(userAgent)) {
    return new NextResponse('Access Denied: Request blocked by security policy.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const { response, supabase, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  if (isProxyProtectedApi(pathname)) {
    if (isCronAuthorized(request)) return response;

    const { active, role } = await resolveEdgeSession(user, supabase);
    if (!active || !role || !apiRoleAllowed(pathname, role)) {
      return unauthorizedApi(response);
    }

    return response;
  }

  const { active, role } = await resolveEdgeSession(user, supabase);
  const effectiveRole = active ? (role ?? undefined) : undefined;

  if (!canAccessPath(effectiveRole, pathname)) {
    let destination = '/login';
    if (!effectiveRole) {
      if (pathname.startsWith('/members')) destination = '/members/login';
    } else {
      destination = roleHomePath(effectiveRole);
    }
    return redirectWithCookies(request, response, destination);
  }

  return response;
}

// Intercept all routes except static files, public assets, and standard SEO configs to run bot filters
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|api/cron).*)',
  ],
};