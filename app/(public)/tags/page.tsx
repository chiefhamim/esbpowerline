import Link from 'next/link';
import { getPublicTagCounts } from '@/lib/category-content';

export const metadata = {
  title: 'Tags | ESB PowerLine',
};

export default async function TagsIndex() {
  const sortedTags = await getPublicTagCounts();

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Tags</h1>
      <p className="text-muted-foreground mb-8">Explore stories by topic</p>

      {sortedTags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {sortedTags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#334155] px-4 py-1.5 text-sm hover:border-[#3b82f6] hover:text-[#3b82f6]"
            >
              #{tag} <span className="text-[#64748b] text-xs">({count})</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No tags on published articles yet.</p>
      )}
    </div>
  );
}