/** SREDA National Database of Renewable Energy — daily snapshot types. */

export interface SredaRenewableTechRow {
  tech: string;
  offGridMw: number;
  onGridMw: number;
  totalMw: number;
}

export interface SredaGenerationMixRow {
  fuel: string;
  capacityMw: number;
  sharePct: number;
}

export interface SredaDailyData {
  /** ISO date (YYYY-MM-DD) derived from SREDA Last Update timestamp. */
  date: string;
  /** Raw timestamp from SREDA footer, e.g. 2026-06-29 16:16:30 */
  lastUpdate: string;
  sourceUrl: string;
  /** Total RE installed capacity (MW) from homepage headline. */
  totalRenewableMw: number;
  renewableTech: SredaRenewableTechRow[];
  /** RE share of national installed capacity mix (%). */
  reGridSharePct: number;
  /** Total national installed capacity (MW) from generation mix page. */
  totalInstalledMw: number;
  generationMix: SredaGenerationMixRow[];
  scrapedAt: string;
}