'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Moon, Sun, Sparkles, ChevronDown, Check } from 'lucide-react';
import {
  AdminDropdownBackdrop,
  AdminDropdownPanel,
  AdminDropdownTrigger,
  useAdminDropdown,
} from '@/components/admin/AdminDropdown';

type AdminTheme = 'midnight' | 'dark' | 'white';

const THEMES: { id: AdminTheme; label: string; icon: typeof Moon; swatch: string }[] = [
  { id: 'midnight', label: 'Midnight', icon: Sparkles, swatch: '#04070f' },
  { id: 'dark', label: 'Dark', icon: Moon, swatch: '#09090b' },
  { id: 'white', label: 'White', icon: Sun, swatch: '#f8fafc' },
];

export function AdminThemeToggle() {
  const { open, toggle, close } = useAdminDropdown();
  const [theme, setTheme] = useState<AdminTheme>('midnight');

  useEffect(() => {
    const saved = (localStorage.getItem('admin-theme') as AdminTheme) || 'midnight';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (next: AdminTheme) => {
    const root = document.documentElement;
    root.classList.remove('theme-midnight', 'theme-dark', 'theme-white');
    root.classList.add(`theme-${next}`);
    localStorage.setItem('admin-theme', next);
  };

  const changeTheme = (next: AdminTheme) => {
    setTheme(next);
    applyTheme(next);
    close();
  };

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  const ActiveIcon = active.icon;

  return (
    <div className="relative shrink-0">
      <AdminDropdownTrigger open={open} onClick={toggle} aria-label="Change admin theme">
        <ActiveIcon className="h-3.5 w-3.5 shrink-0" />
        <span className="admin-dropdown-trigger-label hidden sm:inline">{active.label}</span>
        <ChevronDown className={cn('h-3 w-3 shrink-0 opacity-60 transition-transform duration-150', open && 'rotate-180')} />
      </AdminDropdownTrigger>

      {open && (
        <>
          <AdminDropdownBackdrop onClose={close} />
          <AdminDropdownPanel className="admin-theme-menu">
            <div className="admin-dropdown-menu-title">Appearance</div>
            {THEMES.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => changeTheme(t.id)}
                  className={cn('admin-theme-option', isActive && 'admin-theme-option--active')}
                >
                  <span className="admin-theme-swatch" style={{ background: t.swatch }} />
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="admin-theme-option-label">{t.label}</span>
                  {isActive && <Check className="h-3 w-3 shrink-0 ml-auto opacity-70" />}
                </button>
              );
            })}
          </AdminDropdownPanel>
        </>
      )}
    </div>
  );
}