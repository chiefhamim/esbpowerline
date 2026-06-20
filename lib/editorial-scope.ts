import { can, type Role } from '@/lib/constants';

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export type EditorialScopeUser = {
  id: string;
  role: Role;
};

/** Restrict editorial queries to own content unless reviewer/admin. */
export function resolveEditorialAuthorScope(
  user: EditorialScopeUser,
  requestedAuthorId?: string,
): string | undefined {
  if (can(user.role, 'article.review')) {
    return requestedAuthorId;
  }
  if (!can(user.role, 'article.create')) {
    throw new ForbiddenError();
  }
  if (requestedAuthorId && requestedAuthorId !== user.id) {
    throw new ForbiddenError();
  }
  return user.id;
}