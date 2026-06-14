'use client';

import { useEffect, useState } from 'react';

export function usePublicSiteOrigin(): string {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    const host = window.location.host;
    const isLocal =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    setOrigin(
      isLocal
        ? 'http://localhost:3000'
        : `${window.location.protocol}//${host.replace(/^(cms\.|admin\.)/, '')}`,
    );
  }, []);

  return origin;
}

export function usePublicArticleUrl(slug: string): string {
  const origin = usePublicSiteOrigin();
  return origin ? `${origin}/articles/${slug}` : `/articles/${slug}`;
}