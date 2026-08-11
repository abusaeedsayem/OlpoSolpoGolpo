import Link from 'next/link'
import Image from 'next/image'
import { SITE_NAME, CATEGORIES } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand Logo & Info */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-3 group">
              <div className="relative h-12 w-16 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt={SITE_NAME}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-lg font-bold text-teal-800 dark:text-teal-400 font-bengali">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-bengali leading-relaxed">
              বিজ্ঞাপনমুক্ত বাংলা গল্পের একটি পরিষ্কার ও আধুনিক পাঠ মঞ্চ।
              লেখক ও পাঠক সম্প্রদায়ের সুদৃঢ় মিলনস্থল।
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-stone-800 dark:text-stone-200 font-bengali">
              গল্পের বিভাগসমূহ
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-stone-500 hover:text-teal-700 dark:text-stone-400 font-bengali transition-colors"
                  >
                    {cat.emoji} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-stone-800 dark:text-stone-200 font-bengali">
              সাইট লিঙ্ক
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'হোম পেজ', href: '/' },
                { label: 'গল্প খুঁজুন (Explore)', href: '/explore' },
                { label: 'লেখক হন (Publish)', href: '/dashboard/stories/new' },
                { label: 'প্রবেশ করুন (Login)', href: '/login' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-teal-700 dark:text-stone-400 font-bengali transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-100 pt-6 dark:border-stone-800">
          <p className="text-center text-xs text-stone-400 font-bengali">
            © {new Date().getFullYear()} {SITE_NAME} — বিজ্ঞাপনমুক্ত, সম্পূর্ণ পরিষ্কার পরিবেশ
          </p>
        </div>
      </div>
    </footer>
  )
}
