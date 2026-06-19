import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase/env';

export function createServiceRoleClient(): SupabaseClient | null {
  const { url, serviceRoleKey, isConfigured } = getSupabaseEnv();
  if (!isConfigured || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}