'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Bell, MessageSquare, Check, ExternalLink } from 'lucide-react';
import { acknowledgeNotice, resolveNotice } from '@/lib/actions/notices';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type NoticeRow = {
  id: string;
  type: string;
  message: string;
  status: string;
  createdAt: string | Date;
  sender: { name: string };
  article?: { id: string; title: string; slug: string; status: string } | null;
  metadata?: unknown;
};

const TYPE_LABELS: Record<string, string> = {
  REVISION_REQUEST: 'Revision requested',
  CONTENT_REMOVED: 'Content change',
  CATEGORY_CHANGED: 'Category update',
  ADMIN_NOTE: 'Editorial note',
};

export function EditorialNoticesPanel({ notices }: { notices: NoticeRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const pendingNotices = notices.filter((n) => n.status === 'PENDING');

  function run(id: string, action: 'ack' | 'resolve') {
    startTransition(async () => {
      try {
        if (action === 'ack') await acknowledgeNotice(id);
        else await resolveNotice(id);
        toast.success(action === 'ack' ? 'Marked as seen' : 'Marked as resolved');
        router.refresh();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed');
      }
    });
  }

  if (!notices.length) return null;

  return (
    <div className="card p-6 mb-6 border-sky-500/25 bg-sky-500/5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4 text-sky-500" />
          Editorial notices
          {pendingNotices.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400">
              {pendingNotices.length} new
            </span>
          )}
        </h2>
      </div>

      <div className="space-y-3">
        {notices.slice(0, 8).map((notice) => {
          const meta = notice.metadata as { articleTitle?: string; fromCategory?: string; toCategory?: string } | null;
          const articleTitle = notice.article?.title ?? meta?.articleTitle;
          return (
            <div
              key={notice.id}
              className={cn(
                'rounded-xl border p-3.5 text-sm',
                notice.status === 'PENDING' ? 'border-sky-500/30 bg-background/80' : 'border-border/60 bg-muted/20'
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                  <span className="font-semibold text-[13px]">
                    {TYPE_LABELS[notice.type] ?? notice.type}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    from {notice.sender.name}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>

              {articleTitle && (
                <div className="text-[12px] font-medium mb-1 truncate">{articleTitle}</div>
              )}

              {meta?.fromCategory && meta?.toCategory && (
                <div className="text-[11px] text-muted-foreground mb-1">
                  {meta.fromCategory} → {meta.toCategory}
                </div>
              )}

              <p className="text-[12px] text-muted-foreground leading-relaxed">{notice.message}</p>

              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                {notice.article && notice.type === 'REVISION_REQUEST' && (
                  <Link href={`/cms/articles/${notice.article.id}/edit`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" /> Edit article
                    </Button>
                  </Link>
                )}
                {notice.status === 'PENDING' && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs" disabled={pending} onClick={() => run(notice.id, 'ack')}>
                    <Check className="h-3 w-3 mr-1" /> Acknowledge
                  </Button>
                )}
                {notice.status !== 'RESOLVED' && notice.type === 'REVISION_REQUEST' && (
                  <Button size="sm" className="h-7 text-xs" disabled={pending} onClick={() => run(notice.id, 'resolve')}>
                    Mark resolved
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}