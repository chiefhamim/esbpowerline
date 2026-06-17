import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseEnv } from '@/utils/supabase/env';

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function createServerClientWithCookies(cookieStore: CookieStore) {
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

  return createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component — session refresh happens in middleware.
        }
      },
    },
  });
}

/** Server Component / Server Action client — reads & writes auth cookies. */
export async function createClient(cookieStore?: CookieStore) {
  const store = cookieStore ?? (await cookies());
  return createServerClientWithCookies(store);
}