/**
 * Resolve a Postgres URL suitable for Prisma migrate deploy.
 * Supabase session pooler (:5432 on pooler host) is limited (~15 conns) and
 * must not be used for migrations — rewrite to db.[ref].supabase.co when needed.
 */

/**
 * @param {string | undefined} rawUrl
 * @returns {{ url: string | undefined; rewritten: boolean; host: string | undefined }}
 */
export function resolveMigrationDatabaseUrl(rawUrl) {
  const raw = rawUrl?.trim();
  if (!raw) {
    return { url: undefined, rewritten: false, host: undefined };
  }

  const normalized = raw.replace(/^postgres:\/\//, 'postgresql://');
  let parsed;
  try {
    parsed = new URL(normalized.replace(/^postgresql:\/\//, 'https://'));
  } catch {
    return { url: raw, rewritten: false, host: undefined };
  }

  const host = parsed.hostname;
  const port = parsed.port || '5432';
  const username = decodeURIComponent(parsed.username);
  const password = parsed.password ? decodeURIComponent(parsed.password) : '';
  const database = parsed.pathname.replace(/^\//, '') || 'postgres';
  const params = parsed.searchParams;

  if (port === '6543') {
    throw new Error(
      'Migration URL must not use port 6543 (transaction pooler). ' +
        'Set DIRECT_URL to Supabase direct connection (db.[ref].supabase.co:5432).',
    );
  }

  if (host.startsWith('db.') && host.endsWith('.supabase.co')) {
    return { url: raw, rewritten: false, host };
  }

  if (host.includes('pooler.supabase.com')) {
    const projectRef = username.startsWith('postgres.')
      ? username.slice('postgres.'.length)
      : null;

    if (!projectRef) {
      throw new Error(
        'DIRECT_URL uses Supabase pooler but username is not postgres.[project-ref]. ' +
          'Use the "Direct connection" string from Supabase (host db.[ref].supabase.co, user postgres).',
      );
    }

    params.delete('pgbouncer');
    const query = params.toString();
    const auth = password
      ? `${encodeURIComponent('postgres')}:${encodeURIComponent(password)}`
      : encodeURIComponent('postgres');
    const directHost = `db.${projectRef}.supabase.co`;
    const url = `postgresql://${auth}@${directHost}:${port}/${database}${query ? `?${query}` : ''}`;

    return { url, rewritten: true, host: directHost };
  }

  return { url: raw, rewritten: false, host };
}