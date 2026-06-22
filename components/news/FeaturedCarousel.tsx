'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { ArticlePlacementBadge } from '@/components/shared/ArticlePlacementBadge';
import type { TickerItem } from '@/components/news/LiveMarketTicker';
import { CategoryLabel } from '@/components/i18n/CategoryLabel';
import { useLocale } from '@/components/shared/LocaleProvider';
import { ModernTooltip } from '@/components/shared/ModernTooltip';
import { NoImage } from '@/components/shared/NoImage';
import { hasArticleImage } from '@/lib/article-image';
import { heroImageStyle } from '@/lib/hero-image';

interface FeaturedItem {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  readTime: number;
  category: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isPinned?: boolean;
  heroMeta?: any;
}

export function FeaturedCarousel({
  items,
  tickerItems,
  inBand = false,
}: {
  items?: FeaturedItem[];
  tickerItems?: TickerItem[];
  inBand?: boolean;
}) {
  const { t } = useLocale();
  const featured: FeaturedItem[] = items ?? [];

  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const currentRef = useRef(current);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const goTo = useCallback((index: number) => {
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);

    setIsTransitioning(true);
    transitionTimeout.current = setTimeout(() => {
      setCurrent(index);
      setProgress(0);
      setIsTransitioning(false);
    }, 200);
  }, []);

  const next = useCallback(() => {
    goTo((currentRef.current + 1) % featured.length);
  }, [featured.length, goTo]);

  const prev = useCallback(() => {
    goTo((currentRef.current - 1 + featured.length) % featured.length);
  }, [featured.length, goTo]);

  useEffect(() => {
    if (!isPlaying || isTransitioning) return;

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        const nextP = p + 100 / 75;
        if (nextP >= 100) {
          next();
          return 0;
        }
        return nextP;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isPlaying, isTransitioning, next]);

  useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  const currentItem = featured[current];
  const shellClass = inBand ? '' : 'container container--shell';
  const sectionPad = inBand ? '' : ' py-4';

  const emptyCard = (
    <div className="featured-hero-card relative overflow-hidden rounded-2xl border border-border/40 p-12 text-center text-muted-foreground bg-muted/10">
      {t('carousel.noFeatured')}
    </div>
  );

  if (!currentItem) {
    return (
      <section className={`featured-hero-section w-full${sectionPad}`}>
        {inBand ? emptyCard : <div className={shellClass}>{emptyCard}</div>}
      </section>
    );
  }

  const storyProgress = (
    <div className="flex min-w-0 flex-1 items-center gap-1" role="tablist" aria-label="Featured stories">
      {featured.map((item, idx) => {
        const isActive = idx === current;
        const isPast = idx < current;
        return (
          <button
            key={idx}
            type="button"
            onClick={(e) => { e.preventDefault(); goTo(idx); }}
            role="tab"
            className="featured-hero__progress-tab flex flex-1 items-center py-0"
            aria-label={`Story ${idx + 1}: ${item.title}`}
            aria-selected={isActive}
          >
            <span className="relative h-1 w-full overflow-hidden rounded-full bg-border/40">
              <span
                className={`absolute inset-y-0 left-0 rounded-full bg-muted-foreground/30 transition-[width] duration-100 ease-linear ${
                  isPast ? 'w-full' : isActive ? '' : 'w-0'
                }`}
                style={isActive ? { width: `${progress}%` } : undefined}
              />
            </span>
          </button>
        );
      })}
    </div>
  );

  const heroCard = (
        <div
          className="featured-hero-card hero-dot-pattern relative overflow-hidden rounded-2xl border border-border/40"
          aria-roledescription="carousel"
          aria-label="Featured stories"
        >
          <div
            className={`featured-hero__body relative ${
              inBand ? 'py-0 featured-hero__body--band' : 'py-10 md:py-14'
            }`}
          >
            <div
              className={`featured-hero__split transition-opacity duration-300 ease-out ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="featured-hero__content min-w-0">
                <div className="featured-hero__meta flex items-center gap-2 overflow-hidden">
                  <CategoryLabel
                    name={currentItem.category}
                    className="featured-hero__category section-category-label text-muted-foreground shrink-0"
                  />
                  {currentItem.isFeatured ? <ArticlePlacementBadge type="featured" /> : null}
                  {currentItem.isBreaking ? <ArticlePlacementBadge type="breaking" /> : null}
                </div>

                <div className="featured-hero__title-slot">
                  <h1 className="featured-hero__title line-clamp-2">{currentItem.title}</h1>
                </div>

                <div className="featured-hero__excerpt-slot">
                  <p className="featured-hero__excerpt text-lg leading-relaxed text-muted-foreground md:text-xl line-clamp-3">
                    {currentItem.excerpt ? currentItem.excerpt.replace(/\[&hellip;\]/g, '...').replace(/&hellip;/g, '...') : '\u00A0'}
                  </p>
                </div>

                <div className="featured-hero__actions flex items-center gap-3 overflow-hidden">
                  <Link href={`/articles/${currentItem.slug}`} className="btn btn-primary gap-2 px-7 py-3 text-[15px]">
                    {t('carousel.readStory')} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/articles" className="btn btn-secondary gap-2 px-6 py-3 text-[15px]">
                    {t('carousel.browseAll')}
                  </Link>
                </div>

                <div className="featured-hero__byline flex items-center justify-between gap-3 overflow-hidden">
                  <p className="featured-hero__byline-text min-w-0 truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('carousel.minRead', { minutes: currentItem.readTime })}
                  </p>
                  <div className="featured-hero__transport flex shrink-0 items-center">
                    <div className="featured-hero__transport-controls group/transport flex min-w-0 items-center gap-1 opacity-45 transition-opacity duration-150 hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); prev(); }}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                        aria-label={t('carousel.previous')}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <div className="featured-hero__progress-track flex min-w-[3.5rem] max-w-[5.5rem] flex-1 items-center">
                        {storyProgress}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); next(); }}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                        aria-label={t('carousel.next')}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="featured-hero__counter shrink-0 font-mono font-medium tabular-nums text-muted-foreground">
                      {current + 1}/{featured.length}
                    </span>
                    <ModernTooltip
                      label={isPlaying ? t('carousel.pause') : t('carousel.play')}
                      hint={t('carousel.storiesMarkets')}
                      side="top"
                      fast
                    >
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setIsPlaying(!isPlaying); }}
                        className="featured-hero__play-btn flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-45 transition-all duration-150 hover:bg-muted/50 hover:text-foreground hover:opacity-100 focus-visible:opacity-100"
                        aria-label={isPlaying ? t('carousel.pause') : t('carousel.play')}
                      >
                        {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </button>
                    </ModernTooltip>
                  </div>
                </div>
              </div>

              <div className="featured-hero__image-wrap relative">
                <div className="featured-hero__image relative w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-lg">
                  {featured.map((item, idx) =>
                    hasArticleImage(item.imageUrl) ? (
                      <Image
                        key={idx}
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        priority={idx === 0}
                        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${
                          idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        style={{
                          ...(idx === current ? heroImageStyle(item.heroMeta || undefined) : { visibility: 'hidden' }),
                        }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                          idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        style={idx === current ? undefined : { visibility: 'hidden' }}
                      >
                        <NoImage className="h-full w-full" />
                      </div>
                    ),
                  )}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
  );

  return (
    <section className={`featured-hero-section w-full${sectionPad}`}>
      {inBand ? heroCard : <div className={shellClass}>{heroCard}</div>}
    </section>
  );
}