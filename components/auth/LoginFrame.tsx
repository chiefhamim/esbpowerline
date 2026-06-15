import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandDeck } from '@/components/shared/BrandDeck';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { OfficialSocialLinks } from '@/components/shared/OfficialSocialLinks';
import { SiteThemeToggle } from '@/components/shared/SiteThemeToggle';
import { cn } from '@/lib/utils';

export type LoginAudience = 'staff' | 'member';

export function LoginFrame({
  children,
  audience = 'staff',
}: {
  children: ReactNode;
  audience?: LoginAudience;
}) {
  return (
    <div className={cn('login-shell', audience === 'member' ? 'login-shell--member' : 'login-shell--staff')}>
      <div className="login-frame">
        <header className="login-frame__bar">
          <Link href="/" className="login-frame__back">
            <ArrowLeft className="h-3.5 w-3.5" />
            esbpowerline.com
          </Link>
          <SiteThemeToggle />
        </header>

        <div className="login-frame__split">
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

          <main className="login-access">{children}</main>
        </div>
      </div>
    </div>
  );
}