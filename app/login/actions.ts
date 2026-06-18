'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ensureDemoStaffAccounts } from '@/lib/ensure-demo-accounts';
import {
  getAuthHandoffMessage,
  hostContextFromHeaders,
  isStaffRole,
  resolvePostLoginPath,
} from '@/lib/auth-routing';
import type { Role } from '@/lib/constants';
import { verifyUserCredentials } from '@/lib/verify-credentials';
import { createClient } from '@/utils/supabase/server';

export type AuthActionResult = {
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

function friendlyAuthError(message: string) {
  if (message === 'Invalid login credentials') {
    return 'Invalid email or password. Check your credentials and try again.';
  }
  return message;
}

/** Attach to staff login form: useActionState(loginAction, {}) */
export async function loginAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  try {
    const email = readField(formData, 'email');
    const password = readField(formData, 'password');

    if (!email || !password) {
      return { error: 'Email and password are required.' };
    }

    await ensureDemoStaffAccounts();

    // Verify credentials against Prisma User table first (role check)
    const user = await verifyUserCredentials(email, password);
    if (!user) {
      return { error: 'Invalid email or password. Check your credentials and try again.' };
    }

    if (!isStaffRole(user.role)) {
      return { error: 'This account is not authorized for staff access. Use member sign in instead.' };
    }

    // Establish Supabase session
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: friendlyAuthError(error.message) };
    }

    revalidatePath('/', 'layout');

    const headerStore = await headers();
    const hostContext = hostContextFromHeaders(
      headerStore.get('host'),
      headerStore.get('x-forwarded-proto'),
    );
    const callbackUrl = readField(formData, 'callbackUrl');
    const destination = resolvePostLoginPath(user.role as Role, {
      callbackUrl,
      audience: 'staff',
    }, hostContext);

    return {
      redirectTo: destination,
      handoffMessage: getAuthHandoffMessage(
        user.role as Role,
        'staff',
        destination,
        headerStore.get('host') ?? 'localhost:3000',
      ),
    };
  } catch (error) {
    console.error('[loginAction]', error);
    return { error: 'Sign-in failed. Please try again in a moment.' };
  }
}

/** Attach to staff sign-up form: useActionState(signupAction, {}) */
export async function signupAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = readField(formData, 'email');
  const password = readField(formData, 'password');
  const name = readField(formData, 'name');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: name ? { full_name: name, name } : undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');

  const callbackUrl = safeCallbackUrl(readField(formData, 'callbackUrl'));
  redirect(callbackUrl ?? '/admin');
}

/** Optional sign-out action for staff panels. */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}