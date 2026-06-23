'use client';

import { useState, useEffect, useTransition } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { AdminFormattedTime } from '@/components/admin/AdminFormattedTime';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { adminActivityBadgeLabel } from '@/lib/admin-audit';
import { undoAuditLogAction } from '@/lib/actions/logs';

type ActivityLog = {
  id: string;
  type: string;
  message: string;
  timestamp: Date | string;
  undoPayload?: string | null;
};

function UndoableActivityRow({ log }: { log: ActivityLog }) {
  const [pending, startTransition] = useTransition();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!log.undoPayload) return;

    const calculateTimeLeft = () => {
      const logTime = new Date(log.timestamp).getTime();
      const limitTime = logTime + 48 * 60 * 60 * 1000; // 48 hours
      const diff = limitTime - Date.now();
      return diff > 0 ? diff : 0;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const diff = calculateTimeLeft();
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [log]);

  const handleUndo = () => {
    if (!confirm(`Are you sure you want to undo this action: "${log.message}"?`)) return;
    startTransition(async () => {
      try {
        const res = await undoAuditLogAction(log.id);
        if (res.ok) {
          toast.success('Action successfully undone!');
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to undo action');
      }
    });
  };

  const isUndoable = log.undoPayload && timeLeft > 0;

  const formatTimeLeft = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours}h ${minutes}m ${seconds}s left`;
  };

  return (
    <div className="admin-activity-item group border-b border-border/30 last:border-b-0 pb-3 mb-3 last:pb-0 last:mb-0">
      <div className="flex items-center justify-between gap-2 flex-wrap w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={adminActivityBadgeLabel(log.type)} />
          <span className="admin-activity-date">
            <AdminFormattedTime value={log.timestamp} />
          </span>
        </div>
        
        {isUndoable && (
          <div className="flex items-center gap-2 animate-fadeIn">
            <span className="text-[10px] font-semibold font-mono text-amber-500 bg-amber-500/5 border border-amber-500/10 px-1.5 py-0.5 rounded">
              {formatTimeLeft(timeLeft)}
            </span>
            <button
              type="button"
              disabled={pending}
              onClick={handleUndo}
              className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>{pending ? 'Undoing...' : 'Undo'}</span>
            </button>
          </div>
        )}
      </div>
      <p className="admin-activity-msg mt-1.5 text-muted-foreground">{log.message}</p>
    </div>
  );
}

export function AdminRecentActivity({
  logs,
  emptyLabel = 'No administrative activity logged.',
}: {
  logs: ActivityLog[];
  emptyLabel?: string;
}) {
  if (logs.length === 0) {
    return <p className="text-[13px] text-muted-foreground py-2">{emptyLabel}</p>;
  }

  return (
    <div className="admin-activity-feed">
      {logs.map((log) => (
        <UndoableActivityRow key={log.id} log={log} />
      ))}
    </div>
  );
}