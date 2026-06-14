'use client';

import { useState } from 'react';
import { ArticleCard } from '@/components/news/ArticleCard';
import type { PublicArticleCard } from '@/lib/category-types';

export function SearchResults({ articles }: { articles: PublicArticleCard[] }) {
  const [q, setQ] = useState('');

  const results = !q.trim()
    ? articles
    : articles.filter((a) => {
        const query = q.toLowerCase();
        return (
          a.title.toLowerCase().includes(query)
          || a.excerpt.toLowerCase().includes(query)
          || a.category.toLowerCase().includes(query)
        );
      });

  return (
    <>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search power sector news..."
        className="mt-2 w-full max-w-lg bg-card border border-border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        autoFocus
      />

      <div className="mt-8 text-sm text-[#64748b] mb-3">
        {q ? `${results.length} result${results.length === 1 ? '' : 's'} for “${q}”` : `${articles.length} published articles`}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((a) => (
          <ArticleCard
            key={a.id}
            id={a.slug}
            title={a.title}
            excerpt={a.excerpt}
            category={a.category}
            imageUrl={a.imageUrl}
            author={a.author}
            date={a.date}
            readTime={a.readTime}
            views={a.views}
          />
        ))}
      </div>

      {results.length === 0 && q && (
        <p className="text-[#94a3b8] mt-6">No matches. Try “solar”, “tariff”, or “grid”.</p>
      )}
    </>
  );
}