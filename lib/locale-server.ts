import { cookies } from 'next/headers';
import { parseSiteLocale, SITE_LOCALE_STORAGE_KEY, type SiteLocale } from '@/lib/locale';

/** Read persisted locale on the server so the first HTML paint matches the user preference. */
export async function getServerSiteLocale(): Promise<SiteLocale> {
  const cookieStore = await cookies();
  return parseSiteLocale(cookieStore.get(SITE_LOCALE_STORAGE_KEY)?.value);
}