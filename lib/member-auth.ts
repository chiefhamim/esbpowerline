import { auth as nextAuth } from '@/lib/auth';
import { isMemberRole, roleHomePath } from '@/lib/auth-routing';
import { getMemberSession } from '@/lib/member-session';
import type { Role } from '@/lib/constants';
import { redirect } from 'next/navigation';

export { isMemberRole, isStaffRole } from '@/lib/auth-routing';

export async function getOptionalMemberSession() {
  return getMemberSession();
}

export async function requireMemberSession(callbackPath?: string) {
  const login = callbackPath
    ? `/members/login?callbackUrl=${encodeURIComponent(callbackPath)}`
    : '/members/login';

  const session = await nextAuth();
  if (session?.user?.id) {
    const role = session.user.role as Role;
    if (isMemberRole(role)) {
      return {
        user: {
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.name ?? 'Member',
          role: 'SUBSCRIBER' as const,
        },
        expires: session.expires ?? '',
      };
    }
    if (role) {
      redirect(roleHomePath(role));
    }
  }

  redirect(login);
}

export async function requireMemberUserId() {
  const session = await requireMemberSession();
  return { userId: session.user.id, session };
}