import 'server-only';

import type { Role } from '@/lib/constants';
import { createServiceRoleClient } from '@/lib/supabase/admin-client';

type SyncAuthUserInput = {
  email: string;
  password: string;
  name: string;
  role: Role;
};

async function findUserIdByEmail(admin: NonNullable<ReturnType<typeof createServiceRoleClient>>, email: string) {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
}

/** Create or update a Supabase Auth user with role metadata (service role required). */
export async function upsertSupabaseAuthUser(input: SyncAuthUserInput): Promise<string | null> {
  const admin = createServiceRoleClient();
  if (!admin) {
    console.warn('[upsertSupabaseAuthUser] Supabase service role not configured — skipping sync');
    return null;
  }

  const metadata = {
    role: input.role,
    name: input.name,
    full_name: input.name,
  };

  const { error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (!createError) {
    const createdId = await findUserIdByEmail(admin, input.email);
    return createdId;
  }

  if (!createError.message.toLowerCase().includes('already')) {
    throw createError;
  }

  const userId = await findUserIdByEmail(admin, input.email);
  if (!userId) {
    throw new Error(`Supabase user exists but could not be found: ${input.email}`);
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password: input.password,
    email_confirm: true,
    user_metadata: metadata,
  });
  if (updateError) throw updateError;

  return userId;
}