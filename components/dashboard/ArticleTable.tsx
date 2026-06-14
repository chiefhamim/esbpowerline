'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ExternalLink } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { Input } from '@/components/ui/input';
import { formatNumber } from '@/lib/utils';

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  author?: { name?: string } | string;
  category: string;
  status: string;
  views: number;
  updatedAt?: string | Date;
}

export function ArticleTable({ articles, showAuthor = true, editBase = '/cms/articles' }: { 
  articles: ArticleRow[]; 
  showAuthor?: boolean; 
  editBase?: string;
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search title, category or author..." 
            className="pl-9"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border border-input rounded-md text-sm h-9 px-3 bg-background"
        >
          <option value="ALL">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="text-xs text-muted-foreground ml-auto hidden sm:block">{filtered.length} / {articles.length} shown</div>
      </div>

      <div className="card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {showAuthor && <TableHead>Author</TableHead>}
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={showAuthor ? 6 : 5} className="text-center text-muted-foreground py-8">No matches found.</TableCell></TableRow>
            )}
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="max-w-[360px]">
                  <Link href={`${editBase}/${a.id}/edit`} className="font-medium hover:text-primary line-clamp-1">
                    {a.title}
                  </Link>
                  <a href={`/articles/${a.slug}`} target="_blank" className="ml-2 inline text-muted-foreground hover:text-primary" title="View live">
                    <ExternalLink className="h-3 w-3 inline" />
                  </a>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
