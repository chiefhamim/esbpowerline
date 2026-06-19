import type { SiteLocale } from '@/lib/locale';

export type MessageKey =
  | 'nav.home'
  | 'nav.latest'
  | 'nav.gridExplorer'
  | 'nav.magazine'
  | 'nav.search'
  | 'nav.latestNews'
  | 'nav.monthlyMagazine'
  | 'nav.searchArticles'
  | 'footer.editorialOffice'
  | 'footer.editorPublisher'
  | 'footer.email'
  | 'footer.officeAddress'
  | 'footer.advertising'
  | 'footer.officialChannels'
  | 'footer.explore'
  | 'footer.sectors'
  | 'footer.members'
  | 'footer.latestNews'
  | 'footer.allCategories'
  | 'footer.monthlyMagazine'
  | 'footer.gridExplorer'
  | 'footer.search'
  | 'footer.copyright'
  | 'footer.tagline'
  | 'footer.about'
  | 'footer.contact'
  | 'footer.backToTop'
  | 'brand.kicker'
  | 'brand.lede'
  | 'brand.ledeEmPortal'
  | 'brand.ledeEmMagazine'
  | 'home.systemSnapshot'
  | 'home.powerSector'
  | 'home.powerSectorSub'
  | 'coverage.title'
  | 'coverage.allCoverage'
  | 'coverage.allDescription'
  | 'coverage.categoryDescription'
  | 'coverage.browseArchive'
  | 'coverage.oneCategory'
  | 'coverage.nCategories'
  | 'coverage.noArticles'
  | 'coverage.viewAllIn'
  | 'categories.title'
  | 'categories.subtitle'
  | 'categories.articles'
  | 'categories.empty'
  | 'categories.footer'
  | 'categories.allCategories'
  | 'categories.latestAnalysis'
  | 'categories.noPublished'
  | 'articles.title'
  | 'articles.subtitle'
  | 'articles.advancedSearch'
  | 'articles.allCategories'
  | 'articles.filterBy'
  | 'articles.showing'
  | 'articles.of'
  | 'articles.loadMore'
  | 'articles.trending'
  | 'search.title'
  | 'search.subtitle'
  | 'home.trendingWeek'
  | 'home.noTrending'
  | 'home.monthlyMagazine'
  | 'home.readIssue'
  | 'common.min'
  | 'common.views'
  | 'common.esbStaff'
  | 'common.all'
  | 'common.close'
  | 'locale.toggle'
  | 'ticker.energyMarkets'
  | 'ticker.dseLive'
  | 'ticker.live'
  | 'ticker.indicative'
  | 'sort.label'
  | 'sort.latest'
  | 'sort.mostViewed'
  | 'search.placeholder'
  | 'search.resultsFor'
  | 'search.publishedCount'
  | 'search.noResults'
  | 'carousel.noFeatured'
  | 'carousel.readStory'
  | 'carousel.previous'
  | 'carousel.next'
  | 'carousel.pause'
  | 'carousel.play'
  | 'carousel.browseAll'
  | 'carousel.byAuthor'
  | 'carousel.minRead'
  | 'carousel.storiesMarkets'
  | 'placement.featured'
  | 'placement.breaking'
  | 'placement.pinned'
  | 'interviews.kicker'
  | 'interviews.title'
  | 'interviews.watchAll'
  | 'interviews.close'
  | 'interviews.noVideo'
  | 'interviews.watchFull'
  | 'member.loading'
  | 'member.guestPitch'
  | 'member.login'
  | 'member.staffNote'
  | 'member.signedInMember'
  | 'member.signedInStaff'
  | 'member.manageAccount'
  | 'member.staffSignIn'
  | 'energy.simulated'
  | 'energy.indicative';

