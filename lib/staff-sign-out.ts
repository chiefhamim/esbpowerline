'use client';

import { signOutSessionAction } from '@/lib/actions/sign-out';
import { getPublicSiteUrl } from '@/lib/auth-routing';
import { createClient } from '@/utils/supabase/client';

async function clearSession() {
  try {
    await signOutSessionAction();
    return;
  } catch {
    // Fall back to client-side sign-out if the server action is unavailable.
  }

  try {
    const supabase = createClient();
    await supabase.auth.signOut();
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