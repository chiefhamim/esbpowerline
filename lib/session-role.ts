import type { AuthSession } from '@/lib/auth';
import type { Role } from '@/lib/constants';

type AuthLike = AuthSession | null | undefined;

export function getSessionRole(session: AuthLike): Role | undefined {
  const role = session?.user?.role;
  return typeof role === 'string' ? (role as Role) : undefined;
}

export function hasSessionRole(session: AuthLike): session is NonNullable<AuthSession> {
  return getSessionRole(session) !== undefined;
}