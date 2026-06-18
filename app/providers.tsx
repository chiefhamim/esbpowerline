'use client';

import { SupabaseAuthProvider } from '@/utils/supabase/auth-context';
import { SiteThemeProvider } from '@/components/shared/SiteThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <SiteThemeProvider>{children}</SiteThemeProvider>
    </SupabaseAuthProvider>
  );
}