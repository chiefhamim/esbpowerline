from datetime import datetime, timedelta
from pathlib import Path
import pandas as pd

p = Path(r"C:\Users\user\esbpowerline\scratch\downloads\erp_4915.xlsx")
df = pd.read_excel(p, sheet_name="P1", header=None)
print("shape", df.shape)
for i in range(12):
    row = []
    for j in range(14):
        v = df.iloc[i, j]
        if pd.isna(v):
            row.append("")
        elif isinstance(v, str):
            row.append(repr(v)[:40])
        elif isinstance(v, float) and 40000 < v < 50000:
            try:
                d = datetime.fromordinal(datetime(1899, 12, 30).toordinal() + int(v))
                row.append(f"EXCEL_DATE:{d.date()}")
            except Exception:
                row.append(v)
        else:
            row.append(v)
    print(i, row)