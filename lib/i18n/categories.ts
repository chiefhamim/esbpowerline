import type { CategoryName } from '@/lib/constants';
import { CATEGORY_DETAILS } from '@/lib/constants';
import type { SiteLocale } from '@/lib/locale';

export type CategoryTranslation = {
  name: string;
  description: string;
};

/**
 * Bengali sector labels — terminology used in Bangladesh's power/energy press
 * (বিদ্যুৎ বিভাগ, বিইআরসি, পিজিসিবি, বিআরইবি context), not literal translation.
 */
export const CATEGORY_TRANSLATIONS_BN: Record<CategoryName, CategoryTranslation> = {
  'Energy Policy & Regulators': {
    name: 'নীতি, আইন ও নিয়ন্ত্রক',
    description: 'বিদ্যুৎ বিভাগের মাস্টার প্ল্যান, বিইআরসি শুনানি ও নিয়ন্ত্রক সিদ্ধান্ত',
  },
  'Power Generation': {
    name: 'বিদ্যুৎ উৎপাদন',
    description: 'সরকারি কেন্দ্র, আইপিপি, ক্যাপাসিটি চার্জ ও উৎপাদন ব্যয়',
  },
  'Fossil Fuels & Commodities': {
    name: 'জ্বালানি ও কমোডিটি বাজার',
    description: 'এলএনজি, গ্যাস, তেল-গ্যাস ও কয়লা',
  },
  'Renewables & Nuclear': {
    name: 'নবায়নযোগ্য ও পারমাণবিক',
    description: 'সৌর-বায়ু, রূপপুর ও ক্লিন এনার্জি প্রকল্প',
  },
  'Grid & Transmission': {
    name: 'ট্রান্সমিশন ও জাতীয় গ্রিড',
    description: 'পিজিসিবি, ভিএইচভি লাইন, হুইলিং চার্জ ও গ্রিড স্থিতিশীলতা',
  },
  'Distribution & Utilities': {
    name: 'বিতরণ কোম্পানি',
    description: 'বিআরইবি, ডেসকো, ডিপিডিসি ও শহর-গ্রামের বিতরণ ব্যবস্থা',
  },
  'Consumers & Tariffs': {
    name: 'ভোক্তা ও বিদ্যুৎ দর',
    description: 'খুচরা দর, গ্রাহক প্রভাব ও বিইআরসির দর সমন্বয়',
  },
  'Market, Finance & Subsidies': {
    name: 'অর্থ, বাজার ও ভর্তুকি',
    description: 'বিপিডিবি ঘাটতি, বিপিসি-সরকারি ভর্তুকি ও খাতীয় অর্থায়ন',
  },
  'International & Cross-Border': {
    name: 'আমদানি বিদ্যুৎ ও আন্তর্জাতিক বাজার',
    description: 'ভারত থেকে আমদানি, আঞ্চলিক জ্বালানি বাজার ও সীমান্ত সংযোগ',
  },
  'Environment & Efficiency': {
    name: 'পরিবেশ ও শক্তি সাশ্রয়',
    description: 'কার্বন নিঃসরণ, দক্ষতা ও পরিবেশগত প্রভাব বিশ্লেষণ',
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