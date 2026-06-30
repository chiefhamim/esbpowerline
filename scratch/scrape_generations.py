import re
import ssl
import urllib.request

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

url = "https://erp.powergrid.gov.bd/w/generations/view_generations"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, context=CTX, timeout=30).read().decode("utf-8", "ignore")
print("html len", len(html))
links = re.findall(r'href="([^"]*report_docs[^"]*)"', html, re.I)
dl = re.findall(r'web/files/download\?[^"\']+', html, re.I)
titles = re.findall(r'Daily\s*Report[^<]{0,40}', html, re.I)
print("report_docs hrefs", len(links))
for l in links[:20]:
    print(l)
print("download urls", len(dl))
for u in dl[:20]:
    print(u)
print("titles", titles[:20])