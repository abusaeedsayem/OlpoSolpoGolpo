import { db } from '@/db';
import { articles, categories, users, books } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { Book } from '@/db/schema';

/**
 * Homepage content layer.
 *
 * Everything is fetched in one pass and grouped in memory so the homepage can
 * render many category sections without N+1 queries. Every function degrades to
 * an empty result instead of throwing, so the site still renders if the
 * database is unreachable.
 */

export interface FeedArticle {
  id: string;
  slug: string;
  titleBn: string;
  contentBn: string;
  excerptBn: string | null;
  coverImageUrl: string | null;
  viewCount: number;
  publishedAt: Date | null;
  seriesId: string | null;
  chapterNumber: number | null;
  categorySlug: string | null;
  categoryName: string | null;
  authorName: string | null;
}

export interface TileCategory {
  slug: string;
  nameBn: string;
  imageUrl: string | null;
}

/** All published articles, newest first. */
export async function fetchFeed(limit = 300): Promise<FeedArticle[]> {
  try {
    const rows = await db
      .select({
        id: articles.id,
        slug: articles.slug,
        titleBn: articles.titleBn,
        contentBn: articles.contentBn,
        excerptBn: articles.excerptBn,
        coverImageUrl: articles.coverImageUrl,
        viewCount: articles.viewCount,
        publishedAt: articles.publishedAt,
        seriesId: articles.seriesId,
        chapterNumber: articles.chapterNumber,
        categorySlug: categories.slug,
        categoryName: categories.nameBn,
        authorName: users.displayNameBn,
      })
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.status, 'PUBLISHED'))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);

    return rows;
  } catch {
    return [];
  }
}

/** The six large image tiles under the masthead. */
export async function fetchTiles(): Promise<TileCategory[]> {
  try {
    const rows = await db
      .select({
        slug: categories.slug,
        nameBn: categories.nameBn,
        imageUrl: categories.imageUrl,
      })
      .from(categories)
      .where(eq(categories.isTile, true))
      .orderBy(categories.sortOrder);
    return rows;
  } catch {
    return [];
  }
}

/** নতুন বই showcase. */
export async function fetchBooks(): Promise<Book[]> {
  try {
    return await db.select().from(books).orderBy(books.sortOrder);
  } catch {
    return [];
  }
}

/** First `count` articles of a category. */
export function inCategory(
  feed: FeedArticle[],
  slug: string,
  count = 1
): FeedArticle[] {
  return feed.filter((a) => a.categorySlug === slug).slice(0, count);
}

/** Case-insensitive title/excerpt search across the feed. */
export function searchFeed(feed: FeedArticle[], q: string): FeedArticle[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return feed.filter((a) => {
    const hay = `${a.titleBn} ${a.excerptBn ?? ''} ${a.authorName ?? ''} ${a.categoryName ?? ''}`;
    return hay.toLowerCase().includes(needle);
  });
}
