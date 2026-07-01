'use client';

import { cn } from '@/lib/utils';

export type ArchiveStoryView = 'timeline' | 'fields' | 'power-gap' | 'sectors' | 'compare';

const VIEWS: { id: ArchiveStoryView; label: string; short: string }[] = [
  { id: 'timeline', label: 'National Timeline', short: 'Timeline' },
  { id: 'fields', label: 'Field Lifelines', short: 'Fields' },
  { id: 'power-gap', label: 'Power Gas Gap', short: 'Power' },
  { id: 'sectors', label: 'Who Gets Gas', short: 'Sectors' },
  { id: 'compare', label: 'Compare Days', short: 'Compare' },
];

interface Props {
  active: ArchiveStoryView;
  onChange: (id: ArchiveStoryView) => void;
}

export function GasReserveArchiveViewTabs({ active, onChange }: Props) {
  return (
    <div className="gas-reserve-archive-tabs" role="tablist" aria-label="Archive views">
      {VIEWS.map((v) => {
        const isActive = active === v.id;
        return (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(v.id)}
            className={cn('gas-reserve-archive-tabs__btn', isActive && 'gas-reserve-archive-tabs__btn--active')}
          >
            <span className="hidden sm:inline">{v.label}</span>
            <span className="sm:hidden">{v.short}</span>
          </button>
        );
      })}
    </div>
  );
}

export { VIEWS as ARCHIVE_STORY_VIEWS };