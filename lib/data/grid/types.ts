/** Shared TypeScript types for PGCB daily grid reports. */

export interface GridSystemStats {
  date: string;
  dayPeakGen: number;
  eveningPeakGen: number;
  dayPeakDemand: number;
  eveningPeakDemand: number;
  minGen: number;
  maxGen: number;
  totalEnergyGen: number;
  totalEnergyUnserved: number;
  totalEnergyDemand: number;
  maxTemp: number;
  totalGasSuppliedPower: number;
  avgProductionCost: number;
  totalDailyCost: number;
}

export interface GridGenerationItem {
  name: string;
  gen: number;
  cost: number;
  unitCost: number;
  color: string;
}

export interface GasProductionItem {
  company: string;
  fields: number;
  gas: number;
  condensate: number;
  share: number;
}

export interface GasDistributionItem {
  company: string;
  power: number;
  fertilizer: number;
  others: number;
  total: number;
}

export interface BorderImportItem {
  source: string;
  energy: number;
  peakFlow: number;
  type: string;
}

export interface RegionalDemandItem {
  zone: string;
  loadShed: number;
  demand: number;
  pct: number;
}

export interface DailyOutageItem {
  time: string;
  plant: string;
  load: string;
  reason: string;
  full_desc?: string;
}

export interface HourlyLoadItem {
  time: string;
  generation: number;
  loadShed: number;
  demand: number;
}

export interface GridDailyData {
  systemStats: GridSystemStats;
  generationData: GridGenerationItem[];
  gasProductionData?: GasProductionItem[];
  gasDistributionData?: GasDistributionItem[];
  borderImportsData?: BorderImportItem[];
  regionalDemandData?: RegionalDemandItem[];
  dailyOutages?: DailyOutageItem[];
  hourlyLoadData?: HourlyLoadItem[];
}

/** Known Petrobangla gas production entity names (full company labels). */
export const PETROBANGLA_GAS_PRODUCTION_COMPANIES = [
  'BGFCL (Titas, Habiganj, Bakhrabad)',
  'SGFL (Sylhet, Rashidpur, Kailashtila)',
  'BAPEX (Shahbazpur, Srikail, Begumganj)',
  'Chevron (Bibiyana, Jalalabad, Moulavibazar)',
  'Tullow (Bangora)',
  'RPGCL (R-LNG Import / LNG Terminal)',
] as const;

/** Known Petrobangla gas distribution company names. */
export const PETROBANGLA_GAS_DISTRIBUTION_COMPANIES = [
  'TGTDCL (Dhaka & Mymensingh)',
  'BGDCL (Cumilla & Sylhet)',
  'KGDCL (Chattogram)',
  'JGTDSL (Sylhet region)',
  'PGCL (Rajshahi & Rangpur)',
  'SGCL (Barishal & Khulna)',
] as const;

/** Required fuels in daily generationData. Wind is optional (often absent in PGCB reports). */
export const REQUIRED_GENERATION_FUELS = [
  'Gas',
  'Coal',
  'HFO',
  'Hydro',
  'Solar',
  'Imports',
  'HSD (Diesel)',
] as const;

export const OPTIONAL_GENERATION_FUELS = ['Wind'] as const;

/** @deprecated Use REQUIRED_GENERATION_FUELS — Wind is optional. */
export const EXPECTED_GENERATION_FUELS = [...REQUIRED_GENERATION_FUELS, ...OPTIONAL_GENERATION_FUELS] as const;