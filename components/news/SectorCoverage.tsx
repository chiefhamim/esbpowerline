'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Sun, Flame, Cable, Scale, Globe, Home, Gauge, TrendingUp, Atom } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { demoArticles, DemoArticle } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'All Coverage': Zap,
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

const DESC_MAP: Record<string, string> = {
  'All Coverage': 'Latest stories across all 10 power sector categories.',
  'Power Generation': 'Coal, gas, HFO & new capacity additions.',
  'Renewable Energy': 'Solar, wind, hydro progress and targets.',
  'LNG & Gas': 'Supply, terminals & pricing dynamics.',
  'Nuclear Energy': 'Rooppur milestones and future fleet.',
  'Grid & Transmission': '400kV/230kV backbone and evacuation.',
  'Energy Policy': 'Tariffs, BERC regulation and master plans.',
  'Rural Electrification': 'SHS, mini-grids and last-mile access.',
  'Energy Efficiency': 'Industrial DSM and building programs.',
  'International': 'Cross-border trade, imports and cooperation.',
  'Market & Finance': 'IPPs, capacity payments and investment.',
};

type SectorTab = {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  category: string | null; // null for All
  description: string;
};

const SECTOR_TABS: SectorTab[] = [
  {
    id: 'all',
    label: 'All Coverage',
    icon: ICON_MAP['All Coverage'],
    category: null,
    description: DESC_MAP['All Coverage'],
  },
  ...CATEGORIES.map((cat) => ({
    id: cat.toLowerCase().replace(/\s+/g, '-'),
    label: cat,
    icon: ICON_MAP[cat] || Zap,
    category: cat,
    description: DESC_MAP[cat] || 'Latest coverage and analysis.',
  })),
];

export function SectorCoverage({ hideHeader = false }: { hideHeader?: boolean }) {
  const [activeTab, setActiveTab] = useState('all');

  const active = SECTOR_TABS.find(t => t.id === activeTab)!;

  const filteredArticles: DemoArticle[] = active.category === null
    ? [...demoArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6)
    : demoArticles
        .filter(a => a.category === active.category)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);

  const ActiveIcon = active.icon;

  const getSectorActiveClasses = (label: string): string => {
    const lower = label.toLowerCase();
    if (lower.includes('all')) return 'bg-primary text-primary-foreground border-primary shadow-sm';
    if (lower.includes('generation')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/35 shadow-sm';
    if (lower.includes('renewable')) return 'bg-emerald-500/10 text-emerald-750 dark:text-emerald-400 border-emerald-500/35 shadow-sm';
    if (lower.includes('lng') || lower.includes('gas')) return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/35 shadow-sm';
    if (lower.includes('nuclear')) return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/35 shadow-sm';
    if (lower.includes('grid') || lower.includes('transmission')) return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/35 shadow-sm';
    if (lower.includes('policy')) return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/35 shadow-sm';
    if (lower.includes('rural')) return 'bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/35 shadow-sm';
    if (lower.includes('efficiency')) return 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/35 shadow-sm';
    if (lower.includes('international')) return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/35 shadow-sm';
    if (lower.includes('market') || lower.includes('finance')) return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/35 shadow-sm';
    return 'bg-primary/10 text-primary border-primary/20 shadow-sm';
  };

  return (
    <div>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.015em]">Power Sector Coverage</h2>
            <div className="hidden sm:flex items-center text-[10px] px-2 py-0.5 rounded-full border bg-muted text-muted-foreground">
              <ActiveIcon className="h-3 w-3 mr-1" />
              {active.category ? '1 category' : '10 categories'}
            </div>
          </div>
          <Link href="/articles" className="text-xs font-medium text-primary flex items-center gap-1 hover:underline">
            Browse full archive <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Floating individual category capsules */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTOR_TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = tab.id === activeTab;
          const activeClasses = isActive 
            ? getSectorActiveClasses(tab.label) 
            : 'border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/70 hover:text-foreground hover:border-border/80';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 active:scale-[0.97] ${activeClasses}`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Context description */}
      <div className="mb-4 text-sm text-muted-foreground">
        {active.description}
      </div>

      {/* Articles grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(a => (
            <ArticleCard
              key={a.id}
              id={a.slug}
              title={a.title}
              excerpt={a.excerpt}
              category={a.category}
              imageUrl={a.imageUrl}
              author={a.author}
              date={a.date}
              readTime={a.readTime}
              views={a.views}
            />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full py-8 text-center">No recent articles in this category.</p>
        )}
      </div>

      <div className="mt-4 text-right">
        <Link 
          href={active.category ? `/categories/${active.category.toLowerCase().replace(/\s+/g,'-')}` : '/articles'}
          className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          View all in {active.label} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
