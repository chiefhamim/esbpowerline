import 'server-only';

import { auth as nextAuth } from '@/lib/auth';
import { isMemberRole } from '@/lib/auth-routing';
import type { Role } from '@/lib/constants';

export type MemberSessionUser = {
  id: string;
  email: string;
  name: string;
  role: 'SUBSCRIBER';
};

export type AppMemberSession = {
  user: MemberSessionUser;
};

/** Active member session from NextAuth (SUBSCRIBER role). */
export async function getMemberSession(): Promise<AppMemberSession | null> {
  const session = await nextAuth();
  if (!session?.user?.id || !isMemberRole(session.user.role as Role)) return null;

  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? '',
      name: session.user.name ?? 'Member',
      role: 'SUBSCRIBER',
    },
  };
}