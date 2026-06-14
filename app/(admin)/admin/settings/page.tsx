import { PageHeader } from '@/components/dashboard/PageHeader';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { getSettings } from '@/lib/actions/settings';

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <PageHeader title="Settings" description="Site configuration, SEO defaults, and homepage hero management" />
      <SettingsForm settings={settings} />
    </div>
  );
}