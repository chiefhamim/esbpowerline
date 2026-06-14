'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AdminThemeToggle } from '@/components/admin/AdminThemeToggle';
import { PlatformControl } from '@/components/admin/PlatformControl';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, Users, FileText, BarChart3, Settings, ScrollText,
  Image, Tag, BookOpen, LogOut, ExternalLink, Zap, Menu, X, Shield,
  ChevronRight,
} from 'lucide-react';

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/articles', label: 'Articles', icon: FileText },
      { href: '/admin/categories', label: 'Categories', icon: Tag },
      { href: '/admin/tags', label: 'Tags', icon: Tag },
      { href: '/admin/magazine', label: 'Magazine', icon: BookOpen },
      { href: '/admin/media', label: 'Media', icon: Image },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
      { href: '/admin/logs', label: 'Activity Logs', icon: ScrollText },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/analytics': 'Analytics',
  '/admin/articles': 'Articles',
  '/admin/categories': 'Categories',
  '/admin/tags': 'Tags',
  '/admin/magazine': 'Magazine',
  '/admin/media': 'Media',
  '/admin/users': 'Users',
  '/admin/users/new': 'New User',
  '/admin/settings': 'Settings',
  '/admin/logs': 'Activity Logs',
};

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/admin/users/')) return 'Edit User';
  return 'Admin';
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [publicSiteUrl, setPublicSiteUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setPublicSiteUrl(isLocal ? 'http://localhost:3000' : `${window.location.protocol}//${host.replace(/^(cms\.|admin\.)/, '')}`);
    }
  }, []);

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn('admin-nav-item group', active && 'admin-nav-item--active')}
      >
        <span className={cn('admin-nav-icon', active && 'admin-nav-icon--active')}>
          <item.icon className="h-[14px] w-[14px]" strokeWidth={active ? 2.25 : 2} />
        </span>
        <span className="flex-1 truncate">{item.label}</span>
        {active && <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />}
      </Link>
    );
  };

  const sidebar = (
    <>
      <div className="admin-sidebar-brand">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="admin-brand-icon">
            <Zap className="h-[17px] w-[17px]" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[15px] tracking-[-0.02em] leading-tight">ESB PowerLine</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="h-2.5 w-2.5 text-rose-400" />
              <span className="admin-brand-badge">Admin Console</span>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="admin-nav-group-label">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => <NavLink key={item.href} item={item} />)}
            </div>
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        {session?.user && (
          <div className="admin-user-capsule mb-3">
            <div className="admin-user-avatar">
              {(session.user.name ?? 'A').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium truncate leading-tight">{session.user.name}</div>
              <div className="admin-role-pill">{ROLES[session.user.role]?.name ?? session.user.role}</div>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Link href={publicSiteUrl} target="_blank" className="admin-footer-btn flex-1">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Public site</span>
          </Link>
          <button type="button" className="admin-footer-btn admin-footer-btn--danger" onClick={() => signOut({ callbackUrl: '/login' })}>
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="admin-shell min-h-screen flex">
      <aside className="admin-sidebar hidden md:flex w-[260px] flex-col shrink-0">
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="admin-header">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="admin-icon-btn md:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>

            <div className="hidden md:flex items-center gap-2 min-w-0">
              <span className="admin-header-crumb">Admin</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              <span className="admin-header-title truncate">{getPageTitle(pathname)}</span>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <Zap className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-semibold tracking-tight">Admin</span>
            </div>
          </div>

          <div className="admin-header-toolbar flex items-center gap-1.5 shrink-0">
            <PlatformControl />
            <AdminThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex admin-header-signout"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign out
            </Button>
          </div>
        </header>

        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
            <aside className="admin-sidebar w-[280px] h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
              {sidebar}
            </aside>
          </div>
        )}

        <main className="admin-main flex-1 overflow-auto">
          <div className="admin-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}