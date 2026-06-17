'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import {
  formatBdPhoneDisplay,
  isValidBdPhone,
  normalizeBdPhone,
  phoneMemberEmail,
} from '@/lib/bd-phone';

export type MemberRegisterResult =
  | { ok: true; email: string }
  | { ok: false; error: string };

export async function registerMemberAction(input: {
  name: string;
  phone: string;
  email?: string;
  password: string;
}): Promise<MemberRegisterResult> {
  const name = input.name.trim();
  const password = input.password;
  const emailRaw = input.email?.trim().toLowerCase() ?? '';

  if (name.length < 2) {
    return { ok: false, error: 'Enter your full name.' };
  }
  if (password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' };
  }

  const phone = normalizeBdPhone(input.phone);
  if (!phone || !isValidBdPhone(phone)) {
    return {
      ok: false,
      error: 'Enter a valid Bangladesh mobile number (e.g. 01712 345678).',
    };
  }

  const email = emailRaw || phoneMemberEmail(phone);

  if (emailRaw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
    return { ok: false, error: 'Enter a valid email address or leave it blank.' };
  }

  const [existingEmail, existingPhone] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { phone } }),
  ]);

  if (existingPhone) {
    return {
      ok: false,
      error: `This number is already registered (${formatBdPhoneDisplay(phone)}). Sign in instead.`,
    };
  }

  if (existingEmail) {
    return { ok: false, error: 'This email is already registered. Sign in instead.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: 'SUBSCRIBER',
      status: 'ACTIVE',
    },
  });

  return { ok: true, email };
}