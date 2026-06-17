import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { normalizeBdPhone } from '@/lib/bd-phone';
import prisma from '@/lib/prisma';
import { authConfig } from '@/lib/auth.config';
import type { Role } from '@/lib/constants';

async function findUserByLoginId(loginId: string) {
  const trimmed = loginId.trim();
  if (!trimmed) return null;

  if (trimmed.includes('@')) {
    return prisma.user.findUnique({ where: { email: trimmed.toLowerCase() } });
  }

  const phone = normalizeBdPhone(trimmed);
  if (phone) {
    return prisma.user.findUnique({ where: { phone } });
  }

  return prisma.user.findUnique({ where: { email: trimmed.toLowerCase() } });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        identifier: { label: 'Email or phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const loginId = (credentials?.identifier ?? credentials?.email) as string | undefined;
        if (!loginId || !credentials?.password) return null;

        const user = await findUserByLoginId(loginId);

        if (!user || user.status !== 'ACTIVE') return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as Role,
        };
      },
    }),
  ],
});

export async function getServerSession() {
  return auth();
}

export { roleHomePath as getRedirectForRole } from '@/lib/auth-routing';