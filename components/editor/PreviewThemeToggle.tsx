'use client';

import { Moon, MoonStar, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_THEMES, type SiteTheme } from '@/lib/site-theme';

const ICONS: Record<SiteTheme, typeof Sun> = {
  midnight: MoonStar,
  dark: Moon,
  white: Sun,
};

export function PreviewThemeToggle({
  theme,
  onChange,
}: {
  theme: SiteTheme;
  onChange: (theme: SiteTheme) => void;
}) {
  return (
    <div className="cms-preview-theme-toggle" role="group" aria-label="Preview theme">
      {SITE_THEMES.map((t) => {
        const Icon = ICONS[t.id];
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            title={t.label}
            onClick={() => onChange(t.id)}
            className={cn('cms-preview-theme-toggle__btn', active && 'cms-preview-theme-toggle__btn--active')}
            aria-pressed={active}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}