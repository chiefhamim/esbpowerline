import { z } from 'zod';
import type { GridDailyData } from '@/lib/data/grid/types';
import {
  REQUIRED_GENERATION_FUELS,
  PETROBANGLA_GAS_DISTRIBUTION_COMPANIES,
  PETROBANGLA_GAS_PRODUCTION_COMPANIES,
} from '@/lib/data/grid/types';

const systemStatsSchema = z.object({
  date: z.string().min(1),
  dayPeakGen: z.number(),
  eveningPeakGen: z.number(),
  dayPeakDemand: z.number(),
  eveningPeakDemand: z.number(),
  minGen: z.number(),
  maxGen: z.number(),
  totalEnergyGen: z.number(),
  totalEnergyUnserved: z.number(),
  totalEnergyDemand: z.number(),
  maxTemp: z.number(),
  totalGasSuppliedPower: z.number(),
  avgProductionCost: z.number(),
  totalDailyCost: z.number(),
});

const generationItemSchema = z.object({
  name: z.string(),
  gen: z.number(),
  cost: z.number(),
  unitCost: z.number(),
  color: z.string(),
});

const gasProductionSchema = z.object({
  company: z.string(),
  fields: z.number(),
  gas: z.number(),
  condensate: z.number(),
  share: z.number(),
});

const gasDistributionSchema = z.object({
  company: z.string(),
  power: z.number(),
  fertilizer: z.number(),
  others: z.number(),
  total: z.number(),
});

export const dailyReportSchema = z.object({
  systemStats: systemStatsSchema,
  generationData: z.array(generationItemSchema).min(1),
  gasProductionData: z.array(gasProductionSchema).optional(),
  gasDistributionData: z.array(gasDistributionSchema).optional(),
  borderImportsData: z.array(z.object({
    source: z.string(),
    energy: z.number(),
    peakFlow: z.number(),
    type: z.string(),
  })).optional(),
  regionalDemandData: z.array(z.object({
    zone: z.string(),
    loadShed: z.number(),
    demand: z.number(),
    pct: z.number(),
  })).optional(),
  dailyOutages: z.array(z.object({
    time: z.string(),
    plant: z.string(),
    load: z.string(),
    reason: z.string(),
    full_desc: z.string().optional(),
  })).optional(),
  hourlyLoadData: z.array(z.object({
    time: z.string(),
    generation: z.number(),
    loadShed: z.number(),
    demand: z.number(),
  })).optional(),
});

export type DailyReportValidation = z.SafeParseReturnType<GridDailyData, GridDailyData>;

export function validateDailyReport(data: unknown): DailyReportValidation {
  return dailyReportSchema.safeParse(data);
}

function warnCompanyNames(report: GridDailyData, isoDate: string): void {
  if (!report.gasProductionData?.length) return;
  for (const row of report.gasProductionData) {
    const known = PETROBANGLA_GAS_PRODUCTION_COMPANIES.some((name) => row.company.startsWith(name.split(' ')[0]));
    if (!known && process.env.NODE_ENV === 'development') {
      console.warn(`[daily-report] Unknown gas production company "${row.company}" on ${isoDate}`);
    }
  }
  if (report.gasDistributionData?.length) {
    for (const row of report.gasDistributionData) {
      const known = PETROBANGLA_GAS_DISTRIBUTION_COMPANIES.some((name) => row.company.startsWith(name.split(' ')[0]));
      if (!known && process.env.NODE_ENV === 'development') {
        console.warn(`[daily-report] Unknown gas distribution company "${row.company}" on ${isoDate}`);
      }
    }
  }
}

/** Dev-time schema warning — no-op in production builds unless explicitly enabled. */
export function warnIfInvalidDailyReport(data: unknown, isoDate: string): void {
  if (process.env.NODE_ENV === 'production' && process.env.DAILY_REPORT_VALIDATE !== '1') {
    return;
  }
  const result = validateDailyReport(data);
  if (!result.success) {
    console.warn(`[daily-report] Schema validation failed for ${isoDate}:`, result.error.flatten());
    return;
  }
  const fuels = new Set(result.data.generationData.map((g) => g.name));
  for (const expected of REQUIRED_GENERATION_FUELS) {
    if (!fuels.has(expected) && process.env.NODE_ENV === 'development') {
      console.warn(`[daily-report] Missing generation fuel "${expected}" on ${isoDate}`);
    }
  }
  warnCompanyNames(result.data, isoDate);
}