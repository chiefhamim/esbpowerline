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
    id: 'yt-9ngsY7vBm_Y',
    title: 'Nationalist Research Foundation NRFআয়োজিত প্রবাসীদের ভোট গ্রহণ প্রক্রিয়া আমাদের করণীয় বিষয়ে',
    guest: 'ESB Power Line',
    role: 'News & Analysis',
    duration: 'Video',
    date: 'Nov 25',
    thumbnail: 'https://i2.ytimg.com/vi/9ngsY7vBm_Y/hqdefault.jpg',
    youtubeId: '9ngsY7vBm_Y',
    excerpt: 'Nationalist Research Foundation NRFআয়োজিত প্রবাসীদের ভোট গ্রহণ প্রক্রিয়া আমাদের করণীয় বিষয়ে',
  },
  {
    id: 'yt-VWAOGfPdLcE',
    title: 'হাসিনাকে হাতপাখা দিয়ে বাতাস করা দলগুলো পিআর পদ্ধতিতে নির্বাচন চায়',
    guest: 'ESB Power Line',
    role: 'News & Analysis',
    duration: 'Video',
    date: 'Jul 6',
    thumbnail: 'https://i3.ytimg.com/vi/VWAOGfPdLcE/hqdefault.jpg',
    youtubeId: 'VWAOGfPdLcE',
    excerpt: 'হাসিনাকে হাতপাখা দিয়ে বাতাস করা দলগুলো পিআর পদ্ধতিতে নির্বাচন চায়',
  },
  {
    id: 'yt-4HwoHJshSt8',
    title: 'তারেক রহমানকে প্রবাসী নেতাকর্মীদের স্বাগত | LIVE | ডরচেস্টার হোটেল, লন্ডন | EsbNews',
    guest: 'ESB Power Line',
    role: 'News & Analysis',
    duration: 'Video',
    date: 'Jun 13',
    thumbnail: 'https://i1.ytimg.com/vi/4HwoHJshSt8/hqdefault.jpg',
    youtubeId: '4HwoHJshSt8',
    excerpt: 'ডরচেস্টার হোটেল, লন্ডন থেকে সরাসরি — প্রবাসী নেতাকর্মীদের স্বাগত ও রাজনৈতিক বৈঠকের দৃশ্যপট।',
  },
  {
    id: 'yt-d37OcTjLv9Q',
    title: 'ডিসেম্বরের মধ্যেই জাতীয় নির্বাচন আয়োজনের বিষয়ে সব রাজনৈতিক দল ঐকমত্য প্রকাশ সালাহউদ্দিন আহমেদ।',
    guest: 'ESB Power Line',
    role: 'News & Analysis',
    duration: 'Video',
    date: 'Jun 3',
    thumbnail: 'https://i1.ytimg.com/vi/d37OcTjLv9Q/hqdefault.jpg',
    youtubeId: 'd37OcTjLv9Q',
    excerpt: 'ডিসেম্বরের মধ্যেই জাতীয় নির্বাচন আয়োজনের বিষয়ে সব রাজনৈতিক দল ঐকমত্য প্রকাশ সালাহউদ্দিন আহমেদ।',
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