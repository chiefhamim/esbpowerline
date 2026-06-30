import os
import json
import collections

# Paths
BASE_DIR = r"C:\Users\user\esbpowerline"
DATA_DIR = os.path.join(BASE_DIR, "public", "data", "daily")
AVAILABLE_DATES_FILE = os.path.join(BASE_DIR, "lib", "available-dates.json")

def check_data_duplicates():
    print("--- Checking Data Storage & Duplicates ---")
    
    # 1. Check daily JSON files
    if not os.path.exists(DATA_DIR):
        print(f"Directory not found: {DATA_DIR}")
        return
        
    daily_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.json')]
    dates_from_files = [f.replace('.json', '') for f in daily_files]
    
    file_date_counts = collections.Counter(dates_from_files)
    duplicate_files = [date for date, count in file_date_counts.items() if count > 1]
    
    if duplicate_files:
        print(f"Duplicate file dates found: {duplicate_files}")
    else:
        print(f"No duplicate daily files found. Total daily files: {len(daily_files)}")
        
    # 2. Check available-dates.json
    if not os.path.exists(AVAILABLE_DATES_FILE):
        print(f"File not found: {AVAILABLE_DATES_FILE}")
        return
        
    try:
        with open(AVAILABLE_DATES_FILE, 'r') as f:
            available_dates = json.load(f)
            
        list_date_counts = collections.Counter(available_dates)
        duplicate_list_dates = [date for date, count in list_date_counts.items() if count > 1]
        
        if duplicate_list_dates:
            print(f"Duplicate dates in available-dates.json: {duplicate_list_dates}")
        else:
            print(f"No duplicate dates in available-dates.json. Total dates: {len(available_dates)}")
            
        # Check if files match the list
        missing_in_list = set(dates_from_files) - set(available_dates)
        missing_in_files = set(available_dates) - set(dates_from_files)
        
        if missing_in_list:
            print(f"Dates with files but missing in available-dates.json: {missing_in_list}")
        if missing_in_files:
            print(f"Dates in available-dates.json but missing files: {missing_in_files}")
            
    except Exception as e:
        print(f"Error reading available-dates.json: {e}")

    # 3. Check for any malformed JSONs
    malformed = []
    for f in daily_files:
        filepath = os.path.join(DATA_DIR, f)
        try:
            with open(filepath, 'r') as fp:
                json.load(fp)
        except Exception:
            malformed.append(f)
            
    if malformed:
        print(f"Malformed JSON files found: {malformed}")
    else:
        print("All JSON files are valid and nicely stored.")
        
def check_code_duplicates():
    print("\n--- Checking Codebase for Duplications (Basic) ---")
    import glob
    
    # We'll do a simple check for exact same file contents or very similar files
    # to see if the user accidentally copied files.
    ts_files = glob.glob(os.path.join(BASE_DIR, "components", "**", "*.tsx"), recursive=True)
    ts_files.extend(glob.glob(os.path.join(BASE_DIR, "lib", "**", "*.ts"), recursive=True))
    
    file_hashes = {}
    duplicates = []
    for f in ts_files:
        try:
            with open(f, 'r', encoding='utf-8') as fp:
                content = fp.read()
                # Use length and basic hash to check for identical files
                h = hash(content)
                if h in file_hashes and file_hashes[h][1] == len(content):
                    duplicates.append((file_hashes[h][0], f))
                else:
                    file_hashes[h] = (f, len(content))
        except Exception:
            pass
            
    if duplicates:
        print("Identical files found (Full duplicates):")
        for f1, f2 in duplicates:
            print(f" - {f1} == {f2}")
    else:
        print("No identical code files found in components/ or lib/")

if __name__ == "__main__":
    check_data_duplicates()
    check_code_duplicates()
