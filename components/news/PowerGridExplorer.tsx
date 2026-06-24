'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import {
  Zap, Activity, Cable, TrendingUp, FileText, BarChart3, MapPin, DollarSign, Database, Droplet, Globe, Sun
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, Line, CartesianGrid, Area, ComposedChart, Legend
} from 'recharts';
import { cn, formatNumber } from '@/lib/utils';
import { useChartTheme } from '@/hooks/useChartTheme';
import {
  GridLiveBadge,
  GridStatusBadge,
  mixColor,
} from '@/components/news/PowerGridChartUI';

// --- DATA STRUCTURES (REAL HISTORICAL SCRAPED DATA 22-23 JUNE 2026) ---

const systemStats = {
  date: '22 Jun 2026',
  dayPeakGen: 14171.86,
  eveningPeakGen: 16154.41,
  dayPeakDemand: 14610.86,
  eveningPeakDemand: 16854.11,
  minGen: 12623.38,
  maxGen: 16154.41,
  totalEnergyGen: 343.27, // MKWHr
  totalEnergyUnserved: 7.26, // MKWHr
  totalEnergyDemand: 350.52, // MKWHr
  maxTemp: 32.8, // °C
  totalGasSuppliedPower: 907.35, // MMCFD
  avgProductionCost: 6.615, // BDT/KWHr
  totalDailyCost: 2270732586, // BDT
};

const generationData = [
  { name: 'Gas', gen: 126.76, cost: 437084202, unitCost: 3.45, color: '#0ea5e9' },
  { name: 'Coal', gen: 123.30, cost: 816663902, unitCost: 6.62, color: '#64748b' },
  { name: 'HFO', gen: 35.03, cost: 632836198, unitCost: 18.06, color: '#f97316' },
  { name: 'Hydro', gen: 2.27, cost: 227438, unitCost: 0.10, color: '#06b6d4' },
  { name: 'Solar', gen: 2.99, cost: 47087759, unitCost: 15.77, color: '#eab308' },
  { name: 'Wind', gen: 0.19, cost: 2789016, unitCost: 14.71, color: '#10b981' },
  { name: 'Imports', gen: 52.72, cost: 334044072, unitCost: 6.34, color: '#a855f7' },
  { name: 'HSD (Diesel)', gen: 0.00, cost: 0, unitCost: 0.00, color: '#ef4444' },
];

const gasProductionData = [
  { company: 'BGFCL (Titas, Habiganj, Bakhrabad)', fields: 5, gas: 478.6, condensate: 371.8, share: 18.1 },
  { company: 'SGFL (Sylhet, Rashidpur, Kailashtila)', fields: 5, gas: 139.8, condensate: 638.0, share: 5.3 },
  { company: 'BAPEX (Shahbazpur, Srikail, Begumganj)', fields: 9, gas: 92.4, condensate: 59.3, share: 3.5 },
  { company: 'Chevron (Bibiyana, Jalalabad, Moulavibazar)', fields: 3, gas: 928.7, condensate: 4795.5, share: 35.1 },
  { company: 'Tullow (Bangora)', fields: 1, gas: 31.2, condensate: 93.0, share: 1.2 },
  { company: 'RPGCL (R-LNG Import / LNG Terminal)', fields: 0, gas: 1008.0, condensate: 0.0, share: 38.1 },
];

const gasDistributionData = [
  { company: 'TGTDCL (Dhaka & Mymensingh)', power: 267.4, fertilizer: 73.1, others: 1069.8, total: 1410.3 },
  { company: 'BGDCL (Cumilla & Sylhet)', power: 206.7, fertilizer: 0.0, others: 87.4, total: 294.1 },
  { company: 'KGDCL (Chattogram)', power: 37.6, fertilizer: 38.5, others: 170.0, total: 246.1 },
  { company: 'JGTDSL (Sylhet region)', power: 224.5, fertilizer: 40.1, others: 114.4, total: 379.0 },
  { company: 'PGCL (Rajshahi & Rangpur)', power: 126.9, fertilizer: 0.0, others: 29.2, total: 156.0 },
  { company: 'SGCL (Barishal & Khulna)', power: 54.2, fertilizer: 0.0, others: 4.3, total: 58.5 },
];

const borderImportsData = [
  { source: 'HVDC Bheramara (India)', energy: 14.18, peakFlow: 930.0, type: 'C/B Interconnector (West)' },
  { source: 'Adani Godda (India)', energy: 34.05, peakFlow: 1485.6, type: 'C/B Interconnector (North)' },
  { source: 'Tripura Cumilla (India)', energy: 3.58, peakFlow: 168.0, type: 'C/B Interconnector (East)' },
];

const sredaRenewablesData = [
  { tech: 'Solar PV', capacity: 1511.7, share: 83.76, icon: Sun },
  { tech: 'Hydroelectric', capacity: 230.0, share: 12.74, icon: Droplet },
  { tech: 'Wind Energy', capacity: 62.0, share: 3.44, icon: Globe },
  { tech: 'Biogas Power', capacity: 0.69, share: 0.04, icon: Activity },
  { tech: 'Biomass Energy', capacity: 0.40, share: 0.02, icon: Database },
];

const regionalDemandData = [
  { zone: 'Dhaka', loadShed: 88, demand: 5861, pct: 1.5 },
  { zone: 'Chattogram', loadShed: 0, demand: 1526, pct: 0.0 },
  { zone: 'Cumilla', loadShed: 110, demand: 1579, pct: 7.0 },
  { zone: 'Mymensingh', loadShed: 241, demand: 1380, pct: 17.5 },
  { zone: 'Sylhet', loadShed: 0, demand: 627, pct: 0.0 },
  { zone: 'Khulna', loadShed: 31, demand: 1897, pct: 1.6 },
  { zone: 'Barishal', loadShed: 0, demand: 528, pct: 0.0 },
  { zone: 'Rajshahi', loadShed: 0, demand: 1641, pct: 0.0 },
  { zone: 'Rangpur', loadShed: 26, demand: 1002, pct: 2.6 },
];

const dailyOutages = [
  { time: '08:09 - Restore', plant: 'Dhamrai 132/33kV S/S Tr-1', load: 'HT Restored', reason: 'Dhamrai Transformer-1 HT restored successfully.' },
  { time: '08:10 - Restore', plant: 'Dhamrai 132/33kV S/S Tr-1', load: 'LT Restored', reason: 'Dhamrai Transformer-1 LT restored successfully.' },
  { time: '08:39 - Restore', plant: 'Barishal(N)-Madaripur 132kV', load: 'Ckt-2 Restored', reason: 'Backbone line Ckt-2 grid synchronization complete.' },
  { time: '08:48 - Restore', plant: 'Hathazari 230/132kV S/S', load: 'MT-03 HT Restored', reason: 'Substation transformer MT-03 HT grid synchronization.' },
  { time: '08:49 - Restore', plant: 'Narail 132/33kV S/S', load: 'TR2 LT Restored', reason: 'Substation Transformer 2 LT grid synchronization.' },
  { time: '09:07 - 10:26', plant: 'Srinagar 132/33kV S/S Tr-1', load: '20.0 MW Outage', reason: 'Scheduled shutdown for PBS Red-Hot Maintenance.' },
  { time: '09:08 - 10:24', plant: 'Srinagar 132/33kV S/S Tr-1 HT', load: '20.0 MW Outage', reason: 'Scheduled shutdown for PBS Red-Hot Maintenance.' },
  { time: '09:19 - 10:17', plant: 'Srinagar 132/33kV S/S 33kV Bus', load: '20.0 MW Outage', reason: 'Scheduled shutdown for PBS Red-Hot Maintenance.' },
  { time: '09:20 - 09:59', plant: 'Shahjadpur 132/33kV S/S T-2', load: '9.0 MW Outage', reason: 'Forced outage for urgent substation maintenance.' },
  { time: '09:20 - 14:58', plant: 'Shyampur-Shyampur(N) 132kV', load: 'Ckt-1 Outage', reason: 'Scheduled shutdown for opening short-span jumper.' },
  { time: '09:33 - Forced', plant: 'Fatullah-Shyampur(N) 132kV', load: 'Ckt-1 Outage', reason: 'Forced outage by NLDC command.' },
  { time: '10:22 - 12:34', plant: 'Chhatak 132/33kV S/S T-1', load: '12.0 MW Outage', reason: 'Scheduled shutdown for Red-Hot Maintenance on Bus section.' },
  { time: '10:23 - 14:26', plant: 'Khulna(S)-PDB 330MW Ckt-1', load: 'Plant Ckt-1 Outage', reason: 'Scheduled shutdown for maintenance at power plant end.' },
  { time: '11:20 - 11:30', plant: 'Hathazari 230/132kV S/S', load: 'MT-03 HT Outage', reason: 'Scheduled shutdown for Transformer Bushing Measurement.' },
  { time: '14:44 - Restore', plant: 'Brahmanbaria-Narsinghdi 132kV', load: 'Ckt-1 & 2 Restored', reason: 'Brahmanbaria-Narsinghdi line 132kV Ckt-1 & 2 fully restored.' },
  { time: '15:47 - 17:30', plant: 'Daganbhuiyan 132/33kV S/S', load: '14.0 MW Outage', reason: 'Forced outage for Red-Hot Maintenance on Transformer-1.' },
  { time: '16:06 - 17:07', plant: 'Fenchuganj 230/132kV S/S', load: '11.0 MW Outage', reason: 'Scheduled shutdown for PDB feeder line maintenance.' },
  { time: '16:23 - 16:45', plant: 'Chapai 132/33kV S/S T-4', load: '8.0 MW Outage', reason: 'Forced outage for bird nest removal.' },
  { time: '19:02 - Synch', plant: 'Satiya 64 MW Solar 132kV', load: '64 MW Connected', reason: 'Solar plant connected to grid via 132kV Ckt-2.' },
  { time: '06:26 - Outage', plant: 'Dhamrai 132/33kV S/S Tr-1', load: 'Transformer-1 Outage', reason: 'Scheduled shutdown for Red-Hot Maintenance.' }
];

const macroTariffData = [
  { year: 'FY 2020', cost: 5.91, tariff: 5.02 },
  { year: 'FY 2021', cost: 6.61, tariff: 5.02 },
  { year: 'FY 2022', cost: 8.50, tariff: 5.02 },
  { year: 'FY 2023', cost: 11.33, tariff: 6.70 },
  { year: 'FY 2024', cost: 12.10, tariff: 7.04 },
  { year: 'FY 2026', cost: 12.91, tariff: 8.39 },
];

const macroGasData = [
  { year: '2018', domestic: 2750, lng: 0 },
  { year: '2020', domestic: 2350, lng: 550 },
  { year: '2022', domestic: 2100, lng: 800 },
  { year: '2024', domestic: 1850, lng: 950 },
  { year: '2026', domestic: 1639, lng: 1008 },
];

const hourlyLoadData = [
  { time: '00:00', generation: 14867.66, loadShed: 174, demand: 15049.49 },
  { time: '01:00', generation: 14369.99, loadShed: 197, demand: 14575.86 },
  { time: '02:00', generation: 13886.39, loadShed: 213, demand: 14108.98 },
  { time: '03:00', generation: 13620.49, loadShed: 192, demand: 13821.13 },
  { time: '04:00', generation: 13114.79, loadShed: 186, demand: 13309.16 },
  { time: '05:00', generation: 12781.57, loadShed: 176, demand: 12965.49 },
  { time: '06:00', generation: 12623.38, loadShed: 171, demand: 12802.08 },
  { time: '07:00', generation: 12774.42, loadShed: 223, demand: 13007.42 },
  { time: '08:00', generation: 12806.47, loadShed: 197, demand: 13012.47 },
  { time: '09:00', generation: 13134.56, loadShed: 201, demand: 13344.56 },
  { time: '10:00', generation: 13367.80, loadShed: 278, demand: 13658.80 },
  { time: '11:00', generation: 13676.68, loadShed: 346, demand: 14038.68 },
  { time: '12:00', generation: 14171.86, loadShed: 420, demand: 14610.86 },
  { time: '13:00', generation: 14415.72, loadShed: 405, demand: 14838.72 },
  { time: '14:00', generation: 14587.64, loadShed: 236, demand: 14834.64 },
  { time: '15:00', generation: 14723.27, loadShed: 221, demand: 14954.27 },
  { time: '16:00', generation: 14579.40, loadShed: 148, demand: 14734.40 },
  { time: '17:00', generation: 14220.97, loadShed: 138, demand: 14364.97 },
  { time: '18:00', generation: 14179.01, loadShed: 140, demand: 14325.01 },
  { time: '19:00', generation: 15354.07, loadShed: 213, demand: 15577.07 },
  { time: '19:30', generation: 15723.11, loadShed: 1082, demand: 16854.11 },
  { time: '20:00', generation: 15846.44, loadShed: 414, demand: 16279.44 },
  { time: '21:00', generation: 16154.41, loadShed: 496, demand: 16672.41 },
  { time: '22:00', generation: 15718.99, loadShed: 636, demand: 16383.61 },
  { time: '23:00', generation: 15554.84, loadShed: 1236, demand: 16846.46 }
];

