'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOutToPublicSite } from '@/lib/staff-sign-out';

type StaffSignOutConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function StaffSignOutConfirmDialog({ open, onClose }: StaffSignOutConfirmDialogProps) {
  const pathname = usePathname();
  const isCms = pathname.startsWith('/cms');

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="staff-signout-dialog-backdrop" onClick={onClose}>
      <div
        className={cn('staff-signout-dialog', isCms && 'staff-signout-dialog--cms')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-sign-out-title"
        aria-describedby="staff-sign-out-desc"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="staff-signout-dialog__top">
          <div className="staff-signout-dialog__brand">
            <div className="staff-signout-dialog__icon" aria-hidden>
              <LogOut className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </div>
            <div className="min-w-0">
              <p className="staff-signout-dialog__eyebrow">End session</p>
              <h3 id="staff-sign-out-title" className="staff-signout-dialog__title">
                Are you sure?
              </h3>
            </div>
          </div>
          <button
            type="button"
            className="staff-signout-dialog__close ui-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="staff-signout-dialog__body">
          <p id="staff-sign-out-desc" className="staff-signout-dialog__desc">
            You&apos;ll be signed out and returned to the public site. Any unsaved work in this
            workspace may be lost.
          </p>

          <div className="staff-signout-dialog__actions">
            <button type="button" className="staff-signout-dialog__btn staff-signout-dialog__btn--stay" onClick={onClose}>
              <span className="staff-signout-dialog__btn-label">No</span>
              <span className="staff-signout-dialog__btn-hint">Stay signed in</span>
            </button>
            <button
              type="button"
              className="staff-signout-dialog__btn staff-signout-dialog__btn--leave"
              onClick={() => {
                onClose();
                void signOutToPublicSite();
              }}
            >
              <span className="staff-signout-dialog__btn-label">Yes</span>
              <span className="staff-signout-dialog__btn-hint">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}