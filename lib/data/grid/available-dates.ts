import availableDatesJson from '@/lib/available-dates.json';
import { parseIsoDate } from '@/lib/data/grid/date-utils';

const ISO_DATE_RE = /^(201[1-9]|202[0-9])-\d{2}-\d{2}$/;

function sanitizeAvailableDates(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const cleaned: string[] = [];
  for (const entry of raw) {
    const value = String(entry).trim();
    if (!ISO_DATE_RE.test(value)) continue;
    if (!parseIsoDate(value)) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    cleaned.push(value);
  }
  cleaned.sort();
  return cleaned;
}

/** Canonical list of available daily report dates (YYYY-MM-DD), sorted ascending. */
export const availableDates: string[] = sanitizeAvailableDates(availableDatesJson);

export function getLatestAvailableDate(): string | null {
  return availableDates.length > 0 ? availableDates[availableDates.length - 1] : null;
}

export function isDateAvailable(isoDate: string): boolean {
  return availableDates.includes(isoDate);
}