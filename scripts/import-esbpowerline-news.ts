/**
 * Import the latest 20 articles from esbpowerline.com (WordPress REST API)
 * into the Prisma database. Removes existing demo articles, keeps categories/users.
 *
 * Usage (production):
 *   ALLOW_PRODUCTION_SEED=true npx tsx scripts/import-esbpowerline-news.ts
 *
 * Requires DATABASE_URL (+ DIRECT_URL for migrations). Loads .env.production.local when present.
 */
import { config, parse } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import type { PrismaClient } from '@prisma/client';
import { CATEGORIES, CATEGORY_DETAILS } from '../lib/constants';
import { EDITOR_EMAIL, EDITOR_NAME } from '../lib/staff-accounts';
import { slugify } from '../lib/utils';

/** Preserve npm/cross-env targets — .env.production.local can contain empty placeholders. */
const cliProvider = process.env.PRISMA_SCHEMA_PROVIDER?.trim() || '';
const cliDatabaseUrl = process.env.DATABASE_URL?.trim() || '';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });
if (existsSync('.env.production.local') && cliProvider !== 'sqlite') {
  config({ path: '.env.production.local', override: true });
}
if (cliProvider) process.env.PRISMA_SCHEMA_PROVIDER = cliProvider;
if (cliDatabaseUrl) process.env.DATABASE_URL = cliDatabaseUrl;

function toPostgresqlUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return '';
  return value.replace(/^postgres:\/\//, 'postgresql://');
}

function readEnvValue(file: string, key: string): string {
  if (!existsSync(file)) return '';
  try {
    return parse(readFileSync(file))[key]?.trim() ?? '';
  } catch {
    return '';
  }
}

const schemaProvider = process.env.PRISMA_SCHEMA_PROVIDER?.trim() || 'postgresql';
process.env.PRISMA_SCHEMA_PROVIDER = schemaProvider;

if (schemaProvider === 'sqlite') {
  const sqliteUrl = process.env.DATABASE_URL?.trim();
  process.env.DATABASE_URL =
    sqliteUrl && sqliteUrl.startsWith('file:') ? sqliteUrl : 'file:./dev.db';
} else {
  if (!process.env.DATABASE_URL?.trim()) {
    process.env.DATABASE_URL = toPostgresqlUrl(
      process.env.POSTGRES_PRISMA_URL ||
        readEnvValue('.env.local', 'POSTGRES_PRISMA_URL') ||
        readEnvValue('.env', 'POSTGRES_PRISMA_URL'),
    );
  }
  if (!process.env.DIRECT_URL?.trim()) {
    process.env.DIRECT_URL = toPostgresqlUrl(
      process.env.POSTGRES_URL_NON_POOLING ||
        readEnvValue('.env.local', 'POSTGRES_URL_NON_POOLING') ||
        readEnvValue('.env', 'POSTGRES_URL_NON_POOLING'),
    );
  }
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error('❌ DATABASE_URL is not set. Add POSTGRES_PRISMA_URL to .env.local or DATABASE_URL to .env.production.local');
  process.exit(1);
}

const WP_BASE = 'https://esbpowerline.com/wp-json/wp/v2';
const POST_COUNT = 20;


/** WordPress category slug → app category name */
const WP_CATEGORY_MAP: Record<string, (typeof CATEGORIES)[number]> = {
  'power-generation': 'Power Generation',
  'renewable-energy': 'Renewables & Nuclear',
  'renewable-energy-focus': 'Renewables & Nuclear',
  'nuclear-energy': 'Renewables & Nuclear',
  'energy-storage': 'Renewables & Nuclear',
  lng: 'Fossil Fuels & Commodities',
  'oil-gas': 'Fossil Fuels & Commodities',
  transmission: 'Grid & Transmission',
  'smart-grid': 'Grid & Transmission',
  distribution: 'Distribution & Utilities',
  policy: 'Energy Policy & Regulators',
  'data-reports': 'Consumers & Tariffs',
  'finance-investment': 'Market, Finance & Subsidies',
  'market-investment-updates': 'Market, Finance & Subsidies',
  'global-energy-update': 'International & Cross-Border',
  'industry-news': 'Power Generation',
  'industry-insights': 'Power Generation',
  'energy-efficiency': 'Environment & Efficiency',
  projects: 'Power Generation',
  news: 'Power Generation',
  uncategorized: 'Power Generation',
  // Bengali "Electricity & Energy" slug (URL-encoded and decoded)
  '%e0%a6%ac%e0%a6%bf%e0%a6%a6%e0%a7%8d%e0%a6%af%e0%a7%81%e0%a7%8e-%e0%a6%93-%e0%a6%9c%e0%a7%8d%e0%a6%ac%e0%a6%be%e0%a6%b2%e0%a6%be%e0%a6%a8%e0%a6%bf':
    'Consumers & Tariffs',
  'বিদ্যুৎ-ও-জ্বালানি': 'Consumers & Tariffs',
};

