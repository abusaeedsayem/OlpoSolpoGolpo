'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SITE_NAME } from '@/lib/constants'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'READER' as 'READER' | 'AUTHOR',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'নাম দিন'
    if (!form.username.trim()) e.username = 'ব্যবহারকারী নাম দিন'
    if (!form.email.trim()) e.email = 'ইমেইল দিন'
    if (form.password.length < 8) e.password = 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrors({ general: data.error || 'নিবন্ধন ব্যর্থ হয়েছে' })
        return
      }
      router.push('/login?registered=1')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">📖</span>
            <span className="font-display text-xl font-bold text-stone-900 dark:text-stone-100 font-bengali">
              {SITE_NAME}
            </span>
          </Link>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 font-bengali">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-2">
              {(['READER', 'AUTHOR'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={`rounded-lg border py-2.5 text-sm font-medium font-bengali transition-all ${
                    form.role === role
                      ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                      : 'border-stone-200 text-stone-500 hover:border-stone-300 dark:border-stone-700'
                  }`}
                >
                  {role === 'READER' ? '📚 পাঠক' : '✍️ লেখক'}
                </button>
              ))}
            </div>

            <Input id="name" label="পূর্ণ নাম *" placeholder="আপনার নাম" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input id="username" label="ব্যবহারকারী নাম *" placeholder="username" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} error={errors.username} />
            <Input id="email" type="email" label="ইমেইল *" placeholder="email@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Input id="password" type="password" label="পাসওয়ার্ড *" placeholder="কমপক্ষে ৮ অক্ষর" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />

            {errors.general && (
              <p className="text-sm text-red-500 text-center font-bengali">{errors.general}</p>
            )}

            <Button type="submit" isLoading={isLoading} size="lg" className="mt-2">
              অ্যাকাউন্ট তৈরি করুন
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-stone-500 dark:text-stone-400 font-bengali">
            আগে থেকে অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              প্রবেশ করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
