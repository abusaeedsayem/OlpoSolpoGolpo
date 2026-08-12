'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SITE_NAME } from '@/lib/constants'

function LoginForm() {
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await signIn('credentials', {
        email: form.email.trim(),
        password: form.password,
        callbackUrl,
        redirect: false,
      })

      if (res?.error) {
        setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।')
        setIsLoading(false)
      } else {
        window.location.href = res?.url || callbackUrl
      }
    } catch {
      setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।')
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch font-bengali">
      {/* Left Panel: Brand Sign-in Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          {/* Brand Logo Display */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative h-20 w-44 mb-2">
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <p className="text-center text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
            আপনার প্রিয় লেখককে অনুসরণ, রচনার পর্যালোচনা এবং নিজের লাইব্রেরী তৈরি করতে সাইন ইন করুন
          </p>

          {/* Social Sign-in Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => alert('ফেসবুক সাইন ইন শীঘ্রই আসছে')}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#3b5998] py-3 text-sm font-medium text-white hover:bg-[#324b80] transition-colors shadow-sm"
            >
              <span className="font-bold text-base">f</span> ফেসবুক দিয়ে প্রবেশ করুন
            </button>
            <button
              type="button"
              onClick={() => alert('গুগল সাইন ইন শীঘ্রই আসছে')}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 py-3 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors shadow-sm"
            >
              <span>🌐</span> গুগল দিয়ে প্রবেশ করুন
            </button>
          </div>

          <div className="relative text-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800" />
            </div>
            <span className="relative bg-white dark:bg-stone-900 px-3 text-xs text-stone-400">
              অথবা ইমেইল দিয়ে প্রবেশ করুন
            </span>
          </div>

          {registered && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3.5 text-xs text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
              ✓ অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে! আপনার পাসওয়ার্ড দিয়ে লগইন করুন।
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="ইমেইল অ্যাড্রেস"
              placeholder="আপনার ইমেইল দিন"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              id="password"
              type="password"
              label="পাসওয়ার্ড"
              placeholder="আপনার পাসওয়ার্ড দিন"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold"
            >
              সাইন ইন (Sign In)
            </Button>
          </form>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
          <p className="text-xs text-stone-500">
            নতুন সদস্য?{' '}
            <Link
              href="/register"
              className="font-bold text-teal-700 hover:underline dark:text-teal-400"
            >
              বিনামূল্যে নতুন অ্যাকাউন্ট খুলুন →
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel: Feature Highlights */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-teal-900 via-teal-950 to-stone-900 rounded-2xl p-8 text-white shadow-xl">
        <div className="space-y-6">
          <div className="inline-block bg-teal-500/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-teal-300 border border-teal-400/30">
            বিজ্ঞাপনমুক্ত ডিজিটাল পাঠ মঞ্চ
          </div>
          <h2 className="text-3xl font-bold leading-tight drop-shadow-md">
            বাংলা ছোটগল্পের সবচেয়ে পরিচ্ছন্ন পাঠ পরিবেশ
          </h2>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            কোনো বিজ্ঞাপন ছাড়া আপনার প্রিয় গল্পগুলো পড়ুন নির্ভাবনায়। নতুন লেখক ও তরুণ প্রতিভাদের গল্প নিয়মিত পড়ুন এবং যুক্ত থাকুন আপনার প্রিয় লেখকের সাথে।
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold">
                ✓
              </span>
              <span className="text-sm">১০০% ফ্রি ও বিজ্ঞাপনমুক্ত পড়ার সুযোগ</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold">
                ✓
              </span>
              <span className="text-sm">সহজ ডিজিটাল প্রকাশনা প্ল্যাটফর্ম</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold">
                ✓
              </span>
              <span className="text-sm">মোবাইল, ট্যাবলেট ও ডেসটপ ফ্রেন্ডলি ডিজাইন</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-teal-800/50 text-xs text-teal-300">
          {SITE_NAME} — আপনার মনের মতো গল্পের প্ল্যাটফর্ম
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<div className="text-center p-8 font-bengali">লোড হচ্ছে...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
