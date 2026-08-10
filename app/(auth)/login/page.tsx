'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
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
        email: form.email,
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
      setError('একটি সমস্যা দেখা দিয়েছে। আবার চেষ্টা করুন।')
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      {/* Left Panel: Pratilipi Style Sign-in Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          {/* Circular Brand Badge (Pratilipi Style) */}
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-600 text-white text-4xl shadow-lg ring-4 ring-amber-100 dark:ring-amber-900/30">
              📖
            </div>
          </div>

          <p className="text-center text-sm font-bengali text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
            আপনার প্রিয় লেখককে অনুসরণ, রচনার পর্যালোচনা এবং নিজের লাইব্রেরী তৈরি করতে সাইন ইন করুন
          </p>

          {/* Social Sign-in Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => alert('ফেসবুক সাইন ইন শীঘ্রই আসছে')}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#3b5998] py-3 text-sm font-medium text-white hover:bg-[#324b80] transition-colors shadow-sm font-bengali"
            >
              <span>f</span> ফেসবুক দিয়ে প্রবেশ করুন
            </button>
            <button
              type="button"
              onClick={() => alert('গুগল সাইন ইন শীঘ্রই আসছে')}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#ea4335] py-3 text-sm font-medium text-white hover:bg-[#d3382b] transition-colors shadow-sm font-bengali"
            >
              <span>G</span> গুগল দিয়ে প্রবেশ করুন
            </button>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800" />
            </div>
            <span className="relative bg-white dark:bg-stone-900 px-3 text-xs text-stone-400 font-bengali">
              অথবা ইমেইল দিয়ে প্রবেশ
            </span>
          </div>

          {registered && (
            <div className="mb-4 rounded-xl bg-green-50 p-3 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300 font-bengali text-center">
              ✓ নিবন্ধন সফল হয়েছে! এখন ইমেইল দিয়ে প্রবেশ করুন।
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              type="email"
              label="ই-মেইল"
              placeholder="আপনার ইমেইল ঠিকানা"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              id="password"
              type="password"
              label="পাসওয়ার্ড"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <div className="text-right">
              <a href="#" className="text-xs text-stone-400 hover:text-amber-600 font-bengali">
                যদি আপনি পাসওয়ার্ড ভুলে গিয়ে থাকেন?
              </a>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center font-bengali">{error}</p>
            )}

            <Button type="submit" isLoading={isLoading} size="lg" className="mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bengali">
              সাইন ইন করুন →
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400 font-bengali">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/register" className="text-amber-600 hover:text-amber-700 font-bold">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </Link>
        </p>
      </div>

      {/* Right Panel: Pratilipi Style Benefits Card (input_file_0.png) */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="border-b border-amber-400/40 pb-4 mb-6">
            <h2 className="text-xl font-bold font-bengali flex items-center gap-2">
              <span>✨</span> সাইন ইন এর উপকারিতা
            </h2>
          </div>

          <ul className="space-y-6 font-bengali">
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-bold flex-shrink-0">
                ✓
              </span>
              <div>
                <h4 className="font-bold text-base">যেকোনো জায়গায় পড়ুন</h4>
                <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                  কাহিনী যুক্ত করে যেকোনো জায়গায়, যেকোনো সময়ে নিজের মতো করে পড়ুন।
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-bold flex-shrink-0">
                ✓
              </span>
              <div>
                <h4 className="font-bold text-base">নিজের গল্প লিখুন</h4>
                <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                  সহজেই লিখুন এবং পাঠকদের ভালোবেসে উপহার ও পর্যালোচনা জিতে নিন।
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-bold flex-shrink-0">
                ✓
              </span>
              <div>
                <h4 className="font-bold text-base">বন্ধুদের সাথে যুক্ত থাকুন</h4>
                <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                  প্রিয় লেখকদের অনুসরণ করুন এবং বন্ধুদের সাথে প্রিয় কাহিনী শেয়ার করুন।
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="pt-8 border-t border-amber-400/40 text-center text-xs text-amber-100 font-bengali">
          {SITE_NAME} — আপনার মনের মতো গল্পের প্ল্যাটফর্ম
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4 py-12">
      <div className="w-full max-w-4xl">
        <Suspense fallback={<div className="h-96 rounded-2xl bg-white dark:bg-stone-900 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
