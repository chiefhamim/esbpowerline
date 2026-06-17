'use client';

import { cn } from '@/lib/utils';
import { budgetTone, type CharBudget } from '@/lib/editorial-limits';

export function CharBudgetHint({
  length,
  budget,
  className,
}: {
  length: number;
  budget: CharBudget;
  className?: string;
}) {
  const tone = budgetTone(length, budget);
  const remaining = budget.max - length;

  return (
    <div className={cn('cms-char-budget', className)}>
      <span
        className={cn(
          'cms-char-budget__count',
          tone === 'warn' && 'cms-char-budget__count--warn',
          tone === 'over' && 'cms-char-budget__count--over',
        )}
      >
        {length}/{budget.max}
      </span>
      <span className="cms-char-budget__meta">
        {tone === 'over'
          ? `${Math.abs(remaining)} over ${budget.label} limit`
          : `${remaining} left for ${budget.label}`}
        {tone === 'ok' && length <= budget.ideal && (
          <span className="cms-char-budget__ideal"> · ideal ≤{budget.ideal}</span>
        )}
      </span>
    </div>
  );
}