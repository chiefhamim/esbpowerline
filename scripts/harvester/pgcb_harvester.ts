import axios from "axios";
import * as cheerio from "cheerio";
import * as fsp from "fs/promises";
import * as fs from "fs";
import * as path from "path";
import { pipeline } from "stream/promises";

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CFG = {
  outputRoot:  "./PGCB",
  delayMs:     1500,    // polite gap between requests
  retries:     3,
  retryDelay:  8_000,   // ms before first retry (doubles each attempt)
  timeout:     120_000, // 120 s — large PDFs on slow gov servers
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",

  // ── Optional: paste your browser session cookie string here if the
  //    ERP portal redirects to a login page when hit by the crawler.
  //    Example: "session=abc123; XSRF-TOKEN=def456"
  erpCookie: process.env.PGCB_ERP_COOKIE ?? "",
} as const;

// ── Parse --section and --exclude flags ─────────────────────────────────────
const ARG_SECTION = (() => {
  const i = process.argv.indexOf("--section");
  return i >= 0 ? process.argv[i + 1] ?? null : null;
})();

const ARG_EXCLUDE = (() => {
  const i = process.argv.indexOf("--exclude");
  if (i < 0) return new Set<string>();
  const val = process.argv[i + 1] ?? "";
  return new Set(val.split(",").map((s) => s.trim()).filter(Boolean));
})();

// ═══════════════════════════════════════════════════════════════════════════════
// SITE ROOTS & ENCRYPTED REPORT TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const ERP  = "https://erp.powergrid.gov.bd";
const PGCB = "https://pgcb.gov.bd";
const PG   = "https://powergrid.gov.bd";

/**
 * Each report section on the ERP portal is identified by an encrypted token
 * baked into the URL. These were taken directly from the user-provided URLs
 * and should remain stable (they are encrypted model/route IDs, not sessions).
 */
const TOKEN = {
  daily:
    "eyJpdiI6IldsU2ZQTGkvbkRnQU9FMjZ5UHhmeGc9PSIsInZhbHVlIjoiQzhONVl5ZGxRY3E3T3ZVNCtLZGt1Zz09IiwibWFjIjoiN2JiNTI5MzNhOWIxZDVjY2NkMmFlZWU4ZDU1N2I4OWZlYjNlZWM1ZGU4NzRiNWU4ZjQ3ZDc1ODRlMTk3MDc0YyIsInRhZyI6IiJ9",
  monthly:
    "eyJpdiI6Ik53OTZRKzRRTVoxUUY4a3RMb250Y0E9PSIsInZhbHVlIjoiQmxnNjFqUUROVnk2RFh1OHJ0NGVkQT09IiwibWFjIjoiZDBlYmM3ZTUzMzBkNDM4NTNkZDQxYjc0YTc2NDQ3YTYzYmY1MjRjNDRjNTQ2MmQwOGM5MzY4MGRjNTIwYTFlYiIsInRhZyI6IiJ9",
  mis:
    "eyJpdiI6IjJOZjhDSW42VEZhWGZwbjIzMzV5Ymc9PSIsInZhbHVlIjoibkxOL1hoc1EreHVLZzdsVG03MFBvQT09IiwibWFjIjoiZjA3YjNmZWE4MGM5NjliNTVkMDM5NWJhZGRmNTQwMTA0ZmU4ZTFmOGQ0Zjg2NGY2Mjc0MDBhZDBlN2E2YTRmNCIsInRhZyI6IiJ9",
  financial:
    "eyJpdiI6IjY1ckh1WDZpWUxZQldibU1KcG0zekE9PSIsInZhbHVlIjoibnlpTE54SHhobDVJQ1RhMlpmMmtRdz09IiwibWFjIjoiNGNmNTQ4YzBhMWM4YWI0Y2UwN2E1MGI1Y2FkYTI5NjZmNDNhOTVhMjZiYzExMzcxOTBhMjg5ZjI3YmI0ZGI1OSIsInRhZyI6IiJ9",
  annual:
    "eyJpdiI6Ik1TVUxIM1RLTDhaRnZCbndoRFMwS3c9PSIsInZhbHVlIjoiR2g3ZDFldHhxcG8rQ2ZXZlU3NVFsdz09IiwibWFjIjoiZDFjZTJlNGUzM2NhZjJjNWRmZWI3YmFkNDI2YTk2NTVjOTZhMTY3MGRiNTJkOWZjMmNjNzk4ZWJhOTg3YzBlOSIsInRhZyI6IiJ9",
};

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT DIRECTORY MAP
// ═══════════════════════════════════════════════════════════════════════════════

const R = CFG.outputRoot;

