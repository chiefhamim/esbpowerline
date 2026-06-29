// Auto-generated thin fallback — canonical source is public/data/daily/{YYYY-MM-DD}.json
import type { GridDailyData } from './types';

/** Offline/fetch-failure fallback keyed by YYYY-MM-DD. */
export const powerGridArchive: Record<string, GridDailyData> = {
  "2026-06-22": {
    "systemStats": {
      "date": "22 Jun 2026",
      "dayPeakGen": 14171.86,
      "eveningPeakGen": 16154.41,
      "dayPeakDemand": 14419.86,
      "eveningPeakDemand": 16854.11,
      "minGen": 12623.38,
      "maxGen": 16100,
      "totalEnergyGen": 343.2675271,
      "totalEnergyUnserved": 1.98,
      "totalEnergyDemand": 345.25,
      "maxTemp": 32.8,
      "totalGasSuppliedPower": 907.35,
      "avgProductionCost": 6.615,
      "totalDailyCost": 2270732586
    },
    "generationData": [
      {
        "name": "Gas",
        "gen": 126.76,
        "cost": 437334272,
        "unitCost": 3.45,
        "color": "#0ea5e9"
      },
      {
        "name": "Coal",
        "gen": 123.3,
        "cost": 816220928,
        "unitCost": 6.62,
        "color": "#64748b"
      },
      {
        "name": "HFO",
        "gen": 35.03,
        "cost": 632710287,
        "unitCost": 18.06,
        "color": "#f97316"
      },
      {
        "name": "Hydro",
        "gen": 2.27,
        "cost": 227438,
        "unitCost": 0.1,
        "color": "#06b6d4"
      },
      {
        "name": "Solar",
        "gen": 2.99,
        "cost": 47092826,
        "unitCost": 15.77,
        "color": "#eab308"
      },
      {
        "name": "Imports",
        "gen": 52.72,
        "cost": 334268613,
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
        "energy": 14.18,
        "peakFlow": 930,
        "type": "C/B Interconnector (West)"
      },
      {
        "source": "Adani Godda (India)",
        "energy": 34.05,
        "peakFlow": 1485.55,
        "type": "C/B Interconnector (North)"
      },
      {
        "source": "Tripura Cumilla (India)",
        "energy": 3.58,
        "peakFlow": 168,
        "type": "C/B Interconnector (East)"
      }
    ],
    "regionalDemandData": [
      {
        "zone": "Dhaka",
        "loadShed": 88,
        "demand": 5861,
        "pct": 1.5
      },
      {
        "zone": "Chattogram",
        "loadShed": 0,
        "demand": 1526,
        "pct": 0
      },
      {
        "zone": "Khulna",
        "loadShed": 31,
        "demand": 1897,
        "pct": 1.63
      },
      {
        "zone": "Rajshahi",
        "loadShed": 0,
        "demand": 1641,
        "pct": 0
      },
      {
        "zone": "Cumilla",
        "loadShed": 110,
        "demand": 1579,
        "pct": 6.97
      },
      {
        "zone": "Mymensingh",
        "loadShed": 241,
        "demand": 1380,
        "pct": 17.46
      },
      {
        "zone": "Sylhet",
        "loadShed": 0,
        "demand": 627,
        "pct": 0
      },
      {
        "zone": "Barishal",
        "loadShed": 0,
        "demand": 528,
        "pct": 0
      },
      {
        "zone": "Rangpur",
        "loadShed": 26,
        "demand": 1002,
        "pct": 2.59
      }
    ],
    "dailyOutages": [
      {
        "time": "08:09",
        "plant": "Dhamrai 132/33kV S/S Transformer-1 HT",
        "load": "HT Outage",
        "reason": "Dhamrai 132/33kV S/S Transformer-1 HT is restored.",
        "full_desc": "Dhamrai 132/33kV S/S Transformer-1 HT is restored."
      },
      {
        "time": "08:10",
        "plant": "Dhamrai 132/33kV S/S Transformer-1 LT",
        "load": "HT Outage",
        "reason": "Dhamrai 132/33kV S/S Transformer-1 LT is restored.",
        "full_desc": "Dhamrai 132/33kV S/S Transformer-1 LT is restored."
      },
      {
        "time": "08:39",
        "plant": "Barishal(N)-Madaripur 132 kV Ckt-2",
        "load": "HT Outage",
        "reason": "Barishal(N)-Madaripur 132 kV Ckt-2 is restored.",
        "full_desc": "Barishal(N)-Madaripur 132 kV Ckt-2 is restored."
      },
      {
        "time": "08:48",
        "plant": "Narail 132/33kV S/S TR2 (413-T) HT",
        "load": "HT Outage",
        "reason": "Narail 132/33kV S/S TR2 (413-T) HT is restored.",
        "full_desc": "Narail 132/33kV S/S TR2 (413-T) HT is restored."
      },
      {
        "time": "08:48",
        "plant": "Hathazari 230/132/33kV S/S MT-03 HT",
        "load": "HT Outage",
        "reason": "Hathazari 230/132/33kV S/S MT-03 HT is restored.",
        "full_desc": "Hathazari 230/132/33kV S/S MT-03 HT is restored."
      },
      {
        "time": "08:48",
        "plant": "Hathazari 230/132/33kV S/S MT-03 LT",
        "load": "HT Outage",
        "reason": "Hathazari 230/132/33kV S/S MT-03 LT is restored.",
        "full_desc": "Hathazari 230/132/33kV S/S MT-03 LT is restored."
      },
      {
        "time": "08:49",
        "plant": "Narail 132/33kV S/S TR2 (413-T) LT",
        "load": "HT Outage",
        "reason": "Narail 132/33kV S/S TR2 (413-T) LT is restored.",
        "full_desc": "Narail 132/33kV S/S TR2 (413-T) LT is restored."
      },
      {
        "time": "09:07 - 10:26",
        "plant": "Srinagar 132/33kV S/S Tr-01 LT Scheduled",
        "load": "HT Outage",
        "reason": "for PBS red hot maintenance.",
        "full_desc": "Srinagar 132/33kV S/S Tr-01 LT Scheduled S/D Due to 33 kv bus -01 shutdown for PBS red hot maintenance."
      },
      {
        "time": "09:08 - 10:24",
        "plant": "Srinagar 132/33kV S/S Tr-01 HT Scheduled",
        "load": "HT Outage",
        "reason": "for PBS red hot maintenance.",
        "full_desc": "Srinagar 132/33kV S/S Tr-01 HT Scheduled S/D Due to 33 kv bus -01 shutdown for PBS red hot maintenance."
      },
      {
        "time": "09:19 - 10:17",
        "plant": "Srinagar 132/33kV S/S 33 kV bus Scheduled",
        "load": "HT Outage",
        "reason": "for PBS red hot maintenance.",
        "full_desc": "Srinagar 132/33kV S/S 33 kV bus Scheduled S/D Due to 33 kv bus -01 shutdown for PBS red hot maintenance."
      },
      {
        "time": "09:20 - 09:59",
        "plant": "Shahjadpur 132/33kV S/S T-2(415T) HT Forced S/D",
        "load": "HT Outage",
        "reason": "Due to Maintenance",
        "full_desc": "Shahjadpur 132/33kV S/S T-2(415T) HT Forced S/D Due to Maintenance"
      },
      {
        "time": "09:20 - 14:58",
        "plant": "Shyampur-Shyampur(New) 132kV Ckt-1 Scheduled",
        "load": "HT Outage",
        "reason": "for circuit-1",
        "full_desc": "Shyampur-Shyampur(New) 132kV Ckt-1 Scheduled S/D from Shyampur 230/132kV end Due to Short span jumper opening between Shy-1 & Fat-1 circuit. and from Shyampur 132/33kV end Due to working for circuit-1"
      },
      {
        "time": "09:33",
        "plant": "Fatullah-Shyampur(New) 132 kV Ckt-1 Forced",
        "load": "HT Outage",
        "reason": "Due to By NLDC",
        "full_desc": "Fatullah-Shyampur(New) 132 kV Ckt-1 Forced S/D from Fatullah 132/33kV end Due to By NLDC"
      },
      {
        "time": "10:22 - 12:34",
        "plant": "Chhatak 132/33kV S/S T-1 LT Scheduled",
        "load": "HT Outage",
        "reason": "for 33KV T-1 Bus section red hot maintenance.",
        "full_desc": "Chhatak 132/33kV S/S T-1 LT Scheduled S/D Due to Shutdown for 33KV T-1 Bus section red hot maintenance."
      },
      {
        "time": "10:22 - 12:34",
        "plant": "Chhatak 132/33kV S/S T-1 HT Scheduled",
        "load": "HT Outage",
        "reason": "for 33KV T-1 Bus section red hot maintenance.",
        "full_desc": "Chhatak 132/33kV S/S T-1 HT Scheduled S/D Due to Shutdown for 33KV T-1 Bus section red hot maintenance."
      },
      {
        "time": "10:23 - 14:26",
        "plant": "Khulna(S)-PDB 330MW CCPP 230kV Ckt-1 Scheduled",
        "load": "330MW",
        "reason": "Due to Maintenance Work at power Plant end.",
        "full_desc": "Khulna(S)-PDB 330MW CCPP 230kV Ckt-1 Scheduled S/D from Khulna(S) 230/132kV end Due to Maintenance Work at power Plant end."
      },
      {
        "time": "11:20 - 11:30",
        "plant": "Hathazari 230/132/33kV S/S MT-03 HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Bushing Measurement",
        "full_desc": "Hathazari 230/132/33kV S/S MT-03 HT Scheduled S/D Due to Bushing Measurement"
      },
      {
        "time": "14:44",
        "plant": "Brahmanbaria-Narsinghdi 132 kV Ckt-2",
        "load": "HT Outage",
        "reason": "Brahmanbaria-Narsinghdi 132 kV Ckt-2 is restored.",
        "full_desc": "Brahmanbaria-Narsinghdi 132 kV Ckt-2 is restored."
      },
      {
        "time": "14:44",
        "plant": "Brahmanbaria-Narsinghdi 132 kV Ckt-1",
        "load": "HT Outage",
        "reason": "Brahmanbaria-Narsinghdi 132 kV Ckt-1 is restored.",
        "full_desc": "Brahmanbaria-Narsinghdi 132 kV Ckt-1 is restored."
      },
      {
        "time": "15:44 - 17:27",
        "plant": "Daganbhuiyan 132/33kV S/S Transformer-1 HT Forced",
        "load": "HT Outage",
        "reason": "for  Red Hot Maintenance",
        "full_desc": "Daganbhuiyan 132/33kV S/S Transformer-1 HT Forced S/D Due to shutdown for  Red Hot Maintenance"
      },
      {
        "time": "15:47 - 17:30",
        "plant": "Daganbhuiyan 132/33kV S/S Transformer-1 LT Forced",
        "load": "HT Outage",
        "reason": "for  Red Hot Maintenance",
        "full_desc": "Daganbhuiyan 132/33kV S/S Transformer-1 LT Forced S/D Due to shutdown for  Red Hot Maintenance"
      },
      {
        "time": "16:06 - 17:07",
        "plant": "Fenchuganj 230/132/33kV S/S TR-01 HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to PDB Feeder maintenance",
        "full_desc": "Fenchuganj 230/132/33kV S/S TR-01 HT Scheduled S/D Due to PDB Feeder maintenance"
      },
      {
        "time": "16:23 - 16:45",
        "plant": "Chapai 132/33kV S/S T-4 (435T) HT Forced S/D",
        "load": "HT Outage",
        "reason": "Due to Nest Remove",
        "full_desc": "Chapai 132/33kV S/S T-4 (435T) HT Forced S/D Due to Nest Remove"
      },
      {
        "time": "19:02",
        "plant": "Satiya-64 MW Solar132 KV-2 syn.",
        "load": "64 MW",
        "reason": "Satiya-64 MW Solar132 KV-2 syn.",
        "full_desc": "Satiya-64 MW Solar132 KV-2 syn."
      },
      {
        "time": "06:26",
        "plant": "Dhamrai 132/33kV S/S Transformer-1 LT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Red-hot Maintenance",
        "full_desc": "Dhamrai 132/33kV S/S Transformer-1 LT Scheduled S/D Due to Red-hot Maintenance"
      },
      {
        "time": "06:26",
        "plant": "Dhamrai 132/33kV S/S Transformer-1 HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Red-hot Maintenance",
        "full_desc": "Dhamrai 132/33kV S/S Transformer-1 HT Scheduled S/D Due to Red-hot Maintenance"
      },
      {
        "time": "07:00",
        "plant": "Minimum Generation",
        "load": "13639 MW",
        "reason": "Minimum Generation is 13639 MW.",
        "full_desc": "Minimum Generation is 13639 MW."
      }
    ],
    "hourlyLoadData": [
      {
        "time": "00:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "01:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "02:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "03:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "04:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "05:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "06:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "07:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "08:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "09:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "10:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "11:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "12:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "13:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "14:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "15:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "16:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "17:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      },
      {
        "time": "18:00",
        "generation": 16154.41,
        "loadShed": 0,
        "demand": 16154.41
      },
      {
        "time": "19:00",
        "generation": 16154.41,
        "loadShed": 0,
        "demand": 16154.41
      },
      {
        "time": "20:00",
        "generation": 16154.41,
        "loadShed": 0,
        "demand": 16154.41
      },
      {
        "time": "21:00",
        "generation": 16154.41,
        "loadShed": 0,
        "demand": 16154.41
      },
      {
        "time": "22:00",
        "generation": 16154.41,
        "loadShed": 0,
        "demand": 16154.41
      },
      {
        "time": "23:00",
        "generation": 14171.86,
        "loadShed": 0,
        "demand": 14171.86
      }
    ],
    "gasProductionData": [
      {
        "company": "BGFCL (Titas, Habiganj, Bakhrabad)",
        "fields": 5,
        "gas": 478.7,
        "condensate": 371.8,
        "share": 18.4
      },
      {
        "company": "SGFL (Sylhet, Rashidpur, Kailashtila)",
        "fields": 5,
        "gas": 93.9,
        "condensate": 334.2,
        "share": 3.6
      },
      {
        "company": "BAPEX (Shahbazpur, Srikail, Begumganj)",
        "fields": 9,
        "gas": 92.4,
        "condensate": 59.3,
        "share": 3.6
      },
      {
        "company": "Chevron (Bibiyana, Jalalabad, Moulavibazar)",
        "fields": 3,
        "gas": 897.4,
        "condensate": 4702.6,
        "share": 34.5
      },
      {
        "company": "Tullow (Bangora)",
        "fields": 1,
        "gas": 31.2,
        "condensate": 93,
        "share": 1.2
      },
      {
        "company": "RPGCL (R-LNG Import / LNG Terminal)",
        "fields": 0,
        "gas": 1008,
        "condensate": 0,
        "share": 38.7
      }
    ],
    "gasDistributionData": [
      {
        "company": "TGTDCL (Dhaka & Mymensingh)",
        "power": 267.4,
        "fertilizer": 73.1,
        "others": 1069.8,
        "total": 1410.3
      },
      {
        "company": "BGDCL (Cumilla & Sylhet)",
        "power": 206.7,
        "fertilizer": 0,
        "others": 87.4,
        "total": 294.1
      },
      {
        "company": "KGDCL (Chattogram)",
        "power": 37.6,
        "fertilizer": 38.5,
        "others": 170,
        "total": 246.1
      },
      {
        "company": "JGTDSL (Sylhet region)",
        "power": 224.5,
        "fertilizer": 40.1,
        "others": 114.4,
        "total": 379
      },
      {
        "company": "PGCL (Rajshahi & Rangpur)",
        "power": 126.9,
        "fertilizer": 0,
        "others": 29.2,
        "total": 156
      },
      {
        "company": "SGCL (Barishal & Khulna)",
        "power": 54.2,
        "fertilizer": 0,
        "others": 4.3,
        "total": 58.5
      }
    ]
  },
  "2026-06-23": {
    "systemStats": {
      "date": "23 Jun 2026",
      "dayPeakGen": 14580.7,
      "eveningPeakGen": 15506.14,
      "dayPeakDemand": 15579.2,
      "eveningPeakDemand": 17593.14,
      "minGen": 13639.05,
      "maxGen": 15020,
      "totalEnergyGen": 351.24831128,
      "totalEnergyUnserved": 7.99,
      "totalEnergyDemand": 359.24,
      "maxTemp": 32.8,
      "totalGasSuppliedPower": 888.38,
      "avgProductionCost": 6.822,
      "totalDailyCost": 2396364493
    },
    "generationData": [
      {
        "name": "Gas",
        "gen": 125.96,
        "cost": 434567425,
        "unitCost": 3.45,
        "color": "#0ea5e9"
      },
      {
        "name": "Coal",
        "gen": 116,
        "cost": 767888438,
        "unitCost": 6.62,
        "color": "#64748b"
      },
      {
        "name": "HFO",
        "gen": 41.77,
        "cost": 754399625,
        "unitCost": 18.06,
        "color": "#f97316"
      },
      {
        "name": "Hydro",
        "gen": 2.26,
        "cost": 226478,
        "unitCost": 0.1,
        "color": "#06b6d4"
      },
      {
        "name": "Solar",
        "gen": 3.33,
        "cost": 52438520,
        "unitCost": 15.77,
        "color": "#eab308"
      },
      {
        "name": "Imports",
        "gen": 61.88,
        "cost": 392335861,
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
        "energy": 21.88,
        "peakFlow": 902,
        "type": "C/B Interconnector (West)"
      },
      {
        "source": "Adani Godda (India)",
        "energy": 35.01,
        "peakFlow": 1465.08,
        "type": "C/B Interconnector (North)"
      },
      {
        "source": "Tripura Cumilla (India)",
        "energy": 4.08,
        "peakFlow": 174,
        "type": "C/B Interconnector (East)"
      }
    ],
    "regionalDemandData": [
      {
        "zone": "Dhaka",
        "loadShed": 290,
        "demand": 6049,
        "pct": 4.79
      },
      {
        "zone": "Chattogram",
        "loadShed": 129,
        "demand": 1536,
        "pct": 8.4
      },
      {
        "zone": "Khulna",
        "loadShed": 380,
        "demand": 2123,
        "pct": 17.9
      },
      {
        "zone": "Rajshahi",
        "loadShed": 210,
        "demand": 1727,
        "pct": 12.16
      },
      {
        "zone": "Cumilla",
        "loadShed": 229,
        "demand": 1632,
        "pct": 14.03
      },
      {
        "zone": "Mymensingh",
        "loadShed": 359,
        "demand": 1441,
        "pct": 24.91
      },
      {
        "zone": "Sylhet",
        "loadShed": 128,
        "demand": 714,
        "pct": 17.93
      },
      {
        "zone": "Barishal",
        "loadShed": 116,
        "demand": 582,
        "pct": 19.93
      },
      {
        "zone": "Rangpur",
        "loadShed": 156,
        "demand": 1072,
        "pct": 14.55
      }
    ],
    "dailyOutages": [
      {
        "time": "08:09 - 09:44",
        "plant": "Charfasson 230/33kV S/S Power Transformer-2 LT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to CT ratio with burden test.",
        "full_desc": "Charfasson 230/33kV S/S Power Transformer-2 LT Scheduled S/D Due to CT ratio with burden test."
      },
      {
        "time": "08:11 - 09:43",
        "plant": "Charfasson 230/33kV S/S Power Transformer-2 HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to CT Ratio with burden test.",
        "full_desc": "Charfasson 230/33kV S/S Power Transformer-2 HT Scheduled S/D Due to CT Ratio with burden test."
      },
      {
        "time": "08:14",
        "plant": "Dhamrai 132/33kV S/S Transformer-1 LT",
        "load": "HT Outage",
        "reason": "Dhamrai 132/33kV S/S Transformer-1 LT is restored.",
        "full_desc": "Dhamrai 132/33kV S/S Transformer-1 LT is restored."
      },
      {
        "time": "08:14",
        "plant": "Dhamrai 132/33kV S/S Transformer-1 HT",
        "load": "HT Outage",
        "reason": "Dhamrai 132/33kV S/S Transformer-1 HT is restored.",
        "full_desc": "Dhamrai 132/33kV S/S Transformer-1 HT is restored."
      },
      {
        "time": "08:45",
        "plant": "Khulna (S)-Satkhira 132kV Ckt-1 Project Work",
        "load": "HT Outage",
        "reason": "Khulna (S)-Satkhira 132kV Ckt-1 Project Work S/D from Satkhira 132/33kV end. and from Khulna(S) 230/132kVend.",
        "full_desc": "Khulna (S)-Satkhira 132kV Ckt-1 Project Work S/D from Satkhira 132/33kV end. and from Khulna(S) 230/132kVend."
      },
      {
        "time": "09:41",
        "plant": "Baghabari-Ishurdi 230 kV Ckt-2 Project Work",
        "load": "HT Outage",
        "reason": "Due to SS Upgradation and from Ishurdi 230/132kV end Due to Bay equipment upgradation",
        "full_desc": "Baghabari-Ishurdi 230 kV Ckt-2 Project Work S/D from Baghabari 230/132kV end Due to SS Upgradation and from Ishurdi 230/132kV end Due to Bay equipment upgradation"
      },
      {
        "time": "10:13 - 12:00",
        "plant": "Brahmanbaria-Shahjibazar 132 kV Ckt-2 Forced",
        "load": "HT Outage",
        "reason": "Due to Red-hot maintenance and from Shahjibazar 132/33kV end Due to Shutdown taken by B.Baria",
        "full_desc": "Brahmanbaria-Shahjibazar 132 kV Ckt-2 Forced S/D from Brahmanbaria 132/33kV end Due to Red-hot maintenance and from Shahjibazar 132/33kV end Due to Shutdown taken by B.Baria"
      },
      {
        "time": "10:52",
        "plant": "Sherpur 132/33kV S/S Transformer- 03 LT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Tr-03 132kv energy meter change works.",
        "full_desc": "Sherpur 132/33kV S/S Transformer- 03 LT Scheduled S/D Due to Tr-03 132kv energy meter change works."
      },
      {
        "time": "10:53",
        "plant": "Sherpur 132/33kV S/S Transformer- 03 HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Tr-03 132kv energy meter change works.",
        "full_desc": "Sherpur 132/33kV S/S Transformer- 03 HT Scheduled S/D Due to Tr-03 132kv energy meter change works."
      },
      {
        "time": "11:03",
        "plant": "Bajitpur 132/33kV S/S 132 kV Bus-2 Forced S/D",
        "load": "HT Outage",
        "reason": "Bajitpur 132/33kV S/S 132 kV Bus-2 Forced S/D",
        "full_desc": "Bajitpur 132/33kV S/S 132 kV Bus-2 Forced S/D"
      },
      {
        "time": "12:00",
        "plant": "Day Peak Generation",
        "load": "14581 MW",
        "reason": "Day Peak Generation is 14581 MW.",
        "full_desc": "Day Peak Generation is 14581 MW."
      },
      {
        "time": "13:37 - 17:14",
        "plant": "Purbasadipur-Thakurgaon-EPV  132kV Ckt-2 Tripped from Purbasadipur 230/132/33kV end showing Main-1 Diatance relay <br> Main-2 Distance Relay relays.",
        "load": "HT Outage",
        "reason": "Purbasadipur-Thakurgaon-EPV  132kV Ckt-2 Tripped from Purbasadipur 230/132/33kV end showing Main-1 Diatance relay <br> Main-2 Distance Relay relays.",
        "full_desc": "Purbasadipur-Thakurgaon-EPV  132kV Ckt-2 Tripped from Purbasadipur 230/132/33kV end showing Main-1 Diatance relay <br> Main-2 Distance Relay relays."
      },
      {
        "time": "15:10 - 15:17",
        "plant": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing SPS trip. relays",
        "load": "HT Outage",
        "reason": "Due to Fault at BR Powergen end.",
        "full_desc": "Bhaluka 132/33kV S/S 02. Transformer- 02 LT Tripped showing SPS trip. relays Due to Fault at BR Powergen end."
      },
      {
        "time": "15:10 - 15:31",
        "plant": "Bhaluka 132/33kV S/S BR Powergen Ckt- 01 Tripped showing R Phase zone 2 trip. relays",
        "load": "HT Outage",
        "reason": "Due to BR Powergen end fault.",
        "full_desc": "Bhaluka 132/33kV S/S BR Powergen Ckt- 01 Tripped showing R Phase zone 2 trip. relays Due to BR Powergen end fault."
      },
      {
        "time": "15:10 - 15:17",
        "plant": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing SPS trip relays",
        "load": "HT Outage",
        "reason": "Due to Fault at BR Powergen end",
        "full_desc": "Bhaluka 132/33kV S/S 01. Transformer- 01 LT Tripped showing SPS trip relays Due to Fault at BR Powergen end"
      },
      {
        "time": "15:25 - 16:22",
        "plant": "Baroirhat-Feni 132 kV Ckt-2 Scheduled",
        "load": "HT Outage",
        "reason": "Due to For Breaker Gas Refilling. and from Baroirhat 132/33kV end Due to Order by NLDC",
        "full_desc": "Baroirhat-Feni 132 kV Ckt-2 Scheduled S/D from Feni 132/33kV end Due to For Breaker Gas Refilling. and from Baroirhat 132/33kV end Due to Order by NLDC"
      },
      {
        "time": "16:54",
        "plant": "Barapukuria unit-1",
        "load": "HT Outage",
        "reason": "Barapukuria unit-1 was sync.",
        "full_desc": "Barapukuria unit-1 was sync."
      },
      {
        "time": "20:57",
        "plant": "Chandpur CCPP ST",
        "load": "HT Outage",
        "reason": "Chandpur CCPP ST was sync.",
        "full_desc": "Chandpur CCPP ST was sync."
      },
      {
        "time": "21:32",
        "plant": "Barapukuria unit-3",
        "load": "HT Outage",
        "reason": "Barapukuria unit-3 was sync.",
        "full_desc": "Barapukuria unit-3 was sync."
      },
      {
        "time": "01:27 - 02:12",
        "plant": "Chattak-Sunamganj 132 kV Ckt-1 Tripped from Sunamganj 132/33kV end showing REL 670 relays",
        "load": "HT Outage",
        "reason": "Due to Thunderstorm",
        "full_desc": "Chattak-Sunamganj 132 kV Ckt-1 Tripped from Sunamganj 132/33kV end showing REL 670 relays Due to Thunderstorm"
      },
      {
        "time": "06:34",
        "plant": "Jhenaidah 230/132kV S/S 230 kV Bus Project Work S/D",
        "load": "HT Outage",
        "reason": "Due to 230 kV Bus-1 Shutdown (For project work)",
        "full_desc": "Jhenaidah 230/132kV S/S 230 kV Bus Project Work S/D Due to 230 kV Bus-1 Shutdown (For project work)"
      }
    ],
    "hourlyLoadData": [
      {
        "time": "00:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "01:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "02:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "03:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "04:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "05:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "06:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "07:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "08:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "09:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "10:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "11:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "12:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "13:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "14:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "15:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "16:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "17:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      },
      {
        "time": "18:00",
        "generation": 15506.14,
        "loadShed": 0,
        "demand": 15506.14
      },
      {
        "time": "19:00",
        "generation": 15506.14,
        "loadShed": 0,
        "demand": 15506.14
      },
      {
        "time": "20:00",
        "generation": 15506.14,
        "loadShed": 0,
        "demand": 15506.14
      },
      {
        "time": "21:00",
        "generation": 15506.14,
        "loadShed": 0,
        "demand": 15506.14
      },
      {
        "time": "22:00",
        "generation": 15506.14,
        "loadShed": 0,
        "demand": 15506.14
      },
      {
        "time": "23:00",
        "generation": 14580.7,
        "loadShed": 0,
        "demand": 14580.7
      }
    ],
    "gasProductionData": [
      {
        "company": "BGFCL (Titas, Habiganj, Bakhrabad)",
        "fields": 5,
        "gas": 479.9,
        "condensate": 380,
        "share": 18.5
      },
      {
        "company": "SGFL (Sylhet, Rashidpur, Kailashtila)",
        "fields": 5,
        "gas": 94,
        "condensate": 332.8,
        "share": 3.6
      },
      {
        "company": "BAPEX (Shahbazpur, Srikail, Begumganj)",
        "fields": 9,
        "gas": 93.1,
        "condensate": 67.4,
        "share": 3.6
      },
      {
        "company": "Chevron (Bibiyana, Jalalabad, Moulavibazar)",
        "fields": 3,
        "gas": 895.7,
        "condensate": 4875.7,
        "share": 34.5
      },
      {
        "company": "Tullow (Bangora)",
        "fields": 1,
        "gas": 31.4,
        "condensate": 94,
        "share": 1.2
      },
      {
        "company": "RPGCL (R-LNG Import / LNG Terminal)",
        "fields": 0,
        "gas": 1002.9,
        "condensate": 0,
        "share": 38.6
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
        "fertilizer": 0,
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
        "fertilizer": 0,
        "others": 29.5,
        "total": 153.8
      },
      {
        "company": "SGCL (Barishal & Khulna)",
        "power": 54.1,
        "fertilizer": 0,
        "others": 4.5,
        "total": 58.6
      }
    ]
  },
  "2026-06-24": {
    "systemStats": {
      "date": "24 Jun 2026",
      "dayPeakGen": 14441.07,
      "eveningPeakGen": 15700.01,
      "dayPeakDemand": 15333.57,
      "eveningPeakDemand": 17565.01,
      "minGen": 13478.64,
      "maxGen": 15700,
      "totalEnergyGen": 347.06060948,
      "totalEnergyUnserved": 7.14,
      "totalEnergyDemand": 354.2,
      "maxTemp": 32.8,
      "totalGasSuppliedPower": 890.08,
      "avgProductionCost": 6.657,
      "totalDailyCost": 2310311557
    },
    "generationData": [
      {
        "name": "Gas",
        "gen": 127.27,
        "cost": 439088274,
        "unitCost": 3.45,
        "color": "#0ea5e9"
      },
      {
        "name": "Coal",
        "gen": 120.35,
        "cost": 796735616,
        "unitCost": 6.62,
        "color": "#64748b"
      },
      {
        "name": "HFO",
        "gen": 36.08,
        "cost": 651623495,
        "unitCost": 18.06,
        "color": "#f97316"
      },
      {
        "name": "Hydro",
        "gen": 2.24,
        "cost": 223636,
        "unitCost": 0.1,
        "color": "#06b6d4"
      },
      {
        "name": "Solar",
        "gen": 4.06,
        "cost": 64062812,
        "unitCost": 15.77,
        "color": "#eab308"
      },
      {
        "name": "Imports",
        "gen": 56.99,
        "cost": 361294517,
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
        "energy": 20.1,
        "peakFlow": 902,
        "type": "C/B Interconnector (West)"
      },
      {
        "source": "Adani Godda (India)",
        "energy": 32.04,
        "peakFlow": 1481.45,
        "type": "C/B Interconnector (North)"
      },
      {
        "source": "Tripura Cumilla (India)",
        "energy": 3.94,
        "peakFlow": 166,
        "type": "C/B Interconnector (East)"
      }
    ],
    "regionalDemandData": [
      {
        "zone": "Dhaka",
        "loadShed": 219,
        "demand": 6082,
        "pct": 3.6
      },
      {
        "zone": "Chattogram",
        "loadShed": 31,
        "demand": 1522,
        "pct": 2.04
      },
      {
        "zone": "Khulna",
        "loadShed": 349,
        "demand": 2009,
        "pct": 17.37
      },
      {
        "zone": "Rajshahi",
        "loadShed": 58,
        "demand": 1752,
        "pct": 3.31
      },
      {
        "zone": "Cumilla",
        "loadShed": 342,
        "demand": 1742,
        "pct": 19.63
      },
      {
        "zone": "Mymensingh",
        "loadShed": 449,
        "demand": 1407,
        "pct": 31.91
      },
      {
        "zone": "Sylhet",
        "loadShed": 47,
        "demand": 713,
        "pct": 6.59
      },
      {
        "zone": "Barishal",
        "loadShed": 85,
        "demand": 547,
        "pct": 15.54
      },
      {
        "zone": "Rangpur",
        "loadShed": 205,
        "demand": 1125,
        "pct": 18.22
      }
    ],
    "dailyOutages": [
      {
        "time": "08:17 - 09:03",
        "plant": "Sylhet 132/33kV S/S T2 HT Tripped showing LV E/F, LV O/C and Gen trip relays",
        "load": "HT Outage",
        "reason": "Due to None",
        "full_desc": "Sylhet 132/33kV S/S T2 HT Tripped showing LV E/F, LV O/C and Gen trip relays Due to None"
      },
      {
        "time": "08:17 - 09:06",
        "plant": "Sylhet 132/33kV S/S T2 LT Tripped showing LV E/F, LV O/C and gen trip relays",
        "load": "HT Outage",
        "reason": "Due to None",
        "full_desc": "Sylhet 132/33kV S/S T2 LT Tripped showing LV E/F, LV O/C and gen trip relays Due to None"
      },
      {
        "time": "08:17 - 08:47",
        "plant": "Chattak-Sylhet 132 kV Ckt-2 Tripped from Sylhet 132/33kV end showing Distance relays.",
        "load": "HT Outage",
        "reason": "Chattak-Sylhet 132 kV Ckt-2 Tripped from Sylhet 132/33kV end showing Distance relays.",
        "full_desc": "Chattak-Sylhet 132 kV Ckt-2 Tripped from Sylhet 132/33kV end showing Distance relays."
      },
      {
        "time": "08:38 - 10:27",
        "plant": "Gopalganj 132/33kV S/S Transformer-03 LT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Md.Shakil Agm(A/C) Mollahat zonel office, Bagerhat Pbs. Breaker to ds clamp maintenance (B-Phase).",
        "full_desc": "Gopalganj 132/33kV S/S Transformer-03 LT Scheduled S/D Due to Md.Shakil Agm(A/C) Mollahat zonel office, Bagerhat Pbs. Breaker to ds clamp maintenance (B-Phase)."
      },
      {
        "time": "08:39 - 10:26",
        "plant": "Gopalganj 132/33kV S/S Transformer-03 HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Md.Shakil Agm(A/C) Mollahat zonel office, Bagerhat Pbs. Breaker to ds clamp maintenance (B-Phase).",
        "full_desc": "Gopalganj 132/33kV S/S Transformer-03 HT Scheduled S/D Due to Md.Shakil Agm(A/C) Mollahat zonel office, Bagerhat Pbs. Breaker to ds clamp maintenance (B-Phase)."
      },
      {
        "time": "08:55 - 21:13",
        "plant": "Korerhat 400/230/132kV S/S Mirsharai-2 Project Work S/D",
        "load": "HT Outage",
        "reason": "Due to For project work",
        "full_desc": "Korerhat 400/230/132kV S/S Mirsharai-2 Project Work S/D Due to For project work"
      },
      {
        "time": "09:09",
        "plant": "Kaliakoir 400/230/132kV S/S 400/132kV TR-3 HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to SAS Testing and Commissioning.",
        "full_desc": "Kaliakoir 400/230/132kV S/S 400/132kV TR-3 HT Scheduled S/D Due to SAS Testing and Commissioning."
      },
      {
        "time": "09:10",
        "plant": "Madunaghat-Meghnaghat 400kV Ckt-1",
        "load": "HT Outage",
        "reason": "Madunaghat-Meghnaghat 400kV Ckt-1 is restored.",
        "full_desc": "Madunaghat-Meghnaghat 400kV Ckt-1 is restored."
      },
      {
        "time": "09:11",
        "plant": "Kaliakoir 400/230/132kV S/S 400/132kV TR-3 LT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to SAS Testing and Commissioning.",
        "full_desc": "Kaliakoir 400/230/132kV S/S 400/132kV TR-3 LT Scheduled S/D Due to SAS Testing and Commissioning."
      },
      {
        "time": "09:17 - 12:39",
        "plant": "Sherpur(Bogura)-Sirajgonj 132 kV Ckt-2 Scheduled",
        "load": "HT Outage",
        "reason": "Due to Conductor Armoring Work and from Bog-Sherpur 132/33kVend.",
        "full_desc": "Sherpur(Bogura)-Sirajgonj 132 kV Ckt-2 Scheduled S/D from Sirajganj 132/33kV end Due to Conductor Armoring Work and from Bog-Sherpur 132/33kVend."
      },
      {
        "time": "09:29 - 19:07",
        "plant": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled",
        "load": "HT Outage",
        "reason": "Due to maintenance work",
        "full_desc": "Madunaghat-Meghnaghat 400kV Ckt-1 Scheduled S/D from Meghnaghat 400/230kV end Due to maintenance work"
      },
      {
        "time": "09:30 - 19:09",
        "plant": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D",
        "load": "HT Outage",
        "reason": "Due to For project work",
        "full_desc": "Korerhat 400/230/132kV S/S Meghnaghat-1 Project Work S/D Due to For project work"
      },
      {
        "time": "09:54 - 21:17",
        "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D",
        "load": "HT Outage",
        "reason": "Due to For project work",
        "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph LT Project Work S/D Due to For project work"
      },
      {
        "time": "09:54 - 21:15",
        "plant": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D",
        "load": "HT Outage",
        "reason": "Due to For project work",
        "full_desc": "Korerhat 400/230/132kV S/S ATR-2(7203T)-Three Ph HT Project Work S/D Due to For project work"
      },
      {
        "time": "10:17 - 11:40",
        "plant": "Ishurdi 230/132kV S/S 230 kV Bus 2 Project Work S/D",
        "load": "HT Outage",
        "reason": "Ishurdi 230/132kV S/S 230 kV Bus 2 Project Work S/D",
        "full_desc": "Ishurdi 230/132kV S/S 230 kV Bus 2 Project Work S/D"
      },
      {
        "time": "10:39 - 16:23",
        "plant": "Sherpur 132/33kV S/S Transformer- 03 LT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to TR-03 132 KV DS box installation works.",
        "full_desc": "Sherpur 132/33kV S/S Transformer- 03 LT Scheduled S/D Due to TR-03 132 KV DS box installation works."
      },
      {
        "time": "10:40 - 16:20",
        "plant": "Sherpur 132/33kV S/S Transformer- 03 HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to TR-03 132 KV DS box installation works.",
        "full_desc": "Sherpur 132/33kV S/S Transformer- 03 HT Scheduled S/D Due to TR-03 132 KV DS box installation works."
      },
      {
        "time": "12:00",
        "plant": "Day peak generation",
        "load": "14441 MW",
        "reason": "Day peak generation is 14441 MW.",
        "full_desc": "Day peak generation is 14441 MW."
      },
      {
        "time": "12:23 - 13:06",
        "plant": "Ishurdi 230/132kV S/S 230 kV Bus 1 Project Work S/D",
        "load": "HT Outage",
        "reason": "Ishurdi 230/132kV S/S 230 kV Bus 1 Project Work S/D",
        "full_desc": "Ishurdi 230/132kV S/S 230 kV Bus 1 Project Work S/D"
      },
      {
        "time": "17:10 - 18:25",
        "plant": "Purbasadipur-Thakurgaon-EPV  132kV Ckt-2 Forced",
        "load": "HT Outage",
        "reason": "Due to বাসাবাড়ির প্যানেল তুলতে গিয়ে কন্ডাকর ছিড়ে ফেলেছে। তাই আর্মারিং করার জন্য শাটডাউন প্রয়োজন।",
        "full_desc": "Purbasadipur-Thakurgaon-EPV  132kV Ckt-2 Forced S/D from Purbasadipur 230/132/33kV end Due to বাসাবাড়ির প্যানেল তুলতে গিয়ে কন্ডাকর ছিড়ে ফেলেছে। তাই আর্মারিং করার জন্য শাটডাউন প্রয়োজন।"
      },
      {
        "time": "19:26",
        "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT Forced S/D",
        "load": "HT Outage",
        "reason": "Due to T-2 transformer 33 kv side PT oill leakage",
        "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) LT Forced S/D Due to T-2 transformer 33 kv side PT oill leakage"
      },
      {
        "time": "19:26",
        "plant": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT Forced S/D",
        "load": "HT Outage",
        "reason": "Due to T-2 transformer 33 kv side PT oill leakage",
        "full_desc": "Kishoreganj 132/33kV S/S Tr-2 (414T) HT Forced S/D Due to T-2 transformer 33 kv side PT oill leakage"
      },
      {
        "time": "20:17",
        "plant": "Rampal 1320 MW (BIFPCL) Synchronized with remarks:- U1",
        "load": "1320 MW",
        "reason": "Rampal 1320 MW (BIFPCL) Synchronized with remarks:- U1",
        "full_desc": "Rampal 1320 MW (BIFPCL) Synchronized with remarks:- U1"
      },
      {
        "time": "21:00",
        "plant": "Evening Peak Generation: 15700 MW.",
        "load": "15700 MW",
        "reason": "Evening Peak Generation: 15700 MW.",
        "full_desc": "Evening Peak Generation: 15700 MW."
      },
      {
        "time": "06:00",
        "plant": "Patuakhali-Payra  132kV Ckt-1 Scheduled",
        "load": "HT Outage",
        "reason": "Due to High temperature Maintenance",
        "full_desc": "Patuakhali-Payra  132kV Ckt-1 Scheduled S/D from Payra 400/132/33kV end Due to High temperature Maintenance"
      },
      {
        "time": "07:36",
        "plant": "Purbasadipur 230/132/33kV S/S TR-4 LT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Uthrail 33kv feeder red hot",
        "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 LT Scheduled S/D Due to Uthrail 33kv feeder red hot"
      },
      {
        "time": "07:36",
        "plant": "Purbasadipur 230/132/33kV S/S TR-4 HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Uthrail 33kv feeder red hot",
        "full_desc": "Purbasadipur 230/132/33kV S/S TR-4 HT Scheduled S/D Due to Uthrail 33kv feeder red hot"
      },
      {
        "time": "07:40",
        "plant": "Baroirhat 132/33kV S/S TR-1, 406T HT Scheduled S/D",
        "load": "HT Outage",
        "reason": "Due to Maintenance work",
        "full_desc": "Baroirhat 132/33kV S/S TR-1, 406T HT Scheduled S/D Due to Maintenance work"
      }
    ],
    "hourlyLoadData": [
      {
        "time": "00:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "01:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "02:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "03:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "04:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "05:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "06:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "07:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "08:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "09:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "10:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "11:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "12:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "13:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "14:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "15:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "16:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "17:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      },
      {
        "time": "18:00",
        "generation": 15700.01,
        "loadShed": 0,
        "demand": 15700.01
      },
      {
        "time": "19:00",
        "generation": 15700.01,
        "loadShed": 0,
        "demand": 15700.01
      },
      {
        "time": "20:00",
        "generation": 15700.01,
        "loadShed": 0,
        "demand": 15700.01
      },
      {
        "time": "21:00",
        "generation": 15700.01,
        "loadShed": 0,
        "demand": 15700.01
      },
      {
        "time": "22:00",
        "generation": 15700.01,
        "loadShed": 0,
        "demand": 15700.01
      },
      {
        "time": "23:00",
        "generation": 14441.07,
        "loadShed": 0,
        "demand": 14441.07
      }
    ],
    "gasProductionData": [
      {
        "company": "BGFCL (Titas, Habiganj, Bakhrabad)",
        "fields": 5,
        "gas": 477.7,
        "condensate": 370,
        "share": 18.4
      },
      {
        "company": "SGFL (Sylhet, Rashidpur, Kailashtila)",
        "fields": 5,
        "gas": 92.7,
        "condensate": 359.8,
        "share": 3.6
      },
      {
        "company": "BAPEX (Shahbazpur, Srikail, Begumganj)",
        "fields": 9,
        "gas": 93.4,
        "condensate": 69.1,
        "share": 3.6
      },
      {
        "company": "Chevron (Bibiyana, Jalalabad, Moulavibazar)",
        "fields": 3,
        "gas": 895.8,
        "condensate": 4776.5,
        "share": 34.5
      },
      {
        "company": "Tullow (Bangora)",
        "fields": 1,
        "gas": 31.4,
        "condensate": 93,
        "share": 1.2
      },
      {
        "company": "RPGCL (R-LNG Import / LNG Terminal)",
        "fields": 0,
        "gas": 1002.7,
        "condensate": 0,
        "share": 38.7
      }
    ],
    "gasDistributionData": [
      {
        "company": "TGTDCL (Dhaka & Mymensingh)",
        "power": 270.4,
        "fertilizer": 73.1,
        "others": 1054.4,
        "total": 1397.9
      },
      {
        "company": "BGDCL (Cumilla & Sylhet)",
        "power": 207.2,
        "fertilizer": 0,
        "others": 88.3,
        "total": 295.4
      },
      {
        "company": "KGDCL (Chattogram)",
        "power": 36.6,
        "fertilizer": 38.3,
        "others": 171,
        "total": 246
      },
      {
        "company": "JGTDSL (Sylhet region)",
        "power": 221.1,
        "fertilizer": 40.1,
        "others": 113.1,
        "total": 374.3
      },
      {
        "company": "PGCL (Rajshahi & Rangpur)",
        "power": 127.9,
        "fertilizer": 0,
        "others": 29.4,
        "total": 157.3
      },
      {
        "company": "SGCL (Barishal & Khulna)",
        "power": 54.2,
        "fertilizer": 0,
        "others": 4.6,
        "total": 58.8
      }
    ]
  },
  "2026-06-25": {
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
  "2026-06-26": {
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
  "2026-06-27": {
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
  "2026-06-28": {
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
  "2026-06-29": {
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
} as Record<string, GridDailyData>;

export function getArchiveFallback(isoDate: string): GridDailyData | null {
  return powerGridArchive[isoDate] ?? null;
}
