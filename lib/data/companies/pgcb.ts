import pgcbMonthlyDataJson from '@/lib/pgcb-monthly-data.json';

export type PgcbMonthlyRecord = (typeof pgcbMonthlyDataJson)[number];

/** PGCB monthly archive records parsed from historical reports. */
export const pgcbMonthlyData: PgcbMonthlyRecord[] = pgcbMonthlyDataJson as PgcbMonthlyRecord[];

export function getLatestMonthlyDateKey(): string | null {
  if (!pgcbMonthlyData.length) return null;
  return pgcbMonthlyData[pgcbMonthlyData.length - 1].date_key;
}