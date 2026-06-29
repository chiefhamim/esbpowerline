import Link from 'next/link';
import { requireMemberSession } from '@/lib/member-auth';
import { getMemberSavedArticles, getMemberSavedMagazines } from '@/lib/actions/members';
import { ArticleCard } from '@/components/news/ArticleCard';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Saved | Member library',
};

export default async function MemberSavedPage() {
  const session = await requireMemberSession();
  const [articles, magazines] = await Promise.all([
    getMemberSavedArticles(),
    getMemberSavedMagazines(),
  ]);

  return (
    <div className="space-y-10">
      <section className="member-section">
        <h2 className="member-section__title">Saved articles</h2>
        {articles.length === 0 ? (
          <div className="member-empty">
            <p>No saved articles yet.</p>
            <Link href="/articles" className="btn btn-primary text-sm mt-4">Browse latest news</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.slug}
                title={article.title}
                shortTitle={article.shortTitle}
                excerpt={article.excerpt}
                category={article.category}
                imageUrl={article.imageUrl}
                author={article.author}
                date={article.date}
                readTime={article.readTime}
                views={article.views}
              />
            ))}
          </div>
        )}
      </section>

      <section className="member-section">
        <h2 className="member-section__title">Saved magazine issues</h2>
        {magazines.length === 0 ? (
          <div className="member-empty">
            <p>No saved magazine issues yet.</p>
            <Link href="/members/magazine" className="btn btn-primary text-sm mt-4">Open magazine archive</Link>
          </div>
        ) : (
          <ul className="member-list">
            {magazines.map((issue) => (
              <li key={issue.id} className="member-list__item">
                <div>
                  <p className="font-medium text-foreground">{issue.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(issue.issueDate.toISOString())}
                  </p>
                </div>
                {issue.pdfUrl ? (
                  <a href={issue.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-xs">
                    Download PDF
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}