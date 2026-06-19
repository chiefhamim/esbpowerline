import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from '@/utils/supabase/env';

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}