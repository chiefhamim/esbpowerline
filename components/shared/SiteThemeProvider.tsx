'use client';

import { useLayoutEffect } from 'react';
import { applySiteTheme, getSavedSiteTheme } from '@/lib/site-theme';

/** Re-apply saved theme on every route — backup for the inline init script. */
export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    applySiteTheme(getSavedSiteTheme());
  }, []);

  return <>{children}</>;
}