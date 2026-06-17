import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '@/lib/supabase/env';

export type SupabaseHealthResult = {
  ok: boolean;
  projectUrl: string;
  authHealth?: { name?: string; version?: string };
  sessionCheck: 'ok' | 'error';
  serviceRole: 'configured' | 'missing' | 'ok' | 'error';
  error?: string;
};

export async function checkSupabaseHealth(): Promise<SupabaseHealthResult> {
  const { url, anonKey, serviceRoleKey } = getSupabaseEnv();
  const result: SupabaseHealthResult = {
    ok: false,
    projectUrl: url,
    sessionCheck: 'error',
    serviceRole: serviceRoleKey ? 'configured' : 'missing',
  };

  try {
    const anonClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const adminClient = serviceRoleKey
      ? createClient(url, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;

    const fetchAuthHealth = async () => {
      const res = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: anonKey },
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Auth health failed (${res.status})`);
      }
      return (await res.json()) as { name?: string; version?: string };
    };

    const [authHealthData, sessionResult, adminResult] = await Promise.all([
      fetchAuthHealth(),
      anonClient.auth.getSession(),
      adminClient
        ? adminClient.auth.admin.listUsers({ page: 1, perPage: 1 })
        : Promise.resolve({ data: { users: [] }, error: null }),
    ]);

    result.authHealth = authHealthData;

    if (sessionResult.error) {
      result.error = sessionResult.error.message;
      return result;
    }
    result.sessionCheck = 'ok';

    if (adminClient) {
      result.serviceRole = adminResult.error ? 'error' : 'ok';
      if (adminResult.error) {
        result.error = adminResult.error.message;
        return result;
      }
    }

    result.ok = true;
    return result;
  } catch (err) {
    result.error = err instanceof Error ? err.message : 'Unknown Supabase error';
    return result;
  }
}