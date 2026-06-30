import os

def search_precise():
    desktop = r"C:\Users\user\Desktop"
    print("Searching for June 2026 files on Desktop...")
    
    # We want to scan files in Area Wise Demand Backlog, grid_backlog, daily-max-generation, etc.
    for root, dirs, files in os.walk(desktop):
        for f in files:
            if "2026" in f and f.endswith(".json"):
                # check if it matches June (06)
                if "-06-" in f or ".06." in f or "_06_" in f or f.startswith("06-") or "06-2026" in f or "2026-06" in f:
                    print(f"Found: {os.path.join(root, f)}")

if __name__ == "__main__":
    search_precise()
