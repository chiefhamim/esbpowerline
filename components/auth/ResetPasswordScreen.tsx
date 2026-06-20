'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { LoginFrame, type LoginAudience } from '@/components/auth/LoginFrame';
import { StaffValuePanel } from '@/components/auth/StaffValuePanel';
import { MemberValuePanel } from '@/components/auth/MemberValuePanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { completePasswordResetAction } from '@/lib/actions/password-reset';
import {
  loginPathForAudience,
  parsePasswordResetAudience,
  type PasswordResetAudience,
} from '@/lib/auth-redirect';
import { MIN_PASSWORD_LENGTH } from '@/lib/password-policy';

export function ResetPasswordScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const audience: PasswordResetAudience = parsePasswordResetAudience(searchParams.get('audience'));
  const loginAudience: LoginAudience = audience === 'member' ? 'member' : 'staff';
  const loginPath = loginPathForAudience(audience);
  const forgotPath = `/auth/forgot-password?audience=${audience}`;

  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();

    const verifySession = async () => {
      const { data } = await supabase.auth.getSession();
      setReady(!!data.session);
      setChecking(false);
    };

    void verifySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true);
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    startTransition(async () => {
      const result = await completePasswordResetAction({ newPassword, audience });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`${result.loginPath ?? loginPath}?reset=success`);
    });
  }

  const isMember = audience === 'member';

  return (
    <LoginFrame audience={loginAudience} brandAside={isMember ? <MemberValuePanel /> : <StaffValuePanel />}>
      <div className="login-access__body">
        <div className="login-access__staff">
          <span className="login-access__badge">{isMember ? 'Member access' : 'Staff access'}</span>
        </div>

        <div className="login-access__stack">
          <div className="login-access__intro">
            <h2 className="login-access__heading">Choose a new password</h2>
            <p className="login-access__hint">
              Pick a strong password you have not used on this site before.
            </p>
          </div>

          {checking ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying reset link…
            </div>
          ) : !ready ? (
            <div className="space-y-4">
              <div className="login-access__error" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>This reset link is invalid or has expired.</span>
              </div>
              <Link href={forgotPath} className="login-access__submit w-full inline-flex items-center justify-center gap-2">
                Request a new link
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="login-access__form">
              <div className="login-access__field">
                <Label htmlFor="new-password" className="login-access__label">
                  New password
                </Label>
                <div className="login-access__password">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={MIN_PASSWORD_LENGTH}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="login-access__input login-access__input--password"
                    required
                  />
                  <button
                    type="button"
                    className="login-access__reveal"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="login-access__field">
                <Label htmlFor="confirm-password" className="login-access__label">
                  Confirm password
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="login-access__input"
                  required
                />
              </div>

              {error && (
                <div className="login-access__error" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={pending}
                size="lg"
                variant="ghost"
                className="login-access__submit w-full"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Update password
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
        </div>
      </div>
    </LoginFrame>
  );
}