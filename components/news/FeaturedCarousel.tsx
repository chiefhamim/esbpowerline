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
}

export function FeaturedCarousel({
  items,
  tickerItems,
}: {
  items?: FeaturedItem[];
  tickerItems?: TickerItem[];
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
  if (!currentItem) {
    return (
      <section className="featured-hero-section w-full py-4">
        <div className="container">
          <div className="featured-hero-card relative overflow-hidden rounded-2xl border border-border/40 p-12 text-center text-muted-foreground bg-muted/10">
            {t('carousel.noFeatured')}
          </div>
        </div>
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
            onClick={() => goTo(idx)}
            role="tab"
            className="flex flex-1 items-center py-2"
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

  const getCategoryBadgeClasses = (cat: string): string => {
    const lower = cat.toLowerCase();
    if (lower.includes('generation')) return 'border-blue-500/25 text-blue-600 dark:text-blue-400 bg-blue-500/5';
    if (lower.includes('renewable')) return 'border-emerald-500/25 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5';
    if (lower.includes('lng') || lower.includes('gas')) return 'border-amber-500/25 text-amber-600 dark:text-amber-400 bg-amber-500/5';
    if (lower.includes('nuclear')) return 'border-violet-500/25 text-violet-600 dark:text-violet-400 bg-violet-500/5';
    if (lower.includes('grid') || lower.includes('transmission')) return 'border-cyan-500/25 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5';
    if (lower.includes('policy')) return 'border-indigo-500/25 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5';
    if (lower.includes('rural')) return 'border-lime-500/25 text-lime-600 dark:text-lime-400 bg-lime-500/5';
    if (lower.includes('efficiency')) return 'border-teal-500/25 text-teal-600 dark:text-teal-400 bg-teal-500/5';
    if (lower.includes('international')) return 'border-sky-500/25 text-sky-600 dark:text-sky-400 bg-sky-500/5';
    if (lower.includes('market') || lower.includes('finance')) return 'border-rose-500/25 text-rose-600 dark:text-rose-400 bg-rose-500/5';
    return 'border-border text-muted-foreground bg-muted/5';
  };

  return (
    <section className="featured-hero-section w-full py-4">
      <div className="container">
        <div
          className="featured-hero-card hero-dot-pattern relative overflow-hidden rounded-2xl border border-border/40"
          aria-roledescription="carousel"
          aria-label="Featured stories"
        >
          <div className="featured-hero__body relative px-6 py-10 md:px-12 md:py-14">
            <div
              className={`grid gap-x-8 gap-y-5 md:grid-cols-12 md:items-start transition-opacity duration-300 ease-out ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {/* Meta row — badge left, progress right (same line, aligned to columns below) */}
              <div className="grid gap-x-8 md:col-span-12 md:grid-cols-12">
                <div className="flex flex-wrap items-center gap-2 md:col-span-7">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${getCategoryBadgeClasses(currentItem.category)}`}
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-75" />
                    <CategoryLabel name={currentItem.category} />
                  </div>
                  {currentItem.isFeatured ? <ArticlePlacementBadge type="featured" /> : null}
                  {currentItem.isBreaking ? <ArticlePlacementBadge type="breaking" /> : null}
                </div>

                <div className="relative mt-3 flex min-h-8 items-center justify-end md:col-span-5 md:mt-0">
                  <div className="group/transport absolute left-1/2 flex w-1/2 min-w-[9.5rem] -translate-x-1/2 items-center gap-1 opacity-45 transition-opacity duration-150 hover:opacity-100 focus-within:opacity-100">
                    <div className="flex min-w-0 flex-1 items-center gap-0.5">
                      <button
                        onClick={prev}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                        aria-label={t('carousel.previous')}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      {storyProgress}
                      <button
                        onClick={next}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                        aria-label={t('carousel.next')}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] font-medium tabular-nums text-muted-foreground">
                      {current + 1}/{featured.length}
                    </span>
                  </div>

                  <ModernTooltip
                    label={isPlaying ? t('carousel.pause') : t('carousel.play')}
                    hint={t('carousel.storiesMarkets')}
                    side="top"
                    fast
                  >
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-45 transition-all duration-150 hover:bg-muted/50 hover:text-foreground hover:opacity-100 focus-visible:opacity-100"
                      aria-label={isPlaying ? t('carousel.pause') : t('carousel.play')}
                    >
                      {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </button>
                  </ModernTooltip>
                </div>
              </div>

              <div className="featured-hero__title-slot md:col-span-7">
                <h1 className="h1 featured-hero__title line-clamp-4 text-balance pr-2 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                  {currentItem.title}
                </h1>
              </div>

              <div className="relative md:col-span-5">
                <div className="featured-hero__image relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-lg md:aspect-auto">
                  {featured.map((item, idx) =>
                    hasArticleImage(item.imageUrl) ? (
                      <Image
                        key={idx}
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        priority={idx === 0}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                          idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        style={idx === current ? undefined : { visibility: 'hidden' }}
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

              <div className="featured-hero__copy md:col-span-7">
                <p className="featured-hero__excerpt mb-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {currentItem.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/articles/${currentItem.slug}`} className="btn btn-primary gap-2 px-7 py-3 text-[15px]">
                    {t('carousel.readStory')} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/articles" className="btn btn-secondary gap-2 px-6 py-3 text-[15px]">
                    {t('carousel.browseAll')}
                  </Link>
                </div>

                <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('carousel.byAuthor', { author: currentItem.author })} • {t('carousel.minRead', { minutes: currentItem.readTime })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}