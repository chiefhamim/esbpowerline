'use client';

import { signOutSessionAction } from '@/lib/actions/sign-out';
import { getPublicSiteUrl } from '@/lib/auth-routing';

async function clearSession() {
  try {
    await signOutSessionAction();
    return;
  } catch {
    // Fall back to client sign-out if the server action is unavailable.
  }

  try {
    const { signOut } = await import('next-auth/react');
    await signOut({ redirect: false });
  } catch {
    // Still redirect — user can retry if the cookie persists.
  }
}

/** Sign out and land on the public front page. */
export async function signOutToPublicSite() {
  await clearSession();
  window.location.assign(getPublicSiteUrl());
}

/** @deprecated Use signOutToPublicSite */
export const signOutStaffToPublicSite = signOutToPublicSite;