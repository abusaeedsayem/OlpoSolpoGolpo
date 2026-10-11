import Link from 'next/link';
import { fetchFeed, fetchTiles, fetchBooks, inCategory, searchFeed } from '@/lib/content';
import type { FeedArticle } from '@/lib/content';
import { CategoryTileStrip } from '@/components/home/CategoryTileStrip';
import { Section } from '@/components/home/Section';
import { PostCard, PostRow } from '@/components/home/PostCard';
import { BookGrid } from '@/components/home/BookGrid';
import { PromoCard } from '@/components/home/PromoCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'অল্প স্বল্প গল্প | বাংলা সাহিত্য পত্রিকা',
  description:
    'বাংলা ছোট গল্প, কবিতা, উপন্যাস, ধারাবাহিক ও মুক্ত গদrówের অনলাইন পত্রিকা।',
};

interface HomeProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

/** Renders a titled section; falls back to a quiet empty state. */
function Cards({
  items,
  size = 'md',
}: {
  items: FeedArticle[];
  size?: 'lg' | 'md';
}) {
  if (items.length === 0) {
    return (
      <p className="font-prose text-sm text-ink/50 border border-dashed border-ink/20 rounded-xl px-4 py-6 text-center">
        এই বিভাগে এখনো কিছু প্রকাশিত হয়নি
      </p>
    );
  }
  return (
    <div className="space-y-5">
      {items.map((a) => (
        <PostCard key={a.id} article={a} size={size} />
      ))}
    </div>
  );
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { category, q } = await searchParams;
  const [feed, tiles, books] = await Promise.all([
    fetchFeed(),
    fetchTiles(),
    fetchBooks(),
  ]);

  // ── Search results view ───────────────────────────────────────────────────
  if (q && q.trim()) {
    const results = searchFeed(feed, q);
    return (
      <div className="band-white min-h-[60vh] py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-heading">
            “{q}” এর জন্য পাওয়া গেছে{' '}
            <span className="text-crimson">
              ({results.length}টি)
            </span>
          </h1>
          {results.length === 0 ? (
            <p className="font-prose text-ink/60">
              দুঃখিত, এই মুহূর্তে কোনো লেখা খুঁজে ওঠেনি। অন্য শব্দে খুঁজে দেখুন।
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((a) => (
                <PostCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Category archive view ─────────────────────────────────────────────────
  if (category) {
    const items = inCategory(feed, category, 60);
    const title =
      items[0]?.categoryName ?? feed.find((f) => f.categorySlug === category)?.categoryName ?? 'বিভাগ';

    return (
      <div className="band-white min-h-[60vh] py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h1 className="section-heading !mb-0">{title}</h1>
            <Link
              href="/"
              className="text-sm font-ui text-ink/60 hover:text-crimson transition-colors"
            >
              ← সব লেখা
            </Link>
          </div>
          <p className="text-sm font-ui text-ink/50 mb-8">
            {items.length}টি প্রকাশিত লেখা
          </p>

          {items.length === 0 ? (
            <p className="font-prose text-ink/60">
              এই বিভাগে এখনো কিছু প্রকাশিত হয়নি।
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((a) => (
                <PostCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Full magazine homepage ────────────────────────────────────────────────
  const sectionStyle = 'min-w-0';

  return (
    <div>
      <CategoryTileStrip tiles={tiles} />

      {/* Band 1 — ফিচার স্টোরি · ধারাবাহিক · গল্প · নতুন বই */}
      <div className="band-gray py-10 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.55fr_1fr_1fr_1fr] gap-6 lg:gap-8 items-start">
            <div className={sectionStyle}>
              <Section title="ফিচার স্টোরি">
                <Cards items={inCategory(feed, 'feature', 1)} size="lg" />
              </Section>
              <PromoCard />
            </div>

            <div className={`${sectionStyle} space-y-10`}>
              <Section title="ধারাবাহিক উপন্যাস">
                <Cards items={inCategory(feed, 'dharabahik', 1)} />
              </Section>
            </div>

            <div className={`${sectionStyle} space-y-10`}>
              <Section title="গল্প">
                <Cards items={inCategory(feed, 'golpo', 1)} />
              </Section>
            </div>

            <Section title="নতুন বই" className={sectionStyle}>
              <BookGrid books={books} />
            </Section>
          </div>
        </div>
      </div>

      {/* Band 2 — এই মাসের কবITA */}
      <div className="band-white py-10 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Section title="এই মাসের কবITA">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
              {inCategory(feed, 'kobita', 6).map((a) => (
                <PostCard key={a.id} article={a} />
              ))}
            </div>
          </Section>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
            <Section title="নতুন সংযোজন" className={sectionStyle}>
              <div className="rounded-2xl bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-4 py-1">
                {feed.slice(0, 4).map((a) => (
                  <PostRow key={a.id} article={a} />
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* Band 3 — চরquita */}
      <div className="band-gray py-10 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
            <Section title="চরquita" className={sectionStyle}>
              <Cards items={inCategory(feed, 'chorobeti', 1)} />
            </Section>
          </div>
        </div>
      </div>

      {/* Band 4 — নতুন সংযোজন */}
      <div className="band-white py-10 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
            <Section title="নতুন সংযোজন" className={sectionStyle}>
              <div className="rounded-2xl bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-4 py-1">
                {feed.slice(0, 4).map((a) => (
                  <PostRow key={a.id} article={a} />
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}