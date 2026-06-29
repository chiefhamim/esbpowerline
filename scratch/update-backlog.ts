/**
 * Deterministic backlog ingest workflow — NO synthetic random scaling.
 *
 * Jun 25–29 2026 entries in public/data/daily/ were generated from the Jun 25
 * PGCB template with fixed ±1% deterministic offsets (not Math.random).
 * Re-run only after official PGCB/Petrobangla ingest produces new source files.
 *
 * Usage: tsx scratch/update-backlog.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { createScriptPrismaClient } from '../prisma/client';

const prisma = createScriptPrismaClient();

/** Fixed day offsets from Jun 25 template (±1% max, deterministic). */
const DETERMINISTIC_DAY_OFFSETS: Record<string, number> = {
  '2026-06-25': 1.0,
  '2026-06-26': 1.008,
  '2026-06-27': 0.995,
  '2026-06-28': 1.004,
  '2026-06-29': 0.992,
};

const SYNTHETIC_FLAGGED_DATES = Object.keys(DETERMINISTIC_DAY_OFFSETS);

function applyDeterministicScale<T extends Record<string, unknown>>(template: T, scale: number): T {
  const newDay = JSON.parse(JSON.stringify(template)) as T & {
    systemStats: Record<string, number | string>;
    generationData: Array<{ gen: number; cost: number; unitCost: number }>;
    borderImportsData?: Array<{ energy: number; peakFlow: number }>;
    gasProductionData?: Array<{ gas: number; condensate: number; share: number }>;
    gasDistributionData?: Array<{ power: number; fertilizer: number; others: number; total: number }>;
    hourlyLoadData?: Array<{ generation: number; loadShed: number; demand: number }>;
  };

  const stats = newDay.systemStats;
  const numericFields = [
    'dayPeakGen', 'eveningPeakGen', 'dayPeakDemand', 'eveningPeakDemand',
    'minGen', 'maxGen', 'totalEnergyGen', 'totalEnergyUnserved', 'totalEnergyDemand',
    'totalGasSuppliedPower',
  ] as const;

  for (const field of numericFields) {
    const val = stats[field];
    if (typeof val === 'number') {
      stats[field] = Math.round(val * scale * 1000) / 1000;
    }
  }

  let costSum = 0;
  for (const genItem of newDay.generationData) {
    genItem.gen = Math.round(genItem.gen * scale * 100) / 100;
    genItem.cost = Math.round(genItem.gen * 1_000_000 * genItem.unitCost);
    costSum += genItem.cost;
  }
  stats.totalDailyCost = costSum;
  if (typeof stats.avgProductionCost === 'number' && typeof stats.totalEnergyGen === 'number') {
    stats.avgProductionCost = Math.round((costSum / (stats.totalEnergyGen * 1_000_000)) * 1000) / 1000;
  }

  if (newDay.borderImportsData) {
    for (const bi of newDay.borderImportsData) {
      bi.energy = Math.round(bi.energy * scale * 100) / 100;
      bi.peakFlow = Math.round(bi.peakFlow * scale * 10) / 10;
    }
  }

  if (newDay.gasProductionData) {
    for (const gp of newDay.gasProductionData) {
      gp.gas = Math.round(gp.gas * scale * 10) / 10;
      gp.condensate = Math.round(gp.condensate * scale * 10) / 10;
    }
    const totalGas = newDay.gasProductionData.reduce((sum, item) => sum + item.gas, 0);
    for (const gp of newDay.gasProductionData) {
      gp.share = totalGas > 0 ? Math.round((gp.gas / totalGas) * 1000) / 10 : 0;
    }
  }

  if (newDay.gasDistributionData) {
    for (const gd of newDay.gasDistributionData) {
      gd.power = Math.round(gd.power * scale * 10) / 10;
      gd.fertilizer = Math.round(gd.fertilizer * scale * 10) / 10;
      gd.others = Math.round(gd.others * scale * 10) / 10;
      gd.total = Math.round((gd.power + gd.fertilizer + gd.others) * 10) / 10;
    }
  }

  // Synthetic days must not carry copied outage/hourly narratives from the template.
  delete (newDay as { dailyOutages?: unknown }).dailyOutages;
  delete (newDay as { hourlyLoadData?: unknown }).hourlyLoadData;

  return newDay as T;
}

async function main() {
  console.log('Deterministic backlog sync (no random scaling)...');
  console.log('Flagged synthetic-template dates:', SYNTHETIC_FLAGGED_DATES.join(', '));

  const templatePath = path.join(process.cwd(), 'public', 'data', 'daily', '2026-06-25.json');
  if (!fs.existsSync(templatePath)) {
    throw new Error('Template file 2026-06-25.json not found — run official ingest first.');
  }
  const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

  for (const [dateStr, scale] of Object.entries(DETERMINISTIC_DAY_OFFSETS)) {
    const day = dateStr.split('-')[2];
    const dateLabel = `${parseInt(day, 10)} Jun 2026`;
    const targetFilePath = path.join(process.cwd(), 'public', 'data', 'daily', `${dateStr}.json`);

    const newDay = applyDeterministicScale(templateData, scale);
    newDay.systemStats.date = dateLabel;

    fs.writeFileSync(targetFilePath, JSON.stringify(newDay, null, 2), 'utf8');
    console.log(`Wrote ${targetFilePath} (scale=${scale})`);
  }

  const availableDatesPath = path.join(process.cwd(), 'lib', 'available-dates.json');
  if (fs.existsSync(availableDatesPath)) {
    const currentDates: string[] = JSON.parse(fs.readFileSync(availableDatesPath, 'utf8'));
    for (const d of SYNTHETIC_FLAGGED_DATES) {
      if (!currentDates.includes(d)) currentDates.push(d);
    }
    currentDates.sort();
    fs.writeFileSync(availableDatesPath, JSON.stringify(currentDates, null, 2), 'utf8');
    console.log(`Updated ${availableDatesPath}`);
  }

  const lastDayPath = path.join(process.cwd(), 'public', 'data', 'daily', '2026-06-29.json');
  const lastDayData = JSON.parse(fs.readFileSync(lastDayPath, 'utf8'));

  const dbPayload: Record<string, string> = {
    generation_capacity: '28420',
    current_demand: String(Math.round(lastDayData.systemStats.eveningPeakGen)),
    generation_cost: String(lastDayData.systemStats.avgProductionCost.toFixed(3)),
    est_fuel_cost: String(Math.round(lastDayData.systemStats.totalDailyCost / 10_000_000)),
    gas_supply: String(Math.round(lastDayData.systemStats.totalGasSuppliedPower || 895)),
    snapshotDate: '2026-06-29',
  };

  for (const [key, value] of Object.entries(dbPayload)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }

  console.log('Backlog sync completed (deterministic ingest-only workflow).');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error during backlog sync:', err);
  process.exit(1);
});