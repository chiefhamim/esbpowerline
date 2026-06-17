'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { getPublicSiteUrl } from '@/lib/auth-routing';

type ResolvePublicHref = (path: string) => string;

const PublicHrefContext = createContext<ResolvePublicHref>((path) => path);

export function PublicHrefProvider({ children }: { children: ReactNode }) {
  const resolve = useMemo<ResolvePublicHref>(() => {
    if (typeof window === 'undefined') return (path) => path;
    const base = getPublicSiteUrl().replace(/\/$/, '');
    if (!base.startsWith('http')) return (path) => path;
    return (path) => `${base}${path}`;
  }, []);

  return <PublicHrefContext.Provider value={resolve}>{children}</PublicHrefContext.Provider>;
}

export function usePublicHref(path: string): string {
  const resolve = useContext(PublicHrefContext);
  return useMemo(() => resolve(path), [resolve, path]);
}