'use client';

import { Flame, Pin, Star, TrendingUp, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLACEMENT_FLAGS, type PlacementFlagId } from '@/lib/article-placement';
import { useLocale } from '@/components/shared/LocaleProvider';
import type { MessageKey } from '@/lib/i18n/messages';

const PLACEMENT_ICONS: Record<PlacementFlagId, LucideIcon> = {
  featured: Star,
  breaking: Flame,
  pin: Pin,
  trending: TrendingUp,
};

const PLACEMENT_MESSAGE_KEYS: Record<PlacementFlagId, MessageKey> = {
  featured: 'placement.featured',
  breaking: 'placement.breaking',
  pin: 'placement.pinned',
  trending: 'placement.trending',
};

export function ArticlePlacementBadge({
  type,
  className,
  compact,
}: {
  type: PlacementFlagId;
  className?: string;
  compact?: boolean;
}) {
  const { t } = useLocale();
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
      <span>{t(PLACEMENT_MESSAGE_KEYS[type])}</span>
    </span>
  );
}