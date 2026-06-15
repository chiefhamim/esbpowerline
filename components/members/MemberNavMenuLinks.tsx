'use client';

import Link from 'next/link';
import { BookOpenCheck, LogIn, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useMemberAccess } from '@/hooks/useMemberAccess';

export function MemberNavMenuLinks() {
  const access = useMemberAccess();

  if (access.state === 'loading') {
    return <span className="block py-1.5 text-muted-foreground text-xs">Loading account…</span>;
  }

  if (access.state === 'guest') {
    return (
      <Link href="/members/login" className="flex items-center gap-2 py-1.5">
        <LogIn className="h-4 w-4" />
        Member login
      </Link>
    );
  }

  return (
    <>
      <Link href={access.href} className="flex items-center gap-2 py-1.5">
        <BookOpenCheck className="h-4 w-4" />
        {access.label}
        <span className="text-muted-foreground font-normal">({access.userName})</span>
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex w-full items-center gap-2 py-1.5 text-left text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </>
  );
}