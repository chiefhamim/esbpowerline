'use client';

import { useMemo, type CSSProperties } from 'react';
import { AdminSelectMenu } from '@/components/admin/AdminSelectMenu';
import { categoryColorVars, getCategoryAccentColor } from '@/lib/category-icons';
import type { PublicCategory } from '@/lib/category-types';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

type CategoryMeta = Pick<PublicCategory, 'name' | 'color' | 'icon' | 'iconImageUrl'>;

export function CmsCategorySelect({
  value,
  onChange,
  categories = [],
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  categories?: CategoryMeta[];
  className?: string;
}) {
  const metaByName = useMemo(() => {
    const map = new Map<string, CategoryMeta>();
    const list = categories.length
      ? categories
      : CATEGORIES.map((name) => ({ name, color: null, icon: null, iconImageUrl: null }));
    for (const c of list) map.set(c.name, c);
    return map;
  }, [categories]);

  const selectedMeta = metaByName.get(value);
  const accent = getCategoryAccentColor(value, selectedMeta?.color);

  const options = useMemo(
    () =>
      [...metaByName.values()].map((c) => ({
        value: c.name,
        label: c.name,
        dot: getCategoryAccentColor(c.name, c.color),
        accent: getCategoryAccentColor(c.name, c.color),
      })),
    [metaByName],
  );

  return (
    <div
      className={cn('cms-form-select cms-category-select', className)}
      style={{
        ...categoryColorVars(selectedMeta?.color),
        '--cat-accent': accent,
      } as CSSProperties}
    >
      <AdminSelectMenu
        value={value}
        onChange={onChange}
        options={options}
        placeholder="Category"
        menuTitle="Sector category"
        menuClassName="admin-select-menu--category"
        optionClassName="admin-select-option--category"
        minWidth="100%"
        className="w-full"
        portal
      />
    </div>
  );
}