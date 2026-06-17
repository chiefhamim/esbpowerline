'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { DownloadGridButton } from '@/components/members/DownloadGridButton';

export function PowerGridExportControls() {
  const { status } = useSession();
  const signedIn = status === 'authenticated';

  if (status === 'loading') {
    return (
      <div className="h-8 w-28 bg-muted/20 animate-pulse rounded" />
    );
  }

  return (
    <>
      {signedIn ? (
        <DownloadGridButton />
      ) : (
        <Link href="/members/login?callbackUrl=/data-reports/power-grid" className="btn btn-secondary text-xs px-3.5 py-2">
          Member login to export
        </Link>
      )}
      {signedIn ? (
        <Link href="/members/downloads" className="text-primary hover:underline text-xs px-2 font-semibold transition-colors">
          My downloads →
        </Link>
      ) : null}
    </>
  );
}
