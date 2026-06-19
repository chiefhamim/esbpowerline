'use client';

import { useMemo, useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Search, ArrowUpDown, Tag, Hash, User, Star, Pin,
  Trash2, RotateCcw, Send, FileEdit, Archive, Flame, X, Check,
  MoreHorizontal, Pencil, Eye, MessageSquare,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminTableShell } from '@/components/admin/AdminUI';
import { AdminArticleFlags } from '@/components/admin/AdminArticleFlags';
import { AdminSelectMenu } from '@/components/admin/AdminSelectMenu';
import { ArticleStatusFilter } from '@/components/admin/ArticleStatusFilter';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Input } from '@/components/ui/input';
import { cn, formatNumber } from '@/lib/utils';
import { bulkArticleAction, bulkOwnArticleAction, type BulkArticleAction, type OwnBulkAction } from '@/lib/actions/articles';
import { requestArticleRevision } from '@/lib/actions/notices';
import { AdminSecureActionDialog } from '@/components/admin/AdminSecureActionDialog';
import {
  AdminDropdownBackdrop,
  AdminDropdownPanel,
  useAdminDropdown,
} from '@/components/admin/AdminDropdown';
import { LiveArticleLink } from '@/components/shared/LiveArticleLink';

export type AdminArticleRow = {
  id: string;
  title: string;
  slug: string;
  author?: { id?: string; name?: string } | string;
  category: string;
  status: string;
  views: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  publishedAt?: string | Date | null;
  isPinned?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  tags?: string[];
};

type SortKey =
  | 'title_asc' | 'title_desc'
  | 'slug_asc' | 'slug_desc'
  | 'author_asc' | 'author_desc'
  | 'category_asc' | 'category_desc'
  | 'status_asc' | 'status_desc'
  | 'views_asc' | 'views_desc'
  | 'updated_asc' | 'updated_desc'
  | 'created_asc' | 'created_desc'
  | 'published_asc' | 'published_desc';

const SORT_OPTIONS: { value: SortKey; label: string; description?: string }[] = [
  { value: 'updated_desc', label: 'Recently updated', description: 'Newest edits first' },
  { value: 'updated_asc', label: 'Oldest updated', description: 'Stale content first' },
  { value: 'created_desc', label: 'Newest created' },
  { value: 'created_asc', label: 'Oldest created' },
  { value: 'published_desc', label: 'Recently published' },
  { value: 'published_asc', label: 'Oldest published' },
  { value: 'title_asc', label: 'Title A → Z' },
  { value: 'title_desc', label: 'Title Z → A' },
  { value: 'slug_asc', label: 'Slug A → Z' },
  { value: 'slug_desc', label: 'Slug Z → A' },
  { value: 'author_asc', label: 'Author A → Z' },
  { value: 'author_desc', label: 'Author Z → A' },
  { value: 'category_asc', label: 'Category A → Z' },
  { value: 'category_desc', label: 'Category Z → A' },
  { value: 'views_desc', label: 'Most views' },
  { value: 'views_asc', label: 'Least views' },
  { value: 'status_asc', label: 'Status' },
];

function authorName(a: AdminArticleRow) {
  return typeof a.author === 'string' ? a.author : a.author?.name ?? '';
}

function authorId(a: AdminArticleRow): string | undefined {
  return typeof a.author === 'object' ? a.author?.id : undefined;
}

function canEditArticle(
  article: AdminArticleRow,
  currentUserId?: string,
  canEditAny?: boolean,
): boolean {
  if (canEditAny) return true;
  return Boolean(currentUserId && authorId(article) === currentUserId);
}

