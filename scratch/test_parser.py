import os
import re

filepath = r"c:\Users\hamim\Desktop\PGCB\Daily Reports\Daily Reports Parsed\Daily Report 25-06-2026;.txt"

def clean_float(val_str):
    if not val_str:
        return 0.0
    clean = re.sub(r'[^\d\.\-]', '', str(val_str).replace(',', '').strip())
    try:
        return float(clean) if '.' in clean else float(int(clean))
    except ValueError:
        return 0.0

def extract_first_number(val_str):
    if not val_str:
        return 0.0
    s = str(val_str).replace(',', '')
    nums = re.findall(r'[-+]?\d*\.\d+|\d+', s)
    if nums:
        return float(nums[0])
    return 0.0

def get_sheet_content(content, sheet_name):
    pattern = r'## Sheet:\s*' + re.escape(sheet_name) + r'\b'
    m = re.search(pattern, content, re.IGNORECASE)
    if not m:
        return ""
    start_idx = m.end()
    rest = content[start_idx:]
    next_sheet = rest.find('## Sheet:')
    if next_sheet != -1:
        return rest[:next_sheet]
    return rest

def test():
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    p1 = get_sheet_content(content, 'P1')
    if not p1:
        print("P1 not found!")
        return

    # Basic stats
    day_peak_gen = 0.0
    evening_peak_gen = 0.0
    evening_peak_demand = 0.0
    total_energy_gen = 0.0
    total_gas_supplied_power = 0.0
    total_daily_cost = 0.0
    min_gen = 0.0
    max_gen = 0.0

    for line in p1.split('\n'):
        line_lower = line.lower()
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if not parts:
            continue
        
        for idx, cell in enumerate(parts):
            cell_lower = cell.lower()
            if 'day peak generation' in cell_lower:
                if idx + 1 < len(parts): day_peak_gen = clean_float(parts[idx+1])
            elif 'evening peak generation' in cell_lower:
                if idx + 1 < len(parts): evening_peak_gen = clean_float(parts[idx+1])
            elif 'evening peak demand' in cell_lower or 'e.p. demand' in cell_lower:
                if idx + 1 < len(parts): evening_peak_demand = clean_float(parts[idx+1])
            elif 'energy generated' in cell_lower or 'total gen.' in cell_lower or 'total gen (' in cell_lower:
                if idx + 1 < len(parts): total_energy_gen = clean_float(parts[idx+1])
            elif 'total gas supplied' in cell_lower or 'gas consumed' in cell_lower:
                if idx + 1 < len(parts):
                    val = clean_float(parts[idx+1])
                    if val > 0: total_gas_supplied_power = val
                if total_gas_supplied_power == 0.0:
                    nums = re.findall(r'[-+]?\d*\.\d+|\d+', cell)
                    if nums: total_gas_supplied_power = float(nums[0])
            elif 'min. gen.' in cell_lower or 'minimum generation' in cell_lower:
                if idx + 1 < len(parts):
                    val = clean_float(parts[idx+1])
                    if val > 0: min_gen = val
            elif 'max. gen.' in cell_lower or 'maximum generation' in cell_lower:
                if idx + 1 < len(parts):
                    val = clean_float(parts[idx+1])
                    if val > 0: max_gen = val
            elif 'coal    :' in cell_lower or 'total   :' in cell_lower or 'total:' in cell_lower:
                if 'total' in cell_lower:
                    if idx + 1 < len(parts): total_daily_cost = clean_float(parts[idx+1])

    # Regional loadshedding
    regional_loadshed = {
        'Dhaka': 0.0, 'Chattogram': 0.0, 'Cumilla': 0.0, 'Mymensingh': 0.0,
        'Sylhet': 0.0, 'Khulna': 0.0, 'Barishal': 0.0, 'Rajshahi': 0.0, 'Rangpur': 0.0
    }
    
    in_loadshed_section = False
    for line in p1.split('\n'):
        line_lower = line.lower()
        if 'load-shed' in line_lower or 'load shedding' in line_lower or 'loadshed' in line_lower or 'area' in line_lower and 'yesterday' in line_lower:
            in_loadshed_section = True
            continue
        if in_loadshed_section:
            if '|' in line:
                parts = [p.strip() for p in line.split('|')]
                cells = [c for c in parts if c]
                if len(cells) > 1:
                    zone_name = cells[0].strip()
                    matched_zone = None
                    if 'dhaka' in zone_name.lower(): matched_zone = 'Dhaka'
                    elif 'chittagong' in zone_name.lower() or 'chattogram' in zone_name.lower(): matched_zone = 'Chattogram'
                    elif 'comilla' in zone_name.lower() or 'cumilla' in zone_name.lower(): matched_zone = 'Cumilla'
                    elif 'mymensingh' in zone_name.lower(): matched_zone = 'Mymensingh'
                    elif 'sylhet' in zone_name.lower(): matched_zone = 'Sylhet'
                    elif 'khulna' in zone_name.lower(): matched_zone = 'Khulna'
                    elif 'barisal' in zone_name.lower() or 'barishal' in zone_name.lower(): matched_zone = 'Barishal'
                    elif 'rajshahi' in zone_name.lower(): matched_zone = 'Rajshahi'
                    elif 'rangpur' in zone_name.lower(): matched_zone = 'Rangpur'
                    
                    if matched_zone:
                        val = 0.0
                        if len(cells) > 1:
                            val = clean_float(cells[1])
                        regional_loadshed[matched_zone] = val
                    elif 'total' in zone_name.lower():
                        in_loadshed_section = False

    # Regional served
    regional_served = {
        'Dhaka': 0.0, 'Chattogram': 0.0, 'Cumilla': 0.0, 'Mymensingh': 0.0,
        'Sylhet': 0.0, 'Khulna': 0.0, 'Barishal': 0.0, 'Rajshahi': 0.0, 'Rangpur': 0.0
    }
    p3_content = get_sheet_content(content, 'P3')
    if p3_content:
        for line in p3_content.split('\n'):
            if '|' in line:
                parts = [p.strip() for p in line.split('|')]
                cells = [c for c in parts if c]
                for idx, cell in enumerate(cells):
                    cell_lower = cell.lower()
                    val = 0.0
                    matched_zone = None
                    if 'dhaka area' in cell_lower: matched_zone = 'Dhaka'
                    elif 'chittagong area' in cell_lower or 'chattogram area' in cell_lower: matched_zone = 'Chattogram'
                    elif 'comilla area' in cell_lower or 'cumilla area' in cell_lower: matched_zone = 'Cumilla'
                    elif 'mymensingh area' in cell_lower: matched_zone = 'Mymensingh'
                    elif 'sylhet area' in cell_lower: matched_zone = 'Sylhet'
                    elif 'khulna area' in cell_lower: matched_zone = 'Khulna'
                    elif 'rajshahi area' in cell_lower: matched_zone = 'Rajshahi'
                    elif 'barisal area' in cell_lower or 'barishal area' in cell_lower: matched_zone = 'Barishal'
                    elif 'rangpur area' in cell_lower: matched_zone = 'Rangpur'
                    
                    if matched_zone:
                        if idx + 2 < len(cells):
                            val = clean_float(cells[idx+2])
                        regional_served[matched_zone] = val

    # Fuel Generation Mix
    gas_gen, coal_gen, solar_gen, oil_gen, hydro_gen = 0.0, 0.0, 0.0, 0.0, 0.0
    wind_gen = 0.0
    total_imports = 0.0
    parsed_via_table = False

    # Look for Zone-wise Generation Summary (MKWHr.) table in P1
    header_idx = -1
    lines = p1.split('\n')
    for idx, line in enumerate(lines):
        if '|' in line:
            parts = [p.strip().lower() for p in line.split('|') if p.strip()]
            if 'gas' in parts and 'coal' in parts and 'hfo' in parts and 'total' in parts:
                header_idx = idx
                headers = parts
                break

    if header_idx != -1:
        for line in lines[header_idx + 1:]:
            if '|' in line:
                parts = [p.strip() for p in line.split('|')]
                cells = [c for c in parts if c]
                if cells and cells[0].lower() == 'total':
                    val_map = {}
                    for h_idx, h in enumerate(headers):
                        if h_idx < len(cells) - 1:
                            val_map[h] = clean_float(cells[h_idx + 1])
                    
                    gas_gen = val_map.get('gas', 0.0)
                    coal_gen = val_map.get('coal', 0.0)
                    oil_gen = val_map.get('hfo', 0.0) + val_map.get('hsd', 0.0)
                    hydro_gen = val_map.get('hydro', 0.0)
                    solar_gen = val_map.get('solar', 0.0)
                    wind_gen = val_map.get('wind', 0.0)
                    total_imports = val_map.get('import', 0.0)
                    parsed_via_table = True
                    break

    if not parsed_via_table:
        # Fallback to search By Gas etc. in whole file
        for line in content.split('\n'):
            if '|' in line:
                parts = [p.strip() for p in line.split('|')]
                for idx, cell in enumerate(parts):
                    cell_clean = cell.lower()
                    if 'by gas' in cell_clean:
                        if idx + 1 < len(parts): gas_gen = clean_float(parts[idx+1])
                    elif 'by coal' in cell_clean:
                        if idx + 1 < len(parts): coal_gen = clean_float(parts[idx+1])
                    elif 'by solar' in cell_clean:
                        if idx + 1 < len(parts): solar_gen = clean_float(parts[idx+1])
                    elif 'by oil' in cell_clean:
                        if idx + 1 < len(parts): oil_gen = clean_float(parts[idx+1])
                    elif 'by hydro' in cell_clean:
                        if idx + 1 < len(parts): hydro_gen = clean_float(parts[idx+1])
                    elif 'by adani' in cell_clean:
                        if idx + 1 < len(parts): adani_gen = clean_float(parts[idx+1])

    # Import stats
    border_imports_data = []
    hvdc_gen, adani_gen, tripura_gen = 0.0, 0.0, 0.0
    hvdc_peak, adani_peak, tripura_peak = 0.0, 0.0, 0.0

    if parsed_via_table:
        # Newer files: parse from P1 interconnector section using cell keywords
        for line in p1.split('\n'):
            if '|' in line:
                parts = [p.strip() for p in line.split('|')]
                cells = [c for c in parts if c]
                for idx, cell in enumerate(cells):
                    cell_lower = cell.lower()
                    if 'hvdc' in cell_lower and 'interconnector' in cell_lower:
                        if idx + 2 < len(cells): hvdc_gen = extract_first_number(cells[idx+2])
                        if idx + 4 < len(cells): hvdc_peak = extract_first_number(cells[idx+4])
                    elif 'adani' in cell_lower and 'interconnector' in cell_lower:
                        if idx + 2 < len(cells): adani_gen = extract_first_number(cells[idx+2])
                        if idx + 4 < len(cells): adani_peak = extract_first_number(cells[idx+4])
                    elif ('cumilla' in cell_lower or 'tripura' in cell_lower) and 'interconnector' in cell_lower:
                        if idx + 2 < len(cells): tripura_gen = extract_first_number(cells[idx+2])
                        if idx + 4 < len(cells): tripura_peak = extract_first_number(cells[idx+4])
    else:
        # Older files: parse from YesterdayGen
        ygen_content = get_sheet_content(content, 'YesterdayGen') or get_sheet_content(content, 'GenLog')
        if ygen_content:
            lines = ygen_content.split('\n')
            name_row, kwh_row, peak_row = None, None, None
            for line in lines:
                if 'plant name' in line.lower():
                    name_row = line
                elif '|' in line:
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) > 1:
                        if parts[1] == 'KWH': kwh_row = line
                        elif parts[1] == 'Yesterday Evening Peak': peak_row = line
            
            if name_row and kwh_row and peak_row:
                names = [n.strip() for n in name_row.split('|')]
                kwhs = [k.strip() for k in kwh_row.split('|')]
                peaks = [p.strip() for p in peak_row.split('|')]
                
                for i in range(len(names)):
                    name = names[i]
                    k = clean_float(kwhs[i]) if i < len(kwhs) else 0.0
                    p = clean_float(peaks[i]) if i < len(peaks) else 0.0
                    name_lower = name.lower()
                    
                    if 'hvdc' in name_lower or 'bheramara (hvdc' in name_lower or 'bheramara hvdc' in name_lower:
                        hvdc_gen = k / 1000000.0
                        hvdc_peak = p
                    elif 'tripura' in name_lower or 'impoprt (tripura)' in name_lower:
                        tripura_gen = k / 1000000.0
                        tripura_peak = p
                    elif 'adani' in name_lower:
                        adani_gen = k / 1000000.0
                        adani_peak = p

    if hvdc_gen > 0.0 or hvdc_peak > 0.0:
        border_imports_data.append({'source': 'HVDC Bheramara (India)', 'energy': round(hvdc_gen, 2), 'peakFlow': hvdc_peak, 'type': 'C/B Interconnector (West)'})
    if adani_gen > 0.0 or adani_peak > 0.0:
        border_imports_data.append({'source': 'Adani Godda (India)', 'energy': round(adani_gen, 2), 'peakFlow': adani_peak, 'type': 'C/B Interconnector (North)'})
    if tripura_gen > 0.0 or tripura_peak > 0.0:
        border_imports_data.append({'source': 'Tripura Cumilla (India)', 'energy': round(tripura_gen, 2), 'peakFlow': tripura_peak, 'type': 'C/B Interconnector (East)'})

    if total_imports == 0.0:
        total_imports = hvdc_gen + adani_gen + tripura_gen

    print(f"Day Peak Gen: {day_peak_gen}")
    print(f"Evening Peak Gen: {evening_peak_gen}")
    print(f"Total Energy Gen: {total_energy_gen}")
    print(f"Gas Supplied: {total_gas_supplied_power}")
    print(f"Total Daily Cost: {total_daily_cost}")
    print(f"Gas Gen: {gas_gen}")
    print(f"Coal Gen: {coal_gen}")
    print(f"Oil Gen: {oil_gen}")
    print(f"Hydro Gen: {hydro_gen}")
    print(f"Solar Gen: {solar_gen}")
    print(f"Imports Gen: {total_imports}")
    print(f"Border Imports Data: {border_imports_data}")
    print(f"Dhaka Loadshed: {regional_loadshed['Dhaka']}, Served: {regional_served['Dhaka']}")

if __name__ == '__main__':
    test()
