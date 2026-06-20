import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { safeAuthRedirectPath } from '@/lib/auth-redirect';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeAuthRedirectPath(searchParams.get('next'), '/auth/reset-password?audience=staff');

  if (!next.startsWith('/auth/reset-password')) {
    return NextResponse.redirect(`${origin}/auth/forgot-password?error=invalid`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('[auth/callback]', error.message);
  }

  const audience = next.includes('audience=member') ? 'member' : 'staff';
  return NextResponse.redirect(`${origin}/auth/forgot-password?audience=${audience}&error=expired`);
}