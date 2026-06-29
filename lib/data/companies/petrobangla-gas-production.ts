import type { GasProductionItem } from '@/lib/data/grid/types';

/** Default Petrobangla gas production snapshot — canonical 2026-06-22.json. */
export const defaultGasProductionData: GasProductionItem[] = [
  { company: 'BGFCL (Titas, Habiganj, Bakhrabad)', fields: 5, gas: 478.7, condensate: 371.8, share: 18.4 },
  { company: 'SGFL (Sylhet, Rashidpur, Kailashtila)', fields: 5, gas: 93.9, condensate: 334.2, share: 3.6 },
  { company: 'BAPEX (Shahbazpur, Srikail, Begumganj)', fields: 9, gas: 92.4, condensate: 59.3, share: 3.6 },
  { company: 'Chevron (Bibiyana, Jalalabad, Moulavibazar)', fields: 3, gas: 897.4, condensate: 4702.6, share: 34.5 },
  { company: 'Tullow (Bangora)', fields: 1, gas: 31.2, condensate: 93.0, share: 1.2 },
  { company: 'RPGCL (R-LNG Import / LNG Terminal)', fields: 0, gas: 1008.0, condensate: 0.0, share: 38.7 },
];