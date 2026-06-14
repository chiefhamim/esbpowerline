'use client';

import { useState, useEffect } from 'react';
import { X, Lock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function AdminSecureActionDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  variant = 'destructive',
  requirePassword = true,
  showAuthorNote = false,
  authorNoteRequired = false,
  authorNoteLabel = 'Note for author',
  authorNotePlaceholder = 'Explain what needs to change or why this action was taken…',
  loading = false,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'destructive' | 'primary';
  requirePassword?: boolean;
  showAuthorNote?: boolean;
  authorNoteRequired?: boolean;
  authorNoteLabel?: string;
  authorNotePlaceholder?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (payload: { password?: string; authorNote?: string }) => void | Promise<void>;
}) {
  const [password, setPassword] = useState('');
  const [authorNote, setAuthorNote] = useState('');

  useEffect(() => {
    if (!open) {
      setPassword('');
      setAuthorNote('');
    }
  }, [open]);

  if (!open) return null;

  function handleClose() {
    setPassword('');
    setAuthorNote('');
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onConfirm({
      password: requirePassword ? password : undefined,
      authorNote: authorNote.trim() || undefined,
    });
  }

  return (
    <div className="admin-secure-dialog-backdrop" onClick={handleClose}>
      <div
        className="admin-secure-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-secure-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-secure-dialog-header">
          <div>
            <h3 id="admin-secure-dialog-title" className="admin-secure-dialog-title">{title}</h3>
            <p className="admin-secure-dialog-desc">{description}</p>
          </div>
          <button type="button" className="admin-secure-dialog-close" onClick={handleClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-secure-dialog-body">
          {showAuthorNote && (
            <div>
              <label className="admin-secure-dialog-label">
                <MessageSquare className="h-3 w-3" />
                {authorNoteLabel}
              </label>
              <textarea
                value={authorNote}
                onChange={(e) => setAuthorNote(e.target.value)}
                placeholder={authorNotePlaceholder}
                rows={3}
                className="admin-secure-dialog-textarea"
                required={authorNoteRequired}
              />
            </div>
          )}

          {requirePassword && (
            <div>
              <label className="admin-secure-dialog-label">
                <Lock className="h-3 w-3" />
                Confirm your password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your admin password"
                className="h-9"
                required
                autoComplete="current-password"
              />
            </div>
          )}

          <div className="admin-secure-dialog-actions">
            <Button type="button" variant="outline" size="sm" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className={cn(variant === 'destructive' && 'bg-destructive hover:bg-destructive/90')}
            >
              {loading ? 'Working…' : confirmLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}