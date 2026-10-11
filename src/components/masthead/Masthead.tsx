'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hind_Siliguri, Noto_Serif_Bengali } from 'next/font/google';
import { getBengaliDate } from '@/lib/bengali-utils';
import { auth } from '@/auth';
import { SearchTrigger } from './SearchTrigger';
import { ThemeToggle } from './ThemeToggle';

export const NAV_ITEMS = [
  { label: 'ফিচার স্টোরি', slug: 'feature' },
  { label: 'ধারাবাহিক', slug: 'dharabahik' },
  { label: 'উপন্যাস', slug: 'uponyas' },
  { label: 'গল্প', slug: 'golpo' },
  { label: 'কবিতা', slug: 'kobita' },
];

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    path: 'M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.2l.4-3H13v-1.2c0-.5.2-.8.5-.8z',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    path: 'M18 6.5c-.5.3-1.1.5-1.7.6.6-.4 1.1-1 1.3-1.7-.6.4-1.2.6-1.9.8a3 3 0 0 0-5.1 2.7A8.5 8.5 0 0 1 4.6 5.6a3 3 0 0 0 .9 4 3 3 0 0 1-1.3-.4 3 3 0 0 0 2.4 3 3 3 0 0 1-1.3 0 3 3 0 0 0 2.8 2.1 6 6 0 0 1-4.4 1.2 8.5 8.5 0 0 0 13.1-7.6c.6-.4 1.1-1 1.5-1.6z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    path: 'M20 8.5a2.4 2.4 0 0 0-1.7-1.7C16.8 6.3 12 6.3 12 6.3s-4.8 0-6.3.5A2.4 2.4 0 0 0 4 8.5 25 25 0 0 0 3.6 12c0 1.2.1 2.4.4 3.5a2.4 2.4 0 0 0 1.7 1.7c1.5.4 6.3.4 6.3.4s4.8 0 6.3-.5a2.4 2.4 0 0 0 1.7-1.7c.3-1.1.4-2.3.4-3.5s-.1-2.4-.4-3.5zM10.2 14.6V9.4L14.6 12l-4.4 2.6z',
  },
];

export const ADMIN_NAV_ITEMS = [
  { label: 'ড্যাশবোর্ড', href: '/admin', icon: 'grid' },
  { label: 'মেডিয়েটর', href: '/moderator', icon: 'search' },
];

export function Masthead() {
  const dateString = getBengaliDate();

  // Initialize user state
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      const session = await auth();
      setUser(session);
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80px] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <header className="relative z-40">
      {/* White masthead: date · logo · controls */}
      <div className="masthead-bar">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[86px] sm:h-[104px] flex items-center justify-between gap-4">
          {/* পঞ্জিকা */}
          <div className="hidden md:flex items-center gap-2 text-[15px] text-ink font-prose min-w-[240px]">
            <span className="text-crimson text-sm">▦</span>
            <span>{dateString}</span>
          </div>

          {/* Logo */}
          <Link href="/" className="group flex flex-col items-center justify-center">
            <Image
              src="/OlpoSolpoGolpo_Logo.png"
              alt="অল্প স্বল্প গল্প"
              width={1983}
              height={793}
              priority
              className="h-[46px] sm:h-[58px] w-auto object-contain"
            />
            <span className="mt-1 font-prose text-[13px] sm:text-[15px] text-ink/80 group-hover:text-crimson transition-colors">
              পরতে পরশে বাঙালিয়ানা
            </span>
          </Link>

          {/* Controls */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-[130px]">
            <SearchTrigger />
            <ThemeToggle />

            {/* Admin/Moderator conditional links */}
            {user && user.role && (
              <div className="hidden sm:flex items-center gap-1">
                {user.role === 'ADMIN' && (
                  <div>
                    {ADMIN_NAV_ITEMS.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="p-1.5 rounded-full text-crimson hover:bg-crimson/10 transition-colors"
                        title={item.label}
                      >
                        <svg
                          className="w-[16px] h-[16px]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d={
                              item.label === 'ড্যাশবোর্ড'
                                ? 'M9 19v-6h2v6h5v-8h2V5h3v8h5v6zm-5-12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM9 6a5 5 0 1 0-10 0 5 5 0 0 0 10 0z'
                                : item.label === 'মেডিয়েটর'
                                ? 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'
                                : ''
                            }
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                )}
                {user.role !== 'READER' && (
                  <a
                    href="/contribute"
                    className="p-1.5 rounded-full text-crimson hover:bg-crimson/10 transition-colors"
                  >
                    ✍ লিখুন
                  </a>
                )}
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="p-1.5 rounded-full text-crimson hover:bg-crimson/10 transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Red category nav */}
      <nav className="nav-bar" aria-label="বিভাগ নেভিগেশন">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6">
          <ul className="flex items-center gap-0.5 py-1.5 overflow-x-auto scrollbar-hide whitespace-nowrap">
            <li>
              <Link href="/" className="nav-link" data-active="true">
                সব লেখা
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.slug}>
                <Link href={`/?category=${item.slug}`} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto pl-2">
              <Link
                href="/contribute"
                className="nav-link bg-white !text-crimson font-semibold hover:!bg-white/90"
              >
                ✍ লিখুন
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}