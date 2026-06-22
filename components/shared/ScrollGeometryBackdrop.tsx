'use client';

import { useEffect, useRef } from 'react';

export function ScrollGeometryBackdrop() {
  const polarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticked = false;
    const handleScroll = () => {
      if (!ticked) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Apply soft parallax translate3d calculations directly to element styles (no React state updates)
          if (polarRef.current) {
            polarRef.current.style.transform = `translate3d(0, ${scrollY * 0.14}px, 0)`;
          }
          ticked = false;
        });
        ticked = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to set initial coordinates
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top-right polar coordinate / radar network grid (slow spin animation + scroll parallax) */}
      <div
        ref={polarRef}
        className="absolute -top-12 -right-16 will-change-transform"
      >
        <svg
          className="w-[550px] h-[550px] opacity-[0.15] text-primary transition-colors duration-500 origin-center animate-[spin_180s_linear_infinite]"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Concentric grid circles */}
          <circle cx="300" cy="300" r="80" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="300" cy="300" r="160" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="300" cy="300" r="240" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 6" />
          <circle cx="300" cy="300" r="320" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="300" cy="300" r="400" stroke="currentColor" strokeWidth="0.5" strokeDasharray="12 6" />
          
          {/* Grid axes */}
          <line x1="300" y1="0" x2="300" y2="600" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="0" y1="300" x2="600" y2="300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="88" y1="88" x2="512" y2="512" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <line x1="512" y1="88" x2="88" y2="512" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          
          {/* Intersecting node points */}
          <circle cx="300" cy="220" r="3.5" fill="currentColor" />
          <circle cx="300" cy="140" r="4.5" fill="currentColor" />
          <circle cx="460" cy="300" r="3.5" fill="currentColor" />
          <circle cx="140" cy="300" r="3.5" fill="currentColor" />
          <circle cx="300" cy="460" r="4.5" fill="currentColor" />
          <circle cx="413" cy="413" r="3" fill="currentColor" opacity="0.7" />
          <circle cx="187" cy="187" r="3" fill="currentColor" opacity="0.7" />
          
          {/* Constellation web linkages */}
          <path d="M300 140 L460 300 L300 460 L140 300 Z" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <path d="M300 220 L413 413 M300 220 L187 187" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
      </div>
    </div>
  );
}
