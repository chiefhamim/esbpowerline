import os

def list_backlog():
    backlog_dir = r"C:\Users\user\Desktop\grid_backlog"
    if not os.path.exists(backlog_dir):
        print("Backlog dir does not exist")
        return
    files = sorted(os.listdir(backlog_dir))
    print(f"Total files in grid_backlog: {len(files)}")
    print("Last 20 files in grid_backlog:")
    for f in files[-20:]:
        print(f" - {f}")

if __name__ == "__main__":
    list_backlog()
