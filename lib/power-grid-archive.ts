// --- POWER GRID ARCHIVE DATA (BACKLOGGING DAYS) ---

export interface GridDailyData {
  systemStats: {
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
  };
  generationData: {
    name: string;
    gen: number;
    cost: number;
    unitCost: number;
    color: string;
  }[];
  gasProductionData: {
    company: string;
    fields: number;
    gas: number;
    condensate: number;
    share: number;
  }[];
  gasDistributionData: {
    company: string;
    power: number;
    fertilizer: number;
    others: number;
    total: number;
  }[];
  borderImportsData: {
    source: string;
    energy: number;
    peakFlow: number;
    type: string;
  }[];
  regionalDemandData: {
    zone: string;
    loadShed: number;
    demand: number;
    pct: number;
  }[];
  dailyOutages: {
    time: string;
    plant: string;
    load: string;
    reason: string;
  }[];
  hourlyLoadData: {
    time: string;
    generation: number;
    loadShed: number;
    demand: number;
  }[];
}

export const powerGridArchive: Record<string, GridDailyData> = {
  '22 Jun 2026': {
    systemStats: {
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
},
    generationData: [
  { name: 'Gas', gen: 126.76, cost: 437084202, unitCost: 3.45, color: '#0ea5e9' },
  { name: 'Coal', gen: 123.30, cost: 816663902, unitCost: 6.62, color: '#64748b' },
  { name: 'HFO', gen: 35.03, cost: 632836198, unitCost: 18.06, color: '#f97316' },
  { name: 'Hydro', gen: 2.27, cost: 227438, unitCost: 0.10, color: '#06b6d4' },
  { name: 'Solar', gen: 2.99, cost: 47087759, unitCost: 15.77, color: '#eab308' },
  { name: 'Wind', gen: 0.19, cost: 2789016, unitCost: 14.71, color: '#10b981' },
  { name: 'Imports', gen: 52.72, cost: 334044072, unitCost: 6.34, color: '#a855f7' },
  { name: 'HSD (Diesel)', gen: 0.00, cost: 0, unitCost: 0.00, color: '#ef4444' },
],
    gasProductionData: [
  { company: 'BGFCL (Titas, Habiganj, Bakhrabad)', fields: 5, gas: 478.6, condensate: 371.8, share: 18.1 },
  { company: 'SGFL (Sylhet, Rashidpur, Kailashtila)', fields: 5, gas: 139.8, condensate: 638.0, share: 5.3 },
  { company: 'BAPEX (Shahbazpur, Srikail, Begumganj)', fields: 9, gas: 92.4, condensate: 59.3, share: 3.5 },
  { company: 'Chevron (Bibiyana, Jalalabad, Moulavibazar)', fields: 3, gas: 928.7, condensate: 4795.5, share: 35.1 },
  { company: 'Tullow (Bangora)', fields: 1, gas: 31.2, condensate: 93.0, share: 1.2 },
  { company: 'RPGCL (R-LNG Import / LNG Terminal)', fields: 0, gas: 1008.0, condensate: 0.0, share: 38.1 },
],
    gasDistributionData: [
  { company: 'TGTDCL (Dhaka & Mymensingh)', power: 267.4, fertilizer: 73.1, others: 1069.8, total: 1410.3 },
  { company: 'BGDCL (Cumilla & Sylhet)', power: 206.7, fertilizer: 0.0, others: 87.4, total: 294.1 },
  { company: 'KGDCL (Chattogram)', power: 37.6, fertilizer: 38.5, others: 170.0, total: 246.1 },
  { company: 'JGTDSL (Sylhet region)', power: 224.5, fertilizer: 40.1, others: 114.4, total: 379.0 },
  { company: 'PGCL (Rajshahi & Rangpur)', power: 126.9, fertilizer: 0.0, others: 29.2, total: 156.0 },
  { company: 'SGCL (Barishal & Khulna)', power: 54.2, fertilizer: 0.0, others: 4.3, total: 58.5 },
],
    borderImportsData: [
  { source: 'HVDC Bheramara (India)', energy: 14.18, peakFlow: 930.0, type: 'C/B Interconnector (West)' },
  { source: 'Adani Godda (India)', energy: 34.05, peakFlow: 1485.6, type: 'C/B Interconnector (North)' },
  { source: 'Tripura Cumilla (India)', energy: 3.58, peakFlow: 168.0, type: 'C/B Interconnector (East)' },
],
    regionalDemandData: [
  { zone: 'Dhaka', loadShed: 88, demand: 5861, pct: 1.5 },
  { zone: 'Chattogram', loadShed: 0, demand: 1526, pct: 0.0 },
  { zone: 'Cumilla', loadShed: 110, demand: 1579, pct: 7.0 },
  { zone: 'Mymensingh', loadShed: 241, demand: 1380, pct: 17.5 },
  { zone: 'Sylhet', loadShed: 0, demand: 627, pct: 0.0 },
  { zone: 'Khulna', loadShed: 31, demand: 1897, pct: 1.6 },
  { zone: 'Barishal', loadShed: 0, demand: 528, pct: 0.0 },
  { zone: 'Rajshahi', loadShed: 0, demand: 1641, pct: 0.0 },
  { zone: 'Rangpur', loadShed: 26, demand: 1002, pct: 2.6 },
],
    dailyOutages: [
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
],
    hourlyLoadData: [
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
]
  },
  '24 Jun 2026': {
    "systemStats": {
        "date": "24 Jun 2026",
        "dayPeakGen": 14441.07,
        "eveningPeakGen": 15700.01,
        "dayPeakDemand": 15598.07,
        "eveningPeakDemand": 17565.01,
        "minGen": 13478.64,
        "maxGen": 15762.39,
        "totalEnergyGen": 347.06060948,
        "totalEnergyUnserved": 29.581,
        "totalEnergyDemand": 376.64160948,
        "maxTemp": 32.8,
        "totalGasSuppliedPower": 890.08,
        "avgProductionCost": 6.656795656977707,
        "totalDailyCost": 2310311557
    },
    "generationData": [
        {
            "name": "Gas",
            "gen": 127.27196355,
            "cost": 438719200,
            "unitCost": 3.45,
            "color": "#0ea5e9"
        },
        {
            "name": "Coal",
            "gen": 120.35281209,
            "cost": 796389932,
            "unitCost": 6.62,
            "color": "#64748b"
        },
        {
            "name": "HFO",
            "gen": 36.0810352,
            "cost": 663054017,
            "unitCost": 18.38,
            "color": "#f97316"
        },
        {
            "name": "Hydro",
            "gen": 2.23636,
            "cost": 223636,
            "unitCost": 0.1,
            "color": "#06b6d4"
        },
        {
            "name": "Solar",
            "gen": 4.06232164,
            "cost": 65773748,
            "unitCost": 16.19,
            "color": "#eab308"
        },
        {
            "name": "Wind",
            "gen": 0.0696,
            "cost": 1023816,
            "unitCost": 14.71,
            "color": "#10b981"
        },
        {
            "name": "Imports",
            "gen": 56.986517,
            "cost": 345127206,
            "unitCost": 6.06,
            "color": "#a855f7"
        },
        {
            "name": "HSD (Diesel)",
            "gen": 0.0,
            "cost": 0,
            "unitCost": 0.0,
            "color": "#ef4444"
        }
    ],
    "borderImportsData": [
        {
            "source": "HVDC Bheramara (India)",
            "energy": 20.100364,
            "peakFlow": 902.0,
            "type": "C/B Interconnector (West)"
        },
        {
            "source": "Adani Godda (India)",
            "energy": 32.035273,
            "peakFlow": 1481.45,
            "type": "C/B Interconnector (North)"
        },
        {
            "source": "Tripura Cumilla (India)",
            "energy": 3.93888,
            "peakFlow": 166.0,
            "type": "C/B Interconnector (East)"
        }
    ],
    "regionalDemandData": [
        {
            "zone": "Dhaka",
            "loadShed": 219.0,
            "demand": 6082.0,
            "pct": 3.6
        },
        {
            "zone": "Chattogram",
            "loadShed": 31.0,
            "demand": 1522.0,
            "pct": 2.0
        },
        {
            "zone": "Cumilla",
            "loadShed": 342.0,
            "demand": 1742.0,
            "pct": 19.6
        },
        {
            "zone": "Mymensingh",
            "loadShed": 449.0,
            "demand": 1407.0,
            "pct": 31.9
        },
        {
            "zone": "Sylhet",
            "loadShed": 47.0,
            "demand": 713.0,
            "pct": 6.6
        },
        {
            "zone": "Khulna",
            "loadShed": 349.0,
            "demand": 2009.0,
            "pct": 17.4
        },
        {
            "zone": "Barishal",
            "loadShed": 85.0,
            "demand": 547.0,
            "pct": 15.5
        },
        {
            "zone": "Rajshahi",
            "loadShed": 58.0,
            "demand": 1752.0,
            "pct": 3.3
        },
        {
            "zone": "Rangpur",
            "loadShed": 205.0,
            "demand": 1125.0,
            "pct": 18.2
        }
    ],
    "dailyOutages": [
        {
            "time": "08:17 - 09:03",
            "plant": "Sylhet 132/33kV S/S T2 HT",
            "load": "61.0MW load",
            "reason": "Sylhet 132/33kV S/S T2 HT Tripped showing LV E/F, LV O/C and Gen trip relays Due to None 61.0MW load interrup."
        },
        {
            "time": "08:17 - 09:06",
            "plant": "Sylhet 132/33kV S/S T2 LT",
            "load": "61.0MW load",
            "reason": "Sylhet 132/33kV S/S T2 LT Tripped showing LV E/F, LV O/C and gen trip relays Due to None 61.0MW load interrup."
        },
        {
            "time": "08:17 - 08:47",
            "plant": "Chattak-Sylhet 132 kV Ckt-2",
            "load": "32.0MW load",
            "reason": "Chattak-Sylhet 132 kV Ckt-2 Tripped from Sylhet 132/33kV end showing Distance relays. 32.0MW load interrup. Sylhet 132/33kV end"
        },
        {
            "time": "08:38 - 10:27",
            "plant": "Gopalganj 132/33kV S/S Transformer-03 LT",
            "load": "14.0MW load",
            "reason": "Gopalganj 132/33kV S/S Transformer-03 LT Scheduled S/D Due to Md.Shakil Agm(A/C) Mollahat 14.0MW load interrup."
        },
        {
            "time": "08:39 - 10:26",
            "plant": "Gopalganj 132/33kV S/S Transformer-03 HT",
            "load": "",
            "reason": "Gopalganj 132/33kV S/S Transformer-03 HT Scheduled S/D Due to Md.Shakil Agm(A/C) Mollahat "
        },
        {
            "time": "",
            "plant": "zonel office, Bagerhat Pbs. Breaker to d",
            "load": "",
            "reason": "zonel office, Bagerhat Pbs. Breaker to ds clamp maintenance (B-Phase)."
        },
        {
            "time": "08:55 - 21:13",
            "plant": "Korerhat 400/230/132kV S/S Mirsharai-2",
            "load": "",
            "reason": "Korerhat 400/230/132kV S/S Mirsharai-2 Project Work S/D Due to For project work "
        },
        {
            "time": "09:09",
            "plant": "Kaliakoir 400/230/132kV S/S 400/132kV TR-3 HT",
            "load": "",
            "reason": "Kaliakoir 400/230/132kV S/S 400/132kV TR-3 HT Scheduled S/D Due to SAS Testing and "
        },
        {
            "time": "",
            "plant": "Commissioning.",
            "load": "",
            "reason": "Commissioning."
        },
        {
            "time": "",
            "plant": "Madunaghat-Meghnaghat 400kV Ckt-1",
            "load": "",
            "reason": "Madunaghat-Meghnaghat 400kV Ckt-1 is restored. "
        },
        {
            "time": "09:11",
            "plant": "Kaliakoir 400/230/132kV S/S 400/132kV TR-3 LT",
            "load": "",
            "reason": "Kaliakoir 400/230/132kV S/S 400/132kV TR-3 LT Scheduled S/D Due to SAS Testing and "
        },
        {
            "time": "",
            "plant": "Commissioning.",
            "load": "",
            "reason": "Commissioning."
        },
        {
            "time": "09:17 - 12:39",
            "plant": "Sherpur(Bogura)-Sirajgonj 132 kV Ckt-2",
            "load": "",
            "reason": "Sherpur(Bogura)-Sirajgonj 132 kV Ckt-2 Scheduled S/D from Sirajganj 132/33kV end Due to "
        },
        {
            "time": "",
            "plant": "Conductor Armoring Work and from Bog-She",
            "load": "",
            "reason": "Conductor Armoring Work and from Bog-Sherpur 132/33kVend."
        },
        {
            "time": "09:29 - 19:07",
            "plant": "Madunaghat-Meghnaghat 400kV Ckt-1",
            "load": "",
            "reason": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end Due to "
        },
        {
            "time": "",
            "plant": "maintenance work",
            "load": "",
            "reason": "maintenance work"
        },
        {
            "time": "09:30 - 19:09",
            "plant": "Korerhat 400/230/132kV S/S Meghnaghat-1",
            "load": "",
            "reason": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D Due to For project work "
        },
        {
            "time": "09:54 - 21:17",
            "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT",
            "load": "",
            "reason": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D Due to For project "
        },
        {
            "time": "",
            "plant": "work",
            "load": "",
            "reason": "work"
        },
        {
            "time": "09:54 - 21:15",
            "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT",
            "load": "",
            "reason": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D Due to For project "
        },
        {
            "time": "",
            "plant": "work",
            "load": "",
            "reason": "work"
        },
        {
            "time": "10:17 - 11:40",
            "plant": "Ishurdi 230/132kV S/S 230 kV Bus 2",
            "load": "",
            "reason": "Ishurdi 230/132kV S/S 230 kV Bus 2 Project Work S/D "
        },
        {
            "time": "10:39 - 16:23",
            "plant": "Sherpur 132/33kV S/S Transformer- 03 LT",
            "load": "",
            "reason": "Sherpur 132/33kV S/S Transformer- 03 LT Scheduled S/D Due to TR-03 132 KV DS box "
        },
        {
            "time": "",
            "plant": "installation works.",
            "load": "",
            "reason": "installation works."
        },
        {
            "time": "10:40 - 16:20",
            "plant": "Sherpur 132/33kV S/S Transformer- 03 HT",
            "load": "",
            "reason": "Sherpur 132/33kV S/S Transformer- 03 HT Scheduled S/D Due to TR-03 132 KV DS box "
        },
        {
            "time": "",
            "plant": "installation works.",
            "load": "",
            "reason": "installation works."
        },
        {
            "time": "12:00",
            "plant": "Day peak generation is 14441 MW.",
            "load": "",
            "reason": "Day peak generation is 14441 MW. "
        },
        {
            "time": "12:23 - 13:06",
            "plant": "Ishurdi 230/132kV S/S 230 kV Bus 1",
            "load": "",
            "reason": "Ishurdi 230/132kV S/S 230 kV Bus 1 Project Work S/D "
        },
        {
            "time": "17:10 - 18:25",
            "plant": "Purbasadipur-Thakurgaon-EPV  132kV Ckt-2",
            "load": "",
            "reason": "Purbasadipur-Thakurgaon-EPV  132kV Ckt-2 Forced S/D from Purbasadipur 230/132/33kV end "
        },
        {
            "time": "",
            "plant": "Due to \u09ac\u09be\u09b8\u09be\u09ac\u09be\u09dc\u09bf\u09b0 \u09aa\u09cd\u09af\u09be\u09a8\u09c7\u09b2 \u09a4\u09c1\u09b2\u09a4\u09c7 \u0997\u09bf\u09df\u09c7 \u0995\u09a8\u09cd\u09a1",
            "load": "",
            "reason": "Due to \u09ac\u09be\u09b8\u09be\u09ac\u09be\u09dc\u09bf\u09b0 \u09aa\u09cd\u09af\u09be\u09a8\u09c7\u09b2 \u09a4\u09c1\u09b2\u09a4\u09c7 \u0997\u09bf\u09df\u09c7 \u0995\u09a8\u09cd\u09a1\u09be\u0995\u09b0 \u099b\u09bf\u09dc\u09c7 \u09ab\u09c7\u09b2\u09c7\u099b\u09c7\u0964 \u09a4\u09be\u0987 \u0986\u09b0\u09cd\u09ae\u09be\u09b0\u09bf\u0982 \u0995\u09b0\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09b6\u09be\u099f\u09a1\u09be\u0989\u09a8"
        },
        {
            "time": "",
            "plant": "\u09aa\u09cd\u09b0\u09df\u09cb\u099c\u09a8\u0964",
            "load": "",
            "reason": "\u09aa\u09cd\u09b0\u09df\u09cb\u099c\u09a8\u0964"
        },
        {
            "time": "19:26",
            "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT",
            "load": "",
            "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT Forced S/D Due to T-2 transformer 33 kv side PT "
        },
        {
            "time": "",
            "plant": "oill leakage",
            "load": "",
            "reason": "oill leakage"
        },
        {
            "time": "19:26",
            "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT",
            "load": "",
            "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT Forced S/D Due to T-2 transformer 33 kv side PT "
        },
        {
            "time": "",
            "plant": "oill leakage",
            "load": "",
            "reason": "oill leakage"
        },
        {
            "time": "20:17",
            "plant": "Rampal 1320 MW (BIFPCL) Synchronized wit",
            "load": "",
            "reason": "Rampal 1320 MW (BIFPCL) Synchronized with remarks:- U1 "
        },
        {
            "time": "21:00",
            "plant": "Evening Peak Generation: 15700 MW.",
            "load": "",
            "reason": "Evening Peak Generation: 15700 MW. "
        },
        {
            "time": "06:00",
            "plant": "Patuakhali-Payra  132kV Ckt-1",
            "load": "",
            "reason": "Patuakhali-Payra  132kV Ckt-1 Scheduled S/D from Payra 400/132/33kV end Due to High "
        },
        {
            "time": "",
            "plant": "temperature Maintenance",
            "load": "",
            "reason": "temperature Maintenance"
        },
        {
            "time": "07:36",
            "plant": "Purbasadipur 230/132/33kV S/S TR-4 LT",
            "load": "",
            "reason": "Purbasadipur 230/132/33kV S/S TR-4 LT Scheduled S/D Due to Uthrail 33kv feeder red hot "
        },
        {
            "time": "07:36",
            "plant": "Purbasadipur 230/132/33kV S/S TR-4 HT",
            "load": "",
            "reason": "Purbasadipur 230/132/33kV S/S TR-4 HT Scheduled S/D Due to Uthrail 33kv feeder red hot "
        },
        {
            "time": "07:40",
            "plant": "Baroirhat 132/33kV S/S TR-1, 406T HT",
            "load": "",
            "reason": "Baroirhat 132/33kV S/S TR-1, 406T HT Scheduled S/D Due to Maintenance work "
        }
    ],
    "hourlyLoadData": [
        {
            "time": "00:00",
            "generation": 14548.3,
            "loadShed": 2529.0,
            "demand": 17191.3
        },
        {
            "time": "01:00",
            "generation": 14128.64,
            "loadShed": 2461.0,
            "demand": 16700.64
        },
        {
            "time": "02:00",
            "generation": 13941.78,
            "loadShed": 2296.0,
            "demand": 16340.78
        },
        {
            "time": "03:00",
            "generation": 13839.06,
            "loadShed": 2182.0,
            "demand": 16119.06
        },
        {
            "time": "04:00",
            "generation": 13773.64,
            "loadShed": 1910.0,
            "demand": 15769.64
        },
        {
            "time": "05:00",
            "generation": 13773.77,
            "loadShed": 1115.0,
            "demand": 14938.95
        },
        {
            "time": "06:00",
            "generation": 13478.64,
            "loadShed": 443.0,
            "demand": 13941.64
        },
        {
            "time": "07:00",
            "generation": 13753.59,
            "loadShed": 295.0,
            "demand": 14061.59
        },
        {
            "time": "08:00",
            "generation": 13820.09,
            "loadShed": 272.0,
            "demand": 14104.09
        },
        {
            "time": "09:00",
            "generation": 14049.82,
            "loadShed": 339.0,
            "demand": 14403.82
        },
        {
            "time": "10:00",
            "generation": 14215.82,
            "loadShed": 381.0,
            "demand": 14613.82
        },
        {
            "time": "11:00",
            "generation": 14350.49,
            "loadShed": 545.0,
            "demand": 14920.49
        },
        {
            "time": "12:00",
            "generation": 14441.07,
            "loadShed": 1107.0,
            "demand": 15598.07
        },
        {
            "time": "13:00",
            "generation": 14542.36,
            "loadShed": 1214.0,
            "demand": 15811.36
        },
        {
            "time": "14:00",
            "generation": 14315.95,
            "loadShed": 1540.0,
            "demand": 15924.95
        },
        {
            "time": "15:00",
            "generation": 14524.73,
            "loadShed": 0.0,
            "demand": 14524.73
        },
        {
            "time": "16:00",
            "generation": 14453.52,
            "loadShed": 1477.0,
            "demand": 15996.52
        },
        {
            "time": "17:00",
            "generation": 14197.74,
            "loadShed": 1486.0,
            "demand": 15750.74
        },
        {
            "time": "18:00",
            "generation": 14234.89,
            "loadShed": 698.0,
            "demand": 14963.89
        },
        {
            "time": "19:00",
            "generation": 15178.43,
            "loadShed": 1381.0,
            "demand": 16621.43
        },
        {
            "time": "19:30",
            "generation": 15177.96,
            "loadShed": 1725.0,
            "demand": 16980.96
        },
        {
            "time": "20:00",
            "generation": 15342.89,
            "loadShed": 1405.0,
            "demand": 16810.89
        },
        {
            "time": "21:00",
            "generation": 15700.01,
            "loadShed": 1785.0,
            "demand": 17565.01
        },
        {
            "time": "22:00",
            "generation": 15762.39,
            "loadShed": 1171.0,
            "demand": 16986.39
        },
        {
            "time": "23:00",
            "generation": 15615.83,
            "loadShed": 1549.0,
            "demand": 17234.83
        }
    ],
    "gasProductionData": [
        {
            "company": "BGFCL (Titas, Habiganj, Bakhrabad)",
            "fields": 5,
            "gas": 479.9,
            "condensate": 380.0,
            "share": 18.2
        },
        {
            "company": "SGFL (Sylhet, Rashidpur, Kailashtila)",
            "fields": 5,
            "gas": 139.9,
            "condensate": 636.8,
            "share": 5.3
        },
        {
            "company": "BAPEX (Shahbazpur, Srikail, Begumganj)",
            "fields": 9,
            "gas": 93.0,
            "condensate": 67.4,
            "share": 3.5
        },
        {
            "company": "Chevron (Bibiyana, Jalalabad, Moulavibazar)",
            "fields": 3,
            "gas": 895.7,
            "condensate": 4875.7,
            "share": 33.9
        },
        {
            "company": "Tullow (Bangora)",
            "fields": 1,
            "gas": 31.4,
            "condensate": 94.0,
            "share": 1.2
        },
        {
            "company": "RPGCL (R-LNG Import / LNG Terminal)",
            "fields": 0,
            "gas": 1002.9,
            "condensate": 0.0,
            "share": 37.9
        }
    ],
    "gasDistributionData": [
        {
            "company": "TGTDCL (Dhaka & Mymensingh)",
            "power": 271.5,
            "fertilizer": 73.1,
            "others": 1060.6,
            "total": 1405.3
        },
        {
            "company": "BGDCL (Cumilla & Sylhet)",
            "power": 192.7,
            "fertilizer": 0.0,
            "others": 87.8,
            "total": 280.4
        },
        {
            "company": "KGDCL (Chattogram)",
            "power": 37.6,
            "fertilizer": 38.3,
            "others": 168.3,
            "total": 244.3
        },
        {
            "company": "JGTDSL (Sylhet region)",
            "power": 218.7,
            "fertilizer": 40.1,
            "others": 111.7,
            "total": 370.5
        },
        {
            "company": "PGCL (Rajshahi & Rangpur)",
            "power": 124.4,
            "fertilizer": 0.0,
            "others": 29.5,
            "total": 153.8
        },
        {
            "company": "SGCL (Barishal & Khulna)",
            "power": 54.1,
            "fertilizer": 0.0,
            "others": 4.5,
            "total": 58.6
        }
    ]
}
};
