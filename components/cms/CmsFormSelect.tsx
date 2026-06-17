'use client';

import { AdminSelectMenu, type AdminSelectOption } from '@/components/admin/AdminSelectMenu';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Full-width admin-style dropdown for CMS editor panels */
export function CmsFormSelect({
  value,
  onChange,
  options,
  icon,
  placeholder,
  menuTitle,
  menuClassName,
  className,
  hideDot = false,
  optionsLayout = 'list',
  gridColumns = 4,
  menuWidth,
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
  optionsLayout?: 'list' | 'grid';
  gridColumns?: number;
  menuWidth?: string;
}) {
  return (
    <div className={cn('cms-form-select', className)}>
      <AdminSelectMenu
        value={value}
        onChange={onChange}
        options={options}
        icon={icon}
        placeholder={placeholder}
        menuTitle={menuTitle}
        menuClassName={menuClassName}
        minWidth="100%"
        menuWidth={menuWidth}
        className="w-full"
        portal
        hideDot={hideDot}
        optionsLayout={optionsLayout}
        gridColumns={gridColumns}
      />
    </div>
  );
}