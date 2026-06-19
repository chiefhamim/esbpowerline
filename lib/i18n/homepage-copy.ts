import type { SiteLocale } from '@/lib/locale';
import type { TickerItem } from '@/components/news/LiveMarketTicker';

const ENERGY_TICKER_LABELS_BN: Record<string, string> = {
  lng: 'এলএনজি (স্পট)',
  coal: 'কয়লা (API২)',
  fx: 'ডলার/টাকা',
  solar: 'সোলার মডিউল',
  tariff: 'বাল্ক ট্যারিফ',
  gas: 'পেট্রোবাংলা গ্যাস',
};

const ENERGY_STAT_LABELS_BN: Record<string, string> = {
  'Generation Capacity': 'উৎপাদন ক্ষমতা',
  'Current Demand': 'বর্তমান চাহিদা',
  'Renewable Share': 'নবায়নযোগ্য অংশ',
  'System Loss': 'সিস্টেম লস',
  'Gas Supply': 'গ্যাস সরবরাহ',
  'Peak Today': 'আজকের পিক',
};

const PROFESSIONALS_CTA_BN = {
  label: 'সদস্য অ্যাক্সেস',
  title: 'নিবন্ধ ও ম্যাগাজিন সংরক্ষণ, ডেটা ডাউনলোড, মন্তব্য ও গভীর বিশ্লেষণে প্রবেশ করুন।',
  primaryLabel: 'গ্রিড এক্সপ্লোরার খুলুন',
  secondaryLabel: 'সদস্য লগইন',
};

const SNAPSHOT_LABEL_BN = 'লাইভ • বিপিডিবি • পিজিসিবি • এসআরইডিএ • পেট্রোবাংলা';

export function localizeTickerItem(item: TickerItem, locale: SiteLocale): TickerItem {
  if (locale === 'en') return item;
  const nameBn = ENERGY_TICKER_LABELS_BN[item.id];
  return nameBn ? { ...item, name: nameBn } : item;
}

export function localizeEnergyStatLabel(label: string, locale: SiteLocale): string {
  if (locale === 'en') return label;
  return ENERGY_STAT_LABELS_BN[label] ?? label;
}

export function localizeSnapshotLabel(label: string, locale: SiteLocale): string {
  if (locale === 'en') return label;
  return SNAPSHOT_LABEL_BN;
}

export function localizeProfessionalsCta<
  T extends {
    label: string;
    title: string;
    primaryLabel: string;
    secondaryLabel: string;
    primaryHref: string;
    secondaryHref: string;
  },
>(cta: T, locale: SiteLocale): T {
  if (locale === 'en') return cta;
  return {
    ...cta,
    ...PROFESSIONALS_CTA_BN,
  };
}