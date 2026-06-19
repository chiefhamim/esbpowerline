'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Trash2, RotateCcw, FileText, Bell, AlertTriangle, Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatEditorialTimestamp } from '@/lib/utils';
import { EDITOR_TRASH_RETENTION_DAYS } from '@/lib/editor-trash';
import {
  restoreTrashArticle,
  restoreTrashNotice,
  permanentlyDeleteTrashArticle,
  permanentlyDeleteTrashNotice,
  emptyEditorTrash,
  type EditorTrashArticle,
  type EditorTrashNotice,
} from '@/lib/actions/editor-trash';
import { CmsCard, CmsCardGrid, CmsDenseList, CmsSectionStack } from '@/components/cms/CmsUI';

const NOTICE_TYPE_LABELS: Record<string, string> = {
  REVISION_REQUEST: 'Revision requested',
  CONTENT_REMOVED: 'Content change',
  CATEGORY_CHANGED: 'Category update',
  ADMIN_NOTE: 'Editorial note',
};

function DaysLeftBadge({ days }: { days: number }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums',
        days <= 1
          ? 'bg-red-500/15 text-red-500'
          : days <= 3
            ? 'bg-amber-500/15 text-amber-600'
            : 'bg-muted text-muted-foreground',
      )}
    >
      {days === 0 ? 'Purges today' : `${days}d left`}
    </span>
  );
}

function ArticleTrashRow({
  article,
  pending,
  onRestore,
  onDelete,
}: {
  article: EditorTrashArticle;
  pending: boolean;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="editorial-trash-row">
      <div className="editorial-trash-row__main">
        <div className="editorial-trash-row__icon" data-type="article">
          <FileText className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-[13px] truncate">{article.title}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {article.category} · Trashed {formatEditorialTimestamp(article.trashedAt)}
          </div>
        </div>
        <DaysLeftBadge days={article.daysLeft} />
      </div>
      <div className="editorial-trash-row__actions">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          disabled={pending}
          onClick={() => onRestore(article.id)}
        >
          <RotateCcw className="h-3 w-3 mr-1" /> Restore
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10"
          disabled={pending}
          onClick={() => onDelete(article.id)}
        >
          Delete forever
        </Button>
      </div>
    </div>
  );
}

function NoticeTrashRow({
  notice,
  pending,
  onRestore,
  onDelete,
}: {
  notice: EditorTrashNotice;
  pending: boolean;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="editorial-trash-row">
      <div className="editorial-trash-row__main">
        <div className="editorial-trash-row__icon" data-type="notice">
          <Bell className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-[13px]">
            {NOTICE_TYPE_LABELS[notice.type] ?? notice.type}
          </div>
          {notice.articleTitle && (
            <div className="text-[11px] text-muted-foreground truncate">{notice.articleTitle}</div>
          )}
          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{notice.message}</p>
          <div className="text-[10px] text-muted-foreground mt-1">
            Trashed {formatEditorialTimestamp(notice.trashedAt)}
          </div>
        </div>
        <DaysLeftBadge days={notice.daysLeft} />
      </div>
      <div className="editorial-trash-row__actions">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          disabled={pending}
          onClick={() => onRestore(notice.id)}
        >
          <RotateCcw className="h-3 w-3 mr-1" /> Restore
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10"
          disabled={pending}
          onClick={() => onDelete(notice.id)}
        >
          Delete forever
        </Button>
      </div>
    </div>
  );
}

export function EditorialTrashPanel({
  articles,
  notices,
}: {
  articles: EditorTrashArticle[];
  notices: EditorTrashNotice[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmEmpty, setConfirmEmpty] = useState(false);
  const total = articles.length + notices.length;

  function run(action: () => Promise<unknown>, success: string, description?: string) {
    startTransition(async () => {
      try {
        await action();
        toast.success(success, { description });
        setConfirmEmpty(false);
        router.refresh();
      } catch (e: unknown) {
        toast.error('Action could not be completed', {
          description: e instanceof Error ? e.message : undefined,
        });
      }
    });
  }

  return (
    <CmsSectionStack>
      <div className="editorial-trash-banner">
        <div className="editorial-trash-banner__icon">
          <Lock className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[13px] font-medium">Private to you</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Items stay here for {EDITOR_TRASH_RETENTION_DAYS} days, then are removed automatically.
            Administrators cannot see this trash.
          </p>
        </div>
      </div>

      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[12px] text-muted-foreground">
            {total} item{total !== 1 ? 's' : ''} in trash
          </span>
          {!confirmEmpty ? (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs text-red-500 border-red-500/30 hover:bg-red-500/10"
              disabled={pending}
              onClick={() => setConfirmEmpty(true)}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Empty trash
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-amber-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Delete all permanently?
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs text-red-500 border-red-500/40 hover:bg-red-500/10"
                disabled={pending}
                onClick={() => run(emptyEditorTrash, 'Trash emptied')}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                disabled={pending}
                onClick={() => setConfirmEmpty(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      <CmsCardGrid cols={2}>
        <CmsCard title="Trashed stories" icon={FileText}>
          {articles.length === 0 ? (
            <p className="text-[13px] text-muted-foreground py-4 text-center">No trashed stories</p>
          ) : (
            <CmsDenseList>
              {articles.map((a) => (
                <ArticleTrashRow
                  key={a.id}
                  article={a}
                  pending={pending}
                  onRestore={(id) => run(() => restoreTrashArticle(id), 'Story restored to drafts')}
                  onDelete={(id) => run(() => permanentlyDeleteTrashArticle(id), 'Story deleted permanently')}
                />
              ))}
            </CmsDenseList>
          )}
        </CmsCard>

        <CmsCard title="Trashed notices" icon={Bell}>
          {notices.length === 0 ? (
            <p className="text-[13px] text-muted-foreground py-4 text-center">No trashed notices</p>
          ) : (
            <CmsDenseList>
              {notices.map((n) => (
                <NoticeTrashRow
                  key={n.id}
                  notice={n}
                  pending={pending}
                  onRestore={(id) => run(() => restoreTrashNotice(id), 'Notice restored')}
                  onDelete={(id) => run(() => permanentlyDeleteTrashNotice(id), 'Notice deleted permanently')}
                />
              ))}
            </CmsDenseList>
          )}
        </CmsCard>
      </CmsCardGrid>

      {total === 0 && (
        <p className="text-center text-[13px] text-muted-foreground py-8">
          Trash is empty.{' '}
          <Link href="/cms/articles/drafts" className="text-sky-500 hover:underline">
            Back to drafts
          </Link>
        </p>
      )}
    </CmsSectionStack>
  );
}