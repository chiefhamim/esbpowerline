/** Same-origin relative paths only — blocks open redirects. */
export function safeAuthRedirectPath(raw: string | null | undefined, fallback: string): string {
  if (!raw?.trim()) return fallback;
  const value = raw.trim();
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  if (value.includes('://') || value.includes('\\')) return fallback;
  return value;
}

export type PasswordResetAudience = 'staff' | 'member';

export function parsePasswordResetAudience(raw: string | null | undefined): PasswordResetAudience {
  return raw === 'member' ? 'member' : 'staff';
}

export function loginPathForAudience(audience: PasswordResetAudience): string {
  return audience === 'member' ? '/members/login' : '/login';
}

export const PASSWORD_RESET_SUCCESS_MESSAGE =
  'If an account exists for that email, we sent a password reset link. Check your inbox and spam folder.';