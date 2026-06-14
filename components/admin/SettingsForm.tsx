'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateSetting } from '@/lib/actions/settings';

interface SettingsFormProps {
  settings: Record<string, unknown>;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const site = (settings.site as Record<string, string>) ?? {};
  const seo = (settings.seo as Record<string, string>) ?? {};
  const hero = (settings.hero as Record<string, string>) ?? {};

  const [siteName, setSiteName] = useState(site.name ?? 'ESB PowerLine');
  const [tagline, setTagline] = useState(site.tagline ?? "Bangladesh's premier energy news portal");
  const [metaTitle, setMetaTitle] = useState(seo.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(seo.metaDescription ?? '');
  const [heroTitle, setHeroTitle] = useState(hero.title ?? '');
  const [heroSubtitle, setHeroSubtitle] = useState(hero.subtitle ?? '');
  const [heroImage, setHeroImage] = useState(hero.imageUrl ?? '');

  async function handleSave() {
    setLoading(true);
    try {
      await updateSetting('site', { name: siteName, tagline });
      await updateSetting('seo', { metaTitle, metaDescription });
      await updateSetting('hero', { title: heroTitle, subtitle: heroSubtitle, imageUrl: heroImage });
      toast.success('Settings saved');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">Site Configuration</h2>
        <div><Label>Site Name</Label><Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-1" /></div>
        <div><Label>Tagline</Label><Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1" /></div>
      </div>
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">SEO Defaults</h2>
        <div><Label>Meta Title</Label><Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="mt-1" /></div>
        <div><Label>Meta Description</Label><Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="mt-1" rows={3} /></div>
      </div>
      <div className="card p-6 space-y-4 lg:col-span-2">
        <h2 className="font-semibold">Homepage Hero</h2>
        <div><Label>Hero Title</Label><Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="mt-1" /></div>
        <div><Label>Hero Subtitle</Label><Textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="mt-1" rows={2} /></div>
        <div><Label>Hero Image URL</Label><Input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="mt-1" /></div>
      </div>
      <Button onClick={handleSave} disabled={loading} className="lg:col-span-2 w-fit">
        {loading ? 'Saving…' : 'Save Settings'}
      </Button>
    </div>
  );
}