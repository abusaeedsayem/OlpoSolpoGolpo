import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-stone-100 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900',
        hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('border-b border-stone-100 px-6 py-4 dark:border-stone-800', className)}>{children}</div>
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border-t border-stone-100 px-6 py-4 dark:border-stone-800', className)}>
      {children}
    </div>
  )
}
