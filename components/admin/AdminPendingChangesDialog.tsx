'use client';

import { Layers, Save, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminChangeQueue } from '@/components/admin/AdminChangeQueueProvider';

const ACTION_COPY = {
  navigate: {
    title: 'Save before leaving?',
    description: 'You have unsaved admin changes. Save them before moving to another page, or discard and continue.',
  },
  signout: {
    title: 'Save before signing out?',
    description: 'You have unsaved admin changes. Save them before ending your session, or discard and sign out.',
  },
  reload: {
    title: 'Save before reloading?',
    description: 'You have unsaved admin changes. Save them before reloading, or discard and reload the page.',
  },
} as const;

export function AdminPendingChangesDialog() {
  const {
    leaveDialogOpen,
    leaveIntent,
    count,
    saving,
    resolveLeaveIntent,
  } = useAdminChangeQueue();

  if (!leaveDialogOpen || !leaveIntent) return null;

  const copy = ACTION_COPY[leaveIntent.action];

  return (
    <div className="admin-changes-dialog-backdrop" onClick={() => void resolveLeaveIntent('cancel')}>
      <div
        className="admin-changes-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-changes-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-changes-dialog__top">
          <div className="admin-changes-dialog__brand">
            <div className="admin-changes-dialog__icon" aria-hidden>
              <Layers className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </div>
            <div className="min-w-0">
              <p className="admin-changes-dialog__eyebrow">{count} pending change{count === 1 ? '' : 's'}</p>
              <h3 id="admin-changes-dialog-title" className="admin-changes-dialog__title">
                {copy.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            className="admin-changes-dialog__close ui-close-btn"
            onClick={() => void resolveLeaveIntent('cancel')}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="admin-changes-dialog__body">
          <p className="admin-changes-dialog__desc">{copy.description}</p>

          <div className="admin-changes-dialog__actions">
            <button
              type="button"
              className="admin-changes-dialog__btn admin-changes-dialog__btn--stay"
              disabled={saving}
              onClick={() => void resolveLeaveIntent('cancel')}
            >
              <span className="admin-changes-dialog__btn-label">Cancel</span>
              <span className="admin-changes-dialog__btn-hint">Keep editing</span>
            </button>
            <button
              type="button"
              className="admin-changes-dialog__btn admin-changes-dialog__btn--discard"
              disabled={saving}
              onClick={() => void resolveLeaveIntent('discard')}
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" />
              <span className="admin-changes-dialog__btn-label">Discard</span>
              <span className="admin-changes-dialog__btn-hint">Revert all</span>
            </button>
            <button
              type="button"
              className={cn(
                'admin-changes-dialog__btn admin-changes-dialog__btn--save',
                saving && 'admin-changes-dialog__btn--loading',
              )}
              disabled={saving}
              onClick={() => void resolveLeaveIntent('save')}
            >
              <Save className="h-3.5 w-3.5 shrink-0" />
              <span className="admin-changes-dialog__btn-label">{saving ? 'Saving…' : 'Save'}</span>
              <span className="admin-changes-dialog__btn-hint">Apply changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}