"""Verify local backlog JSON against official PGCB Daily_Report xlsx files."""
import json
import random
import sys
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DAILY_DIR = ROOT / "public" / "data" / "daily"

random.seed(42)

TOLERANCE = {
    "eveningPeakGen": 1.0,
    "eveningPeakDemand": 1.0,
    "totalEnergyGen": 0.05,
    "avgProductionCost": 0.02,
    "totalGasSuppliedPower": 1.0,
    "gas_gen": 0.05,
    "coal_gen": 0.05,
}


def iso_to_pgcb(iso: str) -> str:
    y, m, d = iso.split("-")
    return f"{d}-{m}-{y}"


def pick_dates():
    by_year = {}
    for f in DAILY_DIR.glob("*.json"):
        y = f.stem[:4]
        if y.isdigit() and int(y) >= 2014:
            by_year.setdefault(y, []).append(f.stem)
    picked = {}
    for y in sorted(by_year):
        dates = sorted(by_year[y])
        n = min(5, len(dates))
        picked[y] = sorted(random.sample(dates, n))
    return picked


def load_local(iso: str):
    with open(DAILY_DIR / f"{iso}.json", encoding="utf-8") as f:
        data = json.load(f)
    s = data["systemStats"]
    fuels = {g["name"]: g["gen"] for g in data.get("generationData", [])}
    return {
        "reportDate": s.get("date"),
        "eveningPeakGen": s.get("eveningPeakGen"),
        "eveningPeakDemand": s.get("eveningPeakDemand"),
        "totalEnergyGen": s.get("totalEnergyGen"),
        "avgProductionCost": s.get("avgProductionCost"),
        "totalGasSuppliedPower": s.get("totalGasSuppliedPower"),
        "gas_gen": fuels.get("Gas"),
        "coal_gen": fuels.get("Coal"),
    }


def download_xlsx(iso: str, dest: Path) -> bool:
    pgcb_date = iso_to_pgcb(iso)
    url = f"https://www.pgcb.gov.bd/reports/Daily_Report_{pgcb_date}.xlsx"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "ESBPowerLine-Verify/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            if len(data) < 5000 or data[:2] != b"PK":
                return False
            dest.write_bytes(data)
            return True
    except Exception:
        return False


def parse_official(xlsx_path: Path):
    sys.path.insert(0, str(ROOT / "scripts"))
    import importlib.util

    spec = importlib.util.spec_from_file_location("parse_energy", ROOT / "scripts" / "parse_energy_reports.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.parse_excel(str(xlsx_path))


def compare(local, official):
    if not official:
        return None
    checks = []
    mapping = [
        ("eveningPeakGen", "eveningPeakGen", TOLERANCE["eveningPeakGen"]),
        ("eveningPeakDemand", "eveningPeakDemand", TOLERANCE["eveningPeakDemand"]),
        ("totalEnergyGen", "totalEnergyGen", TOLERANCE["totalEnergyGen"]),
        ("avgProductionCost", "avgProductionCost", TOLERANCE["avgProductionCost"]),
        ("totalGasSuppliedPower", "gasSupply", TOLERANCE["totalGasSuppliedPower"]),
    ]
    fuels = official.get("fuels") or {}
    if fuels.get("gas"):
        mapping.append(("gas_gen", ("fuels", "gas", "generation"), TOLERANCE["gas_gen"]))
    if fuels.get("coal"):
        mapping.append(("coal_gen", ("fuels", "coal", "generation"), TOLERANCE["coal_gen"]))

    for local_key, off_key, tol in mapping:
        lv = local.get(local_key)
        if isinstance(off_key, tuple):
            ov = fuels.get(off_key[1], {}).get("generation")
        else:
            ov = official.get(off_key)
        if lv is None or ov is None or ov == 0:
            checks.append({"field": local_key, "local": lv, "official": ov, "status": "skip"})
            continue
        diff = abs(float(lv) - float(ov))
        checks.append({
            "field": local_key,
            "local": lv,
            "official": ov,
            "diff": round(diff, 4),
            "status": "match" if diff <= tol else "mismatch",
        })
    return checks


def main():
    picked = pick_dates()
    cache = ROOT / "scratch" / "verify_cache"
    cache.mkdir(exist_ok=True)
    results = []

    for year, dates in picked.items():
        for iso in dates:
            local = load_local(iso)
            xlsx = cache / f"Daily_Report_{iso_to_pgcb(iso)}.xlsx"
            available = download_xlsx(iso, xlsx)
            official = parse_official(xlsx) if available and xlsx.exists() else None
            checks = compare(local, official) if official else None
            status = "no_official_file"
            if checks:
                mismatches = [c for c in checks if c["status"] == "mismatch"]
                matches = [c for c in checks if c["status"] == "match"]
                if mismatches:
                    status = "mismatch"
                elif matches:
                    status = "verified_match"
                else:
                    status = "parsed_no_comparable_fields"
            results.append({
                "iso": iso,
                "year": year,
                "local_reportDate": local.get("reportDate"),
                "official_url": f"https://www.pgcb.gov.bd/reports/Daily_Report_{iso_to_pgcb(iso)}.xlsx",
                "official_available": available,
                "status": status,
                "local_snapshot": local,
                "official_snapshot": {
                    k: official.get(k) for k in [
                        "eveningPeakGen", "eveningPeakDemand", "totalEnergyGen",
                        "avgProductionCost", "gasSupply", "totalDailyCost",
                    ]
                } if official else None,
                "official_fuels": official.get("fuels") if official else None,
                "checks": checks,
            })
            print(f"{iso}: {status}", flush=True)

    out = ROOT / "scratch" / "verify_backlog_results.json"
    out.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"\nWrote {out} ({len(results)} samples)")


if __name__ == "__main__":
    main()