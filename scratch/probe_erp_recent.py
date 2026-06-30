"""Probe ERP file IDs for 2026-07-01 report (energy day 2026-06-30)."""
import io
import re
import ssl
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DL = ROOT / "scratch" / "downloads"

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
DATE_RE = re.compile(r"\b(\d{2})-(\d{2})-(\d{4})\b")
TARGET = date(2026, 6, 30)


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "ESBPowerLine/1.0"})
    with urllib.request.urlopen(req, context=CTX, timeout=20) as r:
        return r.read()


def meta(data: bytes) -> tuple[str | None, str | None]:
    try:
        df = pd.read_excel(io.BytesIO(data), sheet_name="P1", header=None)
    except Exception:
        return None, None
    report = None
    for i in range(min(12, df.shape[0])):
        for j in range(min(12, df.shape[1])):
            cell = df.iloc[i, j]
            if isinstance(cell, str):
                m = DATE_RE.search(cell)
                if m:
                    d, mo, y = m.groups()
                    report = f"{y}-{mo}-{d}"
                    break
        if report:
            break
    energy = None
    if report:
        y, m, d = map(int, report.split("-"))
        energy = str(date(y, m, d) - timedelta(days=1))
    return report, energy


for fid in range(5051, 5065):
    for ext in ("xlsx", "xlsm"):
        loc = urllib.parse.quote(f"erp/web/report_docs/{fid}.{ext}", safe="")
        url = f"https://erp.powergrid.gov.bd/web/files/download?location={loc}&title=Daily"
        try:
            data = fetch(url)
            if data[:2] != b"PK" or len(data) < 20000:
                print(fid, ext, "miss")
                continue
            report, energy = meta(data)
            dest = DL / f"erp_{fid}.{ext}"
            dest.write_bytes(data)
            print({"id": fid, "ext": ext, "report": report, "energy": energy, "size": len(data)})
            if energy == str(TARGET):
                print("FOUND", dest)
        except Exception as e:
            print(fid, ext, "err", e)