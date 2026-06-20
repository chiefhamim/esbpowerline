import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  MEMBER_DEMO_EMAIL,
  seedPasswordForEmail,
  devStaffLoginPasswordHint,
} from '@/lib/seed-credentials';
import { EDITOR_EMAIL, MASTER_ADMIN_EMAIL } from '@/lib/staff-accounts';

describe('seed-credentials', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses per-account dev defaults outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(seedPasswordForEmail(MASTER_ADMIN_EMAIL)).toBe('admin007');
    expect(seedPasswordForEmail(EDITOR_EMAIL)).toBe('editor007');
    expect(seedPasswordForEmail(MEMBER_DEMO_EMAIL)).toBe('member007');
    expect(devStaffLoginPasswordHint()).toBe('admin007');
  });

  it('requires explicit env vars in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(seedPasswordForEmail(MASTER_ADMIN_EMAIL)).toBeNull();
    expect(seedPasswordForEmail(EDITOR_EMAIL)).toBeNull();
    expect(seedPasswordForEmail(MEMBER_DEMO_EMAIL)).toBeNull();
    expect(devStaffLoginPasswordHint()).toBeNull();
  });

  it('honors production MASTER_ADMIN_PASSWORD', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('MASTER_ADMIN_PASSWORD', 'prod-admin-secret');
    expect(seedPasswordForEmail(MASTER_ADMIN_EMAIL)).toBe('prod-admin-secret');
  });

  it('does not expose esbpowerline007 fallback', () => {
    vi.stubEnv('NODE_ENV', 'development');
    for (const email of [MASTER_ADMIN_EMAIL, EDITOR_EMAIL, MEMBER_DEMO_EMAIL]) {
      expect(seedPasswordForEmail(email)).not.toBe('esbpowerline007');
    }
  });
});