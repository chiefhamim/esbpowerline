const INSECURE_AUTH_SECRET = 'dev-secret-change-in-prod';

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET?.trim();
  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret === INSECURE_AUTH_SECRET) {
      throw new Error(
        'AUTH_SECRET must be set to a strong random value in production (openssl rand -base64 32).',
      );
    }
    return secret;
  }
  return secret || INSECURE_AUTH_SECRET;
}