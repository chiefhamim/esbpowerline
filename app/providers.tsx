'use client';

import { SupabaseAuthProvider } from '@/utils/supabase/auth-context';
import { LocaleProvider } from '@/components/shared/LocaleProvider';
import { SiteThemeProvider } from '@/components/shared/SiteThemeProvider';
import type { SiteLocale } from '@/lib/locale';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const origError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Encountered a script tag') || args[0].includes('Scripts inside React components'))
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function Providers({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode;
  initialLocale?: SiteLocale;
}) {
  return (
    <SupabaseAuthProvider>
      <LocaleProvider initialLocale={initialLocale}>
        <SiteThemeProvider>{children}</SiteThemeProvider>
      </LocaleProvider>
    </SupabaseAuthProvider>
  );
}