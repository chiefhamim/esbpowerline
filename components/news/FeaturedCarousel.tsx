'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause, Flame } from 'lucide-react';
import { demoArticles } from '@/lib/data';

interface FeaturedItem {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  readTime: number;
  category: string;
  isBreaking?: boolean;
}

export function FeaturedCarousel() {
  const featured: FeaturedItem[] = demoArticles
    .slice(0, 5)
    .map(a => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      imageUrl: a.imageUrl,
      author: a.author,
      readTime: a.readTime,
      category: a.category,
      isBreaking: a.isBreaking,
    }));

  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);

  const goTo = (index: number) => {
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    
    setIsTransitioning(true);
    // Smooth transition handshake
    transitionTimeout.current = setTimeout(() => {
      setCurrent(index);
      setProgress(0);
      setIsTransitioning(false);
    }, 200);
  };

  const next = () => goTo((current + 1) % featured.length);
  const prev = () => goTo((current - 1 + featured.length) % featured.length);

  // Auto-advance with smooth professional timing (7.5s total)
  useEffect(() => {
    if (!isPlaying || isTransitioning) return;

    const progressInterval = setInterval(() => {
      setProgress(p => {
        const nextP = p + (100 / 75); // ~7.5s (100ms ticks)
        if (nextP >= 100) {
          next();
          return 0;
        }
        return nextP;
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
    };
  }, [current, isPlaying, isTransitioning]);

  // Clean up timeout strictly on unmount to prevent page freeze on transition re-renders
  useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  const currentItem = featured[current];

  // Dynamic category pill coloring to reinforce sectoral identity
  const getCategoryBadgeClasses = (cat: string): string => {
    const lower = cat.toLowerCase();
    if (lower.includes('generation')) return 'border-blue-500/25 text-blue-600 dark:text-blue-400 bg-blue-500/5';
    if (lower.includes('renewable')) return 'border-emerald-500/25 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5';
    if (lower.includes('lng') || lower.includes('gas')) return 'border-amber-500/25 text-amber-600 dark:text-amber-400 bg-amber-500/5';
    if (lower.includes('nuclear')) return 'border-violet-500/25 text-violet-600 dark:text-violet-400 bg-violet-500/5';
    if (lower.includes('grid') || lower.includes('transmission')) return 'border-cyan-500/25 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5';
    if (lower.includes('policy')) return 'border-indigo-500/25 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5';
    if (lower.includes('rural')) return 'border-lime-500/25 text-lime-650 dark:text-lime-400 bg-lime-500/5';
    if (lower.includes('efficiency')) return 'border-teal-500/25 text-teal-600 dark:text-teal-400 bg-teal-500/5';
    if (lower.includes('international')) return 'border-sky-500/25 text-sky-600 dark:text-sky-400 bg-sky-500/5';
    if (lower.includes('market') || lower.includes('finance')) return 'border-rose-500/25 text-rose-600 dark:text-rose-400 bg-rose-500/5';
    return 'border-border text-muted-foreground bg-muted/5';
  };

  return (
    <div className="w-full bg-background">
      {/* Carousel Body */}
      <div className="container px-0">
        <div className="relative border-l border-r border-b border-border/40 overflow-hidden bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="py-12 md:py-16 px-5 sm:px-6 lg:px-8 relative">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              
              {/* Text content with soft slide-and-fade animation */}
              <div 
                className={`md:col-span-7 transition-all duration-300 ease-out transform ${
                  isTransitioning ? 'opacity-0 translate-y-1.5' : 'opacity-100 translate-y-0'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${getCategoryBadgeClasses(currentItem.category)}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75 animate-pulse" />
                    Featured • {currentItem.category}
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground tracking-widest font-bold font-mono">
                    {current + 1} / {featured.length}
                  </div>
                </div>

                <h1 className="h1 mb-5 text-balance pr-2 font-display font-extrabold leading-[1.05] tracking-tight">
                  {currentItem.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 leading-relaxed">
                  {currentItem.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link 
                    href={`/articles/${currentItem.slug}`} 
                    className="btn btn-primary gap-2 px-7 py-3 text-[15px]"
                  >
                    Read full story <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/articles" className="btn btn-secondary gap-2 px-6 py-3 text-[15px]">
                    Browse all news
                  </Link>
                </div>

                <div className="mt-6 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  By <span className="text-foreground">{currentItem.author}</span> • {currentItem.readTime} min read
                </div>
              </div>

              {/* Image viewer with crossfade & SCADA indicators */}
              <div className="md:col-span-5 relative group/image">
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl aspect-video bg-muted-foreground/10">
                  {featured.map((item, idx) => (
                    <img
                      key={idx}
                      src={item.imageUrl}
                      alt={item.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                        idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
                      }`}
                    />
                  ))}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  
                  {/* Spine/Border details on image */}
                  <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />
                </div>

                {/* Dynamic context badge (Redundant tag replaced by Live/Breaking news indicator) */}
                {currentItem.isBreaking ? (
                  <div className="absolute top-4 right-4 px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-rose-600 text-white shadow-lg flex items-center gap-1.5 animate-pulse select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                    <Flame className="h-3.5 w-3.5 fill-current" />
                    Breaking News
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full bg-black/60 text-white border border-white/10 backdrop-blur font-medium select-none uppercase tracking-wider text-[10px]">
                    Live coverage
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide progress and control bar */}
      <div className="w-full bg-background">
        <div className="container px-0">
          <div className="border-l border-r border-b border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 flex items-center justify-between py-3 px-5 sm:px-6 lg:px-8 text-xs">
            
            <div className="flex items-center gap-4">
              {/* Liquid progress indicators */}
              <div className="flex items-center gap-2.5">
                {featured.map((item, idx) => {
                  const isActive = idx === current;
                  return (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className="h-1.5 rounded-full bg-border/80 hover:bg-border transition-all w-12 overflow-hidden relative group/btn"
                      aria-label={`Go to story ${idx + 1}`}
                      title={item.title}
                    >
                      {isActive && (
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-primary transition-[width] duration-100 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pause/Play controls */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-secondary/20 hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                aria-label={isPlaying ? 'Pause rotation' : 'Resume rotation'}
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>

            {/* Navigation chevrons */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <button onClick={prev} className="p-2 hover:bg-secondary border border-border/40 hover:text-foreground rounded-xl transition" aria-label="Previous">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={next} className="p-2 hover:bg-secondary border border-border/40 hover:text-foreground rounded-xl transition" aria-label="Next">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
