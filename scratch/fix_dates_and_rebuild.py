import os
import json

BASE_DIR = r"C:\Users\user\esbpowerline"
DATA_DIR = os.path.join(BASE_DIR, "public", "data", "daily")
AVAILABLE_DATES_FILE = os.path.join(BASE_DIR, "lib", "available-dates.json")

def fix_dates():
    fixes = [
        {"old": "0202-01-02.json", "new": "2020-01-02.json", "date_str": "02 Jan 2020", "new_date_iso": "2020-01-02"},
        {"old": "0219-11-03.json", "new": "2019-11-03.json", "date_str": "03 Nov 2019", "new_date_iso": "2019-11-03"}
    ]
    
    dates_to_add = []
    
    for item in fixes:
        old_path = os.path.join(DATA_DIR, item["old"])
        new_path = os.path.join(DATA_DIR, item["new"])
        
        if os.path.exists(old_path):
            with open(old_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            if "systemStats" in data:
                data["systemStats"]["date"] = item["date_str"]
                
            with open(new_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
                
            os.remove(old_path)
            print(f"Fixed and renamed {item['old']} -> {item['new']}")
            dates_to_add.append(item["new_date_iso"])
            
    # Update available-dates.json
    if dates_to_add and os.path.exists(AVAILABLE_DATES_FILE):
        with open(AVAILABLE_DATES_FILE, 'r', encoding='utf-8') as f:
            available_dates = set(json.load(f))
            
        for d in dates_to_add:
            available_dates.add(d)
            
        sorted_dates = sorted(list(available_dates))
        
        with open(AVAILABLE_DATES_FILE, 'w', encoding='utf-8') as f:
            json.dump(sorted_dates, f, indent=2)
            
        print(f"Added {dates_to_add} to available-dates.json and sorted.")

if __name__ == "__main__":
    fix_dates()
