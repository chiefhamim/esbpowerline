'use client';

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { applySiteLocale, getSavedSiteLocale, type SiteLocale } from '@/lib/locale';
import { createTranslator, type MessageKey } from '@/lib/i18n/messages';

type LocaleContextValue = {
  locale: SiteLocale;
  setLocale: (locale: SiteLocale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readDocumentLocale(): SiteLocale {
  if (typeof document === 'undefined') return 'en';
  const fromDom = document.documentElement.dataset.siteLocale;
  if (fromDom === 'en' || fromDom === 'bn') return fromDom;
  return getSavedSiteLocale();
}

/**
 * Client locale state — initialized from the beforeInteractive script / localStorage.
 * Avoids server cookie reads so public ISR pages can stay static.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SiteLocale>('en');

  useLayoutEffect(() => {
    const saved = readDocumentLocale();
    setLocaleState(saved);
    applySiteLocale(saved);
  }, []);

  const setLocale = useCallback((next: SiteLocale) => {
    setLocaleState(next);
    applySiteLocale(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: createTranslator(locale),
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}