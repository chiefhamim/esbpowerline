'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const forbidden = error.message?.toLowerCase().includes('forbidden');

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {forbidden ? 'Access restricted' : 'Something went wrong'}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {forbidden
          ? 'Your role does not have permission for this action.'
          : 'An unexpected error occurred in the admin panel. Try again or return to the dashboard.'}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" onClick={reset}>
          Try again
        </Button>
        <Link href="/admin" className="btn btn-outline">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}