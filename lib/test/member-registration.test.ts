import { describe, it, expect, vi, afterEach } from 'vitest';
import { initialMemberStatus } from '@/lib/member-registration';

describe('initialMemberStatus', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns PENDING in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(initialMemberStatus()).toBe('PENDING');
  });

  it('returns ACTIVE in development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(initialMemberStatus()).toBe('ACTIVE');
  });

  it('returns ACTIVE in test', () => {
    vi.stubEnv('NODE_ENV', 'test');
    expect(initialMemberStatus()).toBe('ACTIVE');
  });
});