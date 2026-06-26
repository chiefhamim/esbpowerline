'use client';

import { useEffect, useId, useState, useRef, RefObject, useMemo } from 'react';
import Link from 'next/link';
import {
  Zap, Activity, Cable, TrendingUp, FileText, BarChart3, MapPin, DollarSign, Database, Droplet, Globe, Sun,
  Search, ChevronLeft, ChevronRight, ChevronDown, Check, Info, Map, Network, CheckSquare, Calendar
} from 'lucide-react';
import { substationsData } from '@/lib/substations-data';
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
import { powerGridArchive, GridDailyData } from '@/lib/power-grid-archive';
import availableDatesListRaw from '@/lib/available-dates.json';
import pgcbMonthlyData from '@/lib/pgcb-monthly-data.json';
import { ongoingProjectsData } from '@/lib/ongoing-projects-data';
import { upcomingProjectsData } from '@/lib/upcoming-projects-data';
import { completedProjectsData } from '@/lib/completed-projects-data';

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

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
  icon?: React.ReactNode;
  prefixLabel?: string;
}

function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  isOpen,
  setIsOpen,
  dropdownRef,
  icon,
  prefixLabel
}: CustomDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value) || { label: placeholder, value };
  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-xs md:text-sm bg-muted/20 border border-border/40 rounded-xl text-foreground hover:bg-muted/30 hover:border-primary/30 focus:outline-none focus:border-primary/50 transition-all duration-150 font-medium shadow-sm"
      >
        <span className="truncate flex items-center gap-1.5 font-bold">
          {icon}
          {prefixLabel && <span className="text-muted-foreground font-medium mr-0.5">{prefixLabel}</span>}
          <span>{selectedOption.label}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-150", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all select-none text-left",
                  active
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {active && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getUpcomingProjectStatusInfo(statusStr: string) {
  const lowercase = statusStr.toLowerCase();
  if (lowercase.includes('approved')) {
    return {
      label: 'PDPP Approved',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-500 border-emerald-500/20',
      icon: Check
    };
  } else if (lowercase.includes('sent') || lowercase.includes('recast')) {
    return {
      label: 'PDPP Submitted',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400 border-blue-500/20',
      icon: FileText
    };
  } else if (lowercase.includes('feasibility')) {
    return {
      label: 'Feasibility Study',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400 border-cyan-500/20',
      icon: Activity
    };
  } else {
    return {
      label: 'Pipeline',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400 border-purple-500/20',
      icon: TrendingUp
    };
  }
}

function renderProjectCost(costStr: string | undefined | null) {
  if (!costStr || costStr.trim() === '' || costStr.toLowerCase().includes('n/a') || costStr === '-') {
    return <div className="font-bold text-foreground">N/A</div>;
  }

  const isLakh = costStr.toLowerCase().includes('lakh');
  if (isLakh) {
    // Extract the number part, handling commas and decimal points
    const cleanStr = costStr.replace(/,/g, '');
    const match = cleanStr.match(/\b[0-9.]+\b/);
    if (match) {
      const numVal = parseFloat(match[0]);
      if (!isNaN(numVal)) {
        const croreVal = numVal / 100;
        
        let formattedCrore = '';
        if (croreVal >= 1000) {
          const kCroreVal = croreVal / 1000;
          formattedCrore = kCroreVal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + 'K';
        } else {
          formattedCrore = croreVal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        }
        
        // Find if BDT or Tk is in the original string, default to BDT
        let currencySuffix = 'BDT';
        if (costStr.toLowerCase().includes('tk')) {
          currencySuffix = 'Tk';
        }

        return (
          <div className="space-y-0.5">
            <div className="font-bold text-foreground text-sm">{costStr}</div>
            <div className="text-[10px] text-muted-foreground font-semibold">
              (~{formattedCrore} Crore {currencySuffix})
            </div>
          </div>
        );
      }
    }
  }

  // Default: Return the raw string exactly as it is in the data file
  return <div className="font-bold text-foreground">{costStr}</div>;
}

interface PowerGridExplorerProps {
  initialMix?: any;
  initialLines?: any;
  initialProjects?: any;
  dbNodes?: any[];
  dbEdges?: any[];
}

export function PowerGridExplorer({ 
  initialMix, 
  initialLines, 
  initialProjects,
  dbNodes = [],
  dbEdges = []
}: PowerGridExplorerProps = {}) {
  const chartTheme = useChartTheme();
  
  // Date Selection States
  const availableDatesList = useMemo<string[]>(() => {
    const rawList = Array.isArray(availableDatesListRaw)
      ? (availableDatesListRaw as string[])
      : ((availableDatesListRaw as any)?.default as string[]) || [];
    return rawList.filter((d: any) => /^(201[3-9]|202[0-6])-\d{2}-\d{2}$/.test(String(d))) as string[];
  }, []);

  const latestDate = availableDatesList[availableDatesList.length - 1] || '2026-06-24';
  const [selectedDate, setSelectedDate] = useState<string>(latestDate);
  const [activeData, setActiveData] = useState<GridDailyData>(powerGridArchive['24 Jun 2026']);
  const [isLoadingDaily, setIsLoadingDaily] = useState<boolean>(false);

  const [isDailyYearDropdownOpen, setIsDailyYearDropdownOpen] = useState(false);
  const [isDailyMonthDropdownOpen, setIsDailyMonthDropdownOpen] = useState(false);
  const [isDailyDayDropdownOpen, setIsDailyDayDropdownOpen] = useState(false);

  const dailyYearDropdownRef = useRef<HTMLDivElement>(null);
  const dailyMonthDropdownRef = useRef<HTMLDivElement>(null);
  const dailyDayDropdownRef = useRef<HTMLDivElement>(null);

  // Split selectedDate (e.g. "2026-06-24") into year, month, day
  const [selectedYear, selectedMonth, selectedDay] = selectedDate.split('-');

  // Calculate options dynamically
  const years = useMemo(() => {
    return Array.from(new Set(availableDatesList.map(d => d.split('-')[0]))).sort((a, b) => b.localeCompare(a));
  }, [availableDatesList]);

  const yearOptions = useMemo(() => {
    return years.map(y => ({ label: y, value: y }));
  }, [years]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthsForYear = useMemo(() => {
    return Array.from(new Set(
      availableDatesList
        .filter(d => d.startsWith(selectedYear + '-'))
        .map(d => d.split('-')[1])
    )).sort((a, b) => a.localeCompare(b));
  }, [availableDatesList, selectedYear]);

  const monthOptions = useMemo(() => {
    return monthsForYear.map(m => ({
      label: monthNames[parseInt(m) - 1] || m,
      value: m
    }));
  }, [monthsForYear]);

  const daysForMonth = useMemo(() => {
    return Array.from(new Set(
      availableDatesList
        .filter(d => d.startsWith(selectedYear + '-' + selectedMonth + '-'))
        .map(d => d.split('-')[2])
    )).sort((a, b) => a.localeCompare(b));
  }, [availableDatesList, selectedYear, selectedMonth]);

  const dayOptions = useMemo(() => {
    return daysForMonth.map(d => ({
      label: String(parseInt(d)),
      value: d
    }));
  }, [daysForMonth]);

  const handleYearChange = (newYear: string) => {
    const months = Array.from(new Set(
      availableDatesList
        .filter(d => d.startsWith(newYear + '-'))
        .map(d => d.split('-')[1])
    )).sort((a, b) => a.localeCompare(b));
    if (months.length === 0) return;
    let targetMonth = selectedMonth;
    if (!months.includes(targetMonth)) {
      targetMonth = months[months.length - 1];
    }
    const days = Array.from(new Set(
      availableDatesList
        .filter(d => d.startsWith(newYear + '-' + targetMonth + '-'))
        .map(d => d.split('-')[2])
    )).sort((a, b) => a.localeCompare(b));
    if (days.length === 0) return;
    let targetDay = selectedDay;
    if (!days.includes(targetDay)) {
      targetDay = days[days.length - 1];
    }
    setSelectedDate(`${newYear}-${targetMonth}-${targetDay}`);
  };

  const handleMonthChange = (newMonth: string) => {
    const days = Array.from(new Set(
      availableDatesList
        .filter(d => d.startsWith(selectedYear + '-' + newMonth + '-'))
        .map(d => d.split('-')[2])
    )).sort((a, b) => a.localeCompare(b));
    if (days.length === 0) return;
    let targetDay = selectedDay;
    if (!days.includes(targetDay)) {
      targetDay = days[days.length - 1];
    }
    setSelectedDate(`${selectedYear}-${newMonth}-${targetDay}`);
  };

  const handleDayChange = (newDay: string) => {
    setSelectedDate(`${selectedYear}-${selectedMonth}-${newDay}`);
  };

  // Dynamic Fetch Effect
  useEffect(() => {
    let isMounted = true;
    if (!selectedDate) return;

    setIsLoadingDaily(true);
    fetch(`/data/daily/${selectedDate}.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch daily data: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setActiveData(data);
          setIsLoadingDaily(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          const formattedKeys: Record<string, string> = {
            '2026-06-22': '22 Jun 2026',
            '2026-06-24': '24 Jun 2026',
          };
          const legacyKey = formattedKeys[selectedDate];
          if (legacyKey && powerGridArchive[legacyKey]) {
            setActiveData(powerGridArchive[legacyKey]);
          }
          setIsLoadingDaily(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const [activeKpiTooltip, setActiveKpiTooltip] = useState<string | null>(null);
  const kpiStripRef = useRef<HTMLDivElement>(null);
  const kpiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleKpiTooltip = (tooltip: string) => {
    if (kpiTimeoutRef.current) {
      clearTimeout(kpiTimeoutRef.current);
      kpiTimeoutRef.current = null;
    }

    setActiveKpiTooltip((prev) => {
      const next = prev === tooltip ? null : tooltip;
      if (next) {
        kpiTimeoutRef.current = setTimeout(() => {
          setActiveKpiTooltip(null);
          kpiTimeoutRef.current = null;
        }, 2000); // Auto-close after 2 seconds
      }
      return next;
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (kpiStripRef.current && !kpiStripRef.current.contains(event.target as Node)) {
        setActiveKpiTooltip(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (kpiTimeoutRef.current) {
        clearTimeout(kpiTimeoutRef.current);
      }
    };
  }, []);
  const {
    systemStats,
    generationData,
    gasProductionData,
    gasDistributionData,
    borderImportsData,
    regionalDemandData,
    dailyOutages,
    hourlyLoadData
  } = activeData;

  // Ongoing & Upcoming Projects states & filters
  const [projectType, setProjectType] = useState<'ongoing' | 'upcoming'>('ongoing');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectPartnerFilter, setProjectPartnerFilter] = useState('all');
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState(false);
  const partnerDropdownRef = useRef<HTMLDivElement>(null);
  const [projectPage, setProjectPage] = useState(1);
  const projectsPerPage = 3;

  // Reset page when projectType changes
  useEffect(() => {
    setProjectPage(1);
  }, [projectType]);

  // Combined Projects filtering logic
  const filteredProjects = (projectType === 'ongoing' ? ongoingProjectsData : upcomingProjectsData).filter((proj) => {
    const matchesSearch = proj.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
                          proj.objectives.some(o => o.toLowerCase().includes(projectSearch.toLowerCase())) ||
                          proj.scope.some(s => s.toLowerCase().includes(projectSearch.toLowerCase())) ||
                          ('director' in proj ? proj.director.toLowerCase().includes(projectSearch.toLowerCase()) : false);
    const matchesPartner = projectPartnerFilter === 'all' ||
                           (projectPartnerFilter === 'N/A' && proj.partner === 'N/A') ||
                           (projectPartnerFilter !== 'N/A' && proj.partner.toLowerCase().includes(projectPartnerFilter.toLowerCase()));
    return matchesSearch && matchesPartner;
  });

  const paginatedProjects = filteredProjects.slice(
    (projectPage - 1) * projectsPerPage,
    projectPage * projectsPerPage
  );

  const totalProjectPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Completed Projects states & filters
  const [completedSearch, setCompletedSearch] = useState('');
  const [completedPartnerFilter, setCompletedPartnerFilter] = useState('all');
  const [isCompletedPartnerDropdownOpen, setIsCompletedPartnerDropdownOpen] = useState(false);
  const completedPartnerDropdownRef = useRef<HTMLDivElement>(null);
  const [completedPage, setCompletedPage] = useState(1);
  const completedPerPage = 3;

  // Combined Completed Projects filtering logic
  const filteredCompletedProjects = completedProjectsData.filter((proj) => {
    const matchesSearch = proj.name.toLowerCase().includes(completedSearch.toLowerCase()) ||
                          proj.objectives.some(o => o.toLowerCase().includes(completedSearch.toLowerCase())) ||
                          proj.scope.some(s => s.toLowerCase().includes(completedSearch.toLowerCase()));
    const matchesPartner = completedPartnerFilter === 'all' ||
                           (completedPartnerFilter === 'N/A' && proj.partner === 'N/A') ||
                           (completedPartnerFilter !== 'N/A' && proj.partner.toLowerCase().includes(completedPartnerFilter.toLowerCase()));
    return matchesSearch && matchesPartner;
  });

  const paginatedCompletedProjects = filteredCompletedProjects.slice(
    (completedPage - 1) * completedPerPage,
    completedPage * completedPerPage
  );

  const totalCompletedProjectPages = Math.ceil(filteredCompletedProjects.length / completedPerPage);

  const [activeTab, setActiveTab] = useState<'overview' | 'gen' | 'gas' | 'imports' | 'renewables' | 'transmission' | 'regional' | 'macro'>('overview');
  
  const activeScrollIdRef = useRef<number | null>(null);

  const triggerScrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      if (activeScrollIdRef.current !== null) {
        cancelAnimationFrame(activeScrollIdRef.current);
        activeScrollIdRef.current = null;
      }

      const navbar = document.querySelector('.public-nav-bar');
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const targetY = elementPosition - navbarHeight - 24;
      
      const startY = window.scrollY;
      const difference = targetY - startY;

      // If already pixel-perfect target position, skip animation to avoid layout jitter
      if (Math.abs(difference) < 2) {
        return;
      }
      const duration = 950;
      const startTime = performance.now();

      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startY + difference * ease);

        if (progress < 1) {
          activeScrollIdRef.current = requestAnimationFrame(step);
        } else {
          activeScrollIdRef.current = null;
        }
      };

      activeScrollIdRef.current = requestAnimationFrame(step);
    }
  };

  const handleTabClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    const timer = setTimeout(() => {
      triggerScrollToElement('grid-status-overview-header');
    }, 50);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('esb-grid-tab-change', { detail: { tab: activeTab } }));
    }
  }, [activeTab]);

  const [macroSubTab, setMacroSubTab] = useState<'overview' | 'monthly' | 'pricing' | 'global' | 'reports' | 'reserves' | 'insights'>('overview');
  
  const handleSubTabClick = (subTabId: any) => {
    setMacroSubTab(subTabId);
    const timer = setTimeout(() => {
      triggerScrollToElement('macro-subtabs-nav');
    }, 200);
  };
  const [reportsCompany, setReportsCompany] = useState<'bpdb' | 'petrobangla'>('bpdb');
  const [chartsReady, setChartsReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // PGCB Monthly Archives States
  const [selectedMonthlyKey, setSelectedMonthlyKey] = useState<string>(
    pgcbMonthlyData && pgcbMonthlyData.length > 0
      ? pgcbMonthlyData[pgcbMonthlyData.length - 1].date_key
      : '2026-02'
  );
  const [monthlyTrendMetric, setMonthlyTrendMetric] = useState<'peaks' | 'energy' | 'fuels'>('peaks');
  const [selectedFuelTrend, setSelectedFuelTrend] = useState<'gas' | 'coal' | 'hfo' | 'import'>('gas');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isFuelDropdownOpen, setIsFuelDropdownOpen] = useState(false);

  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const fuelDropdownRef = useRef<HTMLDivElement>(null);

  const getFuelColor = (fuel: string) => {
    const mapping: Record<string, string> = {
      gas: '#0ea5e9',
      coal: '#64748b',
      hfo: '#f97316',
      diesel: '#ef4444',
      hydro: '#06b6d4',
      solar: '#eab308',
      wind: '#10b981',
      import: '#a855f7',
    };
    return mapping[fuel.toLowerCase()] || '#94a3b8';
  };

  // Substation & Transmission Tab States
  const [transSubTab, setTransSubTab] = useState<'transmission' | 'lines' | 'substations' | 'projects' | 'completed_projects' | 'grid_net' | 'geo_map' | 'opgw_map' | 'opgw_lease'>('transmission');
  const [isTransDropdownOpen, setIsTransDropdownOpen] = useState(false);
  const transDropdownRef = useRef<HTMLDivElement>(null);

  const [isVoltageDropdownOpen, setIsVoltageDropdownOpen] = useState(false);
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);

  const voltageDropdownRef = useRef<HTMLDivElement>(null);
  const zoneDropdownRef = useRef<HTMLDivElement>(null);
  const ownerDropdownRef = useRef<HTMLDivElement>(null);

  const [subSearch, setSubSearch] = useState('');
  const [subVoltageFilter, setSubVoltageFilter] = useState<string>('all');
  const [subZoneFilter, setSubZoneFilter] = useState<string>('all');
  const [subOwnerFilter, setSubOwnerFilter] = useState<string>('all');
  const [subPage, setSubPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
  const zones = ['Dhaka', 'Khulna', 'Barishal', 'Cumilla', 'Sylhet', 'Rajshahi', 'Chattogram', 'Rangpur', 'Mymensingh'];
  const owners = ['POWER GRID', 'APSCL', 'BIFPCL', 'RNPP', 'Bulk', 'BPDB', 'DESCO', 'DPDC', 'MoST', 'DMTCL'];

  const voltageOptions = [
    { label: 'All Voltage Classes', value: 'all' },
    { label: '400 kV', value: '400kV' },
    { label: '230 kV', value: '230kV' },
    { label: '132 kV', value: '132kV' },
    { label: '230/33 kV', value: '230/33kV' },
    { label: '132/33 kV', value: '132/33kV' },
  ];

  const zoneOptions = [
    { label: 'All Operation Zones', value: 'all' },
    ...zones.map((z) => ({ label: z, value: z })),
  ];

  const ownerOptions = [
    { label: 'All Owners', value: 'all' },
    ...owners.map((o) => ({ label: o, value: o })),
  ];

  useEffect(() => {
    setChartsReady(true);
  }, []);

  // Click outside listener for all custom dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (transDropdownRef.current && !transDropdownRef.current.contains(target)) {
        setIsTransDropdownOpen(false);
      }
      if (voltageDropdownRef.current && !voltageDropdownRef.current.contains(target)) {
        setIsVoltageDropdownOpen(false);
      }
      if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(target)) {
        setIsZoneDropdownOpen(false);
      }
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(target)) {
        setIsOwnerDropdownOpen(false);
      }
      if (dailyYearDropdownRef.current && !dailyYearDropdownRef.current.contains(target)) {
        setIsDailyYearDropdownOpen(false);
      }
      if (dailyMonthDropdownRef.current && !dailyMonthDropdownRef.current.contains(target)) {
        setIsDailyMonthDropdownOpen(false);
      }
      if (dailyDayDropdownRef.current && !dailyDayDropdownRef.current.contains(target)) {
        setIsDailyDayDropdownOpen(false);
      }
      if (partnerDropdownRef.current && !partnerDropdownRef.current.contains(target)) {
        setIsPartnerDropdownOpen(false);
      }
      if (completedPartnerDropdownRef.current && !completedPartnerDropdownRef.current.contains(target)) {
        setIsCompletedPartnerDropdownOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(target)) {
        setIsYearDropdownOpen(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(target)) {
        setIsMonthDropdownOpen(false);
      }
      if (fuelDropdownRef.current && !fuelDropdownRef.current.contains(target)) {
        setIsFuelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    transmission: {
      blob1: 'bg-blue-500/6',
      blob2: 'bg-sky-600/4',
      blob3: 'bg-indigo-500/3',
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

  interface TabInfo {
    id: 'overview' | 'gen' | 'gas' | 'imports' | 'renewables' | 'transmission' | 'regional' | 'macro';
    label: string;
    icon: any;
  }

  interface TabGroup {
    label: string;
    tabs: TabInfo[];
  }

  const tabGroups: TabGroup[] = [
    {
      label: 'Operations',
      tabs: [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'gen', label: 'Generation & Cost', icon: Zap },
      ]
    },
    {
      label: 'Supply & Logistics',
      tabs: [
        { id: 'gas', label: 'Gas & LNG Supply', icon: Droplet },
        { id: 'imports', label: 'C/B Imports', icon: Globe },
        { id: 'renewables', label: 'Renewables (SREDA)', icon: Sun },
      ]
    },
    {
      label: 'Infrastructure & Projects',
      tabs: [
        { id: 'transmission', label: 'Technical Information', icon: Activity },
        { id: 'regional', label: 'Regional Grid', icon: Cable },
      ]
    },
    {
      label: 'Analytics & Planning (Macro Trends)',
      tabs: [
        { id: 'macro', label: 'Macro Trends', icon: TrendingUp },
      ]
    }
  ];

  const tabs = useMemo<TabInfo[]>(() => {
    return tabGroups.flatMap(g => g.tabs);
  }, []);

  const activeGroup = useMemo(() => {
    const group = tabGroups.find(g => g.tabs.some(t => t.id === activeTab));
    return group ? group.label : 'Operations';
  }, [activeTab]);

  // Substation Filtering Logic
  const filteredSubstations = substationsData.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(subSearch.toLowerCase()) || 
                          sub.circle.toLowerCase().includes(subSearch.toLowerCase());
    const matchesVoltage = subVoltageFilter === 'all' || sub.voltage === subVoltageFilter;
    const matchesZone = subZoneFilter === 'all' || sub.zone === subZoneFilter;
    const matchesOwner = subOwnerFilter === 'all' || sub.owner === subOwnerFilter;
    return matchesSearch && matchesVoltage && matchesZone && matchesOwner;
  });

  const totalSubCapacityMva = filteredSubstations.reduce((sum, sub) => {
    const val = parseFloat(sub.capacity.replace(/,/g, ''));
    if (sub.capacity.includes('MW') || isNaN(val)) return sum;
    return sum + val;
  }, 0);

  const paginatedSubstations = filteredSubstations.slice(
    (subPage - 1) * itemsPerPage,
    subPage * itemsPerPage
  );

  const totalSubPages = Math.ceil(filteredSubstations.length / itemsPerPage);

  // Reset page to 1 when filters change
  useEffect(() => {
    setSubPage(1);
  }, [subSearch, subVoltageFilter, subZoneFilter, subOwnerFilter]);

  // Overview calculations
  const totalGenMkwhr = generationData.reduce((sum, item) => sum + item.gen, 0);
  const totalCostBdt = generationData.reduce((sum, item) => sum + item.cost, 0);
  const avgCostPerKwh = totalCostBdt / (totalGenMkwhr * 1000000);

  // Regional calculations
  const totalRegionalDemand = regionalDemandData.reduce((sum, rd) => sum + rd.demand, 0);
  const totalRegionalLoadShed = regionalDemandData.reduce((sum, rd) => sum + rd.loadShed, 0);
  const avgRegionalPct = totalRegionalDemand > 0 ? ((totalRegionalLoadShed / totalRegionalDemand) * 100).toFixed(1) : '0.0';

  return (
    <>
      <div className="grid-explorer relative print:hidden">
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

      {/* Date Selector Header */}
      <div id="grid-status-overview-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 relative z-50">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            Grid Status Overview
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active reporting date: <span className="font-semibold text-primary">{systemStats.date}</span>
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-28 relative z-50">
            <CustomDropdown
              value={selectedYear}
              onChange={handleYearChange}
              options={yearOptions}
              placeholder="Year"
              isOpen={isDailyYearDropdownOpen}
              setIsOpen={setIsDailyYearDropdownOpen}
              dropdownRef={dailyYearDropdownRef}
              icon={<Calendar className="h-3.5 w-3.5 text-primary shrink-0" />}
              prefixLabel="Year:"
            />
          </div>

          <div className="w-full sm:w-32 relative z-50">
            <CustomDropdown
              value={selectedMonth}
              onChange={handleMonthChange}
              options={monthOptions}
              placeholder="Month"
              isOpen={isDailyMonthDropdownOpen}
              setIsOpen={setIsDailyMonthDropdownOpen}
              dropdownRef={dailyMonthDropdownRef}
              icon={<FileText className="h-3.5 w-3.5 text-primary shrink-0" />}
              prefixLabel="Month:"
            />
          </div>

          <div className="w-full sm:w-28 relative z-50">
            <CustomDropdown
              value={selectedDay}
              onChange={handleDayChange}
              options={dayOptions}
              placeholder="Day"
              isOpen={isDailyDayDropdownOpen}
              setIsOpen={setIsDailyDayDropdownOpen}
              dropdownRef={dailyDayDropdownRef}
              icon={<Activity className="h-3.5 w-3.5 text-primary shrink-0" />}
              prefixLabel="Day:"
            />
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid-explorer-kpi-strip relative z-30" ref={kpiStripRef}>
        <div 
          className="grid-explorer-kpi stat group !overflow-visible hover:z-[100] cursor-pointer select-none"
          onClick={() => toggleKpiTooltip('gen')}
        >
          <Zap className="grid-explorer-kpi__icon" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Daily Generation</div>
            <div className="grid-explorer-kpi__value">{systemStats.totalEnergyGen.toFixed(1)} MKWh</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className={cn(
              "absolute text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-[17.5rem] md:w-80 left-0 md:left-1/2 md:-translate-x-1/2 top-[calc(100%+12px)] pointer-events-none bg-card transition-all duration-200 ease-out opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
              activeKpiTooltip === 'gen' && "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            )}
            style={{ backgroundColor: 'hsl(var(--card))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l border-border/80 z-[-1]" style={{ backgroundColor: 'hsl(var(--card))' }} />
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

        <div 
          className="grid-explorer-kpi stat group !overflow-visible hover:z-[100] cursor-pointer select-none"
          onClick={() => toggleKpiTooltip('demand')}
        >
          <Activity className="grid-explorer-kpi__icon text-amber-500" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Peak Demand</div>
            <div className="grid-explorer-kpi__value">{formatNumber(Math.round(systemStats.eveningPeakDemand))} MW</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className={cn(
              "absolute text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-72 md:w-[19rem] right-0 md:left-1/2 md:-translate-x-1/2 top-[calc(100%+12px)] pointer-events-none bg-card transition-all duration-200 ease-out opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
              activeKpiTooltip === 'demand' && "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            )}
            style={{ backgroundColor: 'hsl(var(--card))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l border-border/80 z-[-1]" style={{ backgroundColor: 'hsl(var(--card))' }} />
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

        <div 
          className="grid-explorer-kpi stat group !overflow-visible hover:z-[100] cursor-pointer select-none"
          onClick={() => toggleKpiTooltip('gas')}
        >
          <Droplet className="grid-explorer-kpi__icon text-sky-500" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Gas Production</div>
            <div className="grid-explorer-kpi__value">2,647.5 MMCFD</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className={cn(
              "absolute text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-[19.5rem] md:w-[22rem] left-0 md:left-1/2 md:-translate-x-1/2 top-[calc(100%+12px)] pointer-events-none bg-card transition-all duration-200 ease-out opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
              activeKpiTooltip === 'gas' && "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            )}
            style={{ backgroundColor: 'hsl(var(--card))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l border-border/80 z-[-1]" style={{ backgroundColor: 'hsl(var(--card))' }} />
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

        <div 
          className="grid-explorer-kpi stat group !overflow-visible hover:z-[100] cursor-pointer select-none"
          onClick={() => toggleKpiTooltip('renew')}
        >
          <Sun className="grid-explorer-kpi__icon text-yellow-500" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Renewables Online</div>
            <div className="grid-explorer-kpi__value">{totalCapacityRenewables.toFixed(1)} MW</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className={cn(
              "absolute text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-[18rem] md:w-[20rem] right-0 md:left-1/2 md:-translate-x-1/2 top-[calc(100%+12px)] pointer-events-none bg-card transition-all duration-200 ease-out opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
              activeKpiTooltip === 'renew' && "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            )}
            style={{ backgroundColor: 'hsl(var(--card))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l border-border/80 z-[-1]" style={{ backgroundColor: 'hsl(var(--card))' }} />
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

        <div 
          className="grid-explorer-kpi stat group !overflow-visible hover:z-[100] cursor-pointer select-none"
          onClick={() => toggleKpiTooltip('cost')}
        >
          <TakaIcon className="grid-explorer-kpi__icon text-emerald-500" />
          <div className="min-w-0">
            <div className="grid-explorer-kpi__label">Est. Fuel Cost</div>
            <div className="grid-explorer-kpi__value">{(systemStats.totalDailyCost / 10000000).toFixed(1)} Cr Tk.</div>
          </div>
          {/* Custom Tooltip */}
          <div 
            className={cn(
              "absolute text-card-foreground border border-border/80 p-4 md:p-5 rounded-2xl shadow-2xl z-[110] w-[18.5rem] md:w-[21rem] left-0 md:left-1/2 md:-translate-x-1/2 top-[calc(100%+12px)] pointer-events-none bg-card transition-all duration-200 ease-out opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
              activeKpiTooltip === 'cost' && "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            )}
            style={{ backgroundColor: 'hsl(var(--card))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l border-border/80 z-[-1]" style={{ backgroundColor: 'hsl(var(--card))' }} />
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

      {/* Grouped Tab Navigation */}
      <div className="flex flex-col gap-3 mt-6 mb-4 w-full">
        {/* Category Groups Row */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border/40 pb-2.5">
          {tabGroups.map((group) => {
            const isGroupActive = activeGroup === group.label;
            return (
              <button
                key={group.label}
                type="button"
                onClick={() => {
                  // Switch to the first tab in this group
                  handleTabClick(group.tabs[0].id);
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-200 uppercase tracking-wider border",
                  isGroupActive
                    ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                    : "text-muted-foreground border-transparent hover:bg-muted/40 hover:text-foreground"
                )}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        {/* Sub-Tabs Row under active group */}
        <div className="grid-explorer-tabs" role="tablist" aria-label="Grid reports views">
          {tabGroups.find(g => g.label === activeGroup)?.tabs.map((t) => {
            const TabIcon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleTabClick(t.id)}
                className={cn('explorer-tab', active && 'active')}
              >
                <TabIcon className="h-4 w-4 shrink-0" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="relative min-h-[400px]">
        {isLoadingDaily && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-2xl transition-all duration-300">
            <div className="flex flex-col items-center gap-3 bg-card/60 px-6 py-4 rounded-2xl border border-border/50 shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-150">
              <div className="relative">
                <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Activity className="h-5 w-5 text-primary animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-xs font-semibold text-primary tracking-wide animate-pulse">Loading Grid Data...</span>
            </div>
          </div>
        )}

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
              <GridLiveBadge label={`Report: ${systemStats.date}`} />
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

            <div className="grid-explorer-donut-wrap">              {chartsReady ? (
                <PieChart width={200} height={200} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={generationData.filter(d => d.gen > 0)}
                    dataKey="gen"
                    nameKey="name"
                    cx={100}
                    cy={100}
                    innerRadius={55}
                    outerRadius={82}
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
                  <g className="pointer-events-none select-none">
                    <text
                      x={100}
                      y={92}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-foreground font-sans font-bold"
                      style={{ fontSize: '24px', letterSpacing: '-0.02em' }}
                    >
                      {totalGenMkwhr.toFixed(0)}
                    </text>
                    <text
                      x={100}
                      y={114}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-muted-foreground font-sans font-semibold uppercase"
                      style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                    >
                      MKWh Gen
                    </text>
                  </g>
                </PieChart>
              ) : (
                <div className="grid-explorer-skeleton" />
              )}
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
              <span className="font-medium">Reporting Date: {systemStats.date}</span>
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
                  <BarChart data={generationData.filter(d => d.cost > 0)} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
              <span className="font-medium">Reporting Date: {systemStats.date}</span>
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
                <ComposedChart data={hourlyLoadData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
            <span className="font-medium">Reporting Period: 24-Hour SCADA Log (Date: {systemStats.date})</span>
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
              <span className="font-medium">Reporting Date: {systemStats.date}</span>
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
            <span>Reporting Period: System Summary (Date: {systemStats.date})</span>
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

            {/* Technical Glossary Footnote */}
            <div className="mt-6 p-4 rounded-2xl bg-muted/5 border border-border/30 space-y-2.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-sky-500" /> Gas Sector Acronyms &amp; Units Footnote
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-[10px] text-muted-foreground leading-relaxed">
                <div>
                  <strong className="text-foreground block font-bold mb-0.5">MMCFD</strong>
                  Million Standard Cubic Feet per Day. Standard unit of gas volume flow rate.
                </div>
                <div>
                  <strong className="text-foreground block font-bold mb-0.5">LNG (Liquefied Natural Gas)</strong>
                  Natural gas cooled to liquid state (-162°C) for shipping, then regasified back into the grid.
                </div>
                <div>
                  <strong className="text-foreground block font-bold mb-0.5">BGFCL / SGFL / BAPEX</strong>
                  National gas production state companies (Bangladesh Gas Fields, Sylhet Gas Fields, and BAPEX exploration).
                </div>
                <div>
                  <strong className="text-foreground block font-bold mb-0.5">TGTDCL / BGDCL / KGDCL</strong>
                  Gas distribution companies (Titas Gas, Bakhrabad Gas, and Karnaphuli Gas Distribution).
                </div>
                <div>
                  <strong className="text-foreground block font-bold mb-0.5">RPGCL</strong>
                  Rupantarita Prakritik Gas Company Limited, responsible for gas imports and LNG terminal operations.
                </div>
              </div>
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
              <span className="font-medium">Reporting Period: Daily Interconnector Flow (Date: {systemStats.date})</span>
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

      {activeTab === 'transmission' && (
        <div className="grid-explorer-panel space-y-6">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Mobile/Tablet Sub-tab Navigation */}
            <div className="lg:hidden w-full relative z-40 bg-card border border-border/60 p-3 rounded-2xl shadow-sm">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 px-1">
                Select Section
              </label>
              <div className="relative">
                <select
                  value={
                    transSubTab === 'projects'
                      ? (projectType === 'ongoing' ? 'projects_ongoing' : 'projects_upcoming')
                      : transSubTab
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'projects_ongoing') {
                      setTransSubTab('projects');
                      setProjectType('ongoing');
                    } else if (val === 'projects_upcoming') {
                      setTransSubTab('projects');
                      setProjectType('upcoming');
                    } else {
                      setTransSubTab(val as any);
                    }
                  }}
                  className="w-full appearance-none px-4 py-3 pr-10 text-xs font-semibold rounded-xl border border-border/40 bg-muted/20 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {[
                    {
                      group: "Grid Infrastructure",
                      items: [
                        { id: 'transmission', label: 'Power Transmission' },
                        { id: 'lines', label: 'Transmission Line Information' },
                        { id: 'substations', label: 'Substation Information' }
                      ]
                    },
                    {
                      group: "Grid Projects",
                      items: [
                        { id: 'projects_ongoing', label: 'Ongoing Projects' },
                        { id: 'projects_upcoming', label: 'Upcoming Projects' },
                        { id: 'completed_projects', label: 'Completed Projects' }
                      ]
                    },
                    {
                      group: "Maps & Diagrams",
                      items: [
                        { id: 'grid_net', label: 'National Grid Network Diagram' },
                        { id: 'geo_map', label: 'Geographical Grid Map' }
                      ]
                    },
                    {
                      group: "Optical Fiber (OPGW)",
                      items: [
                        { id: 'opgw_map', label: 'OPGW Fiber Network Map' },
                        { id: 'opgw_lease', label: 'Optical Fiber Leasing' }
                      ]
                    }
                  ].map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.items.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Desktop Left Sidebar Navigation */}
            <div className="hidden lg:block lg:col-span-3 space-y-4 lg:sticky lg:top-24 bg-card border border-border/60 p-4 rounded-2xl shadow-sm">
              <div className="pb-3 border-b border-border/40">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Technical Information
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Power Grid Infrastructure &amp; Projects
                </p>
              </div>

              {[
                {
                  group: "Grid Infrastructure",
                  colorClass: "text-sky-500",
                  items: [
                    { id: 'transmission', label: 'Power Transmission', icon: Activity, activeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-sky-500/5 hover:text-sky-600 dark:hover:text-sky-400" },
                    { id: 'lines', label: 'Transmission Line Information', icon: Cable, activeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-sky-500/5 hover:text-sky-600 dark:hover:text-sky-400" },
                    { id: 'substations', label: 'Substation Information', icon: Database, activeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-sky-500/5 hover:text-sky-600 dark:hover:text-sky-400" }
                  ]
                },
                {
                  group: "Grid Projects",
                  colorClass: "text-muted-foreground",
                  items: [
                    { id: 'projects_ongoing', label: 'Ongoing Projects', icon: TrendingUp, activeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400" },
                    { id: 'projects_upcoming', label: 'Upcoming Projects', icon: Activity, activeClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-red-500/5 hover:text-red-600 dark:hover:text-red-400" },
                    { id: 'completed_projects', label: 'Completed Projects', icon: CheckSquare, activeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400" }
                  ]
                },
                {
                  group: "Maps & Diagrams",
                  colorClass: "text-indigo-500",
                  items: [
                    { id: 'grid_net', label: 'National Grid Network Diagram', icon: Network, activeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400" },
                    { id: 'geo_map', label: 'Geographical Grid Map', icon: MapPin, activeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400" }
                  ]
                },
                {
                  group: "Optical Fiber (OPGW)",
                  colorClass: "text-purple-500",
                  items: [
                    { id: 'opgw_map', label: 'OPGW Fiber Network Map', icon: Map, activeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-purple-500/5 hover:text-purple-600 dark:hover:text-purple-400" },
                    { id: 'opgw_lease', label: 'Optical Fiber Leasing', icon: DollarSign, activeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 shadow-sm font-semibold", hoverClass: "hover:bg-purple-500/5 hover:text-purple-600 dark:hover:text-purple-400" }
                  ]
                }
              ].map((g, idx) => (
                <div key={g.group} className={cn("space-y-1.5", idx > 0 && "pt-3 border-t border-border/30")}>
                  <h4 className={cn("text-[10px] font-bold uppercase tracking-widest px-2", g.colorClass)}>
                    {g.group}
                  </h4>
                  <div className="space-y-0.5">
                    {g.items.map((t) => {
                      const SubIcon = t.icon;
                      const active = t.id === 'projects_ongoing'
                        ? (transSubTab === 'projects' && projectType === 'ongoing')
                        : t.id === 'projects_upcoming'
                        ? (transSubTab === 'projects' && projectType === 'upcoming')
                        : transSubTab === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (t.id === 'projects_ongoing') {
                              setTransSubTab('projects');
                              setProjectType('ongoing');
                            } else if (t.id === 'projects_upcoming') {
                              setTransSubTab('projects');
                              setProjectType('upcoming');
                            } else {
                              setTransSubTab(t.id as any);
                            }
                          }}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-all duration-150 border text-left",
                            active
                              ? t.activeClass
                              : cn("border-transparent text-muted-foreground", t.hoverClass)
                          )}
                        >
                          <SubIcon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-current" : "text-muted-foreground group-hover:text-current")} />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-9 space-y-6">

          {/* Sub-tab 1: Power Transmission */}
          {transSubTab === 'transmission' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Core Operating Function Card */}
              <div className="grid-explorer-chart-card card p-6 bg-gradient-to-r from-primary/5 via-sky-500/5 to-transparent border-primary/25 relative overflow-hidden">
                {/* Visual grid pattern background decoration */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 shrink-0">
                      <Activity className="h-6 w-6 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-foreground">Power Transmission</h3>
                        <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                          Core Grid Function
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-foreground font-medium leading-relaxed">
                        The main operating function of Power Grid is wheeling of energy from BPDB power stations and Generation Companies to Distribution entities utilizing transmission network. Power Grid gets its energy wheeling charge from its clients(distribution entities) at the rate fixed by Bangladesh Electricity Regulatory Commission (BERC).
                      </p>
                    </div>
                  </div>

                  {/* Wheeling Workflow Visualization */}
                  <div className="space-y-4 pt-5 border-t border-border/30">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Energy Wheeling Value Chain</h4>
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                      {/* Step 1 */}
                      <div className="group p-5 rounded-2xl bg-muted/15 border border-border/30 hover:border-primary/20 hover:bg-muted/20 transition-all flex flex-col justify-between relative overflow-hidden">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted-foreground/10 px-2.5 py-0.5 rounded-full">Step 1: Generation</span>
                            <Zap className="h-4 w-4 text-amber-500 animate-pulse" />
                          </div>
                          <h5 className="text-sm font-bold text-foreground">Power Generation Plants</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            BPDB-owned power stations, independent power producers (IPPs), and generation companies produce electricity and feed it to step-up transformers.
                          </p>
                        </div>
                        <div className="border-t border-border/20 pt-2 mt-4 text-[10px] text-muted-foreground font-medium">
                          Source feeds: Gas, Coal, HFO, Solar &amp; Imports
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="group p-5 rounded-2xl bg-primary/5 border border-primary/25 hover:border-primary/40 hover:bg-primary/10 transition-all flex flex-col justify-between relative overflow-hidden">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">Step 2: Transmission</span>
                            <Cable className="h-4 w-4 text-primary" />
                          </div>
                          <h5 className="text-sm font-bold text-foreground">High-Voltage Wheeling Grid</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            PGCB steps up voltages to <strong className="text-foreground">400kV, 230kV, or 132kV</strong> to transmit over long distances, reducing line loss. Regulated by BERC wheeling charges.
                          </p>
                        </div>
                        <div className="border-t border-primary/20 pt-2 mt-4 text-[10px] text-primary font-semibold">
                          Charge Rate: Fixed by BERC legally
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="group p-5 rounded-2xl bg-muted/15 border border-border/30 hover:border-primary/20 hover:bg-muted/20 transition-all flex flex-col justify-between relative overflow-hidden">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted-foreground/10 px-2.5 py-0.5 rounded-full">Step 3: Distribution</span>
                            <Globe className="h-4 w-4 text-emerald-500" />
                          </div>
                          <h5 className="text-sm font-bold text-foreground">Distribution Entities (Clients)</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Power is stepped down at 132/33kV and 230/33kV substations to be distributed by retail utilities to the final consumers.
                          </p>
                        </div>
                        <div className="border-t border-border/20 pt-2 mt-4 text-[10px] text-muted-foreground font-medium">
                          Clients: DPDC, DESCO, BREB/PBS, WZPDCO, NESCO
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Asset History and Standing Comparison */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Historical Takeover */}
                <div className="grid-explorer-chart-card card p-6 bg-gradient-to-b from-card to-muted/5 border-border/40 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="grid-explorer-chart-card__head">
                      <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                        <FileText className="h-5 w-5 shrink-0" />
                      </div>
                      <div>
                        <h3 className="grid-explorer-chart-card__title">Asset Inheritance &amp; Phases</h3>
                        <p className="grid-explorer-chart-card__sub">Historical assets taken over from BPDB and DESA in different phases</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-amber-500/50 pl-3">
                        "The Power Grid took over about 2497 circuit km of 230 kV lines, 4236 circuit km 27.3 circuit km (Others) of 132 kV lines, 6 nos of 230/132 kV Substation and 63 nos of 132/33 kV substations from BPDB and DESA in different phases."
                      </p>

                      <div className="grid gap-2.5 mt-4 pt-2">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/10 border border-border/30">
                          <span className="text-xs font-semibold text-muted-foreground">Inherited 230 kV Transmission Lines</span>
                          <span className="text-xs font-bold text-foreground bg-muted/20 px-2.5 py-1 rounded-lg border border-border/40">about 2497 circuit km</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/10 border border-border/30">
                          <span className="text-xs font-semibold text-muted-foreground">Inherited 132 kV Transmission Lines</span>
                          <div className="text-right">
                            <span className="text-xs font-bold text-foreground bg-muted/20 px-2.5 py-1 rounded-lg border border-border/40">4236 circuit km</span>
                            <span className="block text-[9px] text-muted-foreground mt-1">Plus 27.3 circuit km (Others)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/10 border border-border/30">
                          <span className="text-xs font-semibold text-muted-foreground">Inherited 230/132 kV Substations</span>
                          <span className="text-xs font-bold text-foreground bg-muted/20 px-2.5 py-1 rounded-lg border border-border/40">6 nos</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/10 border border-border/30">
                          <span className="text-xs font-semibold text-muted-foreground">Inherited 132/33 kV Substations</span>
                          <span className="text-xs font-bold text-foreground bg-muted/20 px-2.5 py-1 rounded-lg border border-border/40">63 nos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Standing Assets up to April, 2026 */}
                <div className="grid-explorer-chart-card card p-6 bg-gradient-to-b from-card to-muted/5 border-border/40 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="grid-explorer-chart-card__head">
                      <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                        <TrendingUp className="h-5 w-5 shrink-0" />
                      </div>
                      <div>
                        <h3 className="grid-explorer-chart-card__title">Current Grid Standing</h3>
                        <p className="grid-explorer-chart-card__sub">Standing transmission lines and station infrastructure up to April, 2026</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-sky-500/50 pl-3">
                        "Transmission lines of the company up to April, 2026 are stood at 3,155 ckt km 27.8 ckt km (Others) of 400 kV lines, 5,129 circuit km 27.3 circuit km (Others) of 230 kV lines, 9,287 circuit km and 369 circuit km (Others) of 132 kV lines and 1 nos of 400 kV Station, 11 nos of 400/230kV substation, 5 nos of 400/132kV substation, 36 nos of 230/132 kV substation, 2 nos of 230/33 KV substation and 150 nos of 132/33 kV substations."
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
                        <div className="p-2.5 rounded-xl bg-muted/10 border border-border/30">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">400 kV Lines</span>
                          <span className="text-xs font-bold text-foreground block mt-0.5">3,155 ckt km</span>
                          <span className="text-[9px] text-muted-foreground">Others: 27.8 ckt km</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-muted/10 border border-border/30">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">230 kV Lines</span>
                          <span className="text-xs font-bold text-foreground block mt-0.5">5,129 circuit km</span>
                          <span className="text-[9px] text-muted-foreground">Others: 27.3 circuit km</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-muted/10 border border-border/30 col-span-2">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">132 kV Lines</span>
                          <span className="text-xs font-bold text-foreground block mt-0.5">9,287 circuit km</span>
                          <span className="text-[9px] text-muted-foreground">Others: 369 circuit km</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-muted/10 border border-border/30">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Stations / S/S (400kV)</span>
                          <span className="text-[10px] font-bold text-foreground block mt-0.5 leading-tight">1 nos 400 kV Station</span>
                          <span className="text-[9px] text-muted-foreground">11 nos 400/230kV, 5 nos 400/132kV</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-muted/10 border border-border/30">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Substations (230kV / 132kV)</span>
                          <span className="text-[10px] font-bold text-foreground block mt-0.5 leading-tight">36 nos 230/132kV, 2 nos 230/33KV</span>
                          <span className="text-[9px] text-muted-foreground">150 nos 132/33kV substations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Takeover vs. Standing Comparative Table */}
              <div className="grid-explorer-chart-card card p-6">
                <div className="flex items-center gap-2 mb-4 border-b border-border/40 pb-3">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Asset Growth &amp; Development Comparison</h3>
                </div>
                <div className="grid-explorer-table-wrap">
                  <table className="grid-explorer-table text-xs">
                    <thead>
                      <tr className="border-b border-border/60">
                        <th className="py-2.5 text-left text-foreground font-bold">Infrastructure Class</th>
                        <th className="py-2.5 text-left text-foreground font-bold">Inherited (Takeover from BPDB &amp; DESA)</th>
                        <th className="py-2.5 text-left text-foreground font-bold">Standing (Up to April, 2026)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      <tr className="hover:bg-muted/5 transition-colors">
                        <td className="py-2 font-semibold text-foreground">400 kV Transmission Lines</td>
                        <td className="py-2 text-muted-foreground">—</td>
                        <td className="py-2 text-foreground font-medium">3,155 ckt km <span className="text-[10px] text-muted-foreground block">Plus 27.8 ckt km (Others)</span></td>
                      </tr>
                      <tr className="hover:bg-muted/5 transition-colors">
                        <td className="py-2 font-semibold text-foreground">230 kV Transmission Lines</td>
                        <td className="py-2 text-foreground font-medium">about 2497 circuit km</td>
                        <td className="py-2 text-foreground font-medium">5,129 circuit km <span className="text-[10px] text-muted-foreground block">Plus 27.3 circuit km (Others)</span></td>
                      </tr>
                      <tr className="hover:bg-muted/5 transition-colors">
                        <td className="py-2 font-semibold text-foreground">132 kV Transmission Lines</td>
                        <td className="py-2 text-foreground font-medium">4236 circuit km <span className="text-[10px] text-muted-foreground block">Plus 27.3 circuit km (Others)</span></td>
                        <td className="py-2 text-foreground font-medium">9,287 circuit km <span className="text-[10px] text-muted-foreground block">Plus 369 circuit km (Others)</span></td>
                      </tr>
                      <tr className="hover:bg-muted/5 transition-colors">
                        <td className="py-2 font-semibold text-foreground">400 kV Stations / Substations</td>
                        <td className="py-2 text-muted-foreground">—</td>
                        <td className="py-2 text-foreground font-medium">
                          <span className="block">1 nos of 400 kV Station</span>
                          <span className="block text-[10px] text-muted-foreground">11 nos of 400/230kV substation</span>
                          <span className="block text-[10px] text-muted-foreground">5 nos of 400/132kV substation</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/5 transition-colors">
                        <td className="py-2 font-semibold text-foreground">230 kV Substations</td>
                        <td className="py-2 text-foreground font-medium">6 nos of 230/132 kV Substation</td>
                        <td className="py-2 text-foreground font-medium">
                          <span className="block">36 nos of 230/132 kV substation</span>
                          <span className="block text-[10px] text-muted-foreground">2 nos of 230/33 KV substation</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/5 transition-colors">
                        <td className="py-2 font-semibold text-foreground">132/33 kV Substations</td>
                        <td className="py-2 text-foreground font-medium">63 nos of 132/33 kV substations</td>
                        <td className="py-2 text-foreground font-medium">150 nos of 132/33 kV substations</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Callout box for projects */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-xs text-foreground font-semibold leading-normal">
                  The company has taken infrastructure development projects for further development of its operation.
                </p>
              </div>

              {/* Technical Glossary Footnote */}
              <div className="mt-6 p-4 rounded-2xl bg-muted/5 border border-border/30 space-y-2.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" /> Technical Units &amp; Acronyms Footnote
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-[10px] text-muted-foreground leading-relaxed">
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">kV (Kilovolt)</strong>
                    Unit of electrical voltage. 1 kV = 1,000 Volts. Transmission happens at high voltages to prevent heat losses.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">ckt km (Circuit Kilometers)</strong>
                    Total transmission line conductor length. A 10 km double-circuit line equals 20 ckt km.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">MVA (Megavolt-Ampere)</strong>
                    Apparent power capacity. Used to measure substation transformer ratings.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Nos (Numbers)</strong>
                    Standard shorthand meaning unit count / quantity of substations or equipment lines.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">BERC / BPDB</strong>
                    Bangladesh Electricity Regulatory Commission / Bangladesh Power Development Board.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Transmission Line Information */}
          {transSubTab === 'lines' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Column 1: Transmission Line stats */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Transmission Line Info Card */}
                  <div className="grid-explorer-chart-card card h-full flex flex-col justify-between">
                    <div>
                      <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
                        <Cable className="h-5 w-5 text-primary shrink-0" />
                        <div>
                          <h3 className="grid-explorer-chart-card__title">Transmission Line as on: April, 2026</h3>
                          <p className="grid-explorer-chart-card__sub">Verbatim grid line network capacities</p>
                        </div>
                      </div>

                      <div className="grid-explorer-table-wrap">
                        <table className="grid-explorer-table text-xs">
                          <thead>
                            <tr className="border-b border-border/40">
                              <th className="py-2 text-left">Voltage Class</th>
                              <th className="py-2 text-right">Main Capacity</th>
                              <th className="py-2 text-right">Others</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2.5 font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                400kV
                              </td>
                              <td className="py-2.5 text-right tabular-nums font-bold text-foreground">3,155 Circuit km</td>
                              <td className="py-2.5 text-right tabular-nums text-muted-foreground">27.8 Circuit km (Others)</td>
                            </tr>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2.5 font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                230kV
                              </td>
                              <td className="py-2.5 text-right tabular-nums font-bold text-foreground">5,129.79 Circuit km</td>
                              <td className="py-2.5 text-right tabular-nums text-muted-foreground">27.3 Circuit km (Others)</td>
                            </tr>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2.5 font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                132kV
                              </td>
                              <td className="py-2.5 text-right tabular-nums font-bold text-foreground">9,287 Circuit km</td>
                              <td className="py-2.5 text-right tabular-nums text-muted-foreground">369 Circuit km (Others)</td>
                            </tr>
                            <tr className="border-t border-border/60 font-bold bg-muted/20">
                              <td className="py-3 pl-3">Total Line</td>
                              <td className="py-3 text-right tabular-nums text-primary pr-3" colSpan={2}>17955 Circuit km</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Last Five Years Achievement */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="grid-explorer-chart-card card h-full flex flex-col justify-between">
                    <div>
                      <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
                        <TrendingUp className="h-5 w-5 text-emerald-500 shrink-0" />
                        <div>
                          <h3 className="grid-explorer-chart-card__title">Last Five years achievement</h3>
                          <p className="grid-explorer-chart-card__sub">Major projects and capacities commissioned recently</p>
                        </div>
                      </div>

                      <div className="grid-explorer-table-wrap">
                        <table className="grid-explorer-table text-xs">
                          <thead>
                            <tr className="border-b border-border/40">
                              <th className="py-2 text-left">Infrastructure Item</th>
                              <th className="py-2 text-right">Verbatim Capacity / Length</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/10">
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2 font-semibold">400/230kV Substation</td>
                              <td className="py-2 text-right tabular-nums text-foreground font-bold">9 Nos. 13,100 MVA</td>
                            </tr>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2 font-semibold">400/132 kV Substation</td>
                              <td className="py-2 text-right tabular-nums text-foreground font-bold">4 Nos. 2,990 MVA</td>
                            </tr>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2 font-semibold">230/132kV Substation</td>
                              <td className="py-2 text-right tabular-nums text-foreground font-bold">10 Nos: 7,550 MVA</td>
                            </tr>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2 font-semibold">230/33KV Substation</td>
                              <td className="py-2 text-right tabular-nums text-foreground font-bold">1 Nos 280 MVA</td>
                            </tr>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2 font-semibold">132/33kV Substation</td>
                              <td className="py-2 text-right tabular-nums text-foreground font-bold">38 Nos. 7,647 MVA</td>
                            </tr>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2 font-semibold text-emerald-500">400kV Transmission Line</td>
                              <td className="py-2 text-right tabular-nums text-emerald-500 font-bold">2,124.77 Circuit km</td>
                            </tr>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2 font-semibold text-emerald-500">230kV Transmission Line</td>
                              <td className="py-2 text-right tabular-nums text-emerald-500 font-bold">1,481.94 Circuit km</td>
                            </tr>
                            <tr className="hover:bg-muted/5 transition-colors">
                              <td className="py-2 font-semibold text-emerald-500">132kV Transmission Line</td>
                              <td className="py-2 text-right tabular-nums text-emerald-500 font-bold">1,249.874 Circuit km</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Substation Capacity details (Full width) */}
                <div className="lg:col-span-12">
                  <div className="grid-explorer-chart-card card p-6">
                    <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border pb-3 mb-4">
                      <Database className="h-5 w-5 text-indigo-500 shrink-0" />
                      <div>
                        <h3 className="grid-explorer-chart-card__title">Substation as on: April, 2026</h3>
                        <p className="grid-explorer-chart-card__sub">Comprehensive capacity aggregates across all operation nodes</p>
                      </div>
                    </div>

                    <div className="grid-explorer-table-wrap">
                      <table className="grid-explorer-table text-xs">
                        <thead>
                          <tr className="border-b border-border/40">
                            <th className="py-2 text-left">Substation / Station Class</th>
                            <th className="py-2 text-left">Count / Quantity</th>
                            <th className="py-2 text-right">Main Capacity / Rating</th>
                            <th className="py-2 text-right">Others (Quantity &amp; Capacity)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                          <tr className="hover:bg-muted/5 transition-colors">
                            <td className="py-2.5 font-semibold text-foreground">400kV HVDC Station</td>
                            <td className="py-2.5 text-foreground">1 Nos.</td>
                            <td className="py-2.5 text-right font-medium text-foreground">2x500MW HVDC Back to Back station</td>
                            <td className="py-2.5 text-right text-muted-foreground">—</td>
                          </tr>
                          <tr className="hover:bg-muted/5 transition-colors">
                            <td className="py-2.5 font-semibold text-foreground">400/230kV Substation</td>
                            <td className="py-2.5 text-foreground">11 Nos.</td>
                            <td className="py-2.5 text-right font-bold text-foreground">15,180 MVA</td>
                            <td className="py-2.5 text-right font-medium text-muted-foreground">3 Nos. 2730 MVA (Others)</td>
                          </tr>
                          <tr className="hover:bg-muted/5 transition-colors">
                            <td className="py-2.5 font-semibold text-foreground">400/132 kV Substation</td>
                            <td className="py-2.5 text-foreground">5 Nos.</td>
                            <td className="py-2.5 text-right font-bold text-foreground">4,265 MVA</td>
                            <td className="py-2.5 text-right text-muted-foreground">—</td>
                          </tr>
                          <tr className="hover:bg-muted/5 transition-colors">
                            <td className="py-2.5 font-semibold text-foreground">230/132kV Substation</td>
                            <td className="py-2.5 text-foreground">36 Nos.</td>
                            <td className="py-2.5 text-right font-bold text-foreground">24,275 MVA</td>
                            <td className="py-2.5 text-right font-medium text-muted-foreground">1 Nos. 250 MVA (Others)</td>
                          </tr>
                          <tr className="hover:bg-muted/5 transition-colors">
                            <td className="py-2.5 font-semibold text-foreground">230/33KV Substation</td>
                            <td className="py-2.5 text-foreground">2 Nos.</td>
                            <td className="py-2.5 text-right font-bold text-foreground">560 MVA</td>
                            <td className="py-2.5 text-right font-medium text-muted-foreground">4 Nos. 1,050 MVA (Others)</td>
                          </tr>
                          <tr className="hover:bg-muted/5 transition-colors">
                            <td className="py-2.5 font-semibold text-foreground">132/33kV Substation</td>
                            <td className="py-2.5 text-foreground">150 Nos.</td>
                            <td className="py-2.5 text-right font-bold text-foreground">33,185 MVA</td>
                            <td className="py-2.5 text-right font-medium text-muted-foreground">46 Nos. 7,660 MVA (Others)</td>
                          </tr>
                          
                          {/* Summary Row 1: Overall Capacity */}
                          <tr className="border-t border-border/50 bg-primary/5 font-semibold text-foreground">
                            <td className="py-3 pl-3 text-primary font-bold">Overall Capacity</td>
                            <td className="py-3 font-bold" colSpan={2}>259 Nos.</td>
                            <td className="py-3 text-right font-bold text-primary pr-3">89,155 MVA</td>
                          </tr>
                          
                          {/* Summary Row 2: Dispatch Capacity */}
                          <tr className="bg-emerald-500/5 font-semibold text-foreground">
                            <td className="py-3 pl-3 text-emerald-500 font-bold" colSpan={2}>Dispatch Capacity at 33kV level</td>
                            <td className="py-3 text-right font-bold text-emerald-500 pr-3" colSpan={2}>
                              36267.21 MW <span className="text-[10px] text-muted-foreground font-normal">(Including all organizations)</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Glossary Footnote */}
              <div className="mt-6 p-4 rounded-2xl bg-muted/5 border border-border/30 space-y-2.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" /> Technical Units &amp; Acronyms Footnote
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-[10px] text-muted-foreground leading-relaxed">
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">kV (Kilovolt)</strong>
                    Unit of electrical voltage. 1 kV = 1,000 Volts.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Circuit km (ckt km)</strong>
                    Total length of active electrical circuits/conductors running across grid pylons.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">MVA / MW</strong>
                    MVA (apparent power) rates substation capacity. MW (active power, 1M Watts) rates grid dispatch peak.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">HVDC Station</strong>
                    High-Voltage Direct Current. Connects asynchronous networks or transmits large power blocks efficiently.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Others Capacity</strong>
                    Represents capacities managed under subsidiary operations or special grid-circle categories.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Substation Information */}
          {transSubTab === 'substations' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Card Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Text Description */}
                <div className="grid-explorer-chart-card card p-6 lg:col-span-2 bg-gradient-to-r from-indigo-500/5 via-primary/5 to-transparent border-indigo-500/20 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20 shrink-0">
                        <Database className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-foreground">National Grid Substation Database</h3>
                          <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                            Last Updated: Sunday, May 24, 2026 at 02:12 PM
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Comprehensive tracking of all 400kV, 230kV, 132kV, 230/33kV, and 132/33kV active substations operating within the Bangladesh electricity transmission grid network.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Key Stats Quick View Card */}
                <div className="grid-explorer-chart-card card p-6 lg:col-span-1 bg-muted/10 border-border/30 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Substation Database Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Substations</span>
                        <div className="text-sm font-bold text-foreground tabular-nums">{filteredSubstations.length} Stations</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Filtered Capacity</span>
                        <div className="text-sm font-bold text-primary tabular-nums">{formatNumber(totalSubCapacityMva)} MVA</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Unique Zones</span>
                        <div className="text-sm font-bold text-foreground tabular-nums">9 Zones</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Grid Circle Groups</span>
                        <div className="text-sm font-bold text-emerald-500 tabular-nums">HVDC &amp; Circles</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Substation Rating Categories Breakdown Table */}
              <div className="grid-explorer-chart-card card">
                <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
                  <Database className="h-5 w-5 text-indigo-400 shrink-0" />
                  <div>
                    <h3 className="grid-explorer-chart-card__title">Substation Assets &amp; Capacity</h3>
                    <p className="grid-explorer-chart-card__sub">Active substations and transformer ratings as of April 2026</p>
                  </div>
                </div>

                <div className="grid-explorer-table-wrap">
                  <table className="grid-explorer-table">
                    <thead>
                      <tr>
                        <th>Rating / Type</th>
                        <th className="text-right">Quantity</th>
                        <th className="text-right">Capacity (MVA)</th>
                        <th className="text-right">Others Capacity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold">400 kV HVDC Back-to-Back</td>
                        <td className="text-right tabular-nums font-medium text-foreground">1 Station</td>
                        <td className="text-right tabular-nums font-semibold text-foreground">2x500 MW</td>
                        <td className="text-right text-muted-foreground">—</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">400/230 kV Substations</td>
                        <td className="text-right tabular-nums font-medium text-foreground">11 Nos.</td>
                        <td className="text-right tabular-nums font-semibold text-foreground">15,180 MVA</td>
                        <td className="text-right tabular-nums text-muted-foreground">3 Nos. (2,730 MVA)</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">400/132 kV Substations</td>
                        <td className="text-right tabular-nums font-medium text-foreground">5 Nos.</td>
                        <td className="text-right tabular-nums font-semibold text-foreground">4,265 MVA</td>
                        <td className="text-right text-muted-foreground">—</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">230/132 kV Substations</td>
                        <td className="text-right tabular-nums font-medium text-foreground">36 Nos.</td>
                        <td className="text-right tabular-nums font-semibold text-foreground">24,275 MVA</td>
                        <td className="text-right tabular-nums text-muted-foreground">1 Nos. (250 MVA)</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">230/33 kV Substations</td>
                        <td className="text-right tabular-nums font-medium text-foreground">2 Nos.</td>
                        <td className="text-right tabular-nums font-semibold text-foreground">560 MVA</td>
                        <td className="text-right tabular-nums text-muted-foreground">4 Nos. (1,050 MVA)</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">132/33 kV Substations</td>
                        <td className="text-right tabular-nums font-medium text-foreground">150 Nos.</td>
                        <td className="text-right tabular-nums font-semibold text-foreground">33,185 MVA</td>
                        <td className="text-right tabular-nums text-muted-foreground">46 Nos. (7,660 MVA)</td>
                      </tr>
                      <tr className="border-t border-border/80 font-bold bg-muted/20">
                        <td>Overall Substation Capacity</td>
                        <td className="text-right tabular-nums text-primary">259 Stations</td>
                        <td className="text-right tabular-nums text-primary" colSpan={2}>89,155 MVA</td>
                      </tr>
                      <tr className="font-bold bg-muted/10">
                        <td>Dispatch Capacity (33kV level)</td>
                        <td className="text-right tabular-nums text-emerald-500 font-extrabold" colSpan={3}>36,267.21 MW</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Substation Filters */}
              <div className="p-4 bg-card border border-border/60 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 z-40 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search substation name..."
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-muted/20 border border-border/40 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <CustomDropdown
                  value={subVoltageFilter}
                  onChange={setSubVoltageFilter}
                  options={voltageOptions}
                  placeholder="All Voltage Classes"
                  isOpen={isVoltageDropdownOpen}
                  setIsOpen={setIsVoltageDropdownOpen}
                  dropdownRef={voltageDropdownRef}
                />

                <CustomDropdown
                  value={subZoneFilter}
                  onChange={setSubZoneFilter}
                  options={zoneOptions}
                  placeholder="All Operation Zones"
                  isOpen={isZoneDropdownOpen}
                  setIsOpen={setIsZoneDropdownOpen}
                  dropdownRef={zoneDropdownRef}
                />

                <CustomDropdown
                  value={subOwnerFilter}
                  onChange={setSubOwnerFilter}
                  options={ownerOptions}
                  placeholder="All Owners"
                  isOpen={isOwnerDropdownOpen}
                  setIsOpen={setIsOwnerDropdownOpen}
                  dropdownRef={ownerDropdownRef}
                />
              </div>

              {/* Substations Table */}
              <div className="grid-explorer-chart-card card">
                <div className="grid-explorer-table-wrap">
                  <table className="grid-explorer-table">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Substation Name</th>
                        <th>Voltage Class</th>
                        <th>Operation Zone</th>
                        <th>Transformer Detail</th>
                        <th className="text-right">Total Capacity</th>
                        <th>Ownership</th>
                        <th>Grid Circle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedSubstations.length > 0 ? (
                        paginatedSubstations.map((sub, idx) => (
                          <tr key={idx} className="hover:bg-muted/5 transition-colors">
                            <td className="font-semibold text-muted-foreground">{sub.sn}</td>
                            <td className="font-semibold text-foreground">{sub.name}</td>
                            <td>
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                sub.voltage === '400kV' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                sub.voltage === '230kV' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                sub.voltage === '132kV' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                                "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                              )}>
                                {sub.voltage}
                              </span>
                            </td>
                            <td>{sub.zone}</td>
                            <td className="font-mono text-xs">{sub.transformer}</td>
                            <td className="text-right font-medium tabular-nums text-foreground">{sub.capacity}</td>
                            <td>
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                                sub.owner === 'POWER GRID' ? "bg-primary/10 text-primary" :
                                sub.owner === 'Bulk' ? "bg-amber-500/10 text-amber-500" :
                                "bg-muted text-muted-foreground"
                              )}>
                                {sub.owner}
                              </span>
                            </td>
                            <td>{sub.circle}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-muted-foreground">
                            No substations match your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/40 mt-4">
                  {/* Left: Items per page selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Show:</span>
                    <div className="flex gap-1.5">
                      {[25, 50, 100].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setItemsPerPage(size);
                            setSubPage(1);
                          }}
                          className={cn(
                            "px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all duration-150",
                            itemsPerPage === size
                              ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                              : "bg-muted/10 border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">per page</span>
                  </div>

                  {/* Middle: Page status text */}
                  <span className="text-xs text-muted-foreground text-center">
                    Page <strong className="text-foreground">{totalSubPages === 0 ? 0 : subPage}</strong> of <strong className="text-foreground">{totalSubPages}</strong> ({filteredSubstations.length} total stations)
                  </span>

                  {/* Right: Prev / Next Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={subPage === 1}
                      onClick={() => setSubPage((p) => Math.max(p - 1, 1))}
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-muted/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-muted-foreground focus:outline-none"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={subPage === totalSubPages || totalSubPages === 0}
                      onClick={() => setSubPage((p) => Math.min(p + 1, totalSubPages))}
                      className="p-1.5 rounded-lg border border-border/40 hover:bg-muted/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-muted-foreground focus:outline-none"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Technical Glossary Footnote */}
              <div className="mt-6 p-4 rounded-2xl bg-muted/5 border border-border/30 space-y-2.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" /> Technical Units &amp; Acronyms Footnote
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-[10px] text-muted-foreground leading-relaxed">
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">MVA (Megavolt-Ampere)</strong>
                    Apparent power capacity rating of the step-down transformers operating inside the substation.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">kV (Kilovolt Class)</strong>
                    Substation connection voltage (e.g. 132/33 kV steps down 132kV grid line to 33kV distribution feeder).
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Transformer Code</strong>
                    System operators designate transformer units (e.g. T-1, TR-2) for maintenance tracking.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Owner Groups</strong>
                    Entities managing the station (e.g. POWER GRID / PGCB, APSCL, BPDB utilities).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 4: Ongoing / Upcoming Projects */}
          {transSubTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header block */}
              <div className="grid-explorer-chart-card card p-6 bg-gradient-to-r from-primary/5 via-sky-500/5 to-transparent border-primary/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    {projectType === 'ongoing' ? 'Ongoing Projects' : 'Upcoming Projects'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {projectType === 'ongoing' 
                      ? 'Detailed status tracking of PGCB high-voltage grid upgrades, river crossings, and transmission line projects.'
                      : 'Planned high-voltage grid expansions, battery energy storage systems (BESS), and power transmission line projects in the pipeline.'}
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full shrink-0 font-mono">
                  {projectType === 'ongoing' ? ongoingProjectsData.length : upcomingProjectsData.length} Projects under tracking
                </span>
              </div>

              {/* Project Type Toggle Pills */}
              <div className="flex items-center gap-2 p-1 bg-muted/20 border border-border/30 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setProjectType('ongoing')}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 flex items-center gap-2 select-none border border-transparent",
                    projectType === 'ongoing'
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/10 border-amber-600/20"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Ongoing Projects ({ongoingProjectsData.length})
                </button>
                <button
                  type="button"
                  onClick={() => setProjectType('upcoming')}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 flex items-center gap-2 select-none border border-transparent",
                    projectType === 'upcoming'
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/10 border-red-600/20"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Activity className="h-3.5 w-3.5" />
                  Upcoming Projects ({upcomingProjectsData.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransSubTab('completed_projects');
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 flex items-center gap-2 select-none text-muted-foreground hover:text-foreground"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  Completed Projects ({completedProjectsData.length})
                </button>
              </div>

              {/* Filters & Search */}
              <div className="p-4 bg-card border border-border/60 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-40">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search project name, objective, partner..."
                    value={projectSearch}
                    onChange={(e) => {
                      setProjectSearch(e.target.value);
                      setProjectPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-muted/20 border border-border/40 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="relative" ref={partnerDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsPartnerDropdownOpen(!isPartnerDropdownOpen)}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-xs md:text-sm bg-muted/20 border border-border/40 rounded-xl text-foreground hover:bg-muted/30 hover:border-primary/30 focus:outline-none focus:border-primary/50 transition-all duration-150 font-medium shadow-sm"
                  >
                    <span className="truncate">Partner: {projectPartnerFilter === 'all' ? 'All Development Partners' : projectPartnerFilter}</span>
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-150", isPartnerDropdownOpen && "rotate-180")} />
                  </button>
                  {isPartnerDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
                      <button
                        type="button"
                        onClick={() => { setProjectPartnerFilter('all'); setIsPartnerDropdownOpen(false); setProjectPage(1); }}
                        className={cn("w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold select-none text-left", projectPartnerFilter === 'all' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}
                      >
                        <span>All Development Partners</span>
                        {projectPartnerFilter === 'all' && <Check className="h-3.5 w-3.5" />}
                      </button>
                      {['EXIM Bank of India', 'World Bank', 'ADB', 'AIIB', 'JICA', 'EDCF', 'KfW', 'Exim Bank China (G to G)', 'Indian LoC', 'N/A'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => { setProjectPartnerFilter(p); setIsPartnerDropdownOpen(false); setProjectPage(1); }}
                          className={cn("w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold select-none text-left", projectPartnerFilter === p ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}
                        >
                          <span>{p}</span>
                          {projectPartnerFilter === p && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 gap-6">
                {paginatedProjects.map((proj, idx) => {
                  const isOngoing = 'status' in proj && typeof proj.status === 'object';
                  
                  if (isOngoing) {
                    const oProj = proj as any;
                    const physicalVal = parseFloat(oProj.status.physical.replace(/%/g, ''));
                    const financialVal = parseFloat(oProj.status.financial.replace(/%/g, ''));
                    
                    return (
                      <div key={idx} className="card p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group border-border/40 hover:border-primary/30 transition-all duration-300 animate-in fade-in-50 duration-200">
                        {/* Title & Status */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <h4 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{oProj.name}</h4>
                            <div className="flex flex-wrap gap-2 text-[10px]">
                              <span className="px-2 py-0.5 font-semibold bg-muted text-muted-foreground border border-border/60 rounded-full">
                                Partner: {oProj.partner}
                              </span>
                              <span className="px-2 py-0.5 font-semibold bg-primary/5 text-primary border border-primary/15 rounded-full">
                                Duration: {oProj.duration}
                              </span>
                            </div>
                          </div>
                          
                          {/* Progress Bars */}
                          <div className="flex items-center gap-6 shrink-0 bg-muted/10 p-3.5 rounded-2xl border border-border/20">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-8 text-[10px] font-bold text-foreground">
                                <span>Physical Progress</span>
                                <span className="text-primary font-mono">{oProj.status.physical}</span>
                              </div>
                              <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${physicalVal}%` }} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-8 text-[10px] font-bold text-foreground">
                                <span>Financial Progress</span>
                                <span className="text-emerald-500 font-mono">{oProj.status.financial}</span>
                              </div>
                              <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${financialVal}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Objectives & Scope */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs border-t border-border/40 pt-4">
                          <div className="space-y-2">
                            <h5 className="font-bold text-foreground uppercase tracking-wider text-[9px] text-primary">Objectives</h5>
                            <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground leading-relaxed">
                              {oProj.objectives.map((obj: string, i: number) => (
                                <li key={i}>{obj}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-bold text-foreground uppercase tracking-wider text-[9px] text-primary">Scope of Work</h5>
                            <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground leading-relaxed">
                              {oProj.scope.map((scp: string, i: number) => (
                                <li key={i}>{scp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Cost Grid */}
                        <div className="p-4 bg-muted/10 border border-border/30 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Total Project Cost</span>
                            {renderProjectCost(oProj.cost.total)}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">GOB Contribution</span>
                            {renderProjectCost(oProj.cost.gob)}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Project Aid (PA)</span>
                            {renderProjectCost(oProj.cost.pa)}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">PGCB Funding</span>
                            {renderProjectCost(oProj.cost.pgcb)}
                          </div>
                        </div>

                        {/* Footer: Contacts & Meta */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-4 text-[10px] text-muted-foreground">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span><strong>Project Director:</strong> {oProj.director}</span>
                            <span>•</span>
                            <span>
                              <strong>Office:</strong> {oProj.office}
                            </span>
                            <span>•</span>
                            <span>
                              <strong>Mobile:</strong> <a href={`tel:${oProj.mobile}`} className="text-primary hover:underline font-medium">{oProj.mobile}</a>
                            </span>
                            <span>•</span>
                            <span>
                              <strong>Email:</strong> <a href={`mailto:${oProj.email}`} className="text-primary hover:underline font-medium">{oProj.email}</a>
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 text-[9px] uppercase tracking-wider font-semibold">
                            <span>Source: {oProj.source}</span>
                            <span>Updated: {oProj.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    const uProj = proj as any;
                    const statusInfo = getUpcomingProjectStatusInfo(uProj.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <div key={idx} className="card p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group border-border/40 hover:border-primary/30 transition-all duration-300 animate-in fade-in-50 duration-200">
                        {/* Title & Status */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <h4 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{uProj.name}</h4>
                            <div className="flex flex-wrap gap-2 text-[10px]">
                              <span className="px-2 py-0.5 font-semibold bg-muted text-muted-foreground border border-border/60 rounded-full">
                                Partner: {uProj.partner}
                              </span>
                              <span className="px-2 py-0.5 font-semibold bg-primary/5 text-primary border border-primary/15 rounded-full">
                                Duration: {uProj.duration}
                              </span>
                            </div>
                          </div>
                          
                          {/* Status Badge & Status Details */}
                          <div className="flex items-center gap-3 shrink-0 bg-muted/10 p-3.5 rounded-2xl border border-border/20 max-w-xs md:max-w-md">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <StatusIcon className="h-3.5 w-3.5 text-primary" />
                                <span className={cn("px-2 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider", statusInfo.bgColor, statusInfo.textColor)}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground leading-snug font-medium">
                                {uProj.status}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Objectives & Scope */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs border-t border-border/40 pt-4">
                          <div className="space-y-2">
                            <h5 className="font-bold text-foreground uppercase tracking-wider text-[9px] text-primary">Objectives</h5>
                            <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground leading-relaxed">
                              {uProj.objectives.map((obj: string, i: number) => (
                                <li key={i}>{obj}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-bold text-foreground uppercase tracking-wider text-[9px] text-primary">Scope of Work</h5>
                            <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground leading-relaxed">
                              {uProj.scope.map((scp: string, i: number) => (
                                <li key={i}>{scp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Cost Grid */}
                        <div className="p-4 bg-muted/10 border border-border/30 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Total Project Cost</span>
                            {renderProjectCost(uProj.cost.total)}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Project Aid (PA)</span>
                            {renderProjectCost(uProj.cost.pa)}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Development Partner</span>
                            <div className="font-bold text-foreground">{uProj.partner}</div>
                          </div>
                        </div>

                        {/* Footer: Contacts & Meta (Omitted Director details) */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-4 text-[10px] text-muted-foreground">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground bg-muted/10 px-2 py-0.5 rounded-md border border-border/20">
                              Upcoming Pipeline Project
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 text-[9px] uppercase tracking-wider font-semibold">
                            <span>Source: {uProj.source}</span>
                            <span>Updated: {uProj.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}

                {filteredProjects.length === 0 && (
                  <div className="card p-12 text-center text-muted-foreground text-sm border-dashed border-border/60">
                    No {projectType} projects found matching the filters or search query.
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalProjectPages > 1 && (
                <div className="flex items-center justify-between border-t border-border/40 pt-4">
                  <p className="text-[11px] text-muted-foreground">
                    Showing <span className="font-medium">{(projectPage - 1) * projectsPerPage + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(projectPage * projectsPerPage, filteredProjects.length)}</span> of{" "}
                    <span className="font-medium">{filteredProjects.length}</span> {projectType} projects
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={projectPage === 1}
                      onClick={() => setProjectPage(projectPage - 1)}
                      className="p-1.5 border border-border/40 rounded-lg bg-card/65 text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="text-xs font-semibold text-foreground">
                      Page {projectPage} of {totalProjectPages}
                    </div>
                    <button
                      type="button"
                      disabled={projectPage === totalProjectPages}
                      onClick={() => setProjectPage(projectPage + 1)}
                      className="p-1.5 border border-border/40 rounded-lg bg-card/65 text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-tab: Completed Projects */}
          {transSubTab === 'completed_projects' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header block */}
              <div className="grid-explorer-chart-card card p-6 bg-gradient-to-r from-primary/5 via-sky-500/5 to-transparent border-primary/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    Completed Projects
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive registry of successfully completed high-voltage transmission lines, substations, and grid network infrastructure projects.
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full shrink-0 font-mono">
                  {completedProjectsData.length} Completed Projects
                </span>
              </div>

              {/* Project Type Toggle Pills */}
              <div className="flex items-center gap-2 p-1 bg-muted/20 border border-border/30 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => {
                    setTransSubTab('projects');
                    setProjectType('ongoing');
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 flex items-center gap-2 select-none text-muted-foreground hover:text-foreground"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Ongoing Projects ({ongoingProjectsData.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTransSubTab('projects');
                    setProjectType('upcoming');
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 flex items-center gap-2 select-none text-muted-foreground hover:text-foreground"
                >
                  <Activity className="h-3.5 w-3.5" />
                  Upcoming Projects ({upcomingProjectsData.length})
                </button>
                <button
                  type="button"
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 flex items-center gap-2 select-none border border-transparent bg-emerald-500 text-white shadow-lg shadow-emerald-500/10 border-emerald-600/20"
                  )}
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  Completed Projects ({completedProjectsData.length})
                </button>
              </div>

              {/* Filters & Search */}
              <div className="p-4 bg-card border border-border/60 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-40">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search completed project name, objective, scope..."
                    value={completedSearch}
                    onChange={(e) => {
                      setCompletedSearch(e.target.value);
                      setCompletedPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-muted/20 border border-border/40 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="relative" ref={completedPartnerDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCompletedPartnerDropdownOpen(!isCompletedPartnerDropdownOpen)}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-xs md:text-sm bg-muted/20 border border-border/40 rounded-xl text-foreground hover:bg-muted/30 hover:border-primary/30 focus:outline-none focus:border-primary/50 transition-all duration-150 font-medium shadow-sm"
                  >
                    <span className="truncate">Partner: {completedPartnerFilter === 'all' ? 'All Development Partners' : completedPartnerFilter}</span>
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-150", isCompletedPartnerDropdownOpen && "rotate-180")} />
                  </button>
                  {isCompletedPartnerDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
                      <button
                        type="button"
                        onClick={() => { setCompletedPartnerFilter('all'); setIsCompletedPartnerDropdownOpen(false); setCompletedPage(1); }}
                        className={cn("w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold select-none text-left", completedPartnerFilter === 'all' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}
                      >
                        <span>All Development Partners</span>
                        {completedPartnerFilter === 'all' && <Check className="h-3.5 w-3.5" />}
                      </button>
                      {['ADB', 'IDB', 'World Bank', 'JICA', 'EDCF', 'KfW', 'DANIDA', 'PGCB', 'N/A'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => { setCompletedPartnerFilter(p); setIsCompletedPartnerDropdownOpen(false); setCompletedPage(1); }}
                          className={cn("w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold select-none text-left", completedPartnerFilter === p ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40")}
                        >
                          <span>{p}</span>
                          {completedPartnerFilter === p && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 gap-6">
                {paginatedCompletedProjects.map((proj, idx) => (
                  <div key={idx} className="card p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group border-border/40 hover:border-primary/30 transition-all duration-300 animate-in fade-in-50 duration-200">
                    {/* Title & Status */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h4 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{proj.name}</h4>
                        <div className="flex flex-wrap gap-2 text-[10px]">
                          <span className="px-2 py-0.5 font-semibold bg-muted text-muted-foreground border border-border/60 rounded-full">
                            Partner: {proj.partner}
                          </span>
                          <span className="px-2 py-0.5 font-semibold bg-primary/5 text-primary border border-primary/15 rounded-full">
                            Duration: {proj.duration}
                          </span>
                        </div>
                      </div>
                      
                      {/* Completed status badge */}
                      <div className="flex items-center gap-3 shrink-0 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                            Completed Project
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Objectives & Scope */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs border-t border-border/40 pt-4">
                      <div className="space-y-2">
                        <h5 className="font-bold text-foreground uppercase tracking-wider text-[9px] text-primary">Objectives</h5>
                        {proj.objectives.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground leading-relaxed">
                            {proj.objectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground italic">No objectives detailed.</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-bold text-foreground uppercase tracking-wider text-[9px] text-primary">Scope of Work</h5>
                        <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground leading-relaxed">
                          {proj.scope.map((scp, i) => (
                            <li key={i}>{scp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Cost Grid */}
                    <div className="p-4 bg-muted/10 border border-border/30 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase">Total Project Cost</span>
                        {renderProjectCost(proj.cost.total)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase">GOB Contribution</span>
                        {renderProjectCost(proj.cost.gob)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase">Project Aid (PA)</span>
                        {renderProjectCost(proj.cost.pa)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase">PGCB Funding</span>
                        {renderProjectCost(proj.cost.pgcb)}
                      </div>
                    </div>

                    {/* Footer: Contacts & Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-4 text-[10px] text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground bg-muted/10 px-2 py-0.5 rounded-md border border-border/20">
                          Successfully Commissioned
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 text-[9px] uppercase tracking-wider font-semibold">
                        <span>Source: {proj.source}</span>
                        <span>Updated: {proj.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredCompletedProjects.length === 0 && (
                  <div className="card p-12 text-center text-muted-foreground text-sm border-dashed border-border/60">
                    No completed projects found matching the filters or search query.
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalCompletedProjectPages > 1 && (
                <div className="flex items-center justify-between border-t border-border/40 pt-4">
                  <p className="text-[11px] text-muted-foreground">
                    Showing <span className="font-medium">{(completedPage - 1) * completedPerPage + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(completedPage * completedPerPage, filteredCompletedProjects.length)}</span> of{" "}
                    <span className="font-medium">{filteredCompletedProjects.length}</span> completed projects
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={completedPage === 1}
                      onClick={() => setCompletedPage(completedPage - 1)}
                      className="p-1.5 border border-border/40 rounded-lg bg-card/65 text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="text-xs font-semibold text-foreground">
                      Page {completedPage} of {totalCompletedProjectPages}
                    </div>
                    <button
                      type="button"
                      disabled={completedPage === totalCompletedProjectPages}
                      onClick={() => setCompletedPage(completedPage + 1)}
                      className="p-1.5 border border-border/40 rounded-lg bg-card/65 text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-tab 5: National Grid Network Diagram */}
          {transSubTab === 'grid_net' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid-explorer-chart-card card p-6 bg-gradient-to-r from-primary/5 via-sky-500/5 to-transparent border-primary/25 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 shrink-0">
                      <Network className="h-6 w-6 animate-pulse" />
                    </div>
                    <div className="space-y-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">National Grid Network Diagram</h3>
                          <p className="text-sm text-muted-foreground">Schematic mapping of grid interconnectivity across Bangladesh</p>
                        </div>
                        <a
                          href="/pdf/national_grid_network.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="self-start sm:self-center px-4 py-2 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Open PDF in New Tab
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    This official schematic diagram depicts the complete topology of the Bangladesh electricity transmission network, mapping the electrical connections between power generation stations, high-voltage transmission lines (400 kV, 230 kV, and 132 kV), and grid substations.
                  </p>

                  {/* Interactive Embed */}
                  <div className="w-full rounded-2xl overflow-hidden border border-border/40 bg-card/50 shadow-2xl relative mt-2 flex flex-col">
                    <iframe
                      src="/pdf/national_grid_network.pdf#toolbar=1&navpanes=0&scrollbar=1"
                      className="w-full h-[650px] border-none"
                      title="National Grid Network Diagram"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Glossary Footnote */}
              <div className="mt-6 p-4 rounded-2xl bg-muted/5 border border-border/30 space-y-2.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" /> Diagram Key &amp; Technical Footnote
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-[10px] text-muted-foreground leading-relaxed">
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Line Voltages</strong>
                    Red lines represent 400 kV circuits; blue/amber lines show 230 kV and 132 kV circuits respectively.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Substation Nodes</strong>
                    Circles represent grid substations. Solid lines entering/leaving circles represent active bus bar feeders.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Asynchronous Interface</strong>
                    High-Voltage Direct Current (HVDC) station links at borders are represented as block interface icons.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Document Details</strong>
                    Published officially by PGCB (Power Grid Company of Bangladesh) System Operations &amp; Planning Division.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 5: Geographical Grid Map */}
          {transSubTab === 'geo_map' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid-explorer-chart-card card p-6 bg-gradient-to-r from-teal-500/5 via-primary/5 to-transparent border-teal-500/20 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400 border border-teal-500/20 shrink-0">
                      <MapPin className="h-6 w-6 animate-pulse" />
                    </div>
                    <div className="space-y-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">Geographical Grid Map</h3>
                          <p className="text-sm text-muted-foreground">Geographic layout and physical routing of national transmission lines</p>
                        </div>
                        <a
                          href="/pdf/geo_map.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="self-start sm:self-center px-4 py-2 text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-xl hover:bg-teal-500/20 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Open PDF in New Tab
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    This geographical map projects all high-voltage pylon paths and transmission line routing across the physical terrain of Bangladesh. It details grid line runs crossing major rivers (such as Padma and Jamuna) and the locations of substations relative to regional load centers.
                  </p>

                  {/* Interactive Embed */}
                  <div className="w-full rounded-2xl overflow-hidden border border-border/40 bg-card/50 shadow-2xl relative mt-2 flex flex-col">
                    <iframe
                      src="/pdf/geo_map.pdf#toolbar=1&navpanes=0&scrollbar=1"
                      className="w-full h-[650px] border-none"
                      title="Geographical Grid Map"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Glossary Footnote */}
              <div className="mt-6 p-4 rounded-2xl bg-muted/5 border border-border/30 space-y-2.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-teal-400" /> Mapping &amp; Geography Footnote
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-[10px] text-muted-foreground leading-relaxed">
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Physical Routing</strong>
                    Traces the geographical paths of pylons. Crucial for understanding regional grid vulnerability to natural hazards (e.g. floods, cyclones).
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">River Crossings</strong>
                    Includes details of special high-tension long-span river-crossing towers engineered across active delta rivers.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Scale Projection</strong>
                    Geospatial representations conform to official national grid system projections.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Data Sources</strong>
                    Sourced from PGCB Engineering and Survey Departments.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 6: OPGW Fiber Network Map */}
          {transSubTab === 'opgw_map' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid-explorer-chart-card card p-6 bg-gradient-to-r from-purple-500/5 via-primary/5 to-transparent border-purple-500/20 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 shrink-0">
                      <Map className="h-6 w-6 animate-pulse" />
                    </div>
                    <div className="space-y-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">OPGW Fiber Network Map</h3>
                          <p className="text-sm text-muted-foreground">National Optical Ground Wire (OPGW) telecommunication backbone network</p>
                        </div>
                        <a
                          href="/pdf/opgw_map.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="self-start sm:self-center px-4 py-2 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Open PDF in New Tab
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    Optical Ground Wire (OPGW) is a dual-functioning cable. It acts as a conventional shield wire at the top of transmission towers to protect lines from lightning strikes, while containing optical fibers used for PGCB's protection signaling, SCADA telemetry, and commercial telecommunication leases.
                  </p>

                  {/* Interactive Embed */}
                  <div className="w-full rounded-2xl overflow-hidden border border-border/40 bg-card/50 shadow-2xl relative mt-2 flex flex-col">
                    <iframe
                      src="/pdf/opgw_map.pdf#toolbar=1&navpanes=0&scrollbar=1"
                      className="w-full h-[650px] border-none"
                      title="OPGW Fiber Network Map"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Glossary Footnote */}
              <div className="mt-6 p-4 rounded-2xl bg-muted/5 border border-border/30 space-y-2.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-purple-400" /> OPGW &amp; Telecom Footnote
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-[10px] text-muted-foreground leading-relaxed">
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">OPGW (Optical Ground Wire)</strong>
                    A ground/shield wire containing optical fiber cores. Installed on pylon tops for dual lightning shielding and high-speed data transmission.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">SCADA &amp; Telemetry</strong>
                    Optic lines provide real-time connection from grid stations to the National Load Dispatch Center (NLDC) for remote data monitoring.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Commercial Leasing</strong>
                    PGCB leases spare fiber capacity (dark fiber cores) to telecom operators, ISP companies, and state agencies.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Planning Source</strong>
                    Published officially by PGCB Telecommunications Division.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 7: Optical Fiber Leasing */}
          {transSubTab === 'opgw_lease' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Introduction Card */}
              <div className="grid-explorer-chart-card card p-6 bg-gradient-to-r from-emerald-500/5 via-primary/5 to-transparent border-emerald-500/25 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                <div className="space-y-4 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shrink-0">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-foreground">Optical Fiber Leasing</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Power Grid Bangladesh PLC (Power Grid) is responsible to transmit high voltage power across the whole country. Previously Power Grid used earth wire/ground wire to protect the transmission line from thundering. Before 2008, Power Grid used analog PLC (Power Line Carriers) based technology for telecommunication, SCADA (Supervisory Control and Data Acquisition) and power transmission system protection. After 2008, Power Grid adopted new optical fiber based communication technology replacing the prevalent ground wire by modern OPGW (Optical Ground Wire) with modern digital communication system for reliable and faster telecommunication, SCADA and system protection.
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-emerald-500/40 pl-3">
                    Till December 2025, Power Grid has installed around 9400 km of OPGW across the country along with its high voltage transmission lines. Besides Power Grid's own needs, the unused optical fibers are being leased out to local telecommunication operator according to approved lease rate and standard contract document with a view to developing national telecommunication infrastructure.
                  </p>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Stats Summary Column */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Licensing & Networks */}
                  <div className="grid-explorer-chart-card card p-6">
                    <div className="grid-explorer-chart-card__head mb-4 border-b border-border/40 pb-3">
                      <Network className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <h4 className="font-bold text-foreground">Licensing &amp; Leasing Agreements</h4>
                        <p className="text-xs text-muted-foreground">National regulatory and partner allocations</p>
                      </div>
                    </div>
                    <ul className="space-y-3.5 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>
                          <strong>NTTN Licensing:</strong> Power Grid has obtained NOFTTN (Nationwide Optical Fiber Telecommunication Transmission Network) license in 2005 which was later transformed into NTTN (Nationwide Telecommunication Transmission Network) license in 2014.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>
                          <strong>Partner Organizations:</strong> Total 10 (ten) organizations including other NTTN license holders and Mobile network operators are using Power Grid's OPGW-based optical fiber under leasing agreement.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>
                          <strong>Capacity Leased:</strong> Total 22,611.66 KM (22,611.66 x 2=45,223.33 Core-km) of optical fiber core has been leased till December 2025.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Backbone & Internet Capacity */}
                  <div className="grid-explorer-chart-card card p-6">
                    <div className="grid-explorer-chart-card__head mb-4 border-b border-border/40 pb-3">
                      <Globe className="h-5 w-5 text-emerald-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-foreground">Transmission Network &amp; Backbone Capacity</h4>
                        <p className="text-xs text-muted-foreground">Dhaka – Kuakata – Benapole route deployment stats</p>
                      </div>
                    </div>
                    <div className="space-y-4 text-xs text-muted-foreground">
                      <p>
                        With the aim of delivering internet services to the people of the country through Power Grid's robust and highly available fiber network, Power Grid has established a data transmission network with <strong>9.6 / 13.2 Tbps</strong> backbone capacity (operational capacity: 800 Gbps) along the Dhaka–Kuakata–Benapole route.
                      </p>
                      <div className="p-3 bg-muted/10 border border-border/30 rounded-xl flex items-center justify-between">
                        <span>Leased Data Capacity (Dec 2025)</span>
                        <span className="font-bold text-foreground">200 Gbps <span className="text-[10px] text-muted-foreground font-normal">(To International Internet Gateway (IIG) operators)</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commercial Pricing Column */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Pricing Card */}
                  <div className="grid-explorer-chart-card card p-6 bg-gradient-to-b from-card to-emerald-500/5 border-emerald-500/20 flex flex-col justify-between min-h-[15rem]">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">Dark Fiber Lease Rate</h4>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Effective: 01.01.2026</span>
                        <div className="text-2xl font-black text-foreground tabular-nums flex items-baseline gap-1">
                          Tk. 5.40
                          <span className="text-xs font-normal text-muted-foreground">/ Core / Meter / Month</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-normal mt-1">
                          Monthly Recurring Charge (MRC) including Tax &amp; excluding VAT.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-border/40 pt-3 mt-4 text-[10px] text-emerald-500 font-semibold flex justify-between items-center">
                      <span>Annual Increment</span>
                      <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md text-emerald-500">Tk. 0.20 / Year</span>
                    </div>
                  </div>

                  {/* Contacts details Card */}
                  <div className="grid-explorer-chart-card card p-6 space-y-4">
                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">OFCL Contact Details</h4>
                    <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                      <div>
                        <strong className="text-foreground block font-bold">Superintending Engineer</strong>
                        Optical Fiber Commercial Leasing (OFCL)
                      </div>
                      <div>
                        <strong className="text-foreground block font-bold">Office Address:</strong>
                        Level-10, Grid Bhaban, Avenue-3, Jahurul Islam City, Aftabnagar, Badda, Dhaka-1212.
                      </div>
                      <div className="border-t border-border/20 pt-2.5">
                        <strong className="text-foreground block font-bold">Email Query:</strong>
                        <a href="mailto:se.ofcl@pgcb.gov.bd" className="text-primary hover:underline font-semibold">se.ofcl@pgcb.gov.bd</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Glossary Footnote */}
              <div className="mt-6 p-4 rounded-2xl bg-muted/5 border border-border/30 space-y-2.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" /> Technical Units &amp; Acronyms Footnote
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-[10px] text-muted-foreground leading-relaxed">
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Core-km</strong>
                    Total fiber length times core count. A 10 km grid running 2 cores equals 20 Core-km.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Tbps / Gbps</strong>
                    Terabits per Second / Gigabits per Second. Standard measures of network data transmission bandwidth.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">NTTN / NTTN License</strong>
                    Nationwide Telecommunication Transmission Network. Licensing framework permitting fiber infrastructure leasing in Bangladesh.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">Dark Optical Fiber</strong>
                    Unused optical fiber core with no active transmitter light, leased out for direct partner configuration.
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold mb-0.5">SCADA / PLC</strong>
                    Supervisory Control and Data Acquisition / Power Line Carrier communications.
                  </div>
                </div>
              </div>
            </div>
          )}
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
                      <td className="text-right tabular-nums text-primary">{formatNumber(totalRegionalDemand)}</td>
                      <td className="text-right tabular-nums text-destructive">{formatNumber(totalRegionalLoadShed)}</td>
                      <td className="text-right tabular-nums text-primary">{avgRegionalPct}% avg</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Card Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                <span>Source: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">PGCB System Operations Log</a></span>
                <span>Audited by: National Load Despatch Centre (NLDC) Operators</span>
                <span className="font-medium">Reporting Period: Evening Peak Load (Date: {systemStats.date})</span>
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
                <span className="font-medium">Reporting Period: 24-Hour Logs (Date: {systemStats.date})</span>
              </div>
            </div>
          </div>

          {/* Transmission & Projects Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Key Transmission Lines */}
            <div className="grid-explorer-chart-card card">
              <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
                <Cable className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <h3 className="grid-explorer-chart-card__title">Transmission Grid Assets</h3>
                  <p className="grid-explorer-chart-card__sub">Major transmission line parameters and load status</p>
                </div>
              </div>
              <div className="grid-explorer-table-wrap">
                <table className="grid-explorer-table">
                  <thead>
                    <tr>
                      <th>Line Asset</th>
                      <th>Owner</th>
                      <th>Capacity</th>
                      <th>Load Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(initialLines && initialLines.length > 0 ? initialLines : [
                      { name: '400 kV Patuakhali–Gopalganj', status: 'Commissioned', capacity: '1800 MW', owner: 'PGCB', load: 74 },
                      { name: '400 kV Rooppur–Baghabari', status: 'Under Construction', capacity: '2400 MW', owner: 'PGCB', load: 0 },
                      { name: '230 kV Barisal–Khulna', status: 'Commissioned', capacity: '650 MW', owner: 'PGCB', load: 82 },
                      { name: '400 kV Bheramara HVDC (India)', status: 'Operational', capacity: '1000 MW', owner: 'PGCB/POWERGRID', load: 90 },
                    ]).map((line: any, idx: number) => (
                      <tr key={idx}>
                        <td className="font-semibold">
                          <div className="flex flex-col">
                            <span>{line.name}</span>
                            <span className="text-[10px] text-muted-foreground font-normal">{line.status}</span>
                          </div>
                        </td>
                        <td>{line.owner}</td>
                        <td className="tabular-nums font-medium">{line.capacity}</td>
                        <td className="tabular-nums">
                          {line.load > 0 ? (
                            <span className="font-bold text-primary">{line.load}% load</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">Idle / Offline</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Power Projects */}
            <div className="grid-explorer-chart-card card">
              <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
                <Zap className="h-5 w-5 text-yellow-500 shrink-0" />
                <div>
                  <h3 className="grid-explorer-chart-card__title">Upcoming Generation Projects</h3>
                  <p className="grid-explorer-chart-card__sub">Major power stations and capacity additions under tracking</p>
                </div>
              </div>
              <div className="grid-explorer-table-wrap">
                <table className="grid-explorer-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Status</th>
                      <th>Capacity / Cost</th>
                      <th>Expected Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(initialProjects && initialProjects.length > 0 ? initialProjects : ongoingProjectsData.map(p => ({
                      name: p.name,
                      status: p.status.physical.includes('%') ? `Phys: ${p.status.physical.trim()}` : p.status.physical,
                      mw: p.cost.total.split(" ")[0] + " Lakh",
                      date: p.duration.split(" to ")[1] || p.duration
                    })))
                    .map((proj: any, idx: number) => (
                      <tr key={idx}>
                        <td className="font-semibold">{proj.name}</td>
                        <td>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            proj.status === 'Construction' || proj.status === 'Ongoing' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                            proj.status === 'Tender' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                            "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                          )}>
                            {proj.status}
                          </span>
                        </td>
                        <td className="tabular-nums font-medium">{proj.mw}</td>
                        <td className="tabular-nums text-muted-foreground font-medium">{proj.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {activeTab === 'macro' && (
        <div className="grid-explorer-panel space-y-6">
          {/* Sub-tab Navigation */}
          <div id="macro-subtabs-nav" className="flex flex-wrap gap-1.5 border-b border-border/40 pb-3">
            {[
              { id: 'overview', label: 'Macro Overview', icon: BarChart3 },
              { id: 'monthly', label: 'PGCB Monthly Archives', icon: FileText },
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
                  onClick={() => handleSubTabClick(t.id as any)}
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
                        <ComposedChart data={macroTariffData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                        <ComposedChart data={macroGasData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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

          {/* Sub-tab: PGCB Monthly Archives */}
          {macroSubTab === 'monthly' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs text-muted-foreground flex flex-col gap-2">
                <div>
                  <strong className="text-primary font-bold">PGCB Monthly Operating Data:</strong> This archive contains official, authenticated monthly reports from the Power Grid Company of Bangladesh (PGCB) from 2013 to 2026. Explore peak generation records, demand curves, fuel mix metrics, and regional maximum power flows.
                </div>
              </div>

              {/* Month/Year Selection Control Panel */}
              {(() => {
                const currentMonthlyData = pgcbMonthlyData.find(d => d.date_key === selectedMonthlyKey) || pgcbMonthlyData[pgcbMonthlyData.length - 1];
                const availableYears = Array.from(new Set(pgcbMonthlyData.map(d => d.year))).sort((a, b) => b - a);
                const availableMonths = pgcbMonthlyData.filter(d => d.year === currentMonthlyData?.year);
                
                const yearOptions = availableYears.map(y => ({ label: String(y), value: String(y) }));
                const monthOptions = availableMonths.map(d => ({ label: d.month, value: d.month }));
                return (
                  <>
                    <div className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/60 rounded-2xl shadow-sm">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Select Operating Period</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Browse 157 historical monthly records parsed directly from PGCB archives</p>
                      </div>
                      
                      <div className="flex items-center gap-3 self-start md:self-center">
                        <div className="w-32 relative z-50">
                          <CustomDropdown
                            value={String(currentMonthlyData?.year)}
                            onChange={(val) => {
                              const newYear = parseInt(val);
                              const firstMonth = pgcbMonthlyData.find(d => d.year === newYear);
                              if (firstMonth) setSelectedMonthlyKey(firstMonth.date_key);
                            }}
                            options={yearOptions}
                            placeholder="Year"
                            isOpen={isYearDropdownOpen}
                            setIsOpen={setIsYearDropdownOpen}
                            dropdownRef={yearDropdownRef}
                            icon={<Calendar className="h-3.5 w-3.5 text-primary shrink-0" />}
                            prefixLabel="Year:"
                          />
                        </div>

                        <div className="w-44 relative z-50">
                          <CustomDropdown
                            value={currentMonthlyData?.month}
                            onChange={(val) => {
                              const targetData = pgcbMonthlyData.find(d => d.year === currentMonthlyData.year && d.month === val);
                              if (targetData) setSelectedMonthlyKey(targetData.date_key);
                            }}
                            options={monthOptions}
                            placeholder="Month"
                            isOpen={isMonthDropdownOpen}
                            setIsOpen={setIsMonthDropdownOpen}
                            dropdownRef={monthDropdownRef}
                            icon={<FileText className="h-3.5 w-3.5 text-primary shrink-0" />}
                            prefixLabel="Month:"
                          />
                        </div>
                      </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-muted/15 border border-border/50 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Max Peak Generation</div>
                        <div className="text-2xl font-bold mt-1 text-primary tabular-nums">
                          {currentMonthlyData ? formatNumber(currentMonthlyData.max_evening_peak_gen) : 0} <span className="text-xs font-medium text-muted-foreground">MW</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1">Evening peak generation recorded</p>
                      </div>

                      <div className="bg-muted/15 border border-border/50 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Estimated Peak Demand</div>
                        <div className="text-2xl font-bold mt-1 text-foreground tabular-nums">
                          {currentMonthlyData ? formatNumber(currentMonthlyData.max_evening_peak_demand) : 0} <span className="text-xs font-medium text-muted-foreground">MW</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1">System operational peak demand</p>
                      </div>

                      <div className="bg-muted/15 border border-border/50 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Peak Deficit / Load Shed</div>
                        <div className="text-2xl font-bold mt-1 text-destructive tabular-nums">
                          {currentMonthlyData && currentMonthlyData.max_evening_peak_demand > currentMonthlyData.max_evening_peak_gen
                            ? formatNumber(Math.round(currentMonthlyData.max_evening_peak_demand - currentMonthlyData.max_evening_peak_gen))
                            : 0}{' '}
                          <span className="text-xs font-medium text-muted-foreground">MW</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1">Peak capacity deficit gap</p>
                      </div>

                      <div className="bg-muted/15 border border-border/50 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total Net Energy</div>
                        <div className="text-2xl font-bold mt-1 text-amber-500 tabular-nums">
                          {currentMonthlyData ? formatNumber(currentMonthlyData.total_net_generation, 1) : 0}{' '}
                          <span className="text-xs font-medium text-muted-foreground">MKWh</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1">Monthly total energy generation</p>
                      </div>
                    </div>

                    {/* Fuel and Regional supply details */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      
                      {/* Fuel Mix Card */}
                      <div className="grid-explorer-chart-card card">
                        <div className="grid-explorer-chart-card__head">
                          <div>
                            <h3 className="grid-explorer-chart-card__title">Energy Fuel Mix</h3>
                            <p className="grid-explorer-chart-card__sub">Net generation by fuel source in {currentMonthlyData?.month} {currentMonthlyData?.year} (MKWh)</p>
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-4 mt-4">
                          {/* Fuel Mix Pie Chart */}
                          <div className="lg:col-span-6 h-48 lg:h-56 relative flex items-center justify-center">
                            {chartsReady ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={
                                      currentMonthlyData
                                        ? Object.entries(currentMonthlyData.generation_by_fuel)
                                            .map(([name, val]) => ({
                                              name: name.toUpperCase(),
                                              value: val,
                                              color: getFuelColor(name)
                                            }))
                                            .filter(d => d.value > 0)
                                        : []
                                    }
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                  >
                                    {(currentMonthlyData
                                      ? Object.entries(currentMonthlyData.generation_by_fuel)
                                          .map(([name, val]) => ({
                                            name: name.toUpperCase(),
                                            value: val,
                                            color: getFuelColor(name)
                                          }))
                                          .filter(d => d.value > 0)
                                      : []
                                    ).map((entry, idx) => (
                                      <Cell key={`cell-${idx}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    content={({ active, payload }) => {
                                      if (!active || !payload?.length) return null;
                                      const data = payload[0].payload;
                                      const total = currentMonthlyData ? currentMonthlyData.total_net_generation : 1;
                                      const pct = (data.value / total) * 100;
                                      return (
                                        <div className="p-3 text-card-foreground border border-border/80 rounded-xl shadow-lg bg-card/95 backdrop-blur-md text-xs z-50">
                                          <div className="font-bold mb-1.5 flex items-center gap-1.5 border-b border-border/40 pb-1">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
                                            <span>{data.name}</span>
                                          </div>
                                          <div className="space-y-1">
                                            <div className="flex justify-between gap-4">
                                              <span className="text-muted-foreground">Generation:</span>
                                              <span className="font-bold text-foreground tabular-nums">{formatNumber(data.value, 1)} MKWh</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                              <span className="text-muted-foreground">Share of Mix:</span>
                                              <span className="font-bold text-primary tabular-nums">{pct.toFixed(1)}%</span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="grid-explorer-skeleton" />
                            )}
                            
                            {/* Center labels */}
                            <div className="absolute flex flex-col items-center justify-center text-center">
                              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Net</span>
                              <span className="text-base font-bold text-foreground tabular-nums">
                                {currentMonthlyData ? formatNumber(currentMonthlyData.total_net_generation, 0) : 0}
                              </span>
                              <span className="text-[9px] text-muted-foreground font-medium">MKWh</span>
                            </div>
                          </div>

                          {/* Fuel Mix Table */}
                          <div className="lg:col-span-6 overflow-y-auto max-h-[14rem] pr-1">
                            <table className="w-full text-[11px] leading-relaxed">
                              <thead>
                                <tr className="border-b border-border/40 text-muted-foreground text-left">
                                  <th className="pb-1.5 font-bold">Fuel Type</th>
                                  <th className="pb-1.5 text-right font-bold">MKWh</th>
                                  <th className="pb-1.5 text-right font-bold">Share %</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 text-foreground">
                                {currentMonthlyData &&
                                  Object.entries(currentMonthlyData.generation_by_fuel)
                                    .map(([name, val]) => {
                                      const total = currentMonthlyData.total_net_generation || 1;
                                      const pct = (val / total) * 100;
                                      return { name, val, pct, color: getFuelColor(name) };
                                    })
                                    .filter(d => d.val > 0)
                                    .sort((a, b) => b.val - a.val)
                                    .map((f, idx) => (
                                      <tr key={idx} className="hover:bg-muted/10">
                                        <td className="py-1.5 flex items-center gap-1.5 font-medium">
                                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                                          <span className="capitalize">{f.name === 'hfo' ? 'Furnace Oil (HFO)' : f.name === 'import' ? 'India Imports' : f.name}</span>
                                        </td>
                                        <td className="py-1.5 text-right tabular-nums font-semibold">{formatNumber(f.val, 1)}</td>
                                        <td className="py-1.5 text-right tabular-nums text-muted-foreground">{f.pct.toFixed(1)}%</td>
                                      </tr>
                                    ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Regional Peak Supply Card */}
                      <div className="grid-explorer-chart-card card">
                        <div className="grid-explorer-chart-card__head">
                          <div>
                            <h3 className="grid-explorer-chart-card__title">Regional Maximum Peak Supply</h3>
                            <p className="grid-explorer-chart-card__sub">Substation peak loads served by grid zone in {currentMonthlyData?.month} {currentMonthlyData?.year} (MW)</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="h-56">
                            {chartsReady ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={
                                    currentMonthlyData
                                      ? Object.entries(currentMonthlyData.regional_supply).map(([name, value]) => ({
                                          name: name.charAt(0).toUpperCase() + name.slice(1),
                                          value
                                        }))
                                      : []
                                  }
                                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                                >
                                  <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                                  <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 9, fill: chartTheme.axisTick }}
                                    axisLine={false}
                                    tickLine={false}
                                    angle={-25}
                                    textAnchor="end"
                                  />
                                  <YAxis
                                    tick={{ fontSize: 10, fill: chartTheme.axisTick }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `${v} MW`}
                                  />
                                  <Tooltip
                                    content={({ active, payload }) => {
                                      if (!active || !payload?.length) return null;
                                      const data = payload[0].payload;
                                      const totalRegional = currentMonthlyData
                                        ? Object.values(currentMonthlyData.regional_supply).reduce((a, b) => a + b, 0)
                                        : 1;
                                      const pct = (data.value / totalRegional) * 100;
                                      return (
                                        <div className="p-3 text-card-foreground border border-border/80 rounded-xl shadow-lg bg-card/95 backdrop-blur-md text-xs z-50">
                                          <div className="font-bold mb-1.5 border-b border-border/40 pb-1 flex justify-between gap-4">
                                            <span>{data.name} Zone</span>
                                            <span className="text-[9px] uppercase font-bold text-primary">Peak Load</span>
                                          </div>
                                          <div className="space-y-1">
                                            <div className="flex justify-between gap-4">
                                              <span className="text-muted-foreground">Peak Served:</span>
                                              <span className="font-bold text-foreground tabular-nums">{formatNumber(data.value)} MW</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                              <span className="text-muted-foreground">Share of System:</span>
                                              <span className="font-bold text-primary tabular-nums">{pct.toFixed(1)}%</span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }}
                                  />
                                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={25}>
                                    {(currentMonthlyData
                                      ? Object.entries(currentMonthlyData.regional_supply).map(([name, value]) => ({ name, value }))
                                      : []
                                    ).map((entry, index) => {
                                      const colors = [
                                        '#0ea5e9', '#06b6d4', '#10b981', '#a855f7',
                                        '#f97316', '#64748b', '#ef4444', '#eab308', '#ec4899'
                                      ];
                                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                    })}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="grid-explorer-skeleton" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Historical Long-term Trend Chart */}
              <div className="grid-explorer-chart-card card">
                <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="grid-explorer-chart-card__title">PGCB 13-Year Historical Growth Trends</h3>
                    <p className="grid-explorer-chart-card__sub">Grid operational metrics charted monthly from 2013 to 2026</p>
                  </div>
                  
                  {/* Selector Controls for Chart */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setMonthlyTrendMetric('peaks')}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                        monthlyTrendMetric === 'peaks'
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      Grid Peaks (MW)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthlyTrendMetric('energy')}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                        monthlyTrendMetric === 'energy'
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      Energy (MKWh)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthlyTrendMetric('fuels')}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                        monthlyTrendMetric === 'fuels'
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      Fuel Trends
                    </button>

                    {monthlyTrendMetric === 'fuels' && (
                      <div className="w-44 relative z-50">
                        <CustomDropdown
                          value={selectedFuelTrend}
                          onChange={(val: any) => setSelectedFuelTrend(val)}
                          options={[
                            { label: 'Gas', value: 'gas' },
                            { label: 'Coal', value: 'coal' },
                            { label: 'Furnace Oil (HFO)', value: 'hfo' },
                            { label: 'Imports', value: 'import' }
                          ]}
                          placeholder="Select Fuel"
                          isOpen={isFuelDropdownOpen}
                          setIsOpen={setIsFuelDropdownOpen}
                          dropdownRef={fuelDropdownRef}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid-explorer-chart-area mt-4 !h-[26rem]">
                  {chartsReady ? (
                    <ResponsiveContainer width="100%" height="100%">
                      {monthlyTrendMetric === 'peaks' ? (
                        <ComposedChart data={pgcbMonthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis
                            dataKey="date_key"
                            tick={{ fontSize: 9, fill: chartTheme.axisTick }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => {
                              if (v.endsWith("-01")) return v.split("-")[0];
                              return "";
                            }}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: chartTheme.axisTick }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v} MW`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              
                              // YoY calculation
                              const prevData = pgcbMonthlyData.find(m => m.year === d.year - 1 && m.month === d.month);
                              const genYoY = prevData && prevData.max_evening_peak_gen > 0
                                ? ((d.max_evening_peak_gen - prevData.max_evening_peak_gen) / prevData.max_evening_peak_gen) * 100
                                : null;
                              const demandYoY = prevData && prevData.max_evening_peak_demand > 0
                                ? ((d.max_evening_peak_demand - prevData.max_evening_peak_demand) / prevData.max_evening_peak_demand) * 100
                                : null;
                                
                              const deficit = d.max_evening_peak_demand > d.max_evening_peak_gen
                                ? Math.round(d.max_evening_peak_demand - d.max_evening_peak_gen)
                                : 0;
                              const deficitPct = d.max_evening_peak_demand > 0 ? (deficit / d.max_evening_peak_demand) * 100 : 0;
                              
                              return (
                                <div className="p-4 text-card-foreground border border-border rounded-2xl shadow-xl bg-card/95 backdrop-blur-md text-xs min-w-[240px] z-50">
                                  <div className="font-bold mb-2 border-b border-border/40 pb-1.5 flex justify-between items-center gap-4">
                                    <span className="text-sm">{d.month} {d.year}</span>
                                    <span className="text-[10px] uppercase font-extrabold text-primary">Grid Peak</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <div className="flex justify-between gap-4 items-center">
                                        <span className="text-muted-foreground">Max Generation:</span>
                                        <span className="font-bold text-primary tabular-nums">{formatNumber(d.max_evening_peak_gen)} MW</span>
                                      </div>
                                      {genYoY !== null && (
                                        <div className="text-right text-[10px]">
                                          <span className="text-muted-foreground mr-1">YoY:</span>
                                          <span className={cn("font-semibold", genYoY >= 0 ? "text-emerald-500" : "text-destructive")}>
                                            {genYoY >= 0 ? "+" : ""}{genYoY.toFixed(1)}%
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex justify-between gap-4 items-center">
                                        <span className="text-muted-foreground">Peak Demand:</span>
                                        <span className="font-bold text-foreground tabular-nums">{formatNumber(d.max_evening_peak_demand)} MW</span>
                                      </div>
                                      {demandYoY !== null && (
                                        <div className="text-right text-[10px]">
                                          <span className="text-muted-foreground mr-1">YoY:</span>
                                          <span className={cn("font-semibold", demandYoY >= 0 ? "text-emerald-500" : "text-destructive")}>
                                            {demandYoY >= 0 ? "+" : ""}{demandYoY.toFixed(1)}%
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="border-t border-border/30 pt-1.5">
                                      <div className="flex justify-between gap-4 items-center">
                                        <span className="text-destructive font-semibold">Deficit Gap:</span>
                                        <span className="font-bold text-destructive tabular-nums">
                                          {formatNumber(deficit)} MW
                                        </span>
                                      </div>
                                      {deficit > 0 && (
                                        <div className="text-right text-[10px]">
                                          <span className="text-muted-foreground mr-1">Deficit Share:</span>
                                          <span className="font-semibold text-destructive">{deficitPct.toFixed(1)}%</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Alert Banner */}
                                    <div className={cn(
                                      "mt-2 p-1.5 rounded-lg text-[10px] font-semibold text-center border",
                                      deficit > 1000
                                        ? "bg-destructive/10 border-destructive/20 text-destructive"
                                        : deficit > 0
                                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                    )}>
                                      {deficit > 1000
                                        ? "⚠️ Severe Load Shedding Alert"
                                        : deficit > 0
                                          ? "⚠️ Moderate Load Shedding Alert"
                                          : "✅ Stable Grid Capacity"}
                                    </div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                          <Area type="monotone" dataKey="max_evening_peak_demand" name="Estimated Peak Demand" stroke="#f97316" fill="rgba(249, 115, 22, 0.05)" strokeWidth={1.5} />
                          <Line type="monotone" dataKey="max_evening_peak_gen" name="Maximum Peak Generation" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                        </ComposedChart>
                      ) : monthlyTrendMetric === 'energy' ? (
                        <ComposedChart data={pgcbMonthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis
                            dataKey="date_key"
                            tick={{ fontSize: 9, fill: chartTheme.axisTick }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => {
                              if (v.endsWith("-01")) return v.split("-")[0];
                              return "";
                            }}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: chartTheme.axisTick }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v} MKWh`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              
                              // YoY calculation
                              const prevData = pgcbMonthlyData.find(m => m.year === d.year - 1 && m.month === d.month);
                              const energyYoY = prevData && prevData.total_net_generation > 0
                                ? ((d.total_net_generation - prevData.total_net_generation) / prevData.total_net_generation) * 100
                                : null;
                                
                              // Average dispatch computation
                              const daysInMonth = (month: string, year: number) => {
                                const m = month.toLowerCase();
                                if (['january', 'march', 'may', 'july', 'august', 'october', 'december'].includes(m)) return 31;
                                if (['april', 'june', 'september', 'november'].includes(m)) return 30;
                                if (m === 'february') return year % 4 === 0 ? 29 : 28;
                                return 30;
                              };
                              const days = daysInMonth(d.month, d.year);
                              const avgMW = (d.total_net_generation * 1000) / (days * 24);
                              
                              return (
                                <div className="p-4 text-card-foreground border border-border rounded-2xl shadow-xl bg-card/95 backdrop-blur-md text-xs min-w-[240px] z-50">
                                  <div className="font-bold mb-2 border-b border-border/40 pb-1.5 flex justify-between items-center gap-4">
                                    <span className="text-sm">{d.month} {d.year}</span>
                                    <span className="text-[10px] uppercase font-extrabold text-amber-500">Energy Net</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <div className="flex justify-between gap-4 items-center">
                                        <span className="text-muted-foreground">Total Generation:</span>
                                        <span className="font-bold text-amber-500 tabular-nums">{formatNumber(d.total_net_generation, 1)} MKWh</span>
                                      </div>
                                      {energyYoY !== null && (
                                        <div className="text-right text-[10px]">
                                          <span className="text-muted-foreground mr-1">YoY Growth:</span>
                                          <span className={cn("font-semibold", energyYoY >= 0 ? "text-emerald-500" : "text-destructive")}>
                                            {energyYoY >= 0 ? "+" : ""}{energyYoY.toFixed(1)}%
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="border-t border-border/30 pt-1.5">
                                      <div className="flex justify-between gap-4 items-center">
                                        <span className="text-muted-foreground">Avg continuous dispatch:</span>
                                        <span className="font-bold text-foreground tabular-nums">{formatNumber(Math.round(avgMW))} MW</span>
                                      </div>
                                      <div className="text-[9px] text-muted-foreground mt-0.5">
                                        Calculated across {days} operational days
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                          <Area type="monotone" dataKey="total_net_generation" name="Total Monthly Energy Generation (MKWh)" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.1)" strokeWidth={2.5} />
                        </ComposedChart>
                      ) : (
                        <ComposedChart data={pgcbMonthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.3} vertical={false} />
                          <XAxis
                            dataKey="date_key"
                            tick={{ fontSize: 9, fill: chartTheme.axisTick }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => {
                              if (v.endsWith("-01")) return v.split("-")[0];
                              return "";
                            }}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: chartTheme.axisTick }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v} MKWh`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              const fuelVal = d.generation_by_fuel[selectedFuelTrend] || 0;
                              
                              // YoY calculation
                              const prevData = pgcbMonthlyData.find(m => m.year === d.year - 1 && m.month === d.month);
                              const prevFuelVal = prevData ? (prevData.generation_by_fuel[selectedFuelTrend] || 0) : 0;
                              const fuelYoY = prevFuelVal > 0
                                ? ((fuelVal - prevFuelVal) / prevFuelVal) * 100
                                : null;
                                
                              const share = d.total_net_generation > 0 ? (fuelVal / d.total_net_generation) * 100 : 0;
                              const fuelLabel = selectedFuelTrend === 'hfo' ? 'Furnace Oil (HFO)' : selectedFuelTrend === 'import' ? 'India Imports' : selectedFuelTrend;
                              
                              return (
                                <div className="p-4 text-card-foreground border border-border rounded-2xl shadow-xl bg-card/95 backdrop-blur-md text-xs min-w-[240px] z-50">
                                  <div className="font-bold mb-2 border-b border-border/40 pb-1.5 flex justify-between items-center gap-4">
                                    <span className="text-sm">{d.month} {d.year}</span>
                                    <span className="text-[10px] uppercase font-extrabold" style={{ color: getFuelColor(selectedFuelTrend) }}>
                                      {selectedFuelTrend}
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <div className="flex justify-between gap-4 items-center">
                                        <span className="text-muted-foreground capitalize">{fuelLabel}:</span>
                                        <span className="font-bold tabular-nums" style={{ color: getFuelColor(selectedFuelTrend) }}>
                                          {formatNumber(fuelVal, 1)} MKWh
                                        </span>
                                      </div>
                                      {fuelYoY !== null && (
                                        <div className="text-right text-[10px]">
                                          <span className="text-muted-foreground mr-1">YoY Growth:</span>
                                          <span className={cn("font-semibold", fuelYoY >= 0 ? "text-emerald-500" : "text-destructive")}>
                                            {fuelYoY >= 0 ? "+" : ""}{fuelYoY.toFixed(1)}%
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="border-t border-border/30 pt-1.5">
                                      <div className="flex justify-between gap-4 items-center">
                                        <span className="text-muted-foreground">Share of Month Mix:</span>
                                        <span className="font-bold text-foreground tabular-nums">{share.toFixed(1)}%</span>
                                      </div>
                                      <div className="flex justify-between gap-4 items-center mt-1">
                                        <span className="text-muted-foreground">Total Month Net:</span>
                                        <span className="font-bold text-foreground/80 tabular-nums">{formatNumber(d.total_net_generation, 1)} MKWh</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                          <Line
                            type="monotone"
                            dataKey={(d) => d.generation_by_fuel[selectedFuelTrend] || 0}
                            name={`${selectedFuelTrend.toUpperCase()} Generation Trend (MKWh)`}
                            stroke={getFuelColor(selectedFuelTrend)}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5 }}
                          />
                        </ComposedChart>
                      )}
                    </ResponsiveContainer>
                  ) : (
                    <div className="grid-explorer-skeleton" />
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/80 px-4 pb-4">
                  <span>Source: <a href="https://www.pgcb.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">PGCB Monthly System Operation Reports</a></span>
                  <span>Data Period: January 2013 - April 2026 (157 Consecutive Reports)</span>
                </div>
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
                        <ComposedChart data={macroEconomicData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                        <ComposedChart data={macroEconomicData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                          <ComposedChart data={bpdbAuditedFinancials} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                          <ComposedChart data={petrobanglaAuditedFinancials} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                        <ComposedChart data={globalVsDomesticData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                        <ComposedChart data={globalVsDomesticData.filter(x => parseInt(x.year) >= 2010)} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                      <ComposedChart data={globalVsDomesticData.filter(x => parseInt(x.year) >= 2015)} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                        <ComposedChart data={reservesDepletionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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

    {/* Print-Only Curated Report Document */}
    <div className="hidden print:block print-report space-y-10">
      {/* Report Header */}
      <div className="border-b-2 border-primary pb-4 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-primary font-bold">Bangladesh Energy Sector Briefing</div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">National Power Grid Audit Report</h1>
            <p className="text-xs text-muted-foreground mt-1">Comprehensive grid performance analytics, fuel audits, and asset directories.</p>
          </div>
          <div className="text-right text-xs">
            <div className="font-bold text-foreground">ESB PowerLine Intelligence</div>
            <div className="text-muted-foreground mt-0.5 font-semibold text-primary">Classification: Member Executive Briefing</div>
            <div className="text-muted-foreground">Generated: {systemStats.date}</div>
          </div>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border border-border/60 p-3 rounded-lg bg-muted/5">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Evening Peak Demand</span>
          <div className="text-lg font-bold text-foreground mt-1">{formatNumber(Math.round(systemStats.eveningPeakDemand))} MW</div>
        </div>
        <div className="border border-border/60 p-3 rounded-lg bg-muted/5">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Evening Peak Gen</span>
          <div className="text-lg font-bold text-foreground mt-1">{formatNumber(Math.round(systemStats.eveningPeakGen))} MW</div>
        </div>
        <div className="border border-border/60 p-3 rounded-lg bg-muted/5">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Renewable Output</span>
          <div className="text-lg font-bold text-foreground mt-1">{systemStats.totalEnergyGen.toFixed(1)} MKWh</div>
        </div>
        <div className="border border-border/60 p-3 rounded-lg bg-muted/5">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Avg. Generation Cost</span>
          <div className="text-lg font-bold text-foreground mt-1">{systemStats.avgProductionCost.toFixed(3)} Tk/KWh</div>
        </div>
      </div>

      {/* Section 1: Daily Generation Mix & Fuel Audits */}
      <div className="space-y-4 page-break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-border pb-1.5 flex items-center gap-1.5 text-primary">
          <Zap className="h-4 w-4" /> 1. Daily Generation Mix & Fuel Audits
        </h2>
        <table className="print-report-table w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/10">
              <th className="text-left py-1.5 px-2 font-bold">Fuel Type</th>
              <th className="text-right py-1.5 px-2 font-bold">Output (MKWh)</th>
              <th className="text-right py-1.5 px-2 font-bold">Daily Cost (BDT)</th>
              <th className="text-right py-1.5 px-2 font-bold">Unit Cost (Tk/KWh)</th>
              <th className="text-right py-1.5 px-2 font-bold">System Share</th>
            </tr>
          </thead>
          <tbody>
            {generationData.map((item) => (
              <tr key={item.name} className="border-b border-border/40">
                <td className="py-1.5 px-2 font-medium">{item.name}</td>
                <td className="text-right py-1.5 px-2 tabular-nums">{item.gen.toFixed(2)}</td>
                <td className="text-right py-1.5 px-2 tabular-nums">{item.cost > 0 ? formatNumber(item.cost) : '—'}</td>
                <td className="text-right py-1.5 px-2 tabular-nums">{item.unitCost > 0 ? `${item.unitCost.toFixed(2)} Tk` : '—'}</td>
                <td className="text-right py-1.5 px-2 tabular-nums">{((item.gen / totalGenMkwhr) * 100).toFixed(1)}%</td>
              </tr>
            ))}
            <tr className="font-bold bg-muted/5 border-t border-border">
              <td className="py-1.5 px-2">Total System</td>
              <td className="text-right py-1.5 px-2 tabular-nums">{totalGenMkwhr.toFixed(2)}</td>
              <td className="text-right py-1.5 px-2 tabular-nums">{formatNumber(totalCostBdt)}</td>
              <td className="text-right py-1.5 px-2 tabular-nums">{(totalCostBdt / (totalGenMkwhr * 1000000)).toFixed(3)} Tk</td>
              <td className="text-right py-1.5 px-2">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 2: Gas Distribution & LNG Supply */}
      <div className="space-y-4 page-break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-border pb-1.5 flex items-center gap-1.5 text-primary">
          <Droplet className="h-4 w-4" /> 2. Gas Distribution & LNG Supply
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Daily Production by Operator</h3>
            <table className="print-report-table w-full text-[10px]">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="text-left py-1.5 px-2">Operator / Field</th>
                  <th className="text-right py-1.5 px-2">Gas (MMCFD)</th>
                  <th className="text-right py-1.5 px-2">Share</th>
                </tr>
              </thead>
              <tbody>
                {gasProductionData.map((gp, idx) => (
                  <tr key={idx} className="border-b border-border/40">
                    <td className="py-1 px-2 font-medium">{gp.company}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{gp.gas.toFixed(1)}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{gp.share}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Power and Industry Distribution</h3>
            <table className="print-report-table w-full text-[10px]">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="text-left py-1.5 px-2">Distributor</th>
                  <th className="text-right py-1.5 px-2">Power (MMCFD)</th>
                  <th className="text-right py-1.5 px-2">Industry / Other</th>
                  <th className="text-right py-1.5 px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {gasDistributionData.map((gd, idx) => (
                  <tr key={idx} className="border-b border-border/40">
                    <td className="py-1 px-2 font-medium">{gd.company}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{gd.power.toFixed(1)}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{gd.others.toFixed(1)}</td>
                    <td className="text-right py-1 px-2 tabular-nums font-semibold">{gd.total.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 3: Regional Grid Performance & Outages */}
      <div className="space-y-4 page-break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-border pb-1.5 flex items-center gap-1.5 text-primary">
          <Cable className="h-4 w-4" /> 3. Regional Grid Performance & Outage Logs
        </h2>
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Zone-wise Demand & Load-Shedding</h3>
            <table className="print-report-table w-full text-[10px]">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="text-left py-1.5 px-2">Grid Zone</th>
                  <th className="text-right py-1.5 px-2">Demand (MW)</th>
                  <th className="text-right py-1.5 px-2">Load-Shedding (MW)</th>
                  <th className="text-right py-1.5 px-2">Shedding Share</th>
                </tr>
              </thead>
              <tbody>
                {regionalDemandData.map((rd, idx) => (
                  <tr key={idx} className="border-b border-border/40">
                    <td className="py-1 px-2 font-medium">{rd.zone}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{formatNumber(rd.demand)}</td>
                    <td className="text-right py-1 px-2 tabular-nums text-destructive font-semibold">{rd.loadShed > 0 ? `${rd.loadShed} MW` : '0 MW'}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{rd.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-span-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">NLDC Outage Log (Yesterday)</h3>
            <div className="space-y-2 text-[9px]">
              {dailyOutages.slice(0, 6).map((o, idx) => (
                <div key={idx} className="p-2 border border-border/40 rounded bg-muted/5 space-y-0.5">
                  <div className="flex justify-between font-bold text-foreground">
                    <span className="truncate pr-1">{o.plant}</span>
                    <span className="font-mono text-muted-foreground font-normal shrink-0">{o.time}</span>
                  </div>
                  <div className="text-muted-foreground truncate">{o.reason}</div>
                  <div className="text-destructive font-semibold">{o.load}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Infrastructure Assets & Planning Tracker */}
      <div className="space-y-4 page-break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-border pb-1.5 flex items-center gap-1.5 text-primary">
          <Database className="h-4 w-4" /> 4. Infrastructure Assets & Planning Tracker
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Transmission Grid Assets</h3>
            <table className="print-report-table w-full text-[10px]">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="text-left py-1.5 px-2">Line Asset</th>
                  <th className="text-left py-1.5 px-2">Owner</th>
                  <th className="text-right py-1.5 px-2">Capacity</th>
                  <th className="text-right py-1.5 px-2">Load</th>
                </tr>
              </thead>
              <tbody>
                {(initialLines && initialLines.length > 0 ? initialLines : [
                  { name: '400 kV Patuakhali–Gopalganj', status: 'Commissioned', capacity: '1800 MW', owner: 'PGCB', load: 74 },
                  { name: '400 kV Rooppur–Baghabari', status: 'Under Construction', capacity: '2400 MW', owner: 'PGCB', load: 0 },
                  { name: '230 kV Barisal–Khulna', status: 'Commissioned', capacity: '650 MW', owner: 'PGCB', load: 82 },
                  { name: '400 kV Bheramara HVDC (India)', status: 'Operational', capacity: '1000 MW', owner: 'PGCB/POWERGRID', load: 90 },
                ]).map((line: any, idx: number) => (
                  <tr key={idx} className="border-b border-border/40">
                    <td className="py-1 px-2 font-medium">
                      <div className="flex flex-col">
                        <span>{line.name}</span>
                        <span className="text-[8px] text-muted-foreground font-normal">{line.status}</span>
                      </div>
                    </td>
                    <td className="py-1 px-2">{line.owner}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{line.capacity}</td>
                    <td className="text-right py-1 px-2 tabular-nums font-semibold">{line.load > 0 ? `${line.load}%` : 'Offline'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Upcoming Generation Projects</h3>
            <table className="print-report-table w-full text-[10px]">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="text-left py-1.5 px-2">Project Name</th>
                  <th className="text-left py-1.5 px-2">Status</th>
                  <th className="text-right py-1.5 px-2">Capacity / Cost</th>
                  <th className="text-right py-1.5 px-2">Expected Date</th>
                </tr>
              </thead>
              <tbody>
                {(initialProjects && initialProjects.length > 0 ? initialProjects : ongoingProjectsData.map(p => ({
                  name: p.name,
                  status: p.status.physical.includes('%') ? `Phys: ${p.status.physical.trim()}` : p.status.physical,
                  mw: p.cost.total.split(" ")[0] + " Lakh",
                  date: p.duration.split(" to ")[1] || p.duration
                })))
                .map((proj: any, idx: number) => (
                  <tr key={idx} className="border-b border-border/40">
                    <td className="py-1 px-2 font-medium">{proj.name}</td>
                    <td className="py-1 px-2">
                      <span className="font-semibold">{proj.status}</span>
                    </td>
                    <td className="text-right py-1 px-2 tabular-nums">{proj.mw} MW</td>
                    <td className="text-right py-1 px-2 text-muted-foreground">{proj.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 5: Macro Trends & BPDB Financial History */}
      <div className="space-y-4 page-break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-border pb-1.5 flex items-center gap-1.5 text-primary">
          <TrendingUp className="h-4 w-4" /> 5. Macro Trends & BPDB Financial History
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">BPDB Audited Financial Statements</h3>
            <table className="print-report-table w-full text-[10px]">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="text-left py-1.5 px-2">Fiscal Year</th>
                  <th className="text-right py-1.5 px-2">Revenue (Cr Tk)</th>
                  <th className="text-right py-1.5 px-2">Cost (Cr Tk)</th>
                  <th className="text-right py-1.5 px-2">Subsidy (Cr Tk)</th>
                  <th className="text-right py-1.5 px-2">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {bpdbAuditedFinancials.slice(-6).map((f, idx) => (
                  <tr key={idx} className="border-b border-border/40">
                    <td className="py-1 px-2 font-medium">{f.year}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{formatNumber(f.revenue)}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{formatNumber(f.cost)}</td>
                    <td className="text-right py-1 px-2 tabular-nums text-emerald-500">{formatNumber(f.subsidy)}</td>
                    <td className="text-right py-1 px-2 tabular-nums font-semibold text-destructive">{f.loss} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">Exchange, Inflation & Fuel Drivers</h3>
            <table className="print-report-table w-full text-[10px]">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="text-left py-1.5 px-2">Year</th>
                  <th className="text-right py-1.5 px-2">USD/BDT</th>
                  <th className="text-right py-1.5 px-2">Inflation</th>
                  <th className="text-right py-1.5 px-2">Spot LNG ($)</th>
                  <th className="text-right py-1.5 px-2">Retail Diesel</th>
                </tr>
              </thead>
              <tbody>
                {macroEconomicData.slice(-6).map((m, idx) => (
                  <tr key={idx} className="border-b border-border/40">
                    <td className="py-1 px-2 font-medium">{m.year}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{m.exchangeRate.toFixed(2)}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{m.inflation.toFixed(2)}%</td>
                    <td className="text-right py-1 px-2 tabular-nums">{m.spotLng > 0 ? `$${m.spotLng.toFixed(1)}` : '—'}</td>
                    <td className="text-right py-1 px-2 tabular-nums">{m.retailDiesel.toFixed(2)} Tk</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Report Footer */}
      <div className="border-t border-border/40 pt-4 text-[9px] text-muted-foreground flex justify-between">
        <span>Report Document ID: ESB-AUDIT-2026-Q2</span>
        <span>© 2026 ESB PowerLine Services. All rights reserved. Generated on secure member access session.</span>
      </div>
    </div>
  </>
  );
}