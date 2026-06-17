'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ExternalLink } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminTableShell } from '@/components/admin/AdminUI';
import { AdminArticleFlags } from '@/components/admin/AdminArticleFlags';
import { ArticleStatusFilter } from '@/components/admin/ArticleStatusFilter';
import { StatusBadge } from './StatusBadge';
import { Input } from '@/components/ui/input';
import { cn, formatNumber } from '@/lib/utils';
import { usePublicArticleUrl } from '@/hooks/usePublicSiteOrigin';

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  author?: { name?: string } | string;
  category: string;
  status: string;
  views: number;
  updatedAt?: string | Date;
  isPinned?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
}

export function ArticleTable({ articles, showAuthor = true, editBase = '/cms/articles', variant }: { 
  articles: ArticleRow[]; 
  showAuthor?: boolean; 
  editBase?: string;
  variant?: 'admin' | 'cms';
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | string>('ALL');

  const filtered = articles
    .filter(a => {
      const q = query.toLowerCase();
      const matchesQ = !q || 
        a.title.toLowerCase().includes(q) || 
        a.category.toLowerCase().includes(q) ||
        (typeof a.author === 'string' ? a.author : a.author?.name || '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      return matchesQ && matchesStatus;
    });

  const statuses = Array.from(new Set(articles.map(a => a.status)));

  const isAdmin = variant === 'admin';
  const TableWrapper = isAdmin ? AdminTableShell : ({ children }: { children: React.ReactNode }) => (
    <div className="card overflow-hidden">{children}</div>
  );

  return (
    <div>
      <div className={cn(isAdmin ? 'admin-filter-bar' : 'flex flex-col sm:flex-row gap-3 mb-3 items-start sm:items-center')}>
        <div className={cn('relative', isAdmin ? 'flex-1 min-w-[12rem]' : 'flex-1 max-w-sm')}>
          <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder={isAdmin ? 'Search articles…' : 'Search title, category or author...'}
            className={cn('pl-9', isAdmin && 'h-8')}
          />
        </div>
        {isAdmin ? (
          <ArticleStatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
            articles={articles}
          />
        ) : (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | string)}
            className="border border-input text-sm h-9 px-3 bg-background rounded-md"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <div className={cn(
          'text-xs text-muted-foreground hidden sm:block',
          isAdmin ? 'admin-filter-count' : 'ml-auto'
        )}>
          {filtered.length} / {articles.length} shown
        </div>
      </div>

      <TableWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {showAuthor && <TableHead>Author</TableHead>}
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Updated</TableHead>
              {isAdmin && <TableHead className="w-24">Flags</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={(showAuthor ? 6 : 5) + (isAdmin ? 1 : 0)} className="text-center text-muted-foreground py-8">No matches found.</TableCell></TableRow>
            )}
            {filtered.map((a) => (
              <ArticleTableRow key={a.id} article={a} editBase={editBase} showAuthor={showAuthor} isAdmin={isAdmin} />
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </div>
  );
}

function ArticleTableRow({
  article: a,
  editBase,
  showAuthor,
  isAdmin,
}: {
  article: ArticleRow;
  editBase: string;
  showAuthor: boolean;
  isAdmin: boolean;
}) {
  const liveUrl = usePublicArticleUrl(a.slug);

  return (
              <TableRow>
                <TableCell className="max-w-[360px]">
                  <Link href={`${editBase}/${a.id}/edit`} className="font-medium hover:text-primary line-clamp-1">
                    {a.title}
                  </Link>
                  {a.status === 'PUBLISHED' && (
                    <a href={liveUrl} target="_blank" rel="noreferrer" className="ml-2 inline text-muted-foreground hover:text-primary" title="View live">
                      <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  )}
                </TableCell>
                {showAuthor && (
                  <TableCell className="text-muted-foreground text-sm">
                    {typeof a.author === 'string' ? a.author : a.author?.name || '—'}
                  </TableCell>
                )}
                <TableCell className="text-sm whitespace-nowrap">{a.category}</TableCell>
                <TableCell><StatusBadge status={a.status} /></TableCell>
                <TableCell className="tabular-nums text-sm">{formatNumber(a.views)}</TableCell>
                <TableCell className="text-muted-foreground text-xs text-right">
                  {a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : '—'}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <AdminArticleFlags
                      articleId={a.id}
                      isPinned={a.isPinned ?? false}
                      isFeatured={a.isFeatured ?? false}
                      isBreaking={a.isBreaking ?? false}
                    />
                  </TableCell>
                )}
              </TableRow>
  );
}
