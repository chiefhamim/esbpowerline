export const MIN_PASSWORD_LENGTH = 8;

export function validateNewPassword(password: string): string | null {
  const value = password?.trim();
  if (!value) return 'Password is required';
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}