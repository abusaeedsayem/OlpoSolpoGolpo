'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SITE_NAME } from '@/lib/constants'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Check if email exists by attempting password reset step
      if (!email.includes('@')) {
        setError('সঠিক ইমেইল অ্যাড্রেস লিখুন।')
        setIsLoading(false)
        return
      }
      setStep('reset')
    } catch {
      setError('একটি সমস্যা দেখা দিয়েছে। আবার চেষ্টা করুন।')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('পাসওয়ার্ড দুটি মিলছে না।')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'পাসওয়ার্ড রিকভারি করতে সমস্যা হয়েছে।')
        setIsLoading(false)
      } else {
        setStep('success')
        setIsLoading(false)
      }
    } catch {
      setError('একটি সমস্যা দেখা দিয়েছে। আবার চেষ্টা করুন।')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-4 sm:px-6 font-bengali">
      <div className="mx-auto max-w-md">
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8">
          
          {/* Logo Header */}
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
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-bengali mt-2">
              {step === 'success' ? 'পাসওয়ার্ড পরিবর্তন সম্পন্ন' : 'পাসওয়ার্ড পুনরুদ্ধার (Forgot Password)'}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-bengali text-center mt-1">
              {step === 'request' && 'আপনার অ্যাকাউন্টের নিবন্ধিত ইমেইল দিন'}
              {step === 'reset' && 'আপনার অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড সেট করুন'}
              {step === 'success' && 'নতুন পাসওয়ার্ড ব্যবহার করে লগইন করুন'}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <Input
                id="reset-email"
                type="email"
                label="ইমেইল অ্যাড্রেস *"
                placeholder="আপনার নিবন্ধিত ইমেইল দিন"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold"
              >
                পরবর্তী ধাপ (Continue)
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs text-stone-600 dark:text-stone-300">
                ইমেইল: <strong className="text-teal-700 dark:text-teal-400">{email}</strong>
              </div>

              <Input
                id="new-password"
                type="password"
                label="নতুন পাসওয়ার্ড (New Password) *"
                placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                id="confirm-password"
                type="password"
                label="পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *"
                placeholder="আবার পাসওয়ার্ডটি লিখুন"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold"
              >
                পাসওয়ার্ড পরিবর্তন করুন (Reset Password)
              </Button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="text-5xl my-2">✅</div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-800 dark:text-green-300 font-bold">
                আপনার পাসওয়ার্ড পরিবর্তন সফল হয়েছে!
              </div>
              <Link
                href="/login"
                className="block w-full text-center rounded-xl bg-teal-800 hover:bg-teal-900 py-3 text-sm font-bold text-white transition-colors"
              >
                লগইন পাতায় ফিরে যান (Go to Login)
              </Link>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
            <Link
              href="/login"
              className="text-xs font-bold text-teal-700 hover:underline dark:text-teal-400"
            >
              ← সাইন ইন পাতায় ফিরে যান (Back to Login)
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
