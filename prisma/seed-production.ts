/**
 * Production bootstrap seed — idempotent, no demo articles or wipe.
 * Run: ALLOW_PRODUCTION_SEED=true MASTER_ADMIN_PASSWORD=... npm run db:seed:prod
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createScriptPrismaClient } from './client';
import { MASTER_ADMIN_EMAIL, MASTER_ADMIN_NAME } from '../lib/staff-accounts';
import {
  productionCategoryRows,
  productionDashboardStats,
  productionSiteSettings,
} from '../lib/seed/production-data';
import { upsertSupabaseAuthUser } from '../lib/supabase/sync-auth-user';

const prisma = createScriptPrismaClient();

async function seedCategories() {
  let created = 0;
  for (const row of productionCategoryRows()) {
    const existing = await prisma.category.findFirst({
      where: { OR: [{ name: row.name }, { slug: row.slug }] },
    });
    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: {
          description: row.description,
          color: row.color,
          icon: row.icon,
          order: row.order,
        },
      });
      continue;
    }
    await prisma.category.create({ data: row });
    created += 1;
  }
  return created;
}

async function seedSiteSettings() {
  let upserted = 0;
  for (const row of productionSiteSettings()) {
    await prisma.siteSetting.upsert({
      where: { key: row.key },
      create: { key: row.key, value: row.value },
      update: { value: row.value },
    });
    upserted += 1;
  }
  return upserted;
}

async function seedDashboardStats() {
  let created = 0;
  for (const stat of productionDashboardStats()) {
    const existing = await prisma.dashboardStat.findUnique({
      where: { statName: stat.statName },
    });
    if (existing) continue;
    await prisma.dashboardStat.create({
      data: { ...stat, isManualOverride: false },
    });
    created += 1;
  }
  return created;
}

async function seedMasterAdmin() {
  const password = process.env.MASTER_ADMIN_PASSWORD?.trim();
  if (!password) {
    console.warn('⚠ MASTER_ADMIN_PASSWORD not set — skipping master admin Prisma/Supabase bootstrap.');
    console.warn('  Set MASTER_ADMIN_PASSWORD and re-run, or sign in after creating admin@esbpowerline.com manually.');
    return false;
  }

  const existing = await prisma.user.findUnique({
    where: { email: MASTER_ADMIN_EMAIL },
    select: { id: true, supabaseUserId: true },
  });

  if (existing) {
    console.log(`✓ Master admin already exists (${MASTER_ADMIN_EMAIL})`);
    return false;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  let supabaseUserId: string | null = null;

  try {
    supabaseUserId = await upsertSupabaseAuthUser({
      email: MASTER_ADMIN_EMAIL,
      password,
      name: MASTER_ADMIN_NAME,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    });
  } catch (error) {
    console.error('❌ Supabase master admin sync failed:', error);
    throw error;
  }

  await prisma.user.create({
    data: {
      name: MASTER_ADMIN_NAME,
      email: MASTER_ADMIN_EMAIL,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      supabaseUserId: supabaseUserId ?? undefined,
    },
  });

  console.log(`✓ Master admin created (${MASTER_ADMIN_EMAIL})`);
  return true;
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    console.error('❌ Refusing production seed: set ALLOW_PRODUCTION_SEED=true');
    process.exit(1);
  }

  if (process.env.PRISMA_SCHEMA_PROVIDER === 'sqlite') {
    console.warn('⚠ PRISMA_SCHEMA_PROVIDER=sqlite — production seed is intended for postgresql.');
  }

  console.log('🌱 Production bootstrap seed (idempotent)...');

  const categoriesCreated = await seedCategories();
  const settingsUpserted = await seedSiteSettings();
  const statsCreated = await seedDashboardStats();
  const adminCreated = await seedMasterAdmin();

  await prisma.auditLog.create({
    data: {
      type: 'system',
      message: 'Production bootstrap seed completed',
      timestamp: new Date(),
    },
  });

  console.log(`✓ Categories: ${categoriesCreated} created, rest updated/skipped`);
  console.log(`✓ Site settings: ${settingsUpserted} upserted`);
  console.log(`✓ Dashboard stats: ${statsCreated} created`);
  console.log(adminCreated ? '✓ Master admin bootstrapped' : '✓ Master admin unchanged');

  console.log('\n✅ Production bootstrap complete.');
  console.log('  Next: publish articles in CMS, assign carousel/coverage in Admin → Platform.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });