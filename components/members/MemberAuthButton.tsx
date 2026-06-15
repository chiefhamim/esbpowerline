'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserRound } from 'lucide-react';
import { ModernTooltip } from '@/components/shared/ModernTooltip';

export function MemberAuthButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const signedIn = status === 'authenticated' && !!session?.user;
  const isMemberArea = pathname.startsWith('/members');
  const href = signedIn ? '/members' : '/members/login';
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
      label={signedIn ? 'My library' : 'Member login'}
      hint={
        signedIn
          ? 'Saved articles, magazine, downloads & comments.'
          : 'Save articles, magazine & data downloads; comment and access in-depth analysis.'
      }
      fast
    >
      <Link
        href={href}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border/50 bg-muted/40 text-foreground/80 transition-colors hover:bg-muted/30 hover:text-foreground ${
          isMemberArea ? 'border-emerald-500/40 text-emerald-500' : ''
        }`}
        aria-label={signedIn ? 'My member library' : 'Member login'}
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