'use client';

import Link from 'next/link';
import { Search, Menu, X, Newspaper, BookOpen, BarChart3, Home } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { PublicCategory } from '@/lib/category-types';
import { CATEGORIES } from '@/lib/constants';
import {
  categoryColorVars,
  categoryTextStyle,
  categoryUnderlineStyle,
  getNavbarColorClasses,
} from '@/lib/category-icons';
import { CategoryIconDisplay } from '@/components/category/CategoryIconDisplay';
import { LiveMarketTicker, type TickerItem } from '@/components/news/LiveMarketTicker';
import { MemberAuthButton } from '@/components/members/MemberAuthButton';
import { MemberNavMenuLinks } from '@/components/members/MemberNavMenuLinks';
import { SiteThemeToggle } from '@/components/shared/SiteThemeToggle';

type NavCategory = {
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  iconImageUrl?: string | null;
};

export function PublicNavbar({
  categories = [],
  tickerItems,
}: {
  categories?: PublicCategory[];
  tickerItems?: TickerItem[];
}) {
  const navCategories: NavCategory[] = categories.length
    ? categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        description: c.description,
        color: c.color,
        icon: c.icon,
        iconImageUrl: c.iconImageUrl,
      }))
    : CATEGORIES.map((c) => ({
        name: c,
        slug: c.toLowerCase().replace(/\s+/g, '-'),
        description: null,
        color: null,
        icon: null,
        iconImageUrl: null,
      }));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerSrc, setBannerSrc] = useState('/images/banner.jpg');
  const pathname = usePathname();

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
        <div className="container flex h-14 items-center justify-between">
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
                className={`px-4 py-1.5 transition-all duration-200 text-xs font-semibold flex items-center gap-1.5 select-none ${
                  pathname === '/magazine' 
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                    : 'text-emerald-600/75 dark:text-emerald-400/75 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Magazine
              </Link>
            </div>
          </div>

          {/* Right Section: Utilities (Search, Switcher, Menu Button) */}
          <div className="flex md:w-1/4 justify-end items-center gap-3 overflow-visible">
            <Link 
              href="/search" 
              className="btn btn-secondary flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl h-8"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" /> Search
            </Link>

            <MemberAuthButton />

            <SiteThemeToggle className="flex pl-2 border-l border-border/50" />

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

        {pathname !== '/' && (
          <LiveMarketTicker initialItems={tickerItems} variant="chrome" />
        )}

        {/* Secondary Editorial Sectors Ribbon */}
        {/* Desktop View: 10-Column Data Ribbon */}
        <div className="hidden md:block py-2">
          <div className="container">
            <div className="border border-border/40 bg-card/30 backdrop-blur-sm rounded-xl overflow-hidden">
              <div
                className="grid divide-x divide-border/40"
                style={{ gridTemplateColumns: `repeat(${navCategories.length}, minmax(0, 1fr))` }}
              >
                {navCategories.map((c) => {
                  const href = `/categories/${c.slug}`;
                  const isActive = pathname === `/categories/${c.slug}`;
                  const colors = getNavbarColorClasses(c.name, c.color);
                  
                  return (
                    <Link
                      key={c.slug}
                      href={href}
                      style={categoryColorVars(c.color)}
                      className={`group relative flex flex-col items-center justify-center py-2.5 px-1 text-center transition-all duration-200 select-none w-full ${
                        isActive 
                          ? 'bg-muted/15 font-semibold text-foreground' 
                          : 'hover:bg-muted/30 font-medium text-muted-foreground/85 hover:text-foreground'
                      }`}
                    >
                      <span
                        className={`absolute top-0 left-0 right-0 h-[2px] transition-transform duration-200 origin-center scale-x-0 group-hover:scale-x-100 ${colors.useCustom ? 'category-nav-underline--custom' : colors.underline}`}
                        style={colors.useCustom ? categoryUnderlineStyle(c.color) : undefined}
                      />
                      <CategoryIconDisplay
                        icon={c.icon}
                        iconImageUrl={c.iconImageUrl}
                        name={c.name}
                        size={14}
                        className={`h-3.5 w-3.5 mb-1 transition-transform duration-200 group-hover:scale-110 ${colors.useCustom ? 'category-nav--custom' : colors.text}`}
                        style={colors.useCustom ? categoryTextStyle(c.color) : undefined}
                      />
                      <span className="text-[10px] tracking-tight leading-snug font-sans">{c.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View: Swipeable Channel Scrollbar */}
        <div className="md:hidden py-1.5">
          <div className="container">
            <div className="relative border border-border/40 bg-muted/5 backdrop-blur-sm rounded-xl overflow-hidden">
              {/* Left/Right scroll indicators for mobile overlay */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

              <div className="flex items-center h-10 overflow-x-auto no-scrollbar gap-5 w-full px-4">
                {navCategories.map((c) => {
                  const href = `/categories/${c.slug}`;
                  const isActive = pathname === `/categories/${c.slug}`;
                  const colors = getNavbarColorClasses(c.name, c.color);
                  
                  return (
                    <Link
                      key={c.slug}
                      href={href}
                      style={categoryColorVars(c.color)}
                      className={`group relative flex items-center gap-1.5 px-0.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 select-none ${
                        isActive 
                          ? (colors.useCustom ? 'category-nav--custom' : colors.text)
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <CategoryIconDisplay
                        icon={c.icon}
                        iconImageUrl={c.iconImageUrl}
                        name={c.name}
                        size={12}
                        className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
                          isActive 
                            ? 'scale-110' 
                            : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'
                        } ${colors.useCustom ? 'category-nav--custom' : ''}`}
                        style={colors.useCustom ? categoryTextStyle(c.color) : undefined}
                      />
                      <span style={colors.useCustom && isActive ? categoryTextStyle(c.color) : undefined}>{c.name}</span>
                      <span
                        className={`absolute bottom-0 left-0 h-[2px] w-full transition-transform duration-200 origin-left ${colors.useCustom ? 'category-nav-underline--custom' : colors.underline} ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                        style={colors.useCustom ? categoryUnderlineStyle(c.color) : undefined}
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
            <Link href="/magazine" className="flex items-center gap-2 py-1.5 text-emerald-600/90 dark:text-emerald-400/90">
              <BookOpen className="h-4 w-4" />
              Monthly Magazine
            </Link>
            <Link href="/search" className="flex items-center gap-2 py-1.5"><Search className="h-4 w-4" /> Search Articles</Link>
            <MemberNavMenuLinks />
          </div>
        )}
      </nav>
    </>
  );
}
