'use server';

import { auth } from '@/lib/auth';
import {
  authContinuePath,
  buildHandoffUrl,
  createHandoffToken,
  needsAuthHandoff,
} from '@/lib/auth-handoff';

/** Resolve a post-login destination, adding a cross-origin handoff when needed. */
export async function resolveAuthDestinationAction(
  destination: string,
  currentHost: string,
): Promise<string> {
  if (!needsAuthHandoff(destination, currentHost)) return destination;

  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.email || !user.role) {
    return authContinuePath(destination);
  }

  const token = await createHandoffToken({
    id: user.id,
    email: user.email,
    name: user.name ?? 'User',
    role: user.role,
  });

  return buildHandoffUrl(destination, token);
}