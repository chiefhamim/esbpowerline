'use client';

import { Check, RotateCcw, Send } from 'lucide-react';
import { AdminSecureActionDialog } from '@/components/admin/AdminSecureActionDialog';

type ReviewAction = 'approve' | 'publish' | 'return';

const COPY: Record<ReviewAction, { title: string; description: string; confirmLabel: string; requireNote: boolean; noteLabel: string; notePlaceholder: string }> = {
  approve: {
    title: 'Approve for publication',
    description: 'Return the story to draft with admin approval. The author or editor can publish when ready.',
    confirmLabel: 'Approve',
    requireNote: false,
    noteLabel: 'Optional note to author',
    notePlaceholder: 'Optional context (e.g. legal cleared, headline approved)…',
  },
  publish: {
    title: 'Approve & publish',
    description: 'Publish this story immediately after admin sign-off.',
    confirmLabel: 'Approve & publish',
    requireNote: false,
    noteLabel: 'Optional note to author',
    notePlaceholder: 'Optional publish note for the newsroom…',
  },
  return: {
    title: 'Return with notes',
    description: 'Send the draft back to the author with revision guidance. They will see your note in Editorial.',
    confirmLabel: 'Send back to author',
    requireNote: true,
    noteLabel: 'Revision notes',
    notePlaceholder: 'Explain what needs to change before this can go live…',
  },
};

export function AdminReviewNoteDialog({
  open,
  action,
  articleTitle,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  action: ReviewAction | null;
  articleTitle?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void>;
}) {
  if (!action) return null;

  const copy = COPY[action];

  return (
    <AdminSecureActionDialog
      open={open}
      title={copy.title}
      description={
        articleTitle
          ? `${copy.description} “${articleTitle}”`
          : copy.description
      }
      confirmLabel={copy.confirmLabel}
      variant={action === 'return' ? 'destructive' : 'success'}
      requirePassword={false}
      showAuthorNote
      authorNoteRequired={copy.requireNote}
      authorNoteLabel={copy.noteLabel}
      authorNotePlaceholder={copy.notePlaceholder}
      loading={loading}
      onClose={onClose}
      onConfirm={async (payload) => {
        const text = payload.authorNote?.trim() ?? '';
        if (copy.requireNote && !text) {
          throw new Error('A note for the author is required');
        }
        await onConfirm(text);
      }}
    />
  );
}