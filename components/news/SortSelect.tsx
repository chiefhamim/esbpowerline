'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, Check } from 'lucide-react';

export function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'views') {
      params.set('sort', 'views');
    } else {
      params.delete('sort');
    }

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel = currentSort === 'views' ? 'Most Viewed' : 'Latest First';

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 bg-card/65 backdrop-blur-md text-xs font-semibold text-foreground hover:bg-muted/30 transition shadow-sm select-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Sort: {activeLabel}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => handleSort('latest')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all select-none text-left ${
              currentSort !== 'views'
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <span>Latest First</span>
            {currentSort !== 'views' && <Check className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={() => handleSort('views')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all select-none text-left ${
              currentSort === 'views'
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <span>Most Viewed</span>
            {currentSort === 'views' && <Check className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}
