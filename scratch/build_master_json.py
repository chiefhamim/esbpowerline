import json
import os

# 1. Base Data from the Application
# This is the 15-year dataset we built for the UI. We will use this as the anchor.
base_data = [
    {"Fiscal_Year": "FY2011", "Power_Division_Budget_TkCr": 4914, "Total_Transmission_ckm": 8396, "Installed_Generation_MW": 7296, "Peak_Demand_MW": 4890, "Total_Budget_TkCr": 132170},
    {"Fiscal_Year": "FY2012", "Power_Division_Budget_TkCr": 6777, "Total_Transmission_ckm": 8469, "Installed_Generation_MW": 8716, "Peak_Demand_MW": 6066, "Total_Budget_TkCr": 163589},
    {"Fiscal_Year": "FY2013", "Power_Division_Budget_TkCr": 8206, "Total_Transmission_ckm": 8805, "Installed_Generation_MW": 9151, "Peak_Demand_MW": 6434, "Total_Budget_TkCr": 191738},
    {"Fiscal_Year": "FY2014", "Power_Division_Budget_TkCr": 9405, "Total_Transmission_ckm": 9308, "Installed_Generation_MW": 10416, "Peak_Demand_MW": 7356, "Total_Budget_TkCr": 222491},
    {"Fiscal_Year": "FY2015", "Power_Division_Budget_TkCr": 11540, "Total_Transmission_ckm": 9662, "Installed_Generation_MW": 11534, "Peak_Demand_MW": 7817, "Total_Budget_TkCr": 250506},
    {"Fiscal_Year": "FY2016", "Power_Division_Budget_TkCr": 16485, "Total_Transmission_ckm": 9892, "Installed_Generation_MW": 12780, "Peak_Demand_MW": 9036, "Total_Budget_TkCr": 295100},
    {"Fiscal_Year": "FY2017", "Power_Division_Budget_TkCr": 14948, "Total_Transmission_ckm": 10436, "Installed_Generation_MW": 13555, "Peak_Demand_MW": 9479, "Total_Budget_TkCr": 340605},
    {"Fiscal_Year": "FY2018", "Power_Division_Budget_TkCr": 21118, "Total_Transmission_ckm": 11123, "Installed_Generation_MW": 15953, "Peak_Demand_MW": 10958, "Total_Budget_TkCr": 400266},
    {"Fiscal_Year": "FY2019", "Power_Division_Budget_TkCr": 22936, "Total_Transmission_ckm": 11650, "Installed_Generation_MW": 18961, "Peak_Demand_MW": 12893, "Total_Budget_TkCr": 464573},
    {"Fiscal_Year": "FY2020", "Power_Division_Budget_TkCr": 26058, "Total_Transmission_ckm": 12283, "Installed_Generation_MW": 20383, "Peak_Demand_MW": 12738, "Total_Budget_TkCr": 523190},
    {"Fiscal_Year": "FY2021", "Power_Division_Budget_TkCr": 26758, "Total_Transmission_ckm": 12836, "Installed_Generation_MW": 22031, "Peak_Demand_MW": 13792, "Total_Budget_TkCr": 568000},
    {"Fiscal_Year": "FY2022", "Power_Division_Budget_TkCr": 25398, "Total_Transmission_ckm": 13412, "Installed_Generation_MW": 22482, "Peak_Demand_MW": 14782, "Total_Budget_TkCr": 603681},
    {"Fiscal_Year": "FY2023", "Power_Division_Budget_TkCr": 26066, "Total_Transmission_ckm": 14457, "Installed_Generation_MW": 24911, "Peak_Demand_MW": 15648, "Total_Budget_TkCr": 678064},
    {"Fiscal_Year": "FY2024", "Power_Division_Budget_TkCr": 33825, "Total_Transmission_ckm": 15246, "Installed_Generation_MW": 27138, "Peak_Demand_MW": 16477, "Total_Budget_TkCr": 761785},
    {"Fiscal_Year": "FY2025", "Power_Division_Budget_TkCr": 29230, "Total_Transmission_ckm": 15680, "Installed_Generation_MW": 27725, "Peak_Demand_MW": 16487, "Total_Budget_TkCr": 797000}
]

