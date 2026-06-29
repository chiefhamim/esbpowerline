import type { GridDailyData } from '@/lib/data/grid/types';
import {
  dailyReportPath,
  parseIsoDate,
  resolveDailyLoadFromStatus,
  type DailyLoadResult,
} from '@/lib/data/grid/daily-loader-core';

export type { DailyLoadResult, DailyLoadSource } from '@/lib/data/grid/daily-loader-core';

/** Client-side fetch of a daily PGCB report JSON. */
export async function fetchDailyReport(isoDate: string): Promise<DailyLoadResult> {
  const parsed = parseIsoDate(isoDate);
  if (!parsed) {
    return { ok: false, error: `Invalid date: ${isoDate}` };
  }

  try {
    const res = await fetch(dailyReportPath(parsed), { cache: 'no-store' });
    if (!res.ok) {
      return resolveDailyLoadFromStatus(isoDate, res.status);
    }
    const data = (await res.json()) as GridDailyData;
    return resolveDailyLoadFromStatus(isoDate, res.status, data);
  } catch {
    return resolveDailyLoadFromStatus(isoDate, null);
  }
}