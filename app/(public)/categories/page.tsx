import Link from 'next/link';
import { getPublicCategories } from '@/lib/category-content';
import {
  categoryColorVars,
  categoryIconWrapStyle,
  categoryTextStyle,
  getCategoryHoverBorderClass,
  getCategoryHoverTextClass,
  getCategoryTextClass,
} from '@/lib/category-icons';
import { CategoryIconDisplay } from '@/components/category/CategoryIconDisplay';

export default async function CategoriesIndex() {
  const categories = await getPublicCategories();

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="h2 mb-2">Power Sector Categories</h1>
        <p className="text-muted-foreground max-w-prose">
          Focused coverage across Bangladesh&apos;s energy value chain. Click any sector for dedicated reporting, analysis and data.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const defaultTextClass = getCategoryTextClass(cat.name, cat.color);
          const hoverBorderClass = getCategoryHoverBorderClass(cat.name, cat.color);
          const hoverTextClass = getCategoryHoverTextClass(cat.name, cat.color);
          const iconWrapStyle = categoryIconWrapStyle(cat.color);
          const textStyle = categoryTextStyle(cat.color);

          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              style={categoryColorVars(cat.color)}
              className={`card category-card p-4 group transition-all hover:shadow-md flex flex-col ${hoverBorderClass}`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={`p-2 rounded-lg bg-muted transition flex-shrink-0 ${defaultTextClass}`}
                  style={iconWrapStyle}
                >
                  <CategoryIconDisplay
                    icon={cat.icon}
                    iconImageUrl={cat.iconImageUrl}
                    name={cat.name}
                    size={16}
                    className="h-4 w-4"
                    style={textStyle}
                  />
                </div>
                <div
                  className={`font-semibold text-[15px] leading-tight tracking-tight transition-colors ${defaultTextClass}`}
                  style={textStyle}
                >
                  {cat.name}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-snug line-clamp-2 flex-1">
                {cat.description ?? `Latest ${cat.name.toLowerCase()} coverage for Bangladesh's energy sector.`}
              </p>
              <div className={`mt-2.5 text-[10px] text-muted-foreground inline-flex items-center gap-1 transition-colors ${hoverTextClass}`}>
                {cat.articleCount ?? 0} articles <span className="group-hover:translate-x-0.5 transition">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {categories.length === 0 && (
        <p className="text-muted-foreground text-center py-12">No categories configured yet.</p>
      )}

      <div className="mt-8 text-center text-xs text-muted-foreground">
        {categories.length} sectors • Daily updates • In-depth analysis and project trackers
      </div>
    </div>
  );
}