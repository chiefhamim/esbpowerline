import { isQuarantined } from './constants';
import type {
  PetrobanglaDaily,
  PetrobanglaIndex,
  PetrobanglaTimelineSummary,
} from './types';
import { QuarantinedDayError } from './types';

let indexCache: PetrobanglaIndex | null = null;
let timelineCache: PetrobanglaTimelineSummary | null = null;
const dayCache = new Map<string, PetrobanglaDaily>();

export async function loadArchiveIndex(): Promise<PetrobanglaIndex> {
  if (indexCache) return indexCache;
  const res = await fetch('/data/petrobangla/_index.json');
  if (!res.ok) throw new Error('Failed to load Petrobangla archive index');
  indexCache = (await res.json()) as PetrobanglaIndex;
  return indexCache;
}

export async function loadArchiveTimeline(): Promise<PetrobanglaTimelineSummary> {
  if (timelineCache) return timelineCache;
  const res = await fetch('/data/petrobangla/timeline-summary.json');
  if (!res.ok) throw new Error('Failed to load Petrobangla timeline summary');
  timelineCache = (await res.json()) as PetrobanglaTimelineSummary;
  return timelineCache;
}

export async function loadArchiveDay(
  date: string,
  { allowPartial = false }: { allowPartial?: boolean } = {},
): Promise<PetrobanglaDaily> {
  if (dayCache.has(date)) return dayCache.get(date)!;

  const res = await fetch(`/data/petrobangla/daily/${date}.json`);
  if (!res.ok) throw new Error(`Archive day not found: ${date}`);
  const data = (await res.json()) as PetrobanglaDaily;

  if (data.meta.parse_status !== 'ok' && !allowPartial) {
    throw new QuarantinedDayError(date);
  }
  if (isQuarantined(date) && !allowPartial) {
    throw new QuarantinedDayError(date);
  }

  dayCache.set(date, data);
  return data;
}

export function clearArchiveDayCache() {
  dayCache.clear();
}

export async function preloadArchiveDays(dates: string[]): Promise<Map<string, PetrobanglaDaily>> {
  const map = new Map<string, PetrobanglaDaily>();
  await Promise.all(
    dates.map(async (d) => {
      try {
        map.set(d, await loadArchiveDay(d, { allowPartial: true }));
      } catch {
        /* skip missing */
      }
    }),
  );
  return map;
}