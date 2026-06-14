import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { resolveCategoryIcon } from '@/lib/category-icons';

export function CategoryIconDisplay({
  icon,
  iconImageUrl,
  name,
  className,
  imageClassName,
  style,
  size = 16,
}: {
  icon?: string | null;
  iconImageUrl?: string | null;
  name?: string;
  className?: string;
  imageClassName?: string;
  style?: CSSProperties;
  size?: number;
}) {
  if (iconImageUrl) {
    return (
      <img
        src={iconImageUrl}
        alt=""
        width={size}
        height={size}
        className={cn('category-custom-icon object-contain', imageClassName)}
        style={style}
        draggable={false}
      />
    );
  }

  const Icon = resolveCategoryIcon(icon, name);
  return <Icon className={className} style={style} />;
}