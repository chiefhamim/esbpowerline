import type { Session } from 'next-auth';
import type { Role } from '@/lib/constants';

type AuthLike = Session | null | undefined;

export function getSessionRole(session: AuthLike): Role | undefined {
  const role = session?.user?.role;
  return typeof role === 'string' ? (role as Role) : undefined;
}

export function hasSessionRole(session: AuthLike): session is Session & {
  user: NonNullable<Session['user']> & { role: Role };
} {
  return getSessionRole(session) !== undefined;
}