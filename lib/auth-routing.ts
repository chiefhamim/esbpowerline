import type { Role } from '@/lib/constants';
import { can, canAccessAdminPanel } from '@/lib/constants';
import { isSplitSurfaceDev } from '@/lib/workspace-urls';

export type AuthAudience = 'member' | 'staff';

export type HostContext = {
  hostname: string;
  host: string;
  protocol: string;
};

/** Canonical home for each role after sign-in */
export function roleHomePath(role: Role | undefined): string {
  if (!role) return '/';
  if (role === 'SUBSCRIBER') return '/members';
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return '/admin';
  if (role === 'EDITOR' || role === 'AUTHOR' || role === 'CONTRIBUTOR') return '/cms';
  return '/';
}

export function isStaffRole(role: Role | undefined): boolean {
  return !!role && role !== 'SUBSCRIBER';
}

export function isMemberRole(role: Role | undefined): boolean {
  return role === 'SUBSCRIBER';
}

export function canAccessPath(role: Role | undefined, pathname: string): boolean {
  const path = pathname.split('?')[0];
  if (path === '/login' || path === '/members/login') return true;
  if (path.startsWith('/members')) return role === 'SUBSCRIBER';
  if (path.startsWith('/admin')) return canAccessAdminPanel(role);
  if (path.startsWith('/cms')) return can(role, 'article.create');
  return true;
}

export function sanitizeCallbackUrl(
  callbackUrl: string | null | undefined,
  role: Role | undefined,
): string | null {
  if (!callbackUrl?.trim() || !role) return null;

  const raw = callbackUrl.trim();
  try {
    if (/^https?:\/\//i.test(raw)) {
      const url = new URL(raw);
      if (!canAccessPath(role, url.pathname)) return null;
      return url.pathname + url.search;
    }

    const normalized = raw.startsWith('/') ? raw : `/${raw}`;
    const pathOnly = normalized.split('?')[0];
    if (!canAccessPath(role, pathOnly)) return null;
    return normalized;
  } catch {
    return null;
  }
}

function isLocalDevHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function getPublicSiteUrl(): string {
  if (typeof window === 'undefined') return '/';
  const { hostname, host, protocol } = window.location;
  if (isLocalDevHost(hostname)) {
    const port = host.split(':')[1];
    if (port === '3001' || port === '3002') {
      return `${protocol}//${hostname}:3000/`;
    }
    return '/';
  }
  if (hostname.startsWith('cms.') || hostname.startsWith('admin.')) {
    const baseDomain = hostname.replace(/^(cms\.|admin\.)/, '');
    return `${protocol}//${baseDomain}/`;
  }
  return '/';
}

/**
 * Split dev servers (npm run dev:all) use separate ports.
 * Vercel and unified `next dev` keep staff workspaces on the same origin.
 */
export function resolveWorkspaceUrl(path: string, ctx?: HostContext): string {
  if (!isSplitSurfaceDev()) return path;
  if (!isLocalDevHost(ctx?.hostname ?? '')) return path;

  const port = ctx?.host?.split(':')[1] ?? '3000';
  const hostname = ctx?.hostname ?? 'localhost';

  if ((path === '/admin' || path.startsWith('/admin/')) && port !== '3002') {
    return `http://${hostname}:3002${path}`;
  }
  if ((path === '/cms' || path.startsWith('/cms/')) && port !== '3001') {
    return `http://${hostname}:3001${path}`;
  }
  return path;
}

export function hostContextFromRequest(hostname: string, host: string, protocol: string): HostContext {
  return { hostname, host, protocol };
}

export function resolvePostLoginPath(
  role: Role | undefined,
  { callbackUrl, audience }: { callbackUrl?: string | null; audience: AuthAudience },
  hostContext?: HostContext,
): string {
  const safeCallback = sanitizeCallbackUrl(callbackUrl, role);
  if (safeCallback) {
    const pathOnly = safeCallback.split('?')[0];
    const query = safeCallback.includes('?') ? safeCallback.slice(safeCallback.indexOf('?')) : '';
    if (pathOnly.startsWith('/admin') || pathOnly.startsWith('/cms')) {
      return resolveWorkspaceUrl(pathOnly, hostContext) + query;
    }
    return safeCallback;
  }

  if (!role) {
    return audience === 'member' ? '/members/login' : '/login';
  }

  if (role === 'SUBSCRIBER') {
    if (audience === 'staff') return '/members?notice=wrong-portal';
    return '/members';
  }

  const home = roleHomePath(role);
  return resolveWorkspaceUrl(home, hostContext);
}

export function redirectUrlForRequest(destination: string, requestUrl: string): URL | string {
  if (/^https?:\/\//i.test(destination)) return destination;
  return new URL(destination, requestUrl);
}

export function isCrossOriginDestination(destination: string, host: string): boolean {
  if (!/^https?:\/\//i.test(destination)) return false;
  try {
    const url = new URL(destination);
    return url.host !== host;
  } catch {
    return false;
  }
}

/** Short status copy while routing after sign-in */
export function getAuthHandoffMessage(
  role: Role | undefined,
  audience: AuthAudience,
  destination: string,
  host: string,
): string {
  if (isCrossOriginDestination(destination, host)) {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return 'Opening admin dashboard…';
    return 'Opening editorial workspace…';
  }

  if (audience === 'staff' && role === 'SUBSCRIBER') {
    return 'Member account — opening your library…';
  }

  if (audience === 'member' && isStaffRole(role)) {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return 'Staff account — opening admin dashboard…';
    return 'Staff account — opening editorial workspace…';
  }

  if (role === 'SUBSCRIBER') return 'Opening your library…';
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return 'Opening admin dashboard…';
  return 'Opening your workspace…';
}

function shouldHardNavigate(destination: string): boolean {
  if (/^https?:\/\//i.test(destination)) return true;
  const path = destination.split('?')[0];
  return path.startsWith('/admin') || path.startsWith('/cms') || path.startsWith('/members');
}

export function navigateAfterAuth(
  destination: string,
  router: { push: (url: string) => void; replace: (url: string) => void },
  replace = false,
): boolean {
  if (shouldHardNavigate(destination)) {
    window.location.assign(destination);
    return true;
  }
  if (replace) router.replace(destination);
  else router.push(destination);
  return false;
}

export function hostContextFromHeaders(host: string | null, proto: string | null): HostContext {
  const resolvedHost = host ?? 'localhost:3000';
  return {
    hostname: resolvedHost.split(':')[0],
    host: resolvedHost,
    protocol: `${proto ?? 'http'}:`,
  };
}