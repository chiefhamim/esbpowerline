import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatNumber } from '@/lib/utils';
import { ArticleCard } from '@/components/news/ArticleCard';
import {
  getPublishedArticleBySlug,
  getRelatedPublishedArticles,
} from '@/lib/category-content';
import { auth } from '@/lib/auth';
import { getArticleComments, getArticleSavedState } from '@/lib/actions/members';
import { SaveArticleButton } from '@/components/members/SaveArticleButton';
import { ArticleCommentSection } from '@/components/members/ArticleCommentSection';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return { title: 'Article not found | ESB PowerLine' };

  return {
    title: `${article.title} | ESB PowerLine`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.imageUrl }],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const [related, session, comments, saved] = await Promise.all([
    getRelatedPublishedArticles(slug, article.category, article.tags, 3),
    auth(),
    getArticleComments(article.id),
    getArticleSavedState(article.id),
  ]);

  const signedIn = !!session?.user?.id;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ESB PowerLine',
    },
  };

  return (
    <div className="container py-10 max-w-3xl">
      <Link href="/articles" className="text-sm text-[#3b82f6]">← Back to news</Link>

      <div className="mt-4">
        <span className="category-pill">{article.category}</span>
        <h1 className="text-4xl font-semibold tracking-tight mt-3">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-[#94a3b8] mt-3">
          <span>{article.author}</span>
          <span>{formatDate(article.date)}</span>
          <span>{article.readTime} min read</span>
          <span>{formatNumber(article.views)} views</span>
        </div>
      </div>

      <div className="mt-5">
        <SaveArticleButton
          articleId={article.id}
          articleSlug={slug}
          initialSaved={saved}
          signedIn={signedIn}
        />
      </div>

      <img src={article.imageUrl} alt={article.title} className="mt-6 rounded-xl w-full aspect-video object-cover border border-[#334155]" />

      <div className="prose prose-invert mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

      <div className="mt-8 flex flex-wrap gap-2">
        {article.tags.map((t: string) => (
          <Link key={t} href={`/tags/${t}`} className="tag">#{t}</Link>
        ))}
      </div>

      <div className="mt-10 border-t border-[#334155] pt-8">
        <ArticleCommentSection
          articleId={article.id}
          articleSlug={slug}
          signedIn={signedIn}
          initialComments={comments.map((c) => ({
            id: c.id,
            authorName: c.authorName,
            content: c.content,
            createdAt: c.createdAt,
          }))}
        />
      </div>

      <div className="mt-10 border-t border-[#334155] pt-8">
        <h3 className="font-semibold mb-4">Related stories</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {related.map((r) => (
            <ArticleCard
              key={r.id}
              id={r.slug}
              title={r.title}
              excerpt={r.excerpt}
              category={r.category}
              imageUrl={r.imageUrl}
              author={r.author}
              date={r.date}
              readTime={r.readTime}
              views={r.views}
            />
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}