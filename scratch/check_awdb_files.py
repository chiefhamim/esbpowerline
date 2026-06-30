import os

def check_files():
    awdb = r"C:\Users\user\Desktop\Area Wise Demand Backlog"
    for d in ["25-06-2026.json", "26-06-2026.json", "27-06-2026.json", "28-06-2026.json", "29-06-2026.json", "02-06-2026.json"]:
        fpath = os.path.join(awdb, d)
        print(f"Path {fpath} exists: {os.path.exists(fpath)}")
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
            print(f"  Snippet: {content[:200]}")

if __name__ == "__main__":
    check_files()
