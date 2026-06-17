import { cookies } from 'next/headers';
import { SITE_THEME_STORAGE_KEY, type SiteTheme } from '@/lib/site-theme';

const VALID: SiteTheme[] = ['midnight', 'dark', 'white'];

export function parseSiteTheme(value: string | null | undefined): SiteTheme {
  if (value && VALID.includes(value as SiteTheme)) return value as SiteTheme;
  return 'midnight';
}

/** Read persisted theme on the server so the first HTML paint matches the user palette. */
export async function getServerSiteTheme(): Promise<SiteTheme> {
  const cookieStore = await cookies();
  return parseSiteTheme(cookieStore.get(SITE_THEME_STORAGE_KEY)?.value);
}

export function siteThemeHtmlClass(theme: SiteTheme): string {
  return `theme-${theme} ${theme === 'white' ? 'light' : 'dark'}`;
}