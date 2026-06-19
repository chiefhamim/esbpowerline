'use client';

import { useEffect } from 'react';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Public page error:', error);
  }, [error]);

  return (
    <div className="container container--shell py-16 md:py-24">
      <div className="mx-auto max-w-lg rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-display font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The page hit a server error while loading. This is often a missing{' '}
          <code className="text-xs">DATABASE_URL</code> in production, or a stale dev database after
          schema changes.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-[10px] text-muted-foreground/80">Ref: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          className="btn btn-primary mt-6 px-6"
        >
          Try again
        </button>
      </div>
    </div>
  );
}