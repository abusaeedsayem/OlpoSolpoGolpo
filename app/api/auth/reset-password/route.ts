import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const resetSchema = z.object({
  email: z.string().email('সঠিক ইমেইল দিন'),
  newPassword: z.string().min(8, 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = resetSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase().trim()
    const { newPassword } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।' },
        { status: 404 }
      )
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    })

    return NextResponse.json(
      { message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[RESET_PASSWORD]', error)
    return NextResponse.json(
      { error: 'সার্ভার সমস্যা, অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    )
  }
}
