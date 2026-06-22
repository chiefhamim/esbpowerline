'use client';

import Link from 'next/link';
import { ArrowRight, Award, FileText, Newspaper, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/components/shared/LocaleProvider';

const PILLARS = [
  { key: 'coverage' as const, icon: Award },
  { key: 'policy' as const, icon: ShieldCheck },
  { key: 'magazine' as const, icon: FileText },
] as const;

export function HomeAboutSection() {
  const { t } = useLocale();

  return (
    <section className="home-about home-block" aria-labelledby="home-about-title">
      <div className="home-section-head flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <div className="section-kicker text-primary/80 mb-1.5">{t('home.aboutKicker').toUpperCase()}</div>
          <div className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary shrink-0" aria-hidden />
            <h2 id="home-about-title" className="text-2xl md:text-3xl font-display font-bold tracking-tight">
              {t('home.aboutTitle')}
            </h2>
          </div>
        </div>
        <Link
          href="/about"
          className="text-sm text-primary inline-flex items-center gap-1 hover:underline font-medium shrink-0"
        >
          {t('home.aboutLearnMore')}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <div className="home-about__grid">
        <div className="home-about__narrative">
          <p className="home-about__lead">{t('home.aboutLead')}</p>
          <p className="text-sm text-muted-foreground leading-relaxed font-light">{t('portal.mastheadTagline')}</p>
          <p className="home-about__audience">{t('home.aboutAudience')}</p>
          <div className="home-about__editor">
            <span className="home-about__editor-dot" aria-hidden />
            <span>{t('home.aboutEditor')}</span>
          </div>
        </div>

        <div className="home-about__brief card">
          <ul className="home-about__pillars">
            {PILLARS.map(({ key, icon: Icon }) => (
              <li key={key} className="home-about__pillar">
                <div className="home-about__pillar-icon" aria-hidden>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="home-about__pillar-title">
                    {t(
                      key === 'coverage'
                        ? 'home.aboutPillarCoverage'
                        : key === 'policy'
                          ? 'home.aboutPillarPolicy'
                          : 'home.aboutPillarMagazine',
                    )}
                  </h3>
                  <p className="home-about__pillar-desc">
                    {t(
                      key === 'coverage'
                        ? 'home.aboutPillarCoverageDesc'
                        : key === 'policy'
                          ? 'home.aboutPillarPolicyDesc'
                          : 'home.aboutPillarMagazineDesc',
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}