const D = {
  projectsOngoing:   path.join(R, "projects", "ongoing"),
  projectsUpcoming:  path.join(R, "projects", "upcoming"),
  projectsCompleted: path.join(R, "projects", "completed"),
  daily:             path.join(R, "reports", "daily-operational"),
  monthly:           path.join(R, "reports", "monthly-operational"),
  mis:               path.join(R, "reports", "mis-reports"),
  financial:         path.join(R, "reports", "financial-reports"),
  annual:            path.join(R, "reports", "annual-reports"),
  apa:               path.join(R, "reports", "apa-quarterly"),
  electricity:       path.join(R, "information-docs", "electricity-transmission"),
  substation:        path.join(R, "information-docs", "substation-information"),
  transmLine:        path.join(R, "information-docs", "transmission-line-information"),
  nationalGrid:      path.join(R, "information-docs", "national-grid-network"),
  geoMap:            path.join(R, "information-docs", "geo-map"),
  opgw:              path.join(R, "information-docs", "opgw-network"),
};

// ═══════════════════════════════════════════════════════════════════════════════
// HTTP CLIENT  (shared cookie jar, automatic retry headers)
// ═══════════════════════════════════════════════════════════════════════════════

// Simple in-memory cookie jar keyed by `hostname|cookieName`
const cookieJar: Record<string, string> = {};

const client = axios.create({
  timeout: CFG.timeout,
  maxRedirects: 10,
  headers: {
    "User-Agent":      CFG.userAgent,
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Connection:        "keep-alive",
  },
  validateStatus: (s) => s < 500, // don't throw on 4xx — we handle those ourselves
});

// Forward stored cookies on every outgoing request
client.interceptors.request.use((config) => {
  if (!config.url) return config;
  try {
    const domain = new URL(config.url).hostname;
    const cookieStr = Object.entries(cookieJar)
      .filter(([k]) => k.startsWith(domain + "|"))
      .map(([, v]) => v)
      .join("; ");
    if (cookieStr) config.headers["Cookie"] = cookieStr;
    // Inject a static ERP cookie if the user provided one
    if (CFG.erpCookie && config.url.includes("erp.powergrid.gov.bd")) {
      config.headers["Cookie"] = [config.headers["Cookie"], CFG.erpCookie]
        .filter(Boolean)
        .join("; ");
    }
  } catch { /* malformed URL — skip */ }
  return config;
});

// Persist Set-Cookie headers for subsequent requests
client.interceptors.response.use((response) => {
  const setCookie = response.headers["set-cookie"];
  if (setCookie && response.config.url) {
    try {
      const domain = new URL(response.config.url).hostname;
      for (const c of setCookie) {
        const pair = c.split(";")[0] ?? "";
        const name = pair.split("=")[0] ?? "";
        cookieJar[`${domain}|${name.trim()}`] = pair.trim();
      }
    } catch { /* ignore */ }
  }
  return response;
});

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function ensureDir(dir: string) {
  await fsp.mkdir(dir, { recursive: true });
}

/** Strip characters that are illegal in Windows/Linux filenames */
function sanitize(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, ".")
    .trim()
    .substring(0, 200); // keep paths sane on Windows
}

/** Extract filename from a URL path component */
function filenameFromUrl(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    const last = u.pathname.split("/").filter(Boolean).pop() ?? "";
    return decodeURIComponent(last) || "download";
  } catch {
    return "download";
  }
}

/**
 * Extract filename from a Content-Disposition header.
 * Handles both RFC 5987 (filename*=UTF-8''...) and plain filename="...".
 */
function filenameFromHeaders(headers: Record<string, any>): string | null {
  const cd = headers["content-disposition"];
  if (!cd) return null;
  let m = cd.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (m) return decodeURIComponent(m[1].trim());
  m = cd.match(/filename\s*=\s*"?([^";\r\n]+)"?/i);
  return m ? m[1].trim() : null;
}

// ── Logger ──────────────────────────────────────────────────────────────────

let logStream: fs.WriteStream | null = null;

function log(tag: string, msg: string) {
  const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
  const line = `[${ts}] [${tag.padEnd(13)}] ${msg}`;
  console.log(line);
  logStream?.write(line + "\n");
}

// ── Progress counter (per section) ──────────────────────────────────────────

interface Stats { ok: number; skip: number; fail: number }

function makeStats(): Stats {
  return { ok: 0, skip: 0, fail: 0 };
}

