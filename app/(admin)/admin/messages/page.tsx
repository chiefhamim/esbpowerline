import { Mail } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminPageHeader, AdminCard, AdminSectionStack, AdminFilterTabs } from '@/components/admin/AdminUI';
import { ContactMessagesTable } from '@/components/admin/ContactMessagesTable';
import { cn } from '@/lib/utils';

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

const TABS = [
  { id: 'all', label: 'All Messages' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
];

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = params.filter || 'all';

  const whereClause =
    filter === 'unread' ? { read: false }
    : filter === 'read' ? { read: true }
    : {};

  const [messages, unreadCount, totalCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.count(),
  ]);

  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={Mail}
        title="Contact Messages"
        description="View and manage messages submitted via the public Contact Us form."
      />

      <AdminFilterTabs>
        {TABS.map((tab) => {
          const active = filter === tab.id;
          const count =
            tab.id === 'unread' ? unreadCount
            : tab.id === 'all' ? totalCount
            : totalCount - unreadCount;
          return (
            <Link
              key={tab.id}
              href={`/admin/messages?filter=${tab.id}`}
              className={cn('admin-filter-tab', active && 'admin-filter-tab--active')}
            >
              {tab.label}
              <span className="admin-filter-tab__count">{count}</span>
            </Link>
          );
        })}
      </AdminFilterTabs>

      <AdminCard title="Inbox">
        <ContactMessagesTable messages={messages} />
      </AdminCard>
    </AdminSectionStack>
  );
}
