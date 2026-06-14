'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError('Invalid credentials or account not active');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6">
      <div className="w-full max-w-[380px]">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.02em]">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            ESB PowerLine
          </div>
        </div>

        <div className="auth-card">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-1">Access the CMS or Admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium tracking-wide text-muted-foreground">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1.5 bg-background border border-input rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wide text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1.5 bg-background border border-input rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {error && <div className="text-destructive text-sm">{error}</div>}

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-full py-3 text-[15px] mt-2 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in securely'}
            </button>
          </form>

          {/* Demo accounts removed */}
        </div>
      </div>
    </div>
  );
}