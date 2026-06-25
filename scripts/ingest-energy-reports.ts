import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Running against the single PostgreSQL/Supabase database

import { createScriptPrismaClient } from '../prisma/client';

// Initialize Prisma lazily using a Proxy to avoid module-load evaluation side-effects
const prisma = new Proxy({} as any, {
  get(target, prop, receiver) {
    if (!(globalThis as any).__scriptPrisma) {
      (globalThis as any).__scriptPrisma = createScriptPrismaClient();
    }
    const client = (globalThis as any).__scriptPrisma;
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

// Bypass SSL certificate errors for government servers
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configuration
const CONFIG = {
  pgcbBaseUrl: 'https://www.pgcb.gov.bd',
  petrobanglaBaseUrl: 'https://www.petrobangla.org.bd',
  downloadDir: path.join(process.cwd(), 'scratch', 'downloads'),
};

/**
 * Ensures download directory exists
 */
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Format date to PGCB standard (e.g. DD-MM-YYYY)
 */
function getFormattedDate(date: Date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * Downloads a binary file from a URL to a local path with magic number validation
 */
async function downloadFile(url: string, localPath: string, expectedType: 'xlsx' | 'pdf'): Promise<boolean> {
  console.log(`[Ingest] Downloading: ${url} ...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[Ingest] Failed download HTTP status: ${response.status}`);
      return false;
    }
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Validate file header signatures
    if (expectedType === 'pdf') {
      // PDF must start with %PDF (0x25, 0x50, 0x44, 0x46)
      if (bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
        console.warn(`[Ingest] Invalid PDF signature (might be HTML redirect page). Skipping.`);
        return false;
      }
    } else if (expectedType === 'xlsx') {
      // XLSX (ZIP format) must start with PK (0x50, 0x4B)
      if (bytes[0] !== 0x50 || bytes[1] !== 0x4B) {
        console.warn(`[Ingest] Invalid Excel signature (might be HTML redirect page). Skipping.`);
        return false;
      }
    }
    
    fs.writeFileSync(localPath, Buffer.from(buffer));
    console.log(`[Ingest] Download complete: ${localPath}`);
    return true;
  } catch (error) {
    console.error(`[Ingest] Download error:`, error);
    return false;
  }
}

/**
 * Scrapes the Petrobangla homepage to find the latest daily production PDF link
 */
async function scrapePetrobanglaPdfUrl(): Promise<string | null> {
  console.log(`[Ingest] Scrapes Petrobangla homepage for latest daily gas PDF...`);
  try {
    const res = await fetch(CONFIG.petrobanglaBaseUrl);
    if (!res.ok) return null;
    const html = await res.text();
    
    // Search for patterns like '/uploads/editor/files/Daily_Report_...pdf'
    // or generic daily gas reports
    const pdfRegex = /\/uploads\/[^"'\s>]+\.pdf/gi;
    const matches = html.match(pdfRegex);
    
    if (matches && matches.length > 0) {
      // Find the first pdf matching report terms
      const reportPdf = matches.find(m => m.toLowerCase().includes('daily') || m.toLowerCase().includes('report'));
      if (reportPdf) {
        return reportPdf.startsWith('http') ? reportPdf : `${CONFIG.petrobanglaBaseUrl}${reportPdf}`;
      }
    }
    
    // Default fallback if scraping selectors are modified
    return `${CONFIG.petrobanglaBaseUrl}/uploads/editor/files/Daily_Report.pdf`;
  } catch (error) {
    console.error('[Ingest] Petrobangla scraping failed:', error);
    return null;
  }
}

/**
 * Core parsing orchestrator
 * In a real production container, we load XLSX (via xlsx package) and PDF (via pdf-parse)
 * to extract tabular grids.
 */

async function runIngestionPipeline() {
  ensureDir(CONFIG.downloadDir);
  console.log(`[Ingest] Ingestion pipeline started...`);
  
  let powerGridData: any = null;
  let localExcelPath = '';
  
  // Try today and up to the last 7 days to find the latest published PGCB Excel report
  for (let i = 0; i < 8; i++) {
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = getFormattedDate(checkDate);
    const pgcbExcelUrl = `${CONFIG.pgcbBaseUrl}/reports/Daily_Report_${dateStr}.xlsx`;
    localExcelPath = path.join(CONFIG.downloadDir, `Daily_Report_${dateStr}.xlsx`);
    
    // Check if we already have it locally
    if (fs.existsSync(localExcelPath)) {
      console.log(`[Ingest] Latest Excel already exists locally: ${localExcelPath}`);
      const pythonScript = path.join(process.cwd(), 'scripts', 'parse_energy_reports.py');
      try {
        const { execSync } = require('child_process');
        const output = execSync(`python "${pythonScript}" "${localExcelPath}"`, { encoding: 'utf8' });
        const parsed = JSON.parse(output);
        if (!parsed.error) {
          powerGridData = parsed;
          console.log(`[Ingest] Successfully parsed local Excel file for date ${dateStr}.`);
          break;
        }
      } catch (err) {
        console.error(`[Ingest] Error parsing existing Excel:`, err);
      }
    }

    console.log(`[Ingest] Checking PGCB Excel report at URL: ${pgcbExcelUrl}`);
    const downloadSuccess = await downloadFile(pgcbExcelUrl, localExcelPath, 'xlsx');
    if (downloadSuccess) {
      const pythonScript = path.join(process.cwd(), 'scripts', 'parse_energy_reports.py');
      try {
        const { execSync } = require('child_process');
        const output = execSync(`python "${pythonScript}" "${localExcelPath}"`, { encoding: 'utf8' });
        const parsed = JSON.parse(output);
        if (!parsed.error) {
          powerGridData = parsed;
          console.log(`[Ingest] Successfully downloaded and parsed Excel file for date ${dateStr}.`);
          break;
        }
      } catch (err) {
        console.error(`[Ingest] Error parsing newly downloaded Excel:`, err);
      }
    }
  }

  // 2. Petrobangla Ingestion
  let gasData: any = null;
  const petrobanglaPdfUrl = await scrapePetrobanglaPdfUrl();
  if (petrobanglaPdfUrl) {
    const todayStr = getFormattedDate();
    const localPdfPath = path.join(CONFIG.downloadDir, `Petrobangla_${todayStr}.pdf`);
    
    // Check if we already have it locally
    if (fs.existsSync(localPdfPath)) {
      console.log(`[Ingest] Latest PDF already exists locally: ${localPdfPath}`);
      const pythonScript = path.join(process.cwd(), 'scripts', 'parse_energy_reports.py');
      try {
        const { execSync } = require('child_process');
        const output = execSync(`python "${pythonScript}" "${localPdfPath}"`, { encoding: 'utf8' });
        const parsed = JSON.parse(output);
        if (!parsed.error) {
          gasData = parsed;
          console.log(`[Ingest] Successfully parsed local PDF gas report.`);
        }
      } catch (err) {
        console.error(`[Ingest] Error parsing existing PDF:`, err);
      }
    } else {
      const pdfSuccess = await downloadFile(petrobanglaPdfUrl, localPdfPath, 'pdf');
      if (pdfSuccess) {
        const pythonScript = path.join(process.cwd(), 'scripts', 'parse_energy_reports.py');
        try {
          const { execSync } = require('child_process');
          const output = execSync(`python "${pythonScript}" "${localPdfPath}"`, { encoding: 'utf8' });
          const parsed = JSON.parse(output);
          if (!parsed.error) {
            gasData = parsed;
            console.log(`[Ingest] Successfully downloaded and parsed PDF gas report.`);
          }
        } catch (err) {
          console.error(`[Ingest] Error parsing newly downloaded PDF:`, err);
        }
      }
    }
  }

  // Fallback to desktop files if no downloads succeeded (e.g. offline dev environment)
  if (!powerGridData) {
    const devExcelPath = 'C:\\Users\\user\\Desktop\\Daily Report 23-06-2026.xlsx';
    if (fs.existsSync(devExcelPath)) {
      console.log(`[Ingest] Falling back to desktop sample Excel: ${devExcelPath}`);
      const pythonScript = path.join(process.cwd(), 'scripts', 'parse_energy_reports.py');
      try {
        const { execSync } = require('child_process');
        const output = execSync(`python "${pythonScript}" "${devExcelPath}"`, { encoding: 'utf8' });
        const parsed = JSON.parse(output);
        if (!parsed.error) {
          powerGridData = parsed;
        }
      } catch (err) {
        console.error(`[Ingest] Error parsing desktop Excel fallback:`, err);
      }
    }
  }
  
  if (!gasData) {
    const devPdfPath = 'C:\\Users\\user\\Desktop\\Petrobangla.pdf';
    if (fs.existsSync(devPdfPath)) {
      console.log(`[Ingest] Falling back to desktop sample PDF: ${devPdfPath}`);
      const pythonScript = path.join(process.cwd(), 'scripts', 'parse_energy_reports.py');
      try {
        const { execSync } = require('child_process');
        const output = execSync(`python "${pythonScript}" "${devPdfPath}"`, { encoding: 'utf8' });
        const parsed = JSON.parse(output);
        if (!parsed.error) {
          gasData = parsed;
        }
      } catch (err) {
        console.error(`[Ingest] Error parsing desktop PDF fallback:`, err);
      }
    }
  }

  // 3. Sync to Database
  if (powerGridData || gasData) {
    console.log('[Ingest] Updating energy dashboard state settings in DB...');
    try {
      const dbPayload: Record<string, any> = {};
      
      if (powerGridData) {
        dbPayload.generation_capacity = '28420'; // Clean baseline
        dbPayload.current_demand = String(Math.round(powerGridData.eveningPeakGen));
        dbPayload.generation_cost = String(powerGridData.avgProductionCost.toFixed(3));
        dbPayload.est_fuel_cost = String(Math.round(powerGridData.totalDailyCost / 10000000));
      }
      
      if (gasData) {
        dbPayload.gas_supply = String(gasData.totalGasProduction);
      }
      
      // Update key-value siteSetting table
      for (const [key, value] of Object.entries(dbPayload)) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: JSON.stringify(value) },
          create: { key, value: JSON.stringify(value) }
        });
      }
      
      // Update interactive snapshot array in siteSetting
      const snapshotSetting = await prisma.siteSetting.findUnique({ where: { key: 'snapshot' } });
      if (snapshotSetting) {
        let snapshot = snapshotSetting.value;
        if (typeof snapshot === 'string') {
          try { snapshot = JSON.parse(snapshot); } catch (e) {}
        }
        if (Array.isArray(snapshot)) {
          for (const item of (snapshot as any[])) {
            if (item.label === 'Current Demand' && powerGridData) {
              item.value = Math.round(powerGridData.eveningPeakGen);
            } else if (item.label === 'Gas Supply' && powerGridData) {
              item.value = Math.round(powerGridData.gasSupply);
            } else if (item.label === 'Peak Today' && powerGridData) {
              item.value = Math.round(powerGridData.eveningPeakDemand);
            }
          }
          await prisma.siteSetting.update({
            where: { key: 'snapshot' },
            data: { value: snapshot as any }
          });
          console.log('[Ingest] Live homepage snapshot metrics synced.');
        }
      }

      // Update ticker array in siteSetting
      const tickerSetting = await prisma.siteSetting.findUnique({ where: { key: 'ticker' } });
      if (tickerSetting) {
        let ticker = tickerSetting.value;
        if (typeof ticker === 'string') {
          try { ticker = JSON.parse(ticker); } catch (e) {}
        }
        if (Array.isArray(ticker)) {
          for (const item of (ticker as any[])) {
            if (!powerGridData) continue;
            if (item.id === 'avg-cost') {
              item.value = parseFloat(powerGridData.avgProductionCost.toFixed(2));
            } else if (item.id === 'gas-cost' && powerGridData.fuels?.gas) {
              const val = powerGridData.fuels.gas.cost / (powerGridData.fuels.gas.generation * 1000000);
              item.value = parseFloat(val.toFixed(2));
            } else if (item.id === 'coal-cost' && powerGridData.fuels?.coal) {
              const val = powerGridData.fuels.coal.cost / (powerGridData.fuels.coal.generation * 1000000);
              item.value = parseFloat(val.toFixed(2));
            } else if (item.id === 'hfo-cost' && powerGridData.fuels?.hfo) {
              const val = powerGridData.fuels.hfo.cost / (powerGridData.fuels.hfo.generation * 1000000);
              item.value = parseFloat(val.toFixed(2));
            } else if (item.id === 'import-cost' && powerGridData.fuels?.import) {
              const val = powerGridData.fuels.import.cost / (powerGridData.fuels.import.generation * 1000000);
              item.value = parseFloat(val.toFixed(2));
            } else if (item.id === 'solar-cost' && powerGridData.fuels?.solar) {
              const val = powerGridData.fuels.solar.cost / (powerGridData.fuels.solar.generation * 1000000);
              item.value = parseFloat(val.toFixed(2));
            } else if (item.id === 'gas-prod' && gasData) {
              item.value = parseFloat(gasData.totalGasProduction.toFixed(1));
            }
          }
          await prisma.siteSetting.update({
            where: { key: 'ticker' },
            data: { value: ticker as any }
          });
          console.log('[Ingest] Market pricing ticker synced.');
        }
      }
      
      console.log('[Ingest] Database settings sync complete.');
    } catch (dbError) {
      console.error('[Ingest] DB update failed:', dbError);
    }
  }

  console.log('[Ingest] Pipeline iteration complete.');
}

// Execute if run directly
if (require.main === module) {
  runIngestionPipeline()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export { runIngestionPipeline };
