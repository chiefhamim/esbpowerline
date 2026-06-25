export interface UpcomingProjectItem {
  name: string;
  objectives: string[];
  scope: string[];
  cost: {
    total: string;
    pa?: string;
  };
  partner: string;
  status: string; // PDPP status or study stage
  duration: string;
  lastUpdated: string;
  source: string;
}

export const upcomingProjectsData: UpcomingProjectItem[] = [
  {
    name: "Construction of 50 MWp (AC) Solar Power Plants at different Grid Substation",
    objectives: [
      "Promote Renewable Energy growth (Merchant Plant) to meet the growing energy demand.",
      "Optimal utilization of the existing land of the Power Grid for generating green power and creating a new source of revenue.",
      "Mitigate greenhouse gas emissions by replacing fossil fuel-based power generation with clean solar power.",
      "Diversify the energy portfolio to reduce dependency on imported fuels and enhance energy self-sufficiency.",
      "Leverage existing grid substations to efficiently integrate solar power into the national grid, reducing transmission losses.",
      "Foster economic growth while ensuring environmental sustainability and compliance with global climate commitments, such as the Paris Agreement."
    ],
    scope: [
      "50 MW Solar Plants across 14 substations."
    ],
    cost: {
      total: "61,988.85 Lakh BDT",
      pa: "51.00 mUSD"
    },
    partner: "N/A",
    status: "PDPP has been sent to Power Division on 15/01/2025.",
    duration: "01/01/2026 to 31/12/2028",
    lastUpdated: "2025-07-01 17:22:41",
    source: "Project Planning"
  },
  {
    name: "Grid Resilience Enhancement at Rangpur Zone",
    objectives: [
      "Improve and strengthen the electricity network at Rangpur zone to meet growing energy demands, ensuring reliable & high-quality power, better resilience against outages, and improved operational efficiency.",
      "Increase the use of renewable energy sources, diversify the energy mix, and reduce reliance on fossil fuels which will improve energy security and support sustainable development.",
      "To minimize overall losses and improve the efficiency of transmission and distribution networks."
    ],
    scope: [
      "230 kV line - 119km",
      "132 kV line - 58 km",
      "New 230 kV Sub-Station - 2nos",
      "New 132 kV Sub-Station - 4nos",
      "Capacity Upgradation of Existing 132kV Substations - 6nos",
      "33kV Capacitor Bank at 4nos 132kV Substations"
    ],
    cost: {
      total: "286,446.27 Lakh BDT"
    },
    partner: "JICA has shown interest (235 mUSD)",
    status: "PDPP has been sent to Power Division on 13/03/2025.",
    duration: "01/07/2026 to 30/06/2031",
    lastUpdated: "2025-07-01 17:20:46",
    source: "Project Planning"
  },
  {
    name: "Grid-Scale Battery Energy Storage System (BESS) Piloting Project",
    objectives: [
      "To reduce the fluctuation of the system frequency by providing fast acting spinning reserves for primary frequency control to improve overall system security, stability and resiliency.",
      "To mitigate fluctuations of variable renewable energy (VRE) generation and ensure seamless integration of VRE into the national grid.",
      "To provide Black Start facility for ensuring fast restoration of the system."
    ],
    scope: [
      "120 MW / 60 MWh BESS at Ishwardi 230/132/33 kV substation",
      "40 MW / 20 MWh BESS at Bhulta 400/230/132 kV substation"
    ],
    cost: {
      total: "110,150.00 Lakh BDT",
      pa: "54.60 mUSD"
    },
    partner: "ADB",
    status: "Feasibility Study ongoing",
    duration: "01/10/2025 to 30/09/2027",
    lastUpdated: "2025-07-02 10:15:29",
    source: "Project Planning"
  },
  {
    name: "Madunaghat - Moheskhali 765kV Power Transmission line",
    objectives: [
      "To establish transmission infrastructure for evacuation of power to be generated from proposed power plants at Maheshkhali.",
      "To provide reliable power to all over the country."
    ],
    scope: [
      "765 kV Line",
      "400 kV bay extension"
    ],
    cost: {
      total: "329,681.70 Lakh BDT"
    },
    partner: "EDCF",
    status: "PDPP was approved on 01/11/2015. Feasibility Study is under review.",
    duration: "July, 2026 to June, 2031",
    lastUpdated: "2026-05-04 15:40:32",
    source: "Project Planning"
  },
  {
    name: "Madunaghat-Bhulta 765 kV Transmission Line Project",
    objectives: [
      "To establish high capacity transmission infrastructure for evacuation of power from Chittagong to Dhaka.",
      "To provide reliable power to all over the country."
    ],
    scope: [
      "765 kV line",
      "400kV bay extension"
    ],
    cost: {
      total: "681,801.00 Lakh BDT"
    },
    partner: "AIIB",
    status: "PDPP was approved on 18/10/2016. Feasibility Study is ongoing.",
    duration: "July, 2026 to December, 2031",
    lastUpdated: "2025-03-28 12:11:52",
    source: "Project Planning"
  },
  {
    name: "Transmission Grid Enhancement and Modernization Project",
    objectives: [
      "To complete the 400kV ring network for Central (Dhaka) region of national grid and improve system reliability.",
      "To establish backbone grid network for future regional grid integration in synchronous mode.",
      "To enhance the transmission system for accommodating cross border electricity trade in different zones of the country.",
      "To extend transmission network for harnessing of renewable energy generation in Southern region."
    ],
    scope: [
      "400 kV line",
      "230 kV line",
      "132 kV level",
      "400 kV Sub-Station",
      "230 kV Sub-Station"
    ],
    cost: {
      total: "777,388.50 Lakh BDT"
    },
    partner: "World Bank",
    status: "PDPP has been approved on 19/04/2022. Feasibility Study has started.",
    duration: "01/07/2026 to 30/06/2031",
    lastUpdated: "2025-07-01 17:18:32",
    source: "Project Planning"
  },
  {
    name: "Transmission Grid Network Expansion & Modernization at Mymensingh Region",
    objectives: [
      "To improve the capacity, reliability, stability and efficiency of power supply in Mymensingh region.",
      "To encourage Renewable energy sources, reduce power generation from fossil fuels, diversify the fuel mix and above all ensure security and long-term development of power system.",
      "To further improve the efficiency of operation of power transmission system."
    ],
    scope: [
      "230 kV line",
      "132 kV level",
      "400 kV Sub-Station",
      "230 kV Sub-Station",
      "132 kV Sub-Station"
    ],
    cost: {
      total: "481,098.00 Lakh BDT"
    },
    partner: "ADB (247 mUSD)",
    status: "Recast PDPP has been sent to Planning Commission on 04/03/2025.",
    duration: "01/07/2026 to 30/06/2031",
    lastUpdated: "2025-07-01 17:19:45",
    source: "Project Planning"
  }
];
