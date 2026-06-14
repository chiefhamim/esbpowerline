'use client';

import React, { useState } from 'react';
import { Play, X, Clock, User, Users } from 'lucide-react';

interface Interview {
  id: string;
  title: string;
  guest: string;
  role: string;
  duration: string;
  date: string;
  thumbnail: string;
  youtubeId: string; // For embed
  excerpt: string;
}

const interviews: Interview[] = [
  {
    id: 'i1',
    title: 'Powering the Future: SREDA’s 2030 Renewable Roadmap',
    guest: 'Dr. Shahana Rahman',
    role: 'Chairman, SREDA',
    duration: '24:15',
    date: 'Jun 11',
    thumbnail: '/images/download (6).jfif',
    youtubeId: 'dQw4w9wgxcQ', // demo - replace with real power sector video IDs in production
    excerpt: 'Inside the new solar + wind tender pipeline and grid integration challenges.',
  },
  {
    id: 'i2',
    title: 'Grid Modernization at PGCB: 400kV Backbone Update',
    guest: 'Engr. Nasir Uddin',
    role: 'Managing Director, PGCB',
    duration: '18:40',
    date: 'Jun 9',
    thumbnail: '/images/download (7).jfif',
    youtubeId: '3JZ_2t4vV3c',
    excerpt: 'How the new transmission corridors are unlocking southern generation.',
  },
  {
    id: 'i3',
    title: 'Tariff Reform & Consumer Protection — A BERC Perspective',
    guest: 'Barrister M. Rahman',
    role: 'Member, BERC',
    duration: '31:05',
    date: 'Jun 5',
    thumbnail: '/images/download (8).jfif',
    youtubeId: '9bZkp7q19f0',
    excerpt: 'Balancing cost recovery with affordability in the new bulk supply tariff.',
  },
  {
    id: 'i4',
    title: 'Rooppur Nuclear: First Fuel Loading & Safety First',
    guest: 'Dr. A. K. M. Fazle Kabir',
    role: 'Project Director, Rooppur NPP',
    duration: '27:30',
    date: 'Jun 3',
    thumbnail: '/images/download (9).jfif',
    youtubeId: 'jNQXAC9IVRw',
    excerpt: 'Milestones, fuel cycle, and what it means for Bangladesh’s baseload.',
  },
];

export function InterviewsSection({ initialInterviews }: { initialInterviews?: Interview[] }) {
  const [selected, setSelected] = useState<Interview | null>(null);
  const interviewsList = initialInterviews || interviews;

  const openInterview = (interview: Interview) => setSelected(interview);
  const closeModal = () => setSelected(null);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="uppercase tracking-[2.5px] text-[10px] text-emerald-500 dark:text-emerald-400 font-bold mb-1.5">IN CONVERSATION</div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Latest Interviews</h2>
          </div>
        </div>
        <a href="https://youtube.com" target="_blank" className="text-sm text-primary flex items-center gap-1 hover:underline font-medium">
          Watch all on YouTube <span>→</span>
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {interviewsList.map((iv) => (
          <button
            key={iv.id}
            onClick={() => openInterview(iv)}
            className="group text-left block rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="relative aspect-video">
              <img 
                src={iv.thumbnail} 
                alt={iv.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition group-hover:scale-110">
                  <Play className="h-5 w-5 ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] bg-black/70 rounded text-white flex items-center gap-1">
                <Clock className="h-3 w-3" /> {iv.duration}
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-emerald-400 font-medium mb-1">{iv.date} • {iv.guest}</div>
              <h4 className="font-semibold text-[15px] leading-tight tracking-[-0.01em] line-clamp-2 group-hover:text-primary transition">{iv.title}</h4>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{iv.excerpt}</p>
              <div className="mt-3 text-[10px] text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> {iv.role}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Sleek YouTube Embed Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={closeModal}>
          <div 
            className="w-full max-w-4xl rounded-2xl overflow-hidden bg-[#0a1628] border border-[#334155] shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#334155]">
              <div>
                <div className="font-semibold text-lg tracking-tight">{selected.title}</div>
                <div className="text-xs text-muted-foreground">{selected.guest} • {selected.role} • {selected.duration}</div>
              </div>
              <button onClick={closeModal} className="p-2 text-muted-foreground hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selected.youtubeId}?autoplay=1`}
                title={selected.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5 text-sm text-[#94a3b8]">
              {selected.excerpt} — Watch the full conversation on our YouTube channel.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
