import { getGridSettingsMap } from '@/lib/homepage-content';
import { normalizeGridSettings } from '@/lib/grid-data';
import { PowerGridExportControls } from '@/components/members/PowerGridExportControls';
import { PowerGridExplorerClient } from '@/components/news/PowerGridExplorerClient';
import { RefreshGridDataButton } from '@/components/members/RefreshGridDataButton';
import { MemberToolsPanel } from '@/components/members/MemberToolsPanel';

export const revalidate = 60;

export const metadata = {
  title: 'Power Grid Explorer — ESB PowerLine',
  description: 'Real-time and planning data for Bangladesh’s electricity system — generation, transmission, demand & projects.',
};

export default async function PowerGridExplorerPage() {
  const settings = await getGridSettingsMap();
  const grid = normalizeGridSettings(settings);

  return (
    <div className="container container--shell py-8 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end mb-8">
        <div className="md:col-span-3">
          <div className="uppercase tracking-[2.5px] text-[10px] text-primary font-bold mb-1.5">INTERACTIVE DATA • POWER SECTOR</div>
          <h1 className="h1 font-display font-bold text-3xl md:text-4xl tracking-tight">Power Grid Explorer</h1>
          <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed text-sm">Planning and indicative data for Bangladesh’s electricity system — generation, transmission, demand &amp; projects. Configure values in admin settings.</p>
        </div>
        <div className="md:col-span-1 w-full no-print">
          <RefreshGridDataButton />
        </div>
        <div className="md:col-span-1 w-full flex flex-col items-center no-print">
          <PowerGridExportControls />
        </div>
      </div>

      <PowerGridExplorerClient
        initialMix={grid.gridMix}
        initialLines={grid.gridLines}
        initialProjects={grid.gridProjects}
      />

      <MemberToolsPanel />

      <div className="mt-10 pt-6 border-t border-border/60 text-[11px] text-muted-foreground flex flex-wrap gap-x-5 gap-y-1.5 leading-relaxed">
        Sources: BPDB, PGCB, SREDA, BERC, Petrobangla. Figures are indicative and editor-managed unless noted. Member downloads are logged for reference.
      </div>
    </div>
  );
}