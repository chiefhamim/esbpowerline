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
    full_desc?: string;
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
,
  '25 Jun 2026': {
  "systemStats": {
    "date": "25 Jun 2026",
    "dayPeakGen": 14343.8,
    "eveningPeakGen": 16221.4,
    "dayPeakDemand": 14612.3,
    "eveningPeakDemand": 16782.4,
    "minGen": 13773.9,
    "maxGen": 15827.4,
    "totalEnergyGen": 355.827,
    "totalEnergyUnserved": 2.14,
    "totalEnergyDemand": 357.97,
    "maxTemp": 32.9,
    "totalGasSuppliedPower": 896.98,
    "avgProductionCost": 6.375,
    "totalDailyCost": 2304747900
  },
  "generationData": [
    {
      "name": "Gas",
      "gen": 126.51,
      "cost": 436459500,
      "unitCost": 3.45,
      "color": "#0ea5e9"
    },
    {
      "name": "Coal",
      "gen": 129.53,
      "cost": 857488600,
      "unitCost": 6.62,
      "color": "#64748b"
    },
    {
      "name": "HFO",
      "gen": 30.48,
      "cost": 550468800,
      "unitCost": 18.06,
      "color": "#f97316"
    },
    {
      "name": "Hydro",
      "gen": 2.21,
      "cost": 221000,
      "unitCost": 0.1,
      "color": "#06b6d4"
    },
    {
      "name": "Solar",
      "gen": 3.76,
      "cost": 59295200,
      "unitCost": 15.77,
      "color": "#eab308"
    },
    {
      "name": "Imports",
      "gen": 63.22,
      "cost": 400814800,
      "unitCost": 6.34,
      "color": "#a855f7"
    },
    {
      "name": "HSD (Diesel)",
      "gen": 0,
      "cost": 0,
      "unitCost": 0,
      "color": "#ef4444"
    }
  ],
  "borderImportsData": [
    {
      "source": "HVDC Bheramara (India)",
      "energy": 21.8,
      "peakFlow": 904.6,
      "type": "C/B Interconnector (West)"
    },
    {
      "source": "Adani Godda (India)",
      "energy": 36.65,
      "peakFlow": 1493.4,
      "type": "C/B Interconnector (North)"
    },
    {
      "source": "Tripura Cumilla (India)",
      "energy": 3.85,
      "peakFlow": 178.3,
      "type": "C/B Interconnector (East)"
    }
  ],
  "regionalDemandData": [],
  "dailyOutages": [
    {
      "time": "08:14 - 13:37",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Disk Insulator Change Work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled S/D from Kallyanpur 132/33kV end Due to Disk Insulator Change Work"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:59 - 18:23",
      "plant": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D Due to For project work"
    },
    {
      "time": "09:00 - 18:22",
      "plant": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end.",
      "full_desc": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end."
    },
    {
      "time": "09:17 - 18:39",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D Due to For project work"
    },
    {
      "time": "09:18 - 14:48",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33 DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D Due to T-1 33 DS maintenance."
    },
    {
      "time": "09:18 - 14:47",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33kv DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D Due to T-1 33kv DS maintenance."
    },
    {
      "time": "09:18 - 18:38",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D Due to For project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:40",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 HT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored."
    },
    {
      "time": "09:42",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 LT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored."
    },
    {
      "time": "10:14 - 18:42",
      "plant": "BIPTC S/S Baharampur-3 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Shutdown is taken from Baharampur end",
      "full_desc": "BIPTC S/S Baharampur-3 Scheduled S/D Due to Shutdown is taken from Baharampur end"
    },
    {
      "time": "10:25",
      "plant": "Baroirhat 132/33kV S/S TR-1, 406T HT",
      "load": "HT Outage",
      "reason": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored.",
      "full_desc": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored."
    },
    {
      "time": "10:39 - 13:52",
      "plant": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 LT Forced S/D"
    },
    {
      "time": "10:40 - 13:51",
      "plant": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 HT Forced S/D"
    },
    {
      "time": "11:00 - 12:36",
      "plant": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled",
      "load": "HT Outage",
      "reason": "due to high temperature.",
      "full_desc": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled S/D Due to Maintanance work due to high temperature."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored."
    },
    {
      "time": "12:00",
      "plant": "Day peak generation",
      "load": "14319 MW",
      "reason": "Day peak generation is 14319 MW.",
      "full_desc": "Day peak generation is 14319 MW."
    },
    {
      "time": "12:08 - 12:17",
      "plant": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays",
      "load": "HT Outage",
      "reason": "Due to 33kv feeder fault",
      "full_desc": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays Due to 33kv feeder fault"
    },
    {
      "time": "13:42 - 21:48",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to line work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled S/D from Kallyanpur 132/33kV end Due to line work"
    },
    {
      "time": "13:53 - 14:37",
      "plant": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "13:53 - 14:35",
      "plant": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "14:36",
      "plant": "Jhenaidah 230/132kV S/S 230 kV Bus",
      "load": "HT Outage",
      "reason": "Jhenaidah 230/132kV S/S 230 kV Bus is restored.",
      "full_desc": "Jhenaidah 230/132kV S/S 230 kV Bus is restored."
    },
    {
      "time": "15:07",
      "plant": "Patuakhali-Payra  132kV Ckt-1",
      "load": "HT Outage",
      "reason": "Patuakhali-Payra  132kV Ckt-1 is restored.",
      "full_desc": "Patuakhali-Payra  132kV Ckt-1 is restored."
    },
    {
      "time": "15:37 - 17:34",
      "plant": "Patuakhali-Payra  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to High Temperature Maintenance",
      "full_desc": "Patuakhali-Payra  132kV Ckt-2 Scheduled S/D from Payra 400/132/33kV end Due to High Temperature Maintenance"
    },
    {
      "time": "16:37 - 18:46",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "16:38 - 18:45",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "19:47 - 20:47",
      "plant": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "load": "50 MW",
      "reason": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "full_desc": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D"
    },
    {
      "time": "21:00",
      "plant": "Evening peak generation",
      "load": "16193 MW",
      "reason": "Evening peak generation is 16193 MW.",
      "full_desc": "Evening peak generation is 16193 MW."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays."
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "02:35",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST"
    },
    {
      "time": "03:18",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT"
    },
    {
      "time": "06:06",
      "plant": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to For PBS Maintenance Work",
      "full_desc": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D Due to For PBS Maintenance Work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler By pass, maintenance work",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D Due to PBS 33 KV side Bus coupler By pass, maintenance work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33 KV Side Buscoupler fault",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D Due to 33 KV Side Buscoupler fault"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33KV side Buscoupler fault , breaker bypass work purpose",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D Due to 33KV side Buscoupler fault , breaker bypass work purpose"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance"
    },
    {
      "time": "06:33",
      "plant": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work",
      "load": "HT Outage",
      "reason": "for T-3 Installation.",
      "full_desc": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work S/D Due to 132Kv Bus bar extension for T-3 Installation."
    },
    {
      "time": "06:58",
      "plant": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work",
      "load": "HT Outage",
      "reason": "Due to Project work at Barishal Patuakhali line",
      "full_desc": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work S/D from Barguna 132/33kV end Due to Project work at Barishal Patuakhali line"
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-2 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-2 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-1 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-1 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:59",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:01",
      "plant": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Loop connection at Barishal and  Loop disconnect at BakergonJ",
      "full_desc": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled S/D from Patuakhali 132/33kV end Due to Loop connection at Barishal and  Loop disconnect at BakergonJ"
    },
    {
      "time": "07:02",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:08",
      "plant": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement",
      "full_desc": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled S/D from Bogura 132/33kV end Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement"
    },
    {
      "time": "07:16",
      "plant": "Bogura(New)-Naogaon 132 kV Ckt-1",
      "load": "HT Outage",
      "reason": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored.",
      "full_desc": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored."
    }
  ],
  "hourlyLoadData": [
    {
      "time": "00:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "01:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "02:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "03:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "04:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "05:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "06:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "07:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "08:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "09:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "10:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "11:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "12:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "13:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "14:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "15:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "16:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "17:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    },
    {
      "time": "18:00",
      "generation": 16221,
      "loadShed": 0,
      "demand": 16221
    },
    {
      "time": "19:00",
      "generation": 16221,
      "loadShed": 0,
      "demand": 16221
    },
    {
      "time": "20:00",
      "generation": 16221,
      "loadShed": 0,
      "demand": 16221
    },
    {
      "time": "21:00",
      "generation": 16221,
      "loadShed": 0,
      "demand": 16221
    },
    {
      "time": "22:00",
      "generation": 16221,
      "loadShed": 0,
      "demand": 16221
    },
    {
      "time": "23:00",
      "generation": 14344,
      "loadShed": 0,
      "demand": 14344
    }
  ],
  "gasProductionData": [
    {
      "company": "BGFCL (Titas, Habiganj, Bakhrabad)",
      "fields": 5,
      "gas": 481.4,
      "condensate": 372.8,
      "share": 18.4
    },
    {
      "company": "SGFL (Sylhet, Rashidpur, Kailashtila)",
      "fields": 5,
      "gas": 93.5,
      "condensate": 362.6,
      "share": 3.6
    },
    {
      "company": "BAPEX (Shahbazpur, Srikail, Begumganj)",
      "fields": 9,
      "gas": 94.2,
      "condensate": 69.6,
      "share": 3.6
    },
    {
      "company": "Chevron (Bibiyana, Jalalabad, Moulavibazar)",
      "fields": 3,
      "gas": 902.8,
      "condensate": 4813.5,
      "share": 34.5
    },
    {
      "company": "Tullow (Bangora)",
      "fields": 1,
      "gas": 31.7,
      "condensate": 93.8,
      "share": 1.2
    },
    {
      "company": "RPGCL (R-LNG Import / LNG Terminal)",
      "fields": 0,
      "gas": 1010.5,
      "condensate": 0,
      "share": 38.7
    }
  ],
  "gasDistributionData": [
    {
      "company": "TGTDCL (Dhaka & Mymensingh)",
      "power": 272.5,
      "fertilizer": 73.6,
      "others": 1062.5,
      "total": 1408.6
    },
    {
      "company": "BGDCL (Cumilla & Sylhet)",
      "power": 208.8,
      "fertilizer": 0,
      "others": 89,
      "total": 297.8
    },
    {
      "company": "KGDCL (Chattogram)",
      "power": 36.9,
      "fertilizer": 38.6,
      "others": 172.3,
      "total": 247.8
    },
    {
      "company": "JGTDSL (Sylhet region)",
      "power": 222.8,
      "fertilizer": 40.4,
      "others": 114,
      "total": 377.2
    },
    {
      "company": "PGCL (Rajshahi & Rangpur)",
      "power": 128.9,
      "fertilizer": 0,
      "others": 29.7,
      "total": 158.6
    },
    {
      "company": "SGCL (Barishal & Khulna)",
      "power": 54.6,
      "fertilizer": 0,
      "others": 4.6,
      "total": 59.2
    }
  ]
},
  '26 Jun 2026': {
  "systemStats": {
    "date": "26 Jun 2026",
    "dayPeakGen": 14327,
    "eveningPeakGen": 16202.3,
    "dayPeakDemand": 14595.1,
    "eveningPeakDemand": 16762.6,
    "minGen": 13757.7,
    "maxGen": 15808.8,
    "totalEnergyGen": 355.409,
    "totalEnergyUnserved": 2.14,
    "totalEnergyDemand": 357.55,
    "maxTemp": 32.4,
    "totalGasSuppliedPower": 895.93,
    "avgProductionCost": 6.412,
    "totalDailyCost": 2302094100
  },
  "generationData": [
    {
      "name": "Gas",
      "gen": 126.36,
      "cost": 435942000,
      "unitCost": 3.45,
      "color": "#0ea5e9"
    },
    {
      "name": "Coal",
      "gen": 129.38,
      "cost": 856495600,
      "unitCost": 6.62,
      "color": "#64748b"
    },
    {
      "name": "HFO",
      "gen": 30.45,
      "cost": 549927000,
      "unitCost": 18.06,
      "color": "#f97316"
    },
    {
      "name": "Hydro",
      "gen": 2.21,
      "cost": 221000,
      "unitCost": 0.1,
      "color": "#06b6d4"
    },
    {
      "name": "Solar",
      "gen": 3.75,
      "cost": 59137500,
      "unitCost": 15.77,
      "color": "#eab308"
    },
    {
      "name": "Imports",
      "gen": 63.15,
      "cost": 400371000,
      "unitCost": 6.34,
      "color": "#a855f7"
    },
    {
      "name": "HSD (Diesel)",
      "gen": 0,
      "cost": 0,
      "unitCost": 0,
      "color": "#ef4444"
    }
  ],
  "borderImportsData": [
    {
      "source": "HVDC Bheramara (India)",
      "energy": 21.77,
      "peakFlow": 903.5,
      "type": "C/B Interconnector (West)"
    },
    {
      "source": "Adani Godda (India)",
      "energy": 36.61,
      "peakFlow": 1491.6,
      "type": "C/B Interconnector (North)"
    },
    {
      "source": "Tripura Cumilla (India)",
      "energy": 3.84,
      "peakFlow": 178.1,
      "type": "C/B Interconnector (East)"
    }
  ],
  "regionalDemandData": [],
  "dailyOutages": [
    {
      "time": "08:14 - 13:37",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Disk Insulator Change Work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled S/D from Kallyanpur 132/33kV end Due to Disk Insulator Change Work"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:59 - 18:23",
      "plant": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D Due to For project work"
    },
    {
      "time": "09:00 - 18:22",
      "plant": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end.",
      "full_desc": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end."
    },
    {
      "time": "09:17 - 18:39",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D Due to For project work"
    },
    {
      "time": "09:18 - 14:48",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33 DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D Due to T-1 33 DS maintenance."
    },
    {
      "time": "09:18 - 14:47",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33kv DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D Due to T-1 33kv DS maintenance."
    },
    {
      "time": "09:18 - 18:38",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D Due to For project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:40",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 HT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored."
    },
    {
      "time": "09:42",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 LT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored."
    },
    {
      "time": "10:14 - 18:42",
      "plant": "BIPTC S/S Baharampur-3 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Shutdown is taken from Baharampur end",
      "full_desc": "BIPTC S/S Baharampur-3 Scheduled S/D Due to Shutdown is taken from Baharampur end"
    },
    {
      "time": "10:25",
      "plant": "Baroirhat 132/33kV S/S TR-1, 406T HT",
      "load": "HT Outage",
      "reason": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored.",
      "full_desc": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored."
    },
    {
      "time": "10:39 - 13:52",
      "plant": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 LT Forced S/D"
    },
    {
      "time": "10:40 - 13:51",
      "plant": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 HT Forced S/D"
    },
    {
      "time": "11:00 - 12:36",
      "plant": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled",
      "load": "HT Outage",
      "reason": "due to high temperature.",
      "full_desc": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled S/D Due to Maintanance work due to high temperature."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored."
    },
    {
      "time": "12:00",
      "plant": "Day peak generation",
      "load": "14319 MW",
      "reason": "Day peak generation is 14319 MW.",
      "full_desc": "Day peak generation is 14319 MW."
    },
    {
      "time": "12:08 - 12:17",
      "plant": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays",
      "load": "HT Outage",
      "reason": "Due to 33kv feeder fault",
      "full_desc": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays Due to 33kv feeder fault"
    },
    {
      "time": "13:42 - 21:48",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to line work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled S/D from Kallyanpur 132/33kV end Due to line work"
    },
    {
      "time": "13:53 - 14:37",
      "plant": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "13:53 - 14:35",
      "plant": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "14:36",
      "plant": "Jhenaidah 230/132kV S/S 230 kV Bus",
      "load": "HT Outage",
      "reason": "Jhenaidah 230/132kV S/S 230 kV Bus is restored.",
      "full_desc": "Jhenaidah 230/132kV S/S 230 kV Bus is restored."
    },
    {
      "time": "15:07",
      "plant": "Patuakhali-Payra  132kV Ckt-1",
      "load": "HT Outage",
      "reason": "Patuakhali-Payra  132kV Ckt-1 is restored.",
      "full_desc": "Patuakhali-Payra  132kV Ckt-1 is restored."
    },
    {
      "time": "15:37 - 17:34",
      "plant": "Patuakhali-Payra  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to High Temperature Maintenance",
      "full_desc": "Patuakhali-Payra  132kV Ckt-2 Scheduled S/D from Payra 400/132/33kV end Due to High Temperature Maintenance"
    },
    {
      "time": "16:37 - 18:46",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "16:38 - 18:45",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "19:47 - 20:47",
      "plant": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "load": "50 MW",
      "reason": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "full_desc": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D"
    },
    {
      "time": "21:00",
      "plant": "Evening peak generation",
      "load": "16193 MW",
      "reason": "Evening peak generation is 16193 MW.",
      "full_desc": "Evening peak generation is 16193 MW."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays."
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "02:35",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST"
    },
    {
      "time": "03:18",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT"
    },
    {
      "time": "06:06",
      "plant": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to For PBS Maintenance Work",
      "full_desc": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D Due to For PBS Maintenance Work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler By pass, maintenance work",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D Due to PBS 33 KV side Bus coupler By pass, maintenance work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33 KV Side Buscoupler fault",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D Due to 33 KV Side Buscoupler fault"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33KV side Buscoupler fault , breaker bypass work purpose",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D Due to 33KV side Buscoupler fault , breaker bypass work purpose"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance"
    },
    {
      "time": "06:33",
      "plant": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work",
      "load": "HT Outage",
      "reason": "for T-3 Installation.",
      "full_desc": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work S/D Due to 132Kv Bus bar extension for T-3 Installation."
    },
    {
      "time": "06:58",
      "plant": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work",
      "load": "HT Outage",
      "reason": "Due to Project work at Barishal Patuakhali line",
      "full_desc": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work S/D from Barguna 132/33kV end Due to Project work at Barishal Patuakhali line"
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-2 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-2 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-1 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-1 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:59",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:01",
      "plant": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Loop connection at Barishal and  Loop disconnect at BakergonJ",
      "full_desc": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled S/D from Patuakhali 132/33kV end Due to Loop connection at Barishal and  Loop disconnect at BakergonJ"
    },
    {
      "time": "07:02",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:08",
      "plant": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement",
      "full_desc": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled S/D from Bogura 132/33kV end Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement"
    },
    {
      "time": "07:16",
      "plant": "Bogura(New)-Naogaon 132 kV Ckt-1",
      "load": "HT Outage",
      "reason": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored.",
      "full_desc": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored."
    }
  ],
  "hourlyLoadData": [
    {
      "time": "00:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "01:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "02:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "03:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "04:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "05:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "06:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "07:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "08:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "09:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "10:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "11:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "12:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "13:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "14:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "15:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "16:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "17:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    },
    {
      "time": "18:00",
      "generation": 16202,
      "loadShed": 0,
      "demand": 16202
    },
    {
      "time": "19:00",
      "generation": 16202,
      "loadShed": 0,
      "demand": 16202
    },
    {
      "time": "20:00",
      "generation": 16202,
      "loadShed": 0,
      "demand": 16202
    },
    {
      "time": "21:00",
      "generation": 16202,
      "loadShed": 0,
      "demand": 16202
    },
    {
      "time": "22:00",
      "generation": 16202,
      "loadShed": 0,
      "demand": 16202
    },
    {
      "time": "23:00",
      "generation": 14327,
      "loadShed": 0,
      "demand": 14327
    }
  ],
  "gasProductionData": [
    {
      "company": "BGFCL (Titas, Habiganj, Bakhrabad)",
      "fields": 5,
      "gas": 480.9,
      "condensate": 372.4,
      "share": 18.4
    },
    {
      "company": "SGFL (Sylhet, Rashidpur, Kailashtila)",
      "fields": 5,
      "gas": 93.4,
      "condensate": 362.2,
      "share": 3.6
    },
    {
      "company": "BAPEX (Shahbazpur, Srikail, Begumganj)",
      "fields": 9,
      "gas": 94.1,
      "condensate": 69.5,
      "share": 3.6
    },
    {
      "company": "Chevron (Bibiyana, Jalalabad, Moulavibazar)",
      "fields": 3,
      "gas": 901.7,
      "condensate": 4807.9,
      "share": 34.5
    },
    {
      "company": "Tullow (Bangora)",
      "fields": 1,
      "gas": 31.6,
      "condensate": 93.7,
      "share": 1.2
    },
    {
      "company": "RPGCL (R-LNG Import / LNG Terminal)",
      "fields": 0,
      "gas": 1009.3,
      "condensate": 0,
      "share": 38.7
    }
  ],
  "gasDistributionData": [
    {
      "company": "TGTDCL (Dhaka & Mymensingh)",
      "power": 272.2,
      "fertilizer": 73.5,
      "others": 1061.3,
      "total": 1407
    },
    {
      "company": "BGDCL (Cumilla & Sylhet)",
      "power": 208.5,
      "fertilizer": 0,
      "others": 88.8,
      "total": 297.3
    },
    {
      "company": "KGDCL (Chattogram)",
      "power": 36.8,
      "fertilizer": 38.5,
      "others": 172.1,
      "total": 247.4
    },
    {
      "company": "JGTDSL (Sylhet region)",
      "power": 222.5,
      "fertilizer": 40.3,
      "others": 113.9,
      "total": 376.7
    },
    {
      "company": "PGCL (Rajshahi & Rangpur)",
      "power": 128.8,
      "fertilizer": 0,
      "others": 29.6,
      "total": 158.4
    },
    {
      "company": "SGCL (Barishal & Khulna)",
      "power": 54.5,
      "fertilizer": 0,
      "others": 4.6,
      "total": 59.1
    }
  ]
},
  '27 Jun 2026': {
  "systemStats": {
    "date": "27 Jun 2026",
    "dayPeakGen": 14045.9,
    "eveningPeakGen": 15884.5,
    "dayPeakDemand": 14308.8,
    "eveningPeakDemand": 16433.8,
    "minGen": 13487.8,
    "maxGen": 15498.7,
    "totalEnergyGen": 348.437,
    "totalEnergyUnserved": 2.1,
    "totalEnergyDemand": 350.54,
    "maxTemp": 33,
    "totalGasSuppliedPower": 878.35,
    "avgProductionCost": 6.386,
    "totalDailyCost": 2256917800
  },
  "generationData": [
    {
      "name": "Gas",
      "gen": 123.88,
      "cost": 427386000,
      "unitCost": 3.45,
      "color": "#0ea5e9"
    },
    {
      "name": "Coal",
      "gen": 126.84,
      "cost": 839680800,
      "unitCost": 6.62,
      "color": "#64748b"
    },
    {
      "name": "HFO",
      "gen": 29.85,
      "cost": 539091000,
      "unitCost": 18.06,
      "color": "#f97316"
    },
    {
      "name": "Hydro",
      "gen": 2.17,
      "cost": 217000,
      "unitCost": 0.1,
      "color": "#06b6d4"
    },
    {
      "name": "Solar",
      "gen": 3.68,
      "cost": 58033600,
      "unitCost": 15.77,
      "color": "#eab308"
    },
    {
      "name": "Imports",
      "gen": 61.91,
      "cost": 392509400,
      "unitCost": 6.34,
      "color": "#a855f7"
    },
    {
      "name": "HSD (Diesel)",
      "gen": 0,
      "cost": 0,
      "unitCost": 0,
      "color": "#ef4444"
    }
  ],
  "borderImportsData": [
    {
      "source": "HVDC Bheramara (India)",
      "energy": 21.35,
      "peakFlow": 885.8,
      "type": "C/B Interconnector (West)"
    },
    {
      "source": "Adani Godda (India)",
      "energy": 35.89,
      "peakFlow": 1462.3,
      "type": "C/B Interconnector (North)"
    },
    {
      "source": "Tripura Cumilla (India)",
      "energy": 3.77,
      "peakFlow": 174.6,
      "type": "C/B Interconnector (East)"
    }
  ],
  "regionalDemandData": [],
  "dailyOutages": [
    {
      "time": "08:14 - 13:37",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Disk Insulator Change Work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled S/D from Kallyanpur 132/33kV end Due to Disk Insulator Change Work"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:59 - 18:23",
      "plant": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D Due to For project work"
    },
    {
      "time": "09:00 - 18:22",
      "plant": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end.",
      "full_desc": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end."
    },
    {
      "time": "09:17 - 18:39",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D Due to For project work"
    },
    {
      "time": "09:18 - 14:48",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33 DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D Due to T-1 33 DS maintenance."
    },
    {
      "time": "09:18 - 14:47",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33kv DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D Due to T-1 33kv DS maintenance."
    },
    {
      "time": "09:18 - 18:38",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D Due to For project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:40",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 HT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored."
    },
    {
      "time": "09:42",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 LT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored."
    },
    {
      "time": "10:14 - 18:42",
      "plant": "BIPTC S/S Baharampur-3 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Shutdown is taken from Baharampur end",
      "full_desc": "BIPTC S/S Baharampur-3 Scheduled S/D Due to Shutdown is taken from Baharampur end"
    },
    {
      "time": "10:25",
      "plant": "Baroirhat 132/33kV S/S TR-1, 406T HT",
      "load": "HT Outage",
      "reason": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored.",
      "full_desc": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored."
    },
    {
      "time": "10:39 - 13:52",
      "plant": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 LT Forced S/D"
    },
    {
      "time": "10:40 - 13:51",
      "plant": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 HT Forced S/D"
    },
    {
      "time": "11:00 - 12:36",
      "plant": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled",
      "load": "HT Outage",
      "reason": "due to high temperature.",
      "full_desc": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled S/D Due to Maintanance work due to high temperature."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored."
    },
    {
      "time": "12:00",
      "plant": "Day peak generation",
      "load": "14319 MW",
      "reason": "Day peak generation is 14319 MW.",
      "full_desc": "Day peak generation is 14319 MW."
    },
    {
      "time": "12:08 - 12:17",
      "plant": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays",
      "load": "HT Outage",
      "reason": "Due to 33kv feeder fault",
      "full_desc": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays Due to 33kv feeder fault"
    },
    {
      "time": "13:42 - 21:48",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to line work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled S/D from Kallyanpur 132/33kV end Due to line work"
    },
    {
      "time": "13:53 - 14:37",
      "plant": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "13:53 - 14:35",
      "plant": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "14:36",
      "plant": "Jhenaidah 230/132kV S/S 230 kV Bus",
      "load": "HT Outage",
      "reason": "Jhenaidah 230/132kV S/S 230 kV Bus is restored.",
      "full_desc": "Jhenaidah 230/132kV S/S 230 kV Bus is restored."
    },
    {
      "time": "15:07",
      "plant": "Patuakhali-Payra  132kV Ckt-1",
      "load": "HT Outage",
      "reason": "Patuakhali-Payra  132kV Ckt-1 is restored.",
      "full_desc": "Patuakhali-Payra  132kV Ckt-1 is restored."
    },
    {
      "time": "15:37 - 17:34",
      "plant": "Patuakhali-Payra  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to High Temperature Maintenance",
      "full_desc": "Patuakhali-Payra  132kV Ckt-2 Scheduled S/D from Payra 400/132/33kV end Due to High Temperature Maintenance"
    },
    {
      "time": "16:37 - 18:46",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "16:38 - 18:45",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "19:47 - 20:47",
      "plant": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "load": "50 MW",
      "reason": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "full_desc": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D"
    },
    {
      "time": "21:00",
      "plant": "Evening peak generation",
      "load": "16193 MW",
      "reason": "Evening peak generation is 16193 MW.",
      "full_desc": "Evening peak generation is 16193 MW."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays."
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "02:35",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST"
    },
    {
      "time": "03:18",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT"
    },
    {
      "time": "06:06",
      "plant": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to For PBS Maintenance Work",
      "full_desc": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D Due to For PBS Maintenance Work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler By pass, maintenance work",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D Due to PBS 33 KV side Bus coupler By pass, maintenance work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33 KV Side Buscoupler fault",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D Due to 33 KV Side Buscoupler fault"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33KV side Buscoupler fault , breaker bypass work purpose",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D Due to 33KV side Buscoupler fault , breaker bypass work purpose"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance"
    },
    {
      "time": "06:33",
      "plant": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work",
      "load": "HT Outage",
      "reason": "for T-3 Installation.",
      "full_desc": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work S/D Due to 132Kv Bus bar extension for T-3 Installation."
    },
    {
      "time": "06:58",
      "plant": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work",
      "load": "HT Outage",
      "reason": "Due to Project work at Barishal Patuakhali line",
      "full_desc": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work S/D from Barguna 132/33kV end Due to Project work at Barishal Patuakhali line"
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-2 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-2 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-1 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-1 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:59",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:01",
      "plant": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Loop connection at Barishal and  Loop disconnect at BakergonJ",
      "full_desc": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled S/D from Patuakhali 132/33kV end Due to Loop connection at Barishal and  Loop disconnect at BakergonJ"
    },
    {
      "time": "07:02",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:08",
      "plant": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement",
      "full_desc": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled S/D from Bogura 132/33kV end Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement"
    },
    {
      "time": "07:16",
      "plant": "Bogura(New)-Naogaon 132 kV Ckt-1",
      "load": "HT Outage",
      "reason": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored.",
      "full_desc": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored."
    }
  ],
  "hourlyLoadData": [
    {
      "time": "00:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "01:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "02:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "03:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "04:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "05:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "06:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "07:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "08:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "09:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "10:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "11:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "12:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "13:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "14:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "15:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "16:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "17:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    },
    {
      "time": "18:00",
      "generation": 15884,
      "loadShed": 0,
      "demand": 15884
    },
    {
      "time": "19:00",
      "generation": 15884,
      "loadShed": 0,
      "demand": 15884
    },
    {
      "time": "20:00",
      "generation": 15884,
      "loadShed": 0,
      "demand": 15884
    },
    {
      "time": "21:00",
      "generation": 15884,
      "loadShed": 0,
      "demand": 15884
    },
    {
      "time": "22:00",
      "generation": 15884,
      "loadShed": 0,
      "demand": 15884
    },
    {
      "time": "23:00",
      "generation": 14046,
      "loadShed": 0,
      "demand": 14046
    }
  ],
  "gasProductionData": [
    {
      "company": "BGFCL (Titas, Habiganj, Bakhrabad)",
      "fields": 5,
      "gas": 471.4,
      "condensate": 365.1,
      "share": 18.4
    },
    {
      "company": "SGFL (Sylhet, Rashidpur, Kailashtila)",
      "fields": 5,
      "gas": 91.5,
      "condensate": 355.1,
      "share": 3.6
    },
    {
      "company": "BAPEX (Shahbazpur, Srikail, Begumganj)",
      "fields": 9,
      "gas": 92.2,
      "condensate": 68.2,
      "share": 3.6
    },
    {
      "company": "Chevron (Bibiyana, Jalalabad, Moulavibazar)",
      "fields": 3,
      "gas": 884,
      "condensate": 4713.6,
      "share": 34.5
    },
    {
      "company": "Tullow (Bangora)",
      "fields": 1,
      "gas": 31,
      "condensate": 91.8,
      "share": 1.2
    },
    {
      "company": "RPGCL (R-LNG Import / LNG Terminal)",
      "fields": 0,
      "gas": 989.5,
      "condensate": 0,
      "share": 38.7
    }
  ],
  "gasDistributionData": [
    {
      "company": "TGTDCL (Dhaka & Mymensingh)",
      "power": 266.8,
      "fertilizer": 72.1,
      "others": 1040.5,
      "total": 1379.4
    },
    {
      "company": "BGDCL (Cumilla & Sylhet)",
      "power": 204.4,
      "fertilizer": 0,
      "others": 87.1,
      "total": 291.5
    },
    {
      "company": "KGDCL (Chattogram)",
      "power": 36.1,
      "fertilizer": 37.8,
      "others": 168.7,
      "total": 242.6
    },
    {
      "company": "JGTDSL (Sylhet region)",
      "power": 218.2,
      "fertilizer": 39.5,
      "others": 111.6,
      "total": 369.3
    },
    {
      "company": "PGCL (Rajshahi & Rangpur)",
      "power": 126.2,
      "fertilizer": 0,
      "others": 29,
      "total": 155.2
    },
    {
      "company": "SGCL (Barishal & Khulna)",
      "power": 53.5,
      "fertilizer": 0,
      "others": 4.5,
      "total": 58
    }
  ]
},
  '28 Jun 2026': {
  "systemStats": {
    "date": "28 Jun 2026",
    "dayPeakGen": 14327.6,
    "eveningPeakGen": 16203,
    "dayPeakDemand": 14595.8,
    "eveningPeakDemand": 16763.4,
    "minGen": 13758.3,
    "maxGen": 15809.5,
    "totalEnergyGen": 355.425,
    "totalEnergyUnserved": 2.14,
    "totalEnergyDemand": 357.57,
    "maxTemp": 33.5,
    "totalGasSuppliedPower": 895.97,
    "avgProductionCost": 6.476,
    "totalDailyCost": 2302194800
  },
  "generationData": [
    {
      "name": "Gas",
      "gen": 126.37,
      "cost": 435976500,
      "unitCost": 3.45,
      "color": "#0ea5e9"
    },
    {
      "name": "Coal",
      "gen": 129.39,
      "cost": 856561800,
      "unitCost": 6.62,
      "color": "#64748b"
    },
    {
      "name": "HFO",
      "gen": 30.45,
      "cost": 549927000,
      "unitCost": 18.06,
      "color": "#f97316"
    },
    {
      "name": "Hydro",
      "gen": 2.21,
      "cost": 221000,
      "unitCost": 0.1,
      "color": "#06b6d4"
    },
    {
      "name": "Solar",
      "gen": 3.75,
      "cost": 59137500,
      "unitCost": 15.77,
      "color": "#eab308"
    },
    {
      "name": "Imports",
      "gen": 63.15,
      "cost": 400371000,
      "unitCost": 6.34,
      "color": "#a855f7"
    },
    {
      "name": "HSD (Diesel)",
      "gen": 0,
      "cost": 0,
      "unitCost": 0,
      "color": "#ef4444"
    }
  ],
  "borderImportsData": [
    {
      "source": "HVDC Bheramara (India)",
      "energy": 21.77,
      "peakFlow": 903.5,
      "type": "C/B Interconnector (West)"
    },
    {
      "source": "Adani Godda (India)",
      "energy": 36.61,
      "peakFlow": 1491.7,
      "type": "C/B Interconnector (North)"
    },
    {
      "source": "Tripura Cumilla (India)",
      "energy": 3.84,
      "peakFlow": 178.1,
      "type": "C/B Interconnector (East)"
    }
  ],
  "regionalDemandData": [],
  "dailyOutages": [
    {
      "time": "08:14 - 13:37",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Disk Insulator Change Work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled S/D from Kallyanpur 132/33kV end Due to Disk Insulator Change Work"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:59 - 18:23",
      "plant": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D Due to For project work"
    },
    {
      "time": "09:00 - 18:22",
      "plant": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end.",
      "full_desc": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end."
    },
    {
      "time": "09:17 - 18:39",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D Due to For project work"
    },
    {
      "time": "09:18 - 14:48",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33 DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D Due to T-1 33 DS maintenance."
    },
    {
      "time": "09:18 - 14:47",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33kv DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D Due to T-1 33kv DS maintenance."
    },
    {
      "time": "09:18 - 18:38",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D Due to For project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:40",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 HT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored."
    },
    {
      "time": "09:42",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 LT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored."
    },
    {
      "time": "10:14 - 18:42",
      "plant": "BIPTC S/S Baharampur-3 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Shutdown is taken from Baharampur end",
      "full_desc": "BIPTC S/S Baharampur-3 Scheduled S/D Due to Shutdown is taken from Baharampur end"
    },
    {
      "time": "10:25",
      "plant": "Baroirhat 132/33kV S/S TR-1, 406T HT",
      "load": "HT Outage",
      "reason": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored.",
      "full_desc": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored."
    },
    {
      "time": "10:39 - 13:52",
      "plant": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 LT Forced S/D"
    },
    {
      "time": "10:40 - 13:51",
      "plant": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 HT Forced S/D"
    },
    {
      "time": "11:00 - 12:36",
      "plant": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled",
      "load": "HT Outage",
      "reason": "due to high temperature.",
      "full_desc": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled S/D Due to Maintanance work due to high temperature."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored."
    },
    {
      "time": "12:00",
      "plant": "Day peak generation",
      "load": "14319 MW",
      "reason": "Day peak generation is 14319 MW.",
      "full_desc": "Day peak generation is 14319 MW."
    },
    {
      "time": "12:08 - 12:17",
      "plant": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays",
      "load": "HT Outage",
      "reason": "Due to 33kv feeder fault",
      "full_desc": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays Due to 33kv feeder fault"
    },
    {
      "time": "13:42 - 21:48",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to line work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled S/D from Kallyanpur 132/33kV end Due to line work"
    },
    {
      "time": "13:53 - 14:37",
      "plant": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "13:53 - 14:35",
      "plant": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "14:36",
      "plant": "Jhenaidah 230/132kV S/S 230 kV Bus",
      "load": "HT Outage",
      "reason": "Jhenaidah 230/132kV S/S 230 kV Bus is restored.",
      "full_desc": "Jhenaidah 230/132kV S/S 230 kV Bus is restored."
    },
    {
      "time": "15:07",
      "plant": "Patuakhali-Payra  132kV Ckt-1",
      "load": "HT Outage",
      "reason": "Patuakhali-Payra  132kV Ckt-1 is restored.",
      "full_desc": "Patuakhali-Payra  132kV Ckt-1 is restored."
    },
    {
      "time": "15:37 - 17:34",
      "plant": "Patuakhali-Payra  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to High Temperature Maintenance",
      "full_desc": "Patuakhali-Payra  132kV Ckt-2 Scheduled S/D from Payra 400/132/33kV end Due to High Temperature Maintenance"
    },
    {
      "time": "16:37 - 18:46",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "16:38 - 18:45",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "19:47 - 20:47",
      "plant": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "load": "50 MW",
      "reason": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "full_desc": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D"
    },
    {
      "time": "21:00",
      "plant": "Evening peak generation",
      "load": "16193 MW",
      "reason": "Evening peak generation is 16193 MW.",
      "full_desc": "Evening peak generation is 16193 MW."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays."
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "02:35",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST"
    },
    {
      "time": "03:18",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT"
    },
    {
      "time": "06:06",
      "plant": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to For PBS Maintenance Work",
      "full_desc": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D Due to For PBS Maintenance Work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler By pass, maintenance work",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D Due to PBS 33 KV side Bus coupler By pass, maintenance work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33 KV Side Buscoupler fault",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D Due to 33 KV Side Buscoupler fault"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33KV side Buscoupler fault , breaker bypass work purpose",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D Due to 33KV side Buscoupler fault , breaker bypass work purpose"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance"
    },
    {
      "time": "06:33",
      "plant": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work",
      "load": "HT Outage",
      "reason": "for T-3 Installation.",
      "full_desc": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work S/D Due to 132Kv Bus bar extension for T-3 Installation."
    },
    {
      "time": "06:58",
      "plant": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work",
      "load": "HT Outage",
      "reason": "Due to Project work at Barishal Patuakhali line",
      "full_desc": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work S/D from Barguna 132/33kV end Due to Project work at Barishal Patuakhali line"
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-2 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-2 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-1 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-1 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:59",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:01",
      "plant": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Loop connection at Barishal and  Loop disconnect at BakergonJ",
      "full_desc": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled S/D from Patuakhali 132/33kV end Due to Loop connection at Barishal and  Loop disconnect at BakergonJ"
    },
    {
      "time": "07:02",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:08",
      "plant": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement",
      "full_desc": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled S/D from Bogura 132/33kV end Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement"
    },
    {
      "time": "07:16",
      "plant": "Bogura(New)-Naogaon 132 kV Ckt-1",
      "load": "HT Outage",
      "reason": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored.",
      "full_desc": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored."
    }
  ],
  "hourlyLoadData": [
    {
      "time": "00:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "01:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "02:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "03:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "04:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "05:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "06:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "07:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "08:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "09:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "10:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "11:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "12:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "13:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "14:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "15:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "16:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "17:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    },
    {
      "time": "18:00",
      "generation": 16203,
      "loadShed": 0,
      "demand": 16203
    },
    {
      "time": "19:00",
      "generation": 16203,
      "loadShed": 0,
      "demand": 16203
    },
    {
      "time": "20:00",
      "generation": 16203,
      "loadShed": 0,
      "demand": 16203
    },
    {
      "time": "21:00",
      "generation": 16203,
      "loadShed": 0,
      "demand": 16203
    },
    {
      "time": "22:00",
      "generation": 16203,
      "loadShed": 0,
      "demand": 16203
    },
    {
      "time": "23:00",
      "generation": 14328,
      "loadShed": 0,
      "demand": 14328
    }
  ],
  "gasProductionData": [
    {
      "company": "BGFCL (Titas, Habiganj, Bakhrabad)",
      "fields": 5,
      "gas": 480.9,
      "condensate": 372.4,
      "share": 18.4
    },
    {
      "company": "SGFL (Sylhet, Rashidpur, Kailashtila)",
      "fields": 5,
      "gas": 93.4,
      "condensate": 362.2,
      "share": 3.6
    },
    {
      "company": "BAPEX (Shahbazpur, Srikail, Begumganj)",
      "fields": 9,
      "gas": 94.1,
      "condensate": 69.5,
      "share": 3.6
    },
    {
      "company": "Chevron (Bibiyana, Jalalabad, Moulavibazar)",
      "fields": 3,
      "gas": 901.7,
      "condensate": 4808.1,
      "share": 34.5
    },
    {
      "company": "Tullow (Bangora)",
      "fields": 1,
      "gas": 31.6,
      "condensate": 93.7,
      "share": 1.2
    },
    {
      "company": "RPGCL (R-LNG Import / LNG Terminal)",
      "fields": 0,
      "gas": 1009.3,
      "condensate": 0,
      "share": 38.7
    }
  ],
  "gasDistributionData": [
    {
      "company": "TGTDCL (Dhaka & Mymensingh)",
      "power": 272.2,
      "fertilizer": 73.5,
      "others": 1061.3,
      "total": 1407
    },
    {
      "company": "BGDCL (Cumilla & Sylhet)",
      "power": 208.5,
      "fertilizer": 0,
      "others": 88.9,
      "total": 297.4
    },
    {
      "company": "KGDCL (Chattogram)",
      "power": 36.8,
      "fertilizer": 38.5,
      "others": 172.1,
      "total": 247.4
    },
    {
      "company": "JGTDSL (Sylhet region)",
      "power": 222.5,
      "fertilizer": 40.3,
      "others": 113.9,
      "total": 376.7
    },
    {
      "company": "PGCL (Rajshahi & Rangpur)",
      "power": 128.8,
      "fertilizer": 0,
      "others": 29.6,
      "total": 158.4
    },
    {
      "company": "SGCL (Barishal & Khulna)",
      "power": 54.5,
      "fertilizer": 0,
      "others": 4.6,
      "total": 59.1
    }
  ]
},
  '29 Jun 2026': {
  "systemStats": {
    "date": "29 Jun 2026",
    "dayPeakGen": 14308,
    "eveningPeakGen": 16180.9,
    "dayPeakDemand": 14575.8,
    "eveningPeakDemand": 16740.5,
    "minGen": 13739.5,
    "maxGen": 15788,
    "totalEnergyGen": 354.94,
    "totalEnergyUnserved": 2.14,
    "totalEnergyDemand": 357.08,
    "maxTemp": 32.2,
    "totalGasSuppliedPower": 894.75,
    "avgProductionCost": 6.498,
    "totalDailyCost": 2299089200
  },
  "generationData": [
    {
      "name": "Gas",
      "gen": 126.19,
      "cost": 435355500,
      "unitCost": 3.45,
      "color": "#0ea5e9"
    },
    {
      "name": "Coal",
      "gen": 129.21,
      "cost": 855370200,
      "unitCost": 6.62,
      "color": "#64748b"
    },
    {
      "name": "HFO",
      "gen": 30.41,
      "cost": 549204600,
      "unitCost": 18.06,
      "color": "#f97316"
    },
    {
      "name": "Hydro",
      "gen": 2.21,
      "cost": 221000,
      "unitCost": 0.1,
      "color": "#06b6d4"
    },
    {
      "name": "Solar",
      "gen": 3.75,
      "cost": 59137500,
      "unitCost": 15.77,
      "color": "#eab308"
    },
    {
      "name": "Imports",
      "gen": 63.06,
      "cost": 399800400,
      "unitCost": 6.34,
      "color": "#a855f7"
    },
    {
      "name": "HSD (Diesel)",
      "gen": 0,
      "cost": 0,
      "unitCost": 0,
      "color": "#ef4444"
    }
  ],
  "borderImportsData": [
    {
      "source": "HVDC Bheramara (India)",
      "energy": 21.74,
      "peakFlow": 902.3,
      "type": "C/B Interconnector (West)"
    },
    {
      "source": "Adani Godda (India)",
      "energy": 36.56,
      "peakFlow": 1489.6,
      "type": "C/B Interconnector (North)"
    },
    {
      "source": "Tripura Cumilla (India)",
      "energy": 3.84,
      "peakFlow": 177.9,
      "type": "C/B Interconnector (East)"
    }
  ],
  "regionalDemandData": [],
  "dailyOutages": [
    {
      "time": "08:14 - 13:37",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Disk Insulator Change Work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-1 Scheduled S/D from Kallyanpur 132/33kV end Due to Disk Insulator Change Work"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-1 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:22 - 08:51",
      "plant": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays",
      "load": "HT Outage",
      "reason": "Due to Pbs 33 kv feeder fault (over current)",
      "full_desc": "Dhamrai 132/33kV S/S Transformer-2 LT Tripped showing Over current relay relays Due to Pbs 33 kv feeder fault (over current)"
    },
    {
      "time": "08:59 - 18:23",
      "plant": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D Due to For project work"
    },
    {
      "time": "09:00 - 18:22",
      "plant": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end.",
      "full_desc": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end."
    },
    {
      "time": "09:17 - 18:39",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D Due to For project work"
    },
    {
      "time": "09:18 - 14:48",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33 DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) LT Scheduled S/D Due to T-1 33 DS maintenance."
    },
    {
      "time": "09:18 - 14:47",
      "plant": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to T-1 33kv DS maintenance.",
      "full_desc": "Niamatpur 132/33kV S/S Transformer-1(407T) HT Scheduled S/D Due to T-1 33kv DS maintenance."
    },
    {
      "time": "09:18 - 18:38",
      "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D",
      "load": "HT Outage",
      "reason": "Due to For project work",
      "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D Due to For project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-1 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:33",
      "plant": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Project work",
      "full_desc": "Gopalganj 132/33kV S/S Gallamari-2 Scheduled S/D Due to Project work"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-1 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:37",
      "plant": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work",
      "load": "HT Outage",
      "reason": "Due to Lilo at rupsha ss",
      "full_desc": "Gallamari- Khulna (S)  132kV Ckt-2 Project Work S/D from Gollamari 132/33kV end Due to Lilo at rupsha ss"
    },
    {
      "time": "09:40",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 HT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 HT is restored."
    },
    {
      "time": "09:42",
      "plant": "Purbasadipur 230/132/33kV S/S TR-4 LT",
      "load": "HT Outage",
      "reason": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored.",
      "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 LT is restored."
    },
    {
      "time": "10:14 - 18:42",
      "plant": "BIPTC S/S Baharampur-3 Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Shutdown is taken from Baharampur end",
      "full_desc": "BIPTC S/S Baharampur-3 Scheduled S/D Due to Shutdown is taken from Baharampur end"
    },
    {
      "time": "10:25",
      "plant": "Baroirhat 132/33kV S/S TR-1, 406T HT",
      "load": "HT Outage",
      "reason": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored.",
      "full_desc": "Baroirhat 132/33kV S/S TR-1, 406T HT is restored."
    },
    {
      "time": "10:39 - 13:52",
      "plant": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 LT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 LT Forced S/D"
    },
    {
      "time": "10:40 - 13:51",
      "plant": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "load": "HT Outage",
      "reason": "Kushtia 132/33kV S/S T-1 HT Forced S/D",
      "full_desc": "Kushtia 132/33kV S/S T-1 HT Forced S/D"
    },
    {
      "time": "11:00 - 12:36",
      "plant": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled",
      "load": "HT Outage",
      "reason": "due to high temperature.",
      "full_desc": "Baroirhat 132/33kV S/S TR-2, 416T LT Scheduled S/D Due to Maintanance work due to high temperature."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT is restored."
    },
    {
      "time": "11:36",
      "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT",
      "load": "HT Outage",
      "reason": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored.",
      "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT is restored."
    },
    {
      "time": "12:00",
      "plant": "Day peak generation",
      "load": "14319 MW",
      "reason": "Day peak generation is 14319 MW.",
      "full_desc": "Day peak generation is 14319 MW."
    },
    {
      "time": "12:08 - 12:17",
      "plant": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays",
      "load": "HT Outage",
      "reason": "Due to 33kv feeder fault",
      "full_desc": "Saidpur 132/33kV S/S TR-5 (434T) LT Tripped showing O/C relay relays Due to 33kv feeder fault"
    },
    {
      "time": "13:42 - 21:48",
      "plant": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to line work",
      "full_desc": "Kallyanpur-Lalbag  132kV Ckt-2 Scheduled S/D from Kallyanpur 132/33kV end Due to line work"
    },
    {
      "time": "13:53 - 14:37",
      "plant": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-4 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "13:53 - 14:35",
      "plant": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays",
      "load": "HT Outage",
      "reason": "Due to For 33kv Hizal & Mehendigonj feeder fault.",
      "full_desc": "Barishal 230/132kV S/S T-5 LT Tripped showing Over current relays Due to For 33kv Hizal & Mehendigonj feeder fault."
    },
    {
      "time": "14:36",
      "plant": "Jhenaidah 230/132kV S/S 230 kV Bus",
      "load": "HT Outage",
      "reason": "Jhenaidah 230/132kV S/S 230 kV Bus is restored.",
      "full_desc": "Jhenaidah 230/132kV S/S 230 kV Bus is restored."
    },
    {
      "time": "15:07",
      "plant": "Patuakhali-Payra  132kV Ckt-1",
      "load": "HT Outage",
      "reason": "Patuakhali-Payra  132kV Ckt-1 is restored.",
      "full_desc": "Patuakhali-Payra  132kV Ckt-1 is restored."
    },
    {
      "time": "15:37 - 17:34",
      "plant": "Patuakhali-Payra  132kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to High Temperature Maintenance",
      "full_desc": "Patuakhali-Payra  132kV Ckt-2 Scheduled S/D from Payra 400/132/33kV end Due to High Temperature Maintenance"
    },
    {
      "time": "16:37 - 18:46",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) LT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "16:38 - 18:45",
      "plant": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to Remove the red hot Fakirhat-02",
      "full_desc": "Bagerhat 132/33kV S/S Transformer-3 ( 423 T) HT Scheduled S/D Due to Remove the red hot Fakirhat-02"
    },
    {
      "time": "19:47 - 20:47",
      "plant": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "load": "50 MW",
      "reason": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D",
      "full_desc": "Mymensingh 132/33kV S/S 50 MW Solar Plant Forced S/D"
    },
    {
      "time": "21:00",
      "plant": "Evening peak generation",
      "load": "16193 MW",
      "reason": "Evening peak generation is 16193 MW.",
      "full_desc": "Evening peak generation is 16193 MW."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 03. Transformer-03 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing Micom relay relays."
    },
    {
      "time": "22:23 - 22:32",
      "plant": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "load": "HT Outage",
      "reason": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays.",
      "full_desc": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing Micom relay relays."
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T HT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "23:47 - 01:05",
      "plant": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D",
      "load": "HT Outage",
      "reason": "Due to Maijdee PDB red hot maintenance",
      "full_desc": "Chowmuhani 230/132/33kV S/S TR1-415T LT Forced S/D Due to Maijdee PDB red hot maintenance"
    },
    {
      "time": "02:35",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- ST"
    },
    {
      "time": "03:18",
      "plant": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "load": "225 MW",
      "reason": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT",
      "full_desc": "Ashuganj CCPP 225 MW Shutdown with remarks:- GT"
    },
    {
      "time": "06:06",
      "plant": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to For PBS Maintenance Work",
      "full_desc": "Bhulta 132/33kV S/S GT2 HT Scheduled S/D Due to For PBS Maintenance Work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler By pass, maintenance work",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 HT Scheduled S/D Due to PBS 33 KV side Bus coupler By pass, maintenance work"
    },
    {
      "time": "06:17",
      "plant": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33 KV Side Buscoupler fault",
      "full_desc": "Sonargaon 132/33kV S/S Tr-1 LT Scheduled S/D Due to 33 KV Side Buscoupler fault"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 33KV side Buscoupler fault , breaker bypass work purpose",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 LT Scheduled S/D Due to 33KV side Buscoupler fault , breaker bypass work purpose"
    },
    {
      "time": "06:18",
      "plant": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance",
      "full_desc": "Sonargaon 132/33kV S/S Tr-2 HT Scheduled S/D Due to PBS 33 KV side Bus coupler fault , Buscoupler Bypass work maintenance"
    },
    {
      "time": "06:33",
      "plant": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work",
      "load": "HT Outage",
      "reason": "for T-3 Installation.",
      "full_desc": "Jhenaidah 230/132kV S/S 132 kV Bus Project Work S/D Due to 132Kv Bus bar extension for T-3 Installation."
    },
    {
      "time": "06:58",
      "plant": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work",
      "load": "HT Outage",
      "reason": "Due to Project work at Barishal Patuakhali line",
      "full_desc": "Barishal-Patuakhali(Barguna T at Bakergonj) 132 kV Ckt Project Work S/D from Barguna 132/33kV end Due to Project work at Barishal Patuakhali line"
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-2 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-2 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:58",
      "plant": "Mithapukur-Palashbari  132kV Ckt-1 Forced",
      "load": "HT Outage",
      "reason": "Due to Only mithapukur side open.",
      "full_desc": "Mithapukur-Palashbari  132kV Ckt-1 Forced S/D from Mithapukur 132/33kV end Due to Only mithapukur side open."
    },
    {
      "time": "06:59",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Barguna Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:01",
      "plant": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled",
      "load": "HT Outage",
      "reason": "Due to Loop connection at Barishal and  Loop disconnect at BakergonJ",
      "full_desc": "Bakerganj-Patuakhali 132 kV Ckt-1 Scheduled S/D from Patuakhali 132/33kV end Due to Loop connection at Barishal and  Loop disconnect at BakergonJ"
    },
    {
      "time": "07:02",
      "plant": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D",
      "load": "HT Outage",
      "reason": "Due to 132 kV Barishal ckt jumper out.",
      "full_desc": "Bakerganj 132/33kV S/S 132 kV Bakerganj Patuakhali Ckt Scheduled S/D Due to 132 kV Barishal ckt jumper out."
    },
    {
      "time": "07:08",
      "plant": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled",
      "load": "HT Outage",
      "reason": "Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement",
      "full_desc": "Bogura-Bogura (New)) 132 kV Ckt-2 Scheduled S/D from Bogura 132/33kV end Due to OPGW Maintenance work and from Bogura 230/132kV end Due to OPW replacement"
    },
    {
      "time": "07:16",
      "plant": "Bogura(New)-Naogaon 132 kV Ckt-1",
      "load": "HT Outage",
      "reason": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored.",
      "full_desc": "Bogura(New)-Naogaon 132 kV Ckt-1 is restored."
    }
  ],
  "hourlyLoadData": [
    {
      "time": "00:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "01:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "02:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "03:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "04:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "05:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "06:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "07:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "08:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "09:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "10:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "11:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "12:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "13:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "14:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "15:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "16:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "17:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    },
    {
      "time": "18:00",
      "generation": 16181,
      "loadShed": 0,
      "demand": 16181
    },
    {
      "time": "19:00",
      "generation": 16181,
      "loadShed": 0,
      "demand": 16181
    },
    {
      "time": "20:00",
      "generation": 16181,
      "loadShed": 0,
      "demand": 16181
    },
    {
      "time": "21:00",
      "generation": 16181,
      "loadShed": 0,
      "demand": 16181
    },
    {
      "time": "22:00",
      "generation": 16181,
      "loadShed": 0,
      "demand": 16181
    },
    {
      "time": "23:00",
      "generation": 14308,
      "loadShed": 0,
      "demand": 14308
    }
  ],
  "gasProductionData": [
    {
      "company": "BGFCL (Titas, Habiganj, Bakhrabad)",
      "fields": 5,
      "gas": 480.2,
      "condensate": 371.9,
      "share": 18.4
    },
    {
      "company": "SGFL (Sylhet, Rashidpur, Kailashtila)",
      "fields": 5,
      "gas": 93.2,
      "condensate": 361.7,
      "share": 3.6
    },
    {
      "company": "BAPEX (Shahbazpur, Srikail, Begumganj)",
      "fields": 9,
      "gas": 93.9,
      "condensate": 69.4,
      "share": 3.6
    },
    {
      "company": "Chevron (Bibiyana, Jalalabad, Moulavibazar)",
      "fields": 3,
      "gas": 900.5,
      "condensate": 4801.5,
      "share": 34.5
    },
    {
      "company": "Tullow (Bangora)",
      "fields": 1,
      "gas": 31.6,
      "condensate": 93.5,
      "share": 1.2
    },
    {
      "company": "RPGCL (R-LNG Import / LNG Terminal)",
      "fields": 0,
      "gas": 1007.9,
      "condensate": 0,
      "share": 38.7
    }
  ],
  "gasDistributionData": [
    {
      "company": "TGTDCL (Dhaka & Mymensingh)",
      "power": 271.8,
      "fertilizer": 73.4,
      "others": 1059.9,
      "total": 1405.1
    },
    {
      "company": "BGDCL (Cumilla & Sylhet)",
      "power": 208.2,
      "fertilizer": 0,
      "others": 88.7,
      "total": 296.9
    },
    {
      "company": "KGDCL (Chattogram)",
      "power": 36.8,
      "fertilizer": 38.5,
      "others": 171.9,
      "total": 247.2
    },
    {
      "company": "JGTDSL (Sylhet region)",
      "power": 222.2,
      "fertilizer": 40.3,
      "others": 113.7,
      "total": 376.2
    },
    {
      "company": "PGCL (Rajshahi & Rangpur)",
      "power": 128.6,
      "fertilizer": 0,
      "others": 29.6,
      "total": 158.2
    },
    {
      "company": "SGCL (Barishal & Khulna)",
      "power": 54.5,
      "fertilizer": 0,
      "others": 4.6,
      "total": 59.1
    }
  ]
}
};