import os
import json
import datetime

def diagnose():
    base_dir = r"C:\Users\user\esbpowerline"
    daily_dir = os.path.join(base_dir, "public", "data", "daily")
    
    start_date = datetime.date(2026, 6, 29)
    dates = [ (start_date - datetime.timedelta(days=i)).strftime("%Y-%m-%d") for i in range(30) ]
    
    missing_hourly = []
    
    for d in dates:
        fpath = os.path.join(daily_dir, f"{d}.json")
        if not os.path.exists(fpath):
            continue
        with open(fpath, "r", encoding="utf-8") as f:
            data = json.load(f)
        hourly = data.get("hourlyLoadData", [])
        if not hourly:
            missing_hourly.append(d)
        print(f"Date {d}: hourlyLoadData count = {len(hourly)}")
        
    print(f"\nMissing hourlyLoadData (last 30 days): {missing_hourly}")

if __name__ == "__main__":
    diagnose()
