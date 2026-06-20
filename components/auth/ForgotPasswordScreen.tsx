'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Mail } from 'lucide-react';
import { LoginFrame, type LoginAudience } from '@/components/auth/LoginFrame';
import { StaffValuePanel } from '@/components/auth/StaffValuePanel';
import { MemberValuePanel } from '@/components/auth/MemberValuePanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  requestPasswordResetAction,
  type RequestPasswordResetResult,
} from '@/lib/actions/password-reset';
import { loginPathForAudience, parsePasswordResetAudience } from '@/lib/auth-redirect';

const INITIAL_STATE: RequestPasswordResetResult = {};

export function ForgotPasswordScreen() {
  const searchParams = useSearchParams();
  const audience: LoginAudience =
    parsePasswordResetAudience(searchParams.get('audience')) === 'member' ? 'member' : 'staff';
  const loginPath = loginPathForAudience(audience);
  const expired = searchParams.get('error') === 'expired';

  const [email, setEmail] = useState('');
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (state?.successMessage) setSubmitted(true);
  }, [state?.successMessage]);

  const isMember = audience === 'member';

  return (
    <LoginFrame audience={audience} brandAside={isMember ? <MemberValuePanel /> : <StaffValuePanel />}>
      <div className="login-access__body">
        <div className="login-access__staff">
          <span className="login-access__badge">{isMember ? 'Member access' : 'Staff access'}</span>
        </div>

        <div className="login-access__stack">
          <div className="login-access__intro">
            <h2 className="login-access__heading">Reset your password</h2>
            <p className="login-access__hint">
              Enter the email on your account. We will send a secure link to choose a new password.
            </p>
          </div>

          {expired && !submitted && (
            <div className="login-access__error" role="alert">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>That reset link has expired. Request a new one below.</span>
            </div>
          )}

          {submitted && state?.successMessage ? (
            <div
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100"
              role="status"
            >
              <p className="font-medium flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 shrink-0" />
                Check your email
              </p>
              <p>{state.successMessage}</p>
            </div>
          ) : (
            <form action={formAction} className="login-access__form">
              <input type="hidden" name="audience" value={audience} />

              <div className="login-access__field">
                <Label htmlFor="reset-email" className="login-access__label">
                  Email
                </Label>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={isMember ? 'you@company.com' : 'name@esbpowerline.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-access__input"
                  required
                />
              </div>

              {state?.error && (
                <div className="login-access__error" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                size="lg"
                variant="ghost"
                className="login-access__submit w-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending link…
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="login-access__alt text-center text-xs text-muted-foreground">
            <Link href={loginPath} className="inline-flex items-center gap-1 font-medium hover:underline">
              <ArrowLeft className="h-3 w-3" />
              Back to sign in
            </Link>
          </p>

          {!isMember && (
            <p className="login-access__alt text-center text-xs text-muted-foreground">
              Member account?{' '}
              <Link href="/auth/forgot-password?audience=member" className="font-medium hover:underline">
                Reset member password
              </Link>
            </p>
          )}

          {isMember && (
            <p className="login-access__alt text-center text-xs text-muted-foreground">
              Editorial or admin staff?{' '}
              <Link href="/auth/forgot-password?audience=staff" className="font-medium hover:underline">
                Reset staff password
              </Link>
            </p>
          )}
        </div>
      </div>
    </LoginFrame>
  );
}