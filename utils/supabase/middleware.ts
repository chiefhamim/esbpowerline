import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseEnv } from '@/utils/supabase/env';

export async function updateSession(request: NextRequest) {
  const fallback = NextResponse.next({ request });

  try {
    const { url, anonKey, isConfigured } = getSupabaseEnv();
    if (!isConfigured) {
      return { response: fallback, supabase: null, user: null };
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { response: supabaseResponse, supabase, user };
  } catch {
    return { response: fallback, supabase: null, user: null };
  }
}