'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { deleteStoredMedia } from '@/lib/media-storage';
import { statSync, existsSync } from 'fs';
import path from 'path';

async function requireAuth() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'media.upload')) throw new Error('Forbidden');
  return session.user;
}

async function backfillMissingMediaSizes(items: any[]) {
  await Promise.all(
    items.map(async (m) => {
      if (m.size !== null && m.size > 0) return;

      let size: number | null = null;
      if (m.url.startsWith('/')) {
        const localPath = path.join(process.cwd(), 'public', m.url);
        if (existsSync(localPath)) {
          try {
            size = statSync(localPath).size;
          } catch (e) {
            console.error('Error getting local file size:', e);
          }
        }
      } else if (m.url.startsWith('http://') || m.url.startsWith('https://')) {
        try {
          const res = await fetch(m.url, { method: 'HEAD' });
          const len = res.headers.get('content-length');
          if (len) {
            size = parseInt(len, 10);
          } else {
            const getRes = await fetch(m.url, { method: 'GET' });
            const getLen = getRes.headers.get('content-length');
            if (getLen) {
              size = parseInt(getLen, 10);
            } else {
              const blob = await getRes.blob();
              size = blob.size;
            }
          }
        } catch (err) {
          console.warn(`[backfillMissingMediaSizes] Failed to resolve remote size for ${m.url}:`, err);
        }
      }

      if (size !== null && size > 0) {
        m.size = size;
        await prisma.media.update({
          where: { id: m.id },
          data: { size },
        }).catch((err) => console.error('Failed to save size to db:', err));
      }
    })
  );
}

export async function getMedia() {
  await requireAuth();
  const items = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  await backfillMissingMediaSizes(items);
  return items;
}

export type MediaLibraryItem = {
  id: string;
  name: string;
  url: string;
  type: string;
  mimeType: string | null;
  size: number | null;
  altText: string | null;
  caption: string | null;
  uploadedById: string | null;
  uploadedByName: string | null;
  createdAt: Date;
  usageCount: number;
  usedInTitles: string[];
  usedInArticles: { id: string; title: string; slug: string; imageCredit?: string | null; seo?: any }[];
  canDelete: boolean;
};

export async function getMediaLibrary(): Promise<MediaLibraryItem[]> {
  const user = await requireAuth();

  const [items, articles, users] = await Promise.all([
    prisma.media.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.article.findMany({
      where: {
        imageUrl: { not: null },
        status: { not: 'TRASH' },
        editorTrash: false,
      },
      select: { id: true, slug: true, imageUrl: true, title: true, imageCredit: true, seo: true },
    }),
    prisma.user.findMany({
      select: { id: true, name: true },
    }),
  ]);

  await backfillMissingMediaSizes(items);

  const userMap = new Map<string, string>();
  for (const u of users) {
    if (u.name) userMap.set(u.id, u.name);
  }

  const usageMap = new Map<string, { count: number; titles: string[]; articles: { id: string; title: string; slug: string; imageCredit?: string | null; seo?: any }[] }>();
  for (const article of articles) {
    if (!article.imageUrl) continue;
    const entry = usageMap.get(article.imageUrl) ?? { count: 0, titles: [], articles: [] };
    entry.count += 1;
    entry.titles.push(article.title);
    entry.articles.push({
      id: article.id,
      title: article.title,
      slug: article.slug,
      imageCredit: article.imageCredit,
      seo: article.seo,
    });
    usageMap.set(article.imageUrl, entry);
  }

  const canDeleteAny = can(user.role, 'media.delete_any');
  const canDeleteOwn = can(user.role, 'media.delete_own');

  return items.map((m) => {
    const usage = usageMap.get(m.url);
    const usageCount = usage?.count ?? 0;
    const ownsFile = m.uploadedById === user.id;
    const canDelete = usageCount === 0 && (canDeleteAny || (canDeleteOwn && ownsFile));

    return {
      id: m.id,
      name: m.name,
      url: m.url,
      type: m.type,
      mimeType: m.mimeType,
      size: m.size,
      altText: m.altText,
      caption: m.caption,
      uploadedById: m.uploadedById,
      uploadedByName: m.uploadedById ? (userMap.get(m.uploadedById) ?? 'Unknown') : 'System',
      createdAt: m.createdAt,
      usageCount,
      usedInTitles: usage?.titles ?? [],
      usedInArticles: usage?.articles ?? [],
      canDelete,
    };
  });
}

export async function createMedia(data: {
  name: string;
  url: string;
  type: string;
  mimeType?: string;
  size?: number;
  altText?: string;
}) {
  const user = await requireAuth();
  const media = await prisma.media.create({
    data: { ...data, uploadedById: user.id },
  });
  revalidatePath('/cms/media');
  revalidatePath('/admin/media');
  return media;
}

