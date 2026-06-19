import { describe, it, expect } from 'vitest';
import { getAuthSecret } from '@/lib/env-auth';

describe('AUTH_SECRET guard', () => {
  it('returns dev fallback outside production', () => {
    expect(getAuthSecret()).toBeTruthy();
  });
});