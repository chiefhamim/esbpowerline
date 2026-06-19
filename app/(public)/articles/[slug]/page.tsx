import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatNumber } from '@/lib/utils';
import { heroImageStyle } from '@/lib/hero-image';
import { ArticleCard } from '@/components/news/ArticleCard';
import {
  getPublishedArticleBySlug,
  getRelatedPublishedArticles,
} from '@/lib/category-content';
import { incrementArticleView } from '@/lib/actions/articles';
import { auth } from '@/lib/auth';
import { can, type Role } from '@/lib/constants';
import { getArticleComments, getArticleSavedState } from '@/lib/actions/members';
import { SaveArticleButton } from '@/components/members/SaveArticleButton';
import { ArticleCommentSection } from '@/components/members/ArticleCommentSection';
import { ArticleAuthorSticky } from '@/components/shared/ArticleAuthorSticky';
import { NoImage } from '@/components/shared/NoImage';
import { hasArticleImage } from '@/lib/article-image';

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

  await incrementArticleView(article.id);

  const [related, session, comments, saved] = await Promise.all([
    getRelatedPublishedArticles(slug, article.category, article.tags, 3),
    auth(),
    getArticleComments(article.id),
    getArticleSavedState(article.id),
  ]);

  const role = session?.user?.role as Role | undefined;
  const signedIn = !!session?.user?.id;
  const canPostComment = signedIn && can(role, 'comment.create');
  const staffComment = can(role, 'comment.moderate_any');

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
    <div className="container py-10 max-w-3xl article-page--with-sticky-author">
      <Link href="/articles" className="text-sm text-primary hover:underline">← Back to news</Link>

      <div className="mt-4">
        <span className="category-pill">{article.category}</span>
        <h1 className="text-4xl font-semibold tracking-tight mt-3">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
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

      <ArticleAuthorSticky name={article.author} />

      <figure className="mt-6">
        <div className="rounded-xl w-full aspect-video border border-border overflow-hidden bg-muted/40 flex items-center justify-center relative">
          {hasArticleImage(article.imageUrl) ? (
            <Image
              src={article.imageUrl}
              alt={article.heroImage?.alt ?? article.title}
              fill
              priority
              style={heroImageStyle(article.heroImage)}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          ) : (
            <NoImage className="absolute inset-0 h-full w-full" />
          )}
        </div>
        {article.heroImage?.caption && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">{article.heroImage.caption}</figcaption>
        )}
      </figure>

      <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: article.content }} />

      <div className="mt-8 flex flex-wrap gap-2">
        {article.tags.map((t: string) => (
          <Link key={t} href={`/tags/${t}`} className="tag">#{t}</Link>
        ))}
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <ArticleCommentSection
          articleId={article.id}
          articleSlug={slug}
          canPostComment={canPostComment}
          staffComment={staffComment}
          initialComments={comments.map((c) => ({
            id: c.id,
            authorName: c.authorName,
            content: c.content,
            createdAt: c.createdAt,
          }))}
        />
      </div>

      <div className="mt-10 border-t border-border pt-8">
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