'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';

async function requirePermission(action: string) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, action)) throw new Error('Forbidden');
  return session.user;
}

async function requireAdmin() {
  return requirePermission('settings.view');
}

export async function getSettings() {
  await requireAdmin();
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;
  return map;
}

export async function updateSetting(key: string, value: unknown) {
  return updateSettingsBatch({ [key]: value });
}

export async function updateSettingsBatch(updates: Record<string, unknown>) {
  const admin = await requireAdmin();
  if (!can(admin.role, 'settings.edit')) throw new Error('Forbidden');

  const entries = Object.entries(updates);
  if (!entries.length) return;

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: value as object },
        update: { value: value as object },
      })
    )
  );

  const { PUBLIC_REVALIDATE_PATHS } = await import('@/lib/public-paths');
  for (const path of PUBLIC_REVALIDATE_PATHS) revalidatePath(path);
  revalidatePath('/admin/settings');
}