'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Search, Menu, X, Newspaper, BookOpen, BarChart3, Home } from 'lucide-react';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { PublicHrefProvider, usePublicHref } from '@/lib/public-href-client';
import type { PublicCategory } from '@/lib/category-types';
import { CATEGORIES } from '@/lib/constants';
import { slugify } from '@/lib/utils';
import { localizeCategoryFields } from '@/lib/i18n/categories';
import {
  categoryColorVars,
  categoryTextStyle,
  categoryUnderlineStyle,
  getNavbarColorClasses,
} from '@/lib/category-icons';
import { CategoryIconDisplay } from '@/components/category/CategoryIconDisplay';
import type { TickerItem } from '@/components/news/LiveMarketTicker';

const LiveMarketTicker = dynamic(
  () => import('@/components/news/LiveMarketTicker').then((mod) => mod.LiveMarketTicker),
  { ssr: false },
);
import { MemberAuthButton } from '@/components/members/MemberAuthButton';
import { MemberNavMenuLinks } from '@/components/members/MemberNavMenuLinks';
import { LocaleToggle } from '@/components/shared/LocaleToggle';
import { useLocale } from '@/components/shared/LocaleProvider';
import { SiteThemeToggle } from '@/components/shared/SiteThemeToggle';

type NavCategory = {
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  iconImageUrl?: string | null;
};

function PublicNavLink({
  href,
  className,
  style,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
}) {
  const resolvedHref = usePublicHref(href);
  return (
    <Link href={resolvedHref} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  );
}

