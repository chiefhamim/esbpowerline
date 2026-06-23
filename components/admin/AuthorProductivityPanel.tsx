'use client';

import { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { ROLES, type Role } from '@/lib/constants';
import type { AuthorPublishingStat } from '@/lib/actions/analytics';

type PeriodKey = 'day' | 'week' | 'month' | 'year';
type SortKey = 'total' | PeriodKey;

const PERIODS: { key: PeriodKey; label: string; header: string }[] = [
  { key: 'day', label: 'Today', header: 'Today' },
  { key: 'week', label: 'This week', header: 'Week' },
  { key: 'month', label: 'This month', header: 'Month' },
  { key: 'year', label: 'This year', header: 'Year' },
];

export function AuthorProductivityPanel({ authors }: { authors: AuthorPublishingStat[] }) {
  const [sortBy, setSortBy] = useState<SortKey>('month');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const sorted = useMemo(() => {
    const list = [...authors];
    list.sort((a, b) => {
      const valA = sortBy === 'total' ? a.total : a[sortBy];
      const valB = sortBy === 'total' ? b.total : b[sortBy];
      if (valA !== valB) {
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [authors, sortBy, sortOrder]);

  const totals = useMemo(
    () => ({
      total: authors.reduce((sum, a) => sum + a.total, 0),
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
    <div className="admin-author-productivity mt-1">
      <div className="admin-author-productivity__table-wrap">
        <table className="admin-author-productivity__table">
          <thead>
            <tr>
              <th className="py-2.5 px-3 font-semibold">Author</th>
              <th className="py-2.5 px-3 font-semibold">Role</th>
              
              <th
                onClick={() => handleSort('total')}
                className="admin-author-productivity__num cursor-pointer hover:bg-muted/30 select-none py-2.5 px-3 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Live</span>
                  <ArrowUpDown className={cn(
                    "h-3 w-3 transition-colors", 
                    sortBy === 'total' ? "text-sky-500" : "text-muted-foreground/30"
                  )} />
                </div>
              </th>

              {PERIODS.map((p) => (
                <th
                  key={p.key}
                  onClick={() => handleSort(p.key)}
                  className="admin-author-productivity__num cursor-pointer hover:bg-muted/30 select-none py-2.5 px-3 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{p.header}</span>
                    <ArrowUpDown className={cn(
                      "h-3 w-3 transition-colors", 
                      sortBy === p.key ? "text-sky-500" : "text-muted-foreground/30"
                    )} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((author, index) => (
              <tr key={author.id} className="transition-colors hover:bg-muted/20">
                <td className="py-2.5 px-3">
                  <span className="admin-author-productivity__rank font-semibold">{index + 1}</span>
                  <span className="admin-author-productivity__name font-medium">{author.name}</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="admin-role-pill text-[10px] font-bold py-0.5 px-2 rounded-full border border-border bg-muted/40">
                    {ROLES[author.role as Role]?.name ?? author.role}
                  </span>
                </td>
                <td className={cn(
                  "admin-author-productivity__num tabular-nums font-semibold py-2.5 px-3 text-right text-[13px]",
                  sortBy === 'total' && "text-sky-500 bg-sky-500/5 font-bold"
                )}>
                  {formatNumber(author.total)}
                </td>
                {PERIODS.map((p) => (
                  <td
                    key={p.key}
                    className={cn(
                      'admin-author-productivity__num tabular-nums py-2.5 px-3 text-right text-[13px]',
                      sortBy === p.key && 'text-sky-500 bg-sky-500/5 font-bold',
                    )}
                  >
                    {formatNumber(author[p.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/10 font-semibold border-t border-border/40">
              <td colSpan={2} className="admin-author-productivity__total-label py-2.5 px-3">Newsroom total</td>
              <td className={cn(
                "admin-author-productivity__num tabular-nums py-2.5 px-3 text-right font-bold text-[13px]",
                sortBy === 'total' && "text-sky-500 bg-sky-500/5 font-extrabold"
              )}>
                {formatNumber(totals.total)}
              </td>
              {PERIODS.map((p) => (
                <td
                  key={p.key}
                  className={cn(
                    'admin-author-productivity__num tabular-nums py-2.5 px-3 text-right font-bold text-[13px]',
                    sortBy === p.key && 'text-sky-500 bg-sky-500/5 font-extrabold',
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