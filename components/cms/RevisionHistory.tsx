'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cmsToast } from '@/lib/cms-toast';
import { History, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { restoreArticleRevision } from '@/lib/actions/articles';
import { Button } from '@/components/ui/button';
import { cn, formatEditorialTimestamp } from '@/lib/utils';
import { sanitizeArticleHtml } from '@/lib/sanitize-article-html';

export type RevisionRow = {
  id: string;
  content: string;
  note: string | null;
  createdAt: string | Date;
  user?: { name: string | null } | null;
};

export function RevisionHistory({
  articleId,
  revisions,
}: {
  articleId: string;
  revisions: RevisionRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  if (!revisions.length) return null;

  function restore(revisionId: string) {
    if (!confirm('Restore this version? Current content will be saved as a new revision.')) return;
    startTransition(async () => {
      try {
        await restoreArticleRevision(articleId, revisionId);
        cmsToast.success(
          'Revision restored',
          'The selected version replaced the current story body.',
        );
        router.refresh();
      } catch (e: unknown) {
        cmsToast.error(
          'Could not restore revision',
          e instanceof Error ? e.message : undefined,
        );
      }
    });
  }

  const visible = expanded ? revisions : revisions.slice(0, 3);

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div className="flex items-center gap-2.5">
          <span className="admin-card-icon">
            <History className="h-[15px] w-[15px]" strokeWidth={2} />
          </span>
          <h2 className="admin-card-title">Revision history</h2>
          <span className="text-[11px] text-muted-foreground tabular-nums">{revisions.length} saved</span>
        </div>
        {revisions.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-[12px] text-sky-500 hover:text-sky-400 flex items-center gap-1"
          >
            {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> Show all</>}
          </button>
        )}
      </div>
      <div className="admin-card-body space-y-2">
        {visible.map((rev, i) => {
          const isPreview = previewId === rev.id;
          const plain = rev.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          return (
            <div
              key={rev.id}
              className={cn(
                'rounded-xl border p-3 text-[12px]',
                i === 0 ? 'border-sky-500/25 bg-sky-500/5' : 'border-border/50 bg-muted/10',
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <time className="font-medium text-[13px] tabular-nums" dateTime={new Date(rev.createdAt).toISOString()}>
                  {formatEditorialTimestamp(rev.createdAt)}
                </time>
                <span className="text-muted-foreground text-[11px]">
                  {rev.user?.name ? `${rev.user.name} • ` : ''}{rev.note ?? 'Auto-save'}
                </span>
              </div>
              <p className="text-muted-foreground line-clamp-2 leading-relaxed">{plain.slice(0, 160)}{plain.length > 160 ? '…' : ''}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setPreviewId(isPreview ? null : rev.id)}>
                  {isPreview ? 'Hide preview' : 'Preview'}
                </Button>
                {i > 0 && (
                  <Button type="button" size="sm" variant="outline" className="h-7 text-xs" disabled={pending} onClick={() => restore(rev.id)}>
                    <RotateCcw className="h-3 w-3 mr-1" /> Restore
                  </Button>
                )}
              </div>
              {isPreview && (
                <div className="mt-3 p-3 rounded-lg bg-background border border-border/40 prose prose-sm max-w-none max-h-48 overflow-auto" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(rev.content) }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}