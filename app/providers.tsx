'use client';

import { SessionProvider } from 'next-auth/react';
import { SiteThemeProvider } from '@/components/shared/SiteThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth" refetchOnWindowFocus={false} refetchInterval={5 * 60}>
      <SiteThemeProvider>{children}</SiteThemeProvider>
    </SessionProvider>
  );
}