function sortArticles(list: AdminArticleRow[], sort: SortKey) {
  const copy = [...list];
  const cmp = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' });
  const date = (d?: string | Date | null) => (d ? new Date(d).getTime() : 0);

  copy.sort((a, b) => {
    switch (sort) {
      case 'title_asc': return cmp(a.title, b.title);
      case 'title_desc': return cmp(b.title, a.title);
      case 'slug_asc': return cmp(a.slug, b.slug);
      case 'slug_desc': return cmp(b.slug, a.slug);
      case 'author_asc': return cmp(authorName(a), authorName(b));
      case 'author_desc': return cmp(authorName(b), authorName(a));
      case 'category_asc': return cmp(a.category, b.category);
      case 'category_desc': return cmp(b.category, a.category);
      case 'status_asc': return cmp(a.status, b.status);
      case 'status_desc': return cmp(b.status, a.status);
      case 'views_asc': return a.views - b.views;
      case 'views_desc': return b.views - a.views;
      case 'updated_asc': return date(a.updatedAt) - date(b.updatedAt);
      case 'updated_desc': return date(b.updatedAt) - date(a.updatedAt);
      case 'created_asc': return date(a.createdAt) - date(b.createdAt);
      case 'created_desc': return date(b.createdAt) - date(a.createdAt);
      case 'published_asc': return date(a.publishedAt) - date(b.publishedAt);
      case 'published_desc': return date(b.publishedAt) - date(a.publishedAt);
      default: return 0;
    }
  });
  return copy;
}

const SECURE_ACTIONS = new Set<BulkArticleAction>(['trash', 'delete_permanent', 'archive']);

const SECURE_ACTION_COPY: Record<string, { title: string; description: string; confirm: string }> = {
  trash: {
    title: 'Move to trash?',
    description: 'Selected articles will be hidden. Authors will be notified.',
    confirm: 'Move to trash',
  },
  archive: {
    title: 'Archive articles?',
    description: 'Selected articles will leave the live site. Authors will be notified.',
    confirm: 'Archive',
  },
  delete_permanent: {
    title: 'Delete permanently?',
    description: 'This cannot be undone. Authors will be notified.',
    confirm: 'Delete forever',
  },
};

function ArticleRowMenu({
  article,
  editBase,
  onAction,
  onRequestRevision,
  showRevisionRequest = true,
  limitedActions = false,
  allowEdit = true,
}: {
  article: AdminArticleRow;
  editBase: string;
  onAction: (action: BulkArticleAction) => void;
  onRequestRevision: () => void;
  showRevisionRequest?: boolean;
  limitedActions?: boolean;
  allowEdit?: boolean;
}) {
  const { open, toggle, close } = useAdminDropdown();
  const isTrash = article.status === 'TRASH';

  return (
    <div className="relative">
      <button type="button" onClick={toggle} className="admin-row-menu-btn" aria-label="Article actions">
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <AdminDropdownBackdrop onClose={close} />
          <AdminDropdownPanel className="admin-row-menu-panel" align="right">
            {allowEdit && (
              <Link href={`${editBase}/${article.id}/edit`} className="admin-row-menu-item" onClick={close}>
                <Pencil className="h-3.5 w-3.5" /><span>Edit article</span>
              </Link>
            )}
            <LiveArticleLink slug={article.slug} className="admin-row-menu-item" title="View live" onClick={close}>
              <Eye className="h-3.5 w-3.5" /><span>View live</span>
            </LiveArticleLink>
            <div className="admin-platform-divider my-1" />
            {!isTrash && showRevisionRequest && !allowEdit && (
              <button type="button" className="admin-row-menu-item" onClick={() => { onRequestRevision(); close(); }}>
                <MessageSquare className="h-3.5 w-3.5" /><span>Return to author</span>
              </button>
            )}
            {!isTrash && allowEdit && (
              <>
                <button type="button" className="admin-row-menu-item" onClick={() => { onAction('publish'); close(); }}>
                  <Send className="h-3.5 w-3.5" /><span>Publish</span>
                </button>
                <button type="button" className="admin-row-menu-item" onClick={() => { onAction('draft'); close(); }}>
                  <FileEdit className="h-3.5 w-3.5" /><span>Move to draft</span>
                </button>
                <button type="button" className="admin-row-menu-item" onClick={() => { onAction('archive'); close(); }}>
                  <Archive className="h-3.5 w-3.5" /><span>Archive</span>
                </button>
                <button type="button" className="admin-row-menu-item admin-row-menu-item--danger" onClick={() => { onAction('trash'); close(); }}>
                  <Trash2 className="h-3.5 w-3.5" /><span>Move to trash</span>
                </button>
              </>
            )}
            {isTrash && (
              <>
                <button type="button" className="admin-row-menu-item" onClick={() => { onAction('restore'); close(); }}>
                  <RotateCcw className="h-3.5 w-3.5" /><span>Restore to draft</span>
                </button>
                <button type="button" className="admin-row-menu-item admin-row-menu-item--danger" onClick={() => { onAction('delete_permanent'); close(); }}>
                  <Trash2 className="h-3.5 w-3.5" /><span>Delete permanently</span>
                </button>
              </>
            )}
          </AdminDropdownPanel>
        </>
      )}
    </div>
  );
}

