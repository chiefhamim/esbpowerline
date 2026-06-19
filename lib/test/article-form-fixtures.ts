import type { ArticleSubmitPayload } from '@/lib/test/mockArticleSubmit';
import { CATEGORIES } from '@/lib/constants';

export const VALID_DRAFT_PAYLOAD: ArticleSubmitPayload = {
  title: 'Draft: PGCB corridor upgrade briefing',
  slug: 'draft-pgcb-corridor-upgrade-briefing',
  excerpt: 'Internal notes on the Sylhet 400kV line commissioning timeline.',
  content: '<p>Commissioning is scheduled for Q3 2026 pending final load tests.</p>',
  category: CATEGORIES[4],
  status: 'DRAFT',
  imageUrl: 'https://cdn.esbpowerline.test/media/pgcb-corridor.jpg',
  tags: ['pgcb', 'transmission'],
  isFeatured: false,
  isBreaking: false,
  isPinned: false,
  publishedAt: null,
  seo: {
    metaTitle: 'PGCB corridor upgrade',
    metaDescription: 'Sylhet 400kV commissioning timeline',
    focusKeyword: 'PGCB transmission',
    heroImage: { alt: 'High-voltage towers at dusk', filter: 'none', fitMode: 'fit' },
  },
};

export const VALID_PUBLISH_PAYLOAD: ArticleSubmitPayload = {
  title: 'BERC approves revised bulk tariff for FY2026',
  slug: 'berc-approves-revised-bulk-tariff-fy2026',
  excerpt: 'The regulator signed off on a 4.2% average increase for industrial consumers.',
  content: '<p>The Bangladesh Energy Regulatory Commission published its order Thursday.</p><p>Industrial users face the steepest adjustment.</p>',
  category: CATEGORIES[0],
  status: 'PUBLISHED',
  imageUrl: 'https://cdn.esbpowerline.test/media/berc-hearing.jpg',
  tags: ['berc', 'tariff', 'policy'],
  isFeatured: true,
  isBreaking: false,
  isPinned: false,
  publishedAt: '2026-06-19T06:00:00.000Z',
  seo: {
    metaTitle: 'BERC bulk tariff FY2026',
    metaDescription: 'Regulator approves revised bulk electricity pricing',
    focusKeyword: 'BERC tariff',
    heroImage: { caption: 'BERC public hearing', alt: 'Regulators at hearing table', filter: 'warm', fitMode: 'fill', zoom: 110 },
  },
};

export const INVALID_PUBLISH_PAYLOAD: ArticleSubmitPayload = {
  title: 'X',
  slug: 'x',
  excerpt: '',
  content: '<p></p>',
  category: '',
  status: 'PUBLISHED',
  tags: [],
  isFeatured: false,
  isBreaking: false,
  isPinned: false,
};