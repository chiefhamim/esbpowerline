/**
 * Fix stale "Nadia Karim" on editor@esbpowerline.com in Supabase Auth + profiles + Prisma.
 * Run: ALLOW_PRODUCTION_SEED=true npx tsx scripts/sync-editor-identity.ts
 */
import { config, parse } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import {
  EDITOR_EMAIL,
  EDITOR_NAME,
  LEGACY_EDITOR_EMAIL,
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
  process.env.DATABASE_URL =
    process.env.DATABASE_URL?.trim()?.startsWith('file:')
      ? process.env.DATABASE_URL.trim()
      : 'file:./dev.db';
} else if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = toPostgresqlUrl(
    process.env.POSTGRES_PRISMA_URL || readEnvValue('.env.local', 'POSTGRES_PRISMA_URL'),
  );
}

async function main() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url) url = readEnvValue('.env.local', 'NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceKey) serviceKey = readEnvValue('.env.local', 'SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase env vars');
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { createScriptPrismaClient } = await import('../prisma/client');
  const prisma = createScriptPrismaClient();

  const editorEmails = [EDITOR_EMAIL, LEGACY_EDITOR_EMAIL];
  const metadata = { role: 'EDITOR', name: EDITOR_NAME, full_name: EDITOR_NAME };

  try {
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) throw error;

    for (const email of editorEmails) {
      const authUser = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (!authUser) {
        console.log(`— No Supabase auth user for ${email}`);
        continue;
      }

      await admin.auth.admin.updateUserById(authUser.id, {
        user_metadata: metadata,
      });
      console.log(`✓ Supabase auth metadata → ${EDITOR_NAME} (${email})`);

      const { error: profileError } = await admin.from('profiles').upsert({
        id: authUser.id,
        full_name: EDITOR_NAME,
        role: 'EDITOR',
        updated_at: new Date().toISOString(),
      });
      if (profileError) {
        console.warn(`⚠ profiles upsert (${email}):`, profileError.message);
      } else {
        console.log(`✓ profiles.full_name → ${EDITOR_NAME} (${email})`);
      }

      const prismaUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { supabaseUserId: authUser.id }] },
      });
      if (prismaUser) {
        await prisma.user.update({
          where: { id: prismaUser.id },
          data: {
            name: EDITOR_NAME,
            role: 'EDITOR',
            supabaseUserId: authUser.id,
          },
        });
        console.log(`✓ Prisma user → ${EDITOR_NAME} (linked ${email})`);
      }
    }

    const canonical = await prisma.user.findUnique({ where: { email: EDITOR_EMAIL } });
    if (canonical) {
      await prisma.user.update({
        where: { id: canonical.id },
        data: { name: EDITOR_NAME },
      });
    }

    console.log('\n✅ Editor identity synced. Sign out and sign back in to refresh CMS session.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});