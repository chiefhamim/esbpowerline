'use client';

import { useEffect, useRef } from 'react';

/** Fire-and-forget qualified pageview — deduped server-side per visitor per 24h. */
export function ArticleViewTracker({ articleId }: { articleId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !articleId) return;
    sent.current = true;
    void fetch(`/api/articles/${articleId}/view`, {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
    }).catch(() => undefined);
  }, [articleId]);

  return null;
}