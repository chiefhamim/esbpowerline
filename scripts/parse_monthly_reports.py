import os
import re
import json
import glob

def clean_float(val_str):
    if not val_str:
        return 0.0
    # Remove commas, percentage signs, and extra whitespaces
    clean = re.sub(r'[^\d\.\-]', '', val_str.replace(',', '').strip())
    try:
        return float(clean)
    except ValueError:
        return 0.0

def parse_report_file(filepath):
    filename = os.path.basename(filepath)
    # Filename matching: e.g. "February-2026.txt", "April_2013.txt", "August 2015.txt", "November- 2019.txt"
    m = re.match(r'([a-zA-Z]+)[-_ ]*(\d{4})', filename)
    if not m:
        # Fallback regex in case of different formatting
        m = re.search(r'([a-zA-Z]+).+?(\d{4})', filename)
        if not m:
            print(f"[Warning] Could not parse month/year from filename: {filename}")
            return None
    
    month_name = m.group(1).strip().capitalize()
    year = int(m.group(2).strip())
    
    # Map month name to 2-digit representation for key sorting
    month_map = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
    }
    
    if month_name not in month_map:
        # Check substring matches just in case
        matched = False
        for k in month_map:
            if k.lower() in month_name.lower():
                month_name = k
                matched = True
                break
        if not matched:
            print(f"[Warning] Unknown month name '{month_name}' in file '{filename}'")
            return None
            
    date_key = f"{year}-{month_map[month_name]}"
    
    data = {
        "filename": filename,
        "month": month_name,
        "year": year,
        "date_key": date_key,
        "max_evening_peak_gen": 0.0,
        "max_evening_peak_demand": 0.0,
        "total_net_generation": 0.0,
        "generation_by_fuel": {
            "gas": 0.0,
            "coal": 0.0,
            "hfo": 0.0,
            "diesel": 0.0,
            "hydro": 0.0,
            "solar": 0.0,
            "wind": 0.0,
            "import": 0.0
        },
        "regional_supply": {
            "dhaka": 0.0,
            "chittagong": 0.0,
            "comilla": 0.0,
            "mymensingh": 0.0,
            "sylhet": 0.0,
            "khulna": 0.0,
            "barisal": 0.0,
            "rajshahi": 0.0,
            "rangpur": 0.0
        }
    }
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    in_mis3_sheet = False
    in_ldc22_sheet = False
    in_fuel_section = False
    
    for line in lines:
        line_strip = line.strip()
        # Older files have MIS instead of QF-MIS-03
        if line_strip.startswith("## Sheet: QF-MIS-03") or line_strip.startswith("## Sheet: MIS"):
            in_mis3_sheet = True
            in_ldc22_sheet = False
            continue
        elif line_strip.startswith("## Sheet: QF-LDC-22"):
            in_mis3_sheet = False
            in_ldc22_sheet = True
            continue
        elif line_strip.startswith("## Sheet:"):
            in_mis3_sheet = False
            in_ldc22_sheet = False
            continue
            
        if in_mis3_sheet:
            if line_strip.startswith("|") and not line_strip.startswith("|:"):
                parts = [p.strip() for p in line_strip.split("|")]
                if len(parts) > 3:
                    lbl = parts[2].lower()
                    
                    # Dynamically detect if value is shifted due to separate unit column
                    if len(parts) > 4 and parts[3].strip().lower() in ["mw", "mkwh", "mkwhr", "m.taka", "%", "nos.", "mva", "unit"]:
                        val = clean_float(parts[4])
                    else:
                        val = clean_float(parts[3])
                    
                    if "fuel wise generation" in lbl:
                        in_fuel_section = True
                        continue
                    elif in_fuel_section and ("maximum of the daily total" in lbl or "monthly load factor" in lbl or "total fuel cost" in lbl):
                        in_fuel_section = False
                        
                    if in_fuel_section:
                        if "gas" in lbl:
                            data["generation_by_fuel"]["gas"] = val
                        elif "oil" in lbl or "liquid fuel" in lbl or "furnace" in lbl:
                            data["generation_by_fuel"]["hfo"] = val
                        elif "diesel" in lbl:
                            data["generation_by_fuel"]["diesel"] = val
                        elif "hydro" in lbl:
                            data["generation_by_fuel"]["hydro"] = val
                        elif "coal" in lbl:
                            data["generation_by_fuel"]["coal"] = val
                        elif "solar" in lbl:
                            data["generation_by_fuel"]["solar"] = val
                        elif "wind" in lbl:
                            data["generation_by_fuel"]["wind"] = val
                        elif "hvdc" in lbl or "import" in lbl or "biptc" in lbl or "a.c" in lbl or "india" in lbl:
                            data["generation_by_fuel"]["import"] += val
                    else:
                        lbl_clean = lbl.strip()
                        # Detect and exclude daily averages or historical comparison rows
                        is_average_or_history = "average" in lbl_clean or ("recorded" in lbl_clean or "till-to-date" in lbl_clean or "last year" in lbl_clean)
                        
                        if not is_average_or_history:
                            if "evening peak generation" in lbl_clean or lbl_clean == "peak generation" or lbl_clean == "peak genaration" or lbl_clean == "maximum generation":
                                data["max_evening_peak_gen"] = val
                            elif "evening peak demand" in lbl_clean or "peak demand" in lbl_clean or "maximum demand" in lbl_clean:
                                data["max_evening_peak_demand"] = val
                            elif "total net generation" in lbl_clean or lbl_clean == "total generation":
                                data["total_net_generation"] = val
                            elif "energy generation by gas" in lbl_clean:
                                data["generation_by_fuel"]["gas"] = val
                            elif "energy generation by coal" in lbl_clean:
                                data["generation_by_fuel"]["coal"] = val
                            elif "energy generation by furnace" in lbl_clean or "furnace oil" in lbl_clean:
                                data["generation_by_fuel"]["hfo"] = val
                            elif "energy generation by diesel" in lbl_clean:
                                data["generation_by_fuel"]["diesel"] = val
                            elif "energy generation by hydro" in lbl_clean:
                                data["generation_by_fuel"]["hydro"] = val
                            elif "energy generation by solar" in lbl_clean:
                                data["generation_by_fuel"]["solar"] = val
                            elif "energy generation by wind" in lbl_clean:
                                data["generation_by_fuel"]["wind"] = val
                            elif "enegry import from india" in lbl_clean or "energy import from india" in lbl_clean:
                                data["generation_by_fuel"]["import"] = val
                            
        elif in_ldc22_sheet:
            if line_strip.startswith("|") and not line_strip.startswith("|:"):
                parts = [p.strip() for p in line_strip.split("|")]
                if len(parts) > 4:
                    region_lbl = parts[2].lower()
                    val = clean_float(parts[4])
                    
                    if region_lbl == "dhaka":
                        data["regional_supply"]["dhaka"] = val
                    elif region_lbl in ["chittagong", "chattogram"]:
                        data["regional_supply"]["chittagong"] = val
                    elif region_lbl in ["comilla", "cumilla"]:
                        data["regional_supply"]["comilla"] = val
                    elif region_lbl == "mymensingh":
                        data["regional_supply"]["mymensingh"] = val
                    elif region_lbl == "sylhet":
                        data["regional_supply"]["sylhet"] = val
                    elif region_lbl == "khulna":
                        data["regional_supply"]["khulna"] = val
                    elif region_lbl in ["barisal", "barishal"]:
                        data["regional_supply"]["barisal"] = val
                    elif region_lbl == "rajshahi":
                        data["regional_supply"]["rajshahi"] = val
                    elif region_lbl == "rangpur":
                        data["regional_supply"]["rangpur"] = val
                        
    return data

def main():
    reports_dir = r"c:\Users\hamim\Desktop\PGCB\Monthy Reports\Parsed_monthly_report"
    output_path = os.path.join(os.getcwd(), "lib", "pgcb-monthly-data.json")
    
    txt_files = glob.glob(os.path.join(reports_dir, "*.txt"))
    print(f"Found {len(txt_files)} report text files.")
    
    all_data = []
    for filepath in txt_files:
        res = parse_report_file(filepath)
        if res:
            all_data.append(res)
            
    # Sort chronologically by date_key
    all_data.sort(key=lambda x: x["date_key"])
    
    print(f"Successfully parsed {len(all_data)} reports.")
    
    # Write to JSON file
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as out_f:
        json.dump(all_data, out_f, indent=2)
        
    print(f"JSON data written to {output_path}")

if __name__ == "__main__":
    main()
