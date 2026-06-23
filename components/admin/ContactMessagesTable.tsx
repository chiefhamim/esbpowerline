'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Trash2, RotateCcw, Mail, Phone, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
};

export function ContactMessagesTable({
  messages,
}: {
  messages: ContactMessage[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleRead(id: string, currentlyRead: boolean) {
    setActiveId(id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/messages/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: !currentlyRead }),
        });
        if (!res.ok) throw new Error();
        toast.success(`Message marked as ${currentlyRead ? 'unread' : 'read'}`);
        router.refresh();
      } catch {
        toast.error('Could not update message status');
      } finally {
        setActiveId(null);
      }
    });
  }

  function deleteMessage(id: string) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setActiveId(id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/messages/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error();
        toast.success('Message deleted successfully');
        router.refresh();
      } catch {
        toast.error('Could not delete message');
      } finally {
        setActiveId(null);
      }
    });
  }

  function getWhatsAppLink(phone: string) {
    const cleanNum = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanNum}`;
  }

  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground py-10 text-center">No contact messages yet.</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const busy = pending && activeId === msg.id;
        const isExpanded = expandedId === msg.id;

        return (
          <article
            key={msg.id}
            className={cn(
              'admin-comment-card transition-all duration-200 border border-border/40 hover:border-border/85 rounded-2xl p-5 bg-card/10',
              !msg.read && 'border-l-4 border-l-primary bg-primary/[0.02]'
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground text-[13px]">{msg.name}</span>
                  <span className="text-muted-foreground/60">•</span>
                  <a href={`mailto:${msg.email}`} className="hover:text-primary transition-colors flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {msg.email}
                  </a>
                  {msg.phone && (
                    <>
                      <span className="text-muted-foreground/60">•</span>
                      <a
                        href={getWhatsAppLink(msg.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-400 hover:underline transition-colors flex items-center gap-1 font-medium"
                        title="Chat on WhatsApp"
                      >
                        <Phone className="h-3 w-3" /> {msg.phone}
                        <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    </>
                  )}
                  <span className="text-muted-foreground/60">•</span>
                  <span>{formatDate(new Date(msg.createdAt).toISOString())}</span>
                  {!msg.read && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-foreground/90 pt-1">
                  {msg.subject || 'No Subject'}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => toggleRead(msg.id, msg.read)}
                  className={cn(
                    'admin-comment-action flex items-center justify-center h-8 w-8 rounded-lg border border-border/40 hover:bg-muted transition-all',
                    msg.read ? 'text-muted-foreground' : 'text-primary border-primary/20 bg-primary/5 hover:bg-primary/10'
                  )}
                  title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                >
                  {msg.read ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => deleteMessage(msg.id)}
                  className="admin-comment-action flex items-center justify-center h-8 w-8 rounded-lg border border-border/40 hover:bg-red-500/10 hover:border-red-500/20 text-muted-foreground hover:text-red-500 transition-all"
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3">
              <p
                onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                className={cn(
                  'text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words cursor-pointer transition-all',
                  !isExpanded && 'line-clamp-3 hover:text-foreground'
                )}
              >
                {msg.message}
              </p>
              {msg.message.length > 250 && (
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                  className="text-xs font-semibold text-primary hover:underline mt-1.5"
                >
                  {isExpanded ? 'Show less' : 'Read full message'}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
