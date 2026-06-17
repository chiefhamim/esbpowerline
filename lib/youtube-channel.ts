import { cache } from 'react';
import { DEFAULT_INTERVIEWS, type Interview } from '@/lib/interview-content';

export const ESB_YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@ESBPowerLine';
export const ESB_YOUTUBE_CHANNEL_ID = 'UCan3s1leb_khUlnntZcEkmA';
const ESB_YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${ESB_YOUTUBE_CHANNEL_ID}`;

const CHANNEL_GUEST = 'ESB Power Line';
const CHANNEL_ROLE = 'News & Analysis';

type RssEntry = {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
  description: string;
};

function decodeXmlText(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function firstXmlValue(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match?.[1] ? decodeXmlText(match[1]) : '';
}

function parseYoutubeRss(xml: string): RssEntry[] {
  const entries: RssEntry[] = [];
  const entryBlocks = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  for (const block of entryBlocks) {
    const videoId = firstXmlValue(block, 'yt:videoId');
    const title = firstXmlValue(block, 'title');
    const published = firstXmlValue(block, 'published');
    if (!videoId || !title) continue;

    const thumbnail =
      block.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ??
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const description = firstXmlValue(block, 'media:description') || title;

    entries.push({ videoId, title, published, thumbnail, description });
  }

  return entries;
}

function formatInterviewDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function excerptFromDescription(description: string, fallback: string): string {
  const line = description
    .split('\n')
    .map((part) => part.replace(/#[\w-]+/g, '').trim())
    .find(Boolean);

  const text = (line || fallback).replace(/\s+/g, ' ').trim();
  if (text.length <= 140) return text;
  return `${text.slice(0, 137).trimEnd()}…`;
}

function mapRssEntryToInterview(entry: RssEntry, index: number): Interview {
  return {
    id: `yt-${entry.videoId}`,
    title: entry.title,
    guest: CHANNEL_GUEST,
    role: CHANNEL_ROLE,
    duration: 'Video',
    date: formatInterviewDate(entry.published),
    thumbnail: entry.thumbnail,
    youtubeId: entry.videoId,
    excerpt: excerptFromDescription(entry.description, entry.title),
  };
}

export const getLatestYoutubeInterviews = cache(async (limit = 4): Promise<Interview[]> => {
  try {
    const response = await fetch(ESB_YOUTUBE_RSS_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return DEFAULT_INTERVIEWS.slice(0, limit);

    const xml = await response.text();
    const entries = parseYoutubeRss(xml).slice(0, limit);
    if (entries.length === 0) return DEFAULT_INTERVIEWS.slice(0, limit);

    return entries.map(mapRssEntryToInterview);
  } catch {
    return DEFAULT_INTERVIEWS.slice(0, limit);
  }
});