import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        stories: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            coverUrl: true,
            readCount: true,
            tags: true,
            category: { select: { name: true } },
            _count: { select: { chapters: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 })
    }

    const formattedUser = {
      ...user,
      followersCount: 125,
      followingCount: 42,
      stories: user.stories.map((s) => ({
        ...s,
        categoryName: s.category?.name || 'সামাজিক',
        chapterCount: s._count.chapters || 1,
      })),
    }

    return NextResponse.json({ user: formattedUser })
  } catch (error) {
    console.error('[GET /api/profile]', error)
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}
