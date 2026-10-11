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
import type { Metadata } from 'next';

interface PageProps {
  // Next.js 16: params is a Promise and must be awaited.
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
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

    return result[0] ?? null;
  } catch {
    return null;
  }
}

async function getSeriesChapters(seriesId: string) {
  try {
    return await db
      .select()
      .from(articles)
      .where(and(eq(articles.seriesId, seriesId), eq(articles.status, 'PUBLISHED')))
      .orderBy(articles.chapterNumber);
  } catch {
    return [];
  }
}

async function getAudioTrack(articleId: string) {
  try {
    const result = await db
      .select()
      .from(audioTracks)
      .where(eq(audioTracks.articleId, articleId))
      .limit(1);
    return result[0] ?? null;
  } catch {
    return null;
  }
}

/** Up to three more pieces from the same category. */
async function getRelated(articleId: string, categoryId: string | null) {
  if (!categoryId) return [];
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
      .where(
        and(
          eq(articles.categoryId, categoryId),
          eq(articles.status, 'PUBLISHED'),
          ne(articles.id, articleId)
        )
      )
      .orderBy(articles.publishedAt)
      .limit(3);

    return result;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'লেখা পাওয়া যায়নি' };

  return {
    title: article.titleBn,
    description: article.excerptBn ?? article.contentBn.slice(0, 160),
    openGraph: {
      title: article.titleBn,
      description: article.excerptBn ?? '',
      type: 'article',
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
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

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Sticky reading toolbar */}
      <div className="sticky top-4 z-30 mb-8">
        <div className="max-w-reader mx-auto">
          <div className="reader-toolbar rounded-2xl px-4 py-2.5 shadow-sm flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-sm font-ui text-ink/60 hover:text-crimson transition-colors flex items-center gap-1.5"
            >
              ← ফিরে যান
            </Link>

            <span className="text-xs font-ui text-ink/50 bg-ink/5 px-3 py-1 rounded-full">
              পড়ার সময়: {toBengaliNumerals(readingTime)} মিনিট
            </span>

            <FontScaler />
          </div>
        </div>
      </div>

      <article className="max-w-reader mx-auto">
        {/* Cover image */}
        {article.coverImageUrl && (
          <div className="relative mb-8 rounded-2xl overflow-hidden aspect-[16/9] bg-ink/10">
            <Image
              src={article.coverImageUrl}
              alt={article.titleBn}
              fill
              sizes="(min-width: 768px) 680px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.categoryNameBn && (
              <Link
                href={`/?category=${article.categorySlug}`}
                className="chip"
              >
                {article.categoryNameBn}
              </Link>
            )}
            {article.chapterNumber && (
              <span className="chip bg-crimson/15 !text-crimson !shadow-none">
                পর্ব {toBengaliNumerals(article.chapterNumber)}
              </span>
            )}
          </div>

          <h1 className="post-title post-title-lg !text-[2.15rem] leading-tight mb-4">
            {article.titleBn}
          </h1>

          {article.excerptBn && (
            <p className="font-prose text-ink/60 text-base leading-relaxed mb-5 italic border-l-2 border-crimson/40 pl-4">
              {article.excerptBn}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm font-ui border-b border-ink/10 pb-6">
            {article.authorDisplayName && (
              <span className="post-author !text-base">
                ✍ {article.authorDisplayName}
              </span>
            )}
            {publishedDate && (
              <span className="text-ink/50">· {publishedDate}</span>
            )}
            <span className="text-ink/50">
              · {toBengaliNumerals(readingTime)} মিনিট পড়ার সময়
            </span>
            {article.viewCount > 0 && (
              <span className="text-ink/50">
                · {toBengaliNumerals(article.viewCount)} জন পড়েছেন
              </span>
            )}
          </div>
        </header>

        {/* Body */}
        <ReaderFontWrapper>
          <div
            className="reader-content"
            dangerouslySetInnerHTML={{ __html: article.contentBn }}
          />
        </ReaderFontWrapper>

        {audioTrack && (
          <AudioPlayer
            audioUrl={audioTrack.audioUrl}
            narratorBn={audioTrack.narratorBn}
            durationSec={audioTrack.durationSec}
          />
        )}

        {/* End mark */}
        <div className="flex items-center justify-center gap-3 my-12 text-crimson/50">
          <span className="text-xl">✦</span>
          <span className="text-sm font-prose italic">সমাপ্ত</span>
          <span className="text-xl">✦</span>
        </div>

        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-ink/15 text-sm font-ui text-ink/60 hover:text-crimson hover:border-crimson/40 transition-colors"
          >
            ← আরো লেখা পড়ুন
          </Link>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto mt-4">
          <h2 className="section-heading">আরও পড়ুন</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/story/${rel.slug}`}
                className="feature-card group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ink/10">
                  {rel.coverImageUrl && (
                    <Image
                      src={rel.coverImageUrl}
                      alt={rel.titleBn}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {rel.categoryNameBn && <span className="chip">{rel.categoryNameBn}</span>}
                    {rel.authorDisplayName && <span className="chip">{rel.authorDisplayName}</span>}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-prose text-lg leading-snug text-ink group-hover:text-crimson transition-colors line-clamp-2">
                    {rel.titleBn}
                  </h3>
                  <span className="read-more text-sm mt-2">•••</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Serial chapter switcher */}
      {chapters.length > 1 && (
        <ChapterSwitcher chapters={chapters} currentSlug={article.slug} />
      )}
    </div>
  );
}
