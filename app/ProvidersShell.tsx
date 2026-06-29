import { Providers } from '@/app/providers';
import { getServerSiteLocale } from '@/lib/locale-server';

export async function ProvidersShell({ children }: { children: React.ReactNode }) {
  const initialLocale = await getServerSiteLocale();
  return <Providers initialLocale={initialLocale}>{children}</Providers>;
}