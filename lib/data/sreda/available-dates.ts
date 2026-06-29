import availableDatesJson from '@/lib/sreda-available-dates.json';
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

export const sredaAvailableDates: string[] = sanitizeAvailableDates(availableDatesJson);

export function getLatestSredaDate(): string | null {
  return sredaAvailableDates.length > 0
    ? sredaAvailableDates[sredaAvailableDates.length - 1]
    : null;
}

export function isSredaDateAvailable(isoDate: string): boolean {
  return sredaAvailableDates.includes(isoDate);
}