import { ROLES, type Role } from '@/lib/constants';

/** Actors may only manage accounts strictly below their own role level. */
export function assertActorCanManageTarget(
  actorRole: Role,
  targetRole: Role,
  options?: { isSelf?: boolean },
): void {
  if (options?.isSelf) return;

  const actorLevel = ROLES[actorRole]?.level ?? 0;
  const targetLevel = ROLES[targetRole]?.level ?? 0;
  if (targetLevel >= actorLevel) {
    throw new Error('Forbidden');
  }
}