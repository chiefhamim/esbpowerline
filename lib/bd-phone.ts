/** Normalize Bangladesh mobile input to E.164 (+8801XXXXXXXXX). */
export function normalizeBdPhone(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('880')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);

  if (digits.length !== 10 || !digits.startsWith('1')) return null;
  return `+880${digits}`;
}

export function isValidBdPhone(phone: string): boolean {
  return /^\+8801[3-9]\d{8}$/.test(phone);
}

export function formatBdPhoneDisplay(phone: string): string {
  const normalized = normalizeBdPhone(phone) ?? phone;
  if (!normalized.startsWith('+880') || normalized.length !== 14) return phone;
  const local = `0${normalized.slice(4)}`;
  return `${local.slice(0, 3)} ${local.slice(3, 7)} ${local.slice(7)}`;
}

/** Internal email for phone-only member accounts. */
export function phoneMemberEmail(normalizedPhone: string): string {
  const digits = normalizedPhone.replace(/\D/g, '');
  return `${digits}@phone.esbpowerline.local`;
}