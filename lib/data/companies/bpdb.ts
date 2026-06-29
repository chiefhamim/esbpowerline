export interface BpdbFinancialYear {
  year: string;
  revenue: number;
  cost: number;
  subsidy: number;
  loss: number;
}

/** BPDB audited financials (indicative, crore BDT). */
export const bpdbAuditedFinancials: BpdbFinancialYear[] = [
  { year: 'FY 10', revenue: 8500, cost: 9200, subsidy: 900, loss: -150 },
  { year: 'FY 12', revenue: 13400, cost: 20200, subsidy: 6300, loss: -500 },
  { year: 'FY 14', revenue: 18900, cost: 25200, subsidy: 6100, loss: -200 },
  { year: 'FY 16', revenue: 24500, cost: 28400, subsidy: 3800, loss: -100 },
  { year: 'FY 18', revenue: 29800, cost: 34500, subsidy: 4500, loss: -200 },
  { year: 'FY 20', revenue: 36200, cost: 44400, subsidy: 7440, loss: -920 },
  { year: 'FY 21', revenue: 39100, cost: 50200, subsidy: 11700, loss: -1890 },
  { year: 'FY 22', revenue: 42300, cost: 71900, subsidy: 29700, loss: -2300 },
  { year: 'FY 23', revenue: 50900, cost: 98600, subsidy: 39500, loss: -4500 },
  { year: 'FY 24', revenue: 58200, cost: 110800, subsidy: 38300, loss: -6200 },
  { year: 'FY 26', revenue: 64800, cost: 121500, subsidy: 39000, loss: -8000 },
];

/** Homepage snapshot defaults derived from latest PGCB daily report. */
export const bpdbSnapshotDefaults = {
  generationCapacityMw: '28420',
  snapshotDate: '2026-06-29',
} as const;