import { describe, expect, it } from 'vitest';
import { resolveMigrationDatabaseUrl } from '../../scripts/resolve-migration-database-url.mjs';

describe('resolveMigrationDatabaseUrl', () => {
  it('rewrites Supabase session pooler to direct db host', () => {
    const pooler =
      'postgresql://postgres.sxgokpmrbgdndstygapc:secret@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';
    const { url, rewritten, host } = resolveMigrationDatabaseUrl(pooler);
    expect(rewritten).toBe(true);
    expect(host).toBe('db.sxgokpmrbgdndstygapc.supabase.co');
    expect(url).toContain('db.sxgokpmrbgdndstygapc.supabase.co:5432/postgres');
    expect(url).toContain('postgres:secret');
    expect(url).not.toContain('pooler.supabase.com');
  });

  it('leaves direct Supabase host unchanged', () => {
    const direct =
      'postgresql://postgres:secret@db.sxgokpmrbgdndstygapc.supabase.co:5432/postgres';
    const { url, rewritten, host } = resolveMigrationDatabaseUrl(direct);
    expect(rewritten).toBe(false);
    expect(host).toBe('db.sxgokpmrbgdndstygapc.supabase.co');
    expect(url).toBe(direct);
  });

  it('rejects transaction pooler port 6543', () => {
    const tx =
      'postgresql://postgres.sxgokpmrbgdndstygapc:secret@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
    expect(() => resolveMigrationDatabaseUrl(tx)).toThrow(/6543/);
  });
});