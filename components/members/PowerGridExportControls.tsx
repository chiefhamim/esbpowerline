'use client';

import { useSession } from '@/utils/supabase/auth-context';
import Link from 'next/link';
import { DownloadGridButton } from '@/components/members/DownloadGridButton';
import { cn } from '@/lib/utils';

export function PowerGridExportControls({ className = '' }: { className?: string }) {
  const { status } = useSession();
  const signedIn = status === 'authenticated';

  if (status === 'loading') {
    return (
      <div className="h-8 w-full bg-muted/20 animate-pulse rounded" />
    );
  }

  return (
    <div className={cn('w-full flex flex-col items-center gap-1.5', className)}>
      {signedIn ? (
        <DownloadGridButton className="w-full justify-center py-2 text-xs" />
      ) : (
        <Link
          href="/members/login?callbackUrl=/data-reports/power-grid"
          className="btn btn-secondary text-xs px-3.5 py-2 w-full justify-center text-center"
        >
          Member login to export
        </Link>
      )}
      {signedIn ? (
        <Link
          href="/members/downloads"
          className="text-primary hover:underline text-xs px-2 font-semibold transition-colors text-center"
        >
          My downloads →
        </Link>
      ) : null}
    </div>
  );
}
