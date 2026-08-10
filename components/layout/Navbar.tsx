'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { SITE_NAME, NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session, status } = useSession()
  const user = session?.user as any

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-100 bg-white/80 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl select-none">📖</span>
          <span className="font-display text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium font-bengali transition-colors hover:text-amber-600',
                pathname === link.href
                  ? 'text-amber-600'
                  : 'text-stone-600 dark:text-stone-400'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {status === 'loading' ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {user.role === 'AUTHOR' && (
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm">
                    ড্যাশবোর্ড
                  </Button>
                </Link>
              )}
              <Link href={`/profile/${user.username || user.email}`}>
                <Avatar src={user.avatarUrl} name={user.name || 'User'} size="sm" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs"
              >
                প্রস্থান
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  প্রবেশ
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  যোগ দিন
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="মেনু খুলুন"
          >
            <span className="block h-0.5 w-5 bg-current mb-1 transition-transform" />
            <span className="block h-0.5 w-5 bg-current mb-1" />
            <span className="block h-0.5 w-5 bg-current" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-stone-100 bg-white px-4 py-4 dark:border-stone-800 dark:bg-stone-950 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-bengali text-sm text-stone-700 dark:text-stone-300 hover:text-amber-600"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="pt-2 flex flex-col gap-2">
                {user.role === 'AUTHOR' && (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">
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
                  className="w-full"
                >
                  প্রস্থান করুন
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    প্রবেশ
                  </Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    যোগ দিন
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
