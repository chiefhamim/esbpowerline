'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MEMBER_NAV } from '@/lib/member-nav';

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
      <div className="container py-8 md:py-10">
        <div className="member-panel__header">
          <div className="member-panel__intro">
            <Link href="/" className="member-panel__back">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
            <h1 className="member-panel__title">Member library</h1>
            <p className="member-panel__subtitle">
              Welcome back, <span className="font-medium text-foreground">{userName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="member-panel__signout"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        <nav className="member-panel__nav" aria-label="Member sections">
          {MEMBER_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('member-panel__nav-item', active && 'member-panel__nav-item--active')}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <main className="member-panel__content">{children}</main>
      </div>
    </div>
  );
}