import Link from 'next/link';
import { Zap } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-muted/40 pt-12 pb-10 text-sm transition-colors duration-200">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
              <span className="text-primary">⚡</span>
              ESB PowerLine
            </Link>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed pr-4 font-sans">
              Bangladesh’s premier independent source for power sector news, data, analysis and the monthly magazine.
            </p>
            <div className="mt-4 text-[11px] text-muted-foreground">
              © {year} ESB PowerLine
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="font-display font-bold text-[11px] uppercase tracking-wider text-foreground mb-4">EXPLORE</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">Latest News</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">All Categories</Link></li>
              <li><Link href="/magazine" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">Monthly Magazine</Link></li>
              <li><Link href="/data-reports/power-grid" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">Grid Explorer</Link></li>
              <li><Link href="/search" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">Search</Link></li>
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <div className="font-display font-bold text-[11px] uppercase tracking-wider text-foreground mb-4">SECTORS</div>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES.slice(0, 5).map(cat => {
                const slug = cat.toLowerCase().replace(/\s+/g, '-');
                return (
                  <li key={cat}>
                    <Link href={`/categories/${slug}`} className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                      {cat}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden md:block">
            <div className="font-display font-bold text-[11px] uppercase tracking-wider text-foreground mb-4">MORE</div>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES.slice(5).map(cat => {
                const slug = cat.toLowerCase().replace(/\s+/g, '-');
                return (
                  <li key={cat}>
                    <Link href={`/categories/${slug}`} className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                      {cat}
                    </Link>
                  </li>
                );
              })}
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">Contact</Link></li>
            </ul>
          </div>

          {/* Professionals */}
          <div>
            <div className="font-display font-bold text-[11px] uppercase tracking-wider text-foreground mb-4">FOR PROFESSIONALS</div>
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="leading-relaxed">Institutional access, data packages and the full archive.</div>
              <Link href="/login" className="inline-block text-primary hover:text-primary/80 transition-colors font-semibold text-sm mt-1">
                Login →
              </Link>
              <div className="pt-2 text-[10px] leading-relaxed">Dedicated portals for editors and administrators.</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 text-[11px] text-muted-foreground flex flex-col md:flex-row md:items-center gap-y-2 justify-between">
          <div className="max-w-md leading-relaxed">
            Authoritative coverage for utilities, regulators, IPPs, investors and policymakers.
          </div>
          <div className="flex gap-x-5">
            <Link href="/about" className="hover:text-foreground transition-colors duration-200 font-medium">About</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors duration-200 font-medium">Contact</Link>
            <a href="#top" className="hover:text-foreground transition-colors duration-200 font-medium">Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
