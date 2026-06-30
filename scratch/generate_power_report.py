import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import json
from openpyxl import Workbook
from openpyxl.utils.dataframe import dataframe_to_rows
from scipy import stats

# Create output directories
out_dir = "power_grid_study"
os.makedirs(f"{out_dir}/charts", exist_ok=True)
os.makedirs(f"{out_dir}/data", exist_ok=True)

sns.set_theme(style="whitegrid", font_scale=1.1)
plt.rcParams['figure.dpi'] = 300
plt.rcParams['font.family'] = 'sans-serif'

def save_chart(name):
    plt.tight_layout()
    plt.savefig(f"{out_dir}/charts/{name}.png")
    plt.savefig(f"{out_dir}/charts/{name}.svg")
    plt.close()

def main():
    with open('master_data.json', 'r') as f:
        raw_data = json.load(f)
    df = pd.DataFrame(raw_data)

    df['Annual_Budget_Growth_Percent'] = df['Power_Division_Budget_TkCr'].pct_change() * 100
    df['Transmission_Added_ckm'] = df['Total_Transmission_ckm'].diff()
    df['Annual_Transmission_Growth_Percent'] = df['Total_Transmission_ckm'].pct_change() * 100
    
    # Fill NAs for calculations where needed
    df['Substation_230_132_MVA'] = df['Substation_230_132_MVA'].astype(float)
    df['Substation_132_33_MVA'] = df['Substation_132_33_MVA'].astype(float)
    df['Total_Substation_MVA'] = df['Substation_230_132_MVA'].fillna(0) + df['Substation_132_33_MVA'].fillna(0)
    df['Total_Substation_MVA'] = df['Total_Substation_MVA'].replace(0, np.nan) # restore nans where both were empty
    df['MVA_Added'] = df['Total_Substation_MVA'].diff()
    df['Annual_MVA_Growth_Percent'] = df['Total_Substation_MVA'].pct_change() * 100
    df['Annual_Peak_Demand_Growth_Percent'] = df['Peak_Demand_MW'].pct_change() * 100
    df['Annual_Generation_Growth_Percent'] = df['Installed_Generation_MW'].pct_change() * 100
    
    df['Budget_Per_ckm'] = df['Power_Division_Budget_TkCr'] / df['Total_Transmission_ckm']
    df['Budget_Per_MVA'] = df['Power_Division_Budget_TkCr'] / df['Total_Substation_MVA']
    df['Grid_Expansion_Per_Tk'] = df['Transmission_Added_ckm'] / df['Power_Division_Budget_TkCr']
    df['MVA_Expansion_Per_Tk'] = df['MVA_Added'] / df['Power_Division_Budget_TkCr']
    
    df['Budget_Elasticity'] = df['Annual_Transmission_Growth_Percent'] / df['Annual_Budget_Growth_Percent']
    
    df['Weighted_Grid_Index'] = (df['Transmission_400kV_ckm'].fillna(0) * 3) + (df['Transmission_230kV_ckm'].fillna(0) * 2) + (df['Transmission_132kV_ckm'].fillna(0) * 1)
    df['Weighted_Grid_Growth_Percent'] = df['Weighted_Grid_Index'].pct_change() * 100
    df['Weighted_Grid_Index_Change'] = df['Weighted_Grid_Index'].diff()

    # Base Index FY2011 = 100
    df['Budget_Index'] = (df['Power_Division_Budget_TkCr'] / df['Power_Division_Budget_TkCr'].iloc[0]) * 100
    df['Transmission_Index'] = (df['Total_Transmission_ckm'] / df['Total_Transmission_ckm'].iloc[0]) * 100
    # For Substation MVA, FY11 is nan, so let's use the first non-null
    first_mva = df['Total_Substation_MVA'].dropna().iloc[0] if not df['Total_Substation_MVA'].dropna().empty else 1
    df['Substation_MVA_Index'] = (df['Total_Substation_MVA'] / first_mva) * 100

    df.to_csv(f"{out_dir}/data/master_dataset.csv", index=False)
    df.to_json(f"{out_dir}/data/master_dataset.json", orient="records", indent=4)
    wb = Workbook()
    ws = wb.active
    ws.title = "Master Dataset"
    for r in dataframe_to_rows(df, index=False, header=True):
        ws.append(r)
    wb.save(f"{out_dir}/data/master_dataset_with_formulas.xlsx")

    # Chart 1: Dual-axis Budget vs Transmission
    fig, ax1 = plt.subplots(figsize=(10, 6))
    ax2 = ax1.twinx()
    sns.lineplot(data=df, x='Fiscal_Year', y='Power_Division_Budget_TkCr', ax=ax1, color='blue', marker='o')
    sns.lineplot(data=df, x='Fiscal_Year', y='Total_Transmission_ckm', ax=ax2, color='green', marker='s')
    ax1.set_ylabel('Power Division Budget (Tk Crore)', color='blue')
    ax2.set_ylabel('Total Transmission (ckt-km)', color='green')
    plt.title('Chart 1: Budget Allocation vs Physical Grid Expansion')
    plt.xticks(rotation=45)
    save_chart("Chart_1_Budget_vs_Transmission")

    # Chart 2: Multi-line chart 400kV, 230kV, 132kV
    plt.figure(figsize=(10, 6))
    df_vol = df.dropna(subset=['Transmission_400kV_ckm', 'Transmission_230kV_ckm', 'Transmission_132kV_ckm'])
    if not df_vol.empty:
        plt.plot(df_vol['Fiscal_Year'], df_vol['Transmission_400kV_ckm'], marker='o', label='400kV')
        plt.plot(df_vol['Fiscal_Year'], df_vol['Transmission_230kV_ckm'], marker='s', label='230kV')
        plt.plot(df_vol['Fiscal_Year'], df_vol['Transmission_132kV_ckm'], marker='^', label='132kV')
        plt.title('Chart 2: Network Evolution by Voltage Level (ckm)')
        plt.ylabel('Circuit Kilometers (ckm)')
        plt.xticks(rotation=45)
        plt.legend()
        save_chart("Chart_2_Network_Evolution_Voltage")

    # Chart 3: Stacked area chart
    if not df_vol.empty:
        plt.figure(figsize=(10, 6))
        plt.stackplot(df_vol['Fiscal_Year'], df_vol['Transmission_132kV_ckm'], df_vol['Transmission_230kV_ckm'], df_vol['Transmission_400kV_ckm'], labels=['132kV', '230kV', '400kV'])
        plt.title('Chart 3: Cumulative Grid Build-out by Voltage')
        plt.ylabel('Circuit Kilometers (ckm)')
        plt.xticks(rotation=45)
        plt.legend(loc='upper left')
        save_chart("Chart_3_Cumulative_Grid_Buildout")

    # Chart 4: Column chart Transmission_Added_ckm
    plt.figure(figsize=(10, 6))
    sns.barplot(data=df, x='Fiscal_Year', y='Transmission_Added_ckm', color='teal')
    plt.title('Chart 4: Accelerated Expansion (Transmission Added ckm)')
    plt.xticks(rotation=45)
    plt.ylabel('ckm Added')
    save_chart("Chart_4_Transmission_Added")

    # Chart 5: Column chart MVA_Added
    plt.figure(figsize=(10, 6))
    sns.barplot(data=df, x='Fiscal_Year', y='MVA_Added', color='purple')
    plt.title('Chart 5: Substation Investment Cycles (MVA Added)')
    plt.xticks(rotation=45)
    plt.ylabel('MVA Added')
    save_chart("Chart_5_MVA_Added")

    # Chart 6: Scatter plot Budget vs Transmission Added
    plt.figure(figsize=(8, 6))
    df_clean = df.dropna(subset=['Power_Division_Budget_TkCr', 'Transmission_Added_ckm'])
    if not df_clean.empty:
        sns.regplot(data=df_clean, x='Power_Division_Budget_TkCr', y='Transmission_Added_ckm')
        slope, intercept, r_value, p_value, std_err = stats.linregress(df_clean['Power_Division_Budget_TkCr'], df_clean['Transmission_Added_ckm'])
        plt.title(f'Chart 6: Budget vs Transmission Added (R²={r_value**2:.2f}, r={r_value:.2f})')
        save_chart("Chart_6_Scatter_Budget_Transmission")

    # Chart 7: Scatter plot Budget vs MVA Added
    plt.figure(figsize=(8, 6))
    df_clean2 = df.dropna(subset=['Power_Division_Budget_TkCr', 'MVA_Added'])
    if not df_clean2.empty:
        sns.regplot(data=df_clean2, x='Power_Division_Budget_TkCr', y='MVA_Added', color='purple')
        slope, intercept, r_value, p_value, std_err = stats.linregress(df_clean2['Power_Division_Budget_TkCr'], df_clean2['MVA_Added'])
        plt.title(f'Chart 7: Budget vs MVA Added (R²={r_value**2:.2f})')
        save_chart("Chart_7_Scatter_Budget_MVA")

    # Chart 8: Heatmap of growth
    plt.figure(figsize=(10, 8))
    heat_cols = ['Annual_Budget_Growth_Percent', 'Annual_Transmission_Growth_Percent', 'Annual_MVA_Growth_Percent', 'Annual_Peak_Demand_Growth_Percent']
    df_heat = df.set_index('Fiscal_Year')[heat_cols].dropna(how='all')
    sns.heatmap(df_heat, annot=True, cmap='RdYlGn', center=0, fmt='.1f')
    plt.title('Chart 8: Structural Growth Patterns Heatmap (%)')
    save_chart("Chart_8_Growth_Heatmap")

    # Chart 9: Bubble chart
    plt.figure(figsize=(10, 6))
    df_bub = df.dropna(subset=['Power_Division_Budget_TkCr', 'Weighted_Grid_Index', 'Peak_Demand_MW'])
    if not df_bub.empty:
        scatter = plt.scatter(df_bub['Power_Division_Budget_TkCr'], df_bub['Weighted_Grid_Index'], 
                              s=df_bub['Peak_Demand_MW']/50, alpha=0.5, c='orange')
        plt.title('Chart 9: System Scaling (Budget vs Weighted Index, Size=Peak Demand)')
        plt.xlabel('Power Division Budget (Tk Crore)')
        plt.ylabel('Weighted Grid Index')
        save_chart("Chart_9_Bubble_Chart")

    # Chart 10: Waterfall (simplified as bar chart showing diffs)
    plt.figure(figsize=(10, 6))
    df_water = df.dropna(subset=['Weighted_Grid_Index_Change'])
    if not df_water.empty:
        colors = ['red' if x < 0 else 'green' for x in df_water['Weighted_Grid_Index_Change']]
        plt.bar(df_water['Fiscal_Year'], df_water['Weighted_Grid_Index_Change'], color=colors)
        plt.title('Chart 10: Annual Change in Weighted Grid Index')
        plt.xticks(rotation=45)
        save_chart("Chart_10_Waterfall_Weighted_Index")

    # Chart 11: Indexed Line Chart
    plt.figure(figsize=(10, 6))
    plt.plot(df['Fiscal_Year'], df['Budget_Index'], label='Budget Index', marker='o')
    plt.plot(df['Fiscal_Year'], df['Transmission_Index'], label='Transmission Index', marker='s')
    df_sub = df.dropna(subset=['Substation_MVA_Index'])
    if not df_sub.empty:
        plt.plot(df_sub['Fiscal_Year'], df_sub['Substation_MVA_Index'], label='Substation MVA Index', marker='^')
    plt.title('Chart 11: Long-term Trajectories (Indexed FY2011=100)')
    plt.xticks(rotation=45)
    plt.legend()
    save_chart("Chart_11_Indexed_Trajectories")

    # Chart 12: Radar Chart (Using polar plot for a specific year e.g. FY2024)
    fy24 = df[df['Fiscal_Year'] == 'FY2024']
    if not fy24.empty:
        metrics = ['Annual_Budget_Growth_Percent', 'Annual_Transmission_Growth_Percent', 
                   'Annual_Peak_Demand_Growth_Percent', 'Annual_Generation_Growth_Percent']
        values = fy24[metrics].values.flatten().tolist()
        values = [0 if np.isnan(v) else v for v in values]
        
        angles = np.linspace(0, 2 * np.pi, len(metrics), endpoint=False).tolist()
        values += values[:1]
        angles += angles[:1]
        
        fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
        ax.fill(angles, values, color='teal', alpha=0.25)
        ax.plot(angles, values, color='teal', linewidth=2)
        ax.set_yticklabels([])
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(['Budget', 'Grid', 'Demand', 'Generation'])
        plt.title('Chart 12: Radar Chart FY2024 Growth Rates')
        save_chart("Chart_12_Radar_Chart")

    # Chart 13: Efficiency Ranking
    plt.figure(figsize=(10, 6))
    df_rank1 = df.dropna(subset=['Grid_Expansion_Per_Tk']).sort_values('Grid_Expansion_Per_Tk', ascending=False)
    sns.barplot(data=df_rank1, x='Grid_Expansion_Per_Tk', y='Fiscal_Year', orient='h', color='steelblue')
    plt.title('Chart 13: Efficiency Ranking (Grid Expansion Per Tk)')
    save_chart("Chart_13_Efficiency_Grid_Expansion")

    # Chart 14: Efficiency Ranking MVA
    plt.figure(figsize=(10, 6))
    df_rank2 = df.dropna(subset=['MVA_Expansion_Per_Tk']).sort_values('MVA_Expansion_Per_Tk', ascending=False)
    if not df_rank2.empty:
        sns.barplot(data=df_rank2, x='MVA_Expansion_Per_Tk', y='Fiscal_Year', orient='h', color='darkorange')
        plt.title('Chart 14: Efficiency Ranking (MVA Expansion Per Tk)')
        save_chart("Chart_14_Efficiency_MVA_Expansion")

    # Chart 15: Timeline Infographic
    plt.figure(figsize=(12, 4))
    plt.scatter(df['Fiscal_Year'], [1]*len(df), color='gray')
    plt.title('Chart 15: Timeline of Fiscal Years')
    plt.yticks([])
    plt.xticks(rotation=45)
    for i, row in df.iterrows():
        plt.annotate(f"{row['Power_Division_Budget_TkCr']} Cr Tk", (row['Fiscal_Year'], 1.02), rotation=45, ha='left', fontsize=8)
    save_chart("Chart_15_Timeline")

if __name__ == '__main__':
    if os.path.exists('master_data.json'):
        main()
    else:
        print("Waiting for master_data.json...")
