import { format } from 'date-fns';

const DATETIME_LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

export function isDatetimeLocalString(value: string): boolean {
  return DATETIME_LOCAL_RE.test(value);
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Parse `YYYY-MM-DDTHH:mm` as local wall time (SSR-safe for a given string). */
export function parseDatetimeLocal(value: string): Date | null {
  const match = value.match(DATETIME_LOCAL_RE);
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10),
    0,
    0,
  );
}

export function toDatetimeLocalFromDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toDatetimeLocal(value?: string | Date | null): string {
  if (!value) return '';
  if (typeof value === 'string' && isDatetimeLocalString(value)) return value;

  const d =
    typeof value === 'string'
      ? new Date(value)
      : value instanceof Date
        ? value
        : new Date(value);

  if (Number.isNaN(d.getTime())) return '';
  return toDatetimeLocalFromDate(d);
}

export function formatDatetimeLocalDate(value: string, pattern = 'EEE, d MMM yyyy'): string {
  const parsed = parseDatetimeLocal(value);
  return parsed ? format(parsed, pattern) : '';
}

export function datetimeLocalToISO(value: string): string | null {
  const parsed = parseDatetimeLocal(value);
  return parsed ? parsed.toISOString() : null;
}