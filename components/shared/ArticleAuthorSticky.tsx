import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

type ArticleAuthorStickyProps = {
  name: string;
  className?: string;
  /** sticky = pins to scrollport bottom-left while reading; cms = story editor variant */
  variant?: 'sticky' | 'cms';
};

export function ArticleAuthorSticky({
  name,
  className,
  variant = 'sticky',
}: ArticleAuthorStickyProps) {
  return (
    <div
      className={cn(
        'article-author-sticky',
        variant === 'cms' && 'article-author-sticky--cms',
        variant === 'sticky' && 'article-author-sticky--sticky',
        className,
      )}
      aria-label={`Written by ${name}`}
    >
      <User className="article-author-sticky__icon" aria-hidden />
      <span className="article-author-sticky__label">By</span>
      <span className="article-author-sticky__name">{name}</span>
    </div>
  );
}