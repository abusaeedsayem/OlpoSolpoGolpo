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
  tags?: string[]
  className?: string
}

function CoverPlaceholder({ title, index }: { title: string; index: number }) {
  const gradient = DEFAULT_COVER_COLORS[index % DEFAULT_COVER_COLORS.length]
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-end justify-start bg-gradient-to-br p-3',
        gradient
      )}
    >
      <p className="text-sm font-bold text-white/90 leading-tight font-bengali line-clamp-3">
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
  tags = [],
  className,
}: StoryCardProps) {
  const colorIndex = id.charCodeAt(0) % DEFAULT_COVER_COLORS.length

  return (
    <Link href={`/story/${slug}`} className={cn('group block', className)}>
      <article className="flex flex-col rounded-xl overflow-hidden border border-stone-100 bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg dark:border-stone-800 dark:bg-stone-900">
        {/* Cover */}
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
          {/* Category badge overlay */}
          <div className="absolute top-2 left-2">
            <Badge variant="info" className="backdrop-blur-sm bg-white/80 text-stone-700">
              {categoryName}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col gap-1.5">
          <h3 className="font-display text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors font-bengali">
            {title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-bengali">
            {authorName}
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500 line-clamp-2 font-bengali leading-relaxed">
            {truncate(description, 80)}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between pt-1 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <span>👁️</span> {formatReadCount(readCount)}
            </span>
            <span className="flex items-center gap-1">
              <span>📄</span> {chapterCount} অধ্যায়
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
