'use client';

import { cn } from '@/lib/utils';

function parseSnapshotSources(label: string) {
  const parts = label
    .split(/\s*•\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  const [live, ...agencies] = parts;
  return {
    live: live || 'Live',
    agencies,
  };
}

export function SnapshotSourcesLine({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { live, agencies } = parseSnapshotSources(label);

  return (
    <div
      className={cn('home-snapshot__sources', className)}
      role="note"
      aria-label={
        agencies.length > 0
          ? `${live} telemetry from ${agencies.join(', ')}`
          : live
      }
    >
      <span className="home-snapshot__live-badge">
        <span className="home-snapshot__live-dot" aria-hidden />
        {live}
      </span>
      {agencies.length > 0 ? (
        <span className="home-snapshot__source-rail">
          {agencies.map((agency, index) => (
            <span key={`${agency}-${index}`} className="home-snapshot__source-item">
              {index > 0 ? (
                <span className="home-snapshot__sep" aria-hidden>
                  ·
                </span>
              ) : null}
              <span className="home-snapshot__agency">{agency}</span>
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}