'use client';

import { AdminSelectMenu, type AdminSelectOption } from '@/components/admin/AdminSelectMenu';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Full-width admin-style dropdown for admin form panels */
export function AdminFormSelect({
  value,
  onChange,
  options,
  icon,
  placeholder,
  menuTitle,
  menuClassName,
  className,
  hideDot = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  icon?: LucideIcon;
  placeholder?: string;
  menuTitle?: string;
  menuClassName?: string;
  className?: string;
  hideDot?: boolean;
}) {
  return (
    <div className={cn('admin-form-select', className)}>
      <AdminSelectMenu
        value={value}
        onChange={onChange}
        options={options}
        icon={icon}
        placeholder={placeholder}
        menuTitle={menuTitle}
        menuClassName={menuClassName}
        minWidth="100%"
        className="w-full"
        portal
        hideDot={hideDot}
      />
    </div>
  );
}