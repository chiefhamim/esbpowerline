import type { Role } from '@/lib/constants';
import { can } from '@/lib/constants';

/** Minimum permission required to show each admin nav destination */
export const ADMIN_NAV_PERMISSIONS: Record<string, string> = {
  '/admin': 'user.view',
  '/admin/analytics': 'analytics.view_all',
  '/admin/articles': 'user.view',
  '/admin/categories': 'category.manage',
  '/admin/tags': 'user.view',
  '/admin/magazine': 'user.view',
  '/admin/media': 'user.view',
  '/admin/users': 'user.view',
  '/admin/comments': 'comment.moderate_any',
  '/admin/settings': 'settings.view',
  '/admin/logs': 'logs.view',
};

export function canAccessAdminRoute(role: Role | undefined, href: string): boolean {
  const permission = ADMIN_NAV_PERMISSIONS[href];
  if (!permission) return Boolean(role);
  return can(role, permission);
}