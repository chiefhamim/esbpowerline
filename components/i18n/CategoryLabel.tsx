'use client';

import { localizeCategoryName } from '@/lib/i18n/categories';
import { useLocale } from '@/components/shared/LocaleProvider';

export function CategoryLabel({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { locale } = useLocale();
  return (
    <span className={className} style={style}>
      {localizeCategoryName(locale, name)}
    </span>
  );
}