import type { Metadata } from 'next';

import { Inter, Noto_Sans_Bengali, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import { SITE_THEME_CRITICAL_CSS, SITE_THEME_INIT_SCRIPT } from '@/lib/site-theme';
import { SITE_LOCALE_INIT_SCRIPT } from '@/lib/locale';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ESB PowerLine — Bangladesh Energy & Power News',
    template: '%s | ESB PowerLine',
  },
  description: "Bangladesh's premier source for power sector news, renewable energy, policy, projects & tenders, grid explorer, and the monthly magazine.",
  icons: { icon: '/images/fav-icon.png' },
  openGraph: {
    siteName: 'ESB PowerLine',
    images: [{ url: '/og-image.png' }],
  },
};

/**
 * Static root shell — theme/locale personalization is applied client-side
 * via beforeInteractive scripts + SiteThemeProvider / LocaleProvider.
 * Do not read cookies() here; it would force the entire tree dynamic.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="theme-midnight dark"
      data-site-theme="midnight"
      data-site-locale="en"
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: SITE_THEME_CRITICAL_CSS }} suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: SITE_THEME_INIT_SCRIPT }} suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: SITE_LOCALE_INIT_SCRIPT }} suppressHydrationWarning />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${notoSansBengali.variable} min-h-screen bg-background text-foreground antialiased font-sans`}
      >

        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster
            position="bottom-right"
            closeButton
            toastOptions={{
              classNames: {
                toast: 'cms-toast',
                title: 'cms-toast__title',
                description: 'cms-toast__description',
                success: 'cms-toast--success',
                error: 'cms-toast--error',
                info: 'cms-toast--info',
                closeButton: 'cms-toast__close',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}