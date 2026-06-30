import os

BASE_DIR = r"C:\Users\user\esbpowerline"
DATA_DIR = os.path.join(BASE_DIR, "public", "data", "daily")

def check_missing_files():
    possible_dates = ["2020-01-02", "2022-01-02", "2021-01-02", "2019-11-03"]
    for d in possible_dates:
        fpath = os.path.join(DATA_DIR, f"{d}.json")
        if os.path.exists(fpath):
            print(f"Exists: {d}.json")
        else:
            print(f"MISSING: {d}.json")

if __name__ == "__main__":
    check_missing_files()
