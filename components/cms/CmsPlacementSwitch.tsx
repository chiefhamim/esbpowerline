'use client';

import { cn } from '@/lib/utils';

export type CmsPlacementAccent = 'amber' | 'red' | 'violet' | 'rose' | 'sky';

export function CmsPlacementSwitch({
  checked,
  onCheckedChange,
  accent = 'rose',
  className,
  'aria-label': ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  accent?: CmsPlacementAccent;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'cms-placement-switch',
        checked && 'cms-placement-switch--on',
        checked && `cms-placement-switch--${accent}`,
        className,
      )}
    >
      <span className="cms-placement-switch__thumb" aria-hidden />
    </button>
  );
}