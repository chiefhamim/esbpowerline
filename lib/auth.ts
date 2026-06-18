import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import type { Role } from '@/lib/constants';

export type AuthSession = {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    image?: string | null;
  };
} | null;

/**
 * Server-side auth check — replaces NextAuth's `auth()`.
 * Returns a session-like object with user data from Supabase Auth + Prisma User table.
 */
export async function auth(): Promise<AuthSession> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Look up the Prisma User by email for role/name data
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email ?? '' },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });

  if (!dbUser) return null;

  return {
    user: {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role as Role,
      image: dbUser.avatar ?? null,
    },
  };
}

/**
 * Server-side sign-out — clears Supabase session.
 * Accepts options for compatibility with call sites that passed { redirect: false }.
 */
export async function signOut(_options?: { redirect?: boolean }) {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**
 * Server-side sign-in with email/password via Supabase Auth.
 * Accepts a provider string (ignored — always uses password) and credentials.
 */
export async function signIn(
  _provider: string,
  credentials: { email?: string; identifier?: string; password: string; redirect?: boolean },
) {
  const email = credentials.email ?? credentials.identifier ?? '';
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: credentials.password,
  });
  if (error) {
    throw error;
  }
}

export { roleHomePath as getRedirectForRole } from '@/lib/auth-routing';