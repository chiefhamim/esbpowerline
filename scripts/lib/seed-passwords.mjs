export const MEMBER_DEMO_EMAIL = 'member@esbpowerline.com';

const DEV_PASSWORD_BY_EMAIL = {
  'admin@esbpowerline.com': 'admin007',
  'hamim2964@gmail.com': 'editor007',
  [MEMBER_DEMO_EMAIL]: 'member007',
};

export function seedPasswordForEmail(email) {
  const normalized = email.trim().toLowerCase();
  if (process.env.NODE_ENV === 'production') {
    if (normalized === 'admin@esbpowerline.com') {
      return process.env.MASTER_ADMIN_PASSWORD?.trim() || null;
    }
    if (normalized === 'hamim2964@gmail.com') {
      return process.env.EDITOR_PASSWORD?.trim() || process.env.MASTER_ADMIN_PASSWORD?.trim() || null;
    }
    if (normalized === MEMBER_DEMO_EMAIL) {
      return process.env.MEMBER_DEMO_PASSWORD?.trim() || null;
    }
    return null;
  }
  const globalOverride = process.env.SEED_DEMO_PASSWORD?.trim();
  if (globalOverride) return globalOverride;
  return DEV_PASSWORD_BY_EMAIL[normalized] ?? null;
}