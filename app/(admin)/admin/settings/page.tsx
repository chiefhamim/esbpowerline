import { AdminPageHeader, AdminSectionStack } from '@/components/admin/AdminUI';
import { AdminForbidden } from '@/components/admin/AdminForbidden';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { getSettings } from '@/lib/actions/settings';
import { getPublishedArticlePickerList } from '@/lib/coverage-content';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { Settings } from 'lucide-react';

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'settings.view')) {
    return <AdminForbidden title="Settings restricted" description="Only Admins and Super Admins can manage platform settings." />;
  }

  const [settings, articlePickerList] = await Promise.all([
    getSettings(),
    getPublishedArticlePickerList(),
  ]);
  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={Settings}
        title="Settings"
        description="Site configuration, SEO defaults, homepage hero, and All Coverage mosaic."
      />
      <SettingsForm settings={settings} articlePickerList={articlePickerList} />
    </AdminSectionStack>
  );
}