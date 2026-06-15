'use client';

import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Moon, MoonStar, Sun } from 'lucide-react';
import {
  applySiteTheme,
  getSavedSiteTheme,
  SITE_THEMES,
  SITE_THEME_PREVIEW,
  type SiteTheme,
  type SiteThemePreview,
} from '@/lib/site-theme';
import { cn } from '@/lib/utils';

type SiteThemeToggleProps = {
  className?: string;
};

const THEME_ICONS: Record<SiteTheme, { icon: LucideIcon; iconClass: string }> = {
  midnight: { icon: MoonStar, iconClass: 'text-sky-400' },
  dark: { icon: Moon, iconClass: 'text-zinc-400' },
  white: { icon: Sun, iconClass: 'text-amber-500' },
};

function ThemePreview({ label, preview }: { label: string; preview: SiteThemePreview }) {
  return (
    <div
      className="site-theme-toggle__preview"
      style={{
        backgroundColor: preview.background,
        borderColor: preview.border,
        color: preview.foreground,
      }}
    >
      {label}
    </div>
  );
}

const TIP_DISMISS_MS = 2000;

export function SiteThemeToggle({ className = '' }: SiteThemeToggleProps) {
  const [theme, setTheme] = useState<SiteTheme>('midnight');
  const [openTip, setOpenTip] = useState<SiteTheme | null>(null);
  const lockedTipRef = useRef<SiteTheme | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = getSavedSiteTheme();
    setTheme(saved);
    applySiteTheme(saved);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  function clearTipLock() {
    lockedTipRef.current = null;
    setOpenTip(null);
    hideTimerRef.current = null;
  }

  function scheduleTipDismiss(tipId: SiteTheme) {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    lockedTipRef.current = tipId;
    setOpenTip(tipId);
    hideTimerRef.current = setTimeout(clearTipLock, TIP_DISMISS_MS);
  }

  function showTip(tipId: SiteTheme) {
    if (lockedTipRef.current) return;
    setOpenTip(tipId);
  }

  function hideTip() {
    if (lockedTipRef.current) return;
    setOpenTip(null);
  }

  function changeTheme(next: SiteTheme, button: HTMLButtonElement) {
    setTheme(next);
    applySiteTheme(next);
    button.blur();
    scheduleTipDismiss(next);
  }

  return (
    <div className={cn('site-theme-toggle', className)}>
      <div className="site-theme-toggle__swatches">
        {SITE_THEMES.map((t) => {
          const { icon: Icon, iconClass } = THEME_ICONS[t.id];
          const isActive = theme === t.id;
          const preview = SITE_THEME_PREVIEW[t.id];

          return (
            <div
              key={t.id}
              className="site-theme-toggle__item relative"
              onMouseEnter={() => showTip(t.id)}
              onMouseLeave={hideTip}
            >
              <button
                type="button"
                onClick={(e) => changeTheme(t.id, e.currentTarget)}
                onFocus={() => showTip(t.id)}
                onBlur={hideTip}
                className="site-theme-toggle__btn"
                aria-label={`Switch to ${t.label} theme`}
                aria-pressed={isActive}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-primary' : iconClass,
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </button>
              <div
                className={cn(
                  'site-theme-toggle__flyout',
                  openTip === t.id && 'site-theme-toggle__flyout--visible',
                )}
                aria-hidden={openTip !== t.id}
              >
                <div
                  className="site-theme-toggle__tip"
                  style={
                    {
                      '--theme-preview-bg': preview.background,
                      '--theme-preview-border': preview.border,
                    } as React.CSSProperties
                  }
                >
                  <div className="site-theme-toggle__flyout-arrow" aria-hidden />
                  <ThemePreview label={t.label} preview={preview} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}