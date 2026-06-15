'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Trash2, ShieldAlert, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { updateCommentStatus, type ModerationComment } from '@/lib/actions/comments';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function CommentModerationTable({
  comments,
  emptyMessage,
}: {
  comments: ModerationComment[];
  emptyMessage: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);

  function moderate(id: string, status: 'APPROVED' | 'SPAM' | 'TRASH' | 'PENDING') {
    setActiveId(id);
    startTransition(async () => {
      try {
        await updateCommentStatus(id, status);
        toast.success(`Comment ${status.toLowerCase()}`);
        router.refresh();
      } catch {
        toast.error('Could not update comment');
      } finally {
        setActiveId(null);
      }
    });
  }

  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const busy = pending && activeId === comment.id;
        return (
          <article key={comment.id} className="admin-comment-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{comment.authorName}</span>
                  {comment.authorEmail ? <span>{comment.authorEmail}</span> : null}
                  <span>{formatDate(comment.createdAt.toISOString())}</span>
                  <StatusBadge status={comment.status} />
                </div>
                {comment.articleSlug ? (
                  <Link
                    href={`/articles/${comment.articleSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm font-medium text-rose-400 hover:text-rose-300"
                  >
                    {comment.articleTitle}
                  </Link>
                ) : (
                  <p className="mt-1 text-sm font-medium">{comment.articleTitle}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {comment.status !== 'APPROVED' && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => moderate(comment.id, 'APPROVED')}
                    className={cn('admin-comment-action admin-comment-action--approve')}
                    title="Approve"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
                {comment.status !== 'PENDING' && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => moderate(comment.id, 'PENDING')}
                    className="admin-comment-action"
                    title="Return to pending"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
                {comment.status !== 'SPAM' && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => moderate(comment.id, 'SPAM')}
                    className="admin-comment-action admin-comment-action--spam"
                    title="Mark spam"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                  </button>
                )}
                {comment.status !== 'TRASH' && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => moderate(comment.id, 'TRASH')}
                    className="admin-comment-action admin-comment-action--trash"
                    title="Trash"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{comment.content}</p>
            {comment.userId ? (
              <Link
                href={`/admin/users/${comment.userId}`}
                className="mt-2 inline-block text-[11px] font-medium text-muted-foreground hover:text-foreground"
              >
                View member account →
              </Link>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}