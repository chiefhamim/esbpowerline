"""Build/update daily JSON from official ERP xlsx + Petrobangla PDF."""
import importlib.util
import io
import json
import re
import ssl
import sys
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DL = ROOT / "scratch" / "downloads"
DAILY = ROOT / "public" / "data" / "daily"
DATES = ROOT / "lib" / "available-dates.json"

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
DATE_RE = re.compile(r"\b(\d{2})-(\d{2})-(\d{4})\b")


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "ESBPowerLine/1.0"})
    with urllib.request.urlopen(req, context=CTX, timeout=30) as r:
        return r.read()


def cell_str(val) -> str:
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return ""
    if hasattr(val, "strftime"):
        return val.strftime("%Y-%m-%d")
    return str(val).strip().strip("'")


def xlsx_to_text(path: Path) -> str:
    xl = pd.ExcelFile(path)
    parts = []
    for sheet in xl.sheet_names:
        df = xl.parse(sheet, header=None)
        parts.append(f"## Sheet: {sheet}")
        for _, row in df.iterrows():
            cells = [cell_str(v) for v in row.tolist()]
            while cells and cells[-1] == "":
                cells.pop()
            if any(cells):
                parts.append(" | ".join(cells))
    return "\n".join(parts)


def report_energy_dates(path: Path) -> tuple[date | None, date | None]:
    df = pd.read_excel(path, sheet_name="P1", header=None)
    report = None
    for i in range(min(12, df.shape[0])):
        for j in range(min(12, df.shape[1])):
            cell = df.iloc[i, j]
            if isinstance(cell, str):
                m = DATE_RE.search(cell)
                if m:
                    d, mo, y = m.groups()
                    report = date(int(y), int(mo), int(d))
                    break
        if report:
            break
    if not report:
        return None, None
    return report, report - timedelta(days=1)


def download_erp_by_id(fid: int) -> Path | None:
    for ext in ("xlsx", "xlsm", "xls"):
        loc = urllib.parse.quote(f"erp/web/report_docs/{fid}.{ext}", safe="")
        url = f"https://erp.powergrid.gov.bd/web/files/download?location={loc}&title=Daily"
        try:
            data = fetch(url)
            if data[:2] != b"PK" or len(data) < 15000:
                continue
            dest = DL / f"erp_{fid}.{ext}"
            dest.write_bytes(data)
            return dest
        except Exception:
            pass
    return None


def find_erp_for_energy(target: date, start_id: int = 5040, end_id: int = 5060) -> Path | None:
    for fid in range(end_id, start_id - 1, -1):
        path = DL / f"erp_{fid}.xlsx"
        if not path.exists():
            path = download_erp_by_id(fid)
        if not path or not path.exists():
            continue
        try:
            _, energy = report_energy_dates(path)
            if energy == target:
                return path
        except Exception:
            continue
    return None


def scrape_petrobangla() -> Path | None:
    html = fetch("https://www.petrobangla.org.bd").decode("utf-8", errors="ignore")
    pdfs = re.findall(r'(/uploads/[^"\'\s>]+\.pdf)', html, re.I)
    chosen = next((p for p in pdfs if "daily" in p.lower() or "report" in p.lower()), pdfs[0] if pdfs else None)
    if not chosen:
        return None
    url = chosen if chosen.startswith("http") else f"https://www.petrobangla.org.bd{chosen}"
    data = fetch(url)
    if data[:4] != b"%PDF":
        return None
    dest = DL / "Petrobangla_latest.pdf"
    dest.write_bytes(data)
    return dest


def load_parser():
    spec = importlib.util.spec_from_file_location("parse_daily", ROOT / "scripts" / "parse_daily_reports.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def build_day(energy_date: date, pgcb_path: Path, pb_text_path: Path | None, parser) -> dict:
    text_path = DL / f"pgcb_{energy_date.isoformat()}.txt"
    text_path.write_text(xlsx_to_text(pgcb_path), encoding="utf-8")
    merged = parser.process_single_date(energy_date, str(text_path), str(pb_text_path) if pb_text_path else None)
    if not merged:
        raise RuntimeError(f"Parser failed for {energy_date}")
    return merged


def update_available_dates(iso: str):
    dates = json.loads(DATES.read_text(encoding="utf-8"))
    if iso not in dates:
        dates.append(iso)
        dates.sort()
        DATES.write_text(json.dumps(dates, indent=2), encoding="utf-8")


def main():
    target = date(2026, 6, 30)
    parser = load_parser()

    pgcb_path = find_erp_for_energy(target)
    if not pgcb_path:
        print(f"No ERP report for energy day {target} yet. Latest on ERP:")
        for fid in range(5055, 5045, -1):
            p = DL / f"erp_{fid}.xlsx"
            if p.exists():
                try:
                    r, e = report_energy_dates(p)
                    print(f"  erp_{fid}: report={r} energy={e}")
                except Exception:
                    pass
        sys.exit(2)

    pb_path = scrape_petrobangla()
    pb_text_path = None
    if pb_path:
        try:
            import pypdf

            text = "\n".join((page.extract_text() or "") for page in pypdf.PdfReader(str(pb_path)).pages)
            pb_text_path = DL / "petrobangla_latest.txt"
            pb_text_path.write_text(text, encoding="utf-8")
            print(f"Petrobangla PDF saved ({pb_path.stat().st_size} bytes)")
        except Exception as e:
            print(f"Petrobangla parse warn: {e}")

    merged = build_day(target, pgcb_path, pb_text_path, parser)
    iso = target.isoformat()
    out = DAILY / f"{iso}.json"
    out.write_text(json.dumps(merged, indent=2), encoding="utf-8")
    update_available_dates(iso)
    s = merged["systemStats"]
    print(f"Wrote {out}")
    print(json.dumps({"date": s["date"], "eveningPeakGen": s["eveningPeakGen"], "totalEnergyGen": s["totalEnergyGen"]}, indent=2))


if __name__ == "__main__":
    main()