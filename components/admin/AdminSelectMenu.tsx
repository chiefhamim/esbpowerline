'use client';

import { ChevronDown, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AdminDropdownBackdrop,
  AdminDropdownPanel,
  AdminDropdownTrigger,
  useAdminDropdown,
} from '@/components/admin/AdminDropdown';

export type AdminSelectOption = {
  value: string;
  label: string;
  count?: number;
  /** CSS color for status dot */
  dot?: string;
  description?: string;
};

const STATUS_DOTS: Record<string, string> = {
  ALL: 'hsl(var(--muted-foreground))',
  PUBLISHED: 'hsl(160 84% 39%)',
  DRAFT: 'hsl(var(--muted-foreground))',
  SCHEDULED: 'hsl(38 92% 50%)',
  ARCHIVED: 'hsl(var(--muted-foreground) / 0.5)',
  TRASH: 'hsl(0 72% 51%)',
};

export function AdminSelectMenu({
  value,
  onChange,
  options,
  icon: Icon,
  placeholder = 'Select',
  menuTitle,
  className,
  minWidth = '10.5rem',
}: {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  icon?: LucideIcon;
  placeholder?: string;
  menuTitle?: string;
  className?: string;
  minWidth?: string;
}) {
  const { open, toggle, close } = useAdminDropdown();
  const selected = options.find((o) => o.value === value);
  const dotColor = selected?.dot ?? STATUS_DOTS[value] ?? STATUS_DOTS.ALL;

  return (
    <div className={cn('relative shrink-0', className)} style={{ minWidth }}>
      <AdminDropdownTrigger open={open} onClick={toggle} aria-label={placeholder}>
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />}
        <span
          className="admin-select-dot shrink-0"
          style={{ background: dotColor }}
          aria-hidden="true"
        />
        <span className="admin-select-trigger-label">
          {selected?.label ?? placeholder}
        </span>
        {selected?.count !== undefined && (
          <span className="admin-select-trigger-count">{selected.count}</span>
        )}
        <ChevronDown className={cn('h-3 w-3 shrink-0 opacity-60 transition-transform duration-150', open && 'rotate-180')} />
      </AdminDropdownTrigger>

      {open && (
        <>
          <AdminDropdownBackdrop onClose={close} />
          <AdminDropdownPanel className="admin-select-menu" align="left">
            <div className="admin-select-menu-title">{menuTitle ?? placeholder}</div>
            <div className="admin-select-options">
              {options.map((opt) => {
                const active = opt.value === value;
                const optDot = opt.dot ?? STATUS_DOTS[opt.value] ?? STATUS_DOTS.ALL;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      onChange(opt.value);
                      close();
                    }}
                    className={cn('admin-select-option', active && 'admin-select-option--active')}
                  >
                    <span className="admin-select-dot" style={{ background: optDot }} aria-hidden="true" />
                    <span className="admin-select-option-body">
                      <span className="admin-select-option-label">{opt.label}</span>
                      {opt.description && (
                        <span className="admin-select-option-desc">{opt.description}</span>
                      )}
                    </span>
                    {opt.count !== undefined && (
                      <span className="admin-select-option-count">{opt.count}</span>
                    )}
                    {active && <Check className="h-3 w-3 shrink-0 opacity-70" />}
                  </button>
                );
              })}
            </div>
          </AdminDropdownPanel>
        </>
      )}
    </div>
  );
}