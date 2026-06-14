/** Client-safe homepage defaults — no Prisma/Node imports */

export const HOMEPAGE_DEFAULTS = {
  marketPulse:
    'LNG spot firming • Solar module prices -2.1% WoW • BDT volatility impacting IPP margins • Coal API2 steady at $102 • New 8.95 Tk/kWh bulk tariff in effect',
  snapshotLabel: 'Live • BPDB • PGCB • SREDA • Petrobangla',
  professionalsCta: {
    label: 'FOR PROFESSIONALS',
    title: 'Access detailed data reports, tenders & the full archive.',
    primaryLabel: 'Open Grid Explorer',
    primaryHref: '/data-reports/power-grid',
    secondaryLabel: 'Institutional Login',
    secondaryHref: '/login',
  },
  magazineCtaTemplate: 'Read {month} {year} Issue',
};

export type CarouselItem = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  readTime: number;
  category: string;
  isBreaking?: boolean;
};