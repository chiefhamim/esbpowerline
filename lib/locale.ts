export type SiteLocale = 'en' | 'bn';

export const SITE_LOCALE_STORAGE_KEY = 'site-locale';

export const SITE_LOCALES: { id: SiteLocale; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'bn', label: 'বাংলা', short: 'BN' },
];

const VALID_LOCALES = new Set<SiteLocale>(SITE_LOCALES.map((l) => l.id));

export function isSiteLocale(value: string | null | undefined): value is SiteLocale {
  return !!value && VALID_LOCALES.has(value as SiteLocale);
}

export function parseSiteLocale(value: string | null | undefined): SiteLocale {
  return isSiteLocale(value) ? value : 'en';
}

function persistLocaleCookie(locale: SiteLocale) {
  if (typeof document === 'undefined') return;
  document.cookie = `${SITE_LOCALE_STORAGE_KEY}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function applySiteLocale(locale: SiteLocale) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.lang = locale;
  root.dataset.siteLocale = locale;
  root.classList.toggle('locale-bn', locale === 'bn');
  localStorage.setItem(SITE_LOCALE_STORAGE_KEY, locale);
  persistLocaleCookie(locale);
}

/** Blocking head script — sets lang before React hydrates (mirrors site-theme init). */
export const SITE_LOCALE_INIT_SCRIPT = `(function(){try{var k='${SITE_LOCALE_STORAGE_KEY}';var l=localStorage.getItem(k);if(l!=='bn'&&l!=='en')l='en';var r=document.documentElement;r.lang=l;r.dataset.siteLocale=l;r.classList.toggle('locale-bn',l==='bn');localStorage.setItem(k,l);document.cookie=k+'='+l+';path=/;max-age=31536000;SameSite=Lax';}catch(e){}})();`;

export function getSavedSiteLocale(): SiteLocale {
  if (typeof window === 'undefined') return 'en';
  return parseSiteLocale(localStorage.getItem(SITE_LOCALE_STORAGE_KEY));
}