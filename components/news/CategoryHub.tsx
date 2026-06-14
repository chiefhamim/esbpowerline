'use client';

import Link from 'next/link';
import { 
  Zap, Sun, Flame, Atom, Cable, Scale, Home, Gauge, Globe, TrendingUp, 
  Leaf, Factory 
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

const SECTOR_INFO: Record<string, string> = {
  'Power Generation': 'Coal, gas, HFO & new capacity',
  'Renewable Energy': 'Solar, wind, hydro targets',
  'LNG & Gas': 'Supply, terminals & pricing',
  'Nuclear Energy': 'Rooppur & future fleet',
  'Grid & Transmission': '400kV/230kV backbone',
  'Energy Policy': 'Tariffs, BERC & regulation',
  'Rural Electrification': 'SHS, mini-grids & BREB',
  'Energy Efficiency': 'Industrial & buildings programs',
  'International': 'Cross-border trade & imports',
  'Market & Finance': 'IPPs, capacity payments & finance',
};

export function CategoryHub() {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const Icon = ICONS[cat] || Zap;
        const slug = cat.toLowerCase().replace(/\s+/g, '-');

        return (
          <Link
            key={cat}
            href={`/categories/${slug}`}
            className="group flex items-center gap-2 rounded-2xl border border-border/70 bg-card px-3 py-1.5 text-sm hover:border-primary/40 hover:bg-muted/40 transition-all min-w-[150px] flex-shrink-0"
          >
            <div className="icon-wrap !h-7 !w-7 shrink-0 bg-muted/60 group-hover:bg-primary/10">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium leading-tight tracking-tight group-hover:text-primary transition-colors text-[12.5px] whitespace-nowrap">
              {cat}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
