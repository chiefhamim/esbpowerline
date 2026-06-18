'use server';

import { createClient } from '@/utils/supabase/server';

/** Clear Supabase session cookies server-side. */
export async function signOutSessionAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}