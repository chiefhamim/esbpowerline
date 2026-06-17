import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import {
  SITE_THEME_CRITICAL_CSS,
  SITE_THEME_INIT_SCRIPT,
  SITE_THEME_PAINT,
} from '@/lib/site-theme';
import { getServerSiteTheme, siteThemeHtmlClass } from '@/lib/site-theme-server';

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
  const paint = SITE_THEME_PAINT[theme];

  return (
    <html
      lang="en"
      className={siteThemeHtmlClass(theme)}
      data-site-theme={theme}
      style={{ backgroundColor: paint.background, color: paint.foreground }}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: SITE_THEME_CRITICAL_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: SITE_THEME_INIT_SCRIPT }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen bg-background text-foreground antialiased font-sans`}
        style={{ backgroundColor: paint.background, color: paint.foreground }}
      >
        <Providers>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}