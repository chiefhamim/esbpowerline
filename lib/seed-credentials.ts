import {
  EDITOR_EMAIL,
  MASTER_ADMIN_EMAIL,
} from '@/lib/staff-accounts';

/** Demo member account — local/staging only. */
export const MEMBER_DEMO_EMAIL = 'member@esbpowerline.com';

const DEV_PASSWORD_BY_EMAIL: Readonly<Record<string, string>> = {
  [MASTER_ADMIN_EMAIL.toLowerCase()]: 'admin007',
  [EDITOR_EMAIL.toLowerCase()]: 'editor007',
  [MEMBER_DEMO_EMAIL.toLowerCase()]: 'member007',
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Resolve bootstrap password for a known account email.
 * Production: requires explicit env vars (no hardcoded defaults).
 * Development: per-account defaults (admin007 / editor007 / member007) unless overridden.
 */
export function seedPasswordForEmail(email: string): string | null {
  const normalized = normalizeEmail(email);

  if (process.env.NODE_ENV === 'production') {
    if (normalized === MASTER_ADMIN_EMAIL.toLowerCase()) {
      return process.env.MASTER_ADMIN_PASSWORD?.trim() || null;
    }
    if (normalized === EDITOR_EMAIL.toLowerCase()) {
      return process.env.EDITOR_PASSWORD?.trim() || process.env.MASTER_ADMIN_PASSWORD?.trim() || null;
    }
    if (normalized === MEMBER_DEMO_EMAIL.toLowerCase()) {
      return process.env.MEMBER_DEMO_PASSWORD?.trim() || null;
    }
    return null;
  }

  const globalOverride = process.env.SEED_DEMO_PASSWORD?.trim();
  if (globalOverride) return globalOverride;

  if (normalized === MASTER_ADMIN_EMAIL.toLowerCase()) {
    return process.env.MASTER_ADMIN_PASSWORD?.trim() || DEV_PASSWORD_BY_EMAIL[normalized];
  }
  if (normalized === EDITOR_EMAIL.toLowerCase()) {
    return process.env.EDITOR_PASSWORD?.trim() || DEV_PASSWORD_BY_EMAIL[normalized];
  }
  if (normalized === MEMBER_DEMO_EMAIL.toLowerCase()) {
    return process.env.MEMBER_DEMO_PASSWORD?.trim() || DEV_PASSWORD_BY_EMAIL[normalized];
  }

  return DEV_PASSWORD_BY_EMAIL[normalized] ?? null;
}

/** Dev-only staff login hint (master admin quick-fill). */
export function devStaffLoginPasswordHint(): string | null {
  if (process.env.NODE_ENV === 'production') return null;
  return seedPasswordForEmail(MASTER_ADMIN_EMAIL);
}