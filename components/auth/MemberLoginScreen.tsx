'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Bookmark,
  BookOpen,
  Download,
  MessageSquare,
  BarChart3,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginFrame } from '@/components/auth/LoginFrame';
import { resolvePostLoginPath } from '@/lib/auth-routing';

const MEMBER_BENEFITS = [
  { icon: Bookmark, label: 'Save articles for later reading' },
  { icon: BookOpen, label: 'Access magazine issues & archives' },
  { icon: Download, label: 'Download data packages & reports' },
  { icon: MessageSquare, label: 'Comment and join discussions' },
  { icon: BarChart3, label: 'Unlock in-depth analysis & datasets' },
] as const;

const DEMO_MEMBER = {
  role: 'Member',
  email: 'member@esbpowerline.com',
  icon: UserRound,
} as const;

export function MemberLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', { email, password, redirect: false });

    if (res?.error) {
      setError('Invalid email or password. Check your credentials and try again.');
      setLoading(false);
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;
    const destination = resolvePostLoginPath(role, { callbackUrl, audience: 'member' }, {
      hostname: window.location.hostname,
      host: window.location.host,
      protocol: window.location.protocol,
    });

    router.push(destination);
    setLoading(false);
  }

  function selectMemberEmail(accountEmail: string) {
    setEmail(accountEmail);
    setError('');
  }

  const DemoIcon = DEMO_MEMBER.icon;
  const demoActive = email === DEMO_MEMBER.email;

  return (
    <LoginFrame>
      <div className="login-access__body">
        <div className="login-access__staff">
          <span className="login-access__badge">Member access</span>
        </div>

        <div className="login-access__stack">
          <div className="login-access__intro">
            <h2 className="login-access__heading">Member sign in</h2>
            <p className="login-access__hint">
              One account for saving coverage, downloading data, commenting, and deeper sector analysis.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-access__form">
            <div className="login-access__field">
              <Label htmlFor="member-email" className="login-access__label">Email</Label>
              <Input
                id="member-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-access__input"
                required
              />
            </div>

            <div className="login-access__field">
              <Label htmlFor="member-password" className="login-access__label">Password</Label>
              <div className="login-access__password">
                <Input
                  id="member-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && (
              <div className="login-access__error" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} size="lg" className="login-access__submit w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="login-member-panel">
            <p className="login-member-panel__title">What members get</p>
            <ul className="login-member-panel__benefits">
              {MEMBER_BENEFITS.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <li key={benefit.label} className="login-member-panel__benefit">
                    <span className="login-member-panel__icon" aria-hidden>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{benefit.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="login-contributors">
            <div className="login-contributors__header">
              <p className="login-contributors__title">Demo account</p>
              <p className="login-contributors__hint">Tap to fill email</p>
            </div>
            <ul className="login-contributors__rows">
              <li>
                <button
                  type="button"
                  className={cn(
                    'login-contributors__row',
                    demoActive && 'login-contributors__row--active',
                  )}
                  onClick={() => selectMemberEmail(DEMO_MEMBER.email)}
                >
                  <span className="login-contributors__icon" aria-hidden>
                    <DemoIcon />
                  </span>
                  <span className="login-contributors__meta">
                    <span className="login-contributors__badge">{DEMO_MEMBER.role}</span>
                    <span className="login-contributors__email">{DEMO_MEMBER.email}</span>
                  </span>
                  <ArrowRight className="login-contributors__arrow" aria-hidden />
                </button>
              </li>
            </ul>
          </div>

          <p className="login-access__alt text-center text-xs text-muted-foreground">
            Editorial or admin staff?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Staff sign in
            </Link>
          </p>
        </div>
      </div>
    </LoginFrame>
  );
}