const EN: Record<MessageKey, string> = {
  'nav.home': 'Home',
  'nav.latest': 'Latest',
  'nav.gridExplorer': 'Grid Explorer',
  'nav.magazine': 'Magazine',
  'nav.search': 'Search',
  'nav.latestNews': 'Latest News',
  'nav.monthlyMagazine': 'Monthly Magazine',
  'nav.searchArticles': 'Search Articles',
  'footer.editorialOffice': 'Editorial & Office',
  'footer.editorPublisher': 'Editor & Publisher',
  'footer.email': 'E-mail',
  'footer.officeAddress': 'Office Address',
  'footer.advertising': 'Advertising Department',
  'footer.officialChannels': 'Official channels',
  'footer.explore': 'Explore',
  'footer.sectors': 'Sectors',
  'footer.members': 'Members',
  'footer.latestNews': 'Latest News',
  'footer.allCategories': 'All Categories',
  'footer.monthlyMagazine': 'Monthly Magazine',
  'footer.gridExplorer': 'Grid Explorer',
  'footer.search': 'Search',
  'footer.copyright': '© {year} ESB PowerLine. All rights reserved.',
  'footer.tagline':
    'Authoritative coverage for utilities, regulators, IPPs, investors and policymakers.',
  'footer.about': 'About',
  'footer.contact': 'Contact',
  'footer.backToTop': 'Back to top',
  'brand.kicker': 'News portal & magazine',
  'brand.lede':
    "{portal} and the {magazine} — daily reporting, sector data, and analysis from generation and grid to policy and projects.",
  'brand.ledeEmPortal': "Bangladesh's power sector news portal",
  'brand.ledeEmMagazine': 'ESB PowerLine monthly magazine',
  'home.systemSnapshot': 'System Snapshot',
  'home.powerSector': 'Power Sector',
  'home.powerSectorSub': 'Browse coverage across all sectors or filter to a specific one.',
  'coverage.title': 'Power Sector Coverage',
  'coverage.allCoverage': 'All Coverage',
  'coverage.allDescription': 'Latest stories across all {count} power sector categories.',
  'coverage.categoryDescription': 'Latest {category} coverage and analysis.',
  'coverage.browseArchive': 'Browse full archive',
  'coverage.oneCategory': '1 category',
  'coverage.nCategories': '{count} categories',
  'coverage.noArticles': 'No recent articles in this category.',
  'coverage.viewAllIn': 'View all in {label}',
  'categories.title': 'Power Sector Categories',
  'categories.subtitle':
    "Focused coverage across Bangladesh's energy value chain. Click any sector for dedicated reporting, analysis and data.",
  'categories.articles': '{count} articles',
  'categories.empty': 'No categories configured yet.',
  'categories.footer': '{count} sectors • Daily updates • In-depth analysis and project trackers',
  'categories.allCategories': '← All categories',
  'categories.latestAnalysis': 'Latest analysis, projects and policy updates for this sector.',
  'categories.noPublished': 'No published articles in this category yet. Check back soon.',
  'articles.title': 'Latest News',
  'articles.subtitle': 'Power & energy sector coverage for Bangladesh',
  'articles.advancedSearch': 'Advanced Search',
  'articles.allCategories': 'All categories',
  'articles.filterBy': 'Filter by category',
  'articles.showing': 'Showing',
  'articles.of': 'of',
  'articles.loadMore': 'Load more articles',
  'articles.trending': 'Trending',
  'search.title': 'Search',
  'search.subtitle': 'Search titles, excerpts, and categories from live published content.',
  'home.trendingWeek': 'Trending this week',
  'home.noTrending': 'No trending articles yet — publish stories to populate this list.',
  'home.monthlyMagazine': 'Monthly Magazine',
  'home.readIssue': 'Read {label} Issue',
  'common.min': 'min',
  'common.views': 'views',
  'common.esbStaff': 'ESB Staff',
  'common.all': 'All',
  'common.close': 'Close',
  'locale.toggle': 'Language',
  'ticker.energyMarkets': 'Energy Markets',
  'ticker.dseLive': 'DSE Live',
  'ticker.live': 'Live',
  'ticker.indicative': 'Indicative',
  'sort.label': 'Sort',
  'sort.latest': 'Latest First',
  'sort.mostViewed': 'Most Viewed',
  'search.placeholder': 'Search power sector news...',
  'search.resultsFor': '{count} results for “{query}”',
  'search.publishedCount': '{count} published articles',
  'search.noResults': 'No articles match your search.',
  'carousel.noFeatured': 'No featured stories currently available.',
  'carousel.readStory': 'Read story',
  'carousel.previous': 'Previous story',
  'carousel.next': 'Next story',
  'carousel.pause': 'Pause carousel',
  'carousel.play': 'Play carousel',
  'carousel.browseAll': 'Browse all news',
  'carousel.byAuthor': 'By {author}',
  'carousel.minRead': '{minutes} min read',
  'carousel.storiesMarkets': 'Stories & markets',
  'placement.featured': 'Featured',
  'placement.breaking': 'Breaking',
  'placement.pinned': 'Pinned',
  'interviews.kicker': 'In conversation',
  'interviews.title': 'Latest Interviews',
  'interviews.watchAll': 'Watch all on YouTube',
  'interviews.close': 'Close interview player',
  'interviews.noVideo': 'This interview does not have a valid YouTube video ID yet.',
  'interviews.watchFull': 'Watch the full conversation on our YouTube channel.',
  'member.loading': 'Loading member access…',
  'member.guestPitch':
    'Sign in to save articles and magazine issues, download data packages, join discussions, and unlock in-depth analysis across the power sector.',
  'member.login': 'Member login',
  'member.staffNote': 'Editorial staff and administrators use the same sign-in with assigned roles.',
  'member.signedInMember':
    "You're signed in as {name}. Open your library for saved articles, magazine archive, downloads, and comments.",
  'member.signedInStaff':
    'Signed in as {name} (staff). Member library is for subscriber accounts — use your staff workspace for editorial tools.',
  'member.manageAccount': 'Manage your account from the library → Account section.',
  'member.staffSignIn': 'Staff sign in',
  'energy.simulated': 'Simulated telemetry (dev)',
  'energy.indicative': 'Indicative snapshot',
};

