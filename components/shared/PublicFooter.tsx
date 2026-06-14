import Link from 'next/link';
import { Zap } from 'lucide-react';
import type { PublicCategory } from '@/lib/category-types';
import { CATEGORIES } from '@/lib/constants';

export function PublicFooter({ categories = [] }: { categories?: PublicCategory[] }) {
  const sectorLinks = categories.length
    ? categories.map((c) => ({ name: c.name, slug: c.slug }))
    : CATEGORIES.map((c) => ({ name: c, slug: c.toLowerCase().replace(/\s+/g, '-') }));
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/70 bg-muted/40 pt-12 pb-10 text-sm transition-colors duration-200 overflow-hidden">
      {/* Subtle Geometric Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.12)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.12)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-70" />
      
      {/* Radial overlay to gracefully fade the pattern near the margins */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,hsl(var(--background))_90%)] pointer-events-none opacity-80" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
          {/* Section 1: Brand & Office Address */}
          <div className="md:pr-12 space-y-5">
            <div>
              <Link href="/" className="block hover:opacity-90 transition-opacity w-fit">
                <img 
                  src="/images/logo.jpg" 
                  alt="ESB PowerLine" 
                  className="h-10 w-auto object-contain brightness-100 dark:brightness-95 contrast-105 rounded shadow-sm border border-border/20" 
                />
              </Link>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed font-sans max-w-sm">
                Bangladesh’s premier independent source for power sector news, data, analysis and the monthly magazine.
              </p>
            </div>
            
            <div className="pt-4 border-t border-border/30 space-y-2 font-sans">
              <span className="font-semibold text-foreground uppercase tracking-widest text-[9px]">OFFICE ADDRESS</span>
              <div className="space-y-1">
                <div className="font-semibold text-foreground text-xs">ESB Media Limited</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed max-w-sm">
                  House #36/1, Avenue #01, Block-A, Section-10, Mirpur, Pallabi, Dhaka-1216, Bangladesh.
                </div>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground">
              © {year} ESB PowerLine. All rights reserved.
            </div>
          </div>

          {/* Section 2: Directory Links */}
          <div className="md:px-12 md:border-l md:border-border/30">
            <div className="grid grid-cols-2 gap-8">
              {/* Explore Column */}
              <div>
                <div className="font-display font-semibold text-[10px] tracking-[0.1em] uppercase text-foreground mb-4">EXPLORE</div>
                <ul className="space-y-2.5 text-xs">
                  <li><Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors font-medium">Latest News</Link></li>
                  <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors font-medium">All Categories</Link></li>
                  <li><Link href="/magazine" className="text-muted-foreground hover:text-primary transition-colors font-medium">Monthly Magazine</Link></li>
                  <li><Link href="/data-reports/power-grid" className="text-muted-foreground hover:text-primary transition-colors font-medium">Grid Explorer</Link></li>
                  <li><Link href="/search" className="text-muted-foreground hover:text-primary transition-colors font-medium">Search</Link></li>
                </ul>
              </div>

              {/* Sectors Column */}
              <div>
                <div className="font-display font-semibold text-[10px] tracking-[0.1em] uppercase text-foreground mb-4">SECTORS</div>
                <ul className="space-y-2 text-xs">
                  {sectorLinks.slice(0, 6).map((cat) => (
                    <li key={cat.slug}>
                      <Link href={`/categories/${cat.slug}`} className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Editorial & Professionals */}
          <div className="md:pl-12 md:border-l md:border-border/30">
            <div className="grid grid-cols-2 gap-8">
              {/* Editorial & Contact Info */}
              <div>
                <div className="font-display font-semibold text-[10px] tracking-[0.1em] uppercase text-foreground mb-4">EDITORIAL & OFFICE</div>
                <div className="text-xs text-muted-foreground space-y-3.5 font-sans leading-relaxed">
                  <div>
                    <span className="font-semibold text-foreground block text-[9px] uppercase tracking-widest mb-0.5">Editor & Publisher</span>
                    <span className="text-foreground font-medium">Farid Uddin Ahmed</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block text-[9px] uppercase tracking-widest mb-0.5">E-mail</span>
                    <a href="mailto:news@esbpowerline.com" className="hover:text-primary transition-colors block font-medium truncate">news@esbpowerline.com</a>
                    <a href="mailto:esb.bd08@gmail.com" className="hover:text-primary transition-colors block font-medium truncate">esb.bd08@gmail.com</a>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block text-[9px] uppercase tracking-widest mb-0.5">Advertising Dept.</span>
                    <a href="tel:+8801711378733" className="hover:text-primary transition-colors font-medium text-foreground block">+8801711-378733</a>
                  </div>
                </div>
              </div>

              {/* Professionals Column */}
              <div>
                <div className="font-display font-semibold text-[10px] tracking-[0.1em] uppercase text-foreground mb-4">SUBSCRIBERS</div>
                <div className="text-xs text-muted-foreground space-y-3">
                  <p className="leading-relaxed text-[11px]">
                    Institutional access, data packages and archives.
                  </p>
                  <Link href="/login" className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-semibold text-xs mt-1">
                    Login Portal →
                  </Link>
                  <div className="pt-2 border-t border-border/20 text-[10px] text-muted-foreground/80 leading-normal">
                    For editors, writers and administration portal.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-border/50 text-[11px] text-muted-foreground flex flex-col md:flex-row md:items-center gap-y-2 justify-between">
          <div className="max-w-md leading-relaxed">
            Authoritative coverage for utilities, regulators, IPPs, investors and policymakers.
          </div>
          <div className="flex gap-x-5">
            <Link href="/about" className="hover:text-foreground transition-colors font-medium">About</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors font-medium">Contact</Link>
            <a href="#top" className="hover:text-foreground transition-colors font-medium">Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
