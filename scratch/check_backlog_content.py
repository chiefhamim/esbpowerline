import os
import json

def check():
    bpath = r"C:\Users\user\Desktop\grid_backlog\2026-06-25.json"
    if os.path.exists(bpath):
        with open(bpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if 'regional_load_shedding' in data:
            print("regional_load_shedding type:", type(data['regional_load_shedding']))
            print("regional_load_shedding content:", json.dumps(data['regional_load_shedding'], indent=2)[:500])
        if 'outage_log' in data:
            print("outage_log count:", len(data['outage_log']))
            if data['outage_log']:
                print("First outage:", json.dumps(data['outage_log'][0], indent=2))
    else:
        print("Backlog file 2026-06-25.json does not exist")

if __name__ == "__main__":
    check()
