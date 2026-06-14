'use client';

import Link from 'next/link';
import { Search, Menu, X, Newspaper, BookOpen, BarChart3, Zap, Sun, Flame, Atom, Cable, Scale, Home, Gauge, Globe, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants';

type Theme = 'midnight' | 'dark' | 'white';

const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: 'midnight', label: 'Midnight', color: '#04070f' },
  { id: 'dark', label: 'Dark', color: '#09090b' },
  { id: 'white', label: 'White', color: '#f8fafc' },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('midnight');
  const [bannerSrc, setBannerSrc] = useState('/images/banner.jpg');
  const pathname = usePathname();

  // Load and apply theme
  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'midnight';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('theme-midnight', 'theme-dark', 'theme-white');
    root.classList.add(`theme-${newTheme}`);
    localStorage.setItem('theme', newTheme);
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

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

  // Modern category specific accents for active/hover states (high contrast HSL mappings)
  const CATEGORY_COLORS: Record<string, { text: string; bg: string; underline: string }> = {
    'Power Generation': { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/15', underline: 'bg-blue-500' },
    'Renewable Energy': { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', underline: 'bg-emerald-500' },
    'LNG & Gas': { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 dark:bg-amber-500/15', underline: 'bg-amber-500' },
    'Nuclear Energy': { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10 dark:bg-violet-500/15', underline: 'bg-violet-500' },
    'Grid & Transmission': { text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', underline: 'bg-cyan-500' },
    'Energy Policy': { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10 dark:bg-indigo-500/15', underline: 'bg-indigo-500' },
    'Rural Electrification': { text: 'text-lime-600 dark:text-lime-450', bg: 'bg-lime-500/10 dark:bg-lime-500/15', underline: 'bg-lime-500' },
    'Energy Efficiency': { text: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10 dark:bg-teal-500/15', underline: 'bg-teal-500' },
    'International': { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10 dark:bg-sky-500/15', underline: 'bg-sky-500' },
    'Market & Finance': { text: 'text-rose-600 dark:text-rose-455', bg: 'bg-rose-500/10 dark:bg-rose-500/15', underline: 'bg-rose-500' },
  };

  return (
    <>
      {/* Masthead Banner (Sized proportionally using h-auto to ensure the full image is visible without cropping) */}
      <div className="bg-background w-full flex justify-center">
        <div className="container px-0">
          <div className="border-l border-r border-b border-border/40 overflow-hidden bg-[#0b121e]">
            <Link href="/" className="w-full block transition-opacity hover:opacity-95">
              <img 
                src={bannerSrc} 
                alt="ESB PowerLine Banner" 
                className="w-full h-auto object-contain block mx-auto"
                onError={() => {
                  // Fallback to web link if local banner.jpg does not exist in /public/images/ yet
                  if (bannerSrc !== 'https://i.ibb.co/VKq8pgw/001.jpg') {
                    setBannerSrc('https://i.ibb.co/VKq8pgw/001.jpg');
                  }
                }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Area (Sticks to top of screen on scroll) */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* Primary Navigation Row */}
        <div className="container px-0 sm:px-0 lg:px-0">
          <div className="border-l border-r border-b border-border/40 flex h-14 items-center justify-between px-5 sm:px-6 lg:px-8">
            {/* Left Section: Home Link */}
            <div className="flex md:w-1/4 justify-start">
              <Link 
                href="/" 
                className={`hover:text-primary flex items-center gap-1.5 transition-colors text-sm font-semibold select-none ${
                  pathname === '/' ? 'text-primary font-bold' : 'text-foreground/80'
                }`}
              >
                <Home className="h-4 w-4" /> Home
              </Link>
            </div>

            {/* Center Section: Navigation Links (Symmetrically centered tabs on desktop) */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="bg-muted/40 border border-border/50 p-1 rounded-full flex items-center gap-1 shadow-inner backdrop-blur-sm">
                <Link 
                  href="/articles" 
                  className={`px-4 py-1.5 rounded-full transition-all duration-200 text-xs font-semibold flex items-center gap-1.5 select-none ${
                    pathname === '/articles' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  <Newspaper className="h-3.5 w-3.5" /> Latest
                </Link>
                
                <Link 
                  href="/data-reports/power-grid" 
                  className={`px-4 py-1.5 rounded-full transition-all duration-200 text-xs font-semibold flex items-center gap-1.5 select-none ${
                    pathname.includes('/power-grid') 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" /> Grid Explorer
                </Link>
                
                <Link 
                  href="/magazine" 
                  className={`px-4 py-1.5 rounded-full transition-all duration-200 text-xs font-semibold flex items-center gap-1.5 select-none ${
                    pathname === '/magazine' 
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm' 
                      : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" /> Magazine
                </Link>
              </div>
            </div>

            {/* Right Section: Utilities (Search, Switcher, Menu Button) */}
            <div className="flex md:w-1/4 justify-end items-center gap-3">
              <Link 
                href="/search" 
                className="btn btn-secondary flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl h-8"
                aria-label="Search"
              >
                <Search className="h-3.5 w-3.5" /> Search
              </Link>

              {/* Theme switcher */}
              <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border/50">
                {THEMES.map((t) => (
                  <div key={t.id} className="relative group">
                    <button
                      onClick={() => changeTheme(t.id)}
                      className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                        theme === t.id 
                          ? 'border-primary scale-110 shadow-sm ring-2 ring-primary/20' 
                          : 'border-border/50 hover:border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: t.color }}
                      aria-label={`Switch to ${t.label} theme`}
                    />
                    
                    {/* Slick Custom Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 ease-out transform -translate-y-1.5 group-hover:translate-y-0 z-50">
                      <div className="bg-popover/95 text-popover-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-border shadow-xl backdrop-blur-sm whitespace-nowrap">
                        {t.label}
                      </div>
                      {/* Tiny indicator arrow pointing up */}
                      <div className="w-1.5 h-1.5 bg-popover border-l border-t border-border absolute left-1/2 -translate-x-1/2 -top-[4px] rotate-45" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-foreground/80 hover:text-foreground"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Editorial Sectors Ribbon */}
        {/* Desktop View: 10-Column Data Ribbon */}
        <div className="hidden md:block">
          <div className="container px-0 sm:px-0 lg:px-0">
            <div className="border-l border-r border-b border-border/40 bg-card/30 backdrop-blur-sm">
              <div className="grid grid-cols-10 divide-x divide-border/40">
                {CATEGORIES.map((c) => {
                  const Icon = ICONS[c] || Zap;
                  const slug = c.toLowerCase().replace(/\s+/g, '-');
                  const href = `/categories/${encodeURIComponent(slug)}`;
                  const isActive = pathname === `/categories/${slug}` || pathname === `/categories/${encodeURIComponent(slug)}`;
                  const colors = CATEGORY_COLORS[c] || { text: 'text-primary', bg: 'bg-primary/10', underline: 'bg-primary' };
                  
                  return (
                    <Link
                      key={c}
                      href={href}
                      className={`group relative flex flex-col items-center justify-center py-2.5 px-1 text-center transition-all duration-200 select-none ${
                        isActive 
                          ? 'bg-muted/15 font-semibold text-foreground' 
                          : 'hover:bg-muted/30 font-medium text-muted-foreground/85 hover:text-foreground'
                      }`}
                    >
                      {/* Top color indicator line (ONLY visible on hover) */}
                      <span className={`absolute top-0 left-0 right-0 h-[2px] transition-transform duration-200 origin-center ${colors.underline} scale-x-0 group-hover:scale-x-100`} />
                      
                      {/* Persistent category color on the icon */}
                      <Icon className={`h-3.5 w-3.5 mb-1 transition-transform duration-200 group-hover:scale-110 ${colors.text}`} />
                      
                      {/* Text uses standard theme text colors */}
                      <span className="text-[10px] tracking-tight leading-snug font-sans">{c}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View: Swipeable Channel Scrollbar */}
        <div className="md:hidden">
          <div className="container px-0 sm:px-0 lg:px-0">
            <div className="relative border-l border-r border-b border-border/40 bg-muted/5 backdrop-blur-sm">
              {/* Left/Right scroll indicators for mobile overlay */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

              <div className="flex items-center h-10 overflow-x-auto no-scrollbar gap-5 w-full px-5">
                {CATEGORIES.map((c) => {
                  const Icon = ICONS[c] || Zap;
                  const slug = c.toLowerCase().replace(/\s+/g, '-');
                  const href = `/categories/${encodeURIComponent(slug)}`;
                  const isActive = pathname === `/categories/${slug}` || pathname === `/categories/${encodeURIComponent(slug)}`;
                  const colors = CATEGORY_COLORS[c] || { text: 'text-primary', underline: 'bg-primary' };
                  
                  return (
                    <Link
                      key={c}
                      href={href}
                      className={`group relative flex items-center gap-1.5 px-0.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 select-none ${
                        isActive 
                          ? `${colors.text}` 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
                        isActive 
                          ? 'scale-110' 
                          : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'
                      }`} />
                      <span>{c}</span>
                      {/* Underline active indicator */}
                      <span 
                        className={`absolute bottom-0 left-0 h-[2px] w-full transition-transform duration-200 origin-left ${colors.underline} ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`} 
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/70 bg-background px-4 py-4 text-sm space-y-1">
            <Link href="/articles" className="flex items-center gap-2 py-1.5"><Newspaper className="h-4 w-4" /> Latest News</Link>
            <Link href="/data-reports/power-grid" className="flex items-center gap-2 py-1.5"><BarChart3 className="h-4 w-4" /> Grid Explorer</Link>
            <Link href="/magazine" className="flex items-center gap-2 py-1.5 text-emerald-500"><BookOpen className="h-4 w-4" /> Monthly Magazine</Link>
            <Link href="/search" className="flex items-center gap-2 py-1.5"><Search className="h-4 w-4" /> Search Articles</Link>
          </div>
        )}
      </nav>
    </>
  );
}
