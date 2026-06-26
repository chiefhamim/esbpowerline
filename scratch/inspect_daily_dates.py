import os
import re

p1 = r"c:\Users\hamim\Desktop\PGCB\Daily Reports\Daily Reports Parsed"
p2 = r"c:\Users\hamim\Desktop\Petrobangla\Daily Gas Reports\Daily Gas Reports Parsed"

print("P1 Samples:")
p1_files = sorted(os.listdir(p1))[:10]
for f in p1_files:
    fpath = os.path.join(p1, f)
    content = open(fpath, errors='ignore').read()
    # Let's search for Reporting Date or operational date
    report_date = re.search(r'Reporting Date\s*:\s*\|?\s*([\d\-]{10}|[\d\.]{10})', content)
    yesterday_date = re.search(r"Yesterday's\s*\|\s*([\d\-]{10}|[\d\.]{10})", content)
    print(f"File: {f}")
    print(f"  Report Date match: {report_date.group(1) if report_date else 'None'}")
    print(f"  Yesterday Date match: {yesterday_date.group(1) if yesterday_date else 'None'}")

print("\nP2 Samples:")
p2_files = sorted(os.listdir(p2))[:10]
for f in p2_files:
    fpath = os.path.join(p2, f)
    content = open(fpath, errors='ignore').read()
    # Search for Date
    date_match = re.search(r'Date\s*:\s*([^\n\r]+)', content)
    print(f"File: {f}")
    print(f"  Date line: {date_match.group(1).strip() if date_match else 'None'}")