const macroEconomicData = [
  { year: '2010', exchangeRate: 69.50, inflation: 8.13, spotLng: 0.0, importCoal: 0.0, retailDiesel: 44.0, retailOctane: 77.0 },
  { year: '2012', exchangeRate: 81.80, inflation: 8.69, spotLng: 0.0, importCoal: 0.0, retailDiesel: 61.0, retailOctane: 94.0 },
  { year: '2014', exchangeRate: 77.60, inflation: 7.35, spotLng: 0.0, importCoal: 0.0, retailDiesel: 68.0, retailOctane: 99.0 },
  { year: '2016', exchangeRate: 78.40, inflation: 5.92, spotLng: 0.0, importCoal: 0.0, retailDiesel: 65.0, retailOctane: 89.0 },
  { year: '2018', exchangeRate: 83.90, inflation: 5.78, spotLng: 8.2, importCoal: 85.0, retailDiesel: 65.0, retailOctane: 89.0 },
  { year: '2020', exchangeRate: 84.90, inflation: 5.65, spotLng: 6.4, importCoal: 70.0, retailDiesel: 65.0, retailOctane: 89.0 },
  { year: '2021', exchangeRate: 84.80, inflation: 5.56, spotLng: 10.2, importCoal: 90.0, retailDiesel: 65.0, retailOctane: 89.0 },
  { year: '2022', exchangeRate: 93.50, inflation: 6.15, spotLng: 35.4, importCoal: 280.0, retailDiesel: 80.0, retailOctane: 130.0 },
  { year: '2023', exchangeRate: 109.20, inflation: 9.02, spotLng: 14.5, importCoal: 140.0, retailDiesel: 109.0, retailOctane: 130.0 },
  { year: '2024', exchangeRate: 117.50, inflation: 9.73, spotLng: 12.5, importCoal: 115.0, retailDiesel: 106.75, retailOctane: 131.0 },
  { year: '2026', exchangeRate: 122.00, inflation: 10.45, spotLng: 11.8, importCoal: 105.0, retailDiesel: 105.50, retailOctane: 125.0 }
];

const bpdbAuditedFinancials = [
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
  { year: 'FY 26', revenue: 64800, cost: 121500, subsidy: 39000, loss: -8000 }
];

const petrobanglaAuditedFinancials = [
  { year: 'FY 10', revenue: 6200, lngCost: 0, netProfit: 350 },
  { year: 'FY 12', revenue: 8400, lngCost: 0, netProfit: 450 },
  { year: 'FY 14', revenue: 12500, lngCost: 0, netProfit: 600 },
  { year: 'FY 16', revenue: 16400, lngCost: 0, netProfit: 800 },
  { year: 'FY 18', revenue: 19200, lngCost: 400, netProfit: 1100 },
  { year: 'FY 20', revenue: 23400, lngCost: 14800, netProfit: 850 },
  { year: 'FY 21', revenue: 25600, lngCost: 17200, netProfit: 600 },
  { year: 'FY 22', revenue: 28100, lngCost: 32800, netProfit: -1900 },
  { year: 'FY 23', revenue: 34500, lngCost: 41200, netProfit: -3400 },
  { year: 'FY 24', revenue: 38900, lngCost: 45500, netProfit: -2800 },
  { year: 'FY 26', revenue: 44200, lngCost: 48900, netProfit: -1200 }
];

const reservesDepletionData = [
  { year: '2026', bau: 7.63, lowGrowth: 7.63, highGrowth: 7.63 },
  { year: '2028', bau: 5.63, lowGrowth: 5.83, highGrowth: 5.43 },
  { year: '2030', bau: 3.83, lowGrowth: 4.13, highGrowth: 3.53 },
  { year: '2032', bau: 2.23, lowGrowth: 2.63, highGrowth: 1.83 },
  { year: '2034', bau: 0.83, lowGrowth: 1.33, highGrowth: 0.33 },
  { year: '2036', bau: 0.00, lowGrowth: 0.23, highGrowth: 0.00 },
  { year: '2038', bau: 0.00, lowGrowth: 0.00, highGrowth: 0.00 }
];

const globalVsDomesticRaw = [
  { year: '1975', globalOil: 11.5, bdDiesel: 1.5, globalCoal: 25.0, bdCoal: 0.0, globalGas: 0.5, bdGas: 0.2, globalSolar: 100.0, bdSolar: 0.0 },
  { year: '1980', globalOil: 36.8, bdDiesel: 4.5, globalCoal: 35.0, bdCoal: 0.0, globalGas: 1.5, bdGas: 0.5, globalSolar: 80.0, bdSolar: 0.0 },
  { year: '1985', globalOil: 27.5, bdDiesel: 8.0, globalCoal: 40.0, bdCoal: 0.0, globalGas: 2.0, bdGas: 0.8, globalSolar: 55.0, bdSolar: 0.0 },
  { year: '1990', globalOil: 23.7, bdDiesel: 11.0, globalCoal: 38.0, bdCoal: 0.0, globalGas: 1.8, bdGas: 1.2, globalSolar: 35.0, bdSolar: 0.0 },
  { year: '1995', globalOil: 17.0, bdDiesel: 12.5, globalCoal: 35.0, bdCoal: 0.0, globalGas: 1.5, bdGas: 1.5, globalSolar: 22.0, bdSolar: 0.0 },
  { year: '2000', globalOil: 28.5, bdDiesel: 15.5, globalCoal: 30.0, bdCoal: 18.0, globalGas: 3.5, bdGas: 2.1, globalSolar: 15.0, bdSolar: 0.0 },
  { year: '2005', globalOil: 54.5, bdDiesel: 28.0, globalCoal: 50.0, bdCoal: 35.0, globalGas: 6.0, bdGas: 3.4, globalSolar: 9.5, bdSolar: 0.0 },
  { year: '2010', globalOil: 79.5, bdDiesel: 44.0, globalCoal: 95.0, bdCoal: 75.0, globalGas: 4.5, bdGas: 4.8, globalSolar: 26.0, bdSolar: 0.0 },
  { year: '2015', globalOil: 52.3, bdDiesel: 65.0, globalCoal: 60.0, bdCoal: 68.0, globalGas: 2.6, bdGas: 6.2, globalSolar: 9.6, bdSolar: 16.0 },
  { year: '2020', globalOil: 41.8, bdDiesel: 65.0, globalCoal: 70.0, bdCoal: 82.0, globalGas: 2.1, bdGas: 9.7, globalSolar: 4.8, bdSolar: 12.0 },
  { year: '2022', globalOil: 99.0, bdDiesel: 80.0, globalCoal: 280.0, bdCoal: 220.0, globalGas: 34.0, bdGas: 11.9, globalSolar: 4.3, bdSolar: 15.0 },
  { year: '2024', globalOil: 82.5, bdDiesel: 106.75, globalCoal: 115.0, bdCoal: 110.0, globalGas: 12.5, bdGas: 14.5, globalSolar: 3.6, bdSolar: 15.77 },
  { year: '2026', globalOil: 78.0, bdDiesel: 105.50, globalCoal: 105.0, bdCoal: 100.0, globalGas: 11.8, bdGas: 16.8, globalSolar: 3.1, bdSolar: 15.77 }
];

const historicalExchangeRates: Record<string, number> = {
  '1975': 12.50,
  '1980': 16.50,
  '1985': 28.00,
  '1990': 35.00,
  '1995': 40.20,
  '2000': 52.10,
  '2005': 64.30,
  '2010': 69.50,
  '2012': 81.80,
  '2014': 77.60,
  '2015': 78.00,
  '2016': 78.40,
  '2018': 83.90,
  '2020': 84.90,
  '2021': 84.80,
  '2022': 93.50,
  '2023': 109.20,
  '2024': 117.50,
  '2026': 122.00
};

const globalVsDomesticData = globalVsDomesticRaw.map(d => {
  const exRate = historicalExchangeRates[d.year] || 122.0;
  return {
    ...d,
    globalSolarBdt: (d.globalSolar * exRate) / 100,
    globalGasBdt: (d.globalGas * exRate) / 28.3,
    globalOilBdt: (d.globalOil * exRate) / 158.987
  };
});

const totalCapacityRenewables = 1804.79;

// --- CUSTOM TAKA ICON ---
function TakaIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="16.5" cy="15.5" r="1.25" fill="currentColor" />
      <path d="M7 7a2 2 0 1 1 4 0v9a3 3 0 0 0 6 0v-.5" />
      <path d="M8 11h6" />
    </svg>
  );
}

interface PowerGridExplorerProps {
  initialMix?: any;
  initialLines?: any;
  initialProjects?: any;
}

