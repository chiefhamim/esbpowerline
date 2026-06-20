import 'server-only';

import { auth, type AuthSession } from '@/lib/auth';
import { can, type Role } from '@/lib/constants';
import { ForbiddenError } from '@/lib/editorial-scope';

export { resolveEditorialAuthorScope, ForbiddenError } from '@/lib/editorial-scope';

export class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

export type SessionUser = NonNullable<AuthSession>['user'];

export async function requireSession(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.id) throw new AuthError();
  return session.user;
}

export async function requirePermission(permission: string): Promise<SessionUser> {
  const user = await requireSession();
  if (!can(user.role, permission)) throw new ForbiddenError();
  return user;
}

/** CMS read access — editors and admins. */
export async function requireEditorialReader(): Promise<SessionUser> {
  const user = await requireSession();
  if (!can(user.role, 'article.create') && !can(user.role, 'article.review')) {
    throw new ForbiddenError();
  }
  return user;
}

/** Staff roster / collaboration — editorial or admin workspaces only. */
export async function requireStaffCollaboration(): Promise<SessionUser> {
  const user = await requireSession();
  if (!can(user.role, 'article.create') && !can(user.role, 'admin.access')) {
    throw new ForbiddenError();
  }
  return user;
}

export async function assertCanReadArticle(
  user: SessionUser,
  article: { authorId: string; status: string },
): Promise<void> {
  const isOwner = article.authorId === user.id;
  const canRead =
    (isOwner && can(user.role, 'article.edit_own')) ||
    can(user.role, 'article.edit_any') ||
    can(user.role, 'article.review');
  if (!canRead) throw new ForbiddenError();
}

/** Member panel — subscriber session only (admins use admin tools). */
export async function requireMemberPanelUser(): Promise<SessionUser> {
  const user = await requireSession();
  if (user.role !== 'SUBSCRIBER') throw new ForbiddenError();
  return user;
}

export function isStaffRole(role: Role): boolean {
  return role !== 'SUBSCRIBER';
}