/** Prefer editorial categories over generic labels when a post has multiple WP cats */
const WP_CATEGORY_PRIORITY: Record<string, number> = {
  'data-reports': 10,
  'consumers-tariffs': 10,
  lng: 9,
  'oil-gas': 9,
  'renewable-energy': 9,
  'power-generation': 8,
  policy: 8,
  'smart-grid': 7,
  transmission: 7,
  'global-energy-update': 6,
  'energy-efficiency': 6,
  'industry-news': 2,
  news: 1,
  uncategorized: 0,
};

type WpPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: number[];
  featured_media: number;
};

type WpCategory = { id: number; slug: string; name: string };
type WpMedia = { source_url: string };

function decodeHtml(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function sanitizeContent(html: string): string {
  return html
    .replace(/<div[^>]*sharethis[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/\sdata-path-to-node="[^"]*"/gi, '')
    .replace(/\sdata-index-in-node="[^"]*"/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .trim();
}

/** Pull the first real editorial image from post HTML (WordPress uploads). */
function extractContentImage(html: string): string | null {
  const matches = html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  for (const match of matches) {
    const src = match[1]?.trim();
    if (!src) continue;
    if (src.includes('wp-content/uploads')) return src;
    if (src.startsWith('https://esbpowerline.com/')) return src;
  }
  return null;
}

function isDemoImage(url: string | null | undefined): boolean {
  if (!url?.trim()) return true;
  const u = url.trim().toLowerCase();
  return (
    u.startsWith('/images/') ||
    u.includes('/images/download') ||
    u.includes('placeholder') ||
    u.includes('demo_') ||
    u.includes('unsplash.com') ||
    u.includes('placehold')
  );
}

function normalizeSlug(raw: string): string {
  try {
    const decoded = decodeURIComponent(raw);
    const ascii = slugify(decoded);
    if (ascii.length >= 3) return ascii;
    return decoded.toLowerCase().replace(/\s+/g, '-');
  } catch {
    return slugify(raw);
  }
}

function estimateReadTime(content: string): number {
  const words = stripTags(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

async function fetchWpPosts(): Promise<WpPost[]> {
  return fetchJson<WpPost[]>(
    `${WP_BASE}/posts?per_page=${POST_COUNT}&orderby=date&order=desc&_embed=0`,
  );
}

async function fetchWpCategories(): Promise<Map<number, WpCategory>> {
  const cats = await fetchJson<WpCategory[]>(`${WP_BASE}/categories?per_page=100`);
  return new Map(cats.map((c) => [c.id, c]));
}

async function fetchFeaturedImage(mediaId: number): Promise<string | null> {
  if (!mediaId) return null;
  try {
    const media = await fetchJson<WpMedia>(`${WP_BASE}/media/${mediaId}`);
    return media.source_url || null;
  } catch {
    return null;
  }
}

function resolveAppCategory(
  wpCategoryIds: number[],
  wpCatById: Map<number, WpCategory>,
): (typeof CATEGORIES)[number] {
  const candidates = wpCategoryIds
    .map((id) => wpCatById.get(id))
    .filter((c): c is WpCategory => Boolean(c))
    .map((c) => ({
      slug: c.slug,
      app: WP_CATEGORY_MAP[c.slug] ?? WP_CATEGORY_MAP[decodeURIComponent(c.slug)],
      priority: WP_CATEGORY_PRIORITY[c.slug] ?? 5,
    }))
    .filter((c) => c.app);

  if (candidates.length === 0) return 'Power Generation';

  candidates.sort((a, b) => b.priority - a.priority);
  return candidates[0].app;
}

async function ensureCategories(prisma: PrismaClient) {
  const existing = await prisma.category.findMany();
  const byName = new Map(existing.map((c) => [c.name, c]));

  for (const [idx, name] of CATEGORIES.entries()) {
    if (byName.has(name)) continue;
    const meta = CATEGORY_DETAILS[name];
    const created = await prisma.category.create({
      data: {
        name,
        slug: slugify(name),
        description: meta.description,
        color: meta.color,
        icon: meta.icon,
        order: idx,
      },
    });
    byName.set(name, created);
  }

  return Object.fromEntries([...byName.entries()].map(([name, cat]) => [name, cat.id]));
}

async function ensureEditor(prisma: PrismaClient) {
  const existing = await prisma.user.findUnique({ where: { email: EDITOR_EMAIL } });
  if (existing) {
    if (existing.name !== EDITOR_NAME) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { name: EDITOR_NAME, bio: 'Senior Energy Correspondent — ESB PowerLine' },
      });
      console.log(`✓ Updated editor name → ${EDITOR_NAME}`);
    }
    return existing.id;
  }

  const bcrypt = await import('bcryptjs');
  const { seedPasswordForEmail } = await import('../lib/seed-credentials');
  const editorPassword = seedPasswordForEmail(EDITOR_EMAIL);
  if (!editorPassword) {
    throw new Error('Editor seed password not configured (EDITOR_PASSWORD or dev default).');
  }
  const passwordHash = await bcrypt.hash(editorPassword, 10);

  const editor = await prisma.user.create({
    data: {
      name: EDITOR_NAME,
      email: EDITOR_EMAIL,
      passwordHash,
      role: 'EDITOR',
      status: 'ACTIVE',
      bio: 'Senior Energy Correspondent — ESB PowerLine',
    },
  });
  console.log(`✓ Created editor account (${EDITOR_EMAIL})`);
  return editor.id;
}

async function purgeDemoArticles(prisma: PrismaClient) {
  const articleIds = (await prisma.article.findMany({ select: { id: true } })).map((a) => a.id);
  if (articleIds.length === 0) {
    console.log('✓ No existing articles to remove');
    return 0;
  }

  await prisma.editorialNotice.deleteMany({ where: { articleId: { in: articleIds } } });
  await prisma.revision.deleteMany({ where: { articleId: { in: articleIds } } });
  await prisma.comment.deleteMany({ where: { articleId: { in: articleIds } } });
  await prisma.articleHistory.deleteMany({ where: { articleId: { in: articleIds } } });
  await prisma.bookmark.deleteMany({ where: { articleId: { in: articleIds } } });
  const deleted = await prisma.article.deleteMany();
  console.log(`✓ Removed ${deleted.count} demo/fake article(s)`);
  return deleted.count;
}

function isBreakingNews(title: string): boolean {
  const t = title.toLowerCase();
  return (
    t.includes('breaking') ||
    t.includes('tariff') ||
    t.includes('price hike') ||
    t.includes('prices hiked') ||
    t.includes('lng carg')
  );
}

async function importArticles(
  prisma: PrismaClient,
  posts: WpPost[],
  wpCatById: Map<number, WpCategory>,
  categoryIdByName: Record<string, string>,
  authorId: string,
) {
  let imported = 0;

  for (const [index, post] of posts.entries()) {
    const title = stripTags(post.title.rendered);
    const slug = normalizeSlug(post.slug);
    const excerpt = stripTags(post.excerpt.rendered).slice(0, 500) || null;
    const rawContent = post.content.rendered;
    const content = sanitizeContent(rawContent);
    const categoryName = resolveAppCategory(post.categories, wpCatById);
    const categoryId = categoryIdByName[categoryName];
    let imageUrl = await fetchFeaturedImage(post.featured_media);
    if (isDemoImage(imageUrl)) {
      imageUrl = extractContentImage(rawContent);
    }
    const publishedAt = new Date(post.date);
    const wpImportedAt = new Date(post.date);
    const readTime = estimateReadTime(content);

    const isFeatured = index < 3;
    const isBreaking = isBreakingNews(title) && index < 5;

    await prisma.article.upsert({
      where: { slug },
      create: {
        title,
        slug,
        excerpt,
        content,
        authorId,
        publishedAt,
        status: 'PUBLISHED',
        category: categoryName,
        categoryId,
        imageUrl,
        readTime,
        isFeatured,
        isBreaking,
        views: 0,
        likes: 0,
        createdAt: wpImportedAt,
        updatedAt: wpImportedAt,
      },
      update: {
        title,
        excerpt,
        content,
        authorId,
        publishedAt,
        status: 'PUBLISHED',
        category: categoryName,
        categoryId,
        imageUrl,
        readTime,
        isFeatured,
        isBreaking,
        updatedAt: wpImportedAt,
      },
    });

    imported += 1;
    console.log(`  ✓ [${imported}/${posts.length}] ${title.slice(0, 72)}… → ${categoryName}`);
  }

  // Reassign any stray demo-authored rows and strip placeholder images.
  const reassigned = await prisma.article.updateMany({
    where: { NOT: { authorId } },
    data: { authorId },
  });
  if (reassigned.count > 0) {
    console.log(`✓ Reassigned ${reassigned.count} article(s) to ${EDITOR_NAME}`);
  }

  const withDemoImages = await prisma.article.findMany({
    where: {
      OR: [
        { imageUrl: { startsWith: '/images/' } },
        { imageUrl: { contains: 'download (' } },
        { imageUrl: null },
      ],
    },
    select: { id: true, slug: true, content: true, imageUrl: true },
  });

  for (const row of withDemoImages) {
    const fixed = extractContentImage(row.content);
    if (fixed && !isDemoImage(fixed)) {
      await prisma.article.update({ where: { id: row.id }, data: { imageUrl: fixed } });
      console.log(`  ✓ Fixed image for ${row.slug}`);
    }
  }

  const articleCount = await prisma.article.count({ where: { authorId } });
  await prisma.user.update({
    where: { id: authorId },
    data: { name: EDITOR_NAME, articlesCount: articleCount },
  });

  const { REMOVED_DEMO_AUTHOR_EMAILS } = await import('../lib/staff-accounts');
  const stale = await prisma.user.findMany({
    where: { email: { in: [...REMOVED_DEMO_AUTHOR_EMAILS] }, id: { not: authorId } },
    select: { id: true, email: true },
  });
  for (const user of stale) {
    await prisma.user.delete({ where: { id: user.id } });
    console.log(`✓ Removed stale account ${user.email}`);
  }

  return imported;
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    console.error('❌ Set ALLOW_PRODUCTION_SEED=true to import on production.');
    process.exit(1);
  }

  const { createScriptPrismaClient } = await import('../prisma/client');
  const prisma = createScriptPrismaClient();

  console.log('📰 Importing latest news from esbpowerline.com…\n');

  try {
    const [posts, wpCatById] = await Promise.all([fetchWpPosts(), fetchWpCategories()]);
    console.log(`✓ Fetched ${posts.length} posts and ${wpCatById.size} WP categories`);

    const categoryIdByName = await ensureCategories(prisma);
    console.log('✓ Categories ready');

    const authorId = await ensureEditor(prisma);
    await purgeDemoArticles(prisma);

    const imported = await importArticles(prisma, posts, wpCatById, categoryIdByName, authorId);

    await prisma.auditLog.create({
      data: {
        type: 'import',
        message: `Imported ${imported} articles from esbpowerline.com WordPress (editor: ${EDITOR_NAME})`,
        timestamp: new Date(),
      },
    });

    console.log(`\n✅ Done — ${imported} live articles published as ${EDITOR_NAME}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});