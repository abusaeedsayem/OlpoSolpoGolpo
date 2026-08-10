import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/bookmarks — toggle bookmark
export async function POST(request: Request) {
  try {
    // TODO: get userId from NextAuth session
    const { storyId } = await request.json()
    const userId = 'PLACEHOLDER_USER_ID'

    const existing = await prisma.bookmark.findUnique({
      where: { userId_storyId: { userId, storyId } },
    })

    if (existing) {
      await prisma.bookmark.delete({
        where: { userId_storyId: { userId, storyId } },
      })
      return NextResponse.json({ bookmarked: false })
    }

    await prisma.bookmark.create({ data: { userId, storyId } })
    return NextResponse.json({ bookmarked: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}

// GET /api/bookmarks — get user bookmarks
export async function GET() {
  try {
    const userId = 'PLACEHOLDER_USER_ID'
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        story: {
          include: {
            author: { select: { name: true, username: true } },
            category: { select: { name: true } },
            _count: { select: { chapters: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ bookmarks })
  } catch {
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}
