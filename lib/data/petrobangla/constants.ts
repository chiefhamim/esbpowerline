export const PB_ARCHIVE_COLORS = {
  domestic: '#0ea5e9',
  lng: '#a855f7',
  shortage: '#ef4444',
  fertilizer: '#f59e0b',
  others: '#64748b',
  /** Near-white — stack fills only; use totalLine for chart strokes and legends */
  total: '#f8fafc',
  totalLine: '#94a3b8',
  ma: '#64748b',
  powerDemand: '#ef4444',
  /** Power supply area — matches grid explorer orange accent */
  powerSupply: '#f97316',
  national: '#0ea5e9',
} as const;

export const QUARANTINE_DATES = new Set([
  '2020-02-04',
  '2020-02-05',
  '2020-03-06',
  '2020-09-17',
  '2020-10-16',
  '2020-10-17',
  '2020-10-18',
  '2020-10-19',
  '2025-05-20',
  '2025-05-21',
  '2025-05-22',
  '2026-02-22',
]);

export const ARCHIVE_BASELINE_DATE = '2020-01-11';
export const ARCHIVE_BASELINE_GAS = 3167.9;
export const ARCHIVE_START_DATE = '2020-01-11';

export const MAJOR_FIELDS = [
  'Bibiyana',
  'Titas',
  'Jalalabad',
  'Habiganj',
  'Rashidpur',
  'Shahbazpur',
  'R-LNG Terminal',
  'Bangora',
] as const;

export const ARCHIVE_INSIGHTS = {
  jan2020Baseline: { gas: 3167.9, date: '2020-01-11', powerFulfillment: 55.2 },
  jun2026Latest: { gas: 2643.0, date: '2026-06-30', powerFulfillment: 39.6 },
  nationalDecline: { mmcfd: -524.9, pct: -16.6 },
  bibiyanaDecline: { from: 1301, to: 753, pct: -42, wells: 26 },
  lngRamp: { from: 592, to: 1003, pct: 69 },
  powerFulfillmentCollapse: { from: 55.2, to: 39.6 },
  totalFieldRecords: 51948,
  coverageDays: 2246,
  coverageEnd: '2026-06-30', // latest ok gas-day in archive index
} as const;

export function isQuarantined(date: string): boolean {
  return QUARANTINE_DATES.has(date);
}

/** Official site where daily gas intake/offtake reports are published */
export const PETROBANGLA_OFFICIAL_SITE = 'https://www.petrobangla.org.bd/';

export const PETROBANGLA_OFFICIAL_LABEL = 'Petrobangla P&D Division';