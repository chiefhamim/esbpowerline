const DEFAULT_DEV_PUBLIC = 'http://localhost:3000';

/** Server-safe origin for the public site (port 3000 in local multi-surface dev). */
export function getPublicSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (configured) return configured;
  if (process.env.NODE_ENV === 'development') return DEFAULT_DEV_PUBLIC;
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? '';
}

export function publicPathUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const origin = getPublicSiteOrigin();
  return origin ? `${origin}${normalized}` : normalized;
}

export function publicArticleUrl(slug: string): string {
  return publicPathUrl(`/articles/${slug}`);
}