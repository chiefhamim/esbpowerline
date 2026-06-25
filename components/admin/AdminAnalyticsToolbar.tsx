'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Calendar, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnalyticsPeriod } from '@/lib/analytics-period';
import { PERIOD_LABELS, PERIOD_ACCENTS } from '@/lib/analytics-period';
import { AdminSelectMenu } from '@/components/admin/AdminSelectMenu';

const PERIODS: AnalyticsPeriod[] = ['daily', 'weekly', 'monthly', 'yearly'];

type MonthOption = {
  value: string;
  label: string;
  count?: number;
  description?: string;
  dot?: string;
};

export function AdminAnalyticsToolbar({
  period,
  month,
  monthOptions,
  rangeLabel,
}: {
  period: AnalyticsPeriod;
  month: string | null;
  monthOptions: MonthOption[];
  rangeLabel: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const navigate = useCallback(
    (next: { period?: AnalyticsPeriod; month?: string | null }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.period) params.set('period', next.period);
      if (next.month !== undefined) {
        if (next.month) params.set('month', next.month);
        else params.delete('month');
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  const selectedMonth = month ? monthOptions.find((o) => o.value === month) : null;

  return (
    <div className="admin-analytics-toolbar">
      <div className="admin-analytics-toolbar-meta">
        <span className="admin-analytics-toolbar-range">{rangeLabel}</span>
        {month && (
          <span className="admin-analytics-toolbar-badge">Month focus</span>
        )}
        {pending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      </div>

      <div className="admin-analytics-toolbar-controls">
        <div className="admin-analytics-toolbar-cluster">
          <div className="admin-analytics-period-pills" role="tablist" aria-label="Time period">
            {PERIODS.map((p) => {
              const isActive = month ? p === 'monthly' : period === p;
              return (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  disabled={pending}
                  data-period={p}
                  className={cn('admin-analytics-period-pill', isActive && 'admin-analytics-period-pill--active')}
                  style={{ '--pill-accent': PERIOD_ACCENTS[p] } as React.CSSProperties}
                  onClick={() => navigate({ period: p, month: null })}
                >
                  {PERIOD_LABELS[p]}
                </button>
              );
            })}
          </div>

          <div className="admin-analytics-month-control">
            {month && (
              <button
                type="button"
                className="admin-analytics-month-clear"
                disabled={pending}
                onClick={() => navigate({ month: null })}
                aria-label="Return to rolling range"
              >
                <X className="icon-sm" />
                <span>Rolling</span>
              </button>
            )}
            <AdminSelectMenu
              value={month ?? ''}
              onChange={(val) => {
                if (val) navigate({ period: 'monthly', month: val });
              }}
              options={monthOptions}
              icon={Calendar}
              placeholder="Calendar month"
              menuTitle="Pick a calendar month"
              className="admin-analytics-month-menu"
              minWidth="15.5rem"
            />
          </div>
        </div>
      </div>

      {month && selectedMonth && (
        <p className="admin-analytics-toolbar-hint">
          Viewing <strong>{selectedMonth.label}</strong> day-by-day
          {selectedMonth.description ? ` · ${selectedMonth.description}` : ''}
          {' '}— compared to the prior calendar month
        </p>
      )}
      {!month && (
        <p className="admin-analytics-toolbar-hint admin-analytics-toolbar-hint--subtle">
          Use period tabs for rolling ranges, or pick a calendar month for daily breakdown and MoM comparison.
        </p>
      )}
    </div>
  );
}