'use client';

import { SupabaseAuthProvider } from '@/utils/supabase/auth-context';
import { LocaleProvider } from '@/components/shared/LocaleProvider';
import { SiteThemeProvider } from '@/components/shared/SiteThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <LocaleProvider>
        <SiteThemeProvider>{children}</SiteThemeProvider>
      </LocaleProvider>
    </SupabaseAuthProvider>
  );
}