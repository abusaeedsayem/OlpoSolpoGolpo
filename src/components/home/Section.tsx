import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/** A titled column inside a homepage band. */
export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={cn('min-w-0', className)}>
      <h2 className="section-heading">{title}</h2>
      {children}
    </section>
  );
}
