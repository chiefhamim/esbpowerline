'use client';

import { useMemo } from 'react';
import { Filter } from 'lucide-react';
import { AdminSelectMenu, type AdminSelectOption } from '@/components/admin/AdminSelectMenu';

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: 'Published',
  DRAFT: 'Draft',
  SCHEDULED: 'Scheduled',
  ARCHIVED: 'Archived',
  TRASH: 'Trash',
};

export function ArticleStatusFilter({
  value,
  onChange,
  articles,
}: {
  value: string;
  onChange: (value: string) => void;
  articles: { status: string }[];
}) {
  const options = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of articles) {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    }

    const statusOpts: AdminSelectOption[] = Object.keys(counts)
      .sort()
      .map((status) => ({
        value: status,
        label: STATUS_LABELS[status] ?? status.toLowerCase(),
        count: counts[status],
      }));

    return [
      { value: 'ALL', label: 'All statuses', count: articles.length },
      ...statusOpts,
    ];
  }, [articles]);

  return (
    <ArticleStatusFilterInner value={value} onChange={onChange} options={options} />
  );
}

function ArticleStatusFilterInner({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
}) {
  return (
    <AdminSelectMenu
      value={value}
      onChange={onChange}
      options={options}
      icon={Filter}
      placeholder="Filter by status"
      minWidth="11rem"
    />
  );
}