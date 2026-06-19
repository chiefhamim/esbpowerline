import { describe, it, expect } from 'vitest';
import { canAccessPath, sanitizeCallbackUrl } from '@/lib/auth-routing';
import { canAccessAdminRoute } from '@/lib/admin-nav';
import { can, canAccessAdminPanel, type Role } from '@/lib/constants';

const EDITOR: Role = 'EDITOR';
const ADMIN: Role = 'ADMIN';
const SUPER_ADMIN: Role = 'SUPER_ADMIN';
const SUBSCRIBER: Role = 'SUBSCRIBER';

describe('Role isolation — editor cannot access admin analytics', () => {
  it('EDITOR fails admin.access (level 60 < 80)', () => {
    expect(can(EDITOR, 'admin.access')).toBe(false);
    expect(canAccessAdminPanel(EDITOR)).toBe(false);
  });

  it('EDITOR satisfies analytics.view_all but is still blocked from /admin paths', () => {
    expect(can(EDITOR, 'analytics.view_all')).toBe(true);
    expect(canAccessPath(EDITOR, '/admin')).toBe(false);
    expect(canAccessPath(EDITOR, '/admin/analytics')).toBe(false);
    expect(canAccessAdminRoute(EDITOR, '/admin/analytics')).toBe(false);
  });

  it('EDITOR can access CMS workspace and own analytics', () => {
    expect(canAccessPath(EDITOR, '/cms')).toBe(true);
    expect(canAccessPath(EDITOR, '/cms/articles/new')).toBe(true);
    expect(canAccessPath(EDITOR, '/cms/analytics')).toBe(true);
    expect(can(EDITOR, 'analytics.view_own')).toBe(true);
  });

  it('ADMIN and SUPER_ADMIN can access admin dashboard and analytics nav', () => {
    for (const role of [ADMIN, SUPER_ADMIN] as Role[]) {
      expect(canAccessAdminPanel(role)).toBe(true);
      expect(canAccessPath(role, '/admin')).toBe(true);
      expect(canAccessPath(role, '/admin/analytics')).toBe(true);
      expect(canAccessAdminRoute(role, '/admin/analytics')).toBe(true);
      expect(can(role, 'analytics.view_all')).toBe(true);
    }
  });

  it('SUBSCRIBER is confined to /members', () => {
    expect(canAccessPath(SUBSCRIBER, '/members')).toBe(true);
    expect(canAccessPath(SUBSCRIBER, '/admin')).toBe(false);
    expect(canAccessPath(SUBSCRIBER, '/cms')).toBe(false);
  });

  it('sanitizeCallbackUrl rejects admin destinations for editor sessions', () => {
    expect(sanitizeCallbackUrl('/admin/analytics', EDITOR)).toBeNull();
    expect(sanitizeCallbackUrl('/admin', EDITOR)).toBeNull();
    expect(sanitizeCallbackUrl('/cms/articles/new', EDITOR)).toBe('/cms/articles/new');
    expect(sanitizeCallbackUrl('/admin/analytics', ADMIN)).toBe('/admin/analytics');
  });
});