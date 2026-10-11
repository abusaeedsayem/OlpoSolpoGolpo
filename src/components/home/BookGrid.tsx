import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/db/schema';

interface BookGridProps {
  books: Book[];
}

/**
 * নতুন বই — 2-up book cover grid with prices and the red
 * "আমাদের সমস্ত বই" call to action.
 */
export function BookGrid({ books }: BookGridProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5">
        {books.map((book) => (
          <Link key={book.id} href="/?category=ketabi-kotha" className="group">
            <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-ink/10 shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:-translate-y-1">
              <Image
                src={book.coverUrl}
                alt={book.titleBn}
                fill
                sizes="(min-width: 1024px) 12vw, 40vw"
                className="object-cover"
              />
            </div>
            <p className="book-price">{book.priceLabel}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/?category=ketabi-kotha"
          className="inline-block bg-crimson text-white font-ui text-sm px-6 py-2.5 rounded-full hover:bg-crimson-dark transition-colors"
        >
          আমাদের সমস্ত বই
        </Link>
      </div>
    </div>
  );
}
