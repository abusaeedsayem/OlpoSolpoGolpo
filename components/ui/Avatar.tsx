import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: { px: 32, cls: 'h-8 w-8 text-xs' },
  md: { px: 40, cls: 'h-10 w-10 text-sm' },
  lg: { px: 56, cls: 'h-14 w-14 text-base' },
  xl: { px: 80, cls: 'h-20 w-20 text-xl' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const { px, cls } = sizeMap[size]

  if (src) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-full ring-2 ring-amber-200 dark:ring-amber-800',
          cls,
          className
        )}
      >
        <Image src={src} alt={name} width={px} height={px} className="object-cover" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 font-semibold text-white ring-2 ring-amber-200 dark:ring-amber-800',
        cls,
        className
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
