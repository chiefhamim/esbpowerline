'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { GridAccessTier } from '@/lib/data/grid/grid-tier-access';
import { GridDataLockedGate } from '@/components/news/power-grid/GridDataLockedGate';

type GridLockedContentProps = {
  locked: boolean;
  requiredTier: GridAccessTier | null;
  selectedDate: string;
  children: ReactNode;
  className?: string;
};

/**
 * Wraps grid explorer body — when locked, blurs content and shows the access gate overlay.
 */
export function GridLockedContent({
  locked,
  requiredTier,
  selectedDate,
  children,
  className,
}: GridLockedContentProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'transition-all duration-500 ease-out',
          locked && 'pointer-events-none select-none blur-md brightness-[0.55] saturate-50',
        )}
        aria-hidden={locked || undefined}
      >
        {children}
      </div>

      {locked && requiredTier && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-[55] bg-background/40 backdrop-blur-[2px]"
            aria-hidden
          />
          <GridDataLockedGate
            requiredTier={requiredTier}
            selectedDate={selectedDate}
            variant="overlay"
          />
        </>
      )}
    </div>
  );
}