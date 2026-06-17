'use server';

import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { signIn, signOut } from '@/lib/auth';
import { registerMemberAction } from '@/lib/actions/member-register';
import { ensureDemoMemberAccount } from '@/lib/ensure-demo-accounts';
import { verifyUserCredentials } from '@/lib/verify-credentials';

export type MemberAuthResult = {
  error?: string;
  redirectTo?: string;
  handoffMessage?: string;
};

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function safeCallbackUrl(raw: string) {
  if (!raw.startsWith('/')) return null;
  if (raw.startsWith('//')) return null;
  return raw;
}

function memberLoginFailure(message: string): MemberAuthResult {
  return { error: message };
}

async function establishMemberSession(
  identifier: string,
  password: string,
): Promise<MemberAuthResult | null> {
  await signOut({ redirect: false });

  const user = await verifyUserCredentials(identifier, password);
  if (!user) {
    return memberLoginFailure(
      'Invalid phone, email, or password. Check your details and try again.',
    );
  }

  if (user.role !== 'SUBSCRIBER') {
    return memberLoginFailure('This account is not a member account. Use staff sign in instead.');
  }

  try {
    await signIn('credentials', {
      identifier,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return memberLoginFailure(
        'Invalid phone, email, or password. Check your details and try again.',
      );
    }
    throw error;
  }

  return null;
}

/** Member sign-in — useActionState(memberLoginAction, {}) */
export async function memberLoginAction(
  _prevState: MemberAuthResult,
  formData: FormData,
): Promise<MemberAuthResult> {
  try {
    const identifier = readField(formData, 'identifier');
    const password = readField(formData, 'password');

    if (!identifier || !password) {
      return memberLoginFailure('Email and password are required.');
    }

    await ensureDemoMemberAccount();

    const authError = await establishMemberSession(identifier, password);
    if (authError) return authError;

    revalidatePath('/', 'layout');

    const callbackUrl = safeCallbackUrl(readField(formData, 'callbackUrl'));
    return {
      redirectTo: callbackUrl ?? '/members',
      handoffMessage: 'Opening your library…',
    };
  } catch (error) {
    console.error('[memberLoginAction]', error);
    return memberLoginFailure('Sign-in failed. Please try again in a moment.');
  }
}

/** Member sign-up then sign-in — useActionState(memberSignUpAction, {}) */
export async function memberSignUpAction(
  _prevState: MemberAuthResult,
  formData: FormData,
): Promise<MemberAuthResult> {
  try {
    const name = readField(formData, 'name');
    const phone = readField(formData, 'phone');
    const email = readField(formData, 'email');
    const password = readField(formData, 'password');

    const registerResult = await registerMemberAction({
      name,
      phone,
      email: email || undefined,
      password,
    });

    if (!registerResult.ok) {
      return memberLoginFailure(registerResult.error);
    }

    const authError = await establishMemberSession(registerResult.email, password);
    if (authError) return authError;

    revalidatePath('/', 'layout');

    const callbackUrl = safeCallbackUrl(readField(formData, 'callbackUrl'));
    return {
      redirectTo: callbackUrl ?? '/members',
      handoffMessage: 'Opening your library…',
    };
  } catch (error) {
    console.error('[memberSignUpAction]', error);
    return memberLoginFailure('Could not create your account. Please try again.');
  }
}