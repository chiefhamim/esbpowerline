'use server';

import { auth } from '@/lib/auth';
import {
  authContinuePath,
  buildHandoffUrl,
  createHandoffToken,
  needsAuthHandoff,
} from '@/lib/auth-handoff';

/** Resolve a post-login destination, adding a cross-origin Supabase handoff when needed. */
export async function resolveAuthDestinationAction(
  destination: string,
  currentHost: string,
): Promise<string> {
  if (!needsAuthHandoff(destination, currentHost)) return destination;

  const session = await auth();
  if (!session?.user?.id) {
    return authContinuePath(destination);
  }

  const token = await createHandoffToken();
  if (!token) {
    return authContinuePath(destination);
  }

  return buildHandoffUrl(destination, token);
}