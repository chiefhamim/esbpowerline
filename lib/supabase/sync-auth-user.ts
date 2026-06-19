import 'server-only';

import type { Role } from '@/lib/constants';
import { createServiceRoleClient } from '@/lib/supabase/admin-client';

type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

type SyncAuthUserInput = {
  email: string;
  password: string;
  name: string;
  role: Role;
  status?: UserStatus;
};

type SyncMetadataInput = {
  email: string;
  name: string;
  role: Role;
  status?: UserStatus;
};

async function findUserIdByEmail(admin: NonNullable<ReturnType<typeof createServiceRoleClient>>, email: string) {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
}

function buildMetadata(input: { name: string; role: Role; status?: UserStatus }) {
  return {
    role: input.role,
    name: input.name,
    full_name: input.name,
    status: input.status ?? 'ACTIVE',
  };
}

async function syncProfilesRow(
  admin: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  userId: string,
  input: { name: string; role: Role; status?: UserStatus },
) {
  const { error } = await admin.from('profiles').upsert({
    id: userId,
    full_name: input.name,
    role: input.role,
    status: input.status ?? 'ACTIVE',
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.warn('[syncProfilesRow] profiles upsert skipped:', error.message);
  }
}

/** Create or update a Supabase Auth user with role metadata (service role required). */
export async function upsertSupabaseAuthUser(input: SyncAuthUserInput): Promise<string | null> {
  const admin = createServiceRoleClient();
  if (!admin) {
    console.warn('[upsertSupabaseAuthUser] Supabase service role not configured — skipping sync');
    return null;
  }

  const metadata = buildMetadata(input);

  const { error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (!createError) {
    const createdId = await findUserIdByEmail(admin, input.email);
    if (createdId) await syncProfilesRow(admin, createdId, input);
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

  await syncProfilesRow(admin, userId, input);
  return userId;
}

/** Update Supabase Auth metadata when Prisma user profile changes (no password change). */
export async function syncSupabaseAuthUserMetadata(input: SyncMetadataInput): Promise<void> {
  const admin = createServiceRoleClient();
  if (!admin) {
    console.warn('[syncSupabaseAuthUserMetadata] Supabase service role not configured — skipping sync');
    return;
  }

  const userId = await findUserIdByEmail(admin, input.email);
  if (!userId) {
    throw new Error(`Supabase user not found for metadata sync: ${input.email}`);
  }

  const metadata = buildMetadata(input);
  const { error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });
  if (error) throw error;

  await syncProfilesRow(admin, userId, input);
}

/** Mirror account status to Supabase Auth + profiles (e.g. suspend). */
export async function syncSupabaseAuthUserStatus(email: string, status: UserStatus): Promise<void> {
  const admin = createServiceRoleClient();
  if (!admin) return;

  const userId = await findUserIdByEmail(admin, email);
  if (!userId) return;

  const { data: existing } = await admin.auth.admin.getUserById(userId);
  const meta = existing.user?.user_metadata ?? {};

  const { error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...meta,
      status,
    },
  });
  if (error) throw error;

  const { error: profileError } = await admin
    .from('profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (profileError) {
    console.warn('[syncSupabaseAuthUserStatus] profiles update skipped:', profileError.message);
  }
}