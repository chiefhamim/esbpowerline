'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArticleCard } from '@/components/news/ArticleCard';
import { demoArticles } from '@/lib/data';

export default function SearchPage() {
  const [q, setQ] = useState('');

  const results = !q 
    ? demoArticles 
    : demoArticles.filter(a =>
        a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(q.toLowerCase()) ||
        a.category.toLowerCase().includes(q.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
      );

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-display font-bold tracking-tight">Search</h1>
      <p className="text-muted-foreground mb-6">Search titles, excerpts, categories, and tags.</p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search power sector news..."
        className="mt-2 w-full max-w-lg bg-card border border-border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        autoFocus
      />

      <div className="mt-8 text-sm text-[#64748b] mb-3">
        {q ? `${results.length} result${results.length === 1 ? '' : 's'} for “${q}”` : `${demoArticles.length} total articles`}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(a => (
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

      <div className="mt-12 text-xs text-[#64748b]">
        Client-side search for demo. Server-side + Prisma full-text coming when DB stabilized.
      </div>
    </div>
  );
}
