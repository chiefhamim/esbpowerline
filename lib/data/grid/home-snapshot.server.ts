import { cache } from 'react';
import { getLatestAvailableDate } from '@/lib/data/grid/available-dates';
import { loadDailyReportFromDisk } from '@/lib/data/grid/daily-loader.server';
import { getLatestSredaDaily } from '@/lib/data/sreda/daily-loader.server';
import { buildHomeSnapshotFromDaily, type HomeSnapshotStat } from '@/lib/data/grid/home-snapshot-core';

export type { HomeSnapshotStat, DailySnapshotLabel } from '@/lib/data/grid/home-snapshot-core';
export {
  DAILY_SNAPSHOT_LABELS,
  buildHomeSnapshotFromDaily,
  POWER_UNIT,
  gwhToAvgMw,
} from '@/lib/data/grid/home-snapshot-core';

export const getLatestHomeSnapshot = cache(async (): Promise<{
  date: string;
  stats: HomeSnapshotStat[];
} | null> => {
  const isoDate = getLatestAvailableDate();
  if (!isoDate) return null;

  const [result, sreda] = await Promise.all([
    loadDailyReportFromDisk(isoDate),
    getLatestSredaDaily(),
  ]);
  if (!result.ok) return null;

  return {
    date: isoDate,
    stats: buildHomeSnapshotFromDaily(result.data, sreda),
  };
});