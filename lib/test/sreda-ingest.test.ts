import { describe, it, expect } from 'vitest';
import {
  mergeSredaSnapshots,
  parseSredaGenerationMixHtml,
  parseSredaHomepageHtml,
} from '@/lib/data/sreda/parse-sreda-html';
import { buildSredaSnapshotStats } from '@/lib/data/grid/home-snapshot-core';
import { POWER_UNIT } from '@/lib/data/grid/home-snapshot-core';

const HOME_HTML = `
<h1>Renewable Energy Installed Capacity: <font color="#1FB401"><strong>1805.84 MW</strong></font></h1>
<table border="1">
<tr><th>Techlology</th><th>Off-grid (MW)</th><th>On-grid (MW)</th><th>Total (MW)</th></tr>
<tr><td>Solar</td><td>377.43</td><td>1135.32</td><td>1512.75</td></tr>
<tr><td>Wind</td><td>0</td><td>62</td><td>62</td></tr>
<tr><td>Hydro</td><td>0</td><td>230</td><td>230</td></tr>
<tr><td>Biogas to Electricity</td><td>0.69</td><td>0</td><td>0.69</td></tr>
<tr><td>Biomass to Electricity</td><td>0.4</td><td>0</td><td>0.4</td></tr>
<tr><td><strong>Total</strong></td><td><strong>378.52</strong></td><td><strong>1427.32</strong></td><td><strong>1805.84</strong></td></tr>
</table>
<div id="footer">Last Update: 2026-06-29 16:16:30</div>
`;

const MIX_HTML = `
<h1>Electricity Generation Mix: <font color="#1FB401"><strong>RE 5.56 %</strong></font></h1>
<table border="1">
<tr><th>Fuel/Resource</th><th>Installed Capacity</th><th>Share</th></tr>
<tr><td>Coal</td><td>6273 MW</td><td>19.33 %</td></tr>
<tr><td>Gas</td><td>12472 MW</td><td>38.43 %</td></tr>
<tr><td>Renewable</td><td>1805.92 MW</td><td>5.56 %</td></tr>
<tr><th><strong>Total</strong></th><th colspan="2"><strong>32456 MW</strong></th></tr>
</table>
<div id="footer">Last Update: 2026-06-29 16:16:30</div>
`;

describe('parse-sreda-html', () => {
  it('parses homepage renewable capacity table', () => {
    const home = parseSredaHomepageHtml(HOME_HTML, 'https://ndre.sreda.gov.bd/');
    expect(home.date).toBe('2026-06-29');
    expect(home.totalRenewableMw).toBe(1805.84);
    expect(home.renewableTech).toHaveLength(5);
    expect(home.renewableTech?.[0]).toMatchObject({
      tech: 'Solar',
      totalMw: 1512.75,
    });
  });

  it('parses generation mix page', () => {
    const mix = parseSredaGenerationMixHtml(MIX_HTML);
    expect(mix.reGridSharePct).toBe(5.56);
    expect(mix.totalInstalledMw).toBe(32456);
    expect(mix.generationMix?.find((row) => row.fuel === 'Renewable')?.capacityMw).toBe(1805.92);
  });

  it('merges homepage and mix into daily snapshot', () => {
    const home = parseSredaHomepageHtml(HOME_HTML, 'https://ndre.sreda.gov.bd/');
    const mix = parseSredaGenerationMixHtml(MIX_HTML);
    const merged = mergeSredaSnapshots(home, mix, '2026-06-30T00:00:00.000Z');
    expect(merged?.date).toBe('2026-06-29');
    expect(merged?.reGridSharePct).toBe(5.56);
    expect(merged?.totalRenewableMw).toBe(1805.84);
  });
});

describe('sreda snapshot stats', () => {
  it('builds MW snapshot tiles from SREDA data', () => {
    const home = parseSredaHomepageHtml(HOME_HTML, 'https://ndre.sreda.gov.bd/');
    const mix = parseSredaGenerationMixHtml(MIX_HTML);
    const merged = mergeSredaSnapshots(home, mix, '2026-06-30T00:00:00.000Z');
    expect(merged).not.toBeNull();

    const stats = buildSredaSnapshotStats(merged!);
    expect(stats).toHaveLength(2);
    expect(stats[0]).toMatchObject({ label: 'RE Installed', unit: POWER_UNIT, value: 1806 });
    expect(stats[1]).toMatchObject({ label: 'RE Grid Share', unit: '%', value: 5.56 });
  });
});