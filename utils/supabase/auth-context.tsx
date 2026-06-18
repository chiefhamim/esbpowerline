'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string | null;
};

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  data: { user: AuthUser } | null;
  status: AuthStatus;
  update: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  data: null,
  status: 'loading',
  update: async () => {},
});

/**
 * Supabase auth provider — drop-in replacement for NextAuth's SessionProvider.
 * Provides { data: { user }, status } matching the useSession() shape.
 */
export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const fetchUser = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: supaUser },
    } = await supabase.auth.getUser();

    if (!supaUser) {
      setUser(null);
      setStatus('unauthenticated');
      return;
    }

    // Fetch role from profiles table (created by Supabase trigger)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url')
      .eq('id', supaUser.id)
      .single();

    // Fall back to user_metadata if profile table isn't populated yet
    const resolvedUser: AuthUser = {
      id: supaUser.id,
      email: supaUser.email ?? '',
      name: profile?.full_name ?? supaUser.user_metadata?.name ?? supaUser.email ?? '',
      role: profile?.role ?? supaUser.user_metadata?.role ?? 'MEMBER',
      image: profile?.avatar_url ?? null,
    };

    setUser(resolvedUser);
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    fetchUser();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setStatus('unauthenticated');
      } else {
        fetchUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUser]);

  const value: AuthContextValue = {
    data: user ? { user } : null,
    status,
    update: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Drop-in replacement for next-auth/react's useSession().
 * Returns { data: { user }, status, update } with the same shape.
 */
export function useSession() {
  return useContext(AuthContext);
}
