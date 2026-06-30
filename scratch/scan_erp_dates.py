"""Scan ERP downloads for report date string in P1."""
import re
from pathlib import Path

import pandas as pd

DL = Path(__file__).resolve().parents[1] / "scratch" / "downloads"
DATE_RE = re.compile(r"\b(\d{2})-(\d{2})-(\d{4})\b")


def report_meta(path: Path) -> dict | None:
    try:
        xl = pd.ExcelFile(path)
        if "P1" not in xl.sheet_names:
            return None
        df = pd.read_excel(path, sheet_name="P1", header=None)
    except Exception:
        return None

    report_date = None
    evening_peak = None
    for i in range(min(12, df.shape[0])):
        for j in range(min(12, df.shape[1])):
            cell = df.iloc[i, j]
            if isinstance(cell, str):
                m = DATE_RE.search(cell)
                if m:
                    d, mo, y = m.groups()
                    report_date = f"{y}-{mo}-{d}"
                    break
        if report_date:
            break
        for j in range(min(12, df.shape[1])):
            cell = df.iloc[i, j]
            if isinstance(cell, str) and cell.strip().strip("'").startswith("Evening Peak Generation"):
                try:
                    evening_peak = float(df.iloc[i, j + 3])
                except Exception:
                    pass
    if not report_date:
        return None
    return {"file": path.name, "report_date": report_date, "evening_peak": evening_peak}


rows = []
for f in sorted(DL.glob("erp_*.*")):
    m = report_meta(f)
    if m:
        rows.append(m)

june2026 = [r for r in rows if r["report_date"].startswith("2026-06")]
print("June 2026:", len(june2026))
for r in sorted(june2026, key=lambda x: x["report_date"]):
    print(r)

print("\nLatest 20 overall:")
for r in sorted(rows, key=lambda x: x["report_date"])[-20:]:
    print(r)