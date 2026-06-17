'use server';

import { signOut } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

/** Clear NextAuth + Supabase session cookies server-side. */
export async function signOutSessionAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Supabase may be unavailable in some environments — still clear NextAuth.
  }

  await signOut({ redirect: false });
}