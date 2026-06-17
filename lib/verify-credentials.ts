import 'server-only';

import bcrypt from 'bcryptjs';
import { normalizeBdPhone } from '@/lib/bd-phone';
import type { Role } from '@/lib/constants';
import prisma from '@/lib/prisma';

export type VerifiedUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

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

/** Validate login id + password against Prisma — source of truth for role checks. */
export async function verifyUserCredentials(
  loginId: string,
  password: string,
): Promise<VerifiedUser | null> {
  if (!loginId.trim() || !password) return null;

  const user = await findUserByLoginId(loginId);
  if (!user || user.status !== 'ACTIVE') return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  };
}