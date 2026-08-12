import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'অনুমতি নেই (Unauthorized Super Admin)' }, { status: 403 })
    }

    const [totalUsers, totalReaders, totalAuthors, totalAdmins, totalStories, totalPublished, totalDrafts] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'READER' } }),
        prisma.user.count({ where: { role: 'AUTHOR' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.story.count(),
        prisma.story.count({ where: { status: 'PUBLISHED' } }),
        prisma.story.count({ where: { status: 'DRAFT' } }),
      ])

    return NextResponse.json({
      totalUsers,
      totalReaders,
      totalAuthors,
      totalAdmins,
      totalStories,
      totalPublished,
      totalDrafts,
    })
  } catch (error) {
    console.error('[SUPERADMIN_STATS]', error)
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}
