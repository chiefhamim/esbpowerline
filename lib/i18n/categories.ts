import type { CategoryName } from '@/lib/constants';
import { CATEGORY_DETAILS } from '@/lib/constants';
import type { SiteLocale } from '@/lib/locale';

export type CategoryTranslation = {
  name: string;
  description: string;
};

/** Professional Bengali labels keyed by canonical English category name. */
export const CATEGORY_TRANSLATIONS_BN: Record<CategoryName, CategoryTranslation> = {
  'Energy Policy & Regulators': {
    name: 'শক্তি নীতি ও নিয়ন্ত্রক',
    description: 'মন্ত্রণালয়ের মাস্টার প্ল্যান, বিইআরসি ট্যারিফ শুনানি ও নিয়ন্ত্রক সিদ্ধান্ত',
  },
  'Power Generation': {
    name: 'বিদ্যুৎ উৎপাদন',
    description: 'রাষ্ট্রীয় বিদ্যুৎ কেন্দ্র, আইপিপি ও ক্যাপাসিটি চার্জ সংক্রান্ত বিষয়',
  },
  'Fossil Fuels & Commodities': {
    name: 'জীবাশ্ম জ্বালানি ও কমোডিটি',
    description: 'এলএনজি, প্রাকৃতিক গ্যাস, তেল ও কয়লা',
  },
  'Renewables & Nuclear': {
    name: 'নবায়নযোগ্য ও পারমাণবিক',
    description: 'সৌর, বায়ু শক্তি এবং রূপপুর পারমাণবিক প্রকল্প',
  },
  'Grid & Transmission': {
    name: 'গ্রিড ও সঞ্চালন',
    description: 'পিজিসিবি, উচ্চভোল্টেজ লাইন ও হুইলিং চার্জ',
  },
  'Distribution & Utilities': {
    name: 'বিতরণ ও ইউটিলিটি',
    description: 'বিআরইবি, ডেসকো, ডিপিডিসি ও শহুরে বিতরণ ব্যবস্থা',
  },
  'Consumers & Tariffs': {
    name: 'ভোক্তা ও ট্যারিফ',
    description: 'খুচরা মূল্য নির্ধারণ ও জনগণের ওপর প্রভাব',
  },
  'Market, Finance & Subsidies': {
    name: 'বাজার, অর্থায়ন ও ভর্তুকি',
    description: 'বিপিডিবির ঘাটতি, বিপিসির মুনাফা ও সরকারি ভর্তুকির বোঝা',
  },
  'International & Cross-Border': {
    name: 'আন্তর্জাতিক ও সীমান্তপার্ণ',
    description: 'আমদানি বিদ্যুৎ ও বিশ্ব জ্বালানি বাজারের পরিবর্তন',
  },
  'Environment & Efficiency': {
    name: 'পরিবেশ ও দক্ষতা',
    description: 'কার্বন নিঃসরণ, শক্তি দক্ষতা ও পরিবেশগত প্রভাব',
  },
};

export function localizeCategoryName(locale: SiteLocale, englishName: string): string {
  if (locale === 'en') return englishName;
  const bn = CATEGORY_TRANSLATIONS_BN[englishName as CategoryName];
  return bn?.name ?? englishName;
}

export function localizeCategoryDescription(locale: SiteLocale, englishName: string): string {
  if (locale === 'en') {
    const details = CATEGORY_DETAILS[englishName as CategoryName];
    return details?.description ?? '';
  }
  const bn = CATEGORY_TRANSLATIONS_BN[englishName as CategoryName];
  return bn?.description ?? CATEGORY_DETAILS[englishName as CategoryName]?.description ?? '';
}

export function localizeCategoryFields(
  locale: SiteLocale,
  category: { name: string; description?: string | null },
): { name: string; description: string | null } {
  if (locale === 'en') {
    return {
      name: category.name,
      description: category.description ?? null,
    };
  }
  return {
    name: localizeCategoryName(locale, category.name),
    description:
      category.description != null && category.description.length > 0
        ? localizeCategoryDescription(locale, category.name) || category.description
        : localizeCategoryDescription(locale, category.name) || null,
  };
}