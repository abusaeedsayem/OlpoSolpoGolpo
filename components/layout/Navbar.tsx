'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
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
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()
  const user = session?.user as any

  // Autocomplete Live Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/stories?limit=5`)
        if (res.ok) {
          const data = await res.json()
          const filtered = (data.stories || []).filter((s: any) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          setSearchResults(filtered)
          setShowDropdown(true)
        }
      } catch {
        // Fallback
      } finally {
        setIsSearching(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowDropdown(false)
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const profileHref = user ? `/profile/${user.username || user.email}` : '/login'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/95 shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-10 w-12 sm:w-14 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display text-lg sm:text-xl font-bold text-teal-800 dark:text-teal-400 group-hover:text-amber-600 transition-colors font-bengali tracking-tight">
              {SITE_NAME}
            </span>
          </Link>
        </div>

        {/* Centered Autocomplete Search Bar */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-md items-center relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              placeholder="নিজের মনের মতো গল্প খুঁজুন..."
              className="w-full rounded-full border border-stone-200 bg-stone-100/80 px-4 py-2 pl-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:focus:bg-stone-950 font-bengali transition-all"
            />
            <span className="absolute left-3.5 top-2.5 text-stone-400 text-sm">🔍</span>
          </form>

          {/* Autocomplete Dropdown Panel */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden z-50 font-bengali">
              {isSearching ? (
                <div className="p-4 text-xs text-stone-400 text-center animate-pulse">খুঁজছে...</div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {searchResults.map((story) => (
                    <Link
                      key={story.id}
                      href={`/story/${story.slug}`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 p-3 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                    >
                      <span className="text-xl">📖</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                          {story.title}
                        </p>
                        <p className="text-xs text-stone-400 truncate">
                          {story.author?.name} · {story.category?.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-xs text-stone-400 text-center">কোনো গল্প পাওয়া যায়নি</div>
              )}
            </div>
          )}
        </div>

        {/* 5 Structural Icon Tabs */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              'flex flex-col items-center text-xs font-bengali font-medium transition-colors hover:text-teal-700 dark:hover:text-teal-400',
              pathname === '/' ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-stone-600 dark:text-stone-400'
            )}
          >
            <span className="text-lg">🏠</span>
            <span>হোম</span>
          </Link>

          <Link
            href="/categories"
            className={cn(
              'flex flex-col items-center text-xs font-bengali font-medium transition-colors hover:text-teal-700 dark:hover:text-teal-400',
              pathname === '/categories' || pathname === '/genres' ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-stone-600 dark:text-stone-400'
            )}
          >
            <span className="text-lg">🧭</span>
            <span>বিভাগ</span>
          </Link>

          <Link
            href="/dashboard/stories/new"
            className={cn(
              'flex flex-col items-center text-xs font-bengali font-medium transition-colors hover:text-teal-700 dark:hover:text-teal-400',
              pathname.includes('/stories/new') || pathname === '/write' ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-stone-600 dark:text-stone-400'
            )}
          >
            <span className="text-lg">✏️</span>
            <span>লিখুন</span>
          </Link>

          <Link
            href={profileHref}
            className={cn(
              'flex flex-col items-center text-xs font-bengali font-medium transition-colors hover:text-teal-700 dark:hover:text-teal-400',
              pathname.startsWith('/profile') ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-stone-600 dark:text-stone-400'
            )}
          >
            <span className="text-lg">👤</span>
            <span>প্রোফাইল</span>
          </Link>

          {user ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex flex-col items-center text-xs font-bengali font-medium text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
            >
              <span className="text-lg">🚪</span>
              <span>প্রস্থান</span>
            </button>
          ) : (
            <Link
              href="/login"
              className={cn(
                'flex flex-col items-center text-xs font-bengali font-medium transition-colors hover:text-teal-700 dark:hover:text-teal-400',
                pathname === '/login' ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-stone-600 dark:text-stone-400'
              )}
            >
              <span className="text-lg">🔑</span>
              <span>লগইন</span>
            </Link>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />

          <button
            className="lg:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="মেনু"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
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

          <div className="grid grid-cols-5 gap-1 py-2 border-b border-stone-100 dark:border-stone-800 text-center">
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
              <span>বিভাগ</span>
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
              href={profileHref}
              onClick={() => setMobileOpen(false)}
              className="flex flex-col items-center text-xs font-bengali py-1 text-stone-700 dark:text-stone-300"
            >
              <span className="text-xl">👤</span>
              <span>প্রোফাইল</span>
            </Link>

            {user ? (
              <button
                onClick={() => {
                  setMobileOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="flex flex-col items-center text-xs font-bengali py-1 text-red-600 dark:text-red-400"
              >
                <span className="text-xl">🚪</span>
                <span>প্রস্থান</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center text-xs font-bengali py-1 text-stone-700 dark:text-stone-300"
              >
                <span className="text-xl">🔑</span>
                <span>লগইন</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
