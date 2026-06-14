'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROLES } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, Users, FileText, BarChart3, Settings, ScrollText,
  Image, Calendar, Tag, BookOpen, LogOut, ExternalLink, Zap, Menu, X,
} from 'lucide-react';

export type NavItem = { href: string; label: string; icon: LucideIcon };

const ADMIN_NAV: NavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/articles', label: 'Content', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/tags', label: 'Tags', icon: Tag },
  { href: '/admin/magazine', label: 'Magazine', icon: BookOpen },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/logs', label: 'Activity Logs', icon: ScrollText },
];

const CMS_NAV: NavItem[] = [
  { href: '/cms', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cms/articles', label: 'My Articles', icon: FileText },
  { href: '/cms/articles/new', label: 'New Article', icon: FileText },
  { href: '/cms/media', label: 'Media Library', icon: Image },
  { href: '/cms/calendar', label: 'Calendar', icon: Calendar },
];

export function DashboardShell({
  variant,
  children,
}: {
  variant: 'admin' | 'cms';
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const nav = variant === 'admin' ? ADMIN_NAV : CMS_NAV;
  const accent = variant === 'admin' ? 'text-rose-400' : 'text-sky-400';
  const label = variant === 'admin' ? 'ADMIN' : 'CMS';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [publicSiteUrl, setPublicSiteUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        setPublicSiteUrl('http://localhost:3000');
      } else {
        const baseDomain = host.replace(/^(cms\.|admin\.)/, '');
        setPublicSiteUrl(`${window.location.protocol}//${baseDomain}`);
      }
    }
  }, []);

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = pathname === item.href || (item.href !== `/admin` && item.href !== `/cms` && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all',
          active 
            ? 'bg-primary/10 text-primary border-l-2 border-primary -ml-[1px] pl-[14px]' 
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
        )}
      >
        <item.icon className="h-4 w-4 shrink-0 opacity-90" />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Desktop Sidebar – rich, macOS-like panel (distinct for admin/cms) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/60 bg-card">
        <div className="p-6 border-b border-border/60">
          <Link href={variant === 'admin' ? '/admin' : '/cms'} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10">
              <Zap className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <div className="font-semibold tracking-[-0.01em]">ESB PowerLine</div>
              <div className={cn('text-[10px] font-semibold tracking-[1.5px] -mt-0.5', accent)}>{label}</div>
            </div>
          </Link>
        </div>

        <div className="px-3 pt-3 text-[10px] uppercase tracking-widest font-medium text-muted-foreground/70 pl-6 pb-1.5">Navigation</div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>

        {/* Rich user + quick links footer */}
        <div className="p-4 border-t border-border/60 mt-auto bg-[var(--bg-elev)]/40">
          {session?.user && (
            <div className="mb-3 px-1">
              <div className="text-sm font-medium tracking-tight truncate">{session.user.name}</div>
              <Badge variant="secondary" className="mt-1 text-[10px] font-medium">{ROLES[session.user.role]?.name ?? session.user.role}</Badge>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs">
            <Link href={publicSiteUrl} target="_blank" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-background px-3 py-2 hover:bg-muted transition">
              <ExternalLink className="h-3.5 w-3.5" /> Public site
            </Link>
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Premium header bar */}
        <header className="sticky top-0 z-40 h-14 border-b border-border/60 bg-background/95 backdrop-blur-xl flex items-center justify-between px-5 md:px-7">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="md:hidden p-2 -ml-1 rounded-xl hover:bg-muted"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="md:hidden flex items-center gap-2 font-semibold text-sm tracking-tight">
              <Zap className="h-4 w-4 text-primary" /> ESB <span className={cn('text-[10px] font-bold tracking-widest', accent)}>{label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center text-xs text-muted-foreground px-3 py-1 rounded-2xl border border-border/50 bg-muted/40">
              {variant === 'admin' ? 'Full platform control' : 'Editorial workspace'}
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </header>

        {/* Mobile drawer sidebar */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setMobileOpen(false)}>
            <div 
              className="w-72 bg-card h-full border-r p-4 flex flex-col" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b mb-3 flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div className="font-semibold">ESB PowerLine <span className={cn('text-[10px] font-bold', accent)}>{label}</span></div>
              </div>
              <nav className="space-y-0.5">
                {nav.map((item) => {
                  const active = pathname === item.href || (item.href !== `/admin` && item.href !== `/cms` && pathname.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium',
                      active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                    )}>
                      <item.icon className="h-4 w-4" /> {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto pt-6 text-xs border-t">
                <Button variant="ghost" className="w-full justify-start" onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/login' }); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </Button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 lg:p-9 overflow-auto bg-[var(--bg)]">
          {children}
        </main>
      </div>
    </div>
  );
}
