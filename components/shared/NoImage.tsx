import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type NoImageProps = {
  className?: string;
  label?: string;
  compact?: boolean;
};

export function NoImage({ className, label = 'No image', compact = false }: NoImageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 bg-muted/35 text-muted-foreground border border-dashed border-border/50',
        compact ? 'text-[10px] px-2 py-3' : 'text-xs px-4 py-8',
        className,
      )}
      aria-hidden
    >
      <ImageOff className={compact ? 'h-3.5 w-3.5 opacity-60' : 'h-5 w-5 opacity-60'} />
      <span className="font-medium tracking-wide">{label}</span>
    </div>
  );
}