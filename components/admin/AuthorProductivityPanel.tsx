'use client';

import { useMemo, useState } from 'react';
import { cn, formatNumber } from '@/lib/utils';
import { ROLES, type Role } from '@/lib/constants';
import type { AuthorPublishingStat } from '@/lib/actions/analytics';

type PeriodKey = 'day' | 'week' | 'month' | 'year';

const PERIODS: { key: PeriodKey; label: string; short: string }[] = [
  { key: 'day', label: 'Today', short: 'Day' },
  { key: 'week', label: 'This week', short: 'Week' },
  { key: 'month', label: 'This month', short: 'Month' },
  { key: 'year', label: 'This year', short: 'Year' },
];

export function AuthorProductivityPanel({ authors }: { authors: AuthorPublishingStat[] }) {
  const [period, setPeriod] = useState<PeriodKey>('month');

  const sorted = useMemo(
    () => [...authors].sort((a, b) => b[period] - a[period] || a.name.localeCompare(b.name)),
    [authors, period],
  );

  const totals = useMemo(
    () => ({
      day: authors.reduce((sum, a) => sum + a.day, 0),
      week: authors.reduce((sum, a) => sum + a.week, 0),
      month: authors.reduce((sum, a) => sum + a.month, 0),
      year: authors.reduce((sum, a) => sum + a.year, 0),
    }),
    [authors],
  );

  if (authors.length === 0) {
    return (
      <p className="text-[13px] text-muted-foreground py-2">
        No authors or editors on the platform yet.
      </p>
    );
  }

  return (
    <div className="admin-author-productivity">
      <div className="admin-filter-tabs admin-author-productivity__tabs">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            type="button"
            className={cn('admin-filter-tab', period === p.key && 'admin-filter-tab--active')}
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
            <span className="admin-filter-tab__count">{formatNumber(totals[p.key])}</span>
          </button>
        ))}
      </div>

      <div className="admin-author-productivity__table-wrap">
        <table className="admin-author-productivity__table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Role</th>
              <th className="admin-author-productivity__num">Today</th>
              <th className="admin-author-productivity__num">Week</th>
              <th className="admin-author-productivity__num">Month</th>
              <th className="admin-author-productivity__num">Year</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((author, index) => (
              <tr key={author.id}>
                <td>
                  <span className="admin-author-productivity__rank">{index + 1}</span>
                  <span className="admin-author-productivity__name">{author.name}</span>
                </td>
                <td>
                  <span className="admin-role-pill">
                    {ROLES[author.role as Role]?.name ?? author.role}
                  </span>
                </td>
                {PERIODS.map((p) => (
                  <td
                    key={p.key}
                    className={cn(
                      'admin-author-productivity__num tabular-nums',
                      period === p.key && 'admin-author-productivity__num--active',
                    )}
                  >
                    {formatNumber(author[p.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="admin-author-productivity__total-label">Newsroom total</td>
              {PERIODS.map((p) => (
                <td
                  key={p.key}
                  className={cn(
                    'admin-author-productivity__num tabular-nums font-semibold',
                    period === p.key && 'admin-author-productivity__num--active',
                  )}
                >
                  {formatNumber(totals[p.key])}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}