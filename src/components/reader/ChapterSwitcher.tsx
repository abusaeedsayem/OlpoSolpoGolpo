import Link from 'next/link';
import { cn } from '@/lib/cn';
import { toBengaliNumerals } from '@/lib/bengali-utils';
import type { Article } from '@/db/schema';

interface ChapterSwitcherProps {
  chapters: Article[];
  currentSlug: string;
}

export function ChapterSwitcher({ chapters, currentSlug }: ChapterSwitcherProps) {
  if (chapters.length <= 1) return null;

  const currentIndex = chapters.findIndex((c) => c.slug === currentSlug);
  const prev = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div className="sticky bottom-0 bg-[var(--bg-canvas,#FAF8F5)] border-t border-ink/10 py-3 px-4 mt-12 backdrop-blur-sm">
      <div className="max-w-reader mx-auto flex items-center justify-between gap-4">
        {/* Prev chapter */}
        {prev ? (
          <Link
            href={`/story/${prev.slug}`}
            className={cn(
              'flex items-center gap-2 text-sm font-ui text-ink/60 hover:text-crimson transition-colors',
              'max-w-[45%]'
            )}
          >
            <span>←</span>
            <span className="line-clamp-1">{prev.titleBn}</span>
          </Link>
        ) : (
          <div />
        )}

        {/* Chapter indicator */}
        <div className="text-xs text-ink/40 font-ui text-center flex-shrink-0">
          {toBengaliNumerals(currentIndex + 1)} / {toBengaliNumerals(chapters.length)}
        </div>

        {/* Next chapter */}
        {next ? (
          <Link
            href={`/story/${next.slug}`}
            className={cn(
              'flex items-center gap-2 text-sm font-ui text-ink/60 hover:text-crimson transition-colors',
              'max-w-[45%] text-right'
            )}
          >
            <span className="line-clamp-1">{next.titleBn}</span>
            <span>→</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
