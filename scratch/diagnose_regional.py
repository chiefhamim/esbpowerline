import os
import json
import datetime

def diagnose():
    base_dir = r"C:\Users\user\esbpowerline"
    daily_dir = os.path.join(base_dir, "public", "data", "daily")
    
    # Let's check the last 30 days from 2026-06-29 backwards
    start_date = datetime.date(2026, 6, 29)
    dates = [ (start_date - datetime.timedelta(days=i)).strftime("%Y-%m-%d") for i in range(30) ]
    
    missing_regional = []
    missing_outages = []
    
    for d in dates:
        fpath = os.path.join(daily_dir, f"{d}.json")
        if not os.path.exists(fpath):
            print(f"Date {d}: File does not exist!")
            continue
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            reg = data.get("regionalDemandData", [])
            outages = data.get("dailyOutages", [])
            
            if not reg:
                missing_regional.append(d)
            if not outages:
                missing_outages.append(d)
                
            print(f"Date {d}: regionalDemandData len = {len(reg)}, dailyOutages len = {len(outages)}")
        except Exception as e:
            print(f"Error reading {d}.json: {e}")
            
    print(f"\nMissing regionalDemandData (last 30 days): {missing_regional}")
    print(f"Missing dailyOutages (last 30 days): {missing_outages}")

if __name__ == "__main__":
    diagnose()
