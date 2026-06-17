import { Flame, Pin, Star, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLACEMENT_FLAGS, type PlacementFlagId } from '@/lib/article-placement';

const PLACEMENT_ICONS: Record<PlacementFlagId, LucideIcon> = {
  featured: Star,
  breaking: Flame,
  pin: Pin,
};

export function ArticlePlacementBadge({
  type,
  className,
  compact,
}: {
  type: PlacementFlagId;
  className?: string;
  /** Smaller badge for dense listings */
  compact?: boolean;
}) {
  const config = PLACEMENT_FLAGS[type];
  const Icon = PLACEMENT_ICONS[type];

  return (
    <span
      className={cn(
        'article-placement-badge',
        `article-placement-badge--${config.accent}`,
        compact && 'article-placement-badge--compact',
        type === 'breaking' && 'article-placement-badge--pulse',
        className,
      )}
    >
      <Icon
        className={cn('article-placement-badge__icon', config.filledIcon && 'fill-current')}
        strokeWidth={compact ? 2 : 2.25}
        aria-hidden
      />
      <span>{config.shortLabel}</span>
    </span>
  );
}