export function PowerGridExplorer({ initialMix, initialLines, initialProjects }: PowerGridExplorerProps = {}) {
  const chartTheme = useChartTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'gen' | 'gas' | 'imports' | 'renewables' | 'regional' | 'macro'>('overview');
  const [macroSubTab, setMacroSubTab] = useState<'overview' | 'pricing' | 'global' | 'reports' | 'reserves' | 'insights'>('overview');
  const [reportsCompany, setReportsCompany] = useState<'bpdb' | 'petrobangla'>('bpdb');
  const [chartsReady, setChartsReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setChartsReady(true);
  }, []);

  const tabGlowColors: Record<typeof activeTab, { blob1: string; blob2: string; blob3: string }> = {
    overview: {
      blob1: 'bg-primary/5',
      blob2: 'bg-sky-500/4',
      blob3: 'bg-amber-500/3',
    },
    gen: {
      blob1: 'bg-primary/6',
      blob2: 'bg-blue-600/4',
      blob3: 'bg-cyan-500/3',
    },
    gas: {
      blob1: 'bg-sky-500/6',
      blob2: 'bg-cyan-600/4',
      blob3: 'bg-teal-500/3',
    },
    imports: {
      blob1: 'bg-purple-500/6',
      blob2: 'bg-indigo-600/4',
      blob3: 'bg-violet-500/3',
    },
    renewables: {
      blob1: 'bg-yellow-500/6',
      blob2: 'bg-amber-500/4',
      blob3: 'bg-orange-400/3',
    },
    regional: {
      blob1: 'bg-slate-500/6',
      blob2: 'bg-zinc-500/4',
      blob3: 'bg-sky-500/3',
    },
    macro: {
      blob1: 'bg-emerald-500/6',
      blob2: 'bg-teal-500/4',
      blob3: 'bg-primary/3',
    },
  };

  const glow = tabGlowColors[activeTab] || tabGlowColors.overview;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'gen', label: 'Generation & Cost', icon: Zap },
    { id: 'gas', label: 'Gas & LNG Supply', icon: Droplet },
    { id: 'imports', label: 'C/B Imports', icon: Globe },
    { id: 'renewables', label: 'Renewables (SREDA)', icon: Sun },
    { id: 'regional', label: 'Regional Grid', icon: Cable },
    { id: 'macro', label: 'Macro Trends', icon: TrendingUp },
  ] as const;

  // Overview calculations
  const totalGenMkwhr = generationData.reduce((sum, item) => sum + item.gen, 0);
  const totalCostBdt = generationData.reduce((sum, item) => sum + item.cost, 0);
  const avgCostPerKwh = totalCostBdt / (totalGenMkwhr * 1000000);

  return (
    <div className="grid-explorer relative">
      {/* Dynamic Animated Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-3xl" aria-hidden="true">
        {/* Glow Blobs */}
        <div className={cn("absolute top-[5%] left-[10%] w-[35rem] h-[35rem] rounded-full blur-[120px] grid-glow-blob-1 transition-colors duration-1000", glow.blob1)} />
        <div className={cn("absolute bottom-[15%] right-[5%] w-[30rem] h-[30rem] rounded-full blur-[130px] grid-glow-blob-2 transition-colors duration-1000", glow.blob2)} />
        <div className={cn("absolute top-[45%] left-[45%] w-[38rem] h-[38rem] rounded-full blur-[140px] grid-glow-blob-3 transition-colors duration-1000", glow.blob3)} />
      </div>

      <style>{`
        @keyframes grid-glow-float-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes grid-glow-float-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1.05); }
          33% { transform: translate(-40px, 30px) scale(0.95); }
          66% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes grid-glow-float-3 {
          0%, 100% { transform: translate(0px, 0px) scale(0.95); }
          33% { transform: translate(40px, 40px) scale(1.02); }
          66% { transform: translate(-30px, -30px) scale(0.98); }
        }
        .grid-glow-blob-1 {
          animation: grid-glow-float-1 25s infinite ease-in-out;
        }
        .grid-glow-blob-2 {
          animation: grid-glow-float-2 30s infinite ease-in-out;
        }
        .grid-glow-blob-3 {
          animation: grid-glow-float-3 35s infinite ease-in-out;
        }
        .grid-explorer .card {
          background-color: color-mix(in srgb, hsl(var(--card)) 85%, transparent) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border-color: hsl(var(--border) / 0.55) !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease !important;
        }
        .grid-explorer .card:hover {
          border-color: hsl(var(--primary) / 0.25) !important;
          box-shadow: 0 12px 30px -10px hsl(var(--primary) / 0.08), var(--shadow-lg) !important;
        }
      `}</style>

      {/* KPI Strip */}
      <div className="grid-explorer-kpi-strip relative z-30">
        <div className="grid-explorer-kpi stat group !overflow-visible hover:z-[100]">
          <Zap className="grid-explorer-kpi__icon" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Daily Generation</div>
            <div className="grid-explorer-kpi__value">{systemStats.totalEnergyGen.toFixed(1)} MKWh</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className="absolute hidden group-hover:block text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-[17.5rem] md:w-80 left-0 md:left-1/2 md:-translate-x-1/2 top-[105%] transition-all duration-200 pointer-events-none animate-in fade-in slide-in-from-top-1 bg-card"
            style={{ backgroundColor: 'hsl(var(--card))' }}
          >
            <div className="font-bold text-xs uppercase tracking-wider text-primary border-b border-border/60 pb-1.5 mb-2 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" /> Generation Briefing
            </div>
            <div className="space-y-2 text-[11px] md:text-xs leading-relaxed">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Energy Gen:</span>
                <span className="font-bold text-foreground">{systemStats.totalEnergyGen.toFixed(2)} MKWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Peak Gen:</span>
                <span className="font-bold text-foreground">{formatNumber(Math.round(systemStats.maxGen))} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min Base Gen:</span>
                <span className="font-bold text-foreground">{formatNumber(Math.round(systemStats.minGen))} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unserved (Load Shed):</span>
                <span className="font-bold text-destructive">{systemStats.totalEnergyUnserved.toFixed(2)} MKWh</span>
              </div>
              <div className="pt-1.5 border-t border-border/40 text-[9px] text-muted-foreground font-semibold">
                Calculation: Demand = Gen + Load Shed
              </div>
              <div className="pt-1 flex justify-between text-[9px] text-muted-foreground border-t border-border/20">
                <span>Ref: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PGCB Daily Log</a></span>
                <span>Date: {systemStats.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-explorer-kpi stat group !overflow-visible hover:z-[100]">
          <Activity className="grid-explorer-kpi__icon text-amber-500" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Peak Demand</div>
            <div className="grid-explorer-kpi__value">{formatNumber(Math.round(systemStats.eveningPeakDemand))} MW</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className="absolute hidden group-hover:block text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-72 md:w-[19rem] right-0 md:left-1/2 md:-translate-x-1/2 top-[105%] transition-all duration-200 pointer-events-none animate-in fade-in slide-in-from-top-1 bg-card"
            style={{ backgroundColor: 'hsl(var(--card))' }}
          >
            <div className="font-bold text-xs uppercase tracking-wider text-amber-500 border-b border-border/60 pb-1.5 mb-2 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" /> Demand Briefing
            </div>
            <div className="space-y-2 text-[11px] md:text-xs leading-relaxed">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Evening Peak Demand:</span>
                <span className="font-bold text-foreground">{formatNumber(Math.round(systemStats.eveningPeakDemand))} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Day Peak Demand:</span>
                <span className="font-bold text-foreground">{formatNumber(Math.round(systemStats.dayPeakDemand))} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peak Deficit Shedding:</span>
                <span className="font-bold text-destructive">496 MW at 21:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max System Temp:</span>
                <span className="font-bold text-foreground">{systemStats.maxTemp.toFixed(1)} °C</span>
              </div>
              <div className="pt-1.5 border-t border-border/40 text-[9px] text-muted-foreground font-semibold">
                Audited by: NLDC System Operations
              </div>
              <div className="pt-1 flex justify-between text-[9px] text-muted-foreground border-t border-border/20">
                <span>Ref: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PGCB/NLDC SCADA</a></span>
                <span>Date: {systemStats.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-explorer-kpi stat group !overflow-visible hover:z-[100]">
          <Droplet className="grid-explorer-kpi__icon text-sky-500" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Gas Production</div>
            <div className="grid-explorer-kpi__value">2,647.5 MMCFD</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className="absolute hidden group-hover:block text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-[19.5rem] md:w-[22rem] left-0 md:left-1/2 md:-translate-x-1/2 top-[105%] transition-all duration-200 pointer-events-none animate-in fade-in slide-in-from-top-1 bg-card"
            style={{ backgroundColor: 'hsl(var(--card))' }}
          >
            <div className="font-bold text-xs uppercase tracking-wider text-sky-500 border-b border-border/60 pb-1.5 mb-2 flex items-center gap-1.5">
              <Droplet className="h-3.5 w-3.5" /> Gas Supply Briefing
            </div>
            <div className="space-y-2 text-[11px] md:text-xs leading-relaxed">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Gas Supply:</span>
                <span className="font-bold text-foreground">2,647.5 MMCFD</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Imported LNG:</span>
                <span className="font-bold text-foreground">1,008.0 MMCFD (38.1%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chevron IOC Supply:</span>
                <span className="font-bold text-foreground">928.7 MMCFD (35.1%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">State Field Output:</span>
                <span className="font-bold text-foreground">710.8 MMCFD (26.8%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Condensate:</span>
                <span className="font-bold text-foreground">5,864.6 BBL</span>
              </div>
              <div className="pt-1.5 border-t border-border/40 text-[9px] text-muted-foreground font-semibold">
                Audited by: MABS &amp; J Partners / CAG
              </div>
              <div className="pt-1 flex justify-between text-[9px] text-muted-foreground border-t border-border/20">
                <span>Ref: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Petrobangla Report</a></span>
                <span>Date: Jun 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-explorer-kpi stat group !overflow-visible hover:z-[100]">
          <Sun className="grid-explorer-kpi__icon text-yellow-500" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Renewables Online</div>
            <div className="grid-explorer-kpi__value">{totalCapacityRenewables.toFixed(1)} MW</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className="absolute hidden group-hover:block text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-[18rem] md:w-[20rem] right-0 md:left-1/2 md:-translate-x-1/2 top-[105%] transition-all duration-200 pointer-events-none animate-in fade-in slide-in-from-top-1 bg-card"
            style={{ backgroundColor: 'hsl(var(--card))' }}
          >
            <div className="font-bold text-xs uppercase tracking-wider text-yellow-500 border-b border-border/60 pb-1.5 mb-2 flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5" /> Clean Energy Briefing
            </div>
            <div className="space-y-2 text-[11px] md:text-xs leading-relaxed">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Solar Capacity:</span>
                <span className="font-bold text-foreground">1,511.70 MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hydro Capacity:</span>
                <span className="font-bold text-foreground">230.00 MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wind Capacity:</span>
                <span className="font-bold text-foreground">62.00 MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biogas &amp; Biomass:</span>
                <span className="font-bold text-foreground">1.09 MW</span>
              </div>
              <div className="flex justify-between border-t border-border/20 pt-1">
                <span className="text-muted-foreground">Renewable Share:</span>
                <span className="font-bold text-primary">~7.24% of Mix</span>
              </div>
              <div className="pt-1.5 border-t border-border/40 text-[9px] text-muted-foreground font-semibold">
                Audited by: SREDA Policy Division
              </div>
              <div className="pt-1 flex justify-between text-[9px] text-muted-foreground border-t border-border/20">
                <span>Ref: <a href="http://www.renewableenergy.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SREDA Database</a></span>
                <span>Date: Jun 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-explorer-kpi stat group !overflow-visible hover:z-[100]">
          <TakaIcon className="grid-explorer-kpi__icon text-emerald-500" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Est. Fuel Cost</div>
            <div className="grid-explorer-kpi__value">{(systemStats.totalDailyCost / 10000000).toFixed(1)} Cr Tk.</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className="absolute hidden group-hover:block text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-[18.5rem] md:w-[21rem] left-0 md:left-1/2 md:-translate-x-1/2 top-[105%] transition-all duration-200 pointer-events-none animate-in fade-in slide-in-from-top-1 bg-card"
            style={{ backgroundColor: 'hsl(var(--card))' }}
          >
            <div className="font-bold text-xs uppercase tracking-wider text-emerald-500 border-b border-border/60 pb-1.5 mb-2 flex items-center gap-1.5">
              <TakaIcon className="h-3.5 w-3.5 shrink-0" /> Fuel &amp; Import Bills
            </div>
            <div className="space-y-2 text-[11px] md:text-xs leading-relaxed">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Daily Cost:</span>
                <span className="font-bold text-foreground">227.07 Crore BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Bulk Cost:</span>
                <span className="font-bold text-primary">{avgCostPerKwh.toFixed(3)} Tk/KWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HFO Generation Cost:</span>
                <span className="font-bold text-destructive">18.06 Tk/KWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hydro Generation Cost:</span>
                <span className="font-bold text-emerald-500">0.10 Tk/KWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cross-Border Imports:</span>
                <span className="font-bold text-foreground">6.34 Tk/KWh</span>
              </div>
              <div className="pt-1.5 border-t border-border/40 text-[9px] text-muted-foreground font-semibold">
                Audited by: BPDB Audit Team &amp; CAG
              </div>
              <div className="pt-1 flex justify-between text-[9px] text-muted-foreground border-t border-border/20">
                <span>Ref: <a href="https://bpc.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BPC Gazettes</a></span>
                <span>Date: {systemStats.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid-explorer-tabs" role="tablist" aria-label="Grid reports views">
        {tabs.map((t) => {
          const TabIcon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(t.id)}
              className={cn('explorer-tab', active && 'active')}
            >
              <TabIcon className="h-4 w-4 shrink-0" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid-explorer-panel space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generation Pie Chart */}
          <div className="grid-explorer-chart-card card">
            <div className="grid-explorer-chart-card__head">
              <div>
                <h3 className="grid-explorer-chart-card__title">Daily Generation Mix Snapshot</h3>
                <p className="grid-explorer-chart-card__sub">Energy share by fuel type (Total: {totalGenMkwhr.toFixed(1)} MKWh)</p>
              </div>
              <GridLiveBadge label="Report: 22 Jun 2026" />
            </div>

            <div className="grid-explorer-mix-stack" aria-hidden>
              {generationData.map((item, i) => {
                const width = totalGenMkwhr > 0 ? (item.gen / totalGenMkwhr) * 100 : 0;
                const dimmed = hoveredIndex !== null && hoveredIndex !== i;
                return (
                  <div
                    key={item.name}
                    className={cn('grid-explorer-mix-stack__seg', dimmed && 'grid-explorer-mix-stack__seg--dim')}
                    style={{ width: `${width}%`, backgroundColor: item.color }}
                  />
                );
              })}
            </div>

            <div className="grid-explorer-donut-wrap">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                  <PieChart>
                    <Pie
                      data={generationData.filter(d => d.gen > 0)}
                      dataKey="gen"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="54%"
                      outerRadius="82%"
                      paddingAngle={2}
                      cornerRadius={4}
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                      onMouseEnter={(_, i) => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {generationData.filter(d => d.gen > 0).map((entry, idx) => {
                        const dimmed = hoveredIndex !== null && hoveredIndex !== idx;
                        return (
                          <Cell
                            key={idx}
                            fill={entry.color}
                            fillOpacity={dimmed ? 0.3 : 1}
                            style={{ transition: 'fill-opacity 200ms ease' }}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const row = payload[0].payload;
                        const pct = ((row.gen / totalGenMkwhr) * 100).toFixed(2);
                        return (
                          <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                            <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                              <span>{row.name} Share</span>
                              <span className="text-[9px] md:text-[10px] uppercase font-bold text-primary tracking-wider">Operational Mix</span>
                            </div>
                            <div className="space-y-2 text-[11px] md:text-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Energy Output:</span>
                                <span className="font-bold text-foreground">{row.gen.toFixed(2)} MKWh</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">System Share:</span>
                                <span className="font-bold text-foreground">{pct}%</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                              Calculation: Gen Share = (Fuel Gen / Total Gen) * 100
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                              <div><strong>Source:</strong> <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PGCB Daily Operations Report</a></div>
                              <div><strong>Audited by:</strong> PGCB Network Operation Division</div>
                            </div>
                          </div>
                        );
                      }}
                      wrapperStyle={{ outline: 'none', zIndex: 20 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid-explorer-skeleton" />
              )}
              <div className="grid-explorer-donut-center">
                <span className="grid-explorer-donut-total">{totalGenMkwhr.toFixed(0)}</span>
                <span className="grid-explorer-donut-label">MKWh Gen</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid-chart-legend">
              {generationData.filter(d => d.gen > 0).map((item, i) => {
                const dimmed = hoveredIndex !== null && hoveredIndex !== i;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={cn('grid-chart-legend__item', dimmed && 'grid-chart-legend__item--dim')}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span className="grid-chart-legend__swatch" style={{ backgroundColor: item.color }} />
                    <span className="grid-chart-legend__name">{item.name}</span>
                    <span className="grid-chart-legend__meta">{((item.gen / totalGenMkwhr) * 100).toFixed(1)}%</span>
                    <span className="grid-chart-legend__val">{item.gen.toFixed(1)} MKWh</span>
                  </button>
                );
              })}
            </div>

            {/* Card Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80">
              <span>Source: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">PGCB Daily Progress Report</a></span>
              <span>Audited by: PGCB Network Operations Division</span>
              <span className="font-medium">Reporting Date: 22 Jun 2026</span>
            </div>
          </div>

          {/* Cost Bar Chart */}
          <div className="grid-explorer-chart-card card">
            <div className="grid-explorer-chart-card__head">
              <div>
                <h3 className="grid-explorer-chart-card__title">Daily Fuel &amp; Import Cost</h3>
                <p className="grid-explorer-chart-card__sub">Cost in Crore BDT by fuel type (Total: {(totalCostBdt / 10000000).toFixed(1)} Cr Tk.)</p>
              </div>
              <span className="grid-explorer-chip">Cost Analysis</span>
            </div>

            <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generationData.filter(d => d.cost > 0)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: chartTheme.axisTick }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: chartTheme.axisTick }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v} Cr`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const row = payload[0].payload;
                        const cr = (row.cost / 10000000).toFixed(3);
                        return (
                          <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                            <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                              <span>{row.name} Daily Cost</span>
                              <span className="text-[9px] md:text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Financial Audit</span>
                            </div>
                            <div className="space-y-2 text-[11px] md:text-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Daily Cost:</span>
                                <span className="font-bold text-foreground">{cr} Crore Tk</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Average Unit Rate:</span>
                                <span className="font-bold text-foreground">{row.unitCost.toFixed(3)} Tk/KWh</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                              Calculation: Daily Cost = Gen (MKWh) * 10^6 * Unit Cost (Tk/KWh)
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                              <div><strong>Source:</strong> <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PGCB daily log</a> &amp; BPDB financial audits</div>
                              <div><strong>Audited by:</strong> SF Ahmed &amp; Co. / CAG Audit team</div>
                            </div>
                          </div>
                        );
                      }}
                      cursor={{ fill: chartTheme.hoverFill, radius: 8 }}
                    />
                    <Bar dataKey={(d) => d.cost / 10000000} radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {generationData.filter(d => d.cost > 0).map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid-explorer-skeleton" />
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border/50 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground uppercase font-bold text-[9px] tracking-wider">Avg Production Cost</span>
                <span className="text-sm font-semibold text-foreground">{systemStats.avgProductionCost.toFixed(3)} Tk / KWh</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground uppercase font-bold text-[9px] tracking-wider">Total Gas to Power</span>
                <span className="text-sm font-semibold text-foreground">{systemStats.totalGasSuppliedPower.toFixed(2)} MMCFD</span>
              </div>
            </div>

            {/* Card Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80">
              <span>Source: <a href="https://bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPDB Daily Reports</a> &amp; <a href="https://bpc.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPC Fuel Gazettes</a></span>
              <span>Audited by: BPDB Audits / CAG Audit Team</span>
              <span className="font-medium">Reporting Date: 22 Jun 2026</span>
            </div>
          </div>
        </div>

        {/* 24-Hour System Load Curve */}
        <div className="grid-explorer-chart-card card">
          <div className="grid-explorer-chart-card__head">
            <div>
              <h3 className="grid-explorer-chart-card__title">24-Hour System Load Curve</h3>
              <p className="grid-explorer-chart-card__sub">SCADA demand, actual generation, and load shedding profile (Date: {systemStats.date})</p>
            </div>
            <span className="grid-explorer-chip bg-destructive/10 text-destructive border-destructive/20">NLDC SCADA Curve</span>
          </div>

          <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 !h-[24rem]">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={hourlyLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="loadShed-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gen-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} MW`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      const peakIndicator = d.time === '19:30' || d.time === '21:00' ? ' (Peak Hour)' : '';
                      return (
                        <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                          <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                            <span>Grid Profile at {d.time}{peakIndicator}</span>
                            <span className="text-[9px] md:text-[10px] uppercase font-bold text-amber-500 tracking-wider">NLDC Telemetry</span>
                          </div>
                          <div className="space-y-2 text-[11px] md:text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">System Demand:</span>
                              <span className="font-bold text-foreground">{formatNumber(Math.round(d.demand))} MW</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sky-500">Actual Gen:</span>
                              <span className="font-bold text-sky-500">{formatNumber(Math.round(d.generation))} MW</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-destructive">Load Shedding Deficit:</span>
                              <span className="font-bold text-destructive">{formatNumber(Math.round(d.loadShed))} MW</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                            Calculation: Demand = Actual Gen + Load Shedding Deficit
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                            <div><strong>Source:</strong> <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PGCB NLDC Daily Curve Sheet</a></div>
                            <div><strong>Telemetry:</strong> NLDC SCADA System Real-time Integrator</div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />
                  <Area type="monotone" dataKey="generation" name="Actual Generation" stroke="#0ea5e9" fill="url(#gen-grad)" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="demand" name="Total Demand" stroke="#eab308" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                  <Bar dataKey="loadShed" name="Load Shedding Deficit" fill="url(#loadShed-grad)" stroke="hsl(var(--destructive))" strokeWidth={1} radius={[2, 2, 0, 0]} maxBarSize={15} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid-explorer-skeleton" />
            )}
          </div>
          
          <div className="p-4 bg-muted/20 border border-border/40 rounded-xl text-xs text-muted-foreground leading-relaxed mt-4">
            <strong>Operational Insights:</strong> The load curve illustrates a typical peak demand shape with two major peaks: a daytime peak at 12:00 Hr (14,610 MW) driven by commercial cooling, and an evening peak at 19:30 Hr (16,854 MW) driven by domestic residential lighting. Load-shedding peaks at 23:00 Hr (1,236 MW) when generation reserves are exhausted relative to nighttime domestic loads.
          </div>

          {/* Card Metadata Footer */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80">
            <span>Source: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">PGCB NLDC Operations Sheet</a></span>
            <span>Audited by: National Load Despatch Centre (NLDC) System Operators</span>
            <span className="font-medium">Reporting Period: 24-Hour SCADA Log (Date: 22 Jun 2026)</span>
          </div>
        </div>
      </div>
    )}

      {activeTab === 'gen' && (
        <div className="grid-explorer-panel space-y-6">
          <div className="grid-explorer-chart-card card">
            <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
              <Zap className="h-5 w-5 text-primary shrink-0" />
              <div>
                <h3 className="grid-explorer-chart-card__title">Generation &amp; Production Cost Breakdown</h3>
                <p className="grid-explorer-chart-card__sub">System performance data logged on {systemStats.date}</p>
              </div>
            </div>

            <div className="grid-explorer-table-wrap">
              <table className="grid-explorer-table">
                <thead>
                  <tr>
                    <th>Fuel / Source</th>
                    <th className="text-right">Generation (MKWh)</th>
                    <th className="text-right">Generation Share</th>
                    <th className="text-right">Daily Cost (Crore Tk)</th>
                    <th className="text-right">Cost Share</th>
                    <th className="text-right">Unit Cost (Tk/KWh)</th>
                  </tr>
                </thead>
                <tbody>
                  {generationData.map((g, idx) => {
                    const genShare = ((g.gen / totalGenMkwhr) * 100).toFixed(2);
                    const costShare = ((g.cost / totalCostBdt) * 100).toFixed(2);
                    return (
                      <tr key={idx} className={cn(g.gen === 0 && 'opacity-40')}>
                        <td className="font-semibold flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                          {g.name}
                        </td>
                        <td className="text-right tabular-nums">{g.gen.toFixed(2)}</td>
                        <td className="text-right tabular-nums text-muted-foreground">{genShare}%</td>
                        <td className="text-right tabular-nums">{(g.cost / 10000000).toFixed(3)}</td>
                        <td className="text-right tabular-nums text-muted-foreground">{costShare}%</td>
                        <td className="text-right tabular-nums font-mono text-sm">{g.unitCost.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-border/80 font-bold bg-muted/20">
                    <td>Total System / Average</td>
                    <td className="text-right tabular-nums">{totalGenMkwhr.toFixed(2)}</td>
                    <td className="text-right tabular-nums">100.00%</td>
                    <td className="text-right tabular-nums">{(totalCostBdt / 10000000).toFixed(2)}</td>
                    <td className="text-right tabular-nums">100.00%</td>
                    <td className="text-right tabular-nums font-mono text-sm text-primary">{avgCostPerKwh.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Card Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
              <span>Source: <a href="https://bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPDB Daily Reports</a> &amp; <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">PGCB Logs</a></span>
              <span>Audited by: BPDB Finance &amp; Commercial Operations / CAG Audit Team</span>
              <span className="font-medium">Reporting Date: 22 Jun 2026</span>
            </div>
          </div>

          {/* Daily Milestones */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-5 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Load-Shedding &amp; Demand</div>
              <div className="grid grid-cols-2 gap-y-2 text-xs leading-relaxed">
                <span>Peak Demand:</span>
                <span className="font-bold text-foreground text-right">{systemStats.eveningPeakDemand.toFixed(1)} MW</span>
                <span>Peak Generation:</span>
                <span className="font-bold text-foreground text-right">{systemStats.eveningPeakGen.toFixed(1)} MW</span>
                <span>Unserved Energy:</span>
                <span className="font-semibold text-destructive text-right">{systemStats.totalEnergyUnserved.toFixed(2)} MKWh</span>
              </div>
            </div>

            <div className="card p-5 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Daily System Margins</div>
              <div className="grid grid-cols-2 gap-y-2 text-xs leading-relaxed">
                <span>Max Generation:</span>
                <span className="font-bold text-foreground text-right">{systemStats.maxGen.toFixed(1)} MW</span>
                <span>Min Generation:</span>
                <span className="font-bold text-foreground text-right">{systemStats.minGen.toFixed(1)} MW</span>
                <span>Max Temp Yesterday:</span>
                <span className="font-semibold text-foreground text-right">{systemStats.maxTemp.toFixed(1)} °C</span>
              </div>
            </div>

            <div className="card p-5 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gas-to-Power Conversion</div>
              <div className="grid grid-cols-2 gap-y-2 text-xs leading-relaxed">
                <span>Gas Supplied:</span>
                <span className="font-bold text-foreground text-right">{systemStats.totalGasSuppliedPower.toFixed(1)} MMCFD</span>
                <span>Gas Cost:</span>
                <span className="font-bold text-foreground text-right">43.71 Crore Tk</span>
                <span>Gas Unit Cost:</span>
                <span className="font-semibold text-primary text-right">3.45 Tk/KWh</span>
              </div>
            </div>
          </div>

          {/* Section Metadata Footer */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-2 text-[10px] text-muted-foreground/75 px-1">
            <span>Source: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">PGCB Operations</a> &amp; <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Petrobangla Production Division</a></span>
            <span>Audited by: NLDC Operators &amp; Petrobangla Billing</span>
            <span>Reporting Period: System Summary (Date: 22 Jun 2026)</span>
          </div>
        </div>
      )}

      {activeTab === 'gas' && (
        <div className="grid-explorer-panel space-y-6">
          {/* Petrobangla Production */}
          <div className="grid-explorer-chart-card card">
            <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
              <Droplet className="h-5 w-5 text-sky-500 shrink-0" />
              <div>
                <h3 className="grid-explorer-chart-card__title">Daily Gas &amp; Condensate Production</h3>
                <p className="grid-explorer-chart-card__sub">Petrobangla Production &amp; Marketing Division Report (22-23 Jun 2026)</p>
              </div>
            </div>

            <div className="grid-explorer-table-wrap">
              <table className="grid-explorer-table">
                <thead>
                  <tr>
                    <th>Field / Company Operator</th>
                    <th className="text-right">Active Fields/Wells</th>
                    <th className="text-right">Gas Produced (MMCFD)</th>
                    <th className="text-right">Condensate Produced (BBL)</th>
                    <th className="text-right">National Gas Share</th>
                  </tr>
                </thead>
                <tbody>
                  {gasProductionData.map((gp, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold">{gp.company}</td>
                      <td className="text-right tabular-nums text-muted-foreground">{gp.fields || '—'}</td>
                      <td className="text-right tabular-nums font-medium">{gp.gas.toFixed(1)}</td>
                      <td className="text-right tabular-nums">{formatNumber(Math.round(gp.condensate))}</td>
                      <td className="text-right tabular-nums text-muted-foreground">{gp.share.toFixed(1)}%</td>
                    </tr>
                  ))}
                  <tr className="border-t border-border/80 font-bold bg-muted/20">
                    <td>Grand Total Production</td>
                    <td className="text-right">23 Fields</td>
                    <td className="text-right text-primary">2,647.5</td>
                    <td className="text-right">5,864.6</td>
                    <td className="text-right">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Card Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
              <span>Source: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Petrobangla Production Reports</a></span>
              <span>Audited by: Petrobangla Production &amp; Marketing Division</span>
              <span className="font-medium">Reporting Period: Daily Field Snapshot (Date: 22-23 Jun 2026)</span>
            </div>
          </div>

          {/* Gas Distribution */}
          <div className="grid-explorer-chart-card card">
            <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
              <Database className="h-5 w-5 text-sky-600 shrink-0" />
              <div>
                <h3 className="grid-explorer-chart-card__title">Sectorwise Gas Distribution</h3>
                <p className="grid-explorer-chart-card__sub">Allocated supply (MMCFD) across regional gas distributors</p>
              </div>
            </div>

            <div className="grid-explorer-table-wrap">
              <table className="grid-explorer-table">
                <thead>
                  <tr>
                    <th>Distributor</th>
                    <th className="text-right">Power Grid Supply</th>
                    <th className="text-right">Fertilizer Supply</th>
                    <th className="text-right">Industrial / Others</th>
                    <th className="text-right">Total Gas Distributed</th>
                  </tr>
                </thead>
                <tbody>
                  {gasDistributionData.map((gd, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold">{gd.company}</td>
                      <td className="text-right tabular-nums">{gd.power.toFixed(1)}</td>
                      <td className="text-right tabular-nums">{gd.fertilizer.toFixed(1)}</td>
                      <td className="text-right tabular-nums text-muted-foreground">{gd.others.toFixed(1)}</td>
                      <td className="text-right tabular-nums font-semibold">{gd.total.toFixed(1)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-border/80 font-bold bg-muted/20">
                    <td>National Total Supply</td>
                    <td className="text-right tabular-nums text-primary">917.3</td>
                    <td className="text-right tabular-nums">151.6</td>
                    <td className="text-right tabular-nums">1,475.1</td>
                    <td className="text-right tabular-nums text-primary">2,544.1</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Card Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
              <span>Source: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Petrobangla Distribution Reports</a></span>
              <span>Audited by: Distributor Billing Audits (TGTDCL, KGDCL, JGTDSL)</span>
              <span className="font-medium">Reporting Period: Daily Distribution Allocation (Date: 22-23 Jun 2026)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'imports' && (
        <div className="grid-explorer-panel space-y-6">
          <div className="grid-explorer-chart-card card">
            <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
              <Globe className="h-5 w-5 text-purple-500 shrink-0" />
              <div>
                <h3 className="grid-explorer-chart-card__title">Cross-Border Power Imports Tracker</h3>
                <p className="grid-explorer-chart-card__sub">Real-time import allocations and daily power trade (Report: {systemStats.date})</p>
              </div>
            </div>

            <div className="grid-explorer-table-wrap">
              <table className="grid-explorer-table">
                <thead>
                  <tr>
                    <th>Import Source / Line</th>
                    <th>Type</th>
                    <th className="text-right">Daily Energy Imported (MKWh)</th>
                    <th className="text-right">Peak Capacity Served (MW)</th>
                    <th className="text-right">Estimated Cost (Tk)</th>
                    <th className="text-right">Unit Rate (Tk/KWh)</th>
                  </tr>
                </thead>
                <tbody>
                  {borderImportsData.map((bi, idx) => {
                    const rowGen = generationData.find(g => g.name === 'Imports');
                    const unitRate = rowGen ? rowGen.unitCost : 6.34;
                    const calculatedCost = bi.energy * 1000000 * unitRate;
                    return (
                      <tr key={idx}>
                        <td className="font-semibold">{bi.source}</td>
                        <td className="text-muted-foreground">{bi.type}</td>
                        <td className="text-right tabular-nums font-semibold">{bi.energy.toFixed(2)}</td>
                        <td className="text-right tabular-nums">{formatNumber(Math.round(bi.peakFlow))}</td>
                        <td className="text-right tabular-nums">{(calculatedCost / 10000000).toFixed(2)} Cr</td>
                        <td className="text-right tabular-nums font-mono">{unitRate.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-border/80 font-bold bg-muted/20">
                    <td>Total Grid Imports</td>
                    <td className="text-muted-foreground">National aggregate</td>
                    <td className="text-right tabular-nums text-primary">{borderImportsData.reduce((sum, i) => sum + i.energy, 0).toFixed(2)}</td>
                    <td className="text-right tabular-nums">2,583.6</td>
                    <td className="text-right tabular-nums">33.40 Cr</td>
                    <td className="text-right tabular-nums font-mono text-primary">6.34</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-muted/20 border border-border/40 rounded-xl mt-5 text-xs text-muted-foreground leading-relaxed">
              <strong>Note:</strong> Adani Cross-Border Interconnector (Godda Coal Power) provides dedicated base-load supply directly to the northern grid interface. HVDC Bheramara represents the main synchronous link with the Indian National Grid (NTPC/PowerGrid).
            </div>

            {/* Card Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
              <span>Source: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">PGCB System Operations Division</a></span>
              <span>Audited by: HVDC Bheramara &amp; Cumilla Substations</span>
              <span className="font-medium">Reporting Period: Daily Interconnector Flow (Date: 22 Jun 2026)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'renewables' && (
        <div className="grid-explorer-panel grid lg:grid-cols-2 gap-6">
          {/* Renewables Table */}
          <div className="grid-explorer-chart-card card">
            <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
              <Sun className="h-5 w-5 text-yellow-500 shrink-0" />
              <div>
                <h3 className="grid-explorer-chart-card__title">Renewable Installed Capacity</h3>
                <p className="grid-explorer-chart-card__sub">Source: SREDA National Database of Renewable Energy</p>
              </div>
            </div>

            <div className="grid-explorer-table-wrap">
              <table className="grid-explorer-table">
                <thead>
                  <tr>
                    <th>Technology</th>
                    <th className="text-right">Installed Capacity (MW)</th>
                    <th className="text-right">Clean Energy Share</th>
                  </tr>
                </thead>
                <tbody>
                  {sredaRenewablesData.map((sr, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold flex items-center gap-2">
                        <sr.icon className="h-4 w-4 text-primary shrink-0" />
                        {sr.tech}
                      </td>
                      <td className="text-right tabular-nums font-medium">{sr.capacity.toFixed(2)}</td>
                      <td className="text-right tabular-nums text-muted-foreground">{sr.share.toFixed(2)}%</td>
                    </tr>
                  ))}
                  <tr className="border-t border-border/80 font-bold bg-muted/20">
                    <td>SREDA Aggregate Capacity</td>
                    <td className="text-right tabular-nums text-primary">{totalCapacityRenewables.toFixed(2)}</td>
                    <td className="text-right tabular-nums">100.00%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Card Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
              <span>Source: <a href="http://www.renewableenergy.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">SREDA Renewable Database</a></span>
              <span>Audited by: SREDA Monitoring &amp; Policy Division</span>
              <span className="font-medium">Reporting Period: Clean Energy Inventory (Date: Jun 2026)</span>
            </div>
          </div>

          {/* SREDA Strategy Progress */}
          <div className="grid-explorer-chart-card card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="grid-explorer-chart-card__head">
                <div>
                  <h3 className="grid-explorer-chart-card__title">SREDA Renewable Target Progress</h3>
                  <p className="grid-explorer-chart-card__sub">Tracking towards Sustainable Development Goals (SDG 7)</p>
                </div>
              </div>

              <div className="space-y-5 py-4">
                {/* 2030 Target */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Current Renewable Grid Share</span>
                    <span className="text-foreground">~7.2% of Total Installed</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted border border-border/40 overflow-hidden relative">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '7.2%' }} />
                  </div>
                </div>

                {/* target 20% by 2030 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">2030 Government SDG Target</span>
                    <span className="text-primary font-bold">20.0% Renewables</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted border border-border/40 overflow-hidden relative">
                    <div className="h-full bg-primary/40 rounded-full" style={{ width: '20%' }} />
                    <div className="absolute top-0 bottom-0 left-[7.2%] w-0.5 bg-yellow-500" title="Current Status" />
                  </div>
                </div>

                {/* target 30% by 2040 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">2040 Vision Target</span>
                    <span className="text-emerald-500 font-bold">30.0% Renewables</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted border border-border/40 overflow-hidden relative">
                    <div className="h-full bg-emerald-500/40 rounded-full" style={{ width: '30%' }} />
                    <div className="absolute top-0 bottom-0 left-[7.2%] w-0.5 bg-yellow-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/20 border border-border/40 rounded-xl text-xs text-muted-foreground leading-relaxed mt-4">
              To meet SDG 7 targets, SREDA and BPDB are deploying 1,800 MW of utility-scale solar parks and off-grid solar home systems (SHS). Off-grid installations represent a significant portion of current rural electricity access.
            </div>

            {/* Card Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
              <span>Source: <a href="http://www.renewableenergy.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">SREDA Target Sheets</a></span>
              <span>Audited by: Ministry of Power, Energy &amp; Mineral Resources (MPEMR)</span>
              <span className="font-medium">Reporting Period: Vision 2030/2040 Targets</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'regional' && (
        <div className="grid-explorer-panel space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Regional Table */}
            <div className="grid-explorer-chart-card card lg:col-span-2">
              <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
                <Cable className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <h3 className="grid-explorer-chart-card__title">Zone-wise Demand &amp; Load-Shedding</h3>
                  <p className="grid-explorer-chart-card__sub">SCADA readings recorded at evening peak hour (21:00 Hr.)</p>
                </div>
              </div>

              <div className="grid-explorer-table-wrap">
                <table className="grid-explorer-table">
                  <thead>
                    <tr>
                      <th>Grid Zone</th>
                      <th className="text-right">Evening Demand (MW)</th>
                      <th className="text-right">Load-Shedding (MW)</th>
                      <th className="text-right">Shedding Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalDemandData.map((rd, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold">{rd.zone}</td>
                        <td className="text-right tabular-nums font-medium">{formatNumber(rd.demand)}</td>
                        <td className="text-right tabular-nums text-destructive font-semibold">
                          {rd.loadShed > 0 ? `${rd.loadShed} MW` : '0 MW'}
                        </td>
                        <td className="text-right tabular-nums">
                          {rd.loadShed > 0 ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="font-mono font-bold text-xs text-amber-500">{rd.pct}%</span>
                              <div className="w-12 h-2 rounded bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded"
                                  style={{ width: `${Math.min(rd.pct * 4, 100)}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-emerald-500 text-xs font-semibold">Clean (0%)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-border/80 font-bold bg-muted/20">
                      <td>Entire Grid Total</td>
                      <td className="text-right tabular-nums text-primary">16,041</td>
                      <td className="text-right tabular-nums text-destructive">496</td>
                      <td className="text-right tabular-nums text-primary">3.1% avg</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Card Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                <span>Source: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">PGCB System Operations Log</a></span>
                <span>Audited by: National Load Despatch Centre (NLDC) Operators</span>
                <span className="font-medium">Reporting Period: Evening Peak Load (Date: 22 Jun 2026)</span>
              </div>
            </div>

            {/* Daily Outage Log */}
            <div className="grid-explorer-chart-card card lg:col-span-1">
              <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
                <FileText className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <h3 className="grid-explorer-chart-card__title">NLDC Daily Outage Log</h3>
                  <p className="grid-explorer-chart-card__sub">Major event log of yesterday's grid outages</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[31.5rem] overflow-y-auto pr-1">
                {dailyOutages.map((o, idx) => (
                  <div key={idx} className="p-3 bg-muted/15 border border-border/30 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between font-bold text-foreground">
                      <span>{o.plant}</span>
                      <span className="text-muted-foreground font-mono font-normal">{o.time}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{o.reason}</span>
                      <span className="font-semibold text-destructive">{o.load}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                <span>Source: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">PGCB Daily Outage Log</a></span>
                <span>Audited by: PGCB Network Protection &amp; NLDC Control Room</span>
                <span className="font-medium">Reporting Period: 24-Hour Logs (Date: 22 Jun 2026)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'macro' && (
        <div className="grid-explorer-panel space-y-6">
          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap gap-1.5 border-b border-border/40 pb-3">
            {[
              { id: 'overview', label: 'Macro Overview', icon: BarChart3 },
              { id: 'pricing', label: 'Pricing & Drivers', icon: TrendingUp },
              { id: 'global', label: 'Global vs. Domestic', icon: Globe },
              { id: 'reports', label: 'Annual Reports', icon: FileText },
              { id: 'reserves', label: 'Gas Reserve Depletion', icon: Database },
              { id: 'insights', label: 'Analyst & Investor Insights', icon: DollarSign }
            ].map((t) => {
              const SubIcon = t.icon;
              const active = macroSubTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMacroSubTab(t.id as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-150",
                    active
                      ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                      : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <SubIcon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Sub-tab 1: Macro Overview */}
          {macroSubTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Wholesale Tariff vs. Unit Production Cost */}
                <div className="grid-explorer-chart-card card">
                  <div className="grid-explorer-chart-card__head">
                    <div>
                      <h3 className="grid-explorer-chart-card__title">Wholesale Tariff vs. Unit Production Cost</h3>
                      <p className="grid-explorer-chart-card__sub">Audit history showing growing BPDB cost gap (Tk/KWh)</p>
                    </div>
                    <span className="grid-explorer-chip">Bulk Tariff Gap</span>
                  </div>

                  <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={macroTariffData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis dataKey="year" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} Tk`} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              const deficit = (d.tariff - d.cost).toFixed(2);
                              return (
                                <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                  <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                    <span>{d.year} Financials</span>
                                    <span className="text-[9px] md:text-[10px] uppercase font-bold text-primary tracking-wider">Deficit Gap</span>
                                  </div>
                                  <div className="space-y-2 text-[11px] md:text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Wholesale Bulk Tariff:</span>
                                      <span className="font-bold text-foreground">{d.tariff.toFixed(2)} Tk/KWh</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Unit Production Cost:</span>
                                      <span className="font-bold text-foreground">{d.cost.toFixed(2)} Tk/KWh</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border/30 pt-1">
                                      <span className="text-destructive font-semibold">Unit Deficit:</span>
                                      <span className="font-bold text-destructive">{deficit} Tk/KWh</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                                    Calculation: Unit Deficit = Bulk Wholesale Tariff - Average Production Cost
                                  </div>
                                  <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                    <div><strong>Source:</strong> <a href="https://www.bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BPDB Annual Audits</a> &amp; BERC Notifications</div>
                                    <div><strong>Audited by:</strong> Hoda Vasi Chowdhury &amp; Co. / Office of CAG</div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Bar dataKey="tariff" name="Bulk Wholesale Tariff" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={30} />
                          <Line dataKey="cost" name="Average Generation Cost" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ fill: 'hsl(var(--destructive))', r: 4 }} activeDot={{ r: 6 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="grid-explorer-skeleton" />
                    )}
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                    <span>Source: <a href="https://bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPDB Annual Accounts &amp; Audit Reports</a></span>
                    <span>Audited by: Hoda Vasi Chowdhury &amp; Co. / Office of the Comptroller &amp; Auditor General (CAG)</span>
                    <span className="font-medium">Reporting Period: FY 2020 - FY 2026 Financial Audits</span>
                  </div>
                </div>

                {/* LNG Dependency Area Chart */}
                <div className="grid-explorer-chart-card card">
                  <div className="grid-explorer-chart-card__head">
                    <div>
                      <h3 className="grid-explorer-chart-card__title">Gas Supply Transition: Domestic vs. Imported LNG</h3>
                      <p className="grid-explorer-chart-card__sub">Historical shift towards imported liquefied natural gas (MMCFD)</p>
                    </div>
                    <span className="grid-explorer-chip">LNG Reliance</span>
                  </div>

                  <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={macroGasData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                          <defs>
                            <linearGradient id="domestic-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="lng-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis dataKey="year" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} M`} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              const total = d.domestic + d.lng;
                              const domesticPct = total > 0 ? ((d.domestic / total) * 100).toFixed(1) : '0';
                              const lngPct = total > 0 ? ((d.lng / total) * 100).toFixed(1) : '0';
                              return (
                                <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                  <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                    <span>Gas Supply {d.year}</span>
                                    <span className="text-[9px] uppercase font-bold text-purple-500 tracking-wider">LNG Reliance</span>
                                  </div>
                                  <div className="space-y-2 text-[11px] md:text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Domestic Fields:</span>
                                      <span className="font-bold text-foreground">{d.domestic} MMCFD ({domesticPct}%)</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Imported LNG (R-LNG):</span>
                                      <span className="font-bold text-foreground">{d.lng} MMCFD ({lngPct}%)</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border/30 pt-1">
                                      <span className="text-primary font-bold">Total Grid Supply:</span>
                                      <span className="font-bold text-primary">{total} MMCFD</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                                    Calculation: LNG Reliance % = (LNG / Total Supply) * 100
                                  </div>
                                  <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                    <div><strong>Source:</strong> <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Petrobangla Annual Reports</a></div>
                                    <div><strong>Audited by:</strong> Petrobangla Finance Division &amp; CAG</div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Area type="monotone" dataKey="domestic" stackId="1" stroke="#0ea5e9" fill="url(#domestic-grad)" strokeWidth={2} />
                          <Area type="monotone" dataKey="lng" stackId="1" stroke="#a855f7" fill="url(#lng-grad)" strokeWidth={2} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="grid-explorer-skeleton" />
                    )}
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                    <span>Source: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Petrobangla Audited Balance Sheets &amp; Daily MIS Reports</a></span>
                    <span>Audited by: MABS &amp; J Partners Chartered Accountants / CAG Bangladesh</span>
                    <span className="font-medium">Reporting Period: Historical Reserves Log (2018 - 2026)</span>
                  </div>
                </div>
              </div>

              {/* Reserves and Capacity Charges Audit info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-5 space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Petrobangla Natural Gas Reserves</div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-foreground">7.63 Tcf Remaining</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Of the original 29.74 Tcf recoverable gas reserves, 22.11 Tcf has already been extracted. The remaining reserve life is estimated at roughly 12 years under current supply velocities.
                    </p>
                  </div>
                </div>

                <div className="card p-5 space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Capacity Charge Drag</div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-destructive">~40% of Wholesale Costs</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Audited financial statements indicate that over 40% of BPDB's average bulk purchase rate goes directly toward paying capacity charges to idle or underutilized private IPPs.
                    </p>
                  </div>
                </div>

                <div className="card p-5 space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">State Subsidy Burden</div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-foreground">~35k-40k Crore BDT / Year</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Due to the Tk 4.52 per unit wholesale cost gap (average Tk 12.91 generation cost vs Tk 8.39 bulk tariff), the Ministry of Finance issues massive annual treasury transfers to cover the deficit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-2 text-[10px] text-muted-foreground/75 px-1">
                <span>Source: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Petrobangla Hydrocarbon Unit</a> &amp; <a href="https://bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">BPDB Annual Financials</a></span>
                <span>Audited by: CAG Audit Reports &amp; Ministry of Finance (MoF) Gazettes</span>
                <span>Reporting Period: Macro Analysis (2026 Audit Reports)</span>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Pricing & Drivers */}
          {macroSubTab === 'pricing' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-muted/20 border border-border/40 rounded-xl text-xs text-muted-foreground flex flex-col gap-2">
                <div>
                  <strong>Exchange Rate Sensitivity:</strong> Imported energy commodities (Spot LNG, Coal, Heavy Fuel Oil) are denominated in US Dollars (USD). Therefore, the exchange rate of the Bangladesh Taka (BDT) is a direct multiplier on the domestic cost of power generation.
                </div>
                <div className="pt-1.5 border-t border-border/30">
                  A 40%+ devaluation of the BDT since 2021 has automatically increased fuel costs even when global commodity prices remain constant.
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Inflation & Exchange Rate Drivers */}
                <div className="grid-explorer-chart-card card">
                  <div className="grid-explorer-chart-card__head">
                    <div>
                      <h3 className="grid-explorer-chart-card__title">Macro Pressure Variables (2021 - 2026)</h3>
                      <p className="grid-explorer-chart-card__sub">Devaluation of BDT/USD vs. National Inflation Rate (CPI %)</p>
                    </div>
                    <span className="grid-explorer-chip">Macro Factors</span>
                  </div>

                  <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={macroEconomicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis dataKey="year" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} Tk`} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              return (
                                <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                  <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                    <span>Macro Variables {d.year}</span>
                                    <span className="text-[9px] md:text-[10px] uppercase font-bold text-primary tracking-wider">Economy</span>
                                  </div>
                                  <div className="space-y-2 text-[11px] md:text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Exchange Rate:</span>
                                      <span className="font-bold text-primary">{d.exchangeRate.toFixed(2)} BDT/USD</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Inflation Rate (CPI):</span>
                                      <span className="font-bold text-amber-500">{d.inflation.toFixed(2)}%</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                                    Source Data: Weighted Average Interbank Exchange Rate &amp; Consumer Price Index
                                  </div>
                                  <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                    <div><strong>Source:</strong> <a href="https://www.bb.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bangladesh Bank</a> &amp; BBS Databases</div>
                                    <div><strong>Audited by:</strong> BBS Statistics Division / Bangladesh Bank Audit</div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                          <Bar yAxisId="left" dataKey="exchangeRate" name="USD Exchange Rate (BDT)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={25} />
                          <Line yAxisId="right" type="monotone" dataKey="inflation" name="Inflation Rate (%)" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="grid-explorer-skeleton" />
                    )}
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                    <span>Source: <a href="https://www.bb.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Bangladesh Bank Interbank Weighted Average Statistics</a> &amp; BBS Inflation Database</span>
                    <span>Audited by: Bangladesh Bank Monetary Policy Division / BBS Census Bureau</span>
                    <span className="font-medium">Reporting Period: Macro-Economic Tracker (2010 - 2026)</span>
                  </div>
                </div>

                {/* Spot LNG vs Coal Import Price Trends */}
                <div className="grid-explorer-chart-card card">
                  <div className="grid-explorer-chart-card__head">
                    <div>
                      <h3 className="grid-explorer-chart-card__title">Global Fuel Commodity Import Costs</h3>
                      <p className="grid-explorer-chart-card__sub">Spot LNG (USD/MMBtu) vs. Import Coal (USD/Metric Ton)</p>
                    </div>
                    <span className="grid-explorer-chip">Import Costs</span>
                  </div>

                  <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={macroEconomicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis dataKey="year" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              return (
                                <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                  <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                    <span>Fuel Import Cost {d.year}</span>
                                    <span className="text-[9px] uppercase font-bold text-purple-500 tracking-wider">Commodities</span>
                                  </div>
                                  <div className="space-y-2 text-[11px] md:text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground text-purple-400 font-medium">Spot LNG (R-LNG):</span>
                                      <span className="font-bold text-purple-500">${d.spotLng.toFixed(2)} / MMBtu</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground text-slate-400">Imported Coal (CIF):</span>
                                      <span className="font-bold text-slate-400">${d.importCoal.toFixed(2)} / Ton</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                                    Indices: Platts JKM Spot Gas LNG &amp; Newcastle Thermal Coal Price Index
                                  </div>
                                  <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                    <div><strong>Source:</strong> Petrobangla LNG Division / BPDB Coal Purchase audits</div>
                                    <div><strong>Audited by:</strong> RPGCL / Bangladesh Coal Power Generation Company</div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                          <Area yAxisId="left" type="monotone" dataKey="spotLng" name="Spot LNG (USD/MMBtu)" stroke="#a855f7" fill="rgba(168, 85, 247, 0.15)" strokeWidth={2} />
                          <Line yAxisId="right" type="monotone" dataKey="importCoal" name="Import Coal (USD/Ton)" stroke="#94a3b8" strokeWidth={2.5} dot={{ fill: '#94a3b8', r: 3 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="grid-explorer-skeleton" />
                    )}
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                    <span>Source: OPEC Bulletin Daily Spot Prices &amp; Platts JKM LNG Assessments / BPC Accounts</span>
                    <span>Audited by: World Bank Commodity Division / BPC Price Auditing Committee</span>
                    <span className="font-medium">Reporting Period: Global Indexes (2010 - 2026)</span>
                  </div>
                </div>
              </div>

              {/* Retail pricing table */}
              <div className="grid-explorer-chart-card card">
                <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
                  <TrendingUp className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <h3 className="grid-explorer-chart-card__title">Retail Fuel &amp; Macro Pricing Benchmarks</h3>
                    <p className="grid-explorer-chart-card__sub">Historical correlation between BDT devaluation and retail petroleum price hikes</p>
                  </div>
                </div>

                <div className="grid-explorer-table-wrap">
                  <table className="grid-explorer-table text-xs">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th className="text-right">Retail Diesel (Tk/L)</th>
                        <th className="text-right">Retail Octane (Tk/L)</th>
                        <th className="text-right">Spot LNG (USD/MMBtu)</th>
                        <th className="text-right">Import Coal (USD/Ton)</th>
                        <th className="text-right">Exchange Rate (BDT/USD)</th>
                        <th className="text-right">Inflation Rate (CPI %)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {macroEconomicData.map((d, idx) => (
                        <tr key={idx}>
                          <td className="font-semibold">{d.year}</td>
                          <td className="text-right tabular-nums">{d.retailDiesel.toFixed(2)} Tk</td>
                          <td className="text-right tabular-nums">{d.retailOctane.toFixed(2)} Tk</td>
                          <td className="text-right tabular-nums">${d.spotLng.toFixed(2)}</td>
                          <td className="text-right tabular-nums">${d.importCoal.toFixed(2)}</td>
                          <td className="text-right tabular-nums font-semibold text-primary">{d.exchangeRate.toFixed(2)} Tk</td>
                          <td className="text-right tabular-nums font-semibold text-amber-500">{d.inflation.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card Metadata Footer */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                  <span>Source: <a href="https://bpc.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPC Retail Gazettes</a> &amp; <a href="https://www.bb.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Bangladesh Bank Databases</a></span>
                  <span>Audited by: BPC Accounts Division &amp; World Bank commodity research division</span>
                  <span className="font-medium">Reporting Period: Historical Macro Pricing Benchmarks (2010 - 2026)</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Annual Reports (Audited Statements) */}
          {macroSubTab === 'reports' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportsCompany('bpdb')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg border transition-all",
                      reportsCompany === 'bpdb'
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    BPDB Power Audited Statements
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportsCompany('petrobangla')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg border transition-all",
                      reportsCompany === 'petrobangla'
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    Petrobangla Gas Audited Statements
                  </button>
                </div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Audited Financial History</span>
              </div>

              {reportsCompany === 'bpdb' ? (
                <div className="space-y-6">
                  {/* BPDB Audited chart */}
                  <div className="grid-explorer-chart-card card">
                    <div className="grid-explorer-chart-card__head">
                      <div>
                        <h3 className="grid-explorer-chart-card__title">BPDB Annual Cost, Revenue &amp; Subsidy Profile (Crore BDT)</h3>
                        <p className="grid-explorer-chart-card__sub">Historical audited gap showing rising purchase costs vs treasury transfers</p>
                      </div>
                    </div>

                    <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 !h-[22rem]">
                      {chartsReady ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={bpdbAuditedFinancials} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                            <XAxis dataKey="year" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const d = payload[0].payload;
                                return (
                                  <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                    <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                      <span>BPDB {d.year} Financials</span>
                                      <span className="text-[9px] md:text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Audited Ledger</span>
                                    </div>
                                    <div className="space-y-2 text-[11px] md:text-xs">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Operating Revenue:</span>
                                        <span className="font-bold text-foreground">{formatNumber(d.revenue)} Crore Tk</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground text-destructive">Gen &amp; Purchase Cost:</span>
                                        <span className="font-bold text-destructive">{formatNumber(d.cost)} Crore Tk</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground text-emerald-500">Government Subsidy:</span>
                                        <span className="font-bold text-emerald-500">{formatNumber(d.subsidy)} Crore Tk</span>
                                      </div>
                                      <div className="flex justify-between border-t border-border/30 pt-1">
                                        <span className="text-destructive font-bold">Net Profit/Loss:</span>
                                        <span className="font-bold text-destructive">{formatNumber(d.loss)} Crore Tk</span>
                                      </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                                      Formula: Net Profit/Loss = (Revenue + Subsidy) - Generation &amp; Purchase Cost
                                    </div>
                                    <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                      <div><strong>Source:</strong> <a href="https://www.bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BPDB Annual Financial Report</a></div>
                                      <div><strong>Audited by:</strong> SF Ahmed &amp; Co. Chartered Accountants / CAG Bangladesh</div>
                                    </div>
                                  </div>
                                );
                              }}
                            />
                            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="revenue" name="Operating Revenue" fill="#0ea5e9" stackId="a" radius={[2, 2, 0, 0]} maxBarSize={20} />
                            <Bar dataKey="subsidy" name="Govt Subsidy" fill="#10b981" stackId="a" radius={[2, 2, 0, 0]} maxBarSize={20} />
                            <Bar dataKey="cost" name="Gen &amp; Purchase Cost" fill="#f43f5e" radius={[2, 2, 0, 0]} maxBarSize={20} />
                            <Line type="monotone" dataKey="loss" name="Net Loss (after subsidy)" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="grid-explorer-skeleton" />
                      )}
                    </div>

                    {/* Card Metadata Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                      <span>Source: <a href="https://bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPDB Annual Financial Reports</a></span>
                      <span>Audited by: SF Ahmed &amp; Co. Chartered Accountants / Office of the CAG Bangladesh</span>
                      <span className="font-medium">Reporting Period: Audited Accounts (FY 2010 - FY 2026)</span>
                    </div>
                  </div>

                  {/* BPDB table */}
                  <div className="grid-explorer-chart-card card">
                    <div className="grid-explorer-table-wrap">
                      <table className="grid-explorer-table text-xs">
                        <thead>
                          <tr>
                            <th>Fiscal Year</th>
                            <th className="text-right">Operating Revenue (Crore BDT)</th>
                            <th className="text-right">Generation &amp; Purchase Cost (Crore BDT)</th>
                            <th className="text-right">Govt Subsidy Received (Crore BDT)</th>
                            <th className="text-right">Net Profit / Loss (Crore BDT)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bpdbAuditedFinancials.map((d, idx) => (
                            <tr key={idx}>
                              <td className="font-semibold">{d.year}</td>
                              <td className="text-right tabular-nums">{formatNumber(d.revenue)}</td>
                              <td className="text-right tabular-nums text-destructive">{formatNumber(d.cost)}</td>
                              <td className="text-right tabular-nums text-emerald-500 font-semibold">{formatNumber(d.subsidy)}</td>
                              <td className="text-right tabular-nums font-bold text-destructive">{formatNumber(d.loss)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Card Metadata Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                      <span>Source: <a href="https://bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPDB Annual Financial Reports</a></span>
                      <span>Audited by: SF Ahmed &amp; Co. Chartered Accountants / Office of the CAG Bangladesh</span>
                      <span className="font-medium">Reporting Period: Audited Financial Statements (FY 2010 - FY 2026)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Petrobangla Audited Chart */}
                  <div className="grid-explorer-chart-card card">
                    <div className="grid-explorer-chart-card__head">
                      <div>
                        <h3 className="grid-explorer-chart-card__title">Petrobangla Annual Revenue &amp; LNG Import Costs</h3>
                        <p className="grid-explorer-chart-card__sub">Audited historical financials illustrating LNG import cost burden (Crore BDT)</p>
                      </div>
                    </div>

                    <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 !h-[22rem]">
                      {chartsReady ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={petrobanglaAuditedFinancials} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                            <XAxis dataKey="year" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const d = payload[0].payload;
                                const profitLabel = d.netProfit >= 0 ? 'Net Profit' : 'Net Loss';
                                const profitColorClass = d.netProfit >= 0 ? 'text-emerald-500 font-semibold' : 'text-destructive font-semibold';
                                return (
                                  <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                    <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                      <span>Petrobangla {d.year} Financials</span>
                                      <span className="text-[9px] md:text-[10px] uppercase font-bold text-primary tracking-wider">Audited Ledger</span>
                                    </div>
                                    <div className="space-y-2 text-[11px] md:text-xs">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Gas Sales Revenue:</span>
                                        <span className="font-bold text-foreground">{formatNumber(d.revenue)} Crore Tk</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground text-purple-400 font-medium">LNG Import Payments:</span>
                                        <span className="font-bold text-purple-500">{formatNumber(d.lngCost)} Crore Tk</span>
                                      </div>
                                      <div className="flex justify-between border-t border-border/30 pt-1">
                                        <span className="text-muted-foreground">{profitLabel}:</span>
                                        <span className={profitColorClass}>{formatNumber(d.netProfit)} Crore Tk</span>
                                      </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                                      Formula: Net Income/Loss = Operating Revenue - Operational &amp; LNG Import Costs
                                    </div>
                                    <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                      <div><strong>Source:</strong> <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Petrobangla Audited Balance Sheets</a></div>
                                      <div><strong>Audited by:</strong> MABS &amp; J Partners Chartered Accountants / CAG Bangladesh</div>
                                    </div>
                                  </div>
                                );
                              }}
                            />
                            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="revenue" name="Gas Sales Revenue" fill="#0ea5e9" radius={[2, 2, 0, 0]} maxBarSize={20} />
                            <Bar dataKey="lngCost" name="LNG Import Cost" fill="#a855f7" radius={[2, 2, 0, 0]} maxBarSize={20} />
                            <Line type="monotone" dataKey="netProfit" name="Net Income / Loss" stroke="#eab308" strokeWidth={3} dot={{ fill: '#eab308', r: 4 }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="grid-explorer-skeleton" />
                      )}
                    </div>

                    {/* Card Metadata Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                      <span>Source: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Petrobangla Audited Financial Accounts</a></span>
                      <span>Audited by: MABS &amp; J Partners Chartered Accountants / Office of the CAG Bangladesh</span>
                      <span className="font-medium">Reporting Period: Audited Balance Sheets (FY 2010 - FY 2026)</span>
                    </div>
                  </div>

                  {/* Petrobangla table */}
                  <div className="grid-explorer-chart-card card">
                    <div className="grid-explorer-table-wrap">
                      <table className="grid-explorer-table text-xs">
                        <thead>
                          <tr>
                            <th>Fiscal Year</th>
                            <th className="text-right">Gas Sales Revenue (Crore BDT)</th>
                            <th className="text-right">LNG Import Costs (Crore BDT)</th>
                            <th className="text-right">Net Profit / Loss (Crore BDT)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {petrobanglaAuditedFinancials.map((d, idx) => (
                            <tr key={idx}>
                              <td className="font-semibold">{d.year}</td>
                              <td className="text-right tabular-nums">{formatNumber(d.revenue)}</td>
                              <td className="text-right tabular-nums text-purple-500">{formatNumber(d.lngCost)}</td>
                              <td className={cn("text-right tabular-nums font-bold", d.netProfit > 0 ? "text-emerald-500" : "text-destructive")}>
                                {formatNumber(d.netProfit)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Card Metadata Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                      <span>Source: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Petrobangla Audited Financial Accounts</a></span>
                      <span>Audited by: MABS &amp; J Partners Chartered Accountants / Office of the CAG Bangladesh</span>
                      <span className="font-medium">Reporting Period: Audited Accounts Summary (FY 2010 - FY 2026)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-tab: Global vs. Domestic Pricing Comparisons */}
          {macroSubTab === 'global' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs text-muted-foreground flex flex-col gap-2">
                <div>
                  <strong className="text-foreground">Global Benchmark Comparison:</strong> Energy cost volatility in Bangladesh is structurally linked to global commodity indexes. This dashboard tracks global benchmark pricing (Brent Crude, World Bank Gas/JKM indexes, and IRENA Solar LCOE) against domestic retail tariffs since 1975, highlighting historical subsidy periods and cost de-linkages.
                </div>
                <div className="pt-1.5 border-t border-border/30">
                  Values are converted to BDT equivalents based on historical weighted interbank exchange rates. Click citations inside tooltips to view official verified publications.
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Chart 1: Oil vs Diesel */}
                <div className="grid-explorer-chart-card card">
                  <div className="grid-explorer-chart-card__head">
                    <div>
                      <h3 className="grid-explorer-chart-card__title">Brent Crude vs. Retail Diesel</h3>
                      <p className="grid-explorer-chart-card__sub">Brent Crude (USD/Bbl) vs. Domestic Retail Diesel (Tk/L) since 1975</p>
                    </div>
                    <span className="grid-explorer-chip bg-blue-500/5 text-blue-500 border-blue-500/10">Petroleum</span>
                  </div>

                  <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 !h-[22rem]">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={globalVsDomesticData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis dataKey="year" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="left" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} label={{ value: 'Brent Crude ($/bbl)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: '9px', fill: chartTheme.axisTick } }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} Tk`} label={{ value: 'Retail Diesel (Tk/L)', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: '9px', fill: chartTheme.axisTick } }} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              const exRate = historicalExchangeRates[d.year] || 122.0;
                              // 1 bbl = 158.987 L
                              const brentBdtL = (d.globalOil * exRate) / 158.987;
                              const difference = d.bdDiesel - brentBdtL;
                              return (
                                <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                  <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                    <span>Benchmark Oil Price ({d.year})</span>
                                    <span className="text-[9px] uppercase font-bold text-blue-500 tracking-wider">Oil</span>
                                  </div>
                                  <div className="space-y-2 text-[11px] md:text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Brent Crude:</span>
                                      <span className="font-bold text-blue-500">${d.globalOil.toFixed(2)} / Bbl</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Exchange Rate:</span>
                                      <span className="font-semibold text-foreground">{exRate.toFixed(2)} Tk/$</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border/20 pt-1">
                                      <span className="text-muted-foreground">Brent Cost (Tk/L equivalent):</span>
                                      <span className="font-bold text-blue-400">{brentBdtL.toFixed(2)} Tk/L</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">BD Retail Diesel:</span>
                                      <span className="font-bold text-emerald-500">{d.bdDiesel.toFixed(2)} Tk/L</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border/20 pt-1 border-dashed">
                                      <span className="text-muted-foreground">Margin / Subsidy Gap:</span>
                                      <span className={cn("font-bold", difference >= 0 ? "text-emerald-500" : "text-destructive")}>
                                        {difference >= 0 ? `+${difference.toFixed(2)} Tk/L (Premium)` : `${difference.toFixed(2)} Tk/L (Subsidized)`}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-2.5 pt-1.5 border-t border-border/30 text-[8px] text-muted-foreground leading-normal font-medium">
                                    <strong>Formula:</strong> <code>(Brent USD * Exchange Rate) / 158.987 L</code>
                                  </div>
                                  <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                    <div><strong>Auditor:</strong> OPEC Bulletin &amp; World Bank Pink Sheet / BPC Audits</div>
                                    <div><strong>Ref:</strong> <a href="https://bpc.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BPC Pricing Gazettes</a></div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                          <Line yAxisId="left" type="monotone" dataKey="globalOil" name="Brent Crude ($/bbl)" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} />
                          <Area yAxisId="right" type="monotone" dataKey="bdDiesel" name="BD Retail Diesel (Tk/L)" fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 3 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="grid-explorer-skeleton" />
                    )}
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                    <span>Source: OPEC Bulletin Historical Spot Prices &amp; <a href="https://bpc.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPC Official Pricing Gazettes</a></span>
                    <span>Audited by: BPC Pricing Committee &amp; OPEC Secretariat</span>
                    <span className="font-medium">Reporting Period: Global Comparison (1975 - 2026)</span>
                  </div>
                </div>

                {/* Chart 2: Gas vs Tariff */}
                <div className="grid-explorer-chart-card card">
                  <div className="grid-explorer-chart-card__head">
                    <div>
                      <h3 className="grid-explorer-chart-card__title">Global LNG Benchmark vs. Gas Tariff</h3>
                      <p className="grid-explorer-chart-card__sub">Global Gas/LNG (USD/MMBtu) vs. BD Avg Tariff (Tk/CM) since 2010</p>
                    </div>
                    <span className="grid-explorer-chip bg-violet-500/5 text-violet-500 border-violet-500/10">Natural Gas</span>
                  </div>

                  <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 !h-[22rem]">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={globalVsDomesticData.filter(x => parseInt(x.year) >= 2010)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis dataKey="year" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="left" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} label={{ value: 'Global LNG ($/MMBtu)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: '9px', fill: chartTheme.axisTick } }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} Tk`} label={{ value: 'BD Avg Gas Tariff (Tk/CM)', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: '9px', fill: chartTheme.axisTick } }} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              const exRate = historicalExchangeRates[d.year] || 122.0;
                              // 1 MMBtu = 28.3 CM (Cubic Meters)
                              const globalGasBdtCm = (d.globalGas * exRate) / 28.3;
                              const difference = d.bdGas - globalGasBdtCm;
                              return (
                                <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                  <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                    <span>Benchmark Gas Price ({d.year})</span>
                                    <span className="text-[9px] uppercase font-bold text-violet-500 tracking-wider">Gas</span>
                                  </div>
                                  <div className="space-y-2 text-[11px] md:text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Global LNG (US/JKM):</span>
                                      <span className="font-bold text-violet-500">${d.globalGas.toFixed(2)} / MMBtu</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Exchange Rate:</span>
                                      <span className="font-semibold text-foreground">{exRate.toFixed(2)} Tk/$</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border/20 pt-1">
                                      <span className="text-muted-foreground">Global Gas (Tk/CM equivalent):</span>
                                      <span className="font-bold text-violet-400">{globalGasBdtCm.toFixed(2)} Tk/CM</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">BD Avg Gas Tariff:</span>
                                      <span className="font-bold text-amber-500">{d.bdGas.toFixed(2)} Tk/CM</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border/20 pt-1 border-dashed">
                                      <span className="text-muted-foreground">Subsidization Gap:</span>
                                      <span className={cn("font-bold", difference >= 0 ? "text-emerald-500" : "text-destructive")}>
                                        {difference >= 0 ? `+${difference.toFixed(2)} Tk/CM` : `${difference.toFixed(2)} Tk/CM (Subsidized)`}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-2.5 pt-1.5 border-t border-border/30 text-[8px] text-muted-foreground leading-normal font-medium">
                                    <strong>Formula:</strong> <code>(Global LNG USD * Exchange Rate) / 28.3 CM</code>
                                  </div>
                                  <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                    <div><strong>Auditor:</strong> World Bank Pink Sheet &amp; JKM Index / Petrobangla Audits</div>
                                    <div><strong>Ref:</strong> <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Petrobangla Audited Reports</a></div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                          <Line yAxisId="left" type="monotone" dataKey="globalGas" name="Global LNG ($/MMBtu)" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 3 }} />
                          <Area yAxisId="right" type="monotone" dataKey="bdGas" name="BD Avg Gas Tariff (Tk/CM)" fill="#f59e0b" fillOpacity={0.05} stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 3 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="grid-explorer-skeleton" />
                    )}
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                    <span>Source: World Bank Pink Sheets &amp; <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Petrobangla Annual Reports</a></span>
                    <span>Audited by: BERC Tariff Division &amp; World Bank Commodity Markets Group</span>
                    <span className="font-medium">Reporting Period: Global Comparison (2010 - 2026)</span>
                  </div>
                </div>
              </div>

              {/* Chart 3: Solar LCOE vs feed in tariff */}
              <div className="grid-explorer-chart-card card max-w-full">
                <div className="grid-explorer-chart-card__head">
                  <div>
                    <h3 className="grid-explorer-chart-card__title">Solar LCOE Global Trend vs. Bangladesh Feed-In Tariff</h3>
                    <p className="grid-explorer-chart-card__sub">Global Average Solar LCOE vs. Domestic Solar Contracts (Tk/KWh) since 2015</p>
                  </div>
                  <span className="grid-explorer-chip bg-teal-500/5 text-teal-500 border-teal-500/10">Solar Energy</span>
                </div>

                <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 !h-[22rem]">
                  {chartsReady ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={globalVsDomesticData.filter(x => parseInt(x.year) >= 2015)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                        <XAxis dataKey="year" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} Tk`} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0].payload;
                            const exRate = historicalExchangeRates[d.year] || 122.0;
                            // globalSolar LCOE is in cents/kWh, convert to BDT: cents * exRate / 100
                            const globalSolarBdt = (d.globalSolar * exRate) / 100;
                            const premium = d.bdSolar - globalSolarBdt;
                            return (
                              <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                  <span>Solar PV Benchmarks ({d.year})</span>
                                  <span className="text-[9px] uppercase font-bold text-teal-500 tracking-wider">Solar</span>
                                </div>
                                <div className="space-y-2 text-[11px] md:text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Global Solar LCOE:</span>
                                    <span className="font-bold text-teal-500">{d.globalSolar.toFixed(2)} US Cents/KWh</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Exchange Rate:</span>
                                    <span className="font-semibold text-foreground">{exRate.toFixed(2)} Tk/$</span>
                                  </div>
                                  <div className="flex justify-between border-t border-border/20 pt-1">
                                    <span className="text-muted-foreground">Global Solar (Tk/KWh equivalent):</span>
                                    <span className="font-bold text-teal-400">{globalSolarBdt.toFixed(2)} Tk/KWh</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">BD Solar Contract Tariff:</span>
                                    <span className="font-bold text-rose-500">{d.bdSolar.toFixed(2)} Tk/KWh</span>
                                  </div>
                                  <div className="flex justify-between border-t border-border/20 pt-1 border-dashed">
                                    <span className="text-muted-foreground">Domestic Contract Premium:</span>
                                    <span className={cn("font-bold", premium >= 0 ? "text-rose-500" : "text-emerald-500")}>
                                      {premium >= 0 ? `+${premium.toFixed(2)} Tk/KWh (Premium)` : `${premium.toFixed(2)} Tk/KWh`}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2.5 pt-1.5 border-t border-border/30 text-[8px] text-muted-foreground leading-normal font-medium">
                                  <strong>Formula:</strong> <code>(Global LCOE Cents * Exchange Rate) / 100</code>
                                </div>
                                <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                  <div><strong>Auditor:</strong> IRENA Renewable Costs &amp; SREDA Solar Registry / BPDB Planning</div>
                                  <div><strong>Ref:</strong> <a href="http://www.renewableenergy.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SREDA Databases</a></div>
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                        <Line type="monotone" dataKey="globalSolarBdt" name="Global Solar LCOE (Tk/KWh)" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: '#14b8a6', r: 3 }} />
                        <Line type="monotone" dataKey="bdSolar" name="BD Solar Tariff (Tk/KWh)" stroke="#f43f5e" strokeWidth={2.5} dot={{ fill: '#f43f5e', r: 3 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="grid-explorer-skeleton" />
                  )}
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                    <span>Source: IRENA Renewable Cost Databases &amp; BPDB Power Purchase Agreements (PPAs)</span>
                    <span>Audited by: SREDA Solar Registry &amp; BPDB Planning &amp; Design Division</span>
                    <span className="font-medium">Reporting Period: Global Cost Comparison (2015 - 2026)</span>
                  </div>
                </div>
              </div>
            )}

          {/* Sub-tab 4: Gas Reserve Depletion Projections */}
          {macroSubTab === 'reserves' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-muted-foreground flex flex-col gap-2">
                <div>
                  <strong className="text-destructive">Critical Exhaustion Warning:</strong> Natural gas supplies over 55% of Bangladesh's electricity generation and 70% of industrial heating. The depletion of domestic fields is the single largest structural threat to the economy.
                </div>
                <div className="pt-1.5 border-t border-border/30">
                  Remaining recoverable gas reserves are estimated at <strong>7.63 Tcf</strong>. Without major new deep-water discoveries or massive LNG infrastructure investments, national gas production is expected to decline by over 50% by 2032.
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Depletion Curve Chart */}
                <div className="grid-explorer-chart-card card lg:col-span-2">
                  <div className="grid-explorer-chart-card__head">
                    <div>
                      <h3 className="grid-explorer-chart-card__title">Domestic Gas Reserves Exhaustion Timeline</h3>
                      <p className="grid-explorer-chart-card__sub">Remaining recoverable gas reserves under different demand scenarios (Tcf)</p>
                    </div>
                    <span className="grid-explorer-chip text-destructive border-destructive/20 bg-destructive/5">7.63 Tcf Left</span>
                  </div>

                  <div className="grid-explorer-chart-area grid-explorer-chart-area--lg mt-4 !h-[22rem]">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={reservesDepletionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis dataKey="year" tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: chartTheme.axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} Tcf`} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              return (
                                <div className="p-4 md:p-5 text-card-foreground border border-border/80 rounded-2xl shadow-2xl text-xs md:text-sm leading-relaxed w-72 md:w-80 max-w-[calc(100vw-2rem)] select-none bg-card">
                                  <div className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-2 flex items-center justify-between gap-2">
                                    <span>Reserves Remaining {d.year}</span>
                                    <span className="text-[9px] uppercase font-bold text-destructive tracking-wider">Depletion Forecast</span>
                                  </div>
                                  <div className="space-y-2 text-[11px] md:text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Scenario A (Low Growth):</span>
                                      <span className="font-bold text-emerald-500">{d.lowGrowth.toFixed(2)} Tcf</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Scenario B (BAU):</span>
                                      <span className="font-bold text-amber-500">{d.bau.toFixed(2)} Tcf</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Scenario C (High Growth):</span>
                                      <span className="font-bold text-destructive">{d.highGrowth.toFixed(2)} Tcf</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-border/30 text-[9px] md:text-[10px] text-muted-foreground leading-normal italic font-medium">
                                    Baseline: 7.63 Tcf remaining recoverable reserves out of 29.74 Tcf initial reserves
                                  </div>
                                  <div className="mt-2 pt-1.5 border-t border-border/20 text-[8px] md:text-[9px] text-muted-foreground flex flex-col gap-0.5">
                                    <div><strong>Source:</strong> <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Petrobangla Reservoir Study &amp; CAG audits</a></div>
                                    <div><strong>Analysis:</strong> Hydrocarbon Unit Bangladesh / Petrobangla planning division</div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                          <Line type="monotone" dataKey="bau" name="Business-As-Usual (Exhaustion: 2035)" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
                          <Line type="monotone" dataKey="lowGrowth" name="Low Demand Growth (Exhaustion: 2037)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                          <Line type="monotone" dataKey="highGrowth" name="High Growth Demand (Exhaustion: 2033)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="grid-explorer-skeleton" />
                    )}
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                    <span>Source: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Petrobangla Hydrocarbon Unit Reports</a></span>
                    <span>Audited by: Petrobangla Reservoir &amp; Planning Division</span>
                    <span className="font-medium">Reporting Period: Reservoir Depletion Projections (2026 - 2038)</span>
                  </div>
                </div>

                {/* Scenario breakdown cards */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="card p-4 border-l-4 border-l-emerald-500 space-y-1">
                    <div className="font-bold text-xs uppercase text-emerald-500 tracking-wider">Scenario A: Low Demand Growth</div>
                    <div className="text-xl font-bold text-foreground">Exhaustion: 2037</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Assumes massive deployment of utility-scale clean renewables and strong industrial energy conservation programs, extending reserve life by 2 years.
                    </p>
                  </div>

                  <div className="card p-4 border-l-4 border-l-amber-500 space-y-1">
                    <div className="font-bold text-xs uppercase text-amber-500 tracking-wider">Scenario B: Business-As-Usual</div>
                    <div className="text-xl font-bold text-foreground">Exhaustion: 2035</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Assumes typical 4-5% annual gas consumption growth. Domestic extraction rates hit absolute zero in 9 years, triggering massive structural import dependence.
                    </p>
                  </div>

                  <div className="card p-4 border-l-4 border-l-red-500 space-y-1">
                    <div className="font-bold text-xs uppercase text-red-500 tracking-wider">Scenario C: High Growth Demand</div>
                    <div className="text-xl font-bold text-foreground">Exhaustion: 2033</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Assumes rapid post-2026 industrial expansion without efficiency measures. Remaining reserves deplete in under 7 years, causing severe supply gaps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-2 text-[10px] text-muted-foreground/75 px-1">
                <span>Source: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Petrobangla Reservoir Studies</a> &amp; Hydrocarbon Unit Bangladesh</span>
                <span>Audited by: Ministry of Power, Energy &amp; Mineral Resources (MPEMR)</span>
                <span>Reporting Period: Multi-Scenario Exhaustion Forecasts (2026)</span>
              </div>
            </div>
          )}

          {macroSubTab === 'insights' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-xs text-muted-foreground flex flex-col gap-2">
                <div>
                  <strong className="text-primary font-bold">Analyst &amp; Investor Advisory:</strong> This advisory panel integrates audited financial statements, central bank weighted exchange rate data, and Petrobangla production filings to isolate critical financial clues, cash-flow risks, and industrial utilization metrics for energy sector analysts and public equity investors.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Insights Card 1 */}
                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-border/40">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="font-display font-bold text-sm text-foreground">Listed IPPs Receivables &amp; Working Capital Risk</h4>
                      <p className="text-[10px] text-muted-foreground">Analysis for Summit Power, Baraka, United Power equity holders</p>
                    </div>
                  </div>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">BPDB Arrears Payment Aging:</span>
                      <span className="font-semibold text-destructive">150 - 180 Days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Est. System Outstanding Arrears:</span>
                      <span className="font-semibold text-foreground">~26,500 Crore BDT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Working Capital Interest Rate:</span>
                      <span className="font-semibold text-foreground">12.5% - 14.5% (Weighted Average)</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/90 leading-relaxed pt-1.5 border-t border-border/20">
                      <strong>Analytical Insight:</strong> Due to BPDB's treasury deficit, payment aging to private Independent Power Producers (IPPs) has inflated from 60 days to over 150 days. Listed IPPs carry heavy receivables on their balance sheets, forcing reliance on high-interest working capital loans (up to 14.5% in 2026), which compresses net profit margins and dilutes dividend payout capacity.
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-border/20 text-[10px] text-muted-foreground/80 flex flex-wrap justify-between gap-x-2 gap-y-1">
                    <span>Source: <a href="https://bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPDB Finance Reports</a></span>
                    <span>Audited by: SF Ahmed &amp; Co / CAG Bangladesh</span>
                    <span className="font-medium">Reporting Date: Jun 2026</span>
                  </div>
                </div>

                {/* Insights Card 2 */}
                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-border/40">
                    <Globe className="h-5 w-5 text-sky-500" />
                    <div>
                      <h4 className="font-display font-bold text-sm text-foreground">Forex Exposure &amp; Currency Devaluation Burden</h4>
                      <p className="text-[10px] text-muted-foreground">Macro-economic impact on national fuel imports</p>
                    </div>
                  </div>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">6-Year Devaluation Trend (BDT/USD):</span>
                      <span className="font-semibold text-destructive">+43.70% (84.90 to 122.00)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Dollar-Denominated Gas Reliance:</span>
                      <span className="font-semibold text-foreground">~73.2% of supply (IOCs + LNG)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Est. Daily Currency Surcharge:</span>
                      <span className="font-semibold text-foreground">1.8 Crore BDT / Tk-devaluation</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/90 leading-relaxed pt-1.5 border-t border-border/20">
                      <strong>Analytical Insight:</strong> With over 73.2% of national gas supply linked to USD pricing (comprising Chevron IOC fields at ~35.1% and RPGCL LNG terminals at ~38.1%), devaluations increase BDT wholesale costs. Each 1 BDT depreciation against the USD inflates daily imported fuel overheads by ~1.8 Crore BDT, driving the structural deficit at BPDB and Petrobangla.
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-border/20 text-[10px] text-muted-foreground/80 flex flex-wrap justify-between gap-x-2 gap-y-1">
                    <span>Source: <a href="https://www.bb.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Bangladesh Bank Exchange Stats</a></span>
                    <span>Verified by: BERC Tariff Division</span>
                    <span className="font-medium">Reporting Date: Jun 2026</span>
                  </div>
                </div>

                {/* Insights Card 3 */}
                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-border/40">
                    <Activity className="h-5 w-5 text-rose-500" />
                    <div>
                      <h4 className="font-display font-bold text-sm text-foreground">Industrial Gas Shortage &amp; Corporate Earnings Clues</h4>
                      <p className="text-[10px] text-muted-foreground">Earnings impact on listed steel, cement, and textile mills</p>
                    </div>
                  </div>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">National Gas Deficit:</span>
                      <span className="font-semibold text-destructive">30.33% (~1,150 MMCFD short)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Industrial Zone Plant Utilization:</span>
                      <span className="font-semibold text-foreground">55% - 70% (Pressure drop below 2 psi)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Operating Margin Impact (bps):</span>
                      <span className="font-semibold text-destructive">-300 to -450 bps</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/90 leading-relaxed pt-1.5 border-t border-border/20">
                      <strong>Analytical Insight:</strong> Listed manufacturing giants (e.g. BSRM, GPH Ispat, LafargeHolcim) face pressure drops in industrial grids. Running factories at only 55-70% utilization forces the purchase of expensive alternative fuels (LPG and Diesel), compressing operating margins by up to 450 bps and directly impacting listed industrial earnings.
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-border/20 text-[10px] text-muted-foreground/80 flex flex-wrap justify-between gap-x-2 gap-y-1">
                    <span>Source: <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Petrobangla Bulletins</a></span>
                    <span>Audited by: BBS Industry Census Division</span>
                    <span className="font-medium">Reporting Date: Jun 2026</span>
                  </div>
                </div>

                {/* Insights Card 4 */}
                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-border/40">
                    <Zap className="h-5 w-5 text-emerald-500" />
                    <div>
                      <h4 className="font-display font-bold text-sm text-foreground">Grid Capacity Margin &amp; Overcapacity Charges</h4>
                      <p className="text-[10px] text-muted-foreground">The operational driver of the national power subsidy</p>
                    </div>
                  </div>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Installed National Grid Capacity:</span>
                      <span className="font-semibold text-foreground">28,420 MW</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Peak Daily Grid Load (Evening):</span>
                      <span className="font-semibold text-foreground">16,154.41 MW</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Surplus Unutilized Capacity:</span>
                      <span className="font-semibold text-amber-500">43.16% (12,266 MW idle)</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/90 leading-relaxed pt-1.5 border-t border-border/20">
                      <strong>Analytical Insight:</strong> Bangladesh operates with a surplus capacity of 43.16%. While providing base-load security, it triggers contractually binding "capacity charges" paid to idle private power plants. These structural capacity charges cost the state an estimated 1.88 Crore BDT daily, driving BPDB's 39,000 Crore BDT operating subsidy requirement.
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-border/20 text-[10px] text-muted-foreground/80 flex flex-wrap justify-between gap-x-2 gap-y-1">
                    <span>Source: <a href="https://bpdb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPDB Annual Financials</a></span>
                    <span>Audited by: CAG Bangladesh Audit Teams</span>
                    <span className="font-medium">Reporting Date: Jun 2026</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer / Notes */}
      <div className="text-[10px] text-muted-foreground leading-relaxed mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-border/40 pt-4">
        <span>Report Period: 22-23 Jun 2026</span>
        <span>
          Sources:{' '}
          <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">PGCB/NLDC Operations</a> ·{' '}
          <a href="https://www.petrobangla.org.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Petrobangla Reports</a> ·{' '}
          <a href="http://www.renewableenergy.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">SREDA Database</a> ·{' '}
          <a href="https://bpc.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">BPC Pricing</a>
        </span>
        <span>All data scraped from verified official daily publications.</span>
      </div>
    </div>
  );
}