"""Fetch latest PGCB/Petrobangla reports and build 2026-06-30 backlog JSON."""
import json
import re
import ssl
import sys
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = ROOT / "scratch" / "downloads"
DOWNLOADS.mkdir(parents=True, exist_ok=True)
DAILY_OUT = ROOT / "public" / "data" / "daily"
DATES_OUT = ROOT / "lib" / "available-dates.json"

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

FUEL_COLORS = {
    "Gas": "#0ea5e9",
    "Coal": "#64748b",
    "HFO": "#f97316",
    "Hydro": "#06b6d4",
    "Solar": "#eab308",
    "Imports": "#a855f7",
    "HSD (Diesel)": "#ef4444",
}
FUEL_UNIT_COSTS = {
    "Gas": 3.45,
    "Coal": 6.62,
    "HFO": 18.06,
    "Hydro": 0.10,
    "Solar": 15.77,
    "Imports": 6.34,
    "HSD (Diesel)": 0.0,
}


def fetch(url: str, timeout: int = 45) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "ESBPowerLine-Ingest/1.0"})
    with urllib.request.urlopen(req, context=CTX, timeout=timeout) as resp:
        return resp.read()


def clean_float(val) -> float:
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = re.sub(r"[^\d.\-]", "", str(val).replace(",", "").strip())
    try:
        return float(s) if s else 0.0
    except ValueError:
        return 0.0


def cell_str(val) -> str:
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return ""
    if hasattr(val, "strftime"):
        return val.strftime("%Y-%m-%d")
    return str(val).strip()


def xlsx_to_text_content(path: Path) -> str:
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


def parse_yesterday_date(path: Path) -> date | None:
    df = pd.read_excel(path, sheet_name="P1", header=None)
    yesterday_col = None
    for i in range(df.shape[0]):
        for j in range(min(14, df.shape[1])):
            cell = df.iloc[i, j]
            if isinstance(cell, str) and "Summary  of  Yesterday" in cell:
                yesterday_col = j + 1
            if yesterday_col is not None and j == yesterday_col and hasattr(cell, "strftime"):
                return cell.date() if hasattr(cell, "date") else cell
    return None


def try_pgcb_urls(target: date) -> Path | None:
    dd = f"{target.day:02d}-{target.month:02d}-{target.year}"
    candidates = [
        f"https://www.pgcb.gov.bd/reports/Daily_Report_{dd}.xlsx",
        f"https://www.pgcb.gov.bd/reports/Daily_Report_{dd}.xlsm",
    ]
    for url in candidates:
        dest = DOWNLOADS / f"Daily_Report_{dd}{Path(url).suffix}"
        try:
            data = fetch(url)
            if len(data) < 5000 or data[:2] != b"PK":
                print(f"[pgcb] {url} invalid ({len(data)} bytes)")
                continue
            dest.write_bytes(data)
            print(f"[pgcb] downloaded {dest.name} ({len(data)} bytes)")
            return dest
        except Exception as e:
            print(f"[pgcb] {url} failed: {e}")
    return None


def scrape_erp_reports() -> list[dict]:
    """Scrape ERP JSON-RPC or HTML for recent daily report download links."""
    results = []
    # Odoo website often exposes attachments via /web/content or /web/files/download
    search_urls = [
        "https://erp.powergrid.gov.bd/web/login",
        "https://erp.powergrid.gov.bd",
    ]
    pattern = re.compile(
        r"(?:location=erp%2Fweb%2Freport_docs%2F(\d+)\.(xlsm|xlsx|xls)|report_docs/(\d+)\.(xlsm|xlsx|xls))",
        re.I,
    )
    title_pattern = re.compile(r"Daily\s*Report[^\"'&]*", re.I)

    for base in search_urls:
        try:
            html = fetch(base).decode("utf-8", errors="ignore")
        except Exception as e:
            print(f"[erp] {base} failed: {e}")
            continue
        for m in pattern.finditer(html):
            fid = m.group(1) or m.group(3)
            ext = m.group(2) or m.group(4)
            loc = urllib.parse.quote(f"erp/web/report_docs/{fid}.{ext}", safe="")
            title = f"Daily Report {fid}"
            url = f"https://erp.powergrid.gov.bd/web/files/download?location={loc}&title={urllib.parse.quote(title)}"
            results.append({"id": fid, "ext": ext, "url": url})
        print(f"[erp] {base}: {len(results)} link(s) from HTML")

    # Probe recent file IDs (Jun 2026 cache had 2026-06-19 file)
    # Brute-force high IDs near known recent reports
    known_recent = [4551, 4600, 4650, 4700, 4750, 4800, 4850, 4900]
    for fid in range(4550, 4920):
        if fid in known_recent or fid % 5 == 0:
            for ext in ("xlsm", "xlsx"):
                loc = urllib.parse.quote(f"erp/web/report_docs/{fid}.{ext}", safe="")
                title = urllib.parse.quote(f"Daily Report probe {fid}")
                url = f"https://erp.powergrid.gov.bd/web/files/download?location={loc}&title={title}"
                try:
                    data = fetch(url, timeout=15)
                    if data[:2] == b"PK" and len(data) > 20000:
                        dest = DOWNLOADS / f"erp_{fid}.{ext}"
                        dest.write_bytes(data)
                        y = parse_yesterday_date(dest)
                        print(f"[erp] hit id={fid}.{ext} yesterday={y} size={len(data)}")
                        results.append({"id": str(fid), "ext": ext, "url": url, "path": dest, "yesterday": y})
                except Exception:
                    pass
    return results


