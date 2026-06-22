'use client';

import { useEffect, useMemo, useState } from 'react';
import { Monitor, Tablet, Smartphone, LayoutGrid, Newspaper, Pin, Star, Flame, Facebook, Globe, Bookmark } from 'lucide-react';
import { ModernTooltip } from '@/components/shared/ModernTooltip';
import { cn, formatExactDate, formatArticleDate, formatArticleHoverDate, formatNumber, extractKeywords, smartRearrangeText } from '@/lib/utils';
import { FeaturedCarousel } from '@/components/news/FeaturedCarousel';
import { ArticleCard } from '@/components/news/ArticleCard';
import { HomeTrendingSection } from '@/components/home/HomeTrendingSection';
import { heroImageStyle, type HeroImageMeta } from '@/lib/hero-image';
import { usePreviewDeviceWidth } from '@/hooks/usePreviewDeviceWidth';
import { PreviewThemeToggle } from '@/components/editor/PreviewThemeToggle';
import { PreviewCategoryPill } from '@/components/editor/PreviewCategoryPill';
import { getArticlePreviewContext } from '@/lib/actions/preview-context';
import { sanitizeArticleHtml } from '@/lib/sanitize-article-html';
import { PublicNavbar } from '@/components/shared/PublicNavbar';
import { PublicFooter } from '@/components/shared/PublicFooter';
import {
  mergeDraftIntoCarousel,
  mergeDraftIntoArticles,
  mergeDraftIntoCoverage,
  mergeDraftIntoPinnedRow,
  mergeDraftIntoTrending,
  findCategoryColor,
  type DraftPreviewInput,
} from '@/lib/preview-merge';
import { getSavedSiteTheme, type SiteTheme } from '@/lib/site-theme';
import type { CarouselItem } from '@/lib/homepage-defaults';
import type { PublicArticleCard, PublicCategory } from '@/lib/category-types';
import type { ResolvedCoverageSlot } from '@/lib/coverage-types';

export type PreviewPlacement = 'article' | 'carousel' | 'card' | 'coverage-hero' | 'trending' | 'facebook';
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

type PreviewContext = {
  carouselItems: CarouselItem[];
  categories: PublicCategory[];
  sectorArticles: PublicArticleCard[];
  coverageSlots: ResolvedCoverageSlot[];
  pinnedArticles: PublicArticleCard[];
  trendingArticles: PublicArticleCard[];
};

type ArticlePreviewPanelProps = {
  active: boolean;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageCredit?: string | null;
  category: string;
  authorName: string;
  readTime: number;
  publishedAt?: string | Date | null;
  slug?: string;
  heroMeta?: HeroImageMeta;
  isFeatured?: boolean;
  isPinned?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  tags?: string[];
  collaborators?: { id: string; name: string }[];
  focusMode?: boolean;
  placement?: PreviewPlacement;
  onPlacementChange?: (placement: PreviewPlacement) => void;
};

