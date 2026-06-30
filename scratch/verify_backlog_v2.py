"""Verify backlog against PGCB ERP downloads — compare yesterday summary to local JSON."""
import json
import random
import re
import ssl
import urllib.parse
import urllib.request
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DAILY = ROOT / "public" / "data" / "daily"
CACHE = ROOT / "scratch" / "verify_cache"
CACHE.mkdir(exist_ok=True)

random.seed(42)
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

# Public-indexed ERP URLs (title often != sheet content; we parse yesterday date)
ERP_URLS = [
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F4405.xlsm&title=Daily%20Report%20%2007-12-2024",
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F4309.xlsm&title=Daily%20Report%2011-09-2024",
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F4108.xlsm&title=Daily%20Report%2005-03-2024",
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F4049.xlsm&title=Daily%20Report%2010-01-2024",
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F4202.xlsm&title=Daily%20Report%2004-06-2024",
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F4111.xlsm&title=Daily%20Report%2008-03-2024",
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F4551.xlsx&title=Daily%20Report%2016-04-2025",
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F1101.xls&title=Daily%20Report27-04-17",
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F1179.xls&title=Daily%20Report05-02-17",
    "https://erp.powergrid.gov.bd/web/files/download?location=erp%2Fweb%2Freport_docs%2F1627.xls&title=Daily%20Report14-11-15",
]


def pick_samples():
    by_year = {}
    for f in DAILY.glob("*.json"):
        y = f.stem[:4]
        if y.isdigit() and int(y) >= 2014:
            by_year.setdefault(y, []).append(f.stem)
    return {y: sorted(random.sample(sorted(dates), min(5, len(dates)))) for y, dates in sorted(by_year.items())}


def parse_p1_metrics(path: Path) -> dict:
    df = pd.read_excel(path, sheet_name="P1", header=None)
    out: dict = {}
    for i in range(df.shape[0]):
        for j in range(min(12, df.shape[1])):
            cell = df.iloc[i, j]
            if hasattr(cell, "strftime"):
                if out.get("_yesterday_col") == j:
                    out["yesterday"] = cell.strftime("%Y-%m-%d")
                if j == 8 and "reportingDate" not in out:
                    out["reportingDate"] = cell.strftime("%Y-%m-%d")
            if not isinstance(cell, str):
                continue
            text = cell.strip()
            if "Summary  of  Yesterday" in text:
                out["_yesterday_col"] = j + 1
            if text.startswith("Evening Peak Generation"):
                try:
                    out["eveningPeakGen"] = float(df.iloc[i, j + 3])
                except Exception:
                    pass
            if text.startswith("Total Gen. (MKWH)"):
                try:
                    out["totalEnergyGen"] = float(df.iloc[i, j + 3])
                except Exception:
                    pass
            if text.startswith("Day Peak Generation"):
                try:
                    out["dayPeakGen"] = float(df.iloc[i, j + 3])
                except Exception:
                    pass
    return out


def load_local(iso: str):
    p = DAILY / f"{iso}.json"
    if not p.exists():
        return None
    data = json.loads(p.read_text(encoding="utf-8"))
    s = data["systemStats"]
    return {
        "reportDate": s.get("date"),
        "eveningPeakGen": s.get("eveningPeakGen"),
        "dayPeakGen": s.get("dayPeakGen"),
        "totalEnergyGen": s.get("totalEnergyGen"),
        "avgProductionCost": s.get("avgProductionCost"),
        "totalGasSuppliedPower": s.get("totalGasSuppliedPower"),
    }


def compare(local: dict, official: dict) -> list:
    rows = []
    for field, tol in [
        ("eveningPeakGen", 1.5),
        ("dayPeakGen", 1.5),
        ("totalEnergyGen", 0.08),
    ]:
        lv, ov = local.get(field), official.get(field)
        if lv is None or ov is None:
            rows.append({"field": field, "status": "skip", "local": lv, "official": ov})
            continue
        diff = abs(float(lv) - float(ov))
        rows.append({
            "field": field,
            "local": lv,
            "official": ov,
            "diff": round(diff, 4),
            "status": "match" if diff <= tol else "mismatch",
        })
    return rows


def main():
    samples = pick_samples()
    sample_set = {iso for dates in samples.values() for iso in dates}

    erp_results = []
    for url in ERP_URLS:
        title = urllib.parse.unquote(url.split("title=")[-1])
        fname = re.sub(r"[^\w.-]+", "_", title)[:60]
        ext = ".xlsx" if ".xlsx" in url else ".xlsm" if ".xlsm" in url else ".xls"
        dest = CACHE / f"erp_{fname}{ext}"
        try:
            data = urllib.request.urlopen(url, context=CTX, timeout=45).read()
            if data[:2] != b"PK":
                continue
            dest.write_bytes(data)
            off = parse_p1_metrics(dest)
            y = off.get("yesterday")
            local = load_local(y) if y else None
            checks = compare(local, off) if local else []
            erp_results.append({
                "source": "erp.powergrid.gov.bd",
                "download_title": title,
                "file": dest.name,
                "reportingDate": off.get("reportingDate"),
                "yesterday_iso": y,
                "in_random_sample": y in sample_set if y else False,
                "official": off,
                "local": local,
                "checks": checks,
                "verdict": (
                    "verified_match"
                    if checks and all(c["status"] in ("match", "skip") for c in checks)
                    and any(c["status"] == "match" for c in checks)
                    else "mismatch"
                    if checks and any(c["status"] == "mismatch" for c in checks)
                    else "no_local_file"
                    if y and not local
                    else "unparsed"
                ),
            })
        except Exception as e:
            erp_results.append({"source": "erp.powergrid.gov.bd", "download_title": title, "error": str(e)})

    # Internal checks on all 65 samples
    internal = []
    synthetic_dates = {"2026-06-25", "2026-06-26", "2026-06-27", "2026-06-28", "2026-06-29"}
    for year, dates in samples.items():
        for iso in dates:
            p = DAILY / f"{iso}.json"
            data = json.loads(p.read_text(encoding="utf-8"))
            s = data["systemStats"]
            gen_sum = sum(g["gen"] for g in data.get("generationData", []))
            issues = []
            if abs(gen_sum - s["totalEnergyGen"]) > 0.15:
                issues.append(f"fuel_mix_sum({gen_sum:.2f})!=totalEnergyGen({s['totalEnergyGen']:.2f})")
            if iso in synthetic_dates:
                issues.append("synthetic_template_from_2026-06-25")
            internal.append({"iso": iso, "year": year, "issues": issues})

    out = {
        "methodology": {
            "samples_per_year": 5,
            "random_seed": 42,
            "years": "2014-2026",
            "official_primary": "erp.powergrid.gov.bd Daily Report xls/xlsm/xlsx",
            "legacy_url_dead": "www.pgcb.gov.bd/reports/Daily_Report_DD-MM-YYYY.xlsx returns 404 HTML",
            "note": "ERP download title often differs from embedded yesterday date in sheet P1",
        },
        "random_samples": samples,
        "erp_verifications": erp_results,
        "internal_sample_checks": internal,
    }
    (ROOT / "scratch" / "verify_backlog_v2_results.json").write_text(
        json.dumps(out, indent=2), encoding="utf-8"
    )
    print(json.dumps({
        "erp_verified": sum(1 for r in erp_results if r.get("verdict") == "verified_match"),
        "erp_mismatch": sum(1 for r in erp_results if r.get("verdict") == "mismatch"),
        "samples_with_internal_issues": sum(1 for r in internal if r["issues"]),
    }, indent=2))


if __name__ == "__main__":
    main()