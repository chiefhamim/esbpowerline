export default function AdminLoading() {
  return (
    <div className="admin-loading space-y-6 animate-pulse">
      <div className="h-16 rounded-2xl bg-muted/40" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/30" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-72 rounded-2xl bg-muted/25" />
        <div className="h-72 rounded-2xl bg-muted/25" />
      </div>
    </div>
  );
}