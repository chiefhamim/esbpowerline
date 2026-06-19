import { RefreshCw } from 'lucide-react';
import { getGridSettingsMap } from '@/lib/homepage-content';
import { normalizeGridSettings } from '@/lib/grid-data';
import { PowerGridExportControls } from '@/components/members/PowerGridExportControls';
import { PowerGridExplorerClient } from '@/components/news/PowerGridExplorerClient';

export const revalidate = 60;

export const metadata = {
  title: 'Power Grid Explorer — ESB PowerLine',
  description: 'Real-time and planning data for Bangladesh’s electricity system — generation, transmission, demand & projects.',
};

export default async function PowerGridExplorerPage() {
  const settings = await getGridSettingsMap();
  const grid = normalizeGridSettings(settings);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
        <div>
          <div className="uppercase tracking-[2.5px] text-[10px] text-primary font-bold mb-1.5">INTERACTIVE DATA • POWER SECTOR</div>
          <h1 className="h1 font-display font-bold text-3xl md:text-4xl tracking-tight">Power Grid Explorer</h1>
          <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed text-sm">Planning and indicative data for Bangladesh’s electricity system — generation, transmission, demand &amp; projects. Configure values in admin settings.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button className="btn btn-secondary flex items-center gap-1.5 text-xs px-3.5 py-2 hover:bg-secondary transition-colors">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </button>
          <PowerGridExportControls />
        </div>
      </div>

      <PowerGridExplorerClient
        initialMix={grid.gridMix}
        initialLines={grid.gridLines}
        initialProjects={grid.gridProjects}
      />

      <div className="mt-10 pt-6 border-t border-border/60 text-[11px] text-muted-foreground flex flex-wrap gap-x-5 gap-y-1.5 leading-relaxed">
        Sources: BPDB, PGCB, SREDA, BERC, Petrobangla. Figures are indicative and editor-managed unless noted. Member downloads are logged for reference.
      </div>
    </div>
  );
}