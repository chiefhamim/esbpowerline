'use client';

import { Save, Loader2 } from 'lucide-react';
import { useCmsArticleEditor } from '@/components/cms/CmsArticleEditorContext';
import { ModernTooltip } from '@/components/shared/ModernTooltip';

export function CmsWriteHeaderActions() {
  const ctx = useCmsArticleEditor();
  if (!ctx) return null;

  const { loading, save } = ctx;

  return (
    <ModernTooltip label="Save draft" hint="Keeps your story in the editorial workspace" variant="editor" fast side="bottom">
      <button
        type="button"
        className="cms-header-save"
        disabled={loading}
        onClick={() => void save()}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
        ) : (
          <Save className="h-3 w-3" aria-hidden />
        )}
        <span>{loading ? 'Saving…' : 'Save'}</span>
      </button>
    </ModernTooltip>
  );
}