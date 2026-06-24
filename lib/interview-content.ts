export type Interview = {
  id: string;
  title: string;
  guest: string;
  role: string;
  duration: string;
  date: string;
  thumbnail: string;
  youtubeId: string;
  excerpt: string;
};

export const DEFAULT_INTERVIEWS: Interview[] = [
  {
    id: 'yt-smart-grid-2026',
    title: 'Exclusive: The Future of Bangladesh\'s National Grid and Smart Transmission Networks',
    guest: 'Dr. Tariq Rahman',
    role: 'Grid Modernization Specialist',
    duration: '15:24',
    date: 'Jun 24',
    thumbnail: '/images/yt_tm_1.jpg',
    youtubeId: '9ngsY7vBm_Y',
    excerpt: 'An in-depth discussion on shifting from conventional to digital substations, minimizing transmission losses, and integrating grid-scale solar.',
  },
  {
    id: 'yt-lng-crisis-2026',
    title: 'Addressing the Fuel Crisis: LNG Imports, Domestic Gas Exploration & Policy Reforms',
    guest: 'Nasrul Hamid',
    role: 'Energy Policy Advisor',
    duration: '18:40',
    date: 'Jun 18',
    thumbnail: '/images/yt_tm_2.jpg',
    youtubeId: 'VWAOGfPdLcE',
    excerpt: 'Can Bangladesh secure long-term energy stability? Exploring strategic terminal expansion, import costs, and deep-sea exploration prospects.',
  },
  {
    id: 'yt-green-energy-2041',
    title: 'Scaling Renewables: Transitioning to 40% Green Energy by 2041',
    guest: 'Fahmida Khatun',
    role: 'Renewable Energy Director',
    duration: '12:15',
    date: 'Jun 10',
    thumbnail: '/images/yt_tm_3.jpg',
    youtubeId: '4HwoHJshSt8',
    excerpt: 'A critical analysis of the incentives, land availability constraints, and corporate power purchase agreements driving the green transition.',
  },
  {
    id: 'yt-cross-border-trade',
    title: 'The Cross-Border Power Trade: Importing Hydroelectricity from Nepal and Bhutan',
    guest: 'Salehuddin Ahmed',
    role: 'Regional Trade Economist',
    duration: '14:50',
    date: 'May 28',
    thumbnail: '/images/yt_tm_1.jpg',
    youtubeId: 'd37OcTjLv9Q',
    excerpt: 'How regional grid connectivity and tripartite agreements will help Bangladesh secure clean, low-cost hydropower from the Himalayas.',
  },
];

/** Encode local asset paths that may contain spaces or special characters. */
export function encodeInterviewAssetUrl(url: string): string {
  const trimmed = url?.trim() ?? '';
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return encodeURI(trimmed);
}

/** Accept a bare ID or a full YouTube URL from admin settings. */
export function extractYoutubeId(raw: string | undefined): string | null {
  const value = raw?.trim() ?? '';
  if (!value) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function normalizeInterviewEntry(raw: unknown, index: number): Interview | null {
  if (!raw || typeof raw !== 'object') return null;

  const item = raw as Partial<Interview>;
  const youtubeId = extractYoutubeId(item.youtubeId) ?? '';
  const id = typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `interview-${index + 1}`;

  if (!youtubeId && !item.title?.trim() && !item.guest?.trim()) return null;

  return {
    id,
    title: item.title?.trim() || 'Untitled interview',
    guest: item.guest?.trim() || 'Guest',
    role: item.role?.trim() || 'Energy sector',
    duration: item.duration?.trim() || '—',
    date: item.date?.trim() || '',
    thumbnail: encodeInterviewAssetUrl(item.thumbnail?.trim() || '/images/download (6).jfif'),
    youtubeId,
    excerpt: item.excerpt?.trim() || '',
  };
}

/** Coerce CMS/Prisma JSON into a safe interview list for the homepage. */
export function normalizeInterviews(source: unknown): Interview[] {
  const rows = Array.isArray(source) ? source : [];
  const normalized = rows
    .map((row, index) => normalizeInterviewEntry(row, index))
    .filter((row): row is Interview => row !== null);

  return normalized.length > 0 ? normalized : DEFAULT_INTERVIEWS;
}

export function youtubeEmbedUrl(youtubeId: string, autoplay = true): string {
  const id = extractYoutubeId(youtubeId);
  if (!id) return '';
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}