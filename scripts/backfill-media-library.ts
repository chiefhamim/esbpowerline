/**
 * Register article cover/inline images in the Media table (idempotent).
 *
 * Usage:
 *   npx tsx scripts/backfill-media-library.ts
 *   ALLOW_PRODUCTION_SEED=true PRISMA_SCHEMA_PROVIDER=postgresql npx tsx scripts/backfill-media-library.ts
 */
import { config, parse } from 'dotenv';
import { existsSync, readFileSync } from 'fs';

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
  process.env.DATABASE_URL =
    process.env.DATABASE_URL?.trim()?.startsWith('file:')
      ? process.env.DATABASE_URL.trim()
      : 'file:./dev.db';
} else if (!toPostgresqlUrl(process.env.DATABASE_URL)) {
  process.env.DATABASE_URL = toPostgresqlUrl(
    process.env.POSTGRES_PRISMA_URL ||
      readEnvValue('.env.local', 'POSTGRES_PRISMA_URL') ||
      readEnvValue('.env', 'POSTGRES_PRISMA_URL'),
  );
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    console.error('❌ Set ALLOW_PRODUCTION_SEED=true to backfill production media.');
    process.exit(1);
  }

  const { createScriptPrismaClient } = await import('../prisma/client');
  const { registerArticleMedia } = await import('../lib/media-registry-core');
  const prisma = createScriptPrismaClient();

  const articles = await prisma.article.findMany({
    where: { status: { not: 'TRASH' }, editorTrash: false },
    select: { id: true, title: true, imageUrl: true, content: true, authorId: true },
  });

  let registered = 0;
  for (const article of articles) {
    const before = await prisma.media.count();
    await registerArticleMedia(prisma, {
      imageUrl: article.imageUrl,
      content: article.content,
      uploadedById: article.authorId,
      title: article.title,
    });
    const after = await prisma.media.count();
    if (after > before) registered += after - before;
  }

  console.log(`✅ Media library backfill complete — ${articles.length} articles scanned, ${registered} new media row(s).`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});