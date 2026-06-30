import type { GridDailyData } from '@/lib/data/grid/types';
import { parseIsoDate, dailyReportPath } from '@/lib/data/grid/date-utils';
import { getArchiveFallback } from '@/lib/data/grid/archive-fallback';
import { warnIfInvalidDailyReport } from '@/lib/data/grid/validate-daily-report';
import { shouldUseArchiveFallback } from '@/lib/data/grid/daily-access';

export type DailyLoadSource = 'network' | 'archive' | 'disk';

export type DailyLoadResult =
  | { ok: true; data: GridDailyData; source: DailyLoadSource }
  | { ok: false; error: string; status?: number };

export function resolveDailyLoadFromStatus(
  isoDate: string,
  httpStatus: number | null,
  data?: GridDailyData,
): DailyLoadResult {
  const parsed = parseIsoDate(isoDate);
  if (!parsed) {
    return { ok: false, error: `Invalid date: ${isoDate}` };
  }

  if (httpStatus !== null && httpStatus >= 200 && httpStatus < 300 && data) {
    warnIfInvalidDailyReport(data, parsed);
    return { ok: true, data, source: 'network' };
  }

  if (shouldUseArchiveFallback(httpStatus)) {
    const fallback = getArchiveFallback(parsed);
    if (fallback) {
      return { ok: true, data: fallback, source: 'archive' };
    }
    if (httpStatus === 404) {
      return { ok: false, error: `Daily report not found for ${parsed}`, status: 404 };
    }
    return { ok: false, error: 'Network error while loading daily report' };
  }

  if (httpStatus === 403) {
    return { ok: false, error: 'tier_locked', status: 403 };
  }

  const status = httpStatus ?? 0;
  return { ok: false, error: `HTTP ${status}`, status };
}

export { dailyReportPath, parseIsoDate };