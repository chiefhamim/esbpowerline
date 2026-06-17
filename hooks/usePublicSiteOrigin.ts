'use client';

import { useEffect, useState } from 'react';

const DEFAULT_DEV_PUBLIC = 'http://localhost:3000';

export function usePublicSiteOrigin() {
  const [origin, setOrigin] = useState(DEFAULT_DEV_PUBLIC);

  useEffect(() => {
    const host = window.location.host;
    const isLocal =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    setOrigin(
      isLocal
        ? DEFAULT_DEV_PUBLIC
        : `${window.location.protocol}//${host.replace(/^(cms\.|admin\.)/, '')}`
    );
  }, []);

  return origin;
}

export function usePublicPathUrl(path: string) {
  const origin = usePublicSiteOrigin();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalized}`;
}

export function usePublicArticleUrl(slug: string) {
  return usePublicPathUrl(`/articles/${slug}`);
}