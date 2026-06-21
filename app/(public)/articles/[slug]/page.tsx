import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatExactDate, formatNumber, slugify, extractKeywords } from '@/lib/utils';
import { heroImageStyle } from '@/lib/hero-image';
import { ArticleCard } from '@/components/news/ArticleCard';
import {
  getPublishedArticleBySlug,
  getRelatedPublishedArticles,
} from '@/lib/category-content';
import { ArticleViewTracker } from '@/components/analytics/ArticleViewTracker';
import { auth } from '@/lib/auth';
import { can, type Role } from '@/lib/constants';
import { getArticleComments, getArticleSavedState } from '@/lib/actions/members';
import { SaveArticleButton } from '@/components/members/SaveArticleButton';
import { ArticleCommentSection } from '@/components/members/ArticleCommentSection';
import { ArticleAuthorSticky } from '@/components/shared/ArticleAuthorSticky';
import { NoImage } from '@/components/shared/NoImage';
import { hasArticleImage } from '@/lib/article-image';
import { sanitizeArticleHtml } from '@/lib/sanitize-article-html';

export const revalidate = 60;

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
    <div className="container py-10 max-w-3xl article-page--with-sticky-author fluid-article-container">
      <ArticleViewTracker articleId={article.id} />
      <Link href="/articles" className="text-sm text-primary hover:underline">← Back to news</Link>

      <header className="article-header mb-8 mt-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">{article.category}</span>
        </div>
        <h1 className="font-display font-extrabold tracking-tight leading-[1.05] text-foreground mb-6">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-muted-foreground leading-snug font-light mb-8 article-excerpt">
            {article.excerpt.replace(/\[&hellip;\]/g, '...').replace(/&hellip;/g, '...')}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-5">
          <div className="flex items-center gap-4">
            <Link href={`/authors/${slugify(article.author)}`} className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-lg uppercase shadow-sm hover:ring-2 hover:ring-primary transition-all shrink-0">
              {article.author.substring(0, 2)}
            </Link>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-x-1.5 text-base font-semibold text-foreground">
                <Link href={`/authors/${slugify(article.author)}`} className="hover:text-primary transition-colors">
                  {article.author}
                </Link>
                {article.collaborators && article.collaborators.length > 0 && (
                  <>
                    <span className="text-xs font-normal text-muted-foreground">with:</span>
                    <Link
                      href={`/authors/${slugify(article.collaborators[0].name)}`}
                      className="hover:text-primary transition-colors underline decoration-dotted underline-offset-2"
                    >
                      {article.collaborators[0].name}
                    </Link>
                    {article.collaborators.length > 1 && (
                      <span
                        className="bg-muted-foreground/10 px-1.5 py-0.5 rounded text-[10px] font-bold text-muted-foreground cursor-help"
                        title={article.collaborators.slice(1).map((c) => c.name).join(', ')}
                      >
                        +{article.collaborators.length - 1}
                      </span>
                    )}
                  </>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{formatExactDate(article.date)} <span className="mx-1.5 opacity-50">•</span> {article.readTime} min read</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground mr-2 font-medium">{formatNumber(article.views)} views</span>
            <SaveArticleButton
              articleId={article.id}
              articleSlug={slug}
              initialSaved={saved}
              signedIn={signedIn}
            />
          </div>
        </div>
      </header>

      <figure className="mt-6">
        <div className="image-container-with-credit rounded-xl w-full aspect-video border border-border overflow-hidden bg-muted/40 flex items-center justify-center">
          {hasArticleImage(article.imageUrl) ? (
            <>
              <Image
                src={article.imageUrl}
                alt={article.heroImage?.alt ?? article.title}
                fill
                priority
                style={heroImageStyle(article.heroImage)}
                sizes="(max-width: 768px) 100vw, 800px"
              />
              {article.imageCredit && (
                <span className="image-credit-overlay">
                  Photo: {article.imageCredit}
                </span>
              )}
            </>
          ) : (
            <NoImage className="absolute inset-0 h-full w-full" />
          )}
        </div>
        {article.heroImage?.caption && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">{article.heroImage.caption}</figcaption>
        )}
      </figure>



      <div className="article-body mt-8 text-lg md:text-xl leading-relaxed pb-safe" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }} />

      {(() => {
        const displayTags = article.tags && article.tags.length > 0
          ? article.tags
          : extractKeywords(article.title, article.content);
        if (displayTags.length === 0) return null;
        return (
          <div className="mt-10 pt-6 border-t border-border/30">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 block mb-3">Trending Keywords</span>
            <div className="flex flex-wrap gap-2">
              {displayTags.map((t: string) => (
                <Link key={t} href={`/tags/${t}`} className="tag">#{t}</Link>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="mt-10">
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

      <div className="mt-10">
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