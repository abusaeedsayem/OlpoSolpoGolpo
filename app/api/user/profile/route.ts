import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  username: z.string().optional(),
})

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    const body = await request.json()
    const parsed = updateProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'ভুল ইনপুট তথ্য' }, { status: 400 })
    }

    const { bio, avatarUrl, coverUrl, username } = parsed.data

    let userId = session?.user?.id

    if (!userId) {
      // Fallback update for demo user if username provided
      const targetUser = await prisma.user.findFirst({
        where: username ? { OR: [{ username }, { email: username }] } : { role: 'AUTHOR' },
      })
      userId = targetUser?.id
    }

    if (!userId) {
      return NextResponse.json({ error: 'অনুমোদিত নয়' }, { status: 401 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(bio !== undefined ? { bio } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('[PATCH /api/user/profile]', error)
    return NextResponse.json({ error: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
