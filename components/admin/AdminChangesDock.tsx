'use client';

import { useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  RefreshCw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminChangeQueue } from '@/components/admin/AdminChangeQueueProvider';

function formatDetail(detail: string) {
  if (detail.length <= 72) return detail;
  return `${detail.slice(0, 69)}…`;
}

export function AdminChangesDock() {
  const {
    changes,
    count,
    hasChanges,
    saving,
    dockOpen,
    setDockOpen,
    removeChange,
    discardAll,
    saveAll,
  } = useAdminChangeQueue();

  useEffect(() => {
    if (!hasChanges) setDockOpen(false);
  }, [hasChanges, setDockOpen]);

  if (!hasChanges) return null;

  return (
    <>
      <button
        type="button"
        className={cn('admin-changes-dock-tab', dockOpen && 'admin-changes-dock-tab--open')}
        onClick={() => setDockOpen(!dockOpen)}
        aria-expanded={dockOpen}
        aria-controls="admin-changes-dock-panel"
        title={`${count} pending change${count === 1 ? '' : 's'}`}
      >
        <Layers className="h-4 w-4 shrink-0" strokeWidth={2.1} />
        <span className="admin-changes-dock-tab__count">{count}</span>
        <span className="admin-changes-dock-tab__label">Changes</span>
        {dockOpen ? (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 shrink-0 opacity-60" />
        )}
      </button>

      <aside
        id="admin-changes-dock-panel"
        className={cn('admin-changes-dock', dockOpen && 'admin-changes-dock--open')}
        aria-label="Pending admin changes"
      >
        <div className="admin-changes-dock__header">
          <div>
            <p className="admin-changes-dock__eyebrow">Change pipeline</p>
            <h2 className="admin-changes-dock__title">
              {count} pending change{count === 1 ? '' : 's'}
            </h2>
          </div>
          <button
            type="button"
            className="admin-changes-dock__close ui-close-btn"
            onClick={() => setDockOpen(false)}
            aria-label="Collapse change panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="admin-changes-dock__hint">
          Changes stack here until you save or discard. Remove any accidental edits before committing.
        </p>

        <ul className="admin-changes-dock__list">
          {changes.map((change) => (
            <li key={change.id} className="admin-changes-dock__item">
              <div className="admin-changes-dock__item-main">
                <div className="admin-changes-dock__item-meta">
                  <span className="admin-changes-dock__section">{change.section}</span>
                  <span className="admin-changes-dock__page">{change.page.replace('/admin', '') || '/admin'}</span>
                </div>
                <div className="admin-changes-dock__item-label">{change.label}</div>
                <div className="admin-changes-dock__item-detail">{formatDetail(change.detail)}</div>
              </div>
              <button
                type="button"
                className="admin-changes-dock__remove"
                onClick={() => removeChange(change.id)}
                disabled={saving}
                title="Remove this change"
                aria-label={`Remove change: ${change.label}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="admin-changes-dock__actions">
          <button
            type="button"
            className="admin-changes-dock__btn admin-changes-dock__btn--discard"
            onClick={discardAll}
            disabled={saving}
          >
            <Trash2 className="h-3.5 w-3.5 shrink-0" />
            Discard all
          </button>
          <button
            type="button"
            className="admin-changes-dock__btn admin-changes-dock__btn--save"
            onClick={() => void saveAll()}
            disabled={saving}
          >
            {saving ? (
              <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 shrink-0" />
            )}
            {saving ? 'Saving…' : `Save ${count} change${count === 1 ? '' : 's'}`}
          </button>
        </div>
      </aside>
    </>
  );
}