'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Sparkles, ChevronDown, RefreshCw, ExternalLink, Settings,
  FileText, Pin, Star, Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { can } from '@/lib/constants';
import {
  AdminDropdownBackdrop,
  AdminDropdownPanel,
  AdminDropdownTrigger,
  useAdminDropdown,
} from '@/components/admin/AdminDropdown';
import {
  getPlatformSnapshot,
  revalidatePublicSite,
  setCarouselMode,
} from '@/lib/actions/platform';

type Snapshot = {
  published: number;
  featured: number;
  pinned: number;
  draft: number;
  settingsCount: number;
  carouselMode: 'demo' | 'managed';
};

const STAT_ITEMS = [
  { key: 'published' as const, label: 'Pub', title: 'Published articles' },
  { key: 'featured' as const, label: 'Feat', title: 'Featured articles' },
  { key: 'pinned' as const, label: 'Pin', title: 'Pinned to carousel' },
  { key: 'draft' as const, label: 'Draft', title: 'Draft articles' },
];

const EMPTY_SNAPSHOT: Snapshot = {
  published: 0,
  featured: 0,
  pinned: 0,
  draft: 0,
  settingsCount: 0,
  carouselMode: 'demo',
};

export function PlatformControl() {
  const { data: session } = useSession();
  const { open, toggle, close } = useAdminDropdown();
  const [pending, startTransition] = useTransition();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [publicSiteUrl, setPublicSiteUrl] = useState('http://localhost:3000');
  const canEditSettings = session?.user?.role ? can(session.user.role, 'settings.edit') : false;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setPublicSiteUrl(isLocal ? 'http://localhost:3000' : `${window.location.protocol}//${host.replace(/^(cms\.|admin\.)/, '')}`);
    }
  }, []);

  const loadSnapshot = useCallback(async () => {
    setLoadState('loading');
    try {
      const data = await getPlatformSnapshot();
      setSnapshot(data);
      setLoadState('ready');
    } catch {
      setSnapshot(EMPTY_SNAPSHOT);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    if (session?.user) loadSnapshot();
  }, [session?.user, loadSnapshot]);

  useEffect(() => {
    if (open && loadState === 'idle' && session?.user) loadSnapshot();
  }, [open, loadState, session?.user, loadSnapshot]);

  function handleRevalidate() {
    if (!canEditSettings) return;
    startTransition(async () => {
      try {
        const res = await revalidatePublicSite();
        toast.success(`Public site refreshed (${res.paths} routes)`);
        await loadSnapshot();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to refresh');
      }
    });
  }

  function handleCarouselMode(mode: 'demo' | 'managed') {
    if (!canEditSettings) return;
    setSnapshot((s) => (s ? { ...s, carouselMode: mode } : s));
    startTransition(async () => {
      try {
        await setCarouselMode(mode);
        toast.success(mode === 'managed' ? 'Carousel uses pinned + featured' : 'Carousel using demo content');
        await loadSnapshot();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to update');
        await loadSnapshot();
      }
    });
  }

  const stats = snapshot ?? EMPTY_SNAPSHOT;

  return (
    <div className="relative hidden lg:block shrink-0">
      <AdminDropdownTrigger open={open} onClick={toggle} aria-label="Platform control">
        <Sparkles className="h-3.5 w-3.5 text-rose-400 shrink-0" />
        <span className="admin-dropdown-trigger-label">Platform</span>
        <ChevronDown className={cn('h-3 w-3 shrink-0 opacity-60 transition-transform duration-150', open && 'rotate-180')} />
      </AdminDropdownTrigger>

      {open && (
        <>
          <AdminDropdownBackdrop onClose={close} />
          <AdminDropdownPanel className="admin-platform-menu">
            <div className="admin-platform-menu-header">Platform snapshot</div>

            {loadState === 'loading' ? (
              <div className="admin-platform-loading">
                <span className="admin-platform-spinner" />
                Loading…
              </div>
            ) : (
              <>
                {loadState === 'error' && (
                  <p className="admin-platform-hint admin-platform-hint--warn">Could not load live counts — showing defaults.</p>
                )}
                <div className="admin-platform-stats">
                  {STAT_ITEMS.map(({ key, label, title }) => (
                    <div key={key} title={title}>
                      <span>{stats[key]}</span>
                      <small>{label}</small>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="admin-platform-section-label">Homepage carousel</div>
            <div className="admin-platform-toggle-row">
              <button
                type="button"
                disabled={pending || !canEditSettings || loadState === 'loading'}
                className={cn('admin-platform-mode', stats.carouselMode === 'demo' && 'admin-platform-mode--active')}
                onClick={() => handleCarouselMode('demo')}
              >
                Demo
              </button>
              <button
                type="button"
                disabled={pending || !canEditSettings || loadState === 'loading'}
                className={cn('admin-platform-mode', stats.carouselMode === 'managed' && 'admin-platform-mode--active')}
                onClick={() => handleCarouselMode('managed')}
              >
                Managed
              </button>
            </div>
            <p className="admin-platform-hint">
              {canEditSettings
                ? 'Demo keeps the public homepage unchanged. Managed uses pinned then featured articles.'
                : 'View only — settings access required to change carousel mode.'}
            </p>

            <div className="admin-platform-divider" />

            <div className="admin-platform-actions">
              <button
                type="button"
                className="admin-platform-action"
                onClick={handleRevalidate}
                disabled={pending || !canEditSettings}
              >
                <RefreshCw className={cn('h-3.5 w-3.5 shrink-0', pending && 'animate-spin')} />
                <span>Refresh public site</span>
              </button>
              <Link href="/admin/settings" className="admin-platform-action" onClick={close}>
                <Settings className="h-3.5 w-3.5 shrink-0" />
                <span>Site settings</span>
              </Link>
              <Link href="/admin/articles" className="admin-platform-action" onClick={close}>
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>Manage content</span>
              </Link>
              <Link href={publicSiteUrl} target="_blank" className="admin-platform-action" onClick={close}>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span>View public site</span>
              </Link>
            </div>

            <div className="admin-platform-footer">
              <div className="admin-platform-footer-icons" aria-hidden="true">
                <Pin className="h-3 w-3" />
                <Star className="h-3 w-3" />
                <Layers className="h-3 w-3" />
              </div>
              <p className="admin-platform-footer-text">
                Pin, feature &amp; publish from Admin → Content
              </p>
            </div>
          </AdminDropdownPanel>
        </>
      )}
    </div>
  );
}