'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MEMBER_NAV } from '@/lib/member-nav';
import { MemberPanelNotice } from '@/components/members/MemberPanelNotice';
import { ModernTooltip } from '@/components/shared/ModernTooltip';
import { getPublicSiteUrl } from '@/lib/auth-routing';
import { signOutToPublicSite } from '@/lib/staff-sign-out';

export function MemberShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="member-panel">
      <div className="container py-6 md:py-8">
        <div className="member-panel__header">
          <div className="member-panel__intro">
            <Link href={getPublicSiteUrl()} className="member-panel__back">
              <ArrowLeft className="h-3 w-3" />
              Back to site
            </Link>
            <h1 className="member-panel__title">Library</h1>
            <p className="member-panel__subtitle">
              Signed in as <span className="font-medium text-foreground">{userName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => void signOutToPublicSite()}
            className="member-panel__signout sign-out-control"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        <Suspense fallback={null}>
          <MemberPanelNotice />
        </Suspense>

        <nav className="member-panel__nav" aria-label="Member sections">
          {MEMBER_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <ModernTooltip
                key={item.href}
                label={item.label}
                hint={item.description}
                variant="member"
                alwaysShow
                fast
                side="top"
                showDelayMs={120}
                dismissOnClick
                className="member-panel__nav-tooltip"
              >
                <Link
                  href={item.href}
                  className={cn('member-panel__nav-item', active && 'member-panel__nav-item--active')}
                >
                  <Icon className="member-panel__nav-icon shrink-0" />
                  <span className="member-panel__nav-label">{item.label}</span>
                </Link>
              </ModernTooltip>
            );
          })}
        </nav>

        <main className="member-panel__content">{children}</main>
      </div>
    </div>
  );
}