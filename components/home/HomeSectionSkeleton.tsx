export function HomeSectionSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`container py-8 ${tall ? 'min-h-[420px]' : 'min-h-[240px]'}`}>
      <div className="mb-5 h-8 w-56 rounded-lg bg-muted/40 animate-pulse" />
      <div className={`rounded-2xl border border-border/40 bg-muted/20 animate-pulse ${tall ? 'h-80' : 'h-48'}`} />
    </div>
  );
}