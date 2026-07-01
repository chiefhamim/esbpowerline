'use client';

import { useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { cn, formatNumber } from '@/lib/utils';
import { MAJOR_FIELDS, PB_ARCHIVE_COLORS } from '@/lib/data/petrobangla/constants';
import { filterTimelineDays } from '@/lib/data/petrobangla/compute';
import type { AudienceMode, PetrobanglaDaily, PetrobanglaTimelineSummary } from '@/lib/data/petrobangla/types';
import { ArchiveBadge, ArchiveInsightCallout } from './PetrobanglaArchiveShared';

type SortKey = 'largest' | 'decline' | 'depleted';

export function PetrobanglaArchiveFieldCards({
  timeline,
  latestDay,
  mode,
  embedded = false,
  compact = false,
}: {
  timeline: PetrobanglaTimelineSummary;
  latestDay: PetrobanglaDaily;
  mode: AudienceMode;
  embedded?: boolean;
  compact?: boolean;
}) {
  const [sort, setSort] = useState<SortKey>('largest');
  const [modalField, setModalField] = useState<string | null>(null);

  const cards = useMemo(() => {
    const okDays = filterTimelineDays(timeline.days);
    return MAJOR_FIELDS.map((fieldName) => {
      const series = okDays
        .map((d) => ({ date: d.date, gas: d.major_fields?.[fieldName] ?? 0 }))
        .filter((p) => p.gas > 0);
      const current = series[series.length - 1]?.gas ?? 0;
      const peak = series.reduce((best, p) => (p.gas > best.gas ? p : best), { date: '', gas: 0 });
      const pctFromPeak = peak.gas > 0 ? ((current - peak.gas) / peak.gas) * 100 : 0;
      const latestField = latestDay.production.fields.find((f) => f.field === fieldName);
      const wells = latestField?.producing_wells ?? 0;
      const capacity = latestField?.capacity_mmcfd ?? 0;
      const util = capacity > 0 ? (current / capacity) * 100 : 0;
      const isRpgcl = fieldName === 'R-LNG Terminal';
      const domesticTotal = latestDay.production.fields
        .filter((f) => f.company_code !== 'RPGCL')
        .reduce((s, f) => s + f.gas_mmcfd, 0);
      const concentrationRisk = !isRpgcl && domesticTotal > 0 && fieldName === 'Bibiyana' && current / domesticTotal > 0.25;

      return {
        fieldName,
        series,
        current,
        peak,
        pctFromPeak,
        wells,
        capacity,
        util,
        concentrationRisk,
        isRpgcl,
      };
    });
  }, [timeline, latestDay]);

  const sorted = [...cards].sort((a, b) => {
    if (sort === 'largest') return b.current - a.current;
    if (sort === 'decline') return a.pctFromPeak - b.pctFromPeak;
    return a.pctFromPeak - b.pctFromPeak;
  });

  const showDetail = mode !== 'simple';

  const wrapperClass = embedded ? 'space-y-4 grid-explorer-gas-subview' : 'grid-explorer-chart-card card';

  return (
    <div className={wrapperClass}>
      <div
        className={cn(
          'grid-explorer-chart-card__head gas-reserve-field-sort',
          !embedded && 'grid-explorer-chart-card__head--border',
        )}
      >
        {!compact && (
          <div className="gas-reserve-field-sort__title">
            <h3 className="grid-explorer-chart-card__title">Field Lifeline Cards<ArchiveBadge /></h3>
            <p className="grid-explorer-chart-card__sub">Major producing fields · full archive history sparklines</p>
          </div>
        )}
        <div className="gas-reserve-field-sort__chips">
          {([
            ['largest', 'Largest producer'],
            ['decline', 'Fastest decline'],
            ['depleted', 'Most depleted'],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSort(k)}
              className={cn('grid-explorer-chip text-[10px] cursor-pointer', sort === k && 'bg-primary/10 text-primary')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'investor' && (
        <ArchiveInsightCallout>
          Bibiyana concentration above 25% of domestic supply flags single-field dependency risk for the gas-to-power chain.
        </ArchiveInsightCallout>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-4">
        {sorted.map((c) => (
          <button
            key={c.fieldName}
            type="button"
            onClick={() => setModalField(c.fieldName)}
            className="text-left rounded-2xl border border-border/50 bg-muted/5 p-3 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-bold text-sm">{c.fieldName}</span>
              {c.concentrationRisk && mode === 'investor' && (
                <span className="text-[9px] font-bold text-amber-500 uppercase">Risk</span>
              )}
            </div>
            <div className="h-10 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={c.series}>
                  <Line type="monotone" dataKey="gas" stroke={c.isRpgcl ? PB_ARCHIVE_COLORS.lng : PB_ARCHIVE_COLORS.domestic} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-lg font-bold tabular-nums">{formatNumber(c.current, 1)} <span className="text-[10px] font-normal text-muted-foreground">MMCFD</span></div>
            <div className={cn('text-[10px] tabular-nums', c.pctFromPeak < -20 ? 'text-red-500' : 'text-muted-foreground')}>
              {c.pctFromPeak >= 0 ? '+' : ''}{c.pctFromPeak.toFixed(0)}% from peak ({formatNumber(c.peak.gas, 0)} · {c.peak.date})
            </div>
            {showDetail && (
              <div className="text-[10px] text-muted-foreground mt-1">
                {c.wells} wells · {c.util.toFixed(0)}% capacity util
              </div>
            )}
          </button>
        ))}
      </div>

      {modalField && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50" onClick={() => setModalField(null)}>
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto p-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-bold text-lg mb-3">{modalField} — daily history</h4>
            <div className="grid-explorer-table-wrap max-h-64 overflow-auto">
              <table className="grid-explorer-table text-xs">
                <thead><tr><th>Date</th><th>Gas MMCFD</th></tr></thead>
                <tbody>
                  {(cards.find((c) => c.fieldName === modalField)?.series ?? []).slice(-60).reverse().map((p) => (
                    <tr key={p.date}><td>{p.date}</td><td className="tabular-nums">{formatNumber(p.gas, 1)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="mt-3 grid-explorer-chip text-xs" onClick={() => setModalField(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="px-4 pb-4 text-[11px] text-muted-foreground">
        <strong>Layman:</strong> Same wells, less gas = the underground reservoir is tiring.
      </div>
    </div>
  );
}