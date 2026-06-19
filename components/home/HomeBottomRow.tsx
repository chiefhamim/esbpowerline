'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Briefcase, TrendingUp } from 'lucide-react';
import { MemberAccessCta } from '@/components/members/MemberAccessCta';
import { useLocale } from '@/components/shared/LocaleProvider';
import { localizeCategoryName } from '@/lib/i18n/categories';
import type { PublicArticleCard } from '@/lib/category-types';

type HomeBottomRowProps = {
  trending: PublicArticleCard[];
  magazine: {
    title: string;
    summary: string;
    coverUrl: string;
  };
  magazineLabel: string;
  professionalsCta: {
    label: string;
    title: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export function HomeBottomRow({
  trending,
  magazine,
  magazineLabel,
  professionalsCta,
}: HomeBottomRowProps) {
  const { locale, t } = useLocale();

  return (
    <div className="container py-8">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight mb-5 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            {t('home.trendingWeek')}
          </h3>
          <div className="space-y-4">
            {trending.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('home.noTrending')}</p>
            ) : (
              trending.map((a, i) => (
                <Link key={a.slug} href={`/articles/${a.slug}`} className="group block">
                  <div className="flex gap-3">
                    <div className="text-[10px] text-muted-foreground tabular-nums w-4 mt-0.5">
                      {(i + 1).toString().padStart(2, '0')}
                    </div>
                    <div>
                      <div className="font-medium leading-snug group-hover:text-primary transition line-clamp-2">
                        {a.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {localizeCategoryName(locale, a.category)} · {a.views.toLocaleString()} {t('common.views')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="card p-6 h-full flex flex-col justify-between bg-card hover:shadow-xl transition-all duration-300">
            <div>
              <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 mb-3">
                <BookOpen className="h-4 w-4" />
                <span className="uppercase tracking-[2px] text-[10px] font-bold">{t('home.monthlyMagazine')}</span>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg leading-tight tracking-tight mb-2 line-clamp-3">
                    {magazine.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">{magazine.summary}</p>
                </div>
                <div className="w-20 sm:w-24 shrink-0 relative group/cover">
                  <div className="aspect-[3/4] rounded border border-border/40 overflow-hidden bg-muted shadow-md transition-transform duration-300 group-hover/cover:-translate-y-1 group-hover/cover:rotate-2 relative">
                    <Image
                      src={magazine.coverUrl}
                      alt={magazine.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100px, 150px"
                    />
                  </div>
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-r from-black/35 via-transparent to-transparent opacity-90 pointer-events-none" />
                </div>
              </div>
            </div>
            <Link
              href="/magazine"
              className="mt-5 inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {t('home.readIssue', { label: magazineLabel })} <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card p-6 h-full flex flex-col justify-between bg-card">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-muted-foreground font-bold mb-3">
                <Briefcase className="h-4 w-4 text-primary" />
                {professionalsCta.label}
              </div>
              <div className="text-lg font-display font-semibold leading-snug mb-2">{professionalsCta.title}</div>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Link href={professionalsCta.primaryHref} className="btn btn-secondary w-full justify-center text-sm">
                {professionalsCta.primaryLabel}
              </Link>
              <MemberAccessCta
                guestLabel={professionalsCta.secondaryLabel}
                guestHref={professionalsCta.secondaryHref}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}