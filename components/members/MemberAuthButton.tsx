'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRound } from 'lucide-react';
import { ModernTooltip } from '@/components/shared/ModernTooltip';
import { useMemberAccess } from '@/hooks/useMemberAccess';
import { cn } from '@/lib/utils';

export function MemberAuthButton() {
  const pathname = usePathname();
  const access = useMemberAccess();
  const isMemberArea = pathname.startsWith('/members');

  if (access.state === 'loading') {
    return (
      <span
        className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-xl border border-border/50 bg-muted/40 px-2"
        aria-hidden
      />
    );
  }

  return (
    <ModernTooltip label={access.label} hint={access.hint} fast>
      <Link
        href={access.href}
        className={cn(
          'inline-flex h-8 items-center justify-center gap-1.5 rounded-xl border border-border/50 bg-muted/40 text-foreground/75 transition-colors hover:bg-muted/60 hover:text-foreground',
          access.signedIn ? 'px-2.5 min-w-[2rem]' : 'w-8',
          isMemberArea && access.isMember && 'text-foreground font-medium',
        )}
        aria-label={access.signedIn ? `${access.label} — ${access.userName}` : access.label}
      >
        {access.signedIn ? (
          <>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/8 text-[10px] font-semibold text-foreground/80">
              {access.initial}
            </span>
            <span className="hidden sm:inline text-xs font-medium max-w-[5.5rem] truncate">
              {access.shortLabel}
            </span>
          </>
        ) : (
          <UserRound className="h-4 w-4" strokeWidth={2} />
        )}
      </Link>
    </ModernTooltip>
  );
}