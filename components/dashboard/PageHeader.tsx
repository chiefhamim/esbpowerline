import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8', className)}>
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-none">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-2 max-w-prose">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}