# 2. MoF ADP Subagent Data
mof_data = [
  {"FiscalYear": "FY2020", "EnergyDivisionBudget": 2480, "PowerSectorADPAllocation": 24804},
  {"FiscalYear": "FY2021", "EnergyDivisionBudget": None, "PowerSectorADPAllocation": 26758},
  {"FiscalYear": "FY2022", "EnergyDivisionBudget": 1018, "PowerSectorADPAllocation": 25398},
  {"FiscalYear": "FY2023", "EnergyDivisionBudget": 1143, "PowerSectorADPAllocation": None},
  {"FiscalYear": "FY2024", "EnergyDivisionBudget": 994, "PowerSectorADPAllocation": None},
  {"FiscalYear": "FY2025", "EnergyDivisionBudget": 1087, "PowerSectorADPAllocation": 29177}
]

# 3. PGCB Infrastructure Subagent Data
pgcb_data = [
  {"FY": "FY2014", "TransmissionLine_400kV_ckm": 164.7, "TransmissionLine_230kV_ckm": 3066, "TransmissionLine_132kV_ckm": 6195},
  {"FY": "FY2016", "TransmissionLine_400kV_ckm": 220.7, "TransmissionLine_230kV_ckm": 3171.45, "TransmissionLine_132kV_ckm": 6311.63},
  {"FY": "FY2020", "TransmissionLine_400kV_ckm": 861, "TransmissionLine_230kV_ckm": 3500, "TransmissionLine_132kV_ckm": 7758},
  {"FY": "FY2021", "Substation_230_132kV_MVA": 16085, "Substation_132_33kV_MVA": 29204, "TransmissionLoss_Percent": 3.0},
  {"FY": "FY2022", "TransmissionLine_400kV_ckm": 1735, "TransmissionLine_230kV_ckm": 4043, "TransmissionLine_132kV_ckm": 8186, "Substation_230_132kV_Count": 27, "Substation_230_132kV_MVA": 15225, "Substation_132_33kV_Count": 125},
  {"FY": "FY2023", "TransmissionLine_400kV_ckm": 1735, "TransmissionLine_230kV_ckm": 4043, "TransmissionLine_132kV_ckm": 8186, "TransmissionLoss_Percent": 3.15},
  {"FY": "FY2024", "TransmissionLine_400kV_ckm": 3155, "TransmissionLine_230kV_ckm": 5129.79, "TransmissionLine_132kV_ckm": 9287, "Substation_230_132kV_Count": 36, "Substation_230_132kV_MVA": 24275, "Substation_132_33kV_Count": 150, "Substation_132_33kV_MVA": 33185, "TransmissionLoss_Percent": 3.22}
]

# 4. Merge
merged = []
for b in base_data:
    row = dict(b)
    
    # Init nulls for requested columns
    row["Energy_Division_Budget_TkCr"] = None
    row["Power_ADP_Allocation_TkCr"] = None
    row["Power_ADP_Expenditure_TkCr"] = None
    row["Transmission_400kV_ckm"] = None
    row["Transmission_230kV_ckm"] = None
    row["Transmission_132kV_ckm"] = None
    row["Substation_230_132_Count"] = None
    row["Substation_230_132_MVA"] = None
    row["Substation_132_33_Count"] = None
    row["Substation_132_33_MVA"] = None
    row["Electricity_Consumption_GWh"] = None
    row["Transmission_Loss_Percent"] = None
    
    # Merge MoF
    for m in mof_data:
        if m["FiscalYear"] == row["Fiscal_Year"]:
            row["Energy_Division_Budget_TkCr"] = m.get("EnergyDivisionBudget")
            row["Power_ADP_Allocation_TkCr"] = m.get("PowerSectorADPAllocation")
            
    # Merge PGCB
    for p in pgcb_data:
        # Match "2013-2014" or "FY2014"
        if p["FY"].endswith(row["Fiscal_Year"].replace("FY20", "")):
            row["Transmission_400kV_ckm"] = p.get("TransmissionLine_400kV_ckm")
            row["Transmission_230kV_ckm"] = p.get("TransmissionLine_230kV_ckm")
            row["Transmission_132kV_ckm"] = p.get("TransmissionLine_132kV_ckm")
            row["Substation_230_132_Count"] = p.get("Substation_230_132kV_Count")
            row["Substation_230_132_MVA"] = p.get("Substation_230_132kV_MVA")
            row["Substation_132_33_Count"] = p.get("Substation_132_33kV_Count")
            row["Substation_132_33_MVA"] = p.get("Substation_132_33kV_MVA")
            row["Transmission_Loss_Percent"] = p.get("TransmissionLoss_Percent")

    # Add source citation mapping
    row["Source_Document"] = "Ministry of Finance Budget Briefs & PGCB Annual Reports"
    row["Source_URL"] = "https://mof.gov.bd/ & https://www.pgcb.gov.bd/"
    merged.append(row)

with open('master_data.json', 'w') as f:
    json.dump(merged, f, indent=4)
