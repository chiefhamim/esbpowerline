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
    <div className="space-y-4">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-border/20 pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-sky-500" strokeWidth={2} />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Revision history</h2>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-mono">
            {revisions.length} saved
          </span>
        </div>
        {revisions.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-semibold text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Show all
              </>
            )}
          </button>
        )}
      </div>

      {/* Revisions list */}
      <div className="space-y-3">
        {visible.map((rev, i) => {
          const isPreview = previewId === rev.id;
          const plain = rev.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          return (
            <div
              key={rev.id}
              className={cn(
                'rounded-xl border p-4 text-[12px] transition-all duration-200',
                i === 0
                  ? 'border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10'
                  : 'border-border/40 bg-muted/10 hover:bg-muted/15 hover:border-border/60',
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <time className="font-semibold text-[13px] text-foreground tabular-nums" dateTime={new Date(rev.createdAt).toISOString()}>
                    {formatEditorialTimestamp(rev.createdAt)}
                  </time>
                  {i === 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 tracking-wider">
                      CURRENT
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground text-[11px] font-medium truncate max-w-[280px]">
                  {rev.user?.name ? `${rev.user.name} • ` : ''}{rev.note ?? 'Auto-save'}
                </span>
              </div>
              <p className="text-muted-foreground/80 line-clamp-2 leading-relaxed mb-3 pr-2">
                {plain.slice(0, 160)}{plain.length > 160 ? '…' : ''}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className={cn(
                    'h-7 px-3 text-xs font-medium rounded-lg transition-colors',
                    isPreview
                      ? 'bg-muted/50 text-foreground hover:bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
                  )}
                  onClick={() => setPreviewId(isPreview ? null : rev.id)}
                >
                  {isPreview ? 'Hide preview' : 'Preview body'}
                </Button>
                {i > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs font-semibold rounded-lg border-border/50 bg-background/50 hover:bg-background/80 hover:text-foreground text-muted-foreground transition-all flex items-center gap-1.5"
                    disabled={pending}
                    onClick={() => restore(rev.id)}
                  >
                    <RotateCcw className="h-3 w-3" /> Restore this version
                  </Button>
                )}
              </div>
              {isPreview && (
                <div
                  className="mt-3 p-4 rounded-xl bg-background/40 border border-border/40 prose prose-sm max-w-none max-h-64 overflow-auto scrollbar-thin text-muted-foreground leading-relaxed transition-all animate-fadeIn"
                  dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(rev.content) }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}