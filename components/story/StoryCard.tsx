import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { cn, formatReadCount, truncate } from '@/lib/utils'
import { DEFAULT_COVER_COLORS } from '@/lib/constants'

export interface StoryCardProps {
  id: string
  title: string
  slug: string
  description: string
  coverUrl?: string | null
  authorName: string
  authorUsername: string
  categoryName: string
  readCount: number
  chapterCount: number
  rating?: number
  readTimeMinutes?: number
  tags?: string[]
  className?: string
}

function CoverPlaceholder({ title, index }: { title: string; index: number }) {
  const gradient = DEFAULT_COVER_COLORS[index % DEFAULT_COVER_COLORS.length]
  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col justify-between bg-gradient-to-br p-3',
        gradient
      )}
    >
      <span className="text-[10px] font-bold text-white/80 bg-black/20 backdrop-blur px-2 py-0.5 rounded-full self-start font-bengali">
        অল্প স্বল্প গল্প
      </span>
      <p className="text-sm font-bold text-white drop-shadow-md leading-tight font-bengali line-clamp-3">
        {title}
      </p>
    </div>
  )
}

export function StoryCard({
  id,
  title,
  slug,
  description,
  coverUrl,
  authorName,
  authorUsername,
  categoryName,
  readCount,
  chapterCount,
  rating = 4.8,
  readTimeMinutes = 5,
  tags = [],
  className,
}: StoryCardProps) {
  const colorIndex = id.charCodeAt(0) % DEFAULT_COVER_COLORS.length

  return (
    <Link href={`/story/${slug}`} className={cn('group block', className)}>
      <article className="flex flex-col rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg dark:bg-stone-900">
        {/* Cover Thumbnail */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <CoverPlaceholder title={title} index={colorIndex} />
          )}

          {/* Category overlay */}
          <div className="absolute top-2 left-2">
            <Badge variant="info" className="backdrop-blur-md bg-white/90 text-stone-800 font-bengali text-[10px]">
              {categoryName}
            </Badge>
          </div>

          {/* Rating Badge Overlay */}
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-amber-400 font-bold">
            <span>★</span>
            <span>{rating}</span>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-3 flex flex-col gap-1.5 font-bengali">
          <h3 className="font-display text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            {authorName}
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500 line-clamp-2 leading-relaxed">
            {truncate(description, 80)}
          </p>

          {/* Stats Bar (Views counter, Chapters, Read-time flag) */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/60 text-[11px] text-stone-400">
            <span className="flex items-center gap-1 font-semibold text-stone-600 dark:text-stone-300">
              <span>👁️</span> {formatReadCount(readCount)}
            </span>
            <span className="flex items-center gap-1">
              <span>⏱️</span> {readTimeMinutes} মি.
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
