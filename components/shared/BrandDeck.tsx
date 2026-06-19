'use client';

import { cn } from '@/lib/utils';
import { useLocale } from '@/components/shared/LocaleProvider';

type BrandDeckProps = {
  className?: string;
};

export function BrandDeck({ className }: BrandDeckProps) {
  const { t } = useLocale();
  const lede = t('brand.lede', {
    portal: t('brand.ledeEmPortal'),
    magazine: t('brand.ledeEmMagazine'),
  });

  return (
    <div className={cn('brand-deck', className)}>
      <p className="brand-deck__kicker">{t('brand.kicker')}</p>
      <p className="brand-deck__lede">{lede}</p>
    </div>
  );
}