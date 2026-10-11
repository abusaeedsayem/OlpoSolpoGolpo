import { db } from '@/db';
import { articles, categories, users, books } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
/** All published articles, newest first. */
export async function fetchFeed(limit = 300) {
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
    }
    catch (_a) {
        return [];
    }
}
/** The six large image tiles under the masthead. */
export async function fetchTiles() {
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
    }
    catch (_a) {
        return [];
    }
}
/** নতুন বই showcase. */
export async function fetchBooks() {
    try {
        return await db.select().from(books).orderBy(books.sortOrder);
    }
    catch (_a) {
        return [];
    }
}
/** First `count` articles of a category. */
export function inCategory(feed, slug, count = 1) {
    return feed.filter((a) => a.categorySlug === slug).slice(0, count);
}
/** Case-insensitive title/excerpt search across the feed. */
export function searchFeed(feed, q) {
    const needle = q.trim().toLowerCase();
    if (!needle)
        return [];
    return feed.filter((a) => {
        var _a, _b, _c;
        const hay = `${a.titleBn} ${(_a = a.excerptBn) !== null && _a !== void 0 ? _a : ''} ${(_b = a.authorName) !== null && _b !== void 0 ? _b : ''} ${(_c = a.categoryName) !== null && _c !== void 0 ? _c : ''}`;
        return hay.toLowerCase().includes(needle);
    });
}
