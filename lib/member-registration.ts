/** New member accounts require admin activation in production; auto-active in development. */
export function initialMemberStatus(): 'ACTIVE' | 'PENDING' {
  return process.env.NODE_ENV === 'production' ? 'PENDING' : 'ACTIVE';
}

export const MEMBER_PENDING_LOGIN_MESSAGE =
  'Your account is pending verification. You will be able to sign in once an administrator activates it.';

export const MEMBER_PENDING_SIGNUP_MESSAGE =
  'Account created. Your registration is pending verification — sign in once your account is activated.';