import { bercBulkTariffHistory } from '@/lib/data/companies/berc';

/** Wholesale tariff vs unit production cost (Tk/KWh). */
export const macroTariffData = [
  { year: 'FY 2020', cost: 5.91, tariff: 5.02 },
  { year: 'FY 2021', cost: 6.61, tariff: 5.02 },
  { year: 'FY 2022', cost: 8.50, tariff: 5.02 },
  { year: 'FY 2023', cost: 11.33, tariff: 6.70 },
  { year: 'FY 2024', cost: 12.10, tariff: 7.04 },
  { year: 'FY 2026', cost: 12.91, tariff: 8.39 },
] as const;

export { bercBulkTariffHistory };