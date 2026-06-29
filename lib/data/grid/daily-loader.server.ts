import type { GridDailyData } from '@/lib/data/grid/types';
import {
  parseIsoDate,
  resolveDailyLoadFromStatus,
  type DailyLoadResult,
} from '@/lib/data/grid/daily-loader-core';

export type { DailyLoadResult, DailyLoadSource } from '@/lib/data/grid/daily-loader-core';

/** Server-side read from public/data/daily (Node fs). */
export async function loadDailyReportFromDisk(isoDate: string): Promise<DailyLoadResult> {
  const parsed = parseIsoDate(isoDate);
  if (!parsed) {
    return { ok: false, error: `Invalid date: ${isoDate}` };
  }

  try {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'daily', `${parsed}.json`);
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw) as GridDailyData;
    const result = resolveDailyLoadFromStatus(isoDate, 200, data);
    if (result.ok && result.source === 'network') {
      return { ok: true, data: result.data, source: 'disk' };
    }
    return result;
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? String((err as NodeJS.ErrnoException).code) : '';
    const status = code === 'ENOENT' ? 404 : null;
    return resolveDailyLoadFromStatus(isoDate, status);
  }
}