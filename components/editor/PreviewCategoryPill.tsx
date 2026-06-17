'use client';

import { cn } from '@/lib/utils';
import { categoryColorVars, hasCategoryColor } from '@/lib/category-icons';

export function PreviewCategoryPill({
  category,
  color,
  className,
}: {
  category: string;
  color?: string | null;
  className?: string;
}) {
  const custom = hasCategoryColor(color);

  return (
    <span
      className={cn(
        'category-pill',
        custom && 'preview-category-pill--custom',
        className,
      )}
      style={custom ? categoryColorVars(color) : undefined}
    >
      {category}
    </span>
  );
}