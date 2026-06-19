import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Noto_Sans_Bengali, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import {
  SITE_THEME_CRITICAL_CSS,
  SITE_THEME_INIT_SCRIPT,
  SITE_THEME_PAINT,
} from '@/lib/site-theme';
import { getServerSiteTheme, siteThemeHtmlClass } from '@/lib/site-theme-server';
import { SITE_LOCALE_INIT_SCRIPT } from '@/lib/locale';
import { getServerSiteLocale } from '@/lib/locale-server';

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
  icons: { icon: '/favicon.ico' },
  openGraph: {
    siteName: 'ESB PowerLine',
    images: [{ url: '/og-image.png' }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getServerSiteTheme();
  const locale = await getServerSiteLocale();
  const paint = SITE_THEME_PAINT[theme];

  return (
    <html
      lang={locale}
      className={`${siteThemeHtmlClass(theme)}${locale === 'bn' ? ' locale-bn' : ''}`}
      data-site-theme={theme}
      data-site-locale={locale}
      style={{ backgroundColor: paint.background, color: paint.foreground }}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: SITE_THEME_CRITICAL_CSS }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${notoSansBengali.variable} min-h-screen bg-background text-foreground antialiased font-sans`}
        style={{ backgroundColor: paint.background, color: paint.foreground }}
      >
        <Script
          id="site-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: SITE_THEME_INIT_SCRIPT }}
        />
        <Script
          id="site-locale-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: SITE_LOCALE_INIT_SCRIPT }}
        />
        <Providers>
          {children}
          <Toaster
            position="top-center"
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