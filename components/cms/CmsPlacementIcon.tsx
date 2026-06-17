'use client';

import { Flame, Pin, Star, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLACEMENT_FLAGS, type PlacementFlagId } from '@/lib/article-placement';

const PLACEMENT_ICONS: Record<PlacementFlagId, LucideIcon> = {
  featured: Star,
  breaking: Flame,
  pin: Pin,
};

export function CmsPlacementIcon({ type }: { type: PlacementFlagId }) {
  const config = PLACEMENT_FLAGS[type];
  const Icon = PLACEMENT_ICONS[type];

  return (
    <span
      className={cn('cms-placement-icon', `cms-placement-icon--${config.accent}`)}
      aria-hidden
    >
      <Icon
        className={cn('h-3.5 w-3.5', config.filledIcon && 'fill-current')}
        strokeWidth={2}
      />
    </span>
  );
}