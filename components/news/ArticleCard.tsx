import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt?: string | null;
  category: string;
  imageUrl?: string | null;
  author?: string;
  date?: string | Date;
  views?: number;
  readTime?: number;
}

export function ArticleCard({ id, title, excerpt, category, imageUrl, author, date, views, readTime }: ArticleCardProps) {
  const timeAgo = date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '';

  return (
    <Link href={`/articles/${id}`} className="article-card group block">
      <div className="article-card__image-wrapper relative">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="article-card__image" />
        ) : (
          <div className="article-card__image bg-muted flex items-center justify-center text-muted-foreground">No image</div>
        )}
        <span className="absolute top-3 left-3 category-pill text-[10px] font-medium tracking-wide">{category}</span>
      </div>
      <div className="p-5">
        <h3 className="font-semibold tracking-[-0.015em] leading-tight line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
        {excerpt && <p className="mt-2.5 text-[13px] text-muted-foreground line-clamp-2 leading-snug">{excerpt}</p>}
        <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-medium">{author || 'ESB Staff'}</span>
          <span>{timeAgo} {readTime ? `· ${readTime} min` : ''}</span>
        </div>
      </div>
    </Link>
  );
}
