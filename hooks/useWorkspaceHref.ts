'use client';

import { useEffect, useState } from 'react';
import type { Role } from '@/lib/constants';
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
    // With Supabase auth, cookies are same-origin — no handoff needed.
    setHref(destination);
  }, [guestHref, role, signedIn]);

  return href;
}