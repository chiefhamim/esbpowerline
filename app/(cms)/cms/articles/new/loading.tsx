import { DevCompileHint } from '@/components/shared/DevCompileHint';

export default function NewArticleLoading() {
  return (
    <div className="cms-write-page animate-pulse">
      <DevCompileHint label="Opening story editor — compiling…" />
      <div className="cms-article-editor">
        <section className="cms-editor-panel cms-write-hero">
          <div className="cms-write-hero__inner">
            <div className="cms-write-hero__icon bg-muted/40 border-transparent" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-36 rounded-lg bg-muted/40" />
              <div className="h-3.5 w-full max-w-md rounded bg-muted/25" />
            </div>
          </div>
        </section>

        <div className="cms-article-editor__workspace">
          <div className="cms-article-editor__main space-y-4">
            <div className="cms-editor-panel h-40 rounded-xl bg-muted/20" />
            <div className="cms-editor-panel rounded-xl border border-border/40 overflow-hidden">
              <div className="h-11 border-b border-border/40 bg-muted/30" />
              <div className="min-h-[24rem] p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-muted/25" style={{ width: `${92 - i * 8}%` }} />
                ))}
              </div>
            </div>
          </div>
          <aside className="cms-article-editor__sidebar space-y-4">
            <div className="cms-sidebar-card">
              <div className="cms-sidebar-card__head">
                <div className="h-4 w-4 rounded bg-muted/40" />
                <div className="h-4 w-20 rounded bg-muted/35" />
              </div>
              <div className="cms-sidebar-card__body space-y-3">
                <div className="h-10 rounded-lg bg-muted/25" />
                <div className="h-10 rounded-lg bg-muted/20" />
                <div className="h-10 rounded-lg bg-muted/20" />
              </div>
            </div>
            <div className="cms-sidebar-card">
              <div className="cms-sidebar-card__head">
                <div className="h-4 w-4 rounded bg-muted/40" />
                <div className="h-4 w-24 rounded bg-muted/35" />
              </div>
              <div className="cms-sidebar-card__body space-y-3">
                <div className="h-10 rounded-lg bg-muted/25" />
                <div className="h-24 rounded-lg bg-muted/20" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}