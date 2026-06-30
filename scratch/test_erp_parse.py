import importlib.util
import json
from datetime import date
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DL = ROOT / "scratch" / "downloads"


def to_text(path: Path) -> str:
    xl = pd.ExcelFile(path)
    parts = []
    for sheet in xl.sheet_names:
        df = xl.parse(sheet, header=None)
        parts.append(f"## Sheet: {sheet}")
        for _, row in df.iterrows():
            cells = []
            for v in row.tolist():
                if pd.isna(v):
                    cells.append("")
                else:
                    cells.append(str(v).strip().strip("'"))
            while cells and not cells[-1]:
                cells.pop()
            if any(cells):
                parts.append(" | ".join(cells))
    return "\n".join(parts)


spec = importlib.util.spec_from_file_location("p", ROOT / "scripts" / "parse_daily_reports.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

for energy, fid in [("2026-06-28", 5050), ("2026-06-25", 5046)]:
    p = DL / f"erp_{fid}.xlsx"
    txt = DL / f"test_{energy}.txt"
    txt.write_text(to_text(p), encoding="utf-8")
    y, m, d = map(int, energy.split("-"))
    merged = mod.parse_pgcb_file(str(txt), date(y, m, d))
    if not merged:
        print(energy, "PARSE FAILED")
        continue
    local = json.loads((ROOT / "public" / "data" / "daily" / f"{energy}.json").read_text(encoding="utf-8"))
    ls = local["systemStats"]
    ms = merged["systemStats"]
    print(
        energy,
        "official epg", ms["eveningPeakGen"],
        "local", ls["eveningPeakGen"],
        "official gen", ms["totalEnergyGen"],
        "local", ls["totalEnergyGen"],
    )