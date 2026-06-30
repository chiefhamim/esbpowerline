import os
import json

def check():
    for date in ["2026-06-26", "2026-06-27"]:
        bpath = f"C:\\Users\\user\\Desktop\\grid_backlog\\{date}.json"
        if os.path.exists(bpath):
            with open(bpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print(f"Date {date} keys:", data.keys())
            # check if it has hourly_load_curve or similar
            hourly_keys = [k for k in data.keys() if "hour" in k or "load" in k or "curve" in k]
            print(f"  Hourly keys: {hourly_keys}")
            for k in hourly_keys:
                val = data[k]
                print(f"  Length of {k}: {len(val) if isinstance(val, list) else 'not list'}")
        else:
            print(f"Backlog {date}.json does not exist")

if __name__ == "__main__":
    check()
