'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Role } from '@/lib/constants';
import { authContinuePath, needsAuthHandoff } from '@/lib/auth-handoff';
import { roleHomePath, resolveWorkspaceUrl } from '@/lib/auth-routing';

export function useWorkspaceHref(role: Role | undefined, signedIn: boolean, guestHref: string) {
  const [href, setHref] = useState(() => (signedIn && role ? roleHomePath(role) : guestHref));

  useEffect(() => {
    if (!signedIn || !role) {
      setHref(guestHref);
      return;
    }

    const hostContext = {
      hostname: window.location.hostname,
      host: window.location.host,
      protocol: window.location.protocol,
    };
    const destination = resolveWorkspaceUrl(roleHomePath(role), hostContext);
    setHref(
      needsAuthHandoff(destination, hostContext.host)
        ? authContinuePath(destination)
        : destination,
    );
  }, [guestHref, role, signedIn]);

  return href;
}