import type { GasDistributionItem } from '@/lib/data/grid/types';

/** Default Petrobangla gas distribution snapshot — canonical 2026-06-22.json. */
export const defaultGasDistributionData: GasDistributionItem[] = [
  { company: 'TGTDCL (Dhaka & Mymensingh)', power: 267.4, fertilizer: 73.1, others: 1069.8, total: 1410.3 },
  { company: 'BGDCL (Cumilla & Sylhet)', power: 206.7, fertilizer: 0.0, others: 87.4, total: 294.1 },
  { company: 'KGDCL (Chattogram)', power: 37.6, fertilizer: 38.5, others: 170.0, total: 246.1 },
  { company: 'JGTDSL (Sylhet region)', power: 224.5, fertilizer: 40.1, others: 114.4, total: 379.0 },
  { company: 'PGCL (Rajshahi & Rangpur)', power: 126.9, fertilizer: 0.0, others: 29.2, total: 156.0 },
  { company: 'SGCL (Barishal & Khulna)', power: 54.2, fertilizer: 0.0, others: 4.3, total: 58.5 },
];