'use client';

import Link from 'next/link';
import { ArrowUpRight, BookOpenCheck, LogIn } from 'lucide-react';
import { useMemberAccess } from '@/hooks/useMemberAccess';

export function MemberFooterCard() {
  const access = useMemberAccess();

  if (access.state === 'loading') {
    return (
      <div className="card flex flex-col gap-4 p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">Loading member access…</p>
      </div>
    );
  }

  if (access.state === 'guest') {
    return (
      <div className="card flex flex-col gap-4 p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-foreground/85">
          Sign in to save articles and magazine issues, download data packages, join discussions, and unlock
          in-depth analysis across the power sector.
        </p>
        <Link
          href="/members/login"
          className="btn btn-primary inline-flex w-fit items-center gap-1.5 text-sm"
        >
          Member login
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <p className="text-xs leading-relaxed text-foreground/60">
          Editorial staff and administrators use the same sign-in with assigned roles.
        </p>
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-4 p-5 sm:p-6">
      <p className="text-sm leading-relaxed text-foreground/85">
        {access.isMember ? (
          <>
            You&apos;re signed in as <span className="font-medium text-foreground">{access.userName}</span>.
            Open your library for saved articles, magazine archive, downloads, and comments.
          </>
        ) : (
          <>
            Signed in as <span className="font-medium text-foreground">{access.userName}</span> (staff).
            Member library is for subscriber accounts — use your staff workspace for editorial tools.
          </>
        )}
      </p>
      <Link
        href={access.href}
        className="btn btn-primary inline-flex w-fit items-center gap-1.5 text-sm"
      >
        <BookOpenCheck className="h-4 w-4" />
        {access.label}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
      {access.isMember ? (
        <p className="text-xs leading-relaxed text-foreground/60">
          Manage your account from the library → Account section.
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-foreground/60">
          <Link href="/login" className="text-primary hover:underline">Staff sign in</Link> for CMS and admin.
        </p>
      )}
    </div>
  );
}