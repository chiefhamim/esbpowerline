'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield,
  PenLine,
} from 'lucide-react';
import { DEMO_PASSWORD } from '@/lib/demo-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthHandoffOverlay } from '@/components/auth/AuthHandoffOverlay';
import { LoginFrame } from '@/components/auth/LoginFrame';
import { StaffValuePanel } from '@/components/auth/StaffValuePanel';
import { loginAction, type AuthActionResult } from '@/app/login/actions';

const STAFF_ACCOUNTS = [
  { role: 'Admin', email: 'admin@esbpowerline.com', icon: Shield },
  { role: 'Editor', email: 'editor@esbpowerline.com', icon: PenLine },
] as const;

const INITIAL_STATE: AuthActionResult = {};

export function StaffLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState('');
  const [handoffMessage, setHandoffMessage] = useState<string | null>(null);
  const pendingRedirect = useRef<string | null>(null);
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '';

  useEffect(() => {
    if (state?.error) {
      setError(state.error);
      setHandoffMessage(null);
      pendingRedirect.current = null;
      return;
    }

    if (state?.redirectTo) {
      pendingRedirect.current = state.redirectTo;
      setHandoffMessage(state.handoffMessage ?? 'Opening your workspace…');
    }
  }, [state]);

  useEffect(() => {
    if (!handoffMessage || !pendingRedirect.current) return;

    const destination = pendingRedirect.current;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.location.assign(destination);
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [handoffMessage]);

  function selectStaffEmail(accountEmail: string) {
    setEmail(accountEmail);
    setPassword(DEMO_PASSWORD);
    setError('');
  }

  function clearError() {
    if (error) setError('');
  }

  return (
    <>
    <LoginFrame audience="staff" brandAside={<StaffValuePanel />}>
      <div className="login-access__body">
        <div className="login-access__staff">
          <span className="login-access__badge">Staff access</span>
        </div>

        <div className="login-access__stack">
          <div className="login-access__intro">
            <h2 className="login-access__heading">Staff sign in</h2>
            <p className="login-access__hint">
              Admins open the admin dashboard; editors open the CMS workspace.
            </p>
          </div>

          <form action={formAction} className="login-access__form">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div className="login-access__field">
              <Label htmlFor="email" className="login-access__label">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@esbpowerline.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                className="login-access__input"
                required
              />
            </div>

            <div className="login-access__field">
              <Label htmlFor="password" className="login-access__label">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
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
              disabled={isPending}
              size="lg"
              variant="ghost"
              className="login-access__submit w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="login-contributors">
            <div className="login-contributors__header">
              <p className="login-contributors__title">Demo accounts</p>
              <p className="login-contributors__hint">Tap to fill email</p>
            </div>
            <ul className="login-contributors__rows">
              {STAFF_ACCOUNTS.map((account) => {
                const Icon = account.icon;
                const isActive = email === account.email;

                return (
                  <li key={account.email}>
                    <button
                      type="button"
                      className={cn(
                        'login-contributors__row',
                        isActive && 'login-contributors__row--active',
                      )}
                      onClick={() => selectStaffEmail(account.email)}
                    >
                      <span className="login-contributors__icon" aria-hidden>
                        <Icon />
                      </span>
                      <span className="login-contributors__meta">
                        <span className="login-contributors__badge">{account.role}</span>
                        <span className="login-contributors__email">{account.email}</span>
                      </span>
                      <ArrowRight className="login-contributors__arrow" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="login-access__alt login-staff-access__footer text-center text-xs text-muted-foreground">
            Looking for member access?{' '}
            <Link href="/members/login" className="login-staff-access__member-link">
              Member sign in
            </Link>
          </p>
        </div>
      </div>
    </LoginFrame>
    {handoffMessage ? <AuthHandoffOverlay message={handoffMessage} /> : null}
    </>
  );
}