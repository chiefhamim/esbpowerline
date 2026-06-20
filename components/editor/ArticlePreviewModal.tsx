'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Monitor, Tablet, Smartphone, LayoutGrid, Newspaper, Pin, Star } from 'lucide-react';
import { cn, formatDate, formatNumber } from '@/lib/utils';
import { FeaturedCarousel } from '@/components/news/FeaturedCarousel';
import { ArticleCard } from '@/components/news/ArticleCard';
import { heroImageStyle, type HeroImageMeta } from '@/lib/hero-image';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { usePreviewDeviceWidth } from '@/hooks/usePreviewDeviceWidth';
import { PreviewThemeToggle } from '@/components/editor/PreviewThemeToggle';
import { PreviewCategoryPill } from '@/components/editor/PreviewCategoryPill';
import { ArticleAuthorSticky } from '@/components/shared/ArticleAuthorSticky';
import { getArticlePreviewContext } from '@/lib/actions/preview-context';
import { sanitizeArticleHtml } from '@/lib/sanitize-article-html';
import {
  mergeDraftIntoCarousel,
  mergeDraftIntoArticles,
  mergeDraftIntoCoverage,
  mergeDraftIntoPinnedRow,
  findCategoryColor,
  type DraftPreviewInput,
} from '@/lib/preview-merge';
import { getSavedSiteTheme, type SiteTheme } from '@/lib/site-theme';
import type { CarouselItem } from '@/lib/homepage-defaults';
import type { PublicArticleCard, PublicCategory } from '@/lib/category-types';
import type { ResolvedCoverageSlot } from '@/lib/coverage-types';

export type PreviewPlacement = 'article' | 'carousel' | 'card' | 'coverage-hero';
export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

type PreviewContext = {
  carouselItems: CarouselItem[];
  categories: PublicCategory[];
  sectorArticles: PublicArticleCard[];
  coverageSlots: ResolvedCoverageSlot[];
  pinnedArticles: PublicArticleCard[];
};

type ArticlePreviewModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  authorName: string;
  readTime: number;
  publishedAt?: string | Date | null;
  slug?: string;
  heroMeta?: HeroImageMeta;
  isFeatured?: boolean;
  isPinned?: boolean;
  isBreaking?: boolean;
};

function PreviewMeta({
  authorName,
  readTime,
  publishedAt,
  className,
}: {
  authorName: string;
  readTime: number;
  publishedAt?: string | Date | null;
  className?: string;
}) {
  const dateLabel = publishedAt ? formatDate(publishedAt) : 'Draft preview';
  return (
    <div className={cn('cms-preview-meta', className)}>
      <span>{authorName}</span>
      <span className="cms-preview-meta__dot" aria-hidden />
      <span>{dateLabel}</span>
      <span className="cms-preview-meta__dot" aria-hidden />
      <span>{readTime} min read</span>
    </div>
  );
}

