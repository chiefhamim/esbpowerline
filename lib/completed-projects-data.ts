export interface CompletedProjectItem {
  name: string;
  objectives: string[];
  scope: string[];
  cost: {
    total: string;
    gob: string;
    pa: string;
    pgcb: string;
  };
  partner: string;
  duration: string;
  lastUpdated: string;
  source: string;
}

export const completedProjectsData: CompletedProjectItem[] = [
  // --- BATCH 1: PROJECTS 1 - 10 ---
  {
    name: "132 kV Grid Network Development Project in Eastern Region",
    objectives: [
      "To increase the power supply reliability of Mymensingh area.",
      "To reduce dependency on Ashuganj-Kishorganj 132kV line.",
      "To evacuate the Power from the upcoming Power Plant in Mymensingh area.",
      "To meet the growing demand of Rangamati, Khagrachari, Beanibazar & Sunamganj.",
      "To supply reliable power to Hill Tract area.",
      "To minimize the accumulation of huge power at Ashuganj 132 kV bus bar.",
      "To minimize the overloading of existing Ashuganj-Ghorasal 132 kV transmission line.",
      "To strengthen the power evacuation arrangement & increase power supply stability, reliability & transmission capability in Ashuganj & Ghorasal area."
    ],
    scope: [
      "132 kV double circuit line : 237 km",
      "132 kV single circuit line : 58 km",
      "132/33 kV SS: 4 nos.",
      "132 kV Bay Extension: 17 nos.",
      "132 kV Bay Modification: 3 nos.",
      "Conversion of Single Bus-bar configuration into Double Bus-bar at 132/33 kV S/S",
      "Installation of one 132/33 kV 75 MVA transformer"
    ],
    cost: {
      total: "BDT 98,256.59 Lakh",
      gob: "BDT 17,442.81 Lakh",
      pa: "BDT 68,087.69 Lakh",
      pgcb: "BDT 12,726.09 Lakh"
    },
    partner: "ADB",
    duration: "January, 2013 to December, 2018",
    lastUpdated: "2020-12-30 05:47:13",
    source: "Project Planning"
  },
  {
    name: "400/230/132 kV Grid Network Development Project",
    objectives: [
      "To evacuate the power from the upcoming power plants at Ghorasal.",
      "Up gradation of 230KV transmission network at North-Eastern region of Dhaka.",
      "To meet the growing demands of greater Dhaka, Chittagong and Sylhet areas.",
      "Up gradation of existing 3 nos of 132KV sub-stations at Comilla (South), Modunaghat (Chittagong) and Manikganj."
    ],
    scope: [
      "400 KV Ghorashal-Tongi Double Circuit transmission line: 28 km",
      "230 kV transmission line: 55.3 km (U/G:4.3km)",
      "132 kV transmission line: 173km",
      "230/132/33 kV substation:02 Nos, (2x300 MVA each )",
      "230/132 kV substation:02 Nos, (2x300 MVA each)",
      "230/132 kV switching station: 01 Nos",
      "132/33 kV S/S all over the country: 09 Nos (Total 1702MVA)",
      "Bay extension 230kV: 6 Nos.,",
      "Bay extension 132 kV: 4 Nos",
      "132/33 kV Substation up gradation: 03 Nos (Total 300MVA)"
    ],
    cost: {
      total: "302,958.17 Lakh BDT",
      gob: "44,585.07 Lakh BDT",
      pa: "195,446.75 Lakh BDT",
      pgcb: "62,926.35 Lakh BDT"
    },
    partner: "IDB, ADB",
    duration: "July, 2013 to December, 2025",
    lastUpdated: "2026-04-01 09:25:18",
    source: "Project Planning"
  },
  {
    name: "Aminbazar - Maowa - Mongla 400 KV Transmission Line Project",
    objectives: [
      "The main objective of the project is to create facilities to evacuate power from the upcoming Rampal, Payra Coal Power Plant and Rooppur Nuclear Power Plant (partial)."
    ],
    scope: [
      "Construction of Aminbazar-Gopalgonj 400 kV Double Circuit line: 75.00 km.",
      "Construction of Gopalgonj-Mongla 400 kV Double Circuit line: 96.93 km.",
      "Construction of river crossing 400kV Double Circuit line beside Padma Bridge: 7.50 km.",
      "Construction of 400 kV AIS substation at Aminbazar with 3×520 MVA 400/230 kV, 3-Phase transformer."
    ],
    cost: {
      total: "235,325.20 Lakh BDT",
      gob: "81,113.89 Lakh BDT",
      pa: "121,856.69 Lakh BDT",
      pgcb: "32,354.62 Lakh BDT"
    },
    partner: "ADB",
    duration: "July, 2016 to June, 2023",
    lastUpdated: "2023-07-27 10:22:05",
    source: "Project Planning"
  },
  {
    name: "Aminbazar - Old Airport 230 kV Transmission Line and Associated Substations",
    objectives: [
      "To meet the growing power demand of western part of Dhaka city and to relieve the existing transmission network of the area.",
      "To enhance the reliability of power supply to the western part of Dhaka city."
    ],
    scope: [
      "Aminbazar to Kallayanpur 230 kV Overhead Line",
      "Kallyanpur to Old Airport 230 kV U/G Line",
      "Old Airport to Dhaka University 132 kV U/G Line",
      "Old Airport to Cantonment 132 kV U/G Line",
      "Ullon to Rampura 132 kV U/G Line",
      "Extension of 230/132 kV Substation at Aminbazar",
      "230/132 kV GIS Substation at Old-Airport",
      "132/33 kV GIS Substation at Dhaka University",
      "132/33 kV GIS Substation at Cantonment"
    ],
    cost: {
      total: "753.80 Crore BDT",
      gob: "222.331 Crore BDT",
      pa: "61.60 Million USD",
      pgcb: "50.997 Crore BDT"
    },
    partner: "ADB",
    duration: "August, 2006 to December, 2014",
    lastUpdated: "2020-12-30 04:31:38",
    source: "Project Planning"
  },
  {
    name: "Aminbazar-Savar 132 kV Transmission Line & Savar 132/33 kV Substation Project",
    objectives: [],
    scope: [
      "132 KV Line (15.7 km) from Aminbazar to Savar.",
      "New 132/33 KV Substation (150 MVA) at Savar."
    ],
    cost: {
      total: "94.55 Crore BDT",
      gob: "N/A",
      pa: "N/A",
      pgcb: "N/A"
    },
    partner: "N/A",
    duration: "2007-08 to 2009-10",
    lastUpdated: "2020-12-30 04:16:50",
    source: "Project Planning"
  },
  {
    name: "Amnura 132/33 kV Grid Substation with associated 132 kV Transmission Line Project",
    objectives: [
      "To evacuate power from existing 50 MW and upcoming 100 MW power plants at Amnura and to meet the growing demand of Amnura area of Chapainawabganj district."
    ],
    scope: [
      "132 kV single circuit pole line (Most of the Poles will be provided from PGCB store), from Rajshahi-Chapainawabganj 132 kV line (T connection at 1 km away from Chapainawabganj substation) to Amunra substation on single circuit pole line : 15 km (Single Grossbeak)",
      "132/33 kV AIS substation, Double Bus Scheme with 132/33 kV, 1 x 35/50 MVA 3-Phase transformer; 132 kV Line Bay: 4 nos., 132 kV Transformer Bay: 1 no., 132 kV Coupler Bay: 1 no., 33 kV Transformer Bay: 1 no."
    ],
    cost: {
      total: "BDT 9,166.55 Lakh",
      gob: "BDT 4,163.91 Lakh (Local Currency)",
      pa: "BDT 5,002.64 Lakh (Foreign Currency)",
      pgcb: "N/A"
    },
    partner: "N/A",
    duration: "January, 2014 to December, 2019",
    lastUpdated: "2020-12-30 05:55:39",
    source: "Project Planning"
  },
  {
    name: "Ashuganj - Shahjibazar 132 KV Single Circuit Transmission Line Project",
    objectives: [
      "To ensure reliable transmission of generated power in greater Sylhet area.",
      "To minimize overloading of existing Ashuganj-Shahjibazar 132 kV line.",
      "To reduce transmission loss."
    ],
    scope: [
      "132 KV Line (53 km) from Ashuganj to Shahjibazar",
      "132 KV Bay Extension at Ashuganj, Sylhet, Shahjibazar, and Fenchuganj"
    ],
    cost: {
      total: "15.90 Crore BDT",
      gob: "N/A",
      pa: "N/A",
      pgcb: "N/A"
    },
    partner: "N/A",
    duration: "2007-08 to 2009-10",
    lastUpdated: "2020-12-30 04:17:44",
    source: "Project Planning"
  },
  {
    name: "Ashuganj-Bhulta 400 kV Transmission Line",
    objectives: [
      "To enhance the capacity of existing 132/33 kV substation.",
      "To increase reliability of power supply at Dhaka area."
    ],
    scope: [
      "Ashuganj-Bhulta 400kV double circuit line: 69.00 km",
      "LILO of Haripur-Rampura 230kV double circuit line at Bhulta Substation: 3.414 km",
      "LILO of Ghorashal-Rampura 230kV double circuit line at Bhulta Substation: 1.10 km",
      "Bhulta 400/230 kV 2x520 MVA AIS Substation"
    ],
    cost: {
      total: "107,970.46 Lakh BDT",
      gob: "14,692.33 Lakh BDT",
      pa: "77,468.33 Lakh BDT",
      pgcb: "15,809.80 Lakh BDT"
    },
    partner: "N/A",
    duration: "July, 2014 to December, 2019",
    lastUpdated: "2025-07-02 10:50:10",
    source: "Project Planning"
  },
  {
    name: "Bangladesh Power System Reliability and Efficiency Improvement Project",
    objectives: [
      "To address some fundamental measures that must be put in place so that the power system can be operated in a secure and economic manner in line with the longer term goals to deliver much greater quantum of power."
    ],
    scope: [
      "Reconductoring of Barisal(N)-Barisal 132 kV Double Circuit line: 10km",
      "Reconductoring of Saidpur-Purbasadipur 132 kV Double Circuit line: 30 km",
      "Introduction of DLR (Dynamic Line Rating) for 400 km of most important transmission lines of PGCB.",
      "Integration of generators to the NLDC’s SCADA/EMS system, upgradation/modernization of the NLDC’s SCADA/EMS system to meet future needs."
    ],
    cost: {
      total: "30,211.70 Lakh BDT",
      gob: "5,163.43 Lakh BDT",
      pa: "21,868.98 Lakh BDT",
      pgcb: "3,179.29 Lakh BDT"
    },
    partner: "World Bank",
    duration: "July, 2017 to June, 2025",
    lastUpdated: "2025-07-02 10:28:46",
    source: "Project Planning"
  },
  {
    name: "Barisal-Bhola-Burhanuddin 230 kV Transmission Line Project",
    objectives: [
      "To evacuate the power to be generated at the proposed power plant at Shahbajpur, Bhola.",
      "To minimize the overloading of the existing Bhola-Patuakhali 33 kV line.",
      "To strengthen the power evacuation arrangement & increasing power supply stability, reliability & transmission capability in Barisal area."
    ],
    scope: [
      "Construction of overland 230 kV Transmission Line from Kutuba (Borhanuddin) to Gajalia, Babuganj (Barisal)-55.55 km.",
      "Tetulia and Kalbadar River Crossing-5.45 km.",
      "230/132 kV, 3x225 MVA substation at Gajalia, Babuganj."
    ],
    cost: {
      total: "BDT 453.4260 Crore",
      gob: "N/A",
      pa: "BDT 167.0179 Crore (Foreign Currency)",
      pgcb: "BDT 286.4081 Crore (Local Currency)"
    },
    partner: "N/A",
    duration: "March, 2011 to June, 2017",
    lastUpdated: "2020-12-30 05:42:37",
    source: "Project Planning"
  },

  // --- BATCH 2: PROJECTS 11 - 20 (From completed 20.txt) ---
  {
    name: "Bibiyana - Comilla (North) 230 kV Transmission Line Project",
    objectives: [
      "To evacuate the surplus Power of Sylhet & Fenchuganj Area to the national grid.",
      "To deliver more power to Comilla & Chittagong area from Sylhet.",
      "To reduce the overloading of existing transmission lines in Sylhet & its adjacent area.",
      "To relieve the existing \"Ashuganj-Comilla 230 kV transmission line\" from overloading.",
      "To reduce the transmission loss to some extent."
    ],
    scope: [
      "Construction of Bibiyana-Comilla (North) double Circuit 230 kV Transmission Line: 153.632 km.",
      "Construction of two nos. of 230 kV bay extension at existing Comilla (North) 230/132 kV Substation at 230kV side."
    ],
    cost: {
      total: "369.50 Crore BDT",
      gob: "229.95 Crore BDT",
      pa: "N/A",
      pgcb: "139.55 Crore BDT"
    },
    partner: "N/A",
    duration: "Oct, 2010 to June, 2013",
    lastUpdated: "2020-12-30 04:15:37",
    source: "Project Planning"
  },
  {
    name: "Bibiyana-Kaliakoir 400 KV and Fenchuganj-Bibiyana 230kV Transmission Line Project",
    objectives: [
      "To transfer more power & relieve the existing transmission network from Sylhet area towards Dhaka.",
      "To ensure adequate supply of power to northern part of Dhaka.",
      "To evacuate surplus power to be generated from existing & up-coming power plants (including Bibiyana) of Sylhet area to national Grid."
    ],
    scope: [
      "168.64 km 400 kV Bibiyana-Kaliakoir Double ckt line.",
      "33.18 km Fenchuganj-Bibiyana 230 kV double ckt line.",
      "Installation of 400/230 kV 1x520 MVA transformer at Bibiyana.",
      "400/230 kV, 1x520 MVA & 400/132 kV, 2x325 MVA S/S at Kaliakoir.",
      "230/132 kV, 1x300 MVA S/S at Fenchuganj and renovation & extension of existing 132 kV substation at Fenchuganj.",
      "Construction of 36 km 230 kV line for turn-in and out of existing Aminbazar-Tongi 230 kV line on four ckt tower at Kaliakoir.",
      "Construction of 5 km 132 kV line for turn-in and out of existing Kabirpur-Tangail 132 kV line on four ckt tower at Kaliakoir.",
      "Construction of 16 km Kaliakoir-Dhamrai double circuit 132 kV line.",
      "Construction of about 3.75 km 132 kV Four circuit transmission line on Four circuit tower from Fenchuganj SS to Fenchuganj PS."
    ],
    cost: {
      total: "BDT 2,010.5656 Crore",
      gob: "BDT 795.1881 Crore",
      pa: "BDT 740.00 Crore (92.5 m USD)",
      pgcb: "BDT 475.3775 Crore"
    },
    partner: "EDCF (Korea)",
    duration: "July, 2010 to June, 2017",
    lastUpdated: "2020-12-30 05:44:07",
    source: "Project Planning"
  },
  {
    name: "Capacity Upgradation (500 MW) of the existing Bangladesh (Bheramara)-India (Baharampur) Grid Interconnection",
    objectives: [
      "To import additional 500 MW power from India through capacity upgradation of the existing Bangladesh (Bheramara) – India (Baharampur) Grid Interconnection.",
      "To meet up the ever increasing demand of electricity for socio economic development in both the countries."
    ],
    scope: [
      "230 kV Double Circuit Transmission Line with river crossing : 12 km (Double Circuit Tower, Quad Mallard)",
      "500 MW HVDC Back-to-Back Station (2nd Module) including 400 kV & 230 kV Switchyard Equipment, Control & Protection etc.",
      "230 kV Bay extension: 4 nos."
    ],
    cost: {
      total: "185,479.51 Lakh BDT",
      gob: "58,091.26 Lakh BDT",
      pa: "100,045.23 Lakh BDT",
      pgcb: "27,343.02 Lakh BDT"
    },
    partner: "ADB",
    duration: "January, 2015 to December, 2018",
    lastUpdated: "2020-12-30 05:53:07",
    source: "Project Planning"
  },
  {
    name: "Comilla-Meghnaghat-Haripur 230 kV Transmission Line and Turn in and out at Rampura of Existing Ghorasal-Haripur 230 kV Transmission Line Project",
    objectives: [
      "To enhance transmission of electrical energy from the proposed 450 MW Meghnaghat power plant to Dhaka and Chittagong including other areas of eastern grid.",
      "To avoid overloading of Ullon S/S and Ashuganj-Ghorasal 230 kV transmission line.",
      "To enhance transmission of electrical energy from Siddhirganj 210 MW power plant towards in greater Dhaka.",
      "To Increase the stability, transmission capacity and reliability of eastern grid specially in greater Dhaka region.",
      "To reduce technical loss of 132 kV transmission line and improvement of voltage level.",
      "To construct a 230 kV transmission facility to provide alternative routes other than Ashuganj-Ghorasal-Tongi 230 kV lines for transmission of electrical energy between the major load centres like Dhaka and Chittagong."
    ],
    scope: [
      "230 kV Transmission line: 97.60 km",
      "New 230/132 kV Sub-station at Rampura",
      "Extension of 230/132 kV Sub-station: 8 bays"
    ],
    cost: {
      total: "374.33 Crore BDT",
      gob: "180.45 Crore BDT",
      pa: "193.88 Crore BDT",
      pgcb: "N/A"
    },
    partner: "ADB",
    duration: "1997-1998 to 2002-2003",
    lastUpdated: "2020-12-30 04:05:04",
    source: "Project Planning"
  },
  {
    name: "Construction & Extension of Grid Substations including Transmission Line Facilities (Phase-1)",
    objectives: [
      "To meet up the increasing demand of electricity in the areas Daudkandi, Brahmanbaria, Munshiganj, Meghnaghat and Gallamari through Construction of New 132/33 kV Substations.",
      "To enhance the Capacity of existing 132/33 kV Substation at Hasnabad in order to meet up the current demand of the area.",
      "To release overload from the transformer in existing 230/132 kV Substation at Comilla, Rampura, Haripur, Aminbazar and Hathazari.",
      "To reduce load shading in the proposed areas.",
      "To increase stability & reliability of power supply.",
      "To improve voltage profile."
    ],
    scope: [
      "132 kV Line: 47 km Double Circuit",
      "132/33 kV Substation: 5 nos.",
      "Substation Extension: 6 nos.",
      "Bay Extension: 2 nos. (132 kV side)"
    ],
    cost: {
      total: "770.31 Crore BDT",
      gob: "310.35 Crore BDT",
      pa: "460.00 Crore BDT",
      pgcb: "N/A"
    },
    partner: "ADB, JICA",
    duration: "July, 2005 to June, 2014",
    lastUpdated: "2020-12-30 04:22:05",
    source: "Project Planning"
  },
  {
    name: "Construction of 230 kV Switching Substation at Bibiyana",
    objectives: [
      "To evacuate power to be generated from Bibiyana power plant to national grid.",
      "To increase power supply stability, reliability, and transmission capability in Sylhet area."
    ],
    scope: [
      "Construction of 230 kV Switching Substation at Bibiyana",
      "Construction of 230kV LILO (0.97km) line from Fenchuganj-Comilla (N) at Bibiyana Substation"
    ],
    cost: {
      total: "117.32 Crore BDT",
      gob: "75.75 Crore BDT (Local Currency)",
      pa: "5.35 Million USD (Foreign Currency)",
      pgcb: "N/A"
    },
    partner: "N/A",
    duration: "June 2013 to June 2015",
    lastUpdated: "2020-12-30 05:34:05",
    source: "Project Planning"
  },
  {
    name: "Construction of Bakerganj-Barguna 132kV Transmission Line & Barguna 132/33kV Substation",
    objectives: [
      "To ensure reliable and uninterrupted power supply to Barguna and its neighboring areas."
    ],
    scope: [
      "Bakerganj-Barguna 132kV Single Circuit Stringing on double circuit towers: 50.22 km",
      "Construction of Barguna 132/33 kV AIS Substation: 2x50/75 MVA"
    ],
    cost: {
      total: "12,313.79 Lakh BDT",
      gob: "10,853.73 Lakh BDT",
      pa: "N/A",
      pgcb: "1,460.06 Lakh BDT"
    },
    partner: "N/A",
    duration: "July, 2017 to June, 2021",
    lastUpdated: "2021-07-04 09:40:47",
    source: "Project Planning"
  },
  {
    name: "Construction of Bheramara (Bangladesh)-Baharampur(India) 2nd 400kV Transmission Line (Bangladesh Portion)",
    objectives: [
      "To ensure reliable transmission for 1000MW power import from India."
    ],
    scope: [
      "Bheramara(Bangladesh)-Baharampur(India) 2nd 400 kV double circuit transmission line construction: 28 km",
      "400kV Bay Extension: 2 no's at Bheramara HVDC"
    ],
    cost: {
      total: "18,930.55 Lakh BDT",
      gob: "17,403.91 Lakh BDT",
      pa: "N/A",
      pgcb: "1,526.64 Lakh BDT"
    },
    partner: "N/A",
    duration: "October, 2017 to June, 2021",
    lastUpdated: "2021-07-04 09:43:29",
    source: "Project Planning"
  },
  {
    name: "Construction of Haripur 360 MW Combined Cycle Power Plant & Associated Substation (PGCB part in EGCB's project)",
    objectives: [
      "To meet the electricity demand of the country especially Dhaka region by local generation & to enhancement of generation system capability.",
      "To accelerate the economic development of the country by adequate and reliable power generation in order to attain the planned target of power demand.",
      "To increase the power generation through optimum utilization of country's natural gas resources.",
      "To overcome the present generation shortage by increasing generation and to minimize load-shedding.",
      "To enhance the stability and reliability of the national grid system and reduce the Transmission loss by localized generation.",
      "To improve the economic development activities by reducing system loss.",
      "To develop human resources through transfer of technology."
    ],
    scope: [
      "Upgradation and Control room building Extension of Haripur 132/33 kV Substation"
    ],
    cost: {
      total: "223.76 Crore BDT",
      gob: "41.05 Crore BDT",
      pa: "182.71 Crore BDT",
      pgcb: "N/A"
    },
    partner: "JICA",
    duration: "July, 2007 to June, 2014",
    lastUpdated: "2020-12-30 04:27:09",
    source: "Project Planning"
  },
  {
    name: "Construction of Patuakhali (Payra) - Gopalganj 400 kV Transmission Line & Gopalganj 400 kV Grid Substation",
    objectives: [
      "The main objective of the project is to create necessary facilities to evacuate power from upcoming coal based Payra 1320 MW Power Plant."
    ],
    scope: [
      "Construction of Patuakhali (Payra) - Gopalganj 400 kV Double Circuit line: 163.43km",
      "Construction of Line In Line Out (LILO) of Madaripur - Gopalganj (Old) 132 kV double circuit line at Gopalganj (New) substation: 11.87km",
      "Construction of Line In Line Out (LILO) of Madaripur - Faridpur 132 kV double circuit line at Gopalganj (New) substation: 1.08km",
      "Construction of Gopalganj 400/132 kV, 3x325 MVA AIS Substation"
    ],
    cost: {
      total: "248,412.19 Lakh BDT",
      gob: "23,721.26 Lakh BDT",
      pa: "208,020.20 Lakh BDT",
      pgcb: "16,670.73 Lakh BDT"
    },
    partner: "ADB",
    duration: "January, 2017 to June, 2023",
    lastUpdated: "2025-07-02 10:51:22",
    source: "Project Planning"
  },

  // --- BATCH 3: PROJECTS 21 - 35 (From completed 35.txt) ---
  {
    name: "Construction of Rahanpur to Monakasha Border 400kV Transmission Line in Chapainawabganj District to Import Power from India (Jharkhand) to Bangladesh",
    objectives: [
      "To supply power imported to Bangladesh from the upcoming 2x800 MW (net 1496 MW) coal fired thermal power plant of Adani Power (Jharkhand) Limited (APJL) in Godda District of Jharkhand State in India to the national grid and to meet the growing power demand in Rajshahi and Rangpur region which is the agricultural economic centre of the country and as well as capital Dhaka."
    ],
    scope: [
      "400kV Double Circuit Transmission Line: 28km"
    ],
    cost: {
      total: "23,510.52 Lakh BDT",
      gob: "21,680.35 Lakh BDT",
      pa: "N/A",
      pgcb: "1,830.17 Lakh BDT"
    },
    partner: "N/A",
    duration: "July, 2019 to June, 2022",
    lastUpdated: "2022-07-03 11:15:30",
    source: "Project Planning"
  },
  {
    name: "Development of Transmission Infrastructure at Mirsharai Economic Zone for Reliable Power Supply",
    objectives: [
      "To supply reliable and uninterrupted electricity to Mirsharai Economic Zone and evacuate generated power from an upcoming power plant in nearby area."
    ],
    scope: [
      "400kV double circuit Mirsharai- BSRM transmission line: 16.41 km",
      "230/33kV Mirsharai GIS Substation: 01 Nos (2 x 120/140 MVA)",
      "Bay Extension of 230kV GIS Substation: 02 nos."
    ],
    cost: {
      total: "28,474.04 Lakh BDT",
      gob: "25,574.29 Lakh BDT",
      pa: "N/A",
      pgcb: "2,899.75 Lakh BDT"
    },
    partner: "N/A",
    duration: "July, 2017 to June, 2022",
    lastUpdated: "2025-09-29 10:51:01",
    source: "Project Planning"
  },
  {
    name: "Dhaka - Chattogram Main Power Grid Strengthening Project",
    objectives: [
      "The main objective of the project is to create facilities to evacuate power from upcoming Matarbari 1200MW power station.",
      "To establish a 400 kV transmission backbone line between Dhaka & Chittagong Area by constructing Meghnaghat-Madunaghat 400kV double circuit line."
    ],
    scope: [
      "Meghnaghat-Madunaghat 400 kV double circuit line : 214 km",
      "230 kV double circuit transmission line between Existing Madunaghat and New Madunaghat Substation: 8 km",
      "230 kV Transmission Line In-Line Out from Hathazari – Shikalbaha at New Madunaghat Substation: 5.5 km",
      "400 kV AIS substation at Meghnaghat : 01 Nos (Total: 2x750 MVA)",
      "400 kV GIS substation at Madunaghat: 01 Nos (3x750 MVA)",
      "230 kV AIS switching Station at Meghnaghat",
      "230 kV GIS switching Station at Madunaghat",
      "Up gradation of existing 132 kV substation to 230 kV voltage level at Madunaghat",
      "Installation of GIB and Shunt Reactor at Matarbari."
    ],
    cost: {
      total: "4,456,749.38 Lakh BDT",
      gob: "114,757.80 Lakh BDT",
      pa: "292,818.80 Lakh BDT",
      pgcb: "49,172.78 Lakh BDT"
    },
    partner: "JICA",
    duration: "July, 2016 to June, 2025",
    lastUpdated: "2025-07-02 10:27:52",
    source: "Project Planning"
  },
  {
    name: "Enhancement of Capacity of Grid Substations and Transmission Lines for Rural Electrification",
    objectives: [
      "To enhance the capacity of existing 132/33 kV substation.",
      "To supply the growing demand of the country.",
      "To ensure reliable power supply to rural area."
    ],
    scope: [
      "New 230/132/33 kV GIS substation: 01 no. (Total 3 x 225/300 MVA, 230/132 kV and 2 x 50/75 MVA, 132/33 kV)",
      "New 132/33 kV AIS substation: 05 nos. (Total 10 x 50/75 MVA, 132/33 kV).",
      "Capacity up-gradation of existing grid substations: 05 nos. (Total 10 x 50/75 MVA, 132/33 kV).",
      "New 132 kV double Ckt. line: 82.472 Km",
      "New 132 kV Single Ckt. line: 17.358 Km",
      "132 kV Double Ckt. Line in Line Out: 0.654 km",
      "132 kV Four Ckt. Re-routing and Interconnection: 6.932 km",
      "230 kV Double Ckt. Line in Line Out: 0.392 Km",
      "Reconductoring of existing 132 kV double circuit line: 227 Km",
      "Single circuit stringing of existing 132 kV double circuit line: 49.809 Km",
      "OPGW stringing replacing earth wire of existing 132 kV line: 101.706 Km",
      "New 132 kV Bay extensions at existing Grid substations: 5 nos.",
      "33 kV AIS Switching Station for PBS (at 6nos. New Grid substation): 6 nos."
    ],
    cost: {
      total: "107,970.46 Lakh BDT",
      gob: "14,692.33 Lakh BDT",
      pa: "77,468.33 Lakh BDT",
      pgcb: "15,809.80 Lakh BDT"
    },
    partner: "World Bank",
    duration: "July, 2014 to June, 2021",
    lastUpdated: "2021-07-04 03:35:50",
    source: "Project Planning"
  },
  {
    name: "Feasibility Study for the Transmission System Improvement, Western Zone",
    objectives: [
      "To assess technical and economic justification of the planned transmission system expansion in the power sub-sector, Western Zone.",
      "To assess power sector in the project areas, network analysis, route identification, survey of substation area etc.",
      "To assess expected benefits on the socio-economic situation of the populations in the project areas including Environmental and Social Impact Assessment (ESIA), mitigation measures and resettlement action.",
      "To perform cost estimation, economic and financial analysis."
    ],
    scope: [
      "Construction of Khulna(S)-Gopalganj; Double Circuit 132 kV Transmission Line (60 km).",
      "Second circuit stringing on the existing Gopalganj-Madaripur 132 kV Transmission Line (45 km).",
      "Construction of the Ishurdi-Rajshahi 230 kV double circuit transmission line: 70 km.",
      "Construction of a new 230/132 kV Rajshahi Substation and the installation of two 230/132 kV 225 MVA transformers at Rajshahi.",
      "Construction of Jhenaidah 230/132 kV Hub Substation, 2 x 225 MVA.",
      "Construction of new 132/33 kV AIS Substation Pansha (Rajbari).",
      "Construction of new 132/33 kV AIS Substation Mithapukur.",
      "Construction of new 132/33 kV AIS Substation Bhangura and new 25 km double circuit line from Baghabari.",
      "Bogra 230 / 132 kV Substation capacity expansion with a 225 MVA power transformer."
    ],
    cost: {
      total: "BDT 5.0069 Crore",
      gob: "N/A",
      pa: "0.471 Million Euro",
      pgcb: "N/A"
    },
    partner: "KfW, Germany",
    duration: "July 2013 to June 2015",
    lastUpdated: "2020-12-30 05:22:02",
    source: "Project Planning"
  },
  {
    name: "Feasibility Study to Connect Nuclear Power Plant with National Grid",
    objectives: [
      "The main objectives of the study are to identify the requirement of network development activities for smooth evacuation of generated power from upcoming 2x1255 MW NPP. To determine this, a comprehensive study has to be done based on the Technical Assignment Supplied by Atomstroyexport."
    ],
    scope: [
      "Identification of the requirement of network development activities for smooth evacuation of generated power from upcoming 2x1255 MW Rooppur Nuclear Power Plant.",
      "Formulating comprehensive recommendation for Bangladesh Grid Code to connect Rooppur Nuclear Power Plant at Bangladesh power system.",
      "Analyzing oscillation of voltage and frequency at tie line during fault condition.",
      "Incorporating system reliability analysis and power system stability analysis considering full load rejection of one unit (1250 MW).",
      "Conducting security analysis of national grid."
    ],
    cost: {
      total: "BDT 10.1037 Crore",
      gob: "BDT 9.2670 Crore",
      pa: "N/A",
      pgcb: "BDT 0.8367 Crore"
    },
    partner: "N/A",
    duration: "October, 2015 to December, 2016",
    lastUpdated: "2020-12-30 05:36:38",
    source: "Project Planning"
  },
  {
    name: "Goalpara - Bagerhat 132 kV Double Circuit Transmission Line Project",
    objectives: [
      "To ensure reliable transmission of power generated in the Western Zone.",
      "To solve overloading problem of existing Goalpara-Bagerhat 132 kV line.",
      "To reduce transmission loss."
    ],
    scope: [
      "About 45 km 132 kV double ckt. line including river crossing arrangement in four locations.",
      "One 132 kV bay Extension at Bagerhat.",
      "Replacement of bus conductor with higher capacity conductors at Bagerhat 132/33 kV substation."
    ],
    cost: {
      total: "BDT 89.2154 Crore",
      gob: "N/A",
      pa: "BDT 44.1702 Crore (Foreign Currency)",
      pgcb: "BDT 45.0452 Crore (Local Currency)"
    },
    partner: "N/A",
    duration: "January, 2013 to June, 2016",
    lastUpdated: "2020-12-30 05:57:00",
    source: "Project Planning"
  },
  {
    name: "Grid Interconnection between Bangladesh (Bheramara) and India (Baharampur)",
    objectives: [
      "To establish a Grid Interconnection between Bangladesh & India for facilitating exchange of electricity as and when it is possible & feasible.",
      "To meet up the ever increasing demand of electricity for socio economic development in both the countries."
    ],
    scope: [
      "400 kV Line: 27.3 km Double Circuit",
      "230 kV Line In/Out: 4.5 km",
      "Substation: 500 MW HVDC (Back-to Back)"
    ],
    cost: {
      total: "1579.83 Crore BDT",
      gob: "451.20 Crore BDT",
      pa: "910.70 Crore BDT",
      pgcb: "217.93 Crore BDT"
    },
    partner: "ADB",
    duration: "July, 2010 to June, 2014",
    lastUpdated: "2020-12-30 04:28:48",
    source: "Project Planning"
  },
  {
    name: "Grid Interconnection between Tripura (India) and Comilla (South substation) (Bangladesh)",
    objectives: [
      "To import 100MW power from Palatana power station(Tripura) to Comilla (south) substation in Bangladesh.",
      "To meet up the growing demand of electricity of Bangladesh by importing electricity from Palatana power station(Tripura)."
    ],
    scope: [
      "27 km 400 kV Double Circuit Transmission Line from Comilla (North) to Tripura Border and 16 km 132 kv Double Circuit Transmission Line from Comilla (South) to Comilla (North)",
      "132 kv Bay extension at Comilla (South) Substation - 2 nos."
    ],
    cost: {
      total: "BDT 171.7474 Crore",
      gob: "BDT 157.3655 Crore",
      pa: "N/A",
      pgcb: "BDT 14.3819 Crore"
    },
    partner: "N/A",
    duration: "January, 2015 to June, 2016",
    lastUpdated: "2020-12-30 05:26:28",
    source: "Project Planning"
  },
  {
    name: "Hasnabad-Aminbazar (Savar)-Tongi & Haripur-Meghnaghat 230 KV Transmission Line Project",
    objectives: [
      "To increase the stability, transmission capability and reliability of Grid network of Dhaka City and Greater Dhaka area.",
      "To reduce technical loss of 132 kV and 230 kV transmission lines of Dhaka area.",
      "To acquire off-loading of Tongi and Hasnabad 230 kV substations and improvement of voltage levels."
    ],
    scope: [
      "230 kV double circuit transmission line in Hasnabad-Aminbazar-Tongi.",
      "230 kV double circuit transmission line from Haripur to Meghnaghat.",
      "132 kV double circuit Overhead transmission line from Aminbazar to Kalyanpur.",
      "132 kV double circuit Overhead transmission line from Rampura-Mogbazar.",
      "132 kV double circuit Underground transmission line from Rampura-Gulshan.",
      "230/132 KV Sub-Station at Aminbazar.",
      "230/132 KV S/S Extension at Hasnabad(225 MVA) and at Tongi(225 MVA).",
      "132/33KV S/S Extension at Kalyanpur (225 MVA).",
      "132/33KV S/S Up gradation at Mirpur (150 MVA)."
    ],
    cost: {
      total: "257.64 Crore BDT",
      gob: "109.09 Crore BDT",
      pa: "148.55 Crore BDT",
      pgcb: "N/A"
    },
    partner: "ADB",
    duration: "2000-01 to 2005-06",
    lastUpdated: "2020-12-30 04:05:21",
    source: "Project Planning"
  },
  {
    name: "Institutional Strengthening of PGCB",
    objectives: [
      "To improve the quality of services delivered by PGCB through capacity development and institutional strengthening approach.",
      "To enhance institutional resources of the PGCB to improve utility performance, capacity development, institutional strengthening, financial management, operational skill improvement.",
      "To strengthen the capacity of technical and non-technical employees engaged in PGCB and enable them to manage the utilities effectively and achieve organizational goal efficiently."
    ],
    scope: [
      "Improving technical expertise skill development in: System Protection department, System Planning division, Project Planning division, CNST and SCADA division, Research and Technical services department, Design and Quality Control department, Project department and Human Resource department. Financial capacity development is also included."
    ],
    cost: {
      total: "2596.54 Lakh BDT",
      gob: "88.08 Lakh BDT",
      pa: "2333.44 Lakh BDT",
      pgcb: "175.02 Lakh BDT"
    },
    partner: "World Bank",
    duration: "January, 2016 to June, 2019",
    lastUpdated: "2020-12-30 05:54:15",
    source: "Project Planning"
  },
  {
    name: "Integrated Capacity Development Project in the Power Transmission System of Bangladesh",
    objectives: [
      "Enhancing the knowledge and technical skills of university undergraduate students of Bangladesh on advanced technologies relevant to the power sector and improving the skills of PGCB engineers to achieve power sector targets set by the government."
    ],
    scope: [
      "Enhancing the knowledge and technical skills of university undergraduate students of Bangladesh on advanced technologies relevant to the power sector and improving skills of PGCB engineers to achieve power sector targets set by the government."
    ],
    cost: {
      total: "816.69 Lakh BDT",
      gob: "N/A",
      pa: "547.05 Lakh BDT",
      pgcb: "269.64 Lakh BDT"
    },
    partner: "ADB",
    duration: "July, 2019 to Dec, 2024",
    lastUpdated: "2025-07-02 10:26:23",
    source: "Project Planning"
  },
  {
    name: "Ishwardi-Baghabari-Sirajganj-Bogra 230 kV Transmission Line Project",
    objectives: [
      "To make evacuation arrangement for the power generated from Sirajganj 150 MW Gas Turbine Power Plant, Baghabari 350 MW & 70 MW at Bera Power Plant.",
      "To increase the system capacity and stability.",
      "To reduce technical loss of electricity and improvement of voltage level.",
      "To transmit electrical energy among the major load centers."
    ],
    scope: [
      "Construction of Ishwardi-Baghabari 230 kV Transmission Line.",
      "Construction of Baghabari-Sirajganj-Bogra 230 kV Transmission Line.",
      "Construction of Baghabari 230/132 kV new Sub-Station & Ishwardi Substation extension."
    ],
    cost: {
      total: "464.94 Crore BDT",
      gob: "183.39 Crore BDT",
      pa: "281.54 Crore BDT",
      pgcb: "N/A"
    },
    partner: "ADB, KfW, Supplier's Credit - TATA India",
    duration: "2002-03 to 2008-09",
    lastUpdated: "2020-12-30 04:06:44",
    source: "Project Planning"
  },
  {
    name: "Joydevpur-Kabirpur-Tangail 132 kV Transmission Line Project",
    objectives: [
      "To ensure adequate and stable supply of electrical energy to areas under Kabirpur and Tangail substations.",
      "To improve the voltage profile at Tangail, Manikganj & Kabirpur Sub-Stations and to solve the low-voltage problem of the project areas.",
      "To create the alternative way of feeding the Kabirpur and Tangail sub-stations directly from Ghorasal Power Station via Ghorasal-Joydevpur 132 kV double circuit line, thereby reducing the possibility of over-loading the Ghorashal-Tongi 230 kV line as well as Tongi 230/132 kV sub-station."
    ],
    scope: [
      "Extension of Joydebpur 132/33 kV Substation with GIS Bay.",
      "Construction of Joydevpur-Kabirpur-Tangail 132 kV double circuit Transmission Line."
    ],
    cost: {
      total: "152.95 Crore BDT",
      gob: "23.99 Crore BDT",
      pa: "128.96 Crore BDT",
      pgcb: "N/A"
    },
    partner: "DANIDA",
    duration: "2004-05 to 2006-07",
    lastUpdated: "2020-12-30 04:06:06",
    source: "Project Planning"
  },
  {
    name: "Khulna-Ishurdi and Bogra-Barapukuria 230 kV Transmission Line Project",
    objectives: [
      "To transmit electrical energy to western region as per demand.",
      "To increase the system capacity & stability.",
      "To transmit electricity generated from Barapukuria 300 MW coal based Thermal Power Station.",
      "To reduce technical loss of electricity and improvement of voltage level.",
      "To transmit electrical energy among the major load centers."
    ],
    scope: [
      "Khulna Central-Khulna South Double ckt 132 kV Transmission Line.",
      "Khulna 230/132 kV Substation.",
      "Barapukuria 230/132 kV Substation.",
      "Barapukuria-Rangpur and Barapukuria-Saidpur 132 kV Transmission Line.",
      "Khulna-Ishurdi & Bogra-Barapukuria 230 kV double circuit Transmission Line.",
      "Bogra 230/132 kV S/S."
    ],
    cost: {
      total: "835.65 Crore BDT",
      gob: "332.19 Crore BDT",
      pa: "503.46 Crore BDT",
      pgcb: "N/A"
    },
    partner: "ADB, KfW, NDF, SIDA",
    duration: "2001-02 to 2007-08",
    lastUpdated: "2020-12-30 04:05:41",
    source: "Project Planning"
  },

  // --- BATCH 4: PROJECTS 36 - 51 (From 51 completed..txt) ---
  {
    name: "Matarbari Ultra Super Critical Coal-Fired Power Project (II) (PGCB Part: “Matarbari-Madunaghat 400 kV Transmission Line”)",
    objectives: [
      "To create facilities to evacuate power from upcoming Matarbari 1200 MW Power Station and to create power transmission capacity/ facility between Matarbari and Madunaghat."
    ],
    scope: [
      "To construct 400kV transmission line - 94.6 km."
    ],
    cost: {
      total: "132,304.00 Lakh BDT",
      gob: "30,906.00 Lakh BDT",
      pa: "94,858.00 Lakh BDT",
      pgcb: "6,540.00 Lakh BDT"
    },
    partner: "JICA",
    duration: "July, 2017 to June, 2022",
    lastUpdated: "2022-07-03 11:11:25",
    source: "Project Planning"
  },
  {
    name: "Meghnaghat-Aminbazar 400 kV Transmission Line (Phase-1)",
    objectives: [
      "To evacuate the incoming generation of Power from the Meghanaghat Power Station.",
      "To meet the growing demand of western part of Dhaka city.",
      "To establish a reliable transmission network for Dhaka area.",
      "To minimize transmission loss."
    ],
    scope: [
      "400 kV Line: 54 km Double Circuit",
      "Bay Extension: 4 nos. (230 kV side)"
    ],
    cost: {
      total: "597.10 Crore BDT",
      gob: "145.45 Crore BDT",
      pa: "270.32 Crore BDT",
      pgcb: "181.33 Crore BDT"
    },
    partner: "ADB",
    duration: "July, 2006 to June, 2014",
    lastUpdated: "2020-12-30 04:23:39",
    source: "Project Planning"
  },
  {
    name: "Mongla-Khulna(S) 230 kV Transmission Line Project",
    objectives: [
      "To create power evacuation facilities for upcoming power plants at Mongla (1st unit 660 MW).",
      "To supply construction power to Mongla power plant."
    ],
    scope: [
      "24 km four circuit 230 kV Mongla-Khulna (South) line (Initially two circuit stringing).",
      "Two 230 kV bay extension at Khulna (South)."
    ],
    cost: {
      total: "13,977.64 Lakh BDT",
      gob: "N/A",
      pa: "6,736.58 Lakh BDT (Foreign Currency)",
      pgcb: "7,241.06 Lakh BDT (Local Currency)"
    },
    partner: "PGCB",
    duration: "Jan, 2015 to December, 2021",
    lastUpdated: "2022-06-05 10:48:53",
    source: "Project Planning"
  },
  {
    name: "Naogaon - Niamatpur 132 kV Transmission Line Project",
    objectives: [
      "To provide electricity to the deep tubewells which are installed to facilitate irrigation in Barendra region.",
      "To strengthen electricity transmission in the Barendra region.",
      "To eradicate the problem of 'low voltage' during irrigation period."
    ],
    scope: [
      "132 kV transmission line (46 km) from Naogaon to Niamatpur",
      "New 132/33 KV Sub-Station (100 MVA) at Niamatpur",
      "2 Bay Extensions at Naogaon"
    ],
    cost: {
      total: "79.52 Crore BDT",
      gob: "N/A",
      pa: "N/A",
      pgcb: "N/A"
    },
    partner: "N/A",
    duration: "2005-06 to 2009-10",
    lastUpdated: "2020-12-30 04:17:13",
    source: "Project Planning"
  },
  {
    name: "National Power Transmission Network Development Project",
    objectives: [
      "To evacuate power from the proposed 225 MW power plant at Sikalbaha.",
      "Provide reliable power to Chattogram city through Rampur & Sikalbaha.",
      "Meet the growing load demand all over the country through new eleven number of 132/33 kV substation.",
      "To Relieve the existing substation adjacent to the new substations."
    ],
    scope: [
      "Hathazari-Sikalbaha-Anowara 230 kV Double Circuit Line: 45 km",
      "Rampur-Agrabad 132kV Double Circuit Line U/G: 5 km",
      "Khulshi-Halishahar In-OUT 132kV U/G line Four Circuit: 3 km",
      "132kV double Circuit Interconnection line: 131 km",
      "132kV Loop-in loop-Out line: 8 km",
      "2 number of 230/132 kV, 2x300 MVA (each) substation at Chittagong region",
      "11 number of 132/33 kV substation all over the country (Total 2190 MVA).",
      "230 kV Bay Extension: 4 Nos., 132kV Bay Extension: 9 Nos."
    ],
    cost: {
      total: "242,221.73 Lakh BDT",
      gob: "62,432.79 Lakh BDT",
      pa: "136,650.00 Lakh BDT",
      pgcb: "43,138.94 Lakh BDT"
    },
    partner: "JICA",
    duration: "January, 2013 to June, 2022",
    lastUpdated: "2022-07-03 10:51:51",
    source: "Project Planning"
  },
  {
    name: "Natore-Rajshahi 132 kV Single Circuit Transmission Line Project",
    objectives: [
      "To increase capacity of transmission line in substations at Rajshahi and Chapainawabganj.",
      "To increase reliability of power system in Barendra region.",
      "To reduce overloading and transmission loss in the existing Natore-Rajshahi 132kV lines."
    ],
    scope: [
      "132 kV single circuit transmission line (40 km) from Natore-Rajshahi",
      "132 kV bay Extension at Natore & Rajshahi"
    ],
    cost: {
      total: "6.06 Crore BDT",
      gob: "N/A",
      pa: "N/A",
      pgcb: "6.06 Crore BDT"
    },
    partner: "N/A",
    duration: "2005-06 to 2006-07",
    lastUpdated: "2020-12-30 04:16:33",
    source: "Project Planning"
  },
  {
    name: "NLDC (National Load Dispatch Centre) Project",
    objectives: [
      "To establish a centralized coordination among generation, transmission & distribution of the existing power system.",
      "To operate each power station & substation at an economically profitable unit.",
      "To reduce operational loss.",
      "To save the electrical motors from being burnt out due to excessive variation in voltage & frequency.",
      "To improve communication between all the electrical installations in the existing power system through modern SCADA techniques & Communication network."
    ],
    scope: [
      "SCADA System",
      "Energy Management System (EMS)",
      "Communication System"
    ],
    cost: {
      total: "421.68 Crore BDT",
      gob: "143.95 Crore BDT",
      pa: "277.73 Crore BDT",
      pgcb: "N/A"
    },
    partner: "ADB",
    duration: "2003-04 to 2009-10",
    lastUpdated: "2020-12-30 03:50:34",
    source: "Project Planning"
  },
  {
    name: "Patuakhali -Payra 230 kV Transmission Line Project",
    objectives: [
      "To supply back feed power to upcoming 1st unit (660 MW) of Payra 1320 MW Power Plant by constructing 230kV line which will be used to make a transmission link between Payra coal power plant and adjacent area in future."
    ],
    scope: [
      "To construct 47 km 230kV transmission line.",
      "To construct 132 kV Switchyard (except transformer).",
      "132kV Bay Extension: 02 nos"
    ],
    cost: {
      total: "30535.05 Lakh BDT",
      gob: "27960.68 Lakh BDT",
      pa: "N/A",
      pgcb: "2574.37 Lakh BDT"
    },
    partner: "N/A",
    duration: "January,2017 to June, 2021",
    lastUpdated: "2021-07-04 09:37:41",
    source: "Project Planning"
  },
  {
    name: "Replacement of Ashuganj Old 132 kV AIS Substation by New 132 kV GIS Substation Project",
    objectives: [
      "Modernization of Ashuganj Old Substation to reduce the chance of National Grid Failure and to ensure reliable power supply to Dhaka as well as Ashuganj and its neighboring areas."
    ],
    scope: [
      "Replacement of Existing Ashuganj old 132 kV AIS Substation by 132 kV GIS Substation."
    ],
    cost: {
      total: "27479.45 Lakh BDT",
      gob: "25330.09 Lakh BDT",
      pa: "N/A",
      pgcb: "2149.36 Lakh BDT"
    },
    partner: "N/A",
    duration: "April, 2018 to June, 2025",
    lastUpdated: "2025-07-02 10:29:09",
    source: "Project Planning"
  },
  {
    name: "Second East-West Electrical Interconnector Project (Ashuganj-Jamuna Multipurpose Bridge-Sirajganj 230 kV Transmission Line)",
    objectives: [
      "To meet up the growing demand of the northern and western zones of the country by transmitting less costly generated power in eastern zones.",
      "To ensure the supply of electricity.",
      "To improve the voltage profile.",
      "To reduce the load shading.",
      "To increase the stability of Grid networks.",
      "To reduce system loss.",
      "To shut down the power plants operating by oil of the north and western zones.",
      "To reduce the dependency on the imported fuel oil in order to achieve self-sufficiency."
    ],
    scope: [
      "Ashuganj-Sirajganj 230 kV line.",
      "Sirajganj switching station.",
      "2 numbers of 230kV bay extension at Sirajganj."
    ],
    cost: {
      total: "318.47 crore BDT",
      gob: "119.88 crore BDT",
      pa: "198.59crore BDT",
      pgcb: "N/A"
    },
    partner: "ADB",
    duration: "2004-05 to 2007-08",
    lastUpdated: "2020-12-30 04:06:19",
    source: "Project Planning"
  },
  {
    name: "Shunt Compensation at Grid Substation by Capacitor Banks (Phase-I) Project",
    objectives: [
      "To improve the voltage level and to reduce system loss through power factor improvement.",
      "To ensure the supply of improved quality of electrical energy from the proposed substations where the Capacitor Banks will be installed.",
      "To save motors and other electric appliances of industries from the low voltage effect.",
      "To transmit more quantity of power.",
      "To increase the efficiency of transmission network."
    ],
    scope: [
      "450 MVAR Capacitor Bank in 8 Substations at 132 KV side",
      "10 nos. of 132 KV Bay Extension"
    ],
    cost: {
      total: "50.99 crore BDT",
      gob: "20.01crore BDT",
      pa: "30.98 crore BDT",
      pgcb: "N/A"
    },
    partner: "ADB",
    duration: "2005-06 to 2009-10",
    lastUpdated: "2020-12-30 04:10:34",
    source: "Project Planning"
  },
  {
    name: "Siddhirganj - Maniknagar 230 kV Transmission Line Project",
    objectives: [
      "To evacuate power to be generated from the 335 MW under construction Power Plant and other incoming Power Plants at Siddhirganj.",
      "To meet the growing demand of South-east part of Dhaka city and to relieve the existing 132 kV lines of this area through the new 230 kV double circuit transmission line.",
      "To minimize transmission loss."
    ],
    scope: [
      "Siddhirganj 230/132 kV, 2x225 MVA AIS Substation.",
      "230/132 kV, 2X300 MVA GIS substation at Maniknagar including one 132 kV bay extension in the existing 132/33 kV outdoor substation.",
      "Siddhirganj - Maniknagar 230 kV Double Circuit O/H Transmission Line and relocation of an existing 132 kV dead-end Tower of Haripur line 1 & 2 by installing a new 132 kV dead-end Tower and provide underground cable connections."
    ],
    cost: {
      total: "300.8079 crore BDT",
      gob: "52.0461 crore BDT",
      pa: "27.98 m USD",
      pgcb: "26.0502 crore BDT"
    },
    partner: "IDA (World Bank)",
    duration: "August, 2009 to June, 2015",
    lastUpdated: "2020-12-30 05:11:18",
    source: "Project Planning"
  },
  {
    name: "Three Transmission Lines (132 KV) Project",
    objectives: [
      "To enhance the capacity and stability of the transmission system in the northern and western zone of the country.",
      "To reduce the technical loss and to improve the voltage profile."
    ],
    scope: [
      "Chuadanga - Jhenaidah - Magura 132 kV single circuit line (73 km)",
      "Naogaon-Joypurhat 132 kV Single Circuit Line",
      "Thakurgaon-Panchagar 132 kV Single Circuit Line",
      "132/33 kV Substation at Joypurhat, Chuadanga, Magura, and Panchagar",
      "132 KV Bay Extension at Jhenaidah, Naogaon, Thakurgaon"
    ],
    cost: {
      total: "377.72 crore BDT",
      gob: "155.76 crore BDT",
      pa: "221.96 crore BDT",
      pgcb: "N/A"
    },
    partner: "ADB",
    duration: "2006-07 to 2010-11",
    lastUpdated: "2020-12-30 03:54:07",
    source: "Project Planning"
  },
  {
    name: "Transmission Efficiency Improvement through Reactive Power Compensation at Grid Substations and Reinforcement of Goalpara Substation",
    objectives: [
      "To Prevent Transmission Voltage collapse.",
      "To Deload Grid Transformer and Transmission System.",
      "To reduce Transmission Loss.",
      "To improve Overall Transmission Efficiency."
    ],
    scope: [
      "Capacitor Bank: 600 MVAR (in 33 kV side of 26 S/S)",
      "Bay Extension: 45 nos. (33 kV side)",
      "Reinforcement of S/S: 1 nos. (132/33 kV)"
    ],
    cost: {
      total: "218.43 crore BDT",
      gob: "64.7285 crore BDT",
      pa: "139.7995 crore BDT",
      pgcb: "13.8986 crore BDT"
    },
    partner: "KfW",
    duration: "Jan, 2008 to June, 2014",
    lastUpdated: "2020-12-30 04:25:18",
    source: "Project Planning"
  },
  {
    name: "Two New 132/33 kV Substations at Kulaura and Sherpur with Interconnecting Lines",
    objectives: [
      "To meet the growing demand of the respective areas of the proposed new 132/33 kV substations at Kulaura & Sherpur.",
      "To relieve the loading of existing 132/33 kV substations supplying power to the concerned area."
    ],
    scope: [
      "Construction of 20 km 132 kV double circuit interconnecting line (Jamalpur-Sherpur)",
      "Construction of 25 km 132 kV double circuit interconnecting line (Fenchuganj-Kulaura).",
      "132/33 kV, 2x25/41 MVA Substation at Kulaura",
      "132/33 kV, 2x35/50 MVA Substation at Sherpur.",
      "Extension of 2 nos. 132 kV bays and shifting & renovation of existing bus coupler bay at Jamalpur substation."
    ],
    cost: {
      total: "BDT 217.4796 crore",
      gob: "N/A",
      pa: "BDT 127.2396 crore (Foreign Currency)",
      pgcb: "BDT 90.24 crore (Local Currency)"
    },
    partner: "N/A",
    duration: "January, 2012 to June, 2016",
    lastUpdated: "2020-12-30 05:31:21",
    source: "Project Planning"
  },
  {
    name: "Western Grid Network Development Project",
    objectives: [
      "To meet up the growing demand of Rajshahi, Rangpur, Pabna, Rajbari, Mongla and Jhenidah area.",
      "To establish a 230 kV transmission link between Rajshahi & Veramara.",
      "To establish a 132 kV transmission link between Gollamari & Gopalganj and Baghabari & Bhangura"
    ],
    scope: [
      "230 kV transmission line: 82.15 km",
      "132 kV transmission line: 111.50 km",
      "132 kV re-conductoring: 80 km",
      "132 kV 2nd Circuit Stringing of Madaripur-Gopalgonj : 43.86 km",
      "230/132 kV substation: 2 Nos. (Total: 1275MVA)",
      "132/33 kV substation: 3 Nos. (Total: 450 MVA)",
      "230 kV bay extensions: 2 Nos., 132 kV bay extension: 9 Nos."
    ],
    cost: {
      total: "118425.95 Lakh BDT",
      gob: "13730.93 Lakh BDT",
      pa: "58182.82 Lakh BDT",
      pgcb: "46512.20 Lakh BDT"
    },
    partner: "kfW",
    duration: "January, 2016 to June, 2022",
    lastUpdated: "2022-07-03 10:57:25",
    source: "Project Planning"
  }
];
