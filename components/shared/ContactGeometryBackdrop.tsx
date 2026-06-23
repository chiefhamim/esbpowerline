'use client';

import { useEffect, useRef } from 'react';

export function ContactGeometryBackdrop() {
  const topLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticked = false;
    const handleScroll = () => {
      if (!ticked) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Apply soft parallax translations to the elements
          if (topLeftRef.current) {
            topLeftRef.current.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
          }
          if (bottomRightRef.current) {
            bottomRightRef.current.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
          }
          ticked = false;
        });
        ticked = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Top-Left Communication Web & Concentric Wave Nodes */}
      <div
        ref={topLeftRef}
        className="absolute -top-12 -left-16 will-change-transform"
      >
        <svg
          className="w-[500px] h-[500px] opacity-[0.12] text-primary transition-colors duration-500 origin-center animate-[spin_240s_linear_infinite]"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer circle with nodes */}
          <circle cx="300" cy="300" r="250" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 6" />
          <circle cx="300" cy="300" r="180" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="300" cy="300" r="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="300" cy="300" r="60" stroke="currentColor" strokeWidth="0.75" />
          
          {/* Signal waves (concentric arcs) */}
          <path d="M 120 300 A 180 180 0 0 1 480 300" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          <path d="M 180 300 A 120 120 0 0 0 420 300" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />

          {/* Connection Lines / Axes */}
          <line x1="300" y1="50" x2="300" y2="550" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="50" y1="300" x2="550" y2="300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="123" y1="123" x2="477" y2="477" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <line x1="477" y1="123" x2="123" y2="477" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

          {/* Nodes indicating transmission intersections */}
          <circle cx="300" cy="50" r="4" fill="currentColor" />
          <circle cx="300" cy="550" r="4" fill="currentColor" />
          <circle cx="50" cy="300" r="4" fill="currentColor" />
          <circle cx="550" cy="300" r="4" fill="currentColor" />
          
          <circle cx="123" cy="123" r="3" fill="currentColor" opacity="0.8" />
          <circle cx="477" cy="477" r="3" fill="currentColor" opacity="0.8" />
          <circle cx="477" cy="123" r="3" fill="currentColor" opacity="0.8" />
          <circle cx="123" cy="477" r="3" fill="currentColor" opacity="0.8" />

          <circle cx="300" cy="120" r="4.5" fill="currentColor" />
          <circle cx="300" cy="480" r="4.5" fill="currentColor" />
          <circle cx="120" cy="300" r="4.5" fill="currentColor" />
          <circle cx="480" cy="300" r="4.5" fill="currentColor" />

          {/* Hexagonal path linkages */}
          <polygon points="300,120 456,210 456,390 300,480 144,390 144,210" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
        </svg>
      </div>

      {/* Bottom-Right Transmission Signal Geometry (moves at different speed) */}
      <div
        ref={bottomRightRef}
        className="absolute -bottom-24 -right-24 will-change-transform"
      >
        <svg
          className="w-[550px] h-[550px] opacity-[0.1] text-primary transition-colors duration-500 origin-center animate-[spin_300s_linear_infinite_reverse]"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Signal wave paths */}
          <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="300" cy="300" r="210" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 4" />
          <circle cx="300" cy="300" r="150" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="300" cy="300" r="90" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />

          {/* Grid radiating pathways */}
          <path d="M 300 300 C 100 100, 500 100, 300 300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M 300 300 C 500 500, 100 500, 300 300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />

          {/* Signal pulses as nodes */}
          <circle cx="300" cy="90" r="3.5" fill="currentColor" />
          <circle cx="482" cy="205" r="3" fill="currentColor" />
          <circle cx="482" cy="395" r="3" fill="currentColor" />
          <circle cx="300" cy="510" r="3.5" fill="currentColor" />
          <circle cx="118" cy="395" r="3" fill="currentColor" />
          <circle cx="118" cy="205" r="3" fill="currentColor" />

          {/* Spiral connection curves */}
          <path d="M 300 300 A 150 150 0 0 1 450 150 A 75 75 0 0 1 525 225" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
          <path d="M 300 300 A 150 150 0 0 0 150 450 A 75 75 0 0 0 75 375" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
        </svg>
      </div>

      {/* Subtle connection wave links at the center background */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[300px] opacity-[0.05] text-primary"
        viewBox="0 0 1200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M -100,150 Q 200,50 500,150 T 1100,150 T 1300,150"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <path
          d="M -100,180 Q 250,280 600,180 T 1100,180 T 1300,180"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="2 6"
        />
        <circle cx="500" cy="150" r="4" fill="currentColor" />
        <circle cx="600" cy="180" r="3" fill="currentColor" />
      </svg>
    </div>
  );
}
