import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/shared/PublicNavbar';
import { PublicFooter } from '@/components/shared/PublicFooter';
import { getPublicCategories } from '@/lib/category-content';
import { getPublicSettingsMap } from '@/lib/homepage-content';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettingsMap();
  const site = settings.site as { name?: string; tagline?: string } | undefined;
  const seo = settings.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return {
    ...(seo?.metaTitle ? { title: seo.metaTitle } : {}),
    description: seo?.metaDescription ?? site?.tagline,
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getPublicCategories();

  return (
    <>
      <PublicNavbar categories={categories} />
      {children}
      <PublicFooter categories={categories} />
    </>
  );
}