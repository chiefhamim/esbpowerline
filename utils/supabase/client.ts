'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from '@/utils/supabase/env';

/** Browser client — use in Client Components only. */
export function createClient() {
  const env = getSupabaseEnv();
  if (!env.isConfigured) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      }
    } as any;
  }
  return createBrowserClient(env.url, env.publishableKey);
}