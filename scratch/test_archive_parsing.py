import re

def test_parse():
    fallback_path = r"C:\Users\user\esbpowerline\lib\data\grid\archive-fallback.ts"
    with open(fallback_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Regex to find date keys
    # Keys look like: "YYYY-MM-DD": {
    matches = re.findall(r'"(\d{4}-\d{2}-\d{2})":\s*\{', content)
    print(f"Found {len(matches)} dates in archive-fallback.ts:")
    print("Dates:", matches)

if __name__ == "__main__":
    test_parse()
