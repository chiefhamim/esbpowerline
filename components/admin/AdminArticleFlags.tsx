'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Flame, Pin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleArticleFlag } from '@/lib/actions/platform';
import { ModernTooltip } from '@/components/shared/ModernTooltip';
import { PLACEMENT_FLAGS, type PlacementFlagId } from '@/lib/article-placement';

const FLAG_META: Record<
  'isPinned' | 'isFeatured' | 'isBreaking',
  { flag: PlacementFlagId; Icon: typeof Star; title: string }
> = {
  isFeatured: { flag: 'featured', Icon: Star, title: 'Featured' },
  isBreaking: { flag: 'breaking', Icon: Flame, title: 'Breaking' },
  isPinned: { flag: 'pin', Icon: Pin, title: 'Pin All Coverage top' },
};

export function AdminArticleFlags({
  articleId,
  isPinned,
  isFeatured,
  isBreaking,
}: {
  articleId: string;
  isPinned: boolean;
  isFeatured: boolean;
  isBreaking: boolean;
}) {
  const [flags, setFlags] = useState({ isPinned, isFeatured, isBreaking });
  const [pending, startTransition] = useTransition();

  function toggle(flag: 'isPinned' | 'isFeatured' | 'isBreaking') {
    const next = !flags[flag];
    setFlags((f) => {
      const updated = { ...f, [flag]: next };
      if (flag === 'isPinned' && next) updated.isFeatured = false;
      if (flag === 'isFeatured' && next) updated.isPinned = false;
      return updated;
    });
    startTransition(async () => {
      try {
        await toggleArticleFlag(articleId, flag, next);
        toast.success(`${FLAG_META[flag].title} updated`);
      } catch (e: unknown) {
        setFlags((f) => ({ ...f, [flag]: !next }));
        toast.error(e instanceof Error ? e.message : 'Failed');
      }
    });
  }

  return (
    <div className="flex items-center gap-0.5">
      {(['isPinned', 'isFeatured', 'isBreaking'] as const).map((flag) => {
        const { Icon, title, flag: placementId } = FLAG_META[flag];
        const accent = PLACEMENT_FLAGS[placementId].accent;
        const filled = PLACEMENT_FLAGS[placementId].filledIcon;
        return (
          <ModernTooltip key={flag} label={title} side="top">
            <button
              type="button"
              disabled={pending}
              onClick={() => toggle(flag)}
              className={cn(
                'admin-flag-btn',
                `admin-flag-btn--${accent}`,
                flags[flag] && 'admin-flag-btn--active',
              )}
            >
              <Icon className={cn('h-3 w-3', filled && flags[flag] && 'fill-current')} />
            </button>
          </ModernTooltip>
        );
      })}
    </div>
  );
}