export function ArticlePreviewPanel({
  active,
  title,
  excerpt,
  content,
  imageUrl,
  imageCredit,
  category,
  authorName,
  readTime,
  publishedAt,
  slug = 'preview',
  heroMeta,
  isFeatured,
  isPinned,
  isBreaking,
  isTrending,
  tags = [],
  collaborators = [],
  focusMode = false,
  placement: placementProp,
  onPlacementChange: onPlacementChangeProp,
}: ArticlePreviewPanelProps) {
  const [internalPlacement, setInternalPlacement] = useState<PreviewPlacement>('article');
  const placement = placementProp ?? internalPlacement;
  const setPlacement = onPlacementChangeProp ?? setInternalPlacement;
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [theme, setTheme] = useState<SiteTheme>('midnight');
  const [context, setContext] = useState<PreviewContext | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);
  const [fbCaption, setFbCaption] = useState('Latest coverage from the ESB News Desk.');

  const { width: deviceWidth, label: deviceLabel } = usePreviewDeviceWidth(device, active);

  useEffect(() => {
    if (!active) return;
    setTheme(getSavedSiteTheme());

    if (!context) {
      setLoadingContext(true);
      getArticlePreviewContext()
        .then((data) => setContext(data as PreviewContext))
        .catch(() => setContext(null))
        .finally(() => setLoadingContext(false));
    }

    // Auto switch placement depending on flags
    if (isFeatured || isBreaking) {
      setPlacement('carousel');
    } else if (isPinned) {
      setPlacement('coverage-hero');
    } else if (isTrending) {
      setPlacement('trending');
    } else {
      setPlacement('article');
    }
  }, [active, isFeatured, isBreaking, isPinned, isTrending]);

  const previewDate = useMemo(
    () => publishedAt ?? new Date().toISOString(),
    [publishedAt],
  );

  const draft: DraftPreviewInput = useMemo(() => ({
    slug,
    title: title || 'Untitled',
    excerpt,
    imageUrl,
    category,
    author: authorName,
    readTime,
    isFeatured,
    isPinned,
    isBreaking,
    isTrending,
    heroMeta,
  }), [slug, title, excerpt, imageUrl, category, authorName, readTime, isFeatured, isPinned, isBreaking, isTrending, heroMeta]);

  const categoryColor = useMemo(
    () => findCategoryColor(context?.categories ?? [], category),
    [context?.categories, category],
  );

  const cleanContent = useMemo(
    () => {
      if (!active || placement !== 'article') return '';
      return sanitizeArticleHtml(content);
    },
    [active, placement, content]
  );

  const carouselItems = useMemo(
    () => mergeDraftIntoCarousel(context?.carouselItems ?? [], draft),
    [context?.carouselItems, draft],
  );

  const cardArticles = useMemo(
    () => mergeDraftIntoArticles(context?.sectorArticles ?? [], draft, 6),
    [context?.sectorArticles, draft],
  );

  const coverageSlots = useMemo(
    () => mergeDraftIntoCoverage(context?.coverageSlots ?? [], draft, context?.sectorArticles ?? []),
    [context?.coverageSlots, context?.sectorArticles, draft],
  );

  const pinnedRow = useMemo(() => {
    const pinned = mergeDraftIntoPinnedRow(context?.pinnedArticles ?? [], draft);
    const pinnedIds = new Set(pinned.map((a) => a.id));
    const grid = coverageSlots
      .map((slot) => slot.article)
      .filter((a): a is PublicArticleCard => a !== null && !pinnedIds.has(a.id))
      .slice(0, 7);
    return { pinned, grid };
  }, [context?.pinnedArticles, coverageSlots, draft]);

  const trendingArticles = useMemo(() => {
    return mergeDraftIntoTrending(context?.trendingArticles ?? [], draft);
  }, [context?.trendingArticles, draft]);

  const draftTags = useMemo(() => {
    if (tags && tags.length > 0) {
      return tags;
    }
    return extractKeywords(title, content);
  }, [tags, title, content]);

  if (!active) return null;

  const displayTitle = title || 'Untitled';
  const draftSlug = slug || 'preview';
  const isDesktop = device === 'desktop';

  return (
    <div className={cn(
      "cms-preview-panel flex flex-col w-full bg-background overflow-hidden",
      (focusMode && placement === 'article')
        ? "border-none rounded-none shadow-none mt-0 min-h-screen" 
        : "border border-border/40 rounded-xl shadow-sm mt-3"
    )}>
      <div className="cms-preview-modal__toolbar flex flex-wrap items-center justify-between gap-4 p-3 border-b border-border/45 bg-muted/5">
        <div className="cms-preview-modal__toolbar-group">
          <span className="cms-preview-modal__toolbar-label">Placement</span>
          {([
            ['carousel', 'Carousel', Pin],
            ['coverage-hero', 'Coverage', LayoutGrid],
            ['card', 'Home cards', Star],
            ['trending', 'Trending', Flame],
            ['article', 'Article', Newspaper],
            ['facebook', 'Facebook', Facebook],
          ] as const).map(([id, label, Icon]) => {
            const disabled =
              (id === 'carousel' && !isFeatured && !isBreaking) ||
              (id === 'coverage-hero' && !isFeatured && !isBreaking && !isPinned) ||
              (id === 'trending' && !isTrending);
            const placementHints = {
              'carousel': 'Show as featured or breaking hero carousel item',
              'coverage-hero': 'Show as pinned homepage coverage layout slot',
              'card': 'Show as secondary category card on home feed',
              'trending': 'Show in the trending ticker hero rail section',
              'article': 'Show full reader view article details layout',
              'facebook': 'Show how the shared story looks on Facebook newsfeed'
            } as const;

            return (
              <ModernTooltip
                key={id}
                label={`${label} View`}
                hint={disabled ? 'Enable placement flags in options to preview' : placementHints[id]}
                variant="editor"
                alwaysShow
                fast
                side="top"
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setPlacement(id as PreviewPlacement)}
                  className={cn(
                    'cms-preview-chip',
                    placement === id && 'cms-preview-chip--active',
                    disabled && 'opacity-50 grayscale cursor-not-allowed'
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <span className="cms-preview-chip-text">{label}</span>
                </button>
              </ModernTooltip>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="cms-preview-modal__toolbar-group">
            <span className="cms-preview-modal__toolbar-label">Device</span>
            {([
              ['desktop', 'Desktop View', Monitor, 'Simulate wide monitor layout (1280px max)'],
              ['tablet', 'Tablet View', Tablet, 'Simulate vertical tablet screen layout (768px)'],
              ['mobile', 'Mobile View', Smartphone, 'Simulate vertical mobile screen layout (375px)'],
            ] as const).map(([id, label, Icon, hint]) => (
              <ModernTooltip
                key={id}
                label={label}
                hint={hint}
                variant="editor"
                alwaysShow
                fast
                side="top"
              >
                <button
                  type="button"
                  onClick={() => setDevice(id)}
                  className={cn(
                    'cms-preview-chip cms-preview-chip--icon',
                    device === id && 'cms-preview-chip--active',
                  )}
                  aria-label={id}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              </ModernTooltip>
            ))}
            <span className="cms-preview-device-label">{deviceLabel}</span>
          </div>

          <PreviewThemeToggle theme={theme} onChange={setTheme} />
        </div>
      </div>

      <div 
        className={cn(
          "cms-preview-viewport flex-1 overflow-auto bg-muted/20 min-h-[500px]",
          (focusMode && placement === 'article' && isDesktop) ? "p-0" : "p-4"
        )}
      >
        <div
          className={cn(
            'cms-preview-device-frame mx-auto',
            !isDesktop && 'cms-preview-device-frame--fixed',
            device === 'tablet' && 'cms-preview-device-frame--tablet',
            device === 'mobile' && 'cms-preview-device-frame--mobile',
          )}
          style={
            isDesktop
              ? ((focusMode && placement === 'article')
                  ? { width: '100%', maxWidth: '100%', zoom: 1 }
                  : { width: '100%', maxWidth: '1280px' })
              : { 
                  width: deviceWidth, 
                  maxWidth: '100%',
                  height: device === 'mobile' ? '720px' : '900px',
                  display: 'flex',
                  flexDirection: 'column'
                }
          }
        >
          {!isDesktop && (
            <div className="cms-preview-device-chrome">
              <span className="cms-preview-device-chrome__dot" />
              <span className="cms-preview-device-chrome__dot" />
              <span className="cms-preview-device-chrome__dot" />
              <span className="cms-preview-device-chrome__label">{deviceLabel}</span>
            </div>
          )}

          <div
            className={cn(
              'cms-preview-public-surface',
              (!focusMode || placement !== 'article') && 'rounded-b-xl overflow-hidden',
              `theme-${theme}`,
              theme === 'white' ? 'light' : 'dark',
              !isDesktop && 'flex-1 overflow-y-auto'
            )}
          >
            {focusMode && placement === 'article' && (
              <div className="pointer-events-none select-none">
                <PublicNavbar
                  categories={context?.categories ?? []}
                />
              </div>
            )}

            {loadingContext && (
              <div className="cms-preview-loading py-8 text-center text-sm text-muted-foreground animate-pulse">
                Loading live homepage context…
              </div>
            )}

            {placement === 'carousel' && (
              <div className="cms-preview-home-section">
                <FeaturedCarousel items={carouselItems} />
              </div>
            )}

            {placement === 'coverage-hero' && (
              <div className="container py-8 cms-preview-home-section">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold tracking-tight">Power Sector</h2>
                  <p className="text-sm text-muted-foreground mt-1">Pinned top row + nine equal cards</p>
                </div>
                {pinnedRow.pinned.length > 0 && (
                  <div className="home-article-grid home-article-grid--pinned mb-4">
                    {pinnedRow.pinned.map((a) => (
                      <div
                        key={a.id}
                        className={cn(a.slug === draftSlug && 'preview-draft-highlight rounded-2xl')}
                      >
                        <ArticleCard
                          id={a.slug}
                          title={a.title}
                          excerpt={a.excerpt}
                          category={a.category}
                          imageUrl={a.imageUrl}
                          author={a.author}
                          date={a.date}
                          readTime={a.readTime}
                          views={a.views}
                          heroMeta={a.heroMeta}
                          isPinned
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="home-article-grid">
                  {pinnedRow.grid.map((a) => (
                    <div
                      key={a.id}
                      className={cn(a.slug === draftSlug && 'preview-draft-highlight rounded-2xl')}
                    >
                      <ArticleCard
                        id={a.slug}
                        title={a.title}
                        excerpt={a.excerpt}
                        category={a.category}
                        imageUrl={a.imageUrl}
                        author={a.author}
                        date={a.date}
                        readTime={a.readTime}
                        views={a.views}
                        heroMeta={a.heroMeta}
                        isFeatured={a.isFeatured}
                        isBreaking={a.isBreaking}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {placement === 'card' && (
              <div className="container py-8 cms-preview-home-section">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold tracking-tight">Latest stories</h2>
                  <p className="text-sm text-muted-foreground mt-1">Homepage card grid alongside other coverage</p>
                </div>
                <div className="home-article-grid">
                  {cardArticles.map((a) => (
                    <div
                      key={a.id}
                      className={cn(a.slug === draftSlug && 'preview-draft-highlight rounded-2xl')}
                    >
                      <ArticleCard
                        id={a.slug}
                        title={a.title}
                        excerpt={a.excerpt}
                        category={a.category}
                        imageUrl={a.imageUrl}
                        author={a.author}
                        date={a.date}
                        readTime={a.readTime}
                        views={a.views}
                        heroMeta={a.heroMeta}
                        isFeatured={a.isFeatured}
                        isBreaking={a.isBreaking}
                        isPinned={a.isPinned}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {placement === 'trending' && (
              <div className="home-page container py-8 max-w-5xl mx-auto px-4">
                <div className="mb-6 text-center sm:text-left">
                  <h2 className="text-xl font-semibold tracking-tight">Trending Section Previews</h2>
                  <p className="text-sm text-muted-foreground mt-1">Preview how the trending section displays in the hero banner and sidebar layouts.</p>
                </div>

                <div className="flex flex-col lg:flex-row justify-center gap-8 items-start">
                  {/* 1. Hero Rail Layout Preview */}
                  <div className="w-full max-w-[var(--home-rail-width)] mx-auto flex flex-col gap-3">
                    <div className="text-center lg:text-left">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        Placement: Hero Rail
                      </span>
                    </div>
                    <div className="home-hero-band w-full">
                      <HomeTrendingSection trending={trendingArticles} layout="hero-rail" />
                    </div>
                  </div>

                  {/* 2. Sidebar Rail Layout Preview */}
                  <div className="w-full max-w-[var(--home-rail-width)] mx-auto flex flex-col gap-3">
                    <div className="text-center lg:text-left">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        Placement: Sidebar Rail
                      </span>
                    </div>
                    <div className="w-full">
                      <HomeTrendingSection trending={trendingArticles} layout="rail" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {placement === 'facebook' && (
              <div className="container py-8 max-w-2xl mx-auto flex flex-col items-center">
                <div className="mb-6 w-full text-center sm:text-left">
                  <h2 className="text-xl font-semibold tracking-tight">Facebook Share Preview</h2>
                  <p className="text-sm text-muted-foreground mt-1">Preview how your story appears when shared on social media feeds.</p>
                </div>
                
                {/* Facebook Post Card */}
                <div 
                  className={cn(
                    "w-full rounded-xl border transition-colors shadow-sm overflow-hidden text-left",
                    theme === 'white' 
                      ? "bg-white border-[#e4e6eb] text-[#050505]" 
                      : "bg-[#242526] border-[#3e4042] text-[#e4e6eb]"
                  )}
                  style={{ fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif' }}
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Page Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white text-base tracking-wider shrink-0 shadow-inner">
                        ESB
                      </div>
                      <div>
                        {/* Page Name & Verified Badge */}
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[15px] hover:underline cursor-pointer">
                            ESB PowerLine
                          </span>
                          {/* Verified Badge */}
                          <svg className="w-4 h-4 text-[#1877f2]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </div>
                        {/* Timestamp & Globe Icon */}
                        <div className="flex items-center gap-1 text-[13px] opacity-75 mt-0.5">
                          <span>Just now</span>
                          <span>•</span>
                          {/* Globe Icon */}
                          <Globe className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Post Caption (User's Writing Section) */}
                  <div className="px-4 pb-3">
                    <textarea
                      value={fbCaption}
                      onChange={(e) => setFbCaption(e.target.value)}
                      placeholder="Write something about this link..."
                      className={cn(
                        "w-full bg-transparent resize-none border-none outline-none focus:ring-0 text-[15px] leading-normal font-normal p-0",
                        theme === 'white' 
                          ? "text-[#050505] placeholder-[#65676b]" 
                          : "text-[#e4e6eb] placeholder-[#b0b3b8]"
                      )}
                      rows={2}
                    />
                  </div>
                  
                  {/* Post Link Attachment Card */}
                  <div 
                    className={cn(
                      "cursor-pointer border-t border-b overflow-hidden transition-colors hover:opacity-95",
                      theme === 'white' 
                        ? "bg-[#f0f2f5] border-[#e4e6eb] hover:bg-[#e4e6eb]/50" 
                        : "bg-[#3a3b3c] border-[#3e4042] hover:bg-[#3e4042]/50"
                    )}
                  >
                    {/* Attachment Image */}
                    {imageUrl ? (
                      <div className="aspect-[1.91/1] w-full bg-black/10 overflow-hidden relative">
                        <img 
                          src={imageUrl} 
                          alt="Facebook preview" 
                          className="w-full h-full"
                          style={heroImageStyle(heroMeta || undefined)}
                        />
                      </div>
                    ) : (
                      <div className="aspect-[1.91/1] w-full bg-muted flex flex-col items-center justify-center text-muted-foreground border-b border-border/30 gap-2">
                        <Facebook className="h-8 w-8 opacity-40" />
                        <span className="text-xs">No media preview image selected</span>
                      </div>
                    )}
                    
                    {/* Attachment Meta Texts */}
                    <div className="p-3 flex flex-col gap-1">
                      <span className="text-[12px] uppercase tracking-wider opacity-75 font-semibold">
                        ESBPOWERLINE.COM
                      </span>
                      <span className="text-[16px] font-bold leading-snug line-clamp-2">
                        {displayTitle}
                      </span>
                      <span className="text-[13px] leading-snug opacity-75 line-clamp-2">
                        {excerpt || "Click to read the full article on ESB PowerLine. Stay updated on power & energy updates."}
                      </span>
                    </div>
                  </div>
                  
                  {/* Likes/Comments Stats Bar */}
                  <div className="px-4 py-2 flex items-center justify-between text-[13px] opacity-75 border-b border-border/10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#1877f2] flex items-center justify-center text-white shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                      <span>2.4K</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>42 comments</span>
                      <span>88 shares</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons Bar */}
                  <div className="px-2 py-1 flex items-center justify-around text-[14px] font-semibold text-muted-foreground">
                    <button type="button" className="flex-1 py-2 hover:bg-muted/30 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.757a2 2 0 011.91 2.62l-1.454 4.362C18.672 18.675 17.065 20 15.243 20H13M4 11.5v6M11 10.5V20M4 18.5h6" />
                      </svg>
                      Like
                    </button>
                    <button type="button" className="flex-1 py-2 hover:bg-muted/30 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Comment
                    </button>
                    <button type="button" className="flex-1 py-2 hover:bg-muted/30 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l5.263-2.63M8.684 13.258l5.263 2.63m-5.263-1.3l.01.018m0-.018a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm8.684-5.263a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 10.526a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}

            {placement === 'article' && (
              <div className="container py-10 max-w-3xl cms-preview-article-page article-page--with-sticky-author fluid-article-container">
                <header className="article-header">
                  <div className="article-category-wrap flex items-center gap-2">
                    <PreviewCategoryPill category={category} color={categoryColor} className="text-sm font-bold uppercase tracking-widest text-primary" />
                  </div>
                  <h1 className="font-display font-extrabold tracking-tight leading-[1.05] text-foreground">
                    {displayTitle}
                  </h1>
                  {excerpt && (
                    <p className="text-muted-foreground leading-snug font-light article-excerpt">
                      {excerpt.replace(/\[&hellip;\]/g, '...').replace(/&hellip;/g, '...')}
                    </p>
                  )}

                  <div className="article-meta-row">
                    <div className="article-meta-left-group">
                      <div className="article-meta-avatar rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground uppercase shadow-sm shrink-0">
                        {authorName ? authorName.substring(0, 2) : 'ES'}
                      </div>
                      <div className="article-meta-text flex flex-col min-w-0">
                        <div className="article-meta-author">
                          <span className="hover:text-primary transition-colors cursor-pointer">{authorName || 'ESB PowerLine'}</span>
                          {collaborators && collaborators.length > 0 && (
                            <>
                              <span className="text-xs font-normal text-muted-foreground">with:</span>
                              <span className="hover:text-primary transition-colors cursor-pointer underline decoration-dotted underline-offset-2">
                                {collaborators[0].name}
                              </span>
                              {collaborators.length > 1 && (
                                <ModernTooltip
                                  label="Additional Editors"
                                  hint={collaborators.slice(1).map((c) => c.name).join(', ')}
                                  variant="editor"
                                  alwaysShow
                                  fast
                                  side="top"
                                >
                                  <span
                                    className="bg-muted-foreground/10 px-1.5 py-0.5 rounded text-[10px] font-bold text-muted-foreground cursor-help"
                                  >
                                    +{collaborators.length - 1}
                                  </span>
                                </ModernTooltip>
                              )}
                            </>
                          )}
                        </div>
                        <div className="article-meta-subline">
                          <div className="article-meta-date-wrapper">
                            <ModernTooltip 
                              label={formatArticleHoverDate(previewDate)}
                              variant="member"
                              alwaysShow
                              side="bottom"
                            >
                              <span className="article-meta-date article-meta-details cursor-help hover:text-foreground transition-colors">
                                {formatArticleDate(previewDate)}
                              </span>
                            </ModernTooltip>
                          </div>
                          <span className="article-meta-separator article-meta-mobile-hide">•</span>
                          <div className="article-meta-stats-wrapper">
                            <span className="article-meta-read-time article-meta-details">{readTime} min read</span>
                            <span className="article-meta-separator">•</span>
                            <span className="article-meta-views-count article-meta-details">0 views</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="article-meta-actions">
                      <button
                        type="button"
                        disabled
                        className="btn btn-secondary inline-flex items-center gap-2 text-sm opacity-60 cursor-not-allowed"
                      >
                        <Bookmark className="h-4 w-4" />
                        <span className="article-save-btn-text">Save article</span>
                      </button>
                    </div>
                  </div>
                </header>

                {imageUrl && (
                  <figure>
                    <div className="image-container-with-credit rounded-xl overflow-hidden border border-border aspect-video">
                      <img
                        src={imageUrl}
                        alt={heroMeta?.alt ?? displayTitle}
                        className="cms-preview-hero-frame__img w-full h-full"
                        style={heroImageStyle(heroMeta)}
                      />
                      {imageCredit && (
                        <span className="image-credit-overlay">
                          Photo: {imageCredit}
                        </span>
                      )}
                    </div>
                    {heroMeta?.caption && (
                      <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">{heroMeta.caption}</figcaption>
                    )}
                  </figure>
                )}

                <div className="article-body mt-8 text-lg md:text-xl leading-relaxed pb-safe" dangerouslySetInnerHTML={{ __html: cleanContent }} />

                {draftTags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-border/30">
                    {draftTags.map((t) => (
                      <span key={t} className="tag text-xs font-semibold bg-muted/60 text-muted-foreground border border-border/40 px-2.5 py-1 rounded-full">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-8 pt-6 text-sm text-muted-foreground flex flex-wrap gap-4">
                  <span>{formatNumber(0)} views</span>
                  <span>{readTime} min read</span>
                </div>
              </div>
            )}

            {focusMode && placement === 'article' && (
              <div className="pointer-events-none select-none">
                <PublicFooter categories={context?.categories ?? []} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
