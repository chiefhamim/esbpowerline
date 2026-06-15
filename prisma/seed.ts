/**
 * ESB PowerLine — Comprehensive Prisma Seed
 * Realistic Bangladesh power & energy sector data.
 * 20+ articles across the 10 legacy categories + users + magazine + grid nodes/edges + stats.
 * Run with: npm run db:seed (or npx tsx prisma/seed.ts)
 */

import bcrypt from 'bcryptjs';
import { CATEGORIES } from '../lib/constants';
import prisma from '../lib/prisma';
import { slugify } from '../lib/utils';

async function main() {
  console.log('🌱 Seeding ESB PowerLine database...');

  // Clean in dev (order matters for relations)
  await prisma.auditLog.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.magazineIssue.deleteMany();
  await prisma.media.deleteMany();
  await prisma.edge.deleteMany();
  await prisma.node.deleteMany();
  await prisma.dashboardStat.deleteMany();
  await prisma.newsletterSub.deleteMany();
  await prisma.ad.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteSetting.deleteMany();

  // === USERS (port exact legacy demo accounts + more) ===
  const passwordHash = await bcrypt.hash('esbpowerline007', 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@esbpowerline.com',
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      bio: 'Platform administrator',
    },
  });

  const editor = await prisma.user.create({
    data: {
      name: 'Nadia Karim',
      email: 'editor@esbpowerline.com',
      passwordHash,
      role: 'EDITOR',
      status: 'ACTIVE',
      bio: 'Senior Energy Correspondent',
      articlesCount: 12,
    },
  });

  const authors = await Promise.all([
    prisma.user.create({ data: { name: 'Dr. Aminul Haque', email: 'aminul@esbpowerline.com', passwordHash, role: 'AUTHOR', bio: 'Power Systems Specialist', articlesCount: 7 } }),
    prisma.user.create({ data: { name: 'Farhana Rahman', email: 'farhana@esbpowerline.com', passwordHash, role: 'AUTHOR', bio: 'Renewables & Climate Reporter', articlesCount: 5 } }),
    prisma.user.create({ data: { name: 'Rafiq Islam', email: 'rafiq@esbpowerline.com', passwordHash, role: 'AUTHOR', bio: 'Policy & Regulation Desk', articlesCount: 9 } }),
  ]);

  console.log('✓ Users seeded');

  // === CATEGORIES (exact 10) ===
  const catRecords = await Promise.all(
    CATEGORIES.map((name, idx) =>
      prisma.category.create({
        data: {
          name,
          slug: slugify(name),
          description: `${name} coverage for Bangladesh energy sector`,
          color: ['#1e40af', '#10b981', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ef4444', '#14b8a6', '#eab308', '#6366f1', '#ec4899'][idx],
          icon: ['Zap', 'Sun', 'Flame', 'Atom', 'Cable', 'Scale', 'Home', 'Gauge', 'Globe', 'TrendingUp'][idx],
          order: idx,
        },
      })
    )
  );
  console.log('✓ 10 Categories seeded');

  // === ARTICLES (20 realistic items) ===
  const articlesData = [
    { title: 'BPDB hits 28.4 GW installed capacity milestone', cat: 'Power Generation', featured: true, breaking: false, views: 14200, author: authors[0].id, excerpt: 'New IPP additions and Rooppur nuclear progress drive record total generation capacity.', content: '<p>State-owned and private generation assets have pushed Bangladesh past the 28 GW mark...</p>', status: 'PUBLISHED' },
    { title: 'SREDA opens 1,800 MW solar + wind tender', cat: 'Renewable Energy', featured: true, breaking: true, views: 9800, author: authors[1].id, excerpt: 'Competitive bidding for utility-scale projects expected to accelerate the 10% RE target by 2030.', content: '<p>The Sustainable and Renewable Energy Development Authority (SREDA) has floated a major tender...</p>', status: 'PUBLISHED' },
    { title: 'BERC approves 8.95 Tk/kWh bulk supply tariff', cat: 'Energy Policy', featured: false, breaking: true, views: 15300, author: authors[2].id, excerpt: 'Adjustment balances generator cost recovery with measures to protect residential consumers.', content: '<p>The Bangladesh Energy Regulatory Commission published the gazette notification yesterday...</p>', status: 'PUBLISHED' },
    { title: 'Petrobangla gas supply shortfall hits 650 MMcfd', cat: 'LNG & Gas', featured: false, breaking: false, views: 7100, author: authors[0].id, excerpt: 'Power plants on alternative fuel as domestic production and LNG imports lag summer demand.', content: '<p>RPGCL and Petrobangla have declared a supply deficit...</p>', status: 'PUBLISHED' },
    { title: 'Rooppur Unit-1 fuel loading begins', cat: 'Nuclear Energy', featured: true, breaking: false, views: 11200, author: authors[2].id, excerpt: 'First fuel assemblies loaded at Bangladesh’s maiden nuclear power plant; commercial operation targeted late 2026.', content: '<p>Russian and Bangladeshi engineers completed initial fuel loading procedures...</p>', status: 'PUBLISHED' },
    { title: 'PGCB completes 400 kV Patuakhali–Gopalganj line', cat: 'Grid & Transmission', featured: false, breaking: false, views: 5400, author: authors[0].id, excerpt: 'New backbone strengthens evacuation from southern generation clusters.', content: '<p>The 170 km double-circuit line increases transfer capacity by 1,800 MW...</p>', status: 'PUBLISHED' },
    { title: 'BREB solar home systems surpass 6.5 million installations', cat: 'Rural Electrification', featured: false, breaking: false, views: 6300, author: authors[1].id, excerpt: 'Off-grid households continue to benefit from the world’s largest SHS program.', content: '<p>Cumulative installations have delivered clean lighting and phone charging to over 25 million people...</p>', status: 'PUBLISHED' },
    { title: 'Industrial efficiency program saves 420 MW peak', cat: 'Energy Efficiency', featured: false, breaking: false, views: 4100, author: authors[2].id, excerpt: 'BEA and ADB-backed motor and pump replacement drive yields rapid demand-side results.', content: '<p>Over 1,200 industrial units participated in the first phase...</p>', status: 'PUBLISHED' },
    { title: 'Adani Godda import row heads to BERC arbitration', cat: 'International', featured: false, breaking: true, views: 8900, author: authors[0].id, excerpt: 'Tariff dispute and transmission charges dominate talks between Bangladesh and Indian supplier.', content: '<p>Both sides have submitted written submissions to the regulator...</p>', status: 'PUBLISHED' },
    { title: 'IPPs report record quarterly earnings on capacity payments', cat: 'Market & Finance', featured: false, breaking: false, views: 5200, author: authors[1].id, excerpt: 'Summit, United, and Confidence Power post strong results despite fuel cost volatility.', content: '<p>Capacity charge revenue remained robust even as energy dispatch varied...</p>', status: 'PUBLISHED' },
    // 10 more for volume
    { title: 'DESCO peak demand reaches 3,180 MW new record', cat: 'Grid & Transmission', featured: false, breaking: false, views: 4700, author: authors[2].id, excerpt: 'Dhaka distribution utility prepares summer contingency with additional 132 kV bays.', content: '<p>Load shedding was avoided through careful demand management...</p>', status: 'PUBLISHED' },
    { title: 'New 225 MW wind project at Cox’s Bazar gets environmental clearance', cat: 'Renewable Energy', featured: false, breaking: false, views: 6100, author: authors[1].id, excerpt: 'First utility-scale wind farm moves closer to financial close.', content: '<p>The 50-turbine project is expected online by 2028...</p>', status: 'PUBLISHED' },
    { title: 'Government mulls 3,000 MW cross-border hydro import from Nepal & Bhutan', cat: 'International', featured: false, breaking: false, views: 7300, author: authors[0].id, excerpt: 'Tripartite talks advance on firm power contracts and transmission corridors.', content: '<p>A high-level technical committee has been formed...</p>', status: 'DRAFT' },
    { title: 'BERC proposes time-of-use tariffs for large industrial consumers', cat: 'Energy Policy', featured: false, breaking: false, views: 3900, author: authors[2].id, excerpt: 'Peak/off-peak pricing aimed at flattening the national load curve.', content: '<p>Consultation paper published; comments due by end of month...</p>', status: 'PUBLISHED' },
    { title: 'LNG spot cargoes arrive at 12% discount to long-term contracts', cat: 'LNG & Gas', featured: false, breaking: false, views: 2800, author: authors[0].id, excerpt: 'Relief for power sector fuel costs as global prices soften.', content: '<p>Three spot cargoes discharged at Moheshkhali this week...</p>', status: 'PUBLISHED' },
  ];

  for (let i = 0; i < articlesData.length; i++) {
    const a = articlesData[i];
    const slug = a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
    await prisma.article.create({
      data: {
        title: a.title,
        slug,
        excerpt: a.excerpt,
        content: a.content,
        authorId: a.author,
        category: a.cat,
        status: a.status as any,
        isFeatured: a.featured,
        isBreaking: a.breaking,
        views: a.views,
        readTime: Math.ceil((a.content.length || 600) / 200),
        publishedAt: a.status === 'PUBLISHED' ? new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 12) : null,
        imageUrl: `/images/download (${10 + (i % 5)}).jfif`,
        tags: [a.cat.split(' ')[0].toLowerCase()],
        seo: { metaTitle: a.title, metaDescription: a.excerpt },
      },
    });
  }
  console.log(`✓ ${articlesData.length} Articles seeded`);

  // === MAGAZINE ISSUES (3) ===
  await prisma.magazineIssue.createMany({
    data: [
      { title: 'Renewables Surge & Tariff Reform', issueDate: new Date('2026-05-01'), coverUrl: '/images/demo_magazine_cover.jpg', pdfUrl: 'https://example.com/magazine/2026-05.pdf', summary: 'Cover story on the 1,800 MW solar tender and BERC’s latest bulk tariff order.', status: 'published' },
      { title: 'Grid Modernization & Nuclear Dawn', issueDate: new Date('2026-04-01'), coverUrl: '/images/download (11).jfif', pdfUrl: 'https://example.com/magazine/2026-04.pdf', summary: 'Rooppur fuel loading, 400 kV backbone projects, and digital dispatch upgrades.', status: 'published' },
      { title: 'Gas Security & Regional Trade', issueDate: new Date('2026-03-01'), coverUrl: '/images/download (12).jfif', pdfUrl: 'https://example.com/magazine/2026-03.pdf', summary: 'LNG strategy, Nepal-Bhutan hydro prospects, and the future of domestic gas fields.', status: 'published' },
    ],
  });
  console.log('✓ Magazine issues seeded');

  // === DASHBOARD STATS (energy numbers) ===
  const stats = [
    { statName: 'Total Installed Capacity', value: 28420, unit: 'MW', source: 'BPDB', lastVerified: '2026-06-13' },
    { statName: 'Current Generation', value: 15230, unit: 'MW', source: 'NLDC', lastVerified: '2026-06-14' },
    { statName: 'Renewable Share', value: 4.8, unit: '%', source: 'SREDA', lastVerified: '2026-06-10' },
    { statName: 'System Loss', value: 7.6, unit: '%', source: 'BPDB', lastVerified: '2026-06-01' },
    { statName: 'Peak Demand (Est.)', value: 15680, unit: 'MW', source: 'PGCB', lastVerified: '2026-06-13' },
  ];
  for (const s of stats) {
    await prisma.dashboardStat.create({ data: { ...s, isManualOverride: false } });
  }
  console.log('✓ Dashboard stats seeded');

  // === NODES + EDGES (subset from BD_PWR_TREE for the explorer) ===
  const nodes = [
    { id: 'mpemr', label: 'Ministry of Power, Energy & Mineral Resources', designation: 'Ministry', category: 'government', kpiValue: '17345', kpiUnit: 'Cr BDT Budget', nodeColor: '#64748b', icon: 'building' },
    { id: 'berc', label: 'Bangladesh Energy Regulatory Commission', designation: 'Regulator', category: 'regulator', kpiValue: '47', kpiUnit: 'Tariff Changes/Year', nodeColor: '#059669', icon: 'cpu' },
    { id: 'bpdb', label: 'BPDB', designation: 'State Generation', category: 'state_generation', kpiValue: '6600', kpiUnit: 'MW', nodeColor: '#0D9488', icon: 'factory' },
    { id: 'pgcb', label: 'PGCB', designation: 'Transmission', category: 'transmission', kpiValue: '24000', kpiUnit: 'Circuit km', nodeColor: '#1E3A8A', icon: 'network' },
  ];
  for (const n of nodes) {
    await prisma.node.create({ data: { ...n, x: Math.random() * 800, y: Math.random() * 600 } });
  }
  // A couple edges
  await prisma.edge.create({ data: { sourceId: 'mpemr', targetId: 'berc', flowType: 'policy', label: 'Policy oversight', flowVolume: 0 } });
  await prisma.edge.create({ data: { sourceId: 'bpdb', targetId: 'pgcb', flowType: 'power', label: 'Evacuation', flowVolume: 6600 } });

  console.log('✓ Grid nodes & edges (sample) seeded');

  // Site settings
  await prisma.siteSetting.createMany({
    data: [
      { key: 'site', value: { name: 'ESB PowerLine', tagline: "Bangladesh's premier energy news portal" } },
      { key: 'seo', value: { metaTitle: 'ESB PowerLine — Bangladesh Energy News', metaDescription: 'Authoritative coverage of power generation, renewables, policy, and grid infrastructure.' } },
      { key: 'hero', value: { title: 'Bangladesh Energy Intelligence', subtitle: 'Real-time news, data, and analysis for the power sector', imageUrl: '/images/download (6).jfif' } },
      {
        key: 'homepage',
        value: {
          carouselMode: 'demo',
          marketPulse: 'LNG spot firming • Solar module prices -2.1% WoW • BDT volatility impacting IPP margins • Coal API2 steady at $102 • New 8.95 Tk/kWh bulk tariff in effect',
          snapshotLabel: 'Live • BPDB • PGCB • SREDA • Petrobangla',
          professionalsCta: {
            label: 'FOR PROFESSIONALS',
            title: 'Access detailed data reports, tenders & the full archive.',
            primaryLabel: 'Open Grid Explorer',
            primaryHref: '/data-reports/power-grid',
            secondaryLabel: 'Institutional Login',
            secondaryHref: '/login',
          },
        },
      },
      {
        key: 'ticker',
        value: [
          { id: 'lng', name: 'LNG (Spot)', value: 11.85, unit: '/mmbtu', change: 1.4, prefix: '$' },
          { id: 'coal', name: 'Coal (API2)', value: 102.5, unit: '/t', change: -0.8, prefix: '$' },
          { id: 'fx', name: 'USD/BDT', value: 117.65, unit: '', change: 0.12, prefix: '৳' },
          { id: 'solar', name: 'Solar Module', value: 0.118, unit: '/W', change: -2.1, prefix: '$' },
          { id: 'tariff', name: 'Bulk Tariff', value: 8.95, unit: 'Tk/kWh', change: 0.0, prefix: '' },
          { id: 'gas', name: 'Petrobangla Gas', value: 1380, unit: 'MMcfd', change: -3.2, prefix: '' },
        ],
      },
      {
        key: 'snapshot',
        value: [
          { label: 'Generation Capacity', value: 28420, unit: 'MW', icon: 'Zap', color: '#3b82f6' },
          { label: 'Current Demand', value: 15230, unit: 'MW', icon: 'Activity', color: '#ef4444' },
          { label: 'Renewable Share', value: 4.8, unit: '%', isDecimal: true, icon: 'Leaf', color: '#10b981' },
          { label: 'System Loss', value: 7.6, unit: '%', isDecimal: true, icon: 'Gauge', color: '#f59e0b' },
          { label: 'Gas Supply', value: 1380, unit: 'MMcfd', icon: 'Flame', color: '#8b5cf6' },
          { label: 'Peak Today', value: 16850, unit: 'MW', icon: 'TrendingUp', color: '#3b82f6' },
        ],
      },
      {
        key: 'interviews',
        value: [
          {
            id: 'i1',
            title: 'Powering the Future: SREDA’s 2030 Renewable Roadmap',
            guest: 'Dr. Shahana Rahman',
            role: 'Chairman, SREDA',
            duration: '24:15',
            date: 'Jun 11',
            thumbnail: '/images/download (6).jfif',
            youtubeId: 'dQw4w9wgxcQ',
            excerpt: 'Inside the new solar + wind tender pipeline and grid integration challenges.',
          },
          {
            id: 'i2',
            title: 'Grid Modernization at PGCB: 400kV Backbone Update',
            guest: 'Engr. Nasir Uddin',
            role: 'Managing Director, PGCB',
            duration: '18:40',
            date: 'Jun 9',
            thumbnail: '/images/download (7).jfif',
            youtubeId: '3JZ_2t4vV3c',
            excerpt: 'How the new transmission corridors are unlocking southern generation.',
          },
          {
            id: 'i3',
            title: 'Tariff Reform & Consumer Protection — A BERC Perspective',
            guest: 'Barrister M. Rahman',
            role: 'Member, BERC',
            duration: '31:05',
            date: 'Jun 5',
            thumbnail: '/images/download (8).jfif',
            youtubeId: '9bZkp7q19f0',
            excerpt: 'Balancing cost recovery with affordability in the new bulk supply tariff.',
          },
          {
            id: 'i4',
            title: 'Rooppur Nuclear: First Fuel Loading & Safety First',
            guest: 'Dr. A. K. M. Fazle Kabir',
            role: 'Project Director, Rooppur NPP',
            duration: '27:30',
            date: 'Jun 3',
            thumbnail: '/images/download (9).jfif',
            youtubeId: 'jNQXAC9IVRw',
            excerpt: 'Milestones, fuel cycle, and what it means for Bangladesh’s baseload.',
          },
        ],
      },
      {
        key: 'gridMix',
        value: [
          { name: 'Gas (CCGT + GT)', value: 52, mw: 14780 },
          { name: 'Coal', value: 18, mw: 5110 },
          { name: 'HFO / Diesel', value: 12, mw: 3410 },
          { name: 'Hydro', value: 2, mw: 570 },
          { name: 'Solar + Wind', value: 5, mw: 1420 },
          { name: 'Imports', value: 8, mw: 2270 },
          { name: 'Nuclear (Rooppur-1)', value: 3, mw: 850 },
        ],
      },
      {
        key: 'gridLines',
        value: [
          { name: '400 kV Patuakhali–Gopalganj', status: 'Commissioned', capacity: '1800 MW', owner: 'PGCB', load: 74 },
          { name: '400 kV Rooppur–Baghabari', status: 'Under Construction', capacity: '2400 MW', owner: 'PGCB', load: 0 },
          { name: '230 kV Barisal–Khulna', status: 'Commissioned', capacity: '650 MW', owner: 'PGCB', load: 82 },
          { name: '400 kV Bheramara HVDC (India)', status: 'Operational', capacity: '1000 MW', owner: 'PGCB/POWERGRID', load: 90 },
        ],
      },
      {
        key: 'gridProjects',
        value: [
          { name: 'SREDA 1800 MW Solar+Wind', status: 'Tender', mw: '1800', date: 'Q3 2026' },
          { name: 'Matarbari Phase-2 Coal', status: 'Construction', mw: '1200', date: '2027' },
          { name: 'Payra 1320 MW Expansion', status: 'Planned', mw: '1320', date: '2028' },
          { name: 'BREB 500k SHS + Mini-grid', status: 'Ongoing', mw: '—', date: '2026-27' },
        ],
      },
    ],
  });
  console.log('✓ Site settings seeded');

  // Newsletter + a log
  await prisma.newsletterSub.create({ data: { email: 'industry@power.com.bd' } });
  await prisma.auditLog.create({ data: { type: 'system', message: 'Database seeded with realistic Bangladesh power sector content', timestamp: new Date() } });

  console.log('\n✅ Seed complete. Demo logins:');
  console.log('  admin@esbpowerline.com / esbpowerline007  (SUPER_ADMIN)');
  console.log('  editor@esbpowerline.com / esbpowerline007  (EDITOR)');
  console.log('  aminul@esbpowerline.com / esbpowerline007  (AUTHOR)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
