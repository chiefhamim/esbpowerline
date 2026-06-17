import { AdminPageSkeleton } from '@/components/admin/AdminUI';

export default function AdminLoading() {
  return (
    <AdminPageSkeleton>
      <div className="h-16 rounded-2xl bg-muted/40" />
      <div className="admin-stat-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/30" />
        ))}
      </div>
      <div className="admin-card-grid admin-card-grid--cols-2">
        <div className="h-72 rounded-2xl bg-muted/25" />
        <div className="h-72 rounded-2xl bg-muted/25" />
      </div>
    </AdminPageSkeleton>
  );
}