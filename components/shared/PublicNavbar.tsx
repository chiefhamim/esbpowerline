'use client';

import Link from 'next/link';
import Image from 'next/image';

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

import { PublicMarketStrip } from '@/components/news/PublicMarketStrip';
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
        <div className="container container--shell px-0">
          <div className="site-banner-frame border-l border-r border-b border-border/40 overflow-hidden">
            <PublicNavLink href="/" className="w-full block transition-opacity hover:opacity-95">
              <Image
                src={bannerSrc}
                alt="ESB PowerLine Banner"
                className="site-banner__image block mx-auto"
                width={1760}
                height={250}
                priority
                onError={() => {
                  if (bannerSrc !== 'https://i.ibb.co/VKq8pgw/001.jpg') {
                    setBannerSrc('https://i.ibb.co/VKq8pgw/001.jpg');
                  }
                }}
              />
            </PublicNavLink>
            <PublicMarketStrip energyItems={tickerItems} />
          </div>
        </div>
      </div>

      <nav className="public-nav-bar" aria-label="Primary">
        <div className="container container--shell public-nav-bar__hub-shell">
        <div className="public-nav-bar__hub-band">
        <div className="public-nav-bar__main">
          <div className="public-nav-bar__start">
            <div className="public-nav-bar__pill-cluster public-nav-bar__start-cluster">
              <div className="public-nav-bar__utilities">
                <PublicNavLink
                  href="/"
                  className={`public-nav-bar__pill-btn public-nav-bar__pill-btn--paired public-nav-bar__home${
                    pathname === '/' ? ' public-nav-bar__home--active' : ''
                  }`}
                >
                  <Home className="icon-sm" aria-hidden />
                  <span className="public-nav-bar__pill-label">{t('nav.home')}</span>
                </PublicNavLink>

                <span className="public-nav-bar__pill-divider" aria-hidden />

                <PublicNavLink
                  href="/search"
                  className={`public-nav-bar__pill-btn public-nav-bar__pill-btn--paired public-nav-bar__search-pill public-nav-bar__utility-btn${
                    pathname === '/search' ? ' public-nav-bar__utility-btn--active' : ''
                  }`}
                  aria-label={t('nav.search')}
                >
                  <Search className="icon-sm opacity-85" strokeWidth={2} aria-hidden />
                  <span className="public-nav-bar__pill-label public-nav-bar__pill-label--search">
                    {t('nav.search')}
                  </span>
                </PublicNavLink>

                <span className="public-nav-bar__pill-divider hidden sm:block" aria-hidden />

                <LocaleToggle className="public-nav-bar__locale" />
              </div>
            </div>
          </div>

          <div className="public-nav-bar__center hidden md:flex">
            <div className="public-nav-bar__hub" role="group" aria-label="Primary sections">
              <PublicNavLink
                href="/articles"
                className={`public-nav-bar__hub-link public-nav-bar__hub-link--latest${
                  pathname === '/articles' ? ' public-nav-bar__hub-link--active' : ''
                }`}
              >
                <Newspaper className="icon-sm" aria-hidden />
                <span>{t('nav.latest')}</span>
              </PublicNavLink>

              <PublicNavLink
                href="/data-reports/power-grid"
                className={`public-nav-bar__hub-link public-nav-bar__hub-link--grid${
                  pathname.includes('/power-grid') ? ' public-nav-bar__hub-link--active' : ''
                }`}
              >
                <BarChart3 className="icon-sm" aria-hidden />
                <span>{t('nav.gridExplorer')}</span>
              </PublicNavLink>

              <PublicNavLink
                href="/magazine"
                className={`public-nav-bar__hub-link public-nav-bar__hub-link--magazine${
                  pathname === '/magazine' ? ' public-nav-bar__hub-link--active' : ''
                }`}
              >
                <BookOpen className="icon-sm" aria-hidden />
                <span>{t('nav.magazine')}</span>
              </PublicNavLink>
            </div>
          </div>

          <div className="public-nav-bar__end">
            <div className="public-nav-bar__pill-cluster public-nav-bar__utility-cluster">
              <div className="public-nav-bar__utilities">
                <MemberAuthButton />

                <span className="public-nav-bar__pill-divider hidden sm:block" aria-hidden />

                <SiteThemeToggle className="public-nav-bar__themes" />
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="public-nav-bar__menu-btn md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="icon-md" /> : <Menu className="icon-md" />}
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>

        <div className="container container--shell public-nav-bar__categories-shell public-nav-bar__categories hidden md:block">
          <div
            className="category-nav-ribbon category-nav-ribbon--desktop grid divide-x divide-border/40"
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
                  className={`category-nav-cell group relative transition-all duration-200 select-none w-full overflow-hidden ${
                    isActive
                      ? `${colors.activeBg} font-semibold text-foreground`
                      : `${colors.hoverBg} font-medium text-muted-foreground/85 hover:text-foreground`
                  }`}
                >
                  <span
                    className={`absolute top-0 left-0 z-[2] h-[2px] w-full transition-transform duration-200 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    } ${colors.useCustom ? 'category-nav-underline--custom' : colors.underline}`}
                    style={colors.useCustom ? categoryUnderlineStyle(c.color) : undefined}
                    aria-hidden
                  />
                  <span className="category-nav-cell__stack">
                    <CategoryIconDisplay
                      icon={c.icon}
                      iconImageUrl={c.iconImageUrl}
                      name={c.name}
                      size={14}
                      className={`relative z-[1] h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        colors.useCustom ? 'category-nav--custom' : colors.text
                      }`}
                      style={colors.useCustom ? categoryTextStyle(c.color) : undefined}
                    />
                    <span className="category-nav-label relative z-[1] font-sans">
                      {c.name}
                    </span>
                  </span>
                </PublicNavLink>
              );
            })}
          </div>
        </div>

        <div className="container container--shell public-nav-bar__categories-shell public-nav-bar__categories md:hidden">
          <div className="category-nav-ribbon category-nav-ribbon--mobile category-nav-ribbon--mobile-grid">
              {navCategories.map((c) => {
                const href = `/categories/${c.slug}`;
                const isActive = pathname === `/categories/${c.slug}`;
                const colors = getNavbarColorClasses(c.name, c.color);

                return (
                  <PublicNavLink
                    key={c.slug}
                    href={href}
                    style={categoryColorVars(c.color)}
                    className={`category-nav-cell group relative font-semibold transition-all duration-200 select-none min-w-0 ${
                      isActive
                        ? `${colors.activeBg} ${colors.useCustom ? 'category-nav--custom' : colors.text}`
                        : `${colors.hoverBg} text-muted-foreground hover:text-foreground`
                    }`}
                  >
                    <span className="category-nav-cell__inline">
                      <CategoryIconDisplay
                        icon={c.icon}
                        iconImageUrl={c.iconImageUrl}
                        name={c.name}
                        size={12}
                        className={`relative z-[1] h-3 w-3 shrink-0 transition-transform duration-200 ${
                          isActive
                            ? 'scale-110'
                            : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'
                        } ${colors.useCustom ? 'category-nav--custom' : ''}`}
                        style={colors.useCustom ? categoryTextStyle(c.color) : undefined}
                      />
                      <span
                        className="category-nav-label category-nav-label--mobile relative z-[1]"
                        style={colors.useCustom && isActive ? categoryTextStyle(c.color) : undefined}
                      >
                        {c.name}
                      </span>
                    </span>
                    <span
                      className={`absolute bottom-0 left-0 z-[2] h-[2px] w-full transition-transform duration-200 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      } ${colors.useCustom ? 'category-nav-underline--custom' : colors.underline}`}
                      style={colors.useCustom ? categoryUnderlineStyle(c.color) : undefined}
                      aria-hidden
                    />
                  </PublicNavLink>
                );
              })}
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border/70 public-nav-bar px-4 py-4 text-sm space-y-1">
            <PublicNavLink href="/articles" className="flex items-center gap-2 py-1.5 text-rose-600/85 dark:text-rose-400/90">
              <Newspaper className="h-4 w-4" /> {t('nav.latestNews')}
            </PublicNavLink>
            <PublicNavLink href="/data-reports/power-grid" className="flex items-center gap-2 py-1.5 text-sky-600/85 dark:text-sky-400/90">
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