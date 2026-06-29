import * as fs from 'fs';
import * as path from 'path';
import {
  mergeSredaSnapshots,
  parseSredaGenerationMixHtml,
  parseSredaHomepageHtml,
} from '@/lib/data/sreda/parse-sreda-html';
import type { SredaDailyData } from '@/lib/data/sreda/types';

const SREDA_CONFIG = {
  baseUrl: 'https://ndre.sreda.gov.bd',
  homeUrl: 'https://ndre.sreda.gov.bd/',
  mixUrl: 'https://ndre.sreda.gov.bd/index.php?id=7',
  dailyDir: path.join(process.cwd(), 'public', 'data', 'sreda', 'daily'),
  availableDatesPath: path.join(process.cwd(), 'lib', 'sreda-available-dates.json'),
};

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function fetchSredaPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ESBPowerLine-Ingest/1.0 (+https://esbpowerline.com)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      console.warn(`[SREDA] HTTP ${response.status} for ${url}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`[SREDA] Fetch failed for ${url}:`, error);
    return null;
  }
}

function readAvailableDates(): string[] {
  if (!fs.existsSync(SREDA_CONFIG.availableDatesPath)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(SREDA_CONFIG.availableDatesPath, 'utf8'));
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

function writeAvailableDates(dates: string[]) {
  const unique = [...new Set(dates)].sort();
  fs.writeFileSync(SREDA_CONFIG.availableDatesPath, JSON.stringify(unique, null, 2) + '\n', 'utf8');
}

function writeDailySnapshot(data: SredaDailyData): string {
  ensureDir(SREDA_CONFIG.dailyDir);
  const filePath = path.join(SREDA_CONFIG.dailyDir, `${data.date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  return filePath;
}

export async function scrapeSredaDailySnapshot(): Promise<SredaDailyData | null> {
  const [homeHtml, mixHtml] = await Promise.all([
    fetchSredaPage(SREDA_CONFIG.homeUrl),
    fetchSredaPage(SREDA_CONFIG.mixUrl),
  ]);

  if (!homeHtml && !mixHtml) {
    console.warn('[SREDA] Both homepage and generation-mix fetches failed.');
    return null;
  }

  const scrapedAt = new Date().toISOString();
  const home = homeHtml
    ? parseSredaHomepageHtml(homeHtml, SREDA_CONFIG.homeUrl)
    : {};
  const mix = mixHtml ? parseSredaGenerationMixHtml(mixHtml) : {};

  const merged = mergeSredaSnapshots(home, mix, scrapedAt);
  if (!merged) {
    console.warn('[SREDA] Could not parse Last Update timestamp from SREDA pages.');
    return null;
  }

  if (merged.totalRenewableMw <= 0 && merged.renewableTech.length === 0) {
    console.warn('[SREDA] Parsed snapshot has no renewable capacity data.');
    return null;
  }

  return merged;
}

export interface SredaIngestResult {
  ok: boolean;
  date?: string;
  filePath?: string;
  skipped?: boolean;
  error?: string;
}

/** Fetch SREDA, write daily JSON backlog entry, and update available-dates index. */
export async function runSredaIngestion(): Promise<SredaIngestResult> {
  console.log('[SREDA] Starting daily SREDA ingest...');

  const snapshot = await scrapeSredaDailySnapshot();
  if (!snapshot) {
    return { ok: false, error: 'SREDA scrape produced no usable data' };
  }

  const filePath = path.join(SREDA_CONFIG.dailyDir, `${snapshot.date}.json`);
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8')) as SredaDailyData;
    if (existing.lastUpdate === snapshot.lastUpdate) {
      console.log(`[SREDA] No change since ${snapshot.lastUpdate} — backlog entry already current.`);
      return { ok: true, date: snapshot.date, filePath, skipped: true };
    }
  }

  writeDailySnapshot(snapshot);
  const dates = readAvailableDates();
  if (!dates.includes(snapshot.date)) {
    dates.push(snapshot.date);
    writeAvailableDates(dates);
  }

  console.log(
    `[SREDA] Backlog updated: ${snapshot.date} — RE ${snapshot.totalRenewableMw} MW, grid share ${snapshot.reGridSharePct}%`,
  );
  return { ok: true, date: snapshot.date, filePath };
}

if (require.main === module) {
  runSredaIngestion()
    .then((result) => {
      if (!result.ok) {
        console.error('[SREDA] Ingest failed:', result.error);
        process.exit(1);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error('[SREDA] Ingest error:', err);
      process.exit(1);
    });
}