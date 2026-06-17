import type { Role } from '@/lib/constants';
import { ROLES } from '@/lib/constants';

export type AccountKind = 'member' | 'admin' | 'editor';

export function getAccountKind(role: Role | undefined): AccountKind | null {
  if (!role) return null;
  if (role === 'SUBSCRIBER') return 'member';
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return 'admin';
  return 'editor';
}

export function getAccountShortLabel(kind: AccountKind): string {
  if (kind === 'member') return 'Library';
  if (kind === 'admin') return 'Admin';
  return 'Editor';
}

export function getAccountRoleLabel(role: Role | undefined): string {
  if (!role) return 'Account';
  return ROLES[role]?.name ?? role;
}