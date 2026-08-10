import Link from 'next/link'
import { SITE_NAME, CATEGORIES } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📖</span>
              <span className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                {SITE_NAME}
              </span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-bengali leading-relaxed">
              বিজ্ঞাপনমুক্ত বাংলা গল্পের একটি পরিষ্কার পাঠ মঞ্চ।
              লেখক ও পাঠকের মিলনস্থল।
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-stone-800 dark:text-stone-200 font-bengali">
              বিভাগসমূহ
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-stone-500 hover:text-amber-600 dark:text-stone-400 font-bengali transition-colors"
                  >
                    {cat.emoji} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-stone-800 dark:text-stone-200 font-bengali">
              সাইট
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'হোম', href: '/' },
                { label: 'গল্প খুঁজুন', href: '/explore' },
                { label: 'লেখক হন', href: '/register' },
                { label: 'প্রবেশ করুন', href: '/login' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-amber-600 dark:text-stone-400 font-bengali transition-colors"
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
            © {new Date().getFullYear()} {SITE_NAME} — বিজ্ঞাপনমুক্ত, সম্পূর্ণ পরিষ্কার
          </p>
        </div>
      </div>
    </footer>
  )
}
