/**
 * Resolve a Postgres URL suitable for Prisma migrate deploy on Vercel + Supabase.
 *
 * Default: session pooler (:5432 on pooler host) with connection_limit=1.
 * Vercel cannot reach db.[ref].supabase.co without Supabase IPv4 add-on (P1001).
 * Set PRISMA_MIGRATE_USE_DIRECT_HOST=true only when direct host is reachable.
 */

/**
 * @param {import('url').URL} parsed
 * @param {string} username
 * @param {string} password
 * @param {URLSearchParams} params
 */
function buildPostgresUrl(parsed, username, password, params) {
  const port = parsed.port || '5432';
  const database = parsed.pathname.replace(/^\//, '') || 'postgres';
  const auth = password
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}`
    : encodeURIComponent(username);
  const query = params.toString();
  return `postgresql://${auth}@${parsed.hostname}:${port}/${database}${query ? `?${query}` : ''}`;
}

/**
 * @param {string | undefined} rawUrl
 * @param {{ useDirectHost?: boolean }} [options]
 * @returns {{ url: string | undefined; rewritten: boolean; host: string | undefined; mode: 'session-pooler' | 'direct' | 'unknown' }}
 */
export function resolveMigrationDatabaseUrl(rawUrl, options = {}) {
  const raw = rawUrl?.trim();
  if (!raw) {
    return { url: undefined, rewritten: false, host: undefined, mode: 'unknown' };
  }

  const useDirectHost =
    options.useDirectHost ?? process.env.PRISMA_MIGRATE_USE_DIRECT_HOST === 'true';

  const normalized = raw.replace(/^postgres:\/\//, 'postgresql://');
  let parsed;
  try {
    parsed = new URL(normalized.replace(/^postgresql:\/\//, 'https://'));
  } catch {
    return { url: raw, rewritten: false, host: undefined, mode: 'unknown' };
  }

  const host = parsed.hostname;
  const port = parsed.port || '5432';
  const username = decodeURIComponent(parsed.username);
  const password = parsed.password ? decodeURIComponent(parsed.password) : '';
  const params = new URLSearchParams(parsed.search);

  if (port === '6543') {
    throw new Error(
      'Migration URL must not use port 6543 (transaction pooler). ' +
        'Set DIRECT_URL to Supabase session pooler (pooler.supabase.com:5432).',
    );
  }

  if (host.startsWith('db.') && host.endsWith('.supabase.co')) {
    return { url: raw, rewritten: false, host, mode: 'direct' };
  }

  if (host.includes('pooler.supabase.com')) {
    const projectRef = username.startsWith('postgres.')
      ? username.slice('postgres.'.length)
      : null;

    if (!projectRef) {
      throw new Error(
        'DIRECT_URL uses Supabase pooler but username is not postgres.[project-ref]. ' +
          'Copy the Session pooler string from Supabase (port 5432).',
      );
    }

    if (useDirectHost) {
      params.delete('pgbouncer');
      const directHost = `db.${projectRef}.supabase.co`;
      const url = buildPostgresUrl(
        new URL(`https://${directHost}:${port}`),
        'postgres',
        password,
        params,
      );
      return { url, rewritten: true, host: directHost, mode: 'direct' };
    }

    params.delete('pgbouncer');
    if (!params.has('connection_limit')) {
      params.set('connection_limit', '1');
    }
    if (!params.has('connect_timeout')) {
      params.set('connect_timeout', '30');
    }

    const url = buildPostgresUrl(parsed, username, password, params);
    const changed = url !== normalized;
    return { url, rewritten: changed, host, mode: 'session-pooler' };
  }

  return { url: raw, rewritten: false, host, mode: 'unknown' };
}