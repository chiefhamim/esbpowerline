'use client';

import { useLayoutEffect } from 'react';
import { applySiteTheme, getSavedSiteTheme } from '@/lib/site-theme';

/**
 * Re-applies the saved palette after hydration.
 * The inline beforeInteractive script handles the first paint; this keeps
 * client navigations and soft reloads in sync without server cookie reads.
 */
export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    applySiteTheme(getSavedSiteTheme());
  }, []);

  return <>{children}</>;
}