export function PublicNavbar({
  categories = [],
  tickerItems,
}: {
  categories?: PublicCategory[];
  tickerItems?: TickerItem[];
}) {
  const { locale, t } = useLocale();
  const navCategories: NavCategory[] = useMemo(() => {
    const source = categories.length
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
          slug: slugify(c),
          description: null,
          color: null,
          icon: null,
          iconImageUrl: null,
        }));
    return source.map((cat) => {
      const localized = localizeCategoryFields(locale, cat);
      return { ...cat, name: localized.name, description: localized.description };
    });
  }, [categories, locale]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerSrc, setBannerSrc] = useState('/images/banner.jpg');
  const pathname = usePathname();

  return (
    <PublicHrefProvider>
      <div className="site-banner-shell w-full flex justify-center">
        <div className="container px-0">
          <div className="site-banner-frame border-l border-r border-b border-border/40 overflow-hidden">
            <PublicNavLink href="/" className="w-full block transition-opacity hover:opacity-95">
              <Image
                src={bannerSrc}
                alt="ESB PowerLine Banner"
                className="w-full h-auto object-contain block mx-auto"
                width={1200}
                height={160}
                priority
                onError={() => {
                  if (bannerSrc !== 'https://i.ibb.co/VKq8pgw/001.jpg') {
                    setBannerSrc('https://i.ibb.co/VKq8pgw/001.jpg');
                  }
                }}
              />
            </PublicNavLink>
          </div>
        </div>
      </div>

      <nav className="public-nav-bar sticky top-0 z-50 mb-2">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex md:w-1/4 justify-start">
            <PublicNavLink
              href="/"
              className={`hover:text-primary flex items-center gap-1.5 transition-colors text-sm font-semibold select-none ${
                pathname === '/' ? 'text-primary font-bold' : 'text-foreground/80'
              }`}
            >
              <Home className="h-4 w-4" /> {t('nav.home')}
            </PublicNavLink>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <div className="bg-muted/55 border border-border/55 p-1 rounded-full flex items-center gap-1 shadow-inner">
              <PublicNavLink
                href="/articles"
                className={`px-4 py-1.5 rounded-full transition-all duration-200 text-xs font-semibold flex items-center gap-1.5 select-none ${
                  pathname === '/articles'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <Newspaper className="h-3.5 w-3.5" /> {t('nav.latest')}
              </PublicNavLink>

              <PublicNavLink
                href="/data-reports/power-grid"
                className={`px-4 py-1.5 rounded-full transition-all duration-200 text-xs font-semibold flex items-center gap-1.5 select-none ${
                  pathname.includes('/power-grid')
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" /> {t('nav.gridExplorer')}
              </PublicNavLink>

              <PublicNavLink
                href="/magazine"
                className={`px-4 py-1.5 transition-all duration-200 text-xs font-semibold flex items-center gap-1.5 select-none ${
                  pathname === '/magazine'
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-emerald-600/75 dark:text-emerald-400/75 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                {t('nav.magazine')}
              </PublicNavLink>
            </div>
          </div>

          <div className="flex md:w-1/4 justify-end items-center gap-3 overflow-visible">
            <PublicNavLink
              href="/search"
              className="btn btn-secondary flex items-center gap-1.5 text-xs font-normal px-3 py-1 rounded-xl h-8 text-muted-foreground/80 hover:text-foreground/90"
              aria-label={t('nav.search')}
            >
              <Search className="h-3.5 w-3.5 opacity-80" strokeWidth={2} />
              <span className="hidden sm:inline">{t('nav.search')}</span>
            </PublicNavLink>

            <MemberAuthButton />

            <LocaleToggle className="flex pl-2 border-l border-border/50" />

            <SiteThemeToggle className="flex pl-2 border-l border-border/50" />

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

        <div className={`public-nav-bar__categories hidden md:block container pb-0 ${pathname !== '/' ? 'pt-1' : 'pt-2'}`}>
          <div
            className="category-nav-ribbon grid divide-x divide-border/40"
            style={{ gridTemplateColumns: `repeat(${navCategories.length}, minmax(0, 1fr))` }}
          >
            {navCategories.map((c) => {
              const href = `/categories/${c.slug}`;
              const isActive = pathname === `/categories/${c.slug}`;
              const colors = getNavbarColorClasses(c.name, c.color);

              return (
                <PublicNavLink
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
                </PublicNavLink>
              );
            })}
          </div>
        </div>

        <div className={`public-nav-bar__categories md:hidden container pb-0 ${pathname !== '/' ? 'pt-0.5' : 'pt-1.5'}`}>
          <div className="category-nav-ribbon category-nav-ribbon--mobile relative">
            <div className="public-nav-bar__mobile-fade-l absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10" />
            <div className="public-nav-bar__mobile-fade-r absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10" />

            <div className="flex items-center h-10 overflow-x-auto no-scrollbar gap-5 w-full px-4">
              {navCategories.map((c) => {
                const href = `/categories/${c.slug}`;
                const isActive = pathname === `/categories/${c.slug}`;
                const colors = getNavbarColorClasses(c.name, c.color);

                return (
                  <PublicNavLink
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
                  </PublicNavLink>
                );
              })}
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border/70 public-nav-bar px-4 py-4 text-sm space-y-1">
            <PublicNavLink href="/articles" className="flex items-center gap-2 py-1.5">
              <Newspaper className="h-4 w-4" /> {t('nav.latestNews')}
            </PublicNavLink>
            <PublicNavLink href="/data-reports/power-grid" className="flex items-center gap-2 py-1.5">
              <BarChart3 className="h-4 w-4" /> {t('nav.gridExplorer')}
            </PublicNavLink>
            <PublicNavLink href="/magazine" className="flex items-center gap-2 py-1.5 text-emerald-600/90 dark:text-emerald-400/90">
              <BookOpen className="h-4 w-4" />
              {t('nav.monthlyMagazine')}
            </PublicNavLink>
            <PublicNavLink href="/search" className="flex items-center gap-2 py-1.5">
              <Search className="h-4 w-4" /> {t('nav.searchArticles')}
            </PublicNavLink>
            <MemberNavMenuLinks />
          </div>
        )}
      </nav>
    </PublicHrefProvider>
  );
}