def scrape_petrobangla_pdf() -> Path | None:
    html = fetch("https://www.petrobangla.org.bd").decode("utf-8", errors="ignore")
    pdfs = re.findall(r'(/uploads/[^"\'\s>]+\.pdf)', html, re.I)
    chosen = None
    for p in pdfs:
        if "daily" in p.lower() or "report" in p.lower():
            chosen = p
            break
    if not chosen and pdfs:
        chosen = pdfs[0]
    if not chosen:
        chosen = "/uploads/editor/files/Daily_Report.pdf"
    url = chosen if chosen.startswith("http") else f"https://www.petrobangla.org.bd{chosen}"
    dest = DOWNLOADS / "Petrobangla_latest.pdf"
    data = fetch(url)
    if data[:4] != b"%PDF":
        print(f"[pb] invalid PDF from {url}")
        return None
    dest.write_bytes(data)
    print(f"[pb] downloaded {dest.name} ({len(data)} bytes) from {url}")
    return dest


def main():
    target_iso = "2026-06-30"
    target = date(2026, 6, 30)

    # 1) PGCB: report published D covers energy day D-1
    # For Jun 30 data we need report dated Jul 1; also try Jun 30 report (Jun 29 data)
    pgcb_path = None
    for report_date in [date(2026, 7, 1), date(2026, 6, 30), date(2026, 6, 29)]:
        pgcb_path = try_pgcb_urls(report_date)
        if pgcb_path:
            y = parse_yesterday_date(pgcb_path)
            print(f"[pgcb] report {report_date} -> yesterday={y}")
            if y == target:
                break
            if y and y < target:
                pgcb_path = None

    if not pgcb_path:
        print("[erp] probing ERP for recent reports...")
        hits = scrape_erp_reports()
        for hit in sorted(hits, key=lambda h: h.get("yesterday") or date.min, reverse=True):
            p = hit.get("path")
            if not p:
                continue
            y = hit.get("yesterday") or parse_yesterday_date(p)
            if y == target:
                pgcb_path = p
                print(f"[erp] using {p.name} for {target}")
                break

    if not pgcb_path:
        print("ERROR: Could not find PGCB report for 2026-06-30", file=sys.stderr)
        sys.exit(1)

    y = parse_yesterday_date(pgcb_path)
    if y != target:
        print(f"WARNING: PGCB yesterday={y}, wanted {target}")

    # 2) Petrobangla
    pb_path = scrape_petrobangla_pdf()

    # 3) Parse via parse_daily_reports module
    sys.path.insert(0, str(ROOT / "scripts"))
    import importlib.util

    spec = importlib.util.spec_from_file_location("parse_daily", ROOT / "scripts" / "parse_daily_reports.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    text_path = DOWNLOADS / f"pgcb_text_{target_iso}.txt"
    text_path.write_text(xlsx_to_text_content(pgcb_path), encoding="utf-8")

    pb_text_path = None
    if pb_path:
        try:
            import pypdf

            reader = pypdf.PdfReader(str(pb_path))
            pb_text = "\n".join((page.extract_text() or "") for page in reader.pages)
            pb_text_path = DOWNLOADS / "petrobangla_latest.txt"
            pb_text_path.write_text(pb_text, encoding="utf-8")
        except Exception as e:
            print(f"[pb] text extract failed: {e}")

    merged = mod.process_single_date(target, str(text_path), str(pb_text_path) if pb_text_path else None)
    if not merged:
        print("ERROR: parse_pgcb_file returned None", file=sys.stderr)
        sys.exit(1)

    out_file = DAILY_OUT / f"{target_iso}.json"
    out_file.write_text(json.dumps(merged, indent=2), encoding="utf-8")
    print(f"Wrote {out_file}")

    dates = json.loads(DATES_OUT.read_text(encoding="utf-8"))
    if target_iso not in dates:
        dates.append(target_iso)
        dates.sort()
        DATES_OUT.write_text(json.dumps(dates, indent=2), encoding="utf-8")
        print(f"Updated {DATES_OUT}")

    s = merged["systemStats"]
    print(json.dumps({"date": s["date"], "eveningPeakGen": s["eveningPeakGen"], "totalEnergyGen": s["totalEnergyGen"]}, indent=2))


if __name__ == "__main__":
    main()