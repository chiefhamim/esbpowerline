import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { can, canAccessAdminPanel, type Role } from '@/lib/constants';
import { isMemberRole, roleHomePath } from '@/lib/auth-routing';
import { resolveRoleFromSupabaseUser } from '@/lib/supabase/resolve-role';

const ADMIN_ROUTES = ['/admin'];
const EDITOR_ROUTES = ['/cms', '/editor'];
const MEMBER_ROUTES = ['/members'];

async function getUserRole(
  supabase: Awaited<ReturnType<typeof updateSession>>['supabase'],
  user: NonNullable<Awaited<ReturnType<typeof updateSession>>['user']>,
): Promise<Role | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  return resolveRoleFromSupabaseUser(user, profile?.role ?? null);
}

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const needsAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const needsEditor = EDITOR_ROUTES.some((r) => pathname.startsWith(r));
  const needsMember =
    MEMBER_ROUTES.some((r) => pathname.startsWith(r)) && !pathname.startsWith('/members/login');

  if (!needsAdmin && !needsEditor && !needsMember) return response;

  if (!user) {
    const loginUrl = new URL(needsMember ? '/members/login' : '/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = await getUserRole(supabase, user);

  if (needsAdmin && !canAccessAdminPanel(role ?? undefined)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (needsEditor && !can(role ?? undefined, 'article.create')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (needsMember && role && !isMemberRole(role)) {
    const destination = roleHomePath(role);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};