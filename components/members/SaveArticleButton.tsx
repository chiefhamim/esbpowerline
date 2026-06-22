'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { toggleSaveArticle } from '@/lib/actions/members';
import { cn } from '@/lib/utils';

export function SaveArticleButton({
  articleId,
  articleSlug,
  initialSaved,
  signedIn,
}: {
  articleId: string;
  articleSlug: string;
  initialSaved: boolean;
  signedIn: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <Link
        href={`/members/login?callbackUrl=${encodeURIComponent(`/articles/${articleSlug}`)}`}
        className="btn btn-secondary inline-flex items-center gap-2 text-sm"
      >
        <Bookmark className="h-4 w-4" />
        <span className="article-save-btn-text">Save article</span>
      </Link>
    );
  }

  function handleToggle() {
    startTransition(async () => {
      try {
        const result = await toggleSaveArticle(articleId);
        setSaved(result.saved);
        toast.success(result.saved ? 'Saved to your library' : 'Removed from saved');
      } catch {
        toast.error('Could not update saved article');
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={cn(
        'btn inline-flex items-center gap-2 text-sm',
        saved ? 'btn-primary' : 'btn-secondary',
      )}
    >
      <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
      <span className="article-save-btn-text">{saved ? 'Saved' : 'Save article'}</span>
    </button>
  );
}