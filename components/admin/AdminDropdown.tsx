'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function useAdminDropdown() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  return { open, setOpen, close, toggle };
}

export function AdminDropdownBackdrop({ onClose }: { onClose: () => void }) {
  return <div className="admin-dropdown-backdrop" onClick={onClose} aria-hidden="true" />;
}

export function AdminDropdownPanel({
  children,
  className,
  align = 'right',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
}) {
  return (
    <div
      className={cn(
        'admin-dropdown-panel',
        align === 'right' ? 'admin-dropdown-panel--right' : 'admin-dropdown-panel--left',
        className,
      )}
      role="menu"
    >
      {children}
    </div>
  );
}

export function AdminDropdownTrigger({
  children,
  open,
  onClick,
  className,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  open?: boolean;
  onClick: () => void;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-haspopup="menu"
      aria-label={ariaLabel}
      className={cn('admin-dropdown-trigger', open && 'admin-dropdown-trigger--open', className)}
    >
      {children}
    </button>
  );
}