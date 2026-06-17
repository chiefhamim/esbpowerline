'use client';

import type { CSSProperties } from 'react';
import { formatNumber } from '@/lib/utils';

export type ContentPipelineItem = {
  status: string;
  count: number;
  color: string;
};

const STAGE_SHORT_LABELS: Record<string, string> = {
  Published: 'Live',
  Draft: 'Draft',
  Scheduled: 'Sched',
  Archived: 'Arch',
  Trash: 'Trash',
};

const METER_HEIGHT_PX = 52;

function stageLabel(status: string) {
  return STAGE_SHORT_LABELS[status] ?? status;
}

export function AdminContentPipelinePanel({ items }: { items: ContentPipelineItem[] }) {
  const pipelineTotal = items.reduce((sum, item) => sum + item.count, 0) || 1;
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  if (items.length === 0) {
    return <p className="admin-pipeline__empty">No pipeline data.</p>;
  }

  return (
    <div className="admin-pipeline">
      <div className="admin-pipeline__grid" role="list">
        {items.map((item) => {
          const fillPx = Math.max(4, Math.round((item.count / maxCount) * METER_HEIGHT_PX));
          const share = pipelineTotal > 0 ? ((item.count / pipelineTotal) * 100).toFixed(0) : '0';

          return (
            <article
              key={item.status}
              className="admin-pipeline__stage"
              role="listitem"
              style={{ '--stage-color': item.color } as CSSProperties}
              title={`${item.status}: ${formatNumber(item.count)} articles (${share}%)`}
            >
              <div className="admin-pipeline__stage-inner">
                <span className="admin-pipeline__count">{formatNumber(item.count)}</span>
                <div className="admin-pipeline__meter" aria-hidden>
                  <div
                    className="admin-pipeline__meter-fill"
                    style={{ height: `${fillPx}px`, backgroundColor: item.color }}
                  />
                </div>
                <span className="admin-pipeline__label">{stageLabel(item.status)}</span>
                <span className="admin-pipeline__share">{share}%</span>
              </div>
            </article>
          );
        })}
      </div>
      <p className="admin-pipeline__foot">
        {formatNumber(pipelineTotal)} total · all-time
      </p>
    </div>
  );
}