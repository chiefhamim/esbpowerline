import Link from 'next/link';
import { 
  Zap, Sun, Flame, Atom, Cable, Scale, Home, Gauge, Globe, TrendingUp 
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

const ICONS: Record<string, React.ComponentType<any>> = {
  'Power Generation': Zap,
  'Renewable Energy': Sun,
  'LNG & Gas': Flame,
  'Nuclear Energy': Atom,
  'Grid & Transmission': Cable,
  'Energy Policy': Scale,
  'Rural Electrification': Home,
  'Energy Efficiency': Gauge,
  'International': Globe,
  'Market & Finance': TrendingUp,
};

const DESCRIPTIONS: Record<string, string> = {
  'Power Generation': 'New plants, capacity additions, fuel mix and IPP performance.',
  'Renewable Energy': 'Utility-scale solar, wind, rooftop programs and 2030 targets.',
  'LNG & Gas': 'Domestic production, LNG terminals, supply constraints & pricing.',
  'Nuclear Energy': 'Rooppur construction, fuel cycle, safety and future units.',
  'Grid & Transmission': '400kV/230kV development, evacuation, smart grid initiatives.',
  'Energy Policy': 'Tariffs, BERC decisions, master plans and subsidy reform.',
  'Rural Electrification': 'BREB, solar home systems, mini-grids and last-mile access.',
  'Energy Efficiency': 'Industrial DSM, standards, motor replacement programs.',
  'International': 'India–Bangladesh trade, regional cooperation and imports.',
  'Market & Finance': 'Capacity payments, IPP earnings, project finance & FDI.',
};

const getCategoryDefaultTextClass = (label: string): string => {
  const lower = label.toLowerCase();
  if (lower.includes('generation')) return 'text-blue-400';
  if (lower.includes('renewable')) return 'text-emerald-400';
  if (lower.includes('lng') || lower.includes('gas')) return 'text-amber-400';
  if (lower.includes('nuclear')) return 'text-violet-400';
  if (lower.includes('grid') || lower.includes('transmission')) return 'text-cyan-400';
  if (lower.includes('policy')) return 'text-indigo-400';
  if (lower.includes('rural')) return 'text-lime-400';
  if (lower.includes('efficiency')) return 'text-teal-400';
  if (lower.includes('international')) return 'text-sky-400';
  if (lower.includes('market') || lower.includes('finance')) return 'text-rose-400';
  return 'text-primary';
};

const getCategoryHoverBorderClass = (label: string): string => {
  const lower = label.toLowerCase();
  if (lower.includes('generation')) return 'hover:border-blue-500/40';
  if (lower.includes('renewable')) return 'hover:border-emerald-500/40';
  if (lower.includes('lng') || lower.includes('gas')) return 'hover:border-amber-500/40';
  if (lower.includes('nuclear')) return 'hover:border-violet-500/40';
  if (lower.includes('grid') || lower.includes('transmission')) return 'hover:border-cyan-500/40';
  if (lower.includes('policy')) return 'hover:border-indigo-500/40';
  if (lower.includes('rural')) return 'hover:border-lime-500/40';
  if (lower.includes('efficiency')) return 'hover:border-teal-500/40';
  if (lower.includes('international')) return 'hover:border-sky-500/40';
  if (lower.includes('market') || lower.includes('finance')) return 'hover:border-rose-500/40';
  return 'hover:border-primary/40';
};

const getCategoryHoverTextClass = (label: string): string => {
  const lower = label.toLowerCase();
  if (lower.includes('generation')) return 'group-hover:text-blue-400';
  if (lower.includes('renewable')) return 'group-hover:text-emerald-400';
  if (lower.includes('lng') || lower.includes('gas')) return 'group-hover:text-amber-400';
  if (lower.includes('nuclear')) return 'group-hover:text-violet-400';
  if (lower.includes('grid') || lower.includes('transmission')) return 'group-hover:text-cyan-400';
  if (lower.includes('policy')) return 'group-hover:text-indigo-400';
  if (lower.includes('rural')) return 'group-hover:text-lime-400';
  if (lower.includes('efficiency')) return 'group-hover:text-teal-400';
  if (lower.includes('international')) return 'group-hover:text-sky-400';
  if (lower.includes('market') || lower.includes('finance')) return 'group-hover:text-rose-400';
  return 'group-hover:text-primary';
};

export default function CategoriesIndex() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="h2 mb-2">Power Sector Categories</h1>
        <p className="text-muted-foreground max-w-prose">Focused coverage across Bangladesh’s energy value chain. Click any sector for dedicated reporting, analysis and data.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => {
          const Icon = ICONS[cat] || Zap;
          const slug = cat.toLowerCase().replace(/\s+/g, '-');
          const defaultTextClass = getCategoryDefaultTextClass(cat);
          const hoverBorderClass = getCategoryHoverBorderClass(cat);
          const hoverTextClass = getCategoryHoverTextClass(cat);
          return (
            <Link 
              key={cat} 
              href={`/categories/${slug}`} 
              className={`card category-card p-4 group transition-all hover:shadow-md flex flex-col ${hoverBorderClass}`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-2 rounded-lg bg-muted transition flex-shrink-0 ${defaultTextClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className={`font-semibold text-[15px] leading-tight tracking-tight transition-colors ${defaultTextClass}`}>{cat}</div>
              </div>
              <p className="text-xs text-muted-foreground leading-snug line-clamp-2 flex-1">{DESCRIPTIONS[cat]}</p>
              <div className={`mt-2.5 text-[10px] text-muted-foreground inline-flex items-center gap-1 transition-colors ${hoverTextClass}`}>
                Explore coverage <span className="group-hover:translate-x-0.5 transition">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        10 core sectors • Daily updates • In-depth analysis and project trackers
      </div>
    </div>
  );
}
