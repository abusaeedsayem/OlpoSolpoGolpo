import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { db } from '@/db';
import { articles, categories, users, audioTracks } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FontScaler, ReaderFontWrapper } from '@/components/reader/FontScaler';
import { ChapterSwitcher } from '@/components/reader/ChapterSwitcher';
import { AudioPlayer } from '@/components/reader/AudioPlayer';
import { estimateReadingTime, toBengaliNumerals, publishedAtLabel } from '@/lib/bengali-utils';
async function getArticle(slug) {
    var _a;
    try {
        const result = await db
            .select({
            id: articles.id,
            slug: articles.slug,
            titleBn: articles.titleBn,
            contentBn: articles.contentBn,
            excerptBn: articles.excerptBn,
            coverImageUrl: articles.coverImageUrl,
            categoryId: articles.categoryId,
            authorId: articles.authorId,
            status: articles.status,
            isPaywalled: articles.isPaywalled,
            requiredTier: articles.requiredTier,
            seriesId: articles.seriesId,
            chapterNumber: articles.chapterNumber,
            viewCount: articles.viewCount,
            publishedAt: articles.publishedAt,
            scheduledFor: articles.scheduledFor,
            createdAt: articles.createdAt,
            updatedAt: articles.updatedAt,
            categoryNameBn: categories.nameBn,
            categorySlug: categories.slug,
            authorDisplayName: users.displayNameBn,
        })
            .from(articles)
            .leftJoin(categories, eq(articles.categoryId, categories.id))
            .leftJoin(users, eq(articles.authorId, users.id))
            .where(and(eq(articles.slug, slug), eq(articles.status, 'PUBLISHED')))
            .limit(1);
        return (_a = result[0]) !== null && _a !== void 0 ? _a : null;
    }
    catch (_b) {
        return null;
    }
}
async function getSeriesChapters(seriesId) {
    try {
        return await db
            .select()
            .from(articles)
            .where(and(eq(articles.seriesId, seriesId), eq(articles.status, 'PUBLISHED')))
            .orderBy(articles.chapterNumber);
    }
    catch (_a) {
        return [];
    }
}
async function getAudioTrack(articleId) {
    var _a;
    try {
        const result = await db
            .select()
            .from(audioTracks)
            .where(eq(audioTracks.articleId, articleId))
            .limit(1);
        return (_a = result[0]) !== null && _a !== void 0 ? _a : null;
    }
    catch (_b) {
        return null;
    }
}
/** Up to three more pieces from the same category. */
async function getRelated(articleId, categoryId) {
    if (!categoryId)
        return [];
    try {
        const result = await db
            .select({
            id: articles.id,
            slug: articles.slug,
            titleBn: articles.titleBn,
            excerptBn: articles.excerptBn,
            coverImageUrl: articles.coverImageUrl,
            contentBn: articles.contentBn,
            viewCount: articles.viewCount,
            publishedAt: articles.publishedAt,
            seriesId: articles.seriesId,
            chapterNumber: articles.chapterNumber,
            categoryNameBn: categories.nameBn,
            categorySlug: categories.slug,
            authorDisplayName: users.displayNameBn,
        })
            .from(articles)
            .leftJoin(categories, eq(articles.categoryId, categories.id))
            .leftJoin(users, eq(articles.authorId, users.id))
            .where(and(eq(articles.categoryId, categoryId), eq(articles.status, 'PUBLISHED'), ne(articles.id, articleId)))
            .orderBy(articles.publishedAt)
            .limit(3);
        return result;
    }
    catch (_a) {
        return [];
    }
}
export async function generateMetadata({ params }) {
    var _a, _b;
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article)
        return { title: 'লেখা পাওয়া যায়নি' };
    return {
        title: article.titleBn,
        description: (_a = article.excerptBn) !== null && _a !== void 0 ? _a : article.contentBn.slice(0, 160),
        openGraph: {
            title: article.titleBn,
            description: (_b = article.excerptBn) !== null && _b !== void 0 ? _b : '',
            type: 'article',
        },
    };
}
export default async function StoryPage({ params }) {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) {
        notFound();
    }
    const readingTime = estimateReadingTime(article.contentBn);
    const chapters = article.seriesId
        ? await getSeriesChapters(article.seriesId)
        : [];
    const [audioTrack, related] = await Promise.all([
        getAudioTrack(article.id),
        getRelated(article.id, article.categoryId),
    ]);
    const publishedDate = publishedAtLabel(article.publishedAt);
    return (_jsxs("div", { className: "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "sticky top-4 z-30 mb-8", children: _jsx("div", { className: "max-w-reader mx-auto", children: _jsxs("div", { className: "reader-toolbar rounded-2xl px-4 py-2.5 shadow-sm flex items-center justify-between gap-4", children: [_jsx(Link, { href: "/", className: "text-sm font-ui text-ink/60 hover:text-crimson transition-colors flex items-center gap-1.5", children: "\u2190 \u09AB\u09BF\u09B0\u09C7 \u09AF\u09BE\u09A8" }), _jsxs("span", { className: "text-xs font-ui text-ink/50 bg-ink/5 px-3 py-1 rounded-full", children: ["\u09AA\u09A1\u09BC\u09BE\u09B0 \u09B8\u09AE\u09AF\u09BC: ", toBengaliNumerals(readingTime), " \u09AE\u09BF\u09A8\u09BF\u099F"] }), _jsx(FontScaler, {})] }) }) }), _jsxs("article", { className: "max-w-reader mx-auto", children: [article.coverImageUrl && (_jsx("div", { className: "relative mb-8 rounded-2xl overflow-hidden aspect-[16/9] bg-ink/10", children: _jsx(Image, { src: article.coverImageUrl, alt: article.titleBn, fill: true, sizes: "(min-width: 768px) 680px, 100vw", className: "object-cover", priority: true }) })), _jsxs("header", { className: "mb-8", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-4", children: [article.categoryNameBn && (_jsx(Link, { href: `/?category=${article.categorySlug}`, className: "chip", children: article.categoryNameBn })), article.chapterNumber && (_jsxs("span", { className: "chip bg-crimson/15 !text-crimson !shadow-none", children: ["\u09AA\u09B0\u09CD\u09AC ", toBengaliNumerals(article.chapterNumber)] }))] }), _jsx("h1", { className: "post-title post-title-lg !text-[2.15rem] leading-tight mb-4", children: article.titleBn }), article.excerptBn && (_jsx("p", { className: "font-prose text-ink/60 text-base leading-relaxed mb-5 italic border-l-2 border-crimson/40 pl-4", children: article.excerptBn })), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm font-ui border-b border-ink/10 pb-6", children: [article.authorDisplayName && (_jsxs("span", { className: "post-author !text-base", children: ["\u270D ", article.authorDisplayName] })), publishedDate && (_jsxs("span", { className: "text-ink/50", children: ["\u00B7 ", publishedDate] })), _jsxs("span", { className: "text-ink/50", children: ["\u00B7 ", toBengaliNumerals(readingTime), " \u09AE\u09BF\u09A8\u09BF\u099F \u09AA\u09A1\u09BC\u09BE\u09B0 \u09B8\u09AE\u09AF\u09BC"] }), article.viewCount > 0 && (_jsxs("span", { className: "text-ink/50", children: ["\u00B7 ", toBengaliNumerals(article.viewCount), " \u099C\u09A8 \u09AA\u09A1\u09BC\u09C7\u099B\u09C7\u09A8"] }))] })] }), _jsx(ReaderFontWrapper, { children: _jsx("div", { className: "reader-content", dangerouslySetInnerHTML: { __html: article.contentBn } }) }), audioTrack && (_jsx(AudioPlayer, { audioUrl: audioTrack.audioUrl, narratorBn: audioTrack.narratorBn, durationSec: audioTrack.durationSec })), _jsxs("div", { className: "flex items-center justify-center gap-3 my-12 text-crimson/50", children: [_jsx("span", { className: "text-xl", children: "\u2726" }), _jsx("span", { className: "text-sm font-prose italic", children: "\u09B8\u09AE\u09BE\u09AA\u09CD\u09A4" }), _jsx("span", { className: "text-xl", children: "\u2726" })] }), _jsx("div", { className: "text-center mb-12", children: _jsx(Link, { href: "/", className: "inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-ink/15 text-sm font-ui text-ink/60 hover:text-crimson hover:border-crimson/40 transition-colors", children: "\u2190 \u0986\u09B0\u09CB \u09B2\u09C7\u0996\u09BE \u09AA\u09A1\u09BC\u09C1\u09A8" }) })] }), related.length > 0 && (_jsxs("section", { className: "max-w-5xl mx-auto mt-4", children: [_jsx("h2", { className: "section-heading", children: "\u0986\u09B0\u0993 \u09AA\u09A1\u09BC\u09C1\u09A8" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-5", children: related.map((rel) => (_jsxs(Link, { href: `/story/${rel.slug}`, className: "feature-card group", children: [_jsxs("div", { className: "relative aspect-[16/10] overflow-hidden bg-ink/10", children: [rel.coverImageUrl && (_jsx(Image, { src: rel.coverImageUrl, alt: rel.titleBn, fill: true, sizes: "(min-width: 640px) 33vw, 100vw", className: "object-cover transition-transform duration-500 group-hover:scale-105" })), _jsxs("div", { className: "absolute top-3 left-3 flex flex-wrap gap-1.5", children: [rel.categoryNameBn && _jsx("span", { className: "chip", children: rel.categoryNameBn }), rel.authorDisplayName && _jsx("span", { className: "chip", children: rel.authorDisplayName })] })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-prose text-lg leading-snug text-ink group-hover:text-crimson transition-colors line-clamp-2", children: rel.titleBn }), _jsx("span", { className: "read-more text-sm mt-2", children: "\u2022\u2022\u2022" })] })] }, rel.id))) })] })), chapters.length > 1 && (_jsx(ChapterSwitcher, { chapters: chapters, currentSlug: article.slug }))] }));
}
