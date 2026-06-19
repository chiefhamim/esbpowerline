'use client';

import { SITE_LOCALES, type SiteLocale } from '@/lib/locale';
import { cn } from '@/lib/utils';
import { useLocale } from '@/components/shared/LocaleProvider';

type LocaleToggleProps = {
  className?: string;
};

export function LocaleToggle({ className = '' }: LocaleToggleProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn('locale-toggle', className)}
      data-active={locale}
      role="group"
      aria-label={t('locale.toggle')}
    >
      {SITE_LOCALES.map((item) => {
        const active = locale === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id as SiteLocale)}
            className={cn(
              'locale-toggle__btn',
              `locale-toggle__btn--${item.id}`,
              active && 'locale-toggle__btn--active',
              item.id === 'bn' && 'font-bengali',
            )}
            aria-pressed={active}
            aria-label={item.label}
            title={item.label}
          >
            {item.short}
          </button>
        );
      })}
    </div>
  );
}