export type ArticleManagerOptions = {
  showAuthorColumn?: boolean;
  showAuthorFilter?: boolean;
  showRevisionRequest?: boolean;
  showBulkFlags?: boolean;
  useOwnBulkActions?: boolean;
  currentUserId?: string;
  canEditAny?: boolean;
};

export function AdminArticleManager({
  articles,
  editBase = '/cms/articles',
  options = {},
}: {
  articles: AdminArticleRow[];
  editBase?: string;
  options?: ArticleManagerOptions;
}) {
  const {
    showAuthorColumn = true,
    showAuthorFilter = true,
    showRevisionRequest = true,
    showBulkFlags = true,
    currentUserId,
    canEditAny = false,
    useOwnBulkActions = false,
  } = options;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [authorFilter, setAuthorFilter] = useState('ALL');
  const [tagFilter, setTagFilter] = useState('ALL');
  const [flagFilter, setFlagFilter] = useState('ALL');

  useEffect(() => {
    const tag = searchParams.get('tag')?.trim();
    if (tag) setTagFilter(tag);
  }, [searchParams]);
  const [sort, setSort] = useState<SortKey>('updated_desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [secureAction, setSecureAction] = useState<{ action: BulkArticleAction; ids: string[] } | null>(null);
  const [revisionIds, setRevisionIds] = useState<string[] | null>(null);

  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category));
    return Array.from(set).sort();
  }, [articles]);

  const authors = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of articles) {
      const id = authorId(a);
      const name = authorName(a);
      if (id && name) map.set(id, name);
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [articles]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      for (const tag of a.tags ?? []) {
        if (tag.trim()) set.add(tag);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const filtered = useMemo(() => {
    let list = articles.filter((a) => {
      const q = query.toLowerCase();
      const matchesQ = !q
        || a.title.toLowerCase().includes(q)
        || a.slug.toLowerCase().includes(q)
        || a.category.toLowerCase().includes(q)
        || authorName(a).toLowerCase().includes(q)
        || (a.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
      const matchesAuthor = authorFilter === 'ALL' || authorId(a) === authorFilter;
      const matchesTag = tagFilter === 'ALL' || (a.tags ?? []).includes(tagFilter);
      const matchesFlag =
        flagFilter === 'ALL'
        || (flagFilter === 'featured' && a.isFeatured)
        || (flagFilter === 'pinned' && a.isPinned)
        || (flagFilter === 'breaking' && a.isBreaking);
      return matchesQ && matchesStatus && matchesCategory && matchesAuthor && matchesTag && matchesFlag;
    });
    return sortArticles(list, sort);
  }, [articles, query, statusFilter, categoryFilter, authorFilter, tagFilter, flagFilter, sort]);

  const filteredIds = useMemo(() => new Set(filtered.map((a) => a.id)), [filtered]);
  const selectedCount = selected.size;
  const allFilteredSelected = filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const someSelected = filtered.some((a) => selected.has(a.id));

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllFiltered() {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((a) => next.delete(a.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((a) => next.add(a.id));
        return next;
      });
    }
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function runBulk(action: BulkArticleAction, ids?: string[]) {
    const targetIds = ids ?? Array.from(selected).filter((id) => filteredIds.has(id));
    if (!targetIds.length) {
      toast.error('No articles selected');
      return;
    }

    if (SECURE_ACTIONS.has(action)) {
      setSecureAction({ action, ids: targetIds });
      return;
    }

    executeBulk(action, targetIds);
  }

  function executeBulk(
    action: BulkArticleAction,
    targetIds: string[],
    opts?: { password?: string; authorNote?: string }
  ) {
    startTransition(async () => {
      try {
        const ownActions: OwnBulkAction[] = ['publish', 'draft', 'trash', 'archive'];
        const res = useOwnBulkActions && ownActions.includes(action as OwnBulkAction)
          ? await bulkOwnArticleAction(targetIds, action as OwnBulkAction)
          : await bulkArticleAction(targetIds, action, opts);
        toast.success(`Updated ${res.affected} article(s)`);
        setSelected((prev) => {
          const next = new Set(prev);
          targetIds.forEach((id) => next.delete(id));
          return next;
        });
        setSecureAction(null);
        router.refresh();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Action failed');
      }
    });
  }

  function openRevisionRequest(ids: string[]) {
    if (!ids.length) {
      toast.error('No articles selected');
      return;
    }
    setRevisionIds(ids);
  }

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
    }
    return [
      { value: 'ALL', label: 'All categories', count: articles.length },
      ...categories.map((c) => ({
        value: c,
        label: c,
        count: counts.get(c) ?? 0,
      })),
    ];
  }, [articles, categories]);

  const authorOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      const id = authorId(article);
      if (!id) continue;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return [
      { value: 'ALL', label: 'All authors', count: articles.length },
      ...authors.map(([id, name]) => ({
        value: id,
        label: name,
        count: counts.get(id) ?? 0,
      })),
    ];
  }, [articles, authors]);

  const tagOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      for (const tag of article.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [
      { value: 'ALL', label: 'All tags', count: articles.length },
      ...tags.map((tag) => ({
        value: tag,
        label: tag,
        count: counts.get(tag) ?? 0,
      })),
    ];
  }, [articles, tags]);

  const flagOptions = useMemo(() => {
    let featured = 0;
    let pinned = 0;
    let breaking = 0;
    for (const article of articles) {
      if (article.isFeatured) featured += 1;
      if (article.isPinned) pinned += 1;
      if (article.isBreaking) breaking += 1;
    }
    return [
      { value: 'ALL', label: 'All flags', count: articles.length },
      { value: 'featured', label: 'Featured', count: featured },
      { value: 'pinned', label: 'Pinned', count: pinned },
      { value: 'breaking', label: 'Breaking', count: breaking },
    ];
  }, [articles]);

  const sortOptions = SORT_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label,
    description: o.description,
  }));

  const selectedInTrash = Array.from(selected).some((id) => {
    const a = articles.find((x) => x.id === id);
    return a?.status === 'TRASH';
  });
  const selectedNotTrash = Array.from(selected).some((id) => {
    const a = articles.find((x) => x.id === id);
    return a && a.status !== 'TRASH';
  });

  return (
    <div className="admin-article-manager">
      <div className="admin-filter-bar admin-article-filters">
        <div className="relative flex-1 min-w-[10rem]">
          <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, slug, author…"
            className="pl-9 h-8"
          />
        </div>
        <ArticleStatusFilter value={statusFilter} onChange={setStatusFilter} articles={articles} />
        <AdminSelectMenu value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} icon={Tag} placeholder="Category" minWidth="9.5rem" />
        {showAuthorFilter && (
          <AdminSelectMenu value={authorFilter} onChange={setAuthorFilter} options={authorOptions} icon={User} placeholder="Author" minWidth="9.5rem" />
        )}
        {tags.length > 0 && (
          <AdminSelectMenu value={tagFilter} onChange={setTagFilter} options={tagOptions} icon={Hash} placeholder="Tag" minWidth="9rem" />
        )}
        {showBulkFlags && (
          <AdminSelectMenu value={flagFilter} onChange={setFlagFilter} options={flagOptions} icon={Star} placeholder="Flags" minWidth="8.5rem" />
        )}
        <AdminSelectMenu value={sort} onChange={(v) => setSort(v as SortKey)} options={sortOptions} icon={ArrowUpDown} placeholder="Sort by" minWidth="10rem" />
        <div className="admin-filter-count">{filtered.length} / {articles.length}</div>
      </div>

      {selectedCount > 0 && (
        <div className="admin-bulk-bar">
          <div className="admin-bulk-bar-left">
            <span className="admin-bulk-count">{selectedCount} selected</span>
            <button type="button" className="admin-bulk-clear" onClick={clearSelection} disabled={pending}>
              <X className="h-3 w-3" /> Clear
            </button>
          </div>
          <div className="admin-bulk-actions">
            {selectedNotTrash && (
              <>
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('publish')}>
                  <Send className="h-3 w-3" /> Publish
                </button>
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('draft')}>
                  <FileEdit className="h-3 w-3" /> Draft
                </button>
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('archive')}>
                  <Archive className="h-3 w-3" /> Archive
                </button>
                <button type="button" className="admin-bulk-btn admin-bulk-btn--danger" disabled={pending} onClick={() => runBulk('trash')}>
                  <Trash2 className="h-3 w-3" /> Trash
                </button>
              </>
            )}
            {selectedInTrash && (
              <>
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('restore')}>
                  <RotateCcw className="h-3 w-3" /> Restore
                </button>
                <button type="button" className="admin-bulk-btn admin-bulk-btn--danger" disabled={pending} onClick={() => runBulk('delete_permanent')}>
                  <Trash2 className="h-3 w-3" /> Delete forever
                </button>
              </>
            )}
            {showBulkFlags && (
              <>
                <span className="admin-bulk-divider" />
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('feature')}>
                  <Star className="h-3 w-3" /> Feature
                </button>
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('unfeature')}>
                  <Star className="h-3 w-3 opacity-40" /> Unfeature
                </button>
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('breaking_on')}>
                  <Flame className="h-3 w-3" /> Breaking
                </button>
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('breaking_off')}>
                  <Flame className="h-3 w-3 opacity-40" /> Unbreaking
                </button>
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('pin_on')}>
                  <Pin className="h-3 w-3" /> Pin
                </button>
                <button type="button" className="admin-bulk-btn" disabled={pending} onClick={() => runBulk('pin_off')}>
                  <Pin className="h-3 w-3 opacity-40" /> Unpin
                </button>
              </>
            )}
            {showRevisionRequest && selectedNotTrash && (
              <>
                <span className="admin-bulk-divider" />
                <button
                  type="button"
                  className="admin-bulk-btn"
                  disabled={pending}
                  onClick={() => openRevisionRequest(Array.from(selected).filter((id) => filteredIds.has(id)))}
                >
                  <MessageSquare className="h-3 w-3" /> Return to author
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <AdminTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <button
                  type="button"
                  onClick={toggleAllFiltered}
                  className={cn('admin-table-check', allFilteredSelected && 'admin-table-check--on', someSelected && !allFilteredSelected && 'admin-table-check--some')}
                  aria-label={allFilteredSelected ? 'Deselect all' : 'Select all filtered'}
                >
                  {allFilteredSelected ? <Check className="h-3 w-3" /> : someSelected ? <span className="admin-table-check-dash" /> : null}
                </button>
              </TableHead>
              <TableHead>Title</TableHead>
              {showAuthorColumn && <TableHead>Author</TableHead>}
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Updated</TableHead>
              {showBulkFlags && <TableHead className="w-24">Flags</TableHead>}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={showAuthorColumn ? 9 : 8} className="text-center text-muted-foreground py-10">
                  No articles match your filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((a) => {
              const isSelected = selected.has(a.id);
              return (
                <TableRow key={a.id} className={cn(isSelected && 'admin-table-row--selected')}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => toggleRow(a.id)}
                      className={cn('admin-table-check', isSelected && 'admin-table-check--on')}
                      aria-label={isSelected ? 'Deselect' : 'Select'}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </button>
                  </TableCell>
                  <TableCell className="max-w-[280px]">
                    {canEditArticle(a, currentUserId, canEditAny) ? (
                      <Link href={`${editBase}/${a.id}/edit`} className="font-medium hover:text-primary line-clamp-1 text-[13px]">
                        {a.title}
                      </Link>
                    ) : (
                      <span className="font-medium line-clamp-1 text-[13px]">{a.title}</span>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]">{a.slug}</span>
                      {a.status === 'PUBLISHED' && (
                        <LiveArticleLink slug={a.slug} className="text-muted-foreground hover:text-primary shrink-0" />
                      )}
                    </div>
                  </TableCell>
                  {showAuthorColumn && (
                    <TableCell className="text-muted-foreground text-[12px] max-w-[120px] truncate">
                      {authorName(a) || '—'}
                    </TableCell>
                  )}
                  <TableCell className="text-[12px] whitespace-nowrap max-w-[130px] truncate">{a.category}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="tabular-nums text-[12px]">{formatNumber(a.views)}</TableCell>
                  <TableCell className="text-muted-foreground text-[11px] whitespace-nowrap">
                    {a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : '—'}
                  </TableCell>
                  {showBulkFlags && (
                    <TableCell>
                      <AdminArticleFlags
                        articleId={a.id}
                        isPinned={a.isPinned ?? false}
                        isFeatured={a.isFeatured ?? false}
                        isBreaking={a.isBreaking ?? false}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <ArticleRowMenu
                      article={a}
                      editBase={editBase}
                      onAction={(action) => runBulk(action, [a.id])}
                      onRequestRevision={() => openRevisionRequest([a.id])}
                      showRevisionRequest={showRevisionRequest}
                      limitedActions={useOwnBulkActions}
                      allowEdit={canEditArticle(a, currentUserId, canEditAny)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AdminTableShell>

      <AdminSecureActionDialog
        open={!!secureAction}
        title={secureAction ? SECURE_ACTION_COPY[secureAction.action]?.title ?? 'Confirm action' : ''}
        description={secureAction ? SECURE_ACTION_COPY[secureAction.action]?.description ?? '' : ''}
        confirmLabel={secureAction ? SECURE_ACTION_COPY[secureAction.action]?.confirm ?? 'Confirm' : 'Confirm'}
        requirePassword
        showAuthorNote
        authorNoteLabel="Note for author (optional)"
        loading={pending}
        onClose={() => setSecureAction(null)}
        onConfirm={async (payload) => {
          if (!secureAction) return;
          executeBulk(secureAction.action, secureAction.ids, payload);
        }}
      />

      <AdminSecureActionDialog
        open={!!revisionIds?.length}
        title="Return to author"
        description="Send a revision request to the original author. It will appear in their CMS dashboard."
        confirmLabel="Send request"
        variant="primary"
        requirePassword={false}
        showAuthorNote
        authorNoteRequired
        authorNoteLabel="Instructions for the author"
        authorNotePlaceholder="Describe what should be changed, corrected, or expanded…"
        loading={pending}
        onClose={() => setRevisionIds(null)}
        onConfirm={async (payload) => {
          if (!revisionIds?.length || !payload.authorNote) return;
          startTransition(async () => {
            try {
              const res = await requestArticleRevision(revisionIds, payload.authorNote!);
              toast.success(`Revision request sent to ${res.count} author(s)`);
              setRevisionIds(null);
              router.refresh();
            } catch (e: unknown) {
              toast.error(e instanceof Error ? e.message : 'Failed to send request');
            }
          });
        }}
      />
    </div>
  );
}