'use client';

import { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { MagazineCoverMockup } from './MagazineCoverMockup';
import { MagazineFlipBook } from './MagazineFlipBook';

interface MagazineInteractivePreviewProps {
  coverUrl: string;
}

export function MagazineInteractivePreview({ coverUrl }: MagazineInteractivePreviewProps) {
  const [isFlipBookOpen, setIsFlipBookOpen] = useState(false);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Clickable cover to open the flipbook */}
      <div 
        onClick={() => setIsFlipBookOpen(true)}
        className="w-full cursor-pointer group relative transition-transform duration-300 hover:scale-[1.01]"
      >
        <MagazineCoverMockup coverUrl={coverUrl} />
        
        {/* Subtle hover overlay badge */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none">
          <div className="bg-emerald-600/90 text-white backdrop-blur-sm border border-emerald-500/20 rounded-full px-5 py-2.5 flex items-center gap-2 font-semibold shadow-lg text-sm scale-95 group-hover:scale-100 transition-transform duration-300">
            <Sparkles className="h-4 w-4 animate-pulse text-amber-300" />
            <span>Open Flipbook Preview</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-3 text-[10px] text-muted-foreground/75 flex items-center justify-center gap-1.5">
        <span>Print • Digital • Archive access</span>
        <span>•</span>
        <button 
          onClick={() => setIsFlipBookOpen(true)} 
          className="text-primary hover:underline font-medium inline-flex items-center gap-1"
        >
          <BookOpen className="h-3 w-3" /> Turn pages (HTML Flipbook)
        </button>
      </div>

      {/* Interactive 3D flipbook modal */}
      <MagazineFlipBook 
        coverUrl={coverUrl}
        isOpen={isFlipBookOpen}
        onClose={() => setIsFlipBookOpen(false)}
      />
    </div>
  );
}
