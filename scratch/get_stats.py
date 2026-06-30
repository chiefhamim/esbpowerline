import os
import json

def get_stats():
    base_dir = r"C:\Users\user\esbpowerline"
    for d in ["2026-06-02", "2026-06-28", "2026-06-29"]:
        fpath = os.path.join(base_dir, "public", "data", "daily", f"{d}.json")
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            stats = data.get("systemStats", {})
            print(f"Date {d}:")
            print(f"  eveningPeakGen: {stats.get('eveningPeakGen')}")
            print(f"  eveningPeakDemand: {stats.get('eveningPeakDemand')}")
            print(f"  totalEnergyUnserved: {stats.get('totalEnergyUnserved')}")
            print(f"  dailyOutages count: {len(data.get('dailyOutages', []))}")
        else:
            print(f"File {d}.json does not exist")

if __name__ == "__main__":
    get_stats()
