import type { Role } from '@/lib/constants';

type PostLoginOptions = {
  callbackUrl?: string | null;
  audience: 'staff' | 'member';
};

function isLocalHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function resolvePostLoginPath(
  role: Role | undefined,
  { callbackUrl, audience }: PostLoginOptions,
  hostContext?: { hostname: string; host: string; protocol: string },
): string {
  if (callbackUrl) return callbackUrl;

  if (audience === 'member' && (!role || role === 'SUBSCRIBER')) {
    return '/';
  }

  const hostname = hostContext?.hostname ?? 'localhost';
  const host = hostContext?.host ?? 'localhost:3000';
  const protocol = hostContext?.protocol ?? 'http:';
  const local = isLocalHost(hostname);

  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    if (local) return 'http://localhost:3002/admin';
    const baseDomain = host.replace(/^(cms\.|admin\.)/, '');
    return `${protocol}//admin.${baseDomain}/admin`;
  }

  if (local) return 'http://localhost:3001/cms';
  const baseDomain = host.replace(/^(cms\.|admin\.)/, '');
  return `${protocol}//cms.${baseDomain}/cms`;
}