export interface OngoingProjectItem {
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
  status: {
    physical: string;
    financial: string;
  };
  duration: string;
  director: string;
  office: string;
  mobile: string;
  email: string;
  lastUpdated: string;
  source: string;
}

export const ongoingProjectsData: OngoingProjectItem[] = [
  {
    name: "Barapukuria-Bogura-Kaliakoir 400 kV Transmission Line Project",
    objectives: [
      "To extend High Voltage transmission infrastructure upto northern part of the country for import power in future from India, Nepal and Bhutan.",
      "To transmit the power from proposed 2x800 MW power plant to be built at Jharkhand, India by Adani Group."
    ],
    scope: [
      "Construction of Barapukuria-Bogura 400 kV Double Circuit Transmission Line: 120 km",
      "Construction of Bogura-Kaliakoir 400 kV Double Circuit Transmission Line: 140 km (including 9 km river crossing)",
      "Construction of 400 kV AIS Bay extension at Kaliakoir 400/230 kV Substation: 2 nos.",
      "Construction of 230 kV AIS Bay extension at Parbatipur 230 kV Switching Station: 2 nos."
    ],
    cost: {
      total: "1,069,037.45 Lakh BDT",
      gob: "311,880.52 Lakh BDT",
      pa: "680,434.71 Lakh BDT",
      pgcb: "76,722.22 Lakh BDT"
    },
    partner: "EXIM Bank of India",
    status: {
      physical: "92.10 %",
      financial: "67.51 %"
    },
    duration: "January, 2019 to December, 2026",
    director: "Mir Motahar Hossain, Chief Engineer, Addl. Charge",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212",
    mobile: "01755511645",
    email: "pd.bbkp@pgcb.gov.bd",
    lastUpdated: "2026-03-31 21:23:32",
    source: "Project Planning"
  },
  {
    name: "Capacity Enhancement of Existing Grid Substations and Transmission Lines",
    objectives: [
      "To meet the growing demand of electricity all across the country by upgrading the capacity of existing substations, installing capacitor banks, reconductoring and second circuit stringing of existing transmission lines."
    ],
    scope: [
      "Capacity Upgradation of Existing Substations",
      "Capacitor Bank at 33 kV",
      "Reconductoring of Existing 132 kV Transmission Line",
      "Second Circuit Stringing of 132 kV Transmission Lines",
      "132 kV new Transmission Line"
    ],
    cost: {
      total: "77,486.00 Lakh BDT",
      gob: "72,693.00 Lakh BDT",
      pa: "N/A",
      pgcb: "4,793.00 Lakh BDT"
    },
    partner: "N/A",
    status: {
      physical: "44.12 %",
      financial: "43.39 %"
    },
    duration: "September, 2021 to February, 2026",
    director: "Prabir Chandra Dutta, Superintending Engineer",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01755677421",
    email: "ceegstlproject@gmail.com",
    lastUpdated: "2026-05-23 12:19:27",
    source: "Project Planning"
  },
  {
    name: "Construction of 400 KV and 230 KV River Crossing Transmission Lines for Power Evacuation of Rooppur Nuclear Power Plant on Jamuna and Padma Rivers",
    objectives: [
      "To ensure power evacuation from Rooppur Nuclear Power Plant (RNPP) and qualitative upgradation of Bangladesh power system for the integration & safe operation of Rooppur Nuclear Power Station."
    ],
    scope: [
      "400 kV double circuit Jamuna River Crossing Line - 7 km",
      "400 kV single circuit Padma River Crossing Line – 2 km",
      "230 kV double circuit Jamuna River Crossing Line – 7 km"
    ],
    cost: {
      total: "605,630.00 Lakh BDT",
      gob: "454,222.50 Lakh BDT",
      pa: "N/A",
      pgcb: "151,407.50 Lakh BDT"
    },
    partner: "N/A",
    status: {
      physical: "90.00 %",
      financial: "75.55 %"
    },
    duration: "July, 2022 to September, 2026",
    director: "Md. Delwar Hossain, Chief Engineer (Addl Charge)",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01713276010",
    email: "sd.rctls@pgcb.gov.bd",
    lastUpdated: "2026-05-23 12:19:13",
    source: "Project Planning"
  },
  {
    name: "Dhaka and Western Zone Transmission Grid Expansion Project",
    objectives: [
      "To meet up the growing demand by ensuring reliable power supply to Industrial, commercial and residential areas of Central Zone (DESCO area of Dhaka), Western Zone, Northern Zone and Southern Zone of the Bangladesh by enhancing and Strengthening existing grid network."
    ],
    scope: [
      "400kV Transmission Line: 22km",
      "230kV Transmission Line: 144km",
      "132kV Transmission Line: 242km",
      "400kV Substation: 2 nos",
      "230kV Substation: 3 nos",
      "132kV Substation: 10 nos",
      "132kV Bay Extension: 20 nos"
    ],
    cost: {
      total: "594,995.23 Lakh BDT",
      gob: "141,595.96 Lakh BDT",
      pa: "421,230.41 Lakh BDT",
      pgcb: "32,168.86 Lakh BDT"
    },
    partner: "ADB, AIIB",
    status: {
      physical: "54.65 %",
      financial: "49.66 %"
    },
    duration: "October, 2019 to December, 2027",
    director: "Mohammed Faizul Kabir, Chief Engineer (addl charge)",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01730029367",
    email: "pddwztgep@gmail.com",
    lastUpdated: "2026-05-23 12:20:17",
    source: "Project Planning"
  },
  {
    name: "Energy Efficiency in Grid Based Power Supply Project",
    objectives: [
      "To increase reliability and efficiency of the electrical power supply in Bangladesh through expanding and improving the 230 kV and 132 kV power transmission system of PGCB"
    ],
    scope: [
      "230 kV Double Circuit Transmission Line: 82 km",
      "132 kV Double Circuit Transmission Line: 95.1 km",
      "Renovation of Naogaon - Niamotpur 132 kV TL 2nd circuit stringing: 46 km",
      "Reconductoring of double circuit conductor in existing Rajbari-Barisal 132 kV D/C TL: 150 km",
      "230/132 kV Sub-station : 05 Nos (Total 3300 MVA)",
      "New 132/33 kV Substation: 08 Nos (Total 1740 MVA)",
      "Renovation of 132/33 kV Substation: 06 Nos (Total 1260 MVA)",
      "132 kV bay extension at existing substations: 15 nos.",
      "Construction of Line in - Line out transmission line: 16.725 km"
    ],
    cost: {
      total: "294,686.50 Lakh BDT",
      gob: "109,796.03 Lakh BDT",
      pa: "137,058.79 Lakh BDT",
      pgcb: "47,831.68 Lakh BDT"
    },
    partner: "KfW",
    status: {
      physical: "93.60 %",
      financial: "88.47 %"
    },
    duration: "January, 2017 to June, 2026",
    director: "Shahid Ullah, Chief Engineer (Addl Charge)",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01777760424",
    email: "pd.eegbpsp@gmail.com",
    lastUpdated: "2026-05-23 12:21:27",
    source: "Project Planning"
  },
  {
    name: "Enhancement and Strengthening of Power Network in Eastern Region",
    objectives: [
      "To meet up the growing demand by ensuring reliable power supply to industrial, commercial and residential points of Greater Cumilla, Chattogram, Greater Noakhali area by enhancing and strengthening existing grid network of Eastern Region."
    ],
    scope: [
      "400 kV Transmission line: 12.63 km",
      "230 kV Transmission line: 175.91 km",
      "132 kV Transmission line: 256.3 km (including 157 km reconductoring)",
      "400 kV Substations: 2 nos",
      "230 kV Substations: 2 nos",
      "132 kV Substations: 10 nos",
      "230 kV GIS bay extension: 4 nos",
      "132 kV AIS bay extension: 2 nos"
    ],
    cost: {
      total: "626,388.71 Lakh BDT",
      gob: "165,482.54 Lakh BDT",
      pa: "410,028.48 Lakh BDT",
      pgcb: "50,877.69 Lakh BDT"
    },
    partner: "World Bank",
    status: {
      physical: "99.75 %",
      financial: "83.31 %"
    },
    duration: "January, 2018 to June, 2026",
    director: "Md Shahadat Hossain, Chief Engineer (Addl Charge)",
    office: "NLDC Building, Aftabnagar, Dhaka-1212",
    mobile: "01714100947",
    email: "pd.espnerp@gmail.com",
    lastUpdated: "2026-03-31 20:50:19",
    source: "Project Planning"
  },
  {
    name: "Expansion and Strengthening of Power System Network under Chattogram Area",
    objectives: [
      "To transmit power from upcoming United 583MW as well as United 300MW power plants at Anowara to the major load centers of Chittagong City and Also to strengthen power transmission system in Chattogram area along with enhancing its reliability and efficiency."
    ],
    scope: [
      "400kV Transmission Line: 25.185km",
      "230kV Transmission Line: 24.45 km",
      "230kV substation: 2 nos",
      "230kV bay extension: 4 nos"
    ],
    cost: {
      total: "186,128.91 Lakh BDT",
      gob: "47,229.12 Lakh BDT",
      pa: "123,531.64 Lakh BDT",
      pgcb: "15,368.15 Lakh BDT"
    },
    partner: "AIIB",
    status: {
      physical: "75.85 %",
      financial: "74.22 %"
    },
    duration: "July, 2019 to June, 2027",
    director: "Bijoy Kumar Das",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01711688277",
    email: "espnca19@gmail.com",
    lastUpdated: "2026-05-23 12:20:28",
    source: "Project Planning"
  },
  {
    name: "Infrastructure Development for Power Evacuation Facilities of Rooppur Nuclear Power Plant",
    objectives: [
      "To ensure power evacuation from Rooppur Nuclear Power Plant (RNPP) and qualitative upgradation of Bangladesh power system for the integration & safe operation of Rooppur Nuclear Power Station."
    ],
    scope: [
      "400 kV Transmission Lines: 464 km (13 km river crossing)",
      "230 kV Transmission Lines: 205 km (7 km river crossing)",
      "400 kV Bay Extensions: 4 nos",
      "230 kV Bay Extensions: 5 nos",
      "To implement the frequency control and frequency drop protection, protection system, emergency control system and other associated tasks for qualitative upgradation of Bangladesh Power System."
    ],
    cost: {
      total: "1,098,174.92 Lakh BDT",
      gob: "152,763.68 Lakh BDT",
      pa: "821,904.50 Lakh BDT",
      pgcb: "123,506.74 Lakh BDT"
    },
    partner: "Indian LoC",
    status: {
      physical: "98.80 %",
      financial: "64.38 %"
    },
    duration: "April, 2018 to December, 2026",
    director: "Md Masudul Islam, Chief Engineer (Addl Charge)",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01713850495",
    email: "pd.idrnpp@gmail.com, pd.idrnpp@pgcb.gov.bd",
    lastUpdated: "2026-05-23 12:20:06",
    source: "Project Planning"
  },
  {
    name: "Power Grid Network Strengthening Project under PGCB",
    objectives: [
      "To build up and renovate necessary infrastructure for reliable transmission of power."
    ],
    scope: [
      "400 kV transmission line: 100km",
      "230 kV transmission line: 330.20 km",
      "132 kV transmission line: 334.50km",
      "Conductor up gradation of existing 132 kV transmission line: 225 km",
      "400/132 kV new Substation: 01 Nos (1x 650 MVA)",
      "Construction of new 230/132 kV substations: 12 nos. (total 9200 MVA)",
      "Capacity up gradation of existing 230/132 kV substations: 7 nos. (3035 MVA)",
      "Construction of new 132/33 kV substations: 28 nos. (7404 MVA)",
      "Capacity up gradation of existing 132/33 kV substations: 28 nos. (8044 MVA)",
      "Extension of Existing 400 kV Substation: 1 nos",
      "Extension of Existing 230 kV Substation: 3 nos",
      "Extension of Existing 132 kV Substation: 14 nos",
      "Renovation of existing substations: 05 Nos.",
      "To construct new Specialised Engineering Facilities: 7 nos."
    ],
    cost: {
      total: "294,686.50 Lakh BDT",
      gob: "109,796.03 Lakh BDT",
      pa: "137,058.79 Lakh BDT",
      pgcb: "47,831.68 Lakh BDT"
    },
    partner: "Exim Bank China (G to G)",
    status: {
      physical: "73.95 %",
      financial: "61.70 %"
    },
    duration: "October, 2016 to June, 2027",
    director: "Md. Alamgir Hossain, Chief Engineer (Addl Charge)",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01761042687",
    email: "pd.g2g@pgcb.gov.bd",
    lastUpdated: "2026-05-23 12:20:55",
    source: "Project Planning"
  },
  {
    name: "Power Transmission Strengthening and Integration of Renewable Energy",
    objectives: [
      "To establish safe and reliable transmission infrastructure for upcoming and planned renewable energy based power plants in southern region of Chattogram.",
      "To connect load centers in the project area with nearby generating stations.",
      "To increase the capacity and efficiency of transmission system and to reduce overall system losses to ensure more reliable and uninterrupted power supply to rural settlements under the project area."
    ],
    scope: [
      "400kV Substation: 1 no",
      "230kV Substation: 2 nos",
      "132kV Substation: 7 nos",
      "400kV Transmission Line: 13.50 km",
      "230 kV Transmission Line: 7.20 km",
      "132kV Transmission Line: 217.60 km",
      "132 kV Bay Extension: 10 nos"
    ],
    cost: {
      total: "413,142.00 Lakh BDT",
      gob: "105,610.00 Lakh BDT",
      pa: "244,000.00 Lakh BDT",
      pgcb: "63,532.00 Lakh BDT"
    },
    partner: "ADB",
    status: {
      physical: "1.00 %",
      financial: "2.18 %"
    },
    duration: "01/07/2025 to 30/06/2030",
    director: "Md Masudul Islam, Chief Engineer (Addl Charge)",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212",
    mobile: "01713850495",
    email: "pd.idrnpp@gmail.com, pd.idrnpp@pgcb.gov.bd",
    lastUpdated: "2026-05-23 12:18:35",
    source: "Project Planning"
  },
  {
    name: "Southwest Transmission Grid Expansion Project",
    objectives: [
      "To ensure adequate and reliable power supply for the upcoming Economic Zones in Barishal area as well as in Rajshahi area which is known as the largest agricultural production zone of Bangladesh and to meet the rapidly growing demands of residential and commercial consumers in the southwest and northern region of Bangladesh."
    ],
    scope: [
      "400 kV Transmission Lines: 104.961 km.",
      "New 230 kV Transmission Lines: 175.869 km",
      "Reconductoring of 230kV Transmission Lines: 175 km",
      "New 132 kV Transmission Lines: 27.865 km.",
      "Reconductoring of 132kV Transmission Lines: 148.50 km",
      "400 kV Substations: 3 nos.",
      "230 kV Substations: 2 nos.",
      "230 kV GIS Bay Extensions: 4 nos.",
      "132 kV GIS Bay Extensions: 2 nos."
    ],
    cost: {
      total: "432,234.73 Lakh BDT",
      gob: "102,702.68 Lakh BDT",
      pa: "282,401.65 Lakh BDT",
      pgcb: "47,130.41 Lakh BDT"
    },
    partner: "ADB",
    status: {
      physical: "97.29 %",
      financial: "84.93 %"
    },
    duration: "July, 2018 to June, 2026",
    director: "Md. Mamun Hasan (SE)",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01730783335",
    email: "pd.stgep@pgcb.gov.bd",
    lastUpdated: "2026-05-23 12:19:57",
    source: "Project Planning"
  },
  {
    name: "Technical Assistance Project with Feasibility Study for Madunaghat-Bhulta 765kV Transmission Line Project",
    objectives: [
      "To engange consultants for the preparative assistance of the development project titled 'Madunaghat - Bhulta 765 kV Transmission Line Project' so that reliable electricity access in Bangladesh can be promoted by upgrading and strengthening the transmission network."
    ],
    scope: [
      "Engagement of Consultants to:",
      "i) Prepare a detailed feasibility study report of Madunaghat- Bhulta 765kV transmission line.",
      "ii) Prepare project documents including bidding documents, engineering layout, single line diagram etc.",
      "iii) Get assistantce in DPP preparation, tender evaluation and award."
    ],
    cost: {
      total: "3,525.00 Lakh BDT",
      gob: "N/A",
      pa: "2,608.00 Lakh BDT",
      pgcb: "917.00 Lakh BDT"
    },
    partner: "AIIB",
    status: {
      physical: "20.00 %",
      financial: "8.59 %"
    },
    duration: "July, 2021 to June, 2027",
    director: "Md. Manzur Morshed",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01777743223",
    email: "pd.project1@pgcb.gov.bd",
    lastUpdated: "2026-05-23 12:19:35",
    source: "Project Planning"
  },
  {
    name: "Transmission Infrastructure Development Project for Southern Area of Chattogram Division & Hi-Tech City at Kaliakoir",
    objectives: [
      "The main objective of the project is to develop grid interfacing infrastructure to meet the proliferating demand of electricity in Cox's Bazar, Teknaf & Anowara areas, and to ensure uninterrupted and reliable power transmission for Economic Zones of BEZA in Chattogram Division as well as for Hi-Tech City of Bangladesh Hi-Tech Park Authority (BHTPA) in Gazipur."
    ],
    scope: [
      "230kV Substation: 2 nos",
      "132kV Substation: 2 nos",
      "230kV Transmission Lines: 113.88 km",
      "132 kV Transmission Lines: 66.55 km",
      "230kV Bay Extensions: 2 nos"
    ],
    cost: {
      total: "276,243.00 Lakh BDT",
      gob: "65,143.00 Lakh BDT",
      pa: "169,646.00 Lakh BDT",
      pgcb: "41,454.00 Lakh BDT"
    },
    partner: "N/A",
    status: {
      physical: "19.00 %",
      financial: "18.69 %"
    },
    duration: "July, 2023 to June, 2028",
    director: "Md. Munjur Alam",
    office: "Power Grid Head Office Building, Aftabnagar, Dhaka-1212.",
    mobile: "01730029309",
    email: "pd.scktidp@pgcb.gov.bd",
    lastUpdated: "2026-05-23 12:19:47",
    source: "Project Planning"
  }
];
