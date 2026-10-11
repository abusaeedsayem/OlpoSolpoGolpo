import Link from 'next/link';
import Image from 'next/image';
import { toBengaliNumerals, publishedAtLabel } from '@/lib/bengali-utils';
import type { FeedArticle } from '@/lib/content';

interface PostCardProps {
  article: FeedArticle;
  /** `lg` = lead card of a section (larger heading), `md` = standard column card */
  size?: 'lg' | 'md';
}

/**
 * Magazine card used across homepage bands: cover image with red pill chips
 * (category · author · part number), a serif title, a red byline and the red
 * "•••" read-more mark, plus a published-date line.
 */
export function PostCard({ article, size = 'md' }: PostCardProps) {
  const chips = [
    article.categoryName,
    article.authorName,
    article.chapterNumber
      ? `পর্ব ${toBengaliNumerals(article.chapterNumber)}`
      : null,
  ].filter(Boolean) as string[];

  const published = publishedAtLabel(article.publishedAt);
  const byline =
    article.authorName
      ? `${article.authorName} · প্রকাশিত ${published ?? ''}`
      : published
        ? `প্রকাশিত ${published}`
        : null;

  return (
    <Link href={`/story/${article.slug}`} className="feature-card group">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.titleBn}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            preload={size === 'lg'}
          />
        ) : (
          <div className="absolute inset-0 bg-crimson/15" />
        )}

        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span key={chip} className="chip">
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className={`post-title ${size === 'lg' ? 'post-title-lg' : ''}`}>
          {article.titleBn}
        </h3>
        {article.authorName && (
          <p className="post-author mt-2.5">{article.authorName}</p>
        )}
        <span className="read-more mt-3">•••</span>
        {published && byline && (
          <span className="text-xs font-ui text-ink/50 mt-1 block">{byline}</span>
        )}
      </div>
    </Link>
  );
}

/** Compact list row — used by the কেতাবি কথা / নতুন সংযোজন columns. */
export function PostRow({ article }: { article: FeedArticle }) {
  return (
    <Link
      href={`/story/${article.slug}`}
      className="group flex gap-3 py-3 border-b border-ink/10 last:border-0"
    >
      <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-ink/10">
        {article.coverImageUrl && (
          <Image
            src={article.coverImageUrl}
            alt={article.titleBn}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>
      <div className="min-w-0">
        <h4 className="font-prose text-[17px] leading-snug text-ink group-hover:text-crimson transition-colors line-clamp-2">
          {article.titleBn}
        </h4>
        <p className="text-crimson font-prose text-sm mt-1 truncate">
          {article.authorName}
        </p>
      </div>
    </Link>
  );
}