export async function updateMedia(
  id: string,
  data: { name?: string; altText?: string; caption?: string },
) {
  const user = await requireAuth();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error('File not found');

  const canEditAny = can(user.role, 'media.delete_any');
  const canEditOwn = media.uploadedById === user.id && can(user.role, 'media.delete_own');
  if (!canEditAny && !canEditOwn) throw new Error('You can only edit files you uploaded');

  const updated = await prisma.media.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() || media.name } : {}),
      ...(data.altText !== undefined ? { altText: data.altText.trim() || null } : {}),
      ...(data.caption !== undefined ? { caption: data.caption.trim() || null } : {}),
    },
  });

  revalidatePath('/cms/media');
  revalidatePath('/admin/media');
  return updated;
}

export async function deleteMedia(id: string) {
  const user = await requireAuth();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error('File not found');

  const canDeleteAny = can(user.role, 'media.delete_any');
  const canDeleteOwn = media.uploadedById === user.id && can(user.role, 'media.delete_own');
  if (!canDeleteAny && !canDeleteOwn) throw new Error('You can only delete files you uploaded');

  const usageCount = await prisma.article.count({
    where: {
      imageUrl: media.url,
      status: { not: 'TRASH' },
      editorTrash: false,
    },
  });

  if (usageCount > 0) {
    throw new Error(`In use by ${usageCount} article${usageCount === 1 ? '' : 's'} — remove from stories first`);
  }

  await prisma.media.delete({ where: { id } });
  await deleteStoredMedia(media.url).catch(() => undefined);
  revalidatePath('/cms/media');
  revalidatePath('/admin/media');
}

export async function replaceMediaAndFeaturedImage(
  mediaId: string,
  data: {
    name?: string;
    altText?: string;
    caption?: string;
    newUrl?: string;      // if a new file was uploaded
    newSize?: number;     // size of the new file
    newMimeType?: string; // mimeType of the new file
    imageCredit?: string;
    zoom?: number;
    fitMode?: string;
    filter?: string;
    panX?: number;
    panY?: number;
  }
) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'article.edit_own')) {
    throw new Error('Forbidden');
  }

  // 1. Get the current media record
  const media = await prisma.media.findUnique({
    where: { id: mediaId }
  });
  if (!media) throw new Error('Media not found');

  const oldUrl = media.url;
  const newUrl = data.newUrl || oldUrl;

  // 2. Update the media record itself
  await prisma.media.update({
    where: { id: mediaId },
    data: {
      name: data.name ?? media.name,
      url: newUrl,
      size: data.newSize ?? media.size,
      mimeType: data.newMimeType ?? media.mimeType,
      altText: data.altText !== undefined ? data.altText : undefined,
      caption: data.caption !== undefined ? data.caption : undefined,
    }
  });

  // 3. Find all articles using this media URL (both old and new URLs to be safe)
  const articles = await prisma.article.findMany({
    where: {
      imageUrl: { in: [oldUrl, newUrl] }
    }
  });

  // 4. Update each article
  await prisma.$transaction(
    articles.map((article) => {
      let seoObj: any = {};
      if (article.seo) {
        if (typeof article.seo === 'string') {
          try { seoObj = JSON.parse(article.seo); } catch (e) {}
        } else {
          seoObj = article.seo;
        }
      }

      seoObj.heroImage = seoObj.heroImage || {};
      
      if (data.zoom !== undefined) seoObj.heroImage.zoom = data.zoom;
      if (data.panX !== undefined) seoObj.heroImage.panX = data.panX;
      if (data.panY !== undefined) seoObj.heroImage.panY = data.panY;
      if (data.fitMode !== undefined) seoObj.heroImage.fitMode = data.fitMode;
      if (data.filter !== undefined) seoObj.heroImage.filter = data.filter;
      if (data.altText !== undefined) seoObj.heroImage.alt = data.altText;
      if (data.caption !== undefined) seoObj.heroImage.caption = data.caption;

      return prisma.article.update({
        where: { id: article.id },
        data: {
          imageUrl: newUrl,
          imageCredit: data.imageCredit !== undefined ? data.imageCredit : article.imageCredit,
          seo: seoObj,
        }
      });
    })
  );

  // 5. Create an audit log entry for this administrative activity
  await prisma.auditLog.create({
    data: {
      type: 'media.replace',
      message: `Replaced media/featured image details for media: ${media.name}`,
      userId: session.user.id,
      undoPayload: JSON.stringify({
        action: 'media.replace',
        articles: articles.map((a) => {
          let seoObj: any = {};
          if (a.seo) {
            if (typeof a.seo === 'string') {
              try { seoObj = JSON.parse(a.seo); } catch (e) {}
            } else {
              seoObj = a.seo;
            }
          }
          return {
            id: a.id,
            imageUrl: a.imageUrl,
            imageCredit: a.imageCredit,
            seo: seoObj
          };
        }),
        media: {
          id: media.id,
          name: media.name,
          url: media.url,
          size: media.size,
          mimeType: media.mimeType
        }
      })
    }
  });

  revalidatePath('/cms/media');
  revalidatePath('/admin/media');
  revalidatePath('/admin/articles');
  revalidatePath('/cms/articles');
  revalidatePath('/');
}