'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session, status } = useSession()
  const user = session?.user as any

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/95 shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
        {/* Brand & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              📖
            </span>
            <span className="font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors font-bengali">
              {SITE_NAME}
            </span>
          </Link>

          {/* Language selector (Pratilipi style) */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-bengali text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
            <span>বাংলা</span>
            <span className="text-[10px]">▾</span>
          </div>
        </div>

        {/* Central Search Bar (Pratilipi Style) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md items-center relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নিজের মনের মতো গল্প খুঁজুন..."
            className="w-full rounded-full border border-stone-200 bg-stone-100/80 px-4 py-2 pl-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:focus:bg-stone-950 font-bengali transition-all"
          />
          <span className="absolute left-3.5 text-stone-400 text-sm">🔍</span>
        </form>

        {/* Navigation Links with Emojis & Labels (Pratilipi Style) */}
        <div className="hidden lg:flex items-center gap-5">
          <Link
            href="/"
            className={cn(
              'flex flex-col items-center text-xs font-bengali font-medium transition-colors hover:text-amber-600',
              pathname === '/' ? 'text-amber-600' : 'text-stone-600 dark:text-stone-400'
            )}
          >
            <span className="text-base">🏠</span>
            <span>হোম</span>
          </Link>

          <Link
            href="/categories"
            className={cn(
              'flex flex-col items-center text-xs font-bengali font-medium transition-colors hover:text-amber-600',
              pathname === '/categories' ? 'text-amber-600' : 'text-stone-600 dark:text-stone-400'
            )}
          >
            <span className="text-base">🧭</span>
            <span>শ্রেণী</span>
          </Link>

          <Link
            href={user?.role === 'AUTHOR' ? '/dashboard/stories/new' : '/write'}
            className={cn(
              'flex flex-col items-center text-xs font-bengali font-medium transition-colors hover:text-amber-600',
              pathname.includes('/stories/new') || pathname === '/write' ? 'text-amber-600' : 'text-stone-600 dark:text-stone-400'
            )}
          >
            <span className="text-base">✏️</span>
            <span>লিখুন</span>
          </Link>

          <Link
            href="/explore"
            className={cn(
              'flex flex-col items-center text-xs font-bengali font-medium transition-colors hover:text-amber-600',
              pathname === '/explore' ? 'text-amber-600' : 'text-stone-600 dark:text-stone-400'
            )}
          >
            <span className="text-base">📖</span>
            <span>লাইব্রেরী</span>
          </Link>
        </div>

        {/* Right Action Icons & Auth Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Notification Icon */}
          <button
            type="button"
            className="relative rounded-full p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
            title="বিজ্ঞপ্তি"
          >
            <span className="text-lg">🔔</span>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-stone-950" />
          </button>

          <ThemeToggle />

          {status === 'loading' ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {user.role === 'AUTHOR' && (
                <Link href="/dashboard" className="hidden sm:block">
                  <Button variant="secondary" size="sm">
                    ড্যাশবোর্ড
                  </Button>
                </Link>
              )}
              <Link href={`/profile/${user.username || user.email}`} className="flex items-center gap-2">
                <Avatar src={user.avatarUrl} name={user.name || 'User'} size="sm" />
                <span className="hidden xl:inline text-xs font-semibold font-bengali text-stone-800 dark:text-stone-200">
                  {user.name}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden sm:inline-flex text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                প্রস্থান
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-bengali">
                  সাইন ইন
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button variant="primary" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bengali">
                  যোগ দিন
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            className="lg:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="মেনু"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 dark:border-stone-800 dark:bg-stone-950 lg:hidden space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নিজের মনের মতো গল্প খুঁজুন..."
              className="w-full rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 font-bengali"
            />
          </form>

          <div className="grid grid-cols-4 gap-2 py-2 border-b border-stone-100 dark:border-stone-800 text-center">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex flex-col items-center text-xs font-bengali py-1 text-stone-700 dark:text-stone-300"
            >
              <span className="text-xl">🏠</span>
              <span>হোম</span>
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileOpen(false)}
              className="flex flex-col items-center text-xs font-bengali py-1 text-stone-700 dark:text-stone-300"
            >
              <span className="text-xl">🧭</span>
              <span>শ্রেণী</span>
            </Link>
            <Link
              href="/dashboard/stories/new"
              onClick={() => setMobileOpen(false)}
              className="flex flex-col items-center text-xs font-bengali py-1 text-stone-700 dark:text-stone-300"
            >
              <span className="text-xl">✏️</span>
              <span>লিখুন</span>
            </Link>
            <Link
              href="/explore"
              onClick={() => setMobileOpen(false)}
              className="flex flex-col items-center text-xs font-bengali py-1 text-stone-700 dark:text-stone-300"
            >
              <span className="text-xl">📖</span>
              <span>লাইব্রেরী</span>
            </Link>
          </div>

          {user ? (
            <div className="flex flex-col gap-2 pt-2">
              <Link href={`/profile/${user.username || user.email}`} onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                  <Avatar src={user.avatarUrl} name={user.name} size="sm" />
                  <span>{user.name} (প্রোফাইল)</span>
                </Button>
              </Link>
              {user.role === 'AUTHOR' && (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    ড্যাশবোর্ড
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMobileOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="w-full text-red-600 dark:text-red-400"
              >
                প্রস্থান করুন
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full font-bengali">
                  সাইন ইন
                </Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="sm" className="w-full bg-amber-600 text-white font-bengali">
                  যোগ দিন
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