export function ArticlePreviewModal({
  open,
  onClose,
  title,
  excerpt,
  content,
  imageUrl,
  category,
  authorName,
  readTime,
  publishedAt,
  slug = 'preview',
  heroMeta,
  isFeatured,
  isPinned,
  isBreaking,
}: ArticlePreviewModalProps) {
  const [placement, setPlacement] = useState<PreviewPlacement>('carousel');
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [theme, setTheme] = useState<SiteTheme>('midnight');
  const [context, setContext] = useState<PreviewContext | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);

  useBodyScrollLock(open);
  const { width: deviceWidth, label: deviceLabel } = usePreviewDeviceWidth(device, open);

  useEffect(() => {
    if (!open) return;
    setTheme(getSavedSiteTheme());
    setLoadingContext(true);
    getArticlePreviewContext()
      .then(setContext)
      .catch(() => setContext(null))
      .finally(() => setLoadingContext(false));

    if (placement === 'carousel' && !isFeatured && !isBreaking) {
      setPlacement(isPinned ? 'coverage-hero' : 'card');
    } else if (placement === 'coverage-hero' && !isFeatured && !isBreaking && !isPinned) {
      setPlacement('card');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

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
  }), [slug, title, excerpt, imageUrl, category, authorName, readTime, isFeatured, isPinned, isBreaking]);

  const categoryColor = useMemo(
    () => findCategoryColor(context?.categories ?? [], category),
    [context?.categories, category],
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
      .slice(0, 9);
    return { pinned, grid };
  }, [context?.pinnedArticles, coverageSlots, draft]);

  if (!open) return null;

  const displayTitle = title || 'Untitled';
  const draftSlug = slug || 'preview';
  const isDesktop = device === 'desktop';

  return (
    <div className="cms-preview-backdrop cms-preview-backdrop--locked" onClick={onClose} role="presentation">
      <div
        className="cms-preview-shell"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Article preview"
      >
        <div className="cms-preview-modal__toolbar">
          <div className="cms-preview-modal__toolbar-group">
            <span className="cms-preview-modal__toolbar-label">Placement</span>
            {([
              ['carousel', 'Carousel', Pin],
              ['coverage-hero', 'Coverage', LayoutGrid],
              ['card', 'Home cards', Star],
              ['article', 'Article', Newspaper],
            ] as const).map(([id, label, Icon]) => {
              const disabled = (id === 'carousel' && !isFeatured && !isBreaking) || (id === 'coverage-hero' && !isFeatured && !isBreaking && !isPinned);
              return (
                <button
                  key={id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setPlacement(id as PreviewPlacement)}
                  className={cn(
                    'cms-preview-chip',
                    placement === id && 'cms-preview-chip--active',
                    disabled && 'opacity-50 grayscale cursor-not-allowed'
                  )}
                  title={disabled ? 'Enable placement flags to preview' : undefined}
                >
                  <Icon className="h-3 w-3" /> {label}
                </button>
              );
            })}
          </div>

          <div className="cms-preview-modal__toolbar-group">
            <span className="cms-preview-modal__toolbar-label">Device</span>
            {([
              ['desktop', Monitor],
              ['tablet', Tablet],
              ['mobile', Smartphone],
            ] as const).map(([id, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDevice(id)}
                className={cn(
                  'cms-preview-chip cms-preview-chip--icon',
                  device === id && 'cms-preview-chip--active',
                )}
                aria-label={id}
                title={id}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
            <span className="cms-preview-device-label">{deviceLabel}</span>
          </div>

          <PreviewThemeToggle theme={theme} onChange={setTheme} />

          <button
            type="button"
            className="ui-close-btn cms-preview-close"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="cms-preview-viewport">
          <div
            className={cn(
              'cms-preview-device-frame',
              !isDesktop && 'cms-preview-device-frame--fixed',
              device === 'tablet' && 'cms-preview-device-frame--tablet',
              device === 'mobile' && 'cms-preview-device-frame--mobile',
            )}
            style={isDesktop ? undefined : { width: deviceWidth, maxWidth: '100%' }}
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
                `theme-${theme}`,
                theme === 'white' ? 'light' : 'dark',
              )}
            >
              {loadingContext && (
                <div className="cms-preview-loading">Loading live homepage context…</div>
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
                            isPinned
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          isFeatured={a.isFeatured}
                          isBreaking={a.isBreaking}
                          isPinned={a.isPinned}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {placement === 'article' && (
                <div className="container py-10 max-w-3xl cms-preview-article-page">
                  <PreviewCategoryPill category={category} color={categoryColor} />
                  <h1 className="text-4xl font-semibold tracking-tight mt-3">{displayTitle}</h1>
                  <PreviewMeta authorName={authorName} readTime={readTime} publishedAt={previewDate} className="mt-3" />
                  <ArticleAuthorSticky name={authorName} />
                  {excerpt && <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{excerpt}</p>}
                  {imageUrl && (
                    <figure className="mt-6">
                      <div className="cms-preview-hero-frame rounded-xl overflow-hidden border border-border aspect-video">
                        <img
                          src={imageUrl}
                          alt={heroMeta?.alt ?? displayTitle}
                          className="cms-preview-hero-frame__img w-full h-full"
                          style={heroImageStyle(heroMeta)}
                        />
                      </div>
                      {heroMeta?.caption && (
                        <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">{heroMeta.caption}</figcaption>
                      )}
                    </figure>
                  )}
                  <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(content) }} />
                  <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground flex flex-wrap gap-4">
                    <span>{formatNumber(0)} views</span>
                    <span>{readTime} min read</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}