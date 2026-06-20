/**
 * Reset all analytics to zero and enforce sole editor (Mehedi Hasan Hamim).
 * Run on production: ALLOW_PRODUCTION_SEED=true npm run reset:analytics:prod
 */
import { config, parse } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import bcrypt from 'bcryptjs';
import type { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import {
  EDITOR_EMAIL,
  EDITOR_NAME,
  REMOVED_DEMO_AUTHOR_EMAILS,
} from '../lib/staff-accounts';

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
} else if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = toPostgresqlUrl(
    process.env.POSTGRES_PRISMA_URL ||
      readEnvValue('.env.local', 'POSTGRES_PRISMA_URL'),
  );
}

async function ensureEditor(prisma: PrismaClient) {
  const { seedPasswordForEmail } = await import('../lib/seed-credentials');
  const password = seedPasswordForEmail(EDITOR_EMAIL);
  if (!password) {
    throw new Error('Editor seed password not configured (EDITOR_PASSWORD or dev default).');
  }
  const passwordHash = await bcrypt.hash(password, 10);

  let editor = await prisma.user.findUnique({ where: { email: EDITOR_EMAIL } });
  if (!editor) {
    const legacy = await prisma.user.findFirst({
      where: { email: { in: [...REMOVED_DEMO_AUTHOR_EMAILS] }, role: 'EDITOR' },
    });
    if (legacy) {
      editor = await prisma.user.update({
        where: { id: legacy.id },
        data: {
          email: EDITOR_EMAIL,
          name: EDITOR_NAME,
          role: 'EDITOR',
          status: 'ACTIVE',
          bio: 'Senior Energy Correspondent — ESB PowerLine',
          passwordHash,
        },
      });
      console.log(`✓ Migrated editor → ${EDITOR_EMAIL}`);
    } else {
      editor = await prisma.user.create({
        data: {
          name: EDITOR_NAME,
          email: EDITOR_EMAIL,
          passwordHash,
          role: 'EDITOR',
          status: 'ACTIVE',
          bio: 'Senior Energy Correspondent — ESB PowerLine',
        },
      });
      console.log(`✓ Created editor (${EDITOR_EMAIL})`);
    }
  } else {
    await prisma.user.update({
      where: { id: editor.id },
      data: {
        name: EDITOR_NAME,
        role: 'EDITOR',
        status: 'ACTIVE',
        bio: 'Senior Energy Correspondent — ESB PowerLine',
      },
    });
    console.log(`✓ Editor confirmed (${EDITOR_EMAIL})`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (supabaseUrl && serviceKey) {
    try {
      const admin = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const metadata = {
        role: 'EDITOR',
        name: EDITOR_NAME,
        full_name: EDITOR_NAME,
      };
      const { error: createError } = await admin.auth.admin.createUser({
        email: EDITOR_EMAIL,
        password,
        email_confirm: true,
        user_metadata: metadata,
      });
      if (createError && !createError.message.toLowerCase().includes('already')) {
        throw createError;
      }
      if (!createError) {
        console.log('✓ Supabase editor created');
      } else {
        const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const userId = data.users.find((u) => u.email === EDITOR_EMAIL)?.id;
        if (userId) {
          await admin.auth.admin.updateUserById(userId, {
            password,
            email_confirm: true,
            user_metadata: metadata,
          });
          if (editor.supabaseUserId !== userId) {
            await prisma.user.update({
              where: { id: editor.id },
              data: { supabaseUserId: userId },
            });
          }
        }
        console.log('✓ Supabase editor updated');
      }
    } catch (error) {
      console.warn('⚠ Supabase editor sync skipped:', error);
    }
  }

  return editor.id;
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    console.error('❌ Set ALLOW_PRODUCTION_SEED=true for production reset.');
    process.exit(1);
  }

  const { createScriptPrismaClient } = await import('../prisma/client');
  const prisma = createScriptPrismaClient();

  try {
    console.log('🧹 Resetting analytics and staff…\n');

    const editorId = await ensureEditor(prisma);

    try {
      const deletedViews = await prisma.articleView.deleteMany();
      console.log(`✓ Cleared ${deletedViews.count} view ledger row(s)`);
    } catch {
      console.log('✓ View ledger empty (table pending migration)');
    }

    const articlesReset = await prisma.article.updateMany({
      data: { views: 0, likes: 0, authorId: editorId },
    });
    console.log(`✓ Reset views/likes on ${articlesReset.count} article(s); author → ${EDITOR_NAME}`);

    await prisma.user.updateMany({ data: { totalViews: 0, articlesCount: 0 } });
    const count = await prisma.article.count({ where: { authorId: editorId, status: 'PUBLISHED' } });
    await prisma.user.update({
      where: { id: editorId },
      data: { articlesCount: count, totalViews: 0 },
    });

    const demoUsers = await prisma.user.findMany({
      where: { email: { in: [...REMOVED_DEMO_AUTHOR_EMAILS] }, id: { not: editorId } },
      select: { id: true, email: true },
    });
    for (const demo of demoUsers) {
      await prisma.user.delete({ where: { id: demo.id } });
      console.log(`✓ Removed demo user ${demo.email}`);
    }

    await prisma.auditLog.create({
      data: {
        type: 'system',
        message: `Analytics reset to zero; sole editor ${EDITOR_NAME} (${EDITOR_EMAIL})`,
        timestamp: new Date(),
      },
    });

    console.log('\n✅ Analytics zeroed. Real views will accrue via ArticleView ledger only.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('❌ Reset failed:', err);
  process.exit(1);
});