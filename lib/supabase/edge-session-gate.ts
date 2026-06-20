import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Role } from '@/lib/constants';
import { resolveRoleFromSupabaseUser } from '@/lib/supabase/resolve-role';

const INACTIVE_STATUSES = new Set(['SUSPENDED', 'PENDING']);

function metadataStatus(user: User): string | undefined {
  const value = user.user_metadata?.status;
  return typeof value === 'string' ? value : undefined;
}

/**
 * Edge-safe session gate for proxy.ts — profiles + app_metadata only (no Prisma).
 * Profile select omits `status` until supabase/setup-profiles.sql is applied remotely.
 */
export async function resolveEdgeSession(
  user: User | null,
  supabase: SupabaseClient | null,
): Promise<{ active: boolean; role: Role | null }> {
  if (!user || !supabase) return { active: false, role: null };

  const metaStatus = metadataStatus(user);
  if (metaStatus && INACTIVE_STATUSES.has(metaStatus)) {
    return { active: false, role: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = resolveRoleFromSupabaseUser(user, profile?.role ?? null);
  if (!role) return { active: false, role: null };

  return { active: true, role };
}