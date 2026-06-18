import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

const ADMIN_ROUTES = ['/admin'];
const EDITOR_ROUTES = ['/cms', '/editor'];
const MEMBER_ROUTES = ['/members'];
const PUBLIC_ROUTES = ['/', '/articles', '/category', '/search', '/about', '/contact'];

async function getUserRole(supabase: ReturnType<typeof createServerClient>, userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role as 'ADMIN' | 'EDITOR' | 'MEMBER' | null;
}

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const needsAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const needsEditor = EDITOR_ROUTES.some((r) => pathname.startsWith(r));
  const needsMember = MEMBER_ROUTES.some((r) => pathname.startsWith(r));

  if (!needsAdmin && !needsEditor && !needsMember) return response;

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = await getUserRole(supabase, user.id);

  if (needsAdmin && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (needsEditor && role !== 'ADMIN' && role !== 'EDITOR') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};