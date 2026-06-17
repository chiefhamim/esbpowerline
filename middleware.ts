import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sanitizeAuthEnv } from '@/lib/auth-env';
import { runEsbRouteGuard } from '@/lib/esb-route-guard';
import { applySupabaseCookies, updateSession } from '@/utils/supabase/middleware';

sanitizeAuthEnv();

/** NextAuth + staff handoff — skip Supabase refresh (avoids edge noise on session fetches). */
function usesNextAuthOnly(pathname: string): boolean {
  return (
    pathname.startsWith('/api/auth/') ||
    pathname === '/cms' ||
    pathname.startsWith('/cms/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/editor' ||
    pathname.startsWith('/editor/')
  );
}

/**
 * 1. Refresh Supabase session cookies where staff login/handoff needs them.
 * 2. Protect /admin, /cms via NextAuth in route guard.
 * 3. Run ESB split-surface + legacy route rules.
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseResponse = usesNextAuthOnly(pathname)
    ? NextResponse.next({ request: { headers: request.headers } })
    : (await updateSession(request)).response;

  const guarded = await runEsbRouteGuard(request);
  if (guarded) {
    return applySupabaseCookies(supabaseResponse, guarded);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};