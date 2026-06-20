export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  iconImageUrl?: string | null;
  order: number;
  articleCount?: number;
};

export type PublicArticleCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  views: number;
  imageUrl: string;
  heroMeta?: any;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isPinned?: boolean;
  isTrending?: boolean;
};