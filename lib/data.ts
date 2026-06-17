import { CATEGORIES } from './constants';

export type DemoArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  views: number;
  imageUrl: string;
  tags: string[];
  isFeatured?: boolean;
  isBreaking?: boolean;
};

export const demoArticles: DemoArticle[] = [
  {
    id: 'a1',
    slug: 'bpdb-hits-284-gw-installed-capacity-milestone',
    title: 'BPDB hits 28.4 GW installed capacity milestone',
    excerpt: 'New IPP additions and Rooppur nuclear progress drive record total generation capacity.',
    content: '<p>State-owned and private generation assets have pushed Bangladesh past the 28 GW mark for the first time. The milestone was reached after the synchronization of two new combined-cycle plants in the south and the addition of utility-scale solar from the first tranche of the SREDA tender.</p><p>Officials at BPDB noted that the summer peak is now being met with a comfortable reserve margin for the first time in three years.</p>',
    category: 'Power Generation',
    author: 'Dr. Aminul Haque',
    date: '2026-06-10',
    readTime: 6,
    views: 14200,
    imageUrl: '/images/download (10).jfif',
    tags: ['bpdb', 'capacity', 'generation'],
    isFeatured: true,
  },
  {
    id: 'a2',
    slug: 'sreda-launches-1800-mw-solar-tender',
    title: 'SREDA launches 1,800 MW solar + wind tender for Q3 2026',
    excerpt: 'Competitive bidding expected to accelerate renewable share toward 10% target by 2030.',
    content: '<p>The Sustainable and Renewable Energy Development Authority (SREDA) has issued the long-awaited Request for Proposal for 1,200 MW solar and 600 MW wind.</p>',
    category: 'Renewables & Nuclear',
    author: 'Farhana Rahman',
    date: '2026-06-12',
    readTime: 4,
    views: 9800,
    imageUrl: '/images/download (11).jfif',
    tags: ['sreda', 'solar', 'tender'],
    isFeatured: true,
    isBreaking: true,
  },
  {
    id: 'a3',
    slug: 'berc-approves-895-tk-kwh-bulk-supply-tariff',
    title: 'BERC approves 8.95 Tk/kWh bulk supply tariff adjustment',
    excerpt: 'New rates balance cost recovery for generators with consumer protection measures.',
    content: '<p>The Bangladesh Energy Regulatory Commission published the gazette notification for the revised bulk tariff.</p>',
    category: 'Energy Policy & Regulators',
    author: 'Rafiq Islam',
    date: '2026-06-11',
    readTime: 7,
    views: 15300,
    imageUrl: '/images/download (12).jfif',
    tags: ['berc', 'tariff', 'policy'],
  },
  {
    id: 'a4',
    slug: 'petrobangla-gas-supply-shortfall',
    title: 'Petrobangla gas supply shortfall hits 650 MMcfd amid summer demand',
    excerpt: 'Power plants on alternative fuel as domestic production and LNG imports lag.',
    content: '<p>RPGCL and Petrobangla have declared a supply deficit impacting several gas-fired plants.</p>',
    category: 'Fossil Fuels & Commodities',
    author: 'Dr. Aminul Haque',
    date: '2026-06-09',
    readTime: 5,
    views: 7100,
    imageUrl: '/images/download (13).jfif',
    tags: ['gas', 'petrobangla', 'lng'],
  },
  {
    id: 'a5',
    slug: 'rooppur-unit-1-fuel-loading',
    title: 'Rooppur Unit-1 fuel loading begins — first nuclear fuel in Bangladesh',
    excerpt: 'First fuel assemblies loaded at Bangladesh’s maiden nuclear power plant.',
    content: '<p>Russian and Bangladeshi engineers completed initial fuel loading procedures at Rooppur.</p>',
    category: 'Renewables & Nuclear',
    author: 'Rafiq Islam',
    date: '2026-06-08',
    readTime: 8,
    views: 11200,
    imageUrl: '/images/download (14).jfif',
    tags: ['nuclear', 'rooppur', 'power'],
    isFeatured: true,
  },
  {
    id: 'a6',
    slug: 'pgcb-400kv-line-commissioned',
    title: 'PGCB commissions 400 kV Patuakhali–Gopalganj transmission line',
    excerpt: 'New backbone strengthens evacuation from southern generation clusters by 1,800 MW.',
    content: '<p>The 170 km double-circuit line increases transfer capacity significantly.</p>',
    category: 'Grid & Transmission',
    author: 'Farhana Rahman',
    date: '2026-06-07',
    readTime: 4,
    views: 5400,
    imageUrl: '/images/download (10).jfif',
    tags: ['pgcb', 'transmission', 'grid'],
  },
  // Add more for good listing
  {
    id: 'a7',
    slug: 'breb-solar-home-systems-milestone',
    title: 'BREB solar home systems surpass 6.5 million installations',
    excerpt: 'Off-grid households continue to benefit from the world’s largest SHS program.',
    content: '<p>Cumulative installations have delivered clean lighting to over 25 million people.</p>',
    category: 'Distribution & Utilities',
    author: 'Dr. Aminul Haque',
    date: '2026-06-05',
    readTime: 3,
    views: 6300,
    imageUrl: '/images/download (11).jfif',
    tags: ['rural', 'solar', 'breb'],
  },
  {
    id: 'a8',
    slug: 'industrial-efficiency-saves-peak-demand',
    title: 'Industrial efficiency program saves 420 MW peak demand',
    excerpt: 'BEA and ADB-backed motor and pump replacement drive yields rapid results.',
    content: '<p>Over 1,200 industrial units participated in the first phase of the efficiency program.</p>',
    category: 'Environment & Efficiency',
    author: 'Farhana Rahman',
    date: '2026-06-04',
    readTime: 4,
    views: 4100,
    imageUrl: '/images/download (12).jfif',
    tags: ['efficiency', 'industry', 'demand'],
  },
  {
    id: 'a9',
    slug: 'adani-godda-tariff-dispute',
    title: 'Adani Godda import row heads to BERC arbitration',
    excerpt: 'Tariff dispute and transmission charges dominate talks between Bangladesh and Indian supplier.',
    content: '<p>Both sides have submitted written submissions to the regulator for resolution.</p>',
    category: 'International & Cross-Border',
    author: 'Rafiq Islam',
    date: '2026-06-03',
    readTime: 6,
    views: 8900,
    imageUrl: '/images/download (13).jfif',
    tags: ['import', 'adani', 'international'],
    isBreaking: true,
  },
  {
    id: 'a10',
    slug: 'ipps-record-quarterly-earnings',
    title: 'IPPs report record quarterly earnings on capacity payments',
    excerpt: 'Summit, United, and Confidence Power post strong results despite fuel cost volatility.',
    content: '<p>Capacity charge revenue remained robust even as energy dispatch varied with demand.</p>',
    category: 'Market, Finance & Subsidies',
    author: 'Dr. Aminul Haque',
    date: '2026-06-02',
    readTime: 5,
    views: 5200,
    imageUrl: '/images/download (14).jfif',
    tags: ['ipp', 'finance', 'earnings'],
  },
];

export const getPublishedArticles = () => demoArticles;

export const getArticleBySlug = (slug: string) => demoArticles.find(a => a.slug === slug);

export const getArticlesByCategory = (category: string) => 
  demoArticles.filter(a => a.category.toLowerCase() === category.toLowerCase().replace(/-/g, ' '));

export const getFeaturedArticles = () => demoArticles.filter(a => a.isFeatured);

export const getTrendingArticles = (limit = 5) => 
  [...demoArticles].sort((a, b) => b.views - a.views).slice(0, limit);

export const getLatestMagazine = () => ({
  id: 'm1',
  title: 'Renewables Surge & Tariff Reform — June 2026',
  issueDate: '2026-06-01',
  coverUrl: '/images/demo_magazine_cover.jpg',
  summary: 'In-depth analysis of the latest solar + wind pipeline, cross-border power trade, and BERC tariff reform.',
});
