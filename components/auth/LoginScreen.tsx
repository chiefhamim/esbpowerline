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
  ArrowLeft,
  Shield,
  PenLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrandDeck } from '@/components/shared/BrandDeck';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { OfficialSocialLinks } from '@/components/shared/OfficialSocialLinks';
import { SiteThemeToggle } from '@/components/shared/SiteThemeToggle';

const STAFF_ACCOUNTS = [
  { role: 'Admin', email: 'admin@esbpowerline.com', icon: Shield },
  { role: 'Editor', email: 'editor@esbpowerline.com', icon: PenLine },
] as const;

export function LoginScreen() {
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

    if (callbackUrl) {
      router.push(callbackUrl);
    } else {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const host = window.location.host;
      if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
        if (isLocal) {
          router.push('http://localhost:3002/admin');
        } else {
          const baseDomain = host.replace(/^(cms\.|admin\.)/, '');
          router.push(`${window.location.protocol}//admin.${baseDomain}/admin`);
        }
      } else {
        if (isLocal) {
          router.push('http://localhost:3001/cms');
        } else {
          const baseDomain = host.replace(/^(cms\.|admin\.)/, '');
          router.push(`${window.location.protocol}//cms.${baseDomain}/cms`);
        }
      }
    }
    setLoading(false);
  }

  function selectStaffEmail(accountEmail: string) {
    setEmail(accountEmail);
    setError('');
  }

  return (
    <div className="login-shell">
      <div className="login-frame">
        <header className="login-frame__bar">
          <Link href="/" className="login-frame__back">
            <ArrowLeft className="h-3.5 w-3.5" />
            esbpowerline.com
          </Link>
          <SiteThemeToggle />
        </header>

        <div className="login-frame__split">
          {/* Brand — dot texture, editorial voice */}
          <aside className="login-brand">
            <div className="login-brand__wash" aria-hidden />
            <div className="login-brand__texture hero-dot-pattern" aria-hidden />
            <div className="login-brand__body">
              <div className="login-brand__content">
                <BrandLogo
                  href="/"
                  priority
                  frameClassName="login-brand__logo-frame login-brand__logo-frame--hero"
                  imageClassName="login-brand__logo-img login-brand__logo-img--hero"
                />
                <span className="login-brand__rule" aria-hidden />
                <BrandDeck />
              </div>

              <footer className="login-brand__meta">
                <OfficialSocialLinks variant="compact" className="login-brand__social" />
                <span className="login-brand__publisher">ESB Media Limited</span>
                <span className="login-brand__location">Mirpur, Dhaka · Bangladesh</span>
              </footer>
            </div>
          </aside>

          {/* Access — task-focused, no nested cards */}
          <main className="login-access">
            <div className="login-access__body">
              <div className="login-access__staff">
                <span className="login-access__badge">Staff access</span>
              </div>

              <div className="login-access__stack">
                <div className="login-access__intro">
                  <h2 className="login-access__heading">Sign in</h2>
                  <p className="login-access__hint">
                    Use your organisation email. You&apos;ll be routed to the admin dashboard or CMS by role.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="login-access__form">
                <div className="login-access__field">
                  <Label htmlFor="email" className="login-access__label">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@esbpowerline.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-access__input"
                    required
                  />
                </div>

                <div className="login-access__field">
                  <Label htmlFor="password" className="login-access__label">Password</Label>
                  <div className="login-access__password">
                    <Input
                      id="password"
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
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}