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
    <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800 p-6">
      {registered && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300 font-bengali text-center">
          নিবন্ধন সফল হয়েছে! এখন প্রবেশ করুন।
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email"
          label="ইমেইল"
          placeholder="আপনার ইমেইল"
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

        {error && (
          <p className="text-sm text-red-500 text-center font-bengali">{error}</p>
        )}

        <Button type="submit" isLoading={isLoading} size="lg" className="mt-2">
          প্রবেশ করুন
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-stone-500 dark:text-stone-400 font-bengali">
        অ্যাকাউন্ট নেই?{' '}
        <Link href="/register" className="text-amber-600 hover:text-amber-700 font-medium">
          নিবন্ধন করুন
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">📖</span>
            <span className="font-display text-xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
              {SITE_NAME}
            </span>
          </Link>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 font-bengali">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        <Suspense fallback={<div className="h-64 rounded-2xl bg-white dark:bg-stone-900 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
