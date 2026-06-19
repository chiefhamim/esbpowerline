'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { CATEGORIES } from '@/lib/constants';
import { localizeCategoryFields } from '@/lib/i18n/categories';
import { useLocale } from '@/components/shared/LocaleProvider';
import { slugify } from '@/lib/utils';
import type { PublicArticleCard, PublicCategory } from '@/lib/category-types';
import type { ResolvedCoverageSlot } from '@/lib/coverage-types';
import {
  categoryColorVars,
  categoryTextStyle,
  hasCategoryColor,
  resolveCategoryIcon,
} from '@/lib/category-icons';
import { CategoryIconDisplay } from '@/components/category/CategoryIconDisplay';
import type { LucideIcon } from 'lucide-react';

type SectorTab = {
  id: string;
  label: string;
  icon: LucideIcon;
  iconKey?: string | null;
  iconImageUrl?: string | null;
  category: string | null;
  slug: string | null;
  color?: string | null;
  description: string;
};

function buildTabs(
  categories: PublicCategory[],
  locale: 'en' | 'bn',
  t: (key: import('@/lib/i18n/messages').MessageKey, vars?: Record<string, string | number>) => string,
): SectorTab[] {
  const source = categories.length
    ? categories
    : CATEGORIES.map((name, order) => ({
        id: name,
        name,
        slug: slugify(name),
        description: null,
        color: null,
        icon: null,
        iconImageUrl: null,
        order,
      }));

  return [
    {
      id: 'all',
      label: t('coverage.allCoverage'),
      icon: Zap,
      category: null,
      slug: null,
      description: t('coverage.allDescription', { count: source.length }),
    },
    ...source.map((cat) => {
      const localized = localizeCategoryFields(locale, cat);
      const englishName = cat.name;
      return {
        id: cat.slug,
        label: localized.name,
        icon: resolveCategoryIcon(cat.icon, englishName),
        iconKey: cat.icon,
        iconImageUrl: cat.iconImageUrl,
        category: englishName,
        slug: cat.slug,
        color: cat.color,
        description:
          localized.description ??
          t('coverage.categoryDescription', { category: localized.name }),
      };
    }),
  ];
}

export function SectorCoverage({
  hideHeader = false,
  categories = [],
  articles = [],
  coverageSlots = [],
  pinnedArticles = [],
}: {
  hideHeader?: boolean;
  categories?: PublicCategory[];
  articles?: PublicArticleCard[];
  coverageSlots?: ResolvedCoverageSlot[];
  pinnedArticles?: PublicArticleCard[];
}) {
  const { locale, t } = useLocale();
  const [activeTab, setActiveTab] = useState('all');
  const sectorTabs = useMemo(() => buildTabs(categories, locale, t), [categories, locale, t]);

  const articlePool = articles;
  const active = sectorTabs.find((t) => t.id === activeTab) ?? sectorTabs[0];

  const pinnedIds = useMemo(
    () => new Set(pinnedArticles.map((a) => a.id)),
    [pinnedArticles],
  );

  const coverageArticles: PublicArticleCard[] = coverageSlots
    .map((slot) => slot.article)
    .filter((article): article is PublicArticleCard => article !== null && !pinnedIds.has(article.id));

  const filteredArticles = active.category === null
    ? (coverageArticles.length > 0
        ? coverageArticles.slice(0, 9)
        : [...articlePool].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 9))
    : articlePool
        .filter((a) => a.category === active.category)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);

  const ActiveIcon = active.icon;

  const getSectorActiveClasses = (label: string): string => {
    const lower = label.toLowerCase();
    if (lower.includes('all')) return 'bg-primary text-primary-foreground border-primary shadow-sm';
    if (lower.includes('generation')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/35 shadow-sm';
    if (lower.includes('renewable')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/35 shadow-sm';
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
            <h2 className="text-xl font-semibold tracking-[-0.015em]">{t('coverage.title')}</h2>
            <div className="hidden sm:flex items-center text-[10px] px-2 py-0.5 rounded-full border bg-muted text-muted-foreground">
              <ActiveIcon className="h-3 w-3 mr-1" />
              {active.category
                ? t('coverage.oneCategory')
                : t('coverage.nCategories', { count: sectorTabs.length - 1 })}
            </div>
          </div>
          <Link href="/articles" className="text-xs font-medium text-primary flex items-center gap-1 hover:underline">
            {t('coverage.browseArchive')} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Floating individual category capsules */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sectorTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const useCustom = isActive && hasCategoryColor(tab.color);
          const activeClasses = isActive
            ? (useCustom ? 'category-sector-tab--active' : getSectorActiveClasses(tab.label))
            : 'border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/70 hover:text-foreground hover:border-border/80';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={useCustom ? categoryColorVars(tab.color) : undefined}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 active:scale-[0.97] ${activeClasses}`}
            >
              <CategoryIconDisplay
                icon={tab.iconKey}
                iconImageUrl={tab.iconImageUrl}
                name={tab.label}
                size={14}
                className="h-3.5 w-3.5"
                style={useCustom ? categoryTextStyle(tab.color) : undefined}
              />
              <span style={useCustom ? categoryTextStyle(tab.color) : undefined}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Context description */}
      <div className="mb-4 text-sm text-muted-foreground">
        {active.description}
      </div>

      {active.category === null && pinnedArticles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {pinnedArticles.map((a) => (
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
              isPinned
            />
          ))}
        </div>
      )}

      {/* Uniform article cards — 9 in All Coverage, 6 per category */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((a) => (
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
              isFeatured={a.isFeatured}
              isBreaking={a.isBreaking}
              isPinned={a.isPinned}
            />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full py-8 text-center">{t('coverage.noArticles')}</p>
        )}
      </div>

      <div className="mt-4 text-right">
        <Link 
          href={active.slug ? `/categories/${active.slug}` : '/articles'}
          className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          {t('coverage.viewAllIn', { label: active.label })} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
