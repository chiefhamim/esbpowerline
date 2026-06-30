import ssl
import urllib.request

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

candidates = [
    "https://www.petrobangla.org.bd/uploads/editor/files/Daily_Report.pdf",
    "https://www.petrobangla.org.bd/uploads/editor/files/Daily_Report_30-06-2026.pdf",
    "https://www.petrobangla.org.bd/uploads/editor/files/Daily_Report_29-06-2026.pdf",
    "https://www.petrobangla.org.bd/uploads/editor/files/Daily%20Report.pdf",
]
for url in candidates:
    try:
        data = urllib.request.urlopen(
            urllib.request.Request(url, headers={"User-Agent": "x"}),
            context=CTX,
            timeout=20,
        ).read()
        print(url, "len", len(data), "magic", data[:8])
    except Exception as e:
        print(url, e)