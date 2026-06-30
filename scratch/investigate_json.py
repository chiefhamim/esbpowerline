import os
import json

BASE_DIR = r"C:\Users\user\esbpowerline"
DATA_DIR = os.path.join(BASE_DIR, "public", "data", "daily")

def investigate_issues():
    # 2. Investigate the first few malformed files
    malformed_files = ['2022-12-15.json', '2023-01-21.json', '2023-03-27.json']
    print("\n--- Malformed Files Analysis ---")
    for fname in malformed_files:
        fpath = os.path.join(DATA_DIR, fname)
        if os.path.exists(fpath):
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    print(f"File: {fname} (Length: {len(content)} bytes)")
                    # Try json decode
                    try:
                        json.loads(content)
                        print("It IS valid JSON when loaded as utf-8!")
                    except Exception as e:
                        print("JSON parse error:", e)
                    print("-" * 40)
            except Exception as e:
                print(f"Error opening {fname}: {e}")

if __name__ == "__main__":
    investigate_issues()
