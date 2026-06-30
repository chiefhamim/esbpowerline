import os

def search_raw():
    paths_to_search = [r"C:\Users\user\Desktop", r"C:\Users\user\esbpowerline"]
    for base in paths_to_search:
        print(f"Scanning {base} for raw Excel or PDF files...")
        for root, dirs, files in os.walk(base):
            for f in files:
                if f.endswith((".xlsx", ".xlsm", ".pdf")):
                    # print path if it contains daily or report
                    f_low = f.lower()
                    if "daily" in f_low or "report" in f_low or "pgcb" in f_low:
                        print(f" - {os.path.join(root, f)}")

if __name__ == "__main__":
    search_raw()
