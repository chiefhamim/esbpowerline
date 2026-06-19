'use client';

import type { CSSProperties } from 'react';
import { formatNumber } from '@/lib/utils';

export type ContentPipelineItem = {
  status: string;
  count: number;
  color: string;
};

const STAGE_LABELS: Record<string, string> = {
  Published: 'Published',
  Draft: 'Draft',
  Scheduled: 'Scheduled',
  Archived: 'Archived',
  Trash: 'Trash',
};

export function AdminContentPipelinePanel({ items }: { items: ContentPipelineItem[] }) {
  const pipelineTotal = items.reduce((sum, item) => sum + item.count, 0) || 1;

  if (items.length === 0) {
    return <p className="admin-analytics-empty">No pipeline data.</p>;
  }

  return (
    <div className="admin-pipeline-v2">
      <div className="admin-pipeline-v2__bar" aria-label="Content pipeline composition">
        {items.map((item) => {
          const width = pipelineTotal > 0 ? (item.count / pipelineTotal) * 100 : 0;
          if (width <= 0) return null;
          return (
            <div
              key={item.status}
              className="admin-pipeline-v2__bar-seg"
              style={{ width: `${width}%`, backgroundColor: item.color }}
              title={`${STAGE_LABELS[item.status] ?? item.status}: ${formatNumber(item.count)}`}
            />
          );
        })}
      </div>

      <div className="admin-pipeline-v2__stages" role="list">
        {items.map((item) => {
          const share = pipelineTotal > 0 ? ((item.count / pipelineTotal) * 100).toFixed(1) : '0.0';
          return (
            <div
              key={item.status}
              className="admin-pipeline-v2__stage"
              role="listitem"
              style={{ '--stage-color': item.color } as CSSProperties}
            >
              <span className="admin-pipeline-v2__dot" aria-hidden />
              <span className="admin-pipeline-v2__label">{STAGE_LABELS[item.status] ?? item.status}</span>
              <span className="admin-pipeline-v2__count">{formatNumber(item.count)}</span>
              <span className="admin-pipeline-v2__share">{share}%</span>
            </div>
          );
        })}
      </div>

      <p className="admin-pipeline-v2__foot">
        {formatNumber(pipelineTotal)} articles · all-time inventory
      </p>
    </div>
  );
}