function printStats(tag: string, stats: Stats) {
  log(tag, `✓ ok=${stats.ok}  ↷ skip=${stats.skip}  ✗ fail=${stats.fail}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOWNLOAD ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Download a single file into destDir.
 *
 * Strategy:
 *  1. HEAD request → get Content-Disposition filename cheaply
 *  2. If file already exists → skip (resume-safe)
 *  3. GET with responseType:stream → pipe into a .download temp file
 *  4. Check Content-Disposition again on GET response (more reliable than HEAD)
 *  5. Atomically rename temp → final
 *  6. Retry up to CFG.retries times on failure
 *
 * Returns the final filename used, or null on permanent failure.
 */
async function downloadFile(
  url:      string,
  destDir:  string,
  hintName?: string,
  attempt = 1,
): Promise<string | null> {
  await ensureDir(destDir);

  // ── 1. Cheap HEAD for filename ───────────────────────────────────────────
  let headName: string | null = null;
  try {
    const head = await client.head(url, { timeout: 15_000 });
    headName = filenameFromHeaders(head.headers);
  } catch { /* HEAD unsupported — skip */ }

  const candidateName = sanitize(headName ?? hintName ?? filenameFromUrl(url));
  const candidatePath = path.join(destDir, candidateName);

  // ── 2. Skip if already on disk ───────────────────────────────────────────
  if (fs.existsSync(candidatePath)) {
    log("SKIP", candidateName);
    return candidateName;
  }

  log("DL", `${candidateName}`);
  log("   └─", url);

  // ── 3. Stream download ───────────────────────────────────────────────────
  try {
    const resp = await client.get(url, {
      responseType: "stream",
      headers: { Accept: "*/*" },
    });

    if (resp.status === 404) {
      log("WARN", `404 — ${url}`);
      return null;
    }

    // ── 4. Better name from GET response headers ─────────────────────────
    const respName   = filenameFromHeaders(resp.headers);
    const finalName  = sanitize(respName ?? candidateName);
    const finalPath  = path.join(destDir, finalName);
    const tmpPath    = finalPath + ".download";

    if (fs.existsSync(finalPath)) {
      log("SKIP", `${finalName} (from GET headers)`);
      if (resp.data && typeof (resp.data as any).destroy === "function") {
        (resp.data as any).destroy();
      }
      return finalName;
    }

    // ── 5. Write + atomic rename ─────────────────────────────────────────
    const writer = fs.createWriteStream(tmpPath);
    await pipeline(resp.data as NodeJS.ReadableStream, writer);
    await fsp.rename(tmpPath, finalPath);

    const sizeMB = ((fs.statSync(finalPath).size) / 1_048_576).toFixed(2);
    log("OK  ", `${finalName}  (${sizeMB} MB)`);
    return finalName;

  } catch (err: any) {
    // Clean up partial temp file
    try {
      const tmpPath = path.join(destDir, candidateName + ".download");
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch { /* ignore cleanup error */ }

    if (attempt < CFG.retries) {
      const delay = CFG.retryDelay * attempt;
      log("RETRY", `Attempt ${attempt}/${CFG.retries} in ${delay / 1000}s — ${url}`);
      await sleep(delay);
      return downloadFile(url, destDir, hintName, attempt + 1);
    }
    log("FAIL", `Gave up after ${CFG.retries} attempts — ${url}\n         ${err.message}`);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTML FETCH + PARSING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Fetch a page's HTML; returns null on failure */
async function fetchHtml(url: string, attempt = 1): Promise<string | null> {
  try {
    const res = await client.get(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    // Redirect to login page detection
    if (
      res.status === 200 &&
      typeof res.data === "string" &&
      /login|sign.?in|authenticate/i.test(res.request?.res?.responseUrl ?? "")
    ) {
      log("WARN", `Login redirect detected for ${url}. Set PGCB_ERP_COOKIE env var.`);
    }

    if (res.status !== 200) {
      log("WARN", `HTTP ${res.status} for ${url}`);
      return null;
    }
    return typeof res.data === "string" ? res.data : JSON.stringify(res.data);
  } catch (err: any) {
    if (attempt < CFG.retries) {
      await sleep(CFG.retryDelay * attempt);
      return fetchHtml(url, attempt + 1);
    }
    log("FAIL", `fetchHtml: ${url} — ${err.message}`);
    return null;
  }
}

interface LinkInfo { url: string; text: string }

/**
 * Multi-strategy link extractor.
 * Finds all hrefs pointing to files of the requested extensions, plus:
 *   - onclick="window.location=..." patterns
 *   - Oracle Cloud Storage URLs anywhere on the page
 */
function extractFileLinks(
  html:    string,
  pageUrl: string,
  exts:    string[],
): LinkInfo[] {
  const $ = cheerio.load(html);
  const origin = (() => { try { return new URL(pageUrl).origin; } catch { return ""; } })();
  const seen   = new Set<string>();
  const out:   LinkInfo[] = [];

  const push = (href: string, text: string) => {
    if (!href || href === "#") return;
    const abs = href.startsWith("http") ? href
              : href.startsWith("/")    ? `${origin}${href}`
              : null;
    if (!abs || seen.has(abs)) return;
    seen.add(abs);
    out.push({ url: abs, text: text.trim() });
  };

  // ── <a href="..."> tags ────────────────────────────────────────────────────
  $("a[href]").each((_, el) => {
    const href  = $(el).attr("href") ?? "";
    const lhref = href.toLowerCase();
    const hasExt = exts.some((e) => lhref.includes(`.${e}`));
    // Also match common ERP download route keywords
    const hasDlKw = /\/download\/|\/export\/|\/file\/|\/attachment\//.test(lhref);
    if (hasExt || hasDlKw) push(href, $(el).text());
  });

  // ── onclick="window.location='...'" or "location.href='...'" ────────────
  $("[onclick]").each((_, el) => {
    const oc = $(el).attr("onclick") ?? "";
    const m  = oc.match(/(?:window\.location|location\.href)\s*=\s*['"]([^'"]+)['"]/);
    if (m && m[1]) push(m[1], $(el).text());
  });

  // ── Any Oracle Cloud Storage links (objectstorage.*oraclecloud*) ─────────
  $("a[href*='objectstorage'], a[href*='oraclecloud']").each((_, el) => {
    push($(el).attr("href") ?? "", $(el).text());
  });

  return out;
}

/**
 * Read the highest page number from pagination elements.
 * Uses knownMax as a floor (never returns less than it).
 */
function discoverMaxPage($: cheerio.CheerioAPI, knownMax: number): number {
  let max = knownMax;

  // Numbered page links: ?page=N or &page=N
  $("a[href*='page=']").each((_, el) => {
    const m = ($(el).attr("href") ?? "").match(/[?&]page=(\d+)/);
    if (m && m[1]) max = Math.max(max, +m[1]);
  });

  // Plain numbers inside pagination containers
  $(".pagination a, .page-item a, nav[aria-label] a, ul.pagination li a").each(
    (_, el) => {
      const t = $(el).text().trim();
      if (/^\d+$/.test(t)) max = Math.max(max, +t);
    }
  );

  return max;
}

/** Extract embedded __NEXT_DATA__ JSON from a Next.js page */
function extractNextData(html: string): any | null {
  const m = html.match(
    /<script id="__NEXT_DATA__"[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/
  );
  if (!m || !m[1]) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: PROJECTS  (Ongoing / Upcoming / Completed)
// ═══════════════════════════════════════════════════════════════════════════════

interface ProjectRecord {
  index:             number;
  title:             string;
  objective?:        string;
  scopeOfWork?:      string;
  projectCost?:      string;
  developmentPartner?: string;
  presentStatus?:    string | { physical?: string; financial?: string };
  estimatedDuration?: string;
  projectOffice?:    string;
  lastUpdated?:      string;
  sourceUrl:         string;
}

function parseProjectPage(html: string, url: string, idx: number): ProjectRecord {
  const $ = cheerio.load(html);
  const rec: ProjectRecord = { index: idx, title: "", sourceUrl: url };

  rec.title =
    $("h1, h2, .project-title, .card-title, .page-heading").first().text().trim() ||
    ($("title").text().split(/[|–\-]/)[0] ?? "").trim();

  const assign = (rawKey: string, val: string) => {
    if (!val?.trim()) return;
    const k = rawKey.toLowerCase();
    if (/objective/.test(k))             rec.objective           = val.trim();
    else if (/scope/.test(k))            rec.scopeOfWork         = val.trim();
    else if (/cost/.test(k))             rec.projectCost         = val.trim();
    else if (/partner/.test(k))          rec.developmentPartner  = val.trim();
    else if (/duration|period/.test(k))  rec.estimatedDuration   = val.trim();
    else if (/office|director/.test(k))  rec.projectOffice       = val.trim();
    else if (/updated|update/.test(k))   rec.lastUpdated         = val.trim();
    else if (/status/.test(k)) {
      const physM = val.match(/physical\s*[:\-]?\s*([\d.]+\s*%)/i);
      const finM  = val.match(/financial\s*[:\-]?\s*([\d.]+\s*%)/i);
      if (physM || finM) {
        rec.presentStatus = {
          physical:  physM?.[1],
          financial: finM?.[1],
        };
      } else {
        rec.presentStatus = val.trim();
      }
    }
  };

  // Pattern 1: <tr><th>Label</th><td>Value</td></tr>  or  <tr><td>Label</td><td>Value</td></tr>
  $("tr").each((_, row) => {
    const cells = $(row).find("th, td");
    if (cells.length >= 2) assign($(cells[0]).text(), $(cells[1]).text());
  });

  // Pattern 2: <dt> / <dd> definition lists
  $("dt").each((_, dt) => assign($(dt).text(), $(dt).next("dd").text()));

  // Pattern 3: labelled divs (Bootstrap-style field rows)
  $(".field, .info-row, .detail-row, .form-group").each((_, el) => {
    const label = $(el).find(".label, .field-label, strong, label").first().text();
    const value =
      $(el).find(".value, .field-value, p, span").last().text() ||
      $(el).children().last().text();
    assign(label, value);
  });

  return rec;
}

async function crawlProjects(
  listUrl:   string,
  outputDir: string,
  tag:       string,
  stats:     Stats,
): Promise<void> {
  log(tag, `List → ${listUrl}`);
  const html = await fetchHtml(listUrl);
  if (!html) { log(tag, "Cannot fetch list page"); return; }
  await ensureDir(outputDir);

  // Backup the raw list page
  const listBackup = path.join(outputDir, "_list.html");
  if (!fs.existsSync(listBackup))
    await fsp.writeFile(listBackup, html, "utf8").catch(() => {});

  const $ = cheerio.load(html);
  const seen = new Set<string>();
  const links: LinkInfo[] = [];

  // Primary: explicit project detail routes
  $("a[href*='project_detail'], a[href*='/web/projects/'], a[href*='project/show']").each(
    (_, el) => {
      const href = $(el).attr("href") ?? "";
      if (!href) return;
      const abs = href.startsWith("http") ? href : `${ERP}${href}`;
      if (!seen.has(abs)) { seen.add(abs); links.push({ url: abs, text: $(el).text().trim() }); }
    }
  );

  // Fallback: generic "Details" / "View" action buttons
  if (links.length === 0) {
    $("a:contains('Details'), a:contains('View'), a.btn[href]").each((_, el) => {
      const href = $(el).attr("href") ?? "";
      if (!href || href === "#") return;
      const abs = href.startsWith("http") ? href : `${ERP}${href}`;
      if (!seen.has(abs)) { seen.add(abs); links.push({ url: abs, text: $(el).text().trim() }); }
    });
  }

  log(tag, `Found ${links.length} project detail links`);

  for (let i = 0; i < links.length; i++) {
    const link = links[i]!;
    const { url, text } = link;
    log(tag, `[${i + 1}/${links.length}] ${text || url}`);

    const dHtml = await fetchHtml(url);
    if (dHtml) {
      const rec      = parseProjectPage(dHtml, url, i + 1);
      if (!rec.title) rec.title = text;
      const safeTitle = sanitize(rec.title).substring(0, 80);
      const filename  = `${String(i + 1).padStart(3, "0")}_${safeTitle}.json`;
      const destPath  = path.join(outputDir, filename);

      if (!fs.existsSync(destPath)) {
        await fsp.writeFile(destPath, JSON.stringify(rec, null, 2), "utf8");
        log(tag, `Saved → ${filename}`);
        stats.ok++;
      } else {
        log(tag, `Skip (exists): ${filename}`);
        stats.skip++;
      }
    } else {
      stats.fail++;
    }
    await sleep(CFG.delayMs);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: ERP REPORT SECTIONS  (Daily / Monthly / MIS / Financial / Annual)
// ═══════════════════════════════════════════════════════════════════════════════

async function crawlErpSection(opts: {
  token:     string;
  outputDir: string;
  tag:       string;
  exts:      string[];
  knownMax:  number;   // guaranteed floor — auto-grows if pagination says higher
  stats:     Stats;
}): Promise<void> {
  const { token, outputDir, tag, exts, knownMax, stats } = opts;
  await ensureDir(outputDir);

  const baseUrl = `${ERP}/w/report/${token}/show_report`;

  // ── Page 1: discover actual max ────────────────────────────────────────────
  log(tag, `Page 1 → ${baseUrl}?page=1`);
  const page1Html = await fetchHtml(`${baseUrl}?page=1`);
  if (!page1Html) {
    log(tag, "Cannot reach first page — section aborted");
    return;
  }

  const $1      = cheerio.load(page1Html);
  const maxPage = discoverMaxPage($1, knownMax);
  log(tag, `Pages to crawl: ${maxPage}`);

  for (let page = 1; page <= maxPage; page++) {
    const pageUrl = `${baseUrl}?page=${page}`;
    log(tag, `── Page ${String(page).padStart(3)} / ${maxPage}`);

    let html: string | null = page === 1 ? page1Html : null;
    if (!html) {
      html = await fetchHtml(pageUrl);
      if (!html) {
        log(tag, `  Fetch failed page ${page} — retrying once more`);
        await sleep(CFG.retryDelay);
        html = await fetchHtml(pageUrl);
      }
      if (!html) {
        log(tag, `  Skipping page ${page}`);
        stats.fail++;
        await sleep(CFG.delayMs);
        continue;
      }
    }

    const links = extractFileLinks(html, pageUrl, exts);
    log(tag, `  ${links.length} file link(s) found`);

    if (links.length === 0) {
      // Save debug HTML so user can inspect what the server returned
      const dbg = path.join(outputDir, `_debug_page_${String(page).padStart(4, "0")}.html`);
      if (!fs.existsSync(dbg))
        await fsp.writeFile(dbg, html, "utf8").catch(() => {});
      log(tag, `  ⚠ No links — saved debug HTML: ${path.basename(dbg)}`);
    }

    for (const { url, text } of links) {
      const result = await downloadFile(url, outputDir, text || undefined);
      if (result === null) stats.fail++;
      else if (result === "SKIPPED") stats.skip++;  // can't happen with current logic, defensive
      else stats.ok++;
      await sleep(CFG.delayMs);
    }

    await sleep(CFG.delayMs);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: APA QUARTERLY REPORTS  (powergrid.gov.bd — Next.js SPA)
// ═══════════════════════════════════════════════════════════════════════════════

async function crawlApaReports(outputDir: string, stats: Stats): Promise<void> {
  const tag = "APA-QTR";
  await ensureDir(outputDir);

  const pageUrl =
    `${PG}/pages/reports/?page=1&page_size=100` +
    `&filters=%7B%22reports_type%22%3A%226922d29b81fc96cef9e995a9%22%7D`;

  log(tag, `Fetching: ${pageUrl}`);
  const html = await fetchHtml(pageUrl);
  if (!html) { log(tag, "Fetch failed"); return; }

  // ── Strategy 1: __NEXT_DATA__ embedded JSON ─────────────────────────────
  const nd = extractNextData(html);
  if (nd) {
    log(tag, "Found __NEXT_DATA__ — scanning for PDF URLs");
    const raw     = JSON.stringify(nd);
    const pdfUrls = [
      ...new Set(
        [...raw.matchAll(/https:\/\/[^"'\s\\]+\.pdf/gi)].map((m) => m[0])
      ),
    ];
    if (pdfUrls.length > 0) {
      log(tag, `${pdfUrls.length} PDF URL(s) in __NEXT_DATA__`);
      for (const u of pdfUrls) {
        const r = await downloadFile(u, outputDir);
        if (r) stats.ok++; else stats.fail++;
        await sleep(CFG.delayMs);
      }
      return;
    }
  }

  // ── Strategy 2: REST API endpoint (common Next.js pattern) ───────────────
  const apiCandidates = [
    `${PG}/api/reports?page=1&page_size=100&reports_type=6922d29b81fc96cef9e995a9`,
    `${PG}/api/v1/reports?page=1&page_size=100&filters=%7B%22reports_type%22%3A%226922d29b81fc96cef9e995a9%22%7D`,
    `${PG}/pages/api/reports?page=1&page_size=100&reports_type=6922d29b81fc96cef9e995a9`,
  ];
  for (const apiUrl of apiCandidates) {
    try {
      const res = await client.get(apiUrl, { headers: { Accept: "application/json" } });
      if (res.status !== 200 || !res.data) continue;

      const items: any[] = res.data?.data ?? res.data?.results ?? (Array.isArray(res.data) ? res.data : []);
      if (items.length === 0) continue;

      log(tag, `API hit: ${apiUrl} — ${items.length} item(s)`);
      for (const item of items) {
        const fileUrl: string =
          item.file_url ?? item.url ?? item.document ?? item.attachment ?? item.file ?? "";
        if (!fileUrl) continue;
        const abs  = fileUrl.startsWith("http") ? fileUrl : `${PG}${fileUrl}`;
        const name = item.title ?? item.name ?? undefined;
        const r    = await downloadFile(abs, outputDir, name);
        if (r) stats.ok++; else stats.fail++;
        await sleep(CFG.delayMs);
      }
      return;
    } catch { /* try next candidate */ }
  }

  // ── Strategy 3: Plain HTML link scraping fallback ────────────────────────
  const links = extractFileLinks(html, pageUrl, ["pdf"]);
  log(tag, `${links.length} PDF link(s) from HTML scraping`);
  for (const { url, text } of links) {
    const r = await downloadFile(url, outputDir, text || undefined);
    if (r) stats.ok++; else stats.fail++;
    await sleep(CFG.delayMs);
  }

  if (links.length === 0) {
    await fsp.writeFile(path.join(outputDir, "_debug.html"), html, "utf8").catch(() => {});
    log(tag, "No PDF links found — saved _debug.html for manual inspection");
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: PGCB INFORMATION & DOCS
// ═══════════════════════════════════════════════════════════════════════════════

interface InfoDocEntry {
  pageUrl:   string;
  dir:       string;
  tag:       string;
  /**
   * Known Oracle Cloud direct URL. Pass "" for the Electricity Transmission
   * page which has a download button we need to scrape.
   */
  directUrl: string;
}

const INFO_DOCS: InfoDocEntry[] = [
  {
    pageUrl:   `${PGCB}/pages/static-pages/6922dd79933eb65569e152c2`,
    dir:       D.electricity,
    tag:       "ELEC-TRANS",
    directUrl: "", // no pre-known URL — will be discovered by scraping
  },
  {
    pageUrl:   `${PGCB}/pages/downloads/6922dab1dbfbab28ce055be9`,
    dir:       D.substation,
    tag:       "SUBSTATION",
    directUrl:
      "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-pgcb/2026/4/c3c77ac9-4369-4346-a957-e742f677f0f0.pdf",
  },
  {
    pageUrl:   `${PGCB}/pages/downloads/6922daaddbfbab28ce055a2c`,
    dir:       D.transmLine,
    tag:       "TRANS-LINE",
    directUrl:
      "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-pgcb/2026/4/3f918386-28d6-4612-842e-c7cad339ea17.pdf",
  },
  {
    pageUrl:   `${PGCB}/pages/downloads/6922dacfdbfbab28ce056a5b`,
    dir:       D.nationalGrid,
    tag:       "NATL-GRID",
    directUrl:
      "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-pgcb/2026/4/90a36cf5-a0b9-45fa-a8d5-e7910a1284da.pdf",
  },
  {
    pageUrl:   `${PGCB}/pages/downloads/6922dacfdbfbab28ce056ae5`,
    dir:       D.geoMap,
    tag:       "GEO-MAP",
    directUrl:
      "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-pgcb/2026/4/151d4b9e-3de6-4fcf-8867-92e4231d2dad.pdf",
  },
  {
    pageUrl:   `${PGCB}/pages/downloads/6922dad0dbfbab28ce056b9a`,
    dir:       D.opgw,
    tag:       "OPGW",
    directUrl:
      "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-pgcb/2026/4/9b7242fc-ff5e-4ffd-b78a-f87e7740b867.pdf",
  },
];

async function crawlInfoDoc(entry: InfoDocEntry, stats: Stats): Promise<void> {
  const { pageUrl, dir, tag, directUrl } = entry;
  await ensureDir(dir);

  // ── Download the known direct PDF immediately ────────────────────────────
  if (directUrl) {
    log(tag, `Direct PDF → ${path.basename(directUrl)}`);
    const r = await downloadFile(directUrl, dir);
    if (r) stats.ok++; else stats.fail++;
    await sleep(CFG.delayMs);
  }

  // ── Scrape the page for any additional / newer files ────────────────────
  log(tag, `Scraping page → ${pageUrl}`);
  const html = await fetchHtml(pageUrl);
  if (!html) { log(tag, "Page fetch failed"); return; }

  // Save plain-text page content (useful for Electricity Transmission)
  const $ = cheerio.load(html);
  const text = $("main, .content, article, .page-content, body")
    .first()
    .text()
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (text.length > 200) {
    const txtPath = path.join(dir, "_content.txt");
    if (!fs.existsSync(txtPath))
      await fsp.writeFile(txtPath, text, "utf8").catch(() => {});
  }

  // Check __NEXT_DATA__ for PDF URLs (pgcb.gov.bd is a Next.js app)
  const nd = extractNextData(html);
  if (nd) {
    const raw     = JSON.stringify(nd);
    const pdfUrls = [
      ...new Set([...raw.matchAll(/https:\/\/[^"'\s\\]+\.pdf/gi)].map((m) => m[0])),
    ];
    for (const u of pdfUrls) {
      if (u === directUrl) continue; // already downloaded above
      const r = await downloadFile(u, dir);
      if (r) stats.ok++; else stats.fail++;
      await sleep(CFG.delayMs);
    }
  }

  // Standard link scan
  const links = extractFileLinks(html, pageUrl, ["pdf", "xlsx", "xls", "doc", "docx"]);
  for (const { url, text: lt } of links) {
    if (url === directUrl) continue;
    const r = await downloadFile(url, dir, lt || undefined);
    if (r) stats.ok++; else stats.fail++;
    await sleep(CFG.delayMs);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════

type SectionKey =
  | "projects"
  | "daily"
  | "monthly"
  | "mis"
  | "financial"
  | "annual"
  | "apa"
  | "info";

const run = (key: SectionKey) =>
  (!ARG_SECTION || ARG_SECTION === key || ARG_SECTION === "all") && !ARG_EXCLUDE.has(key);

function banner(msg: string) {
  console.log("\n┌" + "─".repeat(68) + "┐");
  console.log("│  " + msg.padEnd(66) + "│");
  console.log("└" + "─".repeat(68) + "┘");
}

async function main() {
  const t0 = Date.now();
  await ensureDir(CFG.outputRoot);
  logStream = fs.createWriteStream(
    path.join(CFG.outputRoot, "crawl.log"),
    { flags: "a" }
  );

  console.log("\n╔" + "═".repeat(68) + "╗");
  console.log("║  PGCB DATA CRAWLER".padEnd(69) + "║");
  console.log("║  " + `Output: ${path.resolve(CFG.outputRoot)}`.padEnd(66) + "║");
  console.log(
    "║  " +
    (ARG_SECTION
      ? `Section: --section ${ARG_SECTION}`
      : "All sections — use --section <key> to run one"
    ).padEnd(66) + "║"
  );
  console.log("╚" + "═".repeat(68) + "╝");

  // ── Projects ──────────────────────────────────────────────────────────────
  if (run("projects")) {
    banner("PROJECTS  (Ongoing / Upcoming / Completed)");
    const s = makeStats();
    await crawlProjects(`${ERP}/w/projects/ongoing_project_list`,   D.projectsOngoing,   "PROJ-ONGOING",   s);
    await sleep(CFG.delayMs * 2);
    await crawlProjects(`${ERP}/w/projects/upcoming_project_list`,  D.projectsUpcoming,  "PROJ-UPCOMING",  s);
    await sleep(CFG.delayMs * 2);
    await crawlProjects(`${ERP}/w/projects/completed_project_list`, D.projectsCompleted, "PROJ-COMPLETE",  s);
    printStats("PROJECTS", s);
  }

  // ── Daily Operational Reports ─────────────────────────────────────────────
  if (run("daily")) {
    banner("DAILY OPERATIONAL REPORTS  (151 pages × ~30 XLSX ≈ 4,530 files)");
    const s = makeStats();
    await crawlErpSection({ token: TOKEN.daily, outputDir: D.daily, tag: "DAILY", exts: ["xlsx", "xls", "csv"], knownMax: 151, stats: s });
    printStats("DAILY", s);
  }

  // ── Monthly Operational Reports ───────────────────────────────────────────
  if (run("monthly")) {
    banner("MONTHLY OPERATIONAL REPORTS  (6 pages × ~30 XLSX ≈ 180 files)");
    const s = makeStats();
    await crawlErpSection({ token: TOKEN.monthly, outputDir: D.monthly, tag: "MONTHLY", exts: ["xlsx", "xls", "csv"], knownMax: 6, stats: s });
    printStats("MONTHLY", s);
  }

  // ── MIS Reports ───────────────────────────────────────────────────────────
  if (run("mis")) {
    banner("MIS REPORTS  (6 pages × ~30 PDF ≈ 180 files)");
    const s = makeStats();
    await crawlErpSection({ token: TOKEN.mis, outputDir: D.mis, tag: "MIS", exts: ["pdf"], knownMax: 6, stats: s });
    printStats("MIS", s);
  }

  // ── Financial Reports ─────────────────────────────────────────────────────
  if (run("financial")) {
    banner("FINANCIAL REPORTS  (3 pages × ~21 PDF ≈ 63 files)");
    const s = makeStats();
    await crawlErpSection({ token: TOKEN.financial, outputDir: D.financial, tag: "FINANCIAL", exts: ["pdf"], knownMax: 3, stats: s });
    printStats("FINANCIAL", s);
  }

  // ── Annual Reports ────────────────────────────────────────────────────────
  if (run("annual")) {
    banner("ANNUAL REPORTS  (1 page, 27 PDFs)");
    const s = makeStats();
    await crawlErpSection({ token: TOKEN.annual, outputDir: D.annual, tag: "ANNUAL", exts: ["pdf"], knownMax: 1, stats: s });
    printStats("ANNUAL", s);
  }

  // ── APA Quarterly ─────────────────────────────────────────────────────────
  if (run("apa")) {
    banner("APA QUARTERLY REPORTS  (16 PDFs)");
    const s = makeStats();
    await crawlApaReports(D.apa, s);
    printStats("APA-QTR", s);
  }

  // ── Information & Docs ────────────────────────────────────────────────────
  if (run("info")) {
    banner("INFORMATION & DOCS  (6 PDFs + extracted text)");
    const s = makeStats();
    for (const entry of INFO_DOCS) {
      await crawlInfoDoc(entry, s);
    }
    printStats("INFO-DOCS", s);
  }

  const elapsed = ((Date.now() - t0) / 60_000).toFixed(1);
  console.log("\n╔" + "═".repeat(68) + "╗");
  console.log("║  ✓ Crawl complete!".padEnd(69) + "║");
  console.log(`║  Elapsed: ${elapsed} min`.padEnd(69) + "║");
  console.log("╚" + "═".repeat(68) + "╝\n");

  logStream?.end();
}

main().catch((err) => {
  console.error("\n[FATAL]", err);
  logStream?.end();
  process.exit(1);
});