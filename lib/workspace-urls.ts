const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

function isLocalHost(hostname: string) {
  return LOCAL_HOSTS.has(hostname);
}

function currentAppSurface(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_APP_SURFACE ?? 'all';
  }
  return process.env.APP_SURFACE ?? 'all';
}

/** True when `npm run dev:all` runs separate public/cms/admin ports. */
export function isSplitSurfaceDev(): boolean {
  return currentAppSurface() !== 'all';
}

/** Server-safe admin console origin (port 3002 in local multi-surface dev). */
export function getAdminPanelOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_ADMIN_SITE_URL?.replace(/\/$/, '');
  if (configured) return configured;
  if (process.env.NODE_ENV === 'development' && isSplitSurfaceDev()) {
    return 'http://localhost:3002';
  }
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? '';
}

/** Server-safe CMS workspace origin (port 3001 in local multi-surface dev). */
export function getCmsWorkspaceOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_CMS_SITE_URL?.replace(/\/$/, '');
  if (configured) return configured;
  if (process.env.NODE_ENV === 'development' && isSplitSurfaceDev()) {
    return 'http://localhost:3001';
  }
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? '';
}

export function adminPanelUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const origin = getAdminPanelOrigin();
  return origin ? `${origin}${normalized}` : normalized;
}

export function cmsWorkspaceUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const origin = getCmsWorkspaceOrigin();
  return origin ? `${origin}${normalized}` : normalized;
}

/**
 * Client: upgrade a same-origin path to a full URL when split dev uses another port.
 * Prevents Next.js soft navigation from failing on cross-port middleware redirects.
 */
export function resolveCrossSurfaceHref(path: string): string {
  if (path.startsWith('http')) return path;
  if (typeof window === 'undefined') return path;
  if (!isSplitSurfaceDev()) return path;

  const { hostname, protocol, host } = window.location;
  if (!isLocalHost(hostname)) return path;

  const port = host.split(':')[1] ?? '3000';
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if ((normalized === '/admin' || normalized.startsWith('/admin/')) && port !== '3002') {
    return `${protocol}//${hostname}:3002${normalized}`;
  }
  if ((normalized === '/cms' || normalized.startsWith('/cms/')) && port !== '3001') {
    return `${protocol}//${hostname}:3001${normalized}`;
  }

  return path;
}

/** Resolve cross-surface URLs for staff panels (public site, admin console). */
export function resolveStaffWorkspaceUrls() {
  if (typeof window === 'undefined') {
    return { publicSiteUrl: '/', adminUrl: '/admin', cmsUrl: '/cms' };
  }

  const { hostname, host, protocol } = window.location;
  const isLocal = isLocalHost(hostname);

  if (isLocal) {
    if (!isSplitSurfaceDev()) {
      return { publicSiteUrl: '/', adminUrl: '/admin', cmsUrl: '/cms' };
    }
    return {
      publicSiteUrl: 'http://localhost:3000',
      adminUrl: 'http://localhost:3002/admin',
      cmsUrl: 'http://localhost:3001/cms',
    };
  }

  const baseDomain = host.replace(/^(cms\.|admin\.)/, '');
  const cleanBase = hostname.replace(/^(cms\.|admin\.)/, '');
  return {
    publicSiteUrl: `${protocol}//${baseDomain}/`,
    adminUrl: `${protocol}//admin.${cleanBase}/admin`,
    cmsUrl: `${protocol}//cms.${cleanBase}/cms`,
  };
}