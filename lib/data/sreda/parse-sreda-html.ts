import type { SredaDailyData, SredaGenerationMixRow, SredaRenewableTechRow } from '@/lib/data/sreda/types';

const LAST_UPDATE_RE = /Last Update:\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/i;
const RE_CAPACITY_HEADLINE_RE =
  /Renewable Energy Installed Capacity:[\s\S]*?<strong>([\d,.]+)\s*MW<\/strong>/i;
const RE_MIX_HEADLINE_RE =
  /Electricity Generation Mix:[\s\S]*?<strong>RE\s+([\d,.]+)\s*%<\/strong>/i;

function parseNumber(raw: string): number {
  return parseFloat(raw.replace(/,/g, '').trim());
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

function parseLastUpdate(html: string): { date: string; lastUpdate: string } | null {
  const match = html.match(LAST_UPDATE_RE);
  if (!match) return null;
  const lastUpdate = match[1].trim();
  const date = lastUpdate.slice(0, 10);
  return { date, lastUpdate };
}

function parseRenewableCapacityTable(html: string): SredaRenewableTechRow[] {
  const tableMatch = html.match(
    /Techlology[\s\S]*?Off-grid \(MW\)[\s\S]*?On-grid \(MW\)[\s\S]*?Total \(MW\)[\s\S]*?<\/tr>([\s\S]*?)<\/table>/i,
  );
  if (!tableMatch) return [];

  const rows: SredaRenewableTechRow[] = [];
  const rowRegex = /<tr>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>\s*<\/tr>/gi;
  let match: RegExpExecArray | null;
  while ((match = rowRegex.exec(tableMatch[1])) !== null) {
    const tech = stripTags(match[1]);
    if (!tech || tech.toLowerCase() === 'total') continue;
    rows.push({
      tech,
      offGridMw: parseNumber(match[2]),
      onGridMw: parseNumber(match[3]),
      totalMw: parseNumber(match[4]),
    });
  }
  return rows;
}

function parseGenerationMixTable(html: string): {
  generationMix: SredaGenerationMixRow[];
  totalInstalledMw: number;
} {
  const tableMatch = html.match(
    /Fuel\/Resource<\/th>[\s\S]*?Installed Capacity[\s\S]*?Share[\s\S]*?<\/tr>([\s\S]*?)<\/table>/i,
  );
  if (!tableMatch) {
    return { generationMix: [], totalInstalledMw: 0 };
  }

  const generationMix: SredaGenerationMixRow[] = [];
  let totalInstalledMw = 0;

  const rowRegex = /<tr><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><\/tr>/gi;
  let match: RegExpExecArray | null;
  while ((match = rowRegex.exec(tableMatch[1])) !== null) {
    const fuel = stripTags(match[1]);
    const capacityRaw = stripTags(match[2]);
    const shareRaw = stripTags(match[3]);
    const capacityMw = parseNumber(capacityRaw.replace(/\s*MW\s*$/i, ''));
    const sharePct = parseNumber(shareRaw.replace(/%/g, ''));
    generationMix.push({ fuel, capacityMw, sharePct });
  }

  const totalMatch = tableMatch[1].match(/<strong>([\d,.]+)\s*MW<\/strong>/i);
  if (totalMatch) {
    totalInstalledMw = parseNumber(totalMatch[1]);
  } else if (generationMix.length > 0) {
    totalInstalledMw = generationMix.reduce((sum, row) => sum + row.capacityMw, 0);
  }

  return { generationMix, totalInstalledMw };
}

function parseChartRenewables(html: string): SredaRenewableTechRow[] {
  const chartMatch = html.match(/\['Technology',\s*'MW'\],([\s\S]*?)\]\)/i);
  if (!chartMatch) return [];

  const rows: SredaRenewableTechRow[] = [];
  const entryRegex = /\['([^']+)',\s*([\d.]+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = entryRegex.exec(chartMatch[1])) !== null) {
    const totalMw = parseNumber(match[2]);
    rows.push({
      tech: match[1],
      offGridMw: 0,
      onGridMw: totalMw,
      totalMw,
    });
  }
  return rows;
}

export function parseSredaHomepageHtml(html: string, sourceUrl: string): Partial<SredaDailyData> {
  const update = parseLastUpdate(html);
  const headlineMatch = html.match(RE_CAPACITY_HEADLINE_RE);
  const totalRenewableMw = headlineMatch ? parseNumber(headlineMatch[1]) : 0;

  let renewableTech = parseRenewableCapacityTable(html);
  if (renewableTech.length === 0) {
    renewableTech = parseChartRenewables(html);
  }

  return {
    date: update?.date,
    lastUpdate: update?.lastUpdate,
    sourceUrl,
    totalRenewableMw,
    renewableTech,
  };
}

export function parseSredaGenerationMixHtml(html: string): Partial<SredaDailyData> {
  const update = parseLastUpdate(html);
  const reShareMatch = html.match(RE_MIX_HEADLINE_RE);
  const reGridSharePct = reShareMatch ? parseNumber(reShareMatch[1]) : 0;
  const { generationMix, totalInstalledMw } = parseGenerationMixTable(html);

  return {
    date: update?.date,
    lastUpdate: update?.lastUpdate,
    reGridSharePct,
    totalInstalledMw,
    generationMix,
  };
}

export function mergeSredaSnapshots(
  home: Partial<SredaDailyData>,
  mix: Partial<SredaDailyData>,
  scrapedAt: string,
): SredaDailyData | null {
  const date = home.date ?? mix.date;
  const lastUpdate = home.lastUpdate ?? mix.lastUpdate;
  if (!date || !lastUpdate) return null;

  const renewableTech = home.renewableTech ?? [];
  const totalRenewableMw =
    home.totalRenewableMw && home.totalRenewableMw > 0
      ? home.totalRenewableMw
      : renewableTech.reduce((sum, row) => sum + row.totalMw, 0);

  const generationMix = mix.generationMix ?? [];
  const renewableRow = generationMix.find((row) => row.fuel.toLowerCase() === 'renewable');

  return {
    date,
    lastUpdate,
    sourceUrl: home.sourceUrl ?? 'https://ndre.sreda.gov.bd/',
    totalRenewableMw,
    renewableTech,
    reGridSharePct: mix.reGridSharePct ?? renewableRow?.sharePct ?? 0,
    totalInstalledMw: mix.totalInstalledMw ?? 0,
    generationMix,
    scrapedAt,
  };
}