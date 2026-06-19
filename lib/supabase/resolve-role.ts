import type { User } from '@supabase/supabase-js';
import type { Role } from '@/lib/constants';

const VALID_ROLES = new Set<string>([
  'SUPER_ADMIN',
  'ADMIN',
  'EDITOR',
  'AUTHOR',
  'CONTRIBUTOR',
  'SUBSCRIBER',
]);

function normalizeRole(value: unknown): Role | null {
  if (typeof value !== 'string') return null;
  const role = value.trim().toUpperCase();
  return VALID_ROLES.has(role) ? (role as Role) : null;
}

/** Resolve app role from Supabase Auth user metadata or profiles row. */
export function resolveRoleFromSupabaseUser(
  user:
    | Pick<User, 'user_metadata' | 'app_metadata'>
    | { user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> }
    | null
    | undefined,
  profileRole?: string | null,
): Role | null {
  const fromProfile = normalizeRole(profileRole);
  if (fromProfile) return fromProfile;

  return (
    normalizeRole(user?.user_metadata?.role) ??
    normalizeRole(user?.app_metadata?.role) ??
    null
  );
}