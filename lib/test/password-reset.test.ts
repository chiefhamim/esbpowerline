import { describe, it, expect } from 'vitest';
import {
  safeAuthRedirectPath,
  parsePasswordResetAudience,
  loginPathForAudience,
} from '@/lib/auth-redirect';
import { validateNewPassword, MIN_PASSWORD_LENGTH } from '@/lib/password-policy';

describe('auth redirect helpers', () => {
  it('allows safe relative paths', () => {
    expect(safeAuthRedirectPath('/auth/reset-password?audience=staff', '/')).toBe(
      '/auth/reset-password?audience=staff',
    );
  });

  it('blocks external and protocol-relative redirects', () => {
    expect(safeAuthRedirectPath('https://evil.test', '/fallback')).toBe('/fallback');
    expect(safeAuthRedirectPath('//evil.test', '/fallback')).toBe('/fallback');
    expect(safeAuthRedirectPath('/\\evil', '/fallback')).toBe('/fallback');
  });

  it('parses password reset audience', () => {
    expect(parsePasswordResetAudience('member')).toBe('member');
    expect(parsePasswordResetAudience('staff')).toBe('staff');
    expect(parsePasswordResetAudience(null)).toBe('staff');
  });

  it('maps audience to login paths', () => {
    expect(loginPathForAudience('member')).toBe('/members/login');
    expect(loginPathForAudience('staff')).toBe('/login');
  });
});

describe('password policy', () => {
  it('requires minimum length', () => {
    expect(validateNewPassword('')).toMatch(/required/i);
    expect(validateNewPassword('short')).toMatch(String(MIN_PASSWORD_LENGTH));
    expect(validateNewPassword('longenough')).toBeNull();
  });
});