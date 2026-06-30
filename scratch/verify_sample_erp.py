import json
import ssl
import urllib.request
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE


def parse_p1(path: Path) -> dict:
    df = pd.read_excel(path, sheet_name="P1", header=None)
    out: dict = {}
    for i in range(df.shape[0]):
        row = df.iloc[i]
        for j in range(df.shape[1]):
            c = row[j]
            if hasattr(c, "strftime") and i == 5 and j == 3:
                out["yesterday"] = c.strftime("%Y-%m-%d")
            if not isinstance(c, str):
                continue
            t = c.strip()
            if t.startswith("Evening Peak Generation"):
                for k in range(j + 1, min(j + 6, df.shape[1])):
                    v = row[k]
                    if isinstance(v, (int, float)) and not pd.isna(v):
                        out["ep"] = float(v)
                        break
            if t.startswith("Total Gen. (MKWH)"):
                for k in range(j + 1, min(j + 6, df.shape[1])):
                    v = row[k]
                    if isinstance(v, (int, float)) and not pd.isna(v):
                        out["gen"] = float(v)
                        break
    return out


def load_local(iso: str):
    p = ROOT / "public" / "data" / "daily" / f"{iso}.json"
    if not p.exists():
        return None
    return json.loads(p.read_text(encoding="utf-8"))["systemStats"]


TESTS = [
    ("2020-03-24", "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F2473.xlsm&title=Daily%20Report%2024.03.2020"),
    ("2022-06-29", "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F3413.xlsm&title=Daily%20Report%20%2030-06-2022"),
    ("2014-12-06", "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F4405.xlsm&title=Daily%20Report%20%2007-12-2024"),
    ("2024-09-10", "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F4309.xlsm&title=Daily%20Report%2011-09-2024"),
    ("2017-04-26", "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F1101.xls&title=Daily%20Report27-04-17"),
]

cache = ROOT / "scratch" / "verify_cache"
cache.mkdir(exist_ok=True)

for picked, url in TESTS:
    try:
        data = urllib.request.urlopen(url, context=CTX, timeout=45).read()
        dest = cache / f"sample_{picked}.xlsm"
        dest.write_bytes(data)
        off = parse_p1(dest)
        y = off.get("yesterday")
        local = load_local(y) if y else None
        print(f"--- sample in audit: {picked} | ERP yesterday: {y} ---")
        print(f"  official EP={off.get('ep')} gen={off.get('gen')}")
        if local:
            print(f"  local     EP={local['eveningPeakGen']} gen={local['totalEnergyGen']}")
            if off.get("ep") is not None:
                d = local["eveningPeakGen"] - off["ep"]
                print(f"  EP: {'MATCH' if abs(d) <= 1.5 else f'MISMATCH ({d:+.2f})'}")
            if off.get("gen") is not None:
                d = local["totalEnergyGen"] - off["gen"]
                print(f"  Gen: {'MATCH' if abs(d) <= 0.08 else f'MISMATCH ({d:+.4f})'}")
        else:
            print(f"  no local file for {y}")
    except Exception as e:
        print(f"--- {picked} ERROR: {e} ---")