const BN: Record<MessageKey, string> = {
  'nav.home': 'হোম',
  'nav.latest': 'সর্বশেষ',
  'nav.gridExplorer': 'গ্রিড এক্সপ্লোরার',
  'nav.magazine': 'ম্যাগাজিন',
  'nav.search': 'অনুসন্ধান',
  'nav.latestNews': 'সর্বশেষ সংবাদ',
  'nav.monthlyMagazine': 'মাসিক ম্যাগাজিন',
  'nav.searchArticles': 'নিবন্ধ অনুসন্ধান',
  'footer.editorialOffice': 'সম্পাদকীয় ও অফিস',
  'footer.editorPublisher': 'সম্পাদক ও প্রকাশক',
  'footer.email': 'ই-মেইল',
  'footer.officeAddress': 'অফিসের ঠিকানা',
  'footer.advertising': 'বিজ্ঞাপন বিভাগ',
  'footer.officialChannels': 'অফিসিয়াল চ্যানেল',
  'footer.explore': 'অন্বেষণ',
  'footer.sectors': 'খাতসমূহ',
  'footer.members': 'সদস্য',
  'footer.latestNews': 'সর্বশেষ সংবাদ',
  'footer.allCategories': 'সব বিভাগ',
  'footer.monthlyMagazine': 'মাসিক ম্যাগাজিন',
  'footer.gridExplorer': 'গ্রিড এক্সপ্লোরার',
  'footer.search': 'অনুসন্ধান',
  'footer.copyright': '© {year} ইএসবি পাওয়ারলাইন। সর্বস্বত্ব সংরক্ষিত।',
  'footer.tagline':
    'ইউটিলিটি, নিয়ন্ত্রক, আইপিপি, বিনিয়োগকারী ও নীতিনির্ধারকদের জন্য নির্ভরযোগ্য কভারেজ।',
  'footer.about': 'আমাদের সম্পর্কে',
  'footer.contact': 'যোগাযোগ',
  'footer.backToTop': 'উপরে যান',
  'brand.kicker': 'নিউজ পোর্টাল ও ম্যাগাজিন',
  'brand.lede':
    '{portal} এবং {magazine} — উৎপাদন ও গ্রিড থেকে নীতি ও প্রকল্প পর্যন্ত দৈনিক রিপোর্টিং, খাতভিত্তিক তথ্য ও বিশ্লেষণ।',
  'brand.ledeEmPortal': 'বাংলাদেশের বিদ্যুৎ খাতের নিউজ পোর্টাল',
  'brand.ledeEmMagazine': 'ইএসবি পাওয়ারলাইন মাসিক ম্যাগাজিন',
  'home.systemSnapshot': 'সিস্টেম স্ন্যাপশট',
  'home.powerSector': 'বিদ্যুৎ খাত',
  'home.powerSectorSub': 'সব খাতের কভারেজ দেখুন অথবা নির্দিষ্ট একটি খাত বেছে নিন।',
  'coverage.title': 'বিদ্যুৎ খাতের কভারেজ',
  'coverage.allCoverage': 'সমগ্র কভারেজ',
  'coverage.allDescription': 'সব {count}টি বিদ্যুৎ খাতের সর্বশেষ প্রতিবেদন।',
  'coverage.categoryDescription': 'সর্বশেষ {category} সংবাদ ও বিশ্লেষণ।',
  'coverage.browseArchive': 'সম্পূর্ণ আর্কাইভ দেখুন',
  'coverage.oneCategory': '১টি বিভাগ',
  'coverage.nCategories': '{count}টি বিভাগ',
  'coverage.noArticles': 'এই বিভাগে সাম্প্রতিক কোনো নিবন্ধ নেই।',
  'coverage.viewAllIn': '{label} — সব দেখুন',
  'categories.title': 'বিদ্যুৎ খাতের বিভাগসমূহ',
  'categories.subtitle':
    'বাংলাদেশের শক্তি মূল্যশৃঙ্খল জুড়ে কেন্দ্রীভূত কভারেজ। নিবেদিত প্রতিবেদন, বিশ্লেষণ ও তথ্যের জন্য যেকোনো খাতে ক্লিক করুন।',
  'categories.articles': '{count}টি নিবন্ধ',
  'categories.empty': 'এখনও কোনো বিভাগ কনফিগার করা হয়নি।',
  'categories.footer': '{count}টি খাত • দৈনিক আপডেট • গভীর বিশ্লেষণ ও প্রকল্প ট্র্যাকার',
  'categories.allCategories': '← সব বিভাগ',
  'categories.latestAnalysis': 'এই খাতের সর্বশেষ বিশ্লেষণ, প্রকল্প ও নীতি আপডেট।',
  'categories.noPublished': 'এই বিভাগে এখনও প্রকাশিত নিবন্ধ নেই। শীঘ্রই আবার দেখুন।',
  'articles.title': 'সর্বশেষ সংবাদ',
  'articles.subtitle': 'বাংলাদেশের বিদ্যুৎ ও শক্তি খাতের কভারেজ',
  'articles.advancedSearch': 'উন্নত অনুসন্ধান',
  'articles.allCategories': 'সব বিভাগ',
  'articles.filterBy': 'বিভাগ অনুযায়ী ফিল্টার',
  'articles.showing': 'দেখানো হচ্ছে',
  'articles.of': 'এর মধ্যে',
  'articles.loadMore': 'আরও নিবন্ধ লোড করুন',
  'articles.trending': 'জনপ্রিয়',
  'search.title': 'অনুসন্ধান',
  'search.subtitle': 'প্রকাশিত শিরোনাম, সারাংশ ও বিভাগ থেকে অনুসন্ধান করুন।',
  'home.trendingWeek': 'এই সপ্তাহের জনপ্রিয়',
  'home.noTrending': 'এখনও কোনো জনপ্রিয় নিবন্ধ নেই।',
  'home.monthlyMagazine': 'মাসিক ম্যাগাজিন',
  'home.readIssue': '{label} সংখ্যা পড়ুন',
  'common.min': 'মিনিট',
  'common.views': 'ভিউ',
  'common.esbStaff': 'ইএসবি স্টাফ',
  'common.all': 'সব',
  'common.close': 'বন্ধ করুন',
  'locale.toggle': 'ভাষা',
  'ticker.energyMarkets': 'শক্তি বাজার',
  'ticker.dseLive': 'ডিএসই লাইভ',
  'ticker.live': 'লাইভ',
  'ticker.indicative': 'আনুমানিক',
  'sort.label': 'সাজান',
  'sort.latest': 'সর্বশেষ আগে',
  'sort.mostViewed': 'সর্বাধিক পঠিত',
  'search.placeholder': 'বিদ্যুৎ খাতের সংবাদ খুঁজুন...',
  'search.resultsFor': '“{query}” — {count}টি ফলাফল',
  'search.publishedCount': '{count}টি প্রকাশিত নিবন্ধ',
  'search.noResults': 'আপনার অনুসন্ধানের সাথে মিলে এমন নিবন্ধ নেই।',
  'carousel.noFeatured': 'এখন কোনো ফিচার্ড প্রতিবেদন নেই।',
  'carousel.readStory': 'প্রতিবেদন পড়ুন',
  'carousel.previous': 'আগের প্রতিবেদন',
  'carousel.next': 'পরের প্রতিবেদন',
  'carousel.pause': 'ক্যারোসেল বিরতি',
  'carousel.play': 'ক্যারোসেল চালু',
  'carousel.browseAll': 'সব সংবাদ দেখুন',
  'carousel.byAuthor': '{author}',
  'carousel.minRead': '{minutes} মিনিট পড়ার সময়',
  'carousel.storiesMarkets': 'প্রতিবেদন ও বাজার',
  'placement.featured': 'বিশেষ',
  'placement.breaking': 'ব্রেকিং',
  'placement.pinned': 'পিন করা',
  'interviews.kicker': 'সাক্ষাৎকার',
  'interviews.title': 'সর্বশেষ সাক্ষাৎকার',
  'interviews.watchAll': 'ইউটিউবে সব দেখুন',
  'interviews.close': 'সাক্ষাৎকার বন্ধ করুন',
  'interviews.noVideo': 'এই সাক্ষাৎকারের জন্য এখনও বৈধ ইউটিউব ভিডিও আইডি নেই।',
  'interviews.watchFull': 'সম্পূর্ণ আলোচনা আমাদের ইউটিউব চ্যানেলে দেখুন।',
  'member.loading': 'সদস্য অ্যাক্সেস লোড হচ্ছে…',
  'member.guestPitch':
    'নিবন্ধ ও ম্যাগাজিন সংরক্ষণ, ডেটা ডাউনলোড, আলোচনায় অংশ নেওয়া ও গভীর বিশ্লেষণের জন্য সাইন ইন করুন।',
  'member.login': 'সদস্য লগইন',
  'member.staffNote': 'সম্পাদকীয় স্টাফ ও অ্যাডমিন একই সাইন-ইন ব্যবহার করেন।',
  'member.signedInMember':
    'আপনি {name} হিসেবে সাইন ইন আছেন। সংরক্ষিত নিবন্ধ, ম্যাগাজিন, ডাউনলোড ও মন্তব্যের জন্য লাইব্রেরি খুলুন।',
  'member.signedInStaff':
    '{name} (স্টাফ) হিসেবে সাইন ইন। সদস্য লাইব্রেরি সাবস্ক্রাইবারদের জন্য — সম্পাদনার কাজ স্টাফ ওয়ার্কস্পেসে করুন।',
  'member.manageAccount': 'লাইব্রেরি → অ্যাকাউন্ট থেকে সেটিংস পরিচালনা করুন।',
  'member.staffSignIn': 'স্টাফ সাইন ইন',
  'energy.simulated': 'সিমুলেটেড টেলিমেট্রি (ডেভ)',
  'energy.indicative': 'আনুমানিক স্ন্যাপশট',
};

const MESSAGES: Record<SiteLocale, Record<MessageKey, string>> = { en: EN, bn: BN };

export function translate(
  locale: SiteLocale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  let text = MESSAGES[locale][key] ?? MESSAGES.en[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function createTranslator(locale: SiteLocale) {
  return (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
}