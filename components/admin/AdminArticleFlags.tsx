'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Pin, Star, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleArticleFlag } from '@/lib/actions/platform';

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
    setFlags((f) => ({ ...f, [flag]: next }));
    startTransition(async () => {
      try {
        await toggleArticleFlag(articleId, flag, next);
        const label = flag === 'isPinned' ? 'Pinned' : flag === 'isFeatured' ? 'Featured' : 'Breaking';
        toast.success(`${label} updated`);
      } catch (e: unknown) {
        setFlags((f) => ({ ...f, [flag]: !next }));
        toast.error(e instanceof Error ? e.message : 'Failed');
      }
    });
  }

  return (
    <div className="flex items-center gap-0.5">
      {(['isPinned', 'isFeatured', 'isBreaking'] as const).map((flag) => {
        const Icon = flag === 'isPinned' ? Pin : flag === 'isFeatured' ? Star : Flame;
        const title = flag === 'isPinned' ? 'Pin to carousel top' : flag === 'isFeatured' ? 'Featured' : 'Breaking';
        return (
          <button
            key={flag}
            type="button"
            title={title}
            disabled={pending}
            onClick={() => toggle(flag)}
            className={cn(
              'admin-flag-btn',
              flag === 'isBreaking' && 'admin-flag-btn--breaking',
              flags[flag] && 'admin-flag-btn--active',
            )}
          >
            <Icon className="h-3 w-3" />
          </button>
        );
      })}
    </div>
  );
}