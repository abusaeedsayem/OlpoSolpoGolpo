import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

const createStorySchema = z.object({
  title: z.string().min(1, 'শিরোনাম দিন').max(200),
  description: z.string().min(10, 'বিবরণ কমপক্ষে ১০ অক্ষর').max(1000),
  categoryId: z.string().min(1, 'বিভাগ বেছে নিন'),
  tags: z.array(z.string()).optional().default([]),
  isMature: z.boolean().optional().default(false),
})

// GET /api/stories — list published stories
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const category = searchParams.get('category')

  try {
    const where = {
      status: 'PUBLISHED' as const,
      ...(category ? { category: { slug: category } } : {}),
    }

    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where,
        include: {
          author: { select: { name: true, username: true, avatarUrl: true } },
          category: { select: { name: true, slug: true } },
          _count: { select: { chapters: true, bookmarks: true } },
        },
        orderBy: { readCount: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.story.count({ where }),
    ])

    return NextResponse.json({ stories, total, page, limit })
  } catch (error) {
    console.error('[GET /api/stories]', error)
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}

// POST /api/stories — create a new story (author only)
export async function POST(request: Request) {
  try {
    // TODO: get session from NextAuth and verify AUTHOR role
    const body = await request.json()
    const parsed = createStorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { title, description, categoryId, tags, isMature } = parsed.data

    // Ensure unique slug
    const baseSlug = slugify(title)
    const existing = await prisma.story.findUnique({ where: { slug: baseSlug } })
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug

    const story = await prisma.story.create({
      data: {
        title,
        slug,
        description,
        categoryId,
        tags,
        isMature,
        authorId: 'PLACEHOLDER_USER_ID', // Replace with session.user.id
      },
    })

    return NextResponse.json({ story }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/stories]', error)
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}
