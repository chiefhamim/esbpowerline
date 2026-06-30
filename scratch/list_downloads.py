import os

def list_dl():
    dl_dir = r"C:\Users\user\esbpowerline\scratch\downloads"
    if os.path.exists(dl_dir):
        files = sorted(os.listdir(dl_dir))
        print(f"Total files in downloads: {len(files)}")
        for f in files:
            print(f" - {f}")
    else:
        print("downloads folder does not exist")

if __name__ == "__main__":
    list_dl()
