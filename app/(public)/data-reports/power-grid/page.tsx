import Link from 'next/link';
import { RefreshCw, Download } from 'lucide-react';
import { getGridSettingsMap } from '@/lib/homepage-content';
import { PowerGridExplorer } from '@/components/news/PowerGridExplorer';

export const metadata = {
  title: 'Power Grid Explorer — ESB PowerLine',
  description: 'Real-time and planning data for Bangladesh’s electricity system — generation, transmission, demand & projects.',
};

export default async function PowerGridExplorerPage() {
  // Load dynamic grid data from database settings if available
  const settings = await getGridSettingsMap();

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
        <div>
          <div className="uppercase tracking-[2.5px] text-[10px] text-primary font-bold mb-1.5">INTERACTIVE DATA • POWER SECTOR</div>
          <h1 className="h1 font-display font-bold text-3xl md:text-4xl tracking-tight">Power Grid Explorer</h1>
          <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed text-sm">Real-time and planning data for Bangladesh’s electricity system — generation, transmission, demand &amp; projects.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button className="btn btn-secondary flex items-center gap-1.5 text-xs px-3.5 py-2 hover:bg-secondary transition-colors">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </button>
          <button className="btn btn-secondary flex items-center gap-1.5 text-xs px-3.5 py-2 hover:bg-secondary transition-colors">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <Link href="/admin/analytics" className="text-primary hover:underline text-xs px-2 font-semibold transition-colors">Admin analytics →</Link>
        </div>
      </div>

      <PowerGridExplorer
        initialMix={settings.gridMix as Parameters<typeof PowerGridExplorer>[0]['initialMix']}
        initialLines={settings.gridLines as Parameters<typeof PowerGridExplorer>[0]['initialLines']}
        initialProjects={settings.gridProjects as Parameters<typeof PowerGridExplorer>[0]['initialProjects']}
      />

      <div className="mt-10 pt-6 border-t border-border/60 text-[11px] text-muted-foreground flex flex-wrap gap-x-5 gap-y-1.5 leading-relaxed">
        Sources: BPDB, PGCB, SREDA, BERC, Petrobangla. Data shown is illustrative for demonstration. Real-time feeds available to members.
      </div>
    </div>
  );
}
