'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserRound } from 'lucide-react';
import { ModernTooltip } from '@/components/shared/ModernTooltip';
import type { Role } from '@/lib/constants';

function staffHome(role: Role | undefined) {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return '/admin';
  if (role === 'EDITOR' || role === 'AUTHOR' || role === 'CONTRIBUTOR') return '/cms';
  return '/login';
}

export function MemberAuthButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;
  const isMember = role === 'SUBSCRIBER';
  const signedIn = status === 'authenticated' && !!session?.user;
  const isMemberArea = pathname.startsWith('/members');

  const href = signedIn
    ? isMember
      ? '/members'
      : staffHome(role)
    : '/members/login';

  const initial = session?.user?.name?.charAt(0)?.toUpperCase() ?? 'M';

  if (status === 'loading') {
    return (
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border/50 bg-muted/40"
        aria-hidden
      />
    );
  }

  return (
    <ModernTooltip
      label={signedIn ? (isMember ? 'My library' : 'Staff workspace') : 'Member login'}
      hint={
        signedIn
          ? isMember
            ? 'Saved articles, magazine, downloads & comments.'
            : 'Open your editorial or admin workspace.'
          : 'Save articles, magazine & data downloads; comment and access in-depth analysis.'
      }
      fast
    >
      <Link
        href={href}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border/50 bg-muted/40 text-foreground/80 transition-colors hover:bg-muted/30 hover:text-foreground ${
          isMemberArea && isMember ? 'border-emerald-500/40 text-emerald-500' : ''
        }`}
        aria-label={signedIn ? (isMember ? 'My member library' : 'Staff workspace') : 'Member login'}
      >
        {signedIn ? (
          <span className="text-xs font-semibold">{initial}</span>
        ) : (
          <UserRound className="h-4 w-4" strokeWidth={2} />
        )}
      </Link>
    </ModernTooltip>
  );
}