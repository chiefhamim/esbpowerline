import { isQuarantined } from './constants';
import { loadArchiveDay, loadArchiveIndex } from './loadArchive';
import type {
  PetrobanglaDaily,
  PetrobanglaIndex,
  PetrobanglaIndexDay,
  PetrobanglaLiveWeekBundle,
} from './types';

export const LIVE_WEEK_COUNT = 7;
export const LIVE_WEEK_MAX = 30;
export const LIVE_WEEK_PRESETS = [7, 15, 30] as const;
export type LiveWeekPreset = (typeof LIVE_WEEK_PRESETS)[number];

let liveWeekCache: PetrobanglaLiveWeekBundle | null = null;

export function pickLiveWeekEntries(
  index: PetrobanglaIndex,
  count = LIVE_WEEK_MAX,
): PetrobanglaIndexDay[] {
  const ok = index.days
    .filter((d) => d.parse_status === 'ok' && !isQuarantined(d.date))
    .sort((a, b) => a.date.localeCompare(b.date));
  return ok.slice(-Math.min(count, LIVE_WEEK_MAX));
}

export function sliceLiveWeekBundle(
  bundle: PetrobanglaLiveWeekBundle,
  count: LiveWeekPreset,
): PetrobanglaLiveWeekBundle {
  const days = bundle.days.slice(-count);
  const index_entries = bundle.index_entries.slice(-count);
  const latest = index_entries[index_entries.length - 1];
  return {
    ...bundle,
    live_week_count: count,
    days,
    index_entries,
    latest_date: latest?.date ?? bundle.latest_date,
    latest_label: latest?.date_label ?? bundle.latest_label,
  };
}

export async function loadLiveWeekBundle(): Promise<PetrobanglaLiveWeekBundle> {
  if (liveWeekCache) return liveWeekCache;

  try {
    const res = await fetch('/data/petrobangla/_live_week.json');
    if (res.ok) {
      const bundle = (await res.json()) as PetrobanglaLiveWeekBundle;
      if (bundle.days?.length >= LIVE_WEEK_MAX) {
        liveWeekCache = bundle;
        return bundle;
      }
    }
  } catch {
    /* fall through */
  }

  const index = await loadArchiveIndex();
  const entries = pickLiveWeekEntries(index, LIVE_WEEK_MAX);
  const days = await Promise.all(
    entries.map(async (entry) => {
      const fileDate = entry.json_file?.replace('.json', '') ?? entry.date;
      try {
        return await loadArchiveDay(fileDate);
      } catch {
        return await loadArchiveDay(entry.date);
      }
    }),
  );

  const latest = entries[entries.length - 1];
  const bundle: PetrobanglaLiveWeekBundle = {
    generated_at: new Date().toISOString(),
    live_week_count: entries.length,
    latest_date: latest?.date ?? null,
    latest_label: latest?.date_label ?? null,
    index_entries: entries,
    days: days.filter(Boolean) as PetrobanglaDaily[],
  };
  liveWeekCache = bundle;
  return bundle;
}

export function isDateInLiveWeek(gridDate: string, bundle: PetrobanglaLiveWeekBundle): boolean {
  return bundle.index_entries.some((e) => e.date === gridDate);
}

export function formatLiveWeekDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function clearLiveWeekCache() {
  liveWeekCache = null;
}