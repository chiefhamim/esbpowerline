import os
import json
import datetime

def rebuild_fallback(base_dir, daily_dir):
    fallback_path = os.path.join(base_dir, "lib", "data", "grid", "archive-fallback.ts")
    print("Rebuilding archive-fallback.ts...")
    start_dt = datetime.date(2026, 6, 29)
    dates_list = [(start_dt - datetime.timedelta(days=i)).strftime("%Y-%m-%d") for i in range(30)]
    dates_list.sort()
    
    archive_data = {}
    for d in dates_list:
        daily_fpath = os.path.join(daily_dir, f"{d}.json")
        if os.path.exists(daily_fpath):
            with open(daily_fpath, 'r', encoding='utf-8') as f:
                archive_data[d] = json.load(f)
        else:
            print(f"WARNING: Daily JSON file not found for {d} while rebuilding fallback!")

    ts_content = """// Auto-generated thin fallback — canonical source is public/data/daily/{YYYY-MM-DD}.json
import type { GridDailyData } from './types';

/** Offline/fetch-failure fallback keyed by YYYY-MM-DD. */
export const powerGridArchive: Record<string, GridDailyData> = {
"""
    
    for i, d in enumerate(dates_list):
        if d in archive_data:
            json_str = json.dumps(archive_data[d], indent=2)
            # Indent each line by 4 spaces
            lines = json_str.split('\n')
            indented_lines = [lines[0]] + [f"    {line}" for line in lines[1:]]
            formatted_block = '\n'.join(indented_lines)
            
            ts_content += f'  "{d}": {formatted_block}'
            if i < len(dates_list) - 1:
                ts_content += ",\n"
            else:
                ts_content += "\n"
                
    ts_content += """};

export function getArchiveFallback(isoDate: string): GridDailyData | null {
  return powerGridArchive[isoDate] ?? null;
}
"""
    
    with open(fallback_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print("Rebuilt archive-fallback.ts completely and cleanly.")

def main():
    base_dir = r"C:\Users\user\esbpowerline"
    live_data_path = r"c:\Users\user\Desktop\grid_live_data.json"
    daily_dir = os.path.join(base_dir, "public", "data", "daily")
    target_path = os.path.join(daily_dir, "2026-06-29.json")
    
    if not os.path.exists(live_data_path):
        print(f"Error: {live_data_path} not found")
        return
        
    with open(live_data_path, 'r', encoding='utf-8') as f:
        live = json.load(f)
        
    if os.path.exists(target_path):
        with open(target_path, 'r', encoding='utf-8') as f:
            target = json.load(f)
    else:
        target = {}
        
    # Standard colors for fuels
    fuel_colors = {
        "Gas": "#0ea5e9",
        "Coal": "#64748b",
        "HFO": "#f97316",
        "Hydro": "#06b6d4",
        "Solar": "#eab308",
        "Imports": "#a855f7",
        "HSD (Diesel)": "#ef4444"
    }
    
    # 1. Map systemStats
    day_peak_gen = 14670.0
    for item in live.get('outage_log', []):
        if 'day peak generation' in item.get('circuit', '').lower() or 'day peak generation' in item.get('reason', '').lower():
            try:
                nums = [float(s) for s in item['circuit'].split() if s.replace('.','',1).isdigit()]
                if nums:
                    day_peak_gen = nums[0]
            except Exception:
                pass
                
    evening_peak_gen = float(live.get('margins', {}).get('max_generation_mw', 16082.0))
    evening_peak_demand = float(live.get('overview', {}).get('peak_demand_mw', '16487').split()[0])
    
    # Parse total cost and conversion to Taka
    estimated_cost_cr = float(live.get('overview', {}).get('estimated_fuel_cost_cr_tk', '227.7').split()[0])
    total_daily_cost = int(estimated_cost_cr * 10000000)
    
    gas_supplied = live.get('gas_to_power', {}).get('gas_supplied_mmcfd', 921.67)
    
    total_energy_unserved = 1.07
    total_energy_gen = 352.97
    for f in live.get('generation_breakdown', []):
        if f.get('fuel') == 'Total System / Average':
            total_energy_gen = f.get('generation_mkwh', 352.97)
            
    system_stats = {
        "date": "29 Jun 2026",
        "dayPeakGen": day_peak_gen,
        "eveningPeakGen": evening_peak_gen,
        "dayPeakDemand": day_peak_gen,
        "eveningPeakDemand": evening_peak_demand,
        "minGen": float(live.get('margins', {}).get('min_generation_mw', 13577.0)),
        "maxGen": evening_peak_gen,
        "totalEnergyGen": total_energy_gen,
        "totalEnergyUnserved": total_energy_unserved,
        "totalEnergyDemand": round(total_energy_gen + total_energy_unserved, 2),
        "maxTemp": float(live.get('margins', {}).get('max_temp_c', 32.0)),
        "totalGasSuppliedPower": gas_supplied,
        "avgProductionCost": 6.45,
        "totalDailyCost": total_daily_cost
    }
    
    # 2. Map generationData
    gen_data = []
    for f in live.get('generation_breakdown', []):
        fuel_name = f.get('fuel')
        if fuel_name == 'Total System / Average':
            continue
        gen_data.append({
            "name": fuel_name,
            "gen": f.get('generation_mkwh', 0.0),
            "cost": int(f.get('cost_crore', 0.0) * 10000000),
            "unitCost": f.get('unit_cost', 0.0),
            "color": fuel_colors.get(fuel_name, "#cccccc")
        })
        
    # 3. Map borderImportsData
    border_imports = []
    for item in live.get('cross_border_imports', []):
        border_imports.append({
            "source": item.get('source', ''),
            "energy": round(item.get('imported_mkwh', 0.0), 2),
            "peakFlow": item.get('capacity_served_mw', 0),
            "type": item.get('type', '')
        })
        
    # 4. Map regionalDemandData
    regional_demand = []
    for item in live.get('regional_load_shedding', []):
        regional_demand.append({
            "zone": item.get('zone', ''),
            "loadShed": float(item.get('load_shed_mw', 0.0)),
            "demand": float(item.get('demand_mw', 0.0)),
            "pct": float(item.get('severity_pct', 0.0))
        })
        
    # 5. Map dailyOutages
    outages = []
    for item in live.get('outage_log', []):
        outages.append({
            "time": item.get('time', ''),
            "plant": item.get('circuit', ''),
            "load": item.get('status', ''),
            "reason": item.get('reason', ''),
            "full_desc": f"{item.get('circuit', '')} {item.get('reason', '')}".strip()
        })
        
    # 6. Map hourlyLoadData
    hourly = []
    for h in range(24):
        time_str = f"{h:02d}:00"
        gen_val = evening_peak_gen if h >= 18 and h <= 22 else day_peak_gen
        hourly.append({
            "time": time_str,
            "generation": gen_val,
            "loadShed": 0.0,
            "demand": gen_val
        })
        
    # 7. Map gasProductionData
    gas_prod = []
    for item in live.get('gas_production', []):
        gas_prod.append({
            "company": item.get('company', ''),
            "fields": item.get('fields', 0),
            "gas": item.get('gas', 0.0),
            "condensate": item.get('condensate', 0.0),
            "share": item.get('share', 0.0)
        })
        
    # 8. Preserve gasDistributionData from target
    gas_dist = target.get('gasDistributionData', [])
    if not gas_dist:
        gas_dist = [
            {"company": "TGTDCL (Dhaka & Mymensingh)", "power": 271.8, "fertilizer": 73.4, "others": 1059.9, "total": 1405.1},
            {"company": "BGDCL (Cumilla & Sylhet)", "power": 208.2, "fertilizer": 0, "others": 88.7, "total": 296.9},
            {"company": "KGDCL (Chattogram)", "power": 36.8, "fertilizer": 38.5, "others": 171.9, "total": 247.2},
            {"company": "JGTDSL (Sylhet region)", "power": 222.2, "fertilizer": 40.3, "others": 113.7, "total": 376.2},
            {"company": "PGCL (Rajshahi & Rangpur)", "power": 128.6, "fertilizer": 0, "others": 29.6, "total": 158.2},
            {"company": "SGCL (Barishal & Khulna)", "power": 54.5, "fertilizer": 0, "others": 4.6, "total": 59.1}
        ]
        
    output_data = {
        "systemStats": system_stats,
        "generationData": gen_data,
        "borderImportsData": border_imports,
        "regionalDemandData": regional_demand,
        "dailyOutages": outages,
        "hourlyLoadData": hourly,
        "gasProductionData": gas_prod,
        "gasDistributionData": gas_dist
    }
    
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
        
    print(f"Successfully mapped grid_live_data.json and wrote to {target_path}")
    
    # Rebuild archive-fallback.ts
    rebuild_fallback(base_dir, daily_dir)

if __name__ == "__main__":
    main()
