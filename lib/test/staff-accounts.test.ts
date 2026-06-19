import { describe, it, expect } from 'vitest';
import { MASTER_ADMIN_EMAIL } from '@/lib/staff-accounts';
import { can, type Role } from '@/lib/constants';

describe('Staff accounts — master admin and editor access', () => {
  it('master admin email is the platform owner constant', () => {
    expect(MASTER_ADMIN_EMAIL).toBe('admin@esbpowerline.com');
  });

  it('EDITOR role has full CMS access', () => {
    const editor: Role = 'EDITOR';
    expect(can(editor, 'article.create')).toBe(true);
    expect(can(editor, 'article.publish')).toBe(true);
    expect(can(editor, 'admin.access')).toBe(false);
  });

  it('SUPER_ADMIN can access admin panel and create users', () => {
    const admin: Role = 'SUPER_ADMIN';
    expect(can(admin, 'admin.access')).toBe(true);
    expect(can(admin, 'user.create')).toBe(true);
    expect(can(admin, 'user.change_role')).toBe(true);
  });
});