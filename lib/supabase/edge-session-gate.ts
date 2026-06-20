import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Role } from '@/lib/constants';
import { resolveRoleFromSupabaseUser } from '@/lib/supabase/resolve-role';

const INACTIVE_STATUSES = new Set(['SUSPENDED', 'PENDING']);

function metadataStatus(user: User): string | undefined {
  const value = user.user_metadata?.status;
  return typeof value === 'string' ? value : undefined;
}

type ProfileGateRow = { role: string | null; status?: string | null };

async function loadProfileRow(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileGateRow | null> {
  const withStatus = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', userId)
    .maybeSingle();

  if (!withStatus.error) {
    return withStatus.data as ProfileGateRow | null;
  }

  const roleOnly = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (roleOnly.error) return null;
  return roleOnly.data as ProfileGateRow | null;
}

/**
 * Edge-safe session gate for proxy.ts — profiles + app_metadata only (no Prisma).
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

  const profile = await loadProfileRow(supabase, user.id);

  if (profile?.status && INACTIVE_STATUSES.has(profile.status)) {
    return { active: false, role: null };
  }

  const role = resolveRoleFromSupabaseUser(user, profile?.role ?? null);
  if (!role) return { active: false, role: null };

  return { active: true, role };
}