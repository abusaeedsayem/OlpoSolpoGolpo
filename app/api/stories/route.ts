import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

const publishStorySchema = z.object({
  title: z.string().min(1, 'গল্পের শিরোনাম অবশ্যই দিতে হবে'),
  chapterTitle: z.string().optional().default('প্রথম অধ্যায়'),
  content: z.string().min(1, 'গল্পের বিষয়বস্তু বা বডি অবশ্যই লিখতে হবে'),
  description: z.string().optional().default(''),
  categorySlug: z.string().optional().default('social'),
  tags: z.array(z.string()).optional().default([]),
  coverUrl: z.string().optional().default(''),
  isMature: z.boolean().optional().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional().default('PUBLISHED'),
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

// POST /api/stories — create & publish story + first chapter
export async function POST(request: Request) {
  try {
    const session = await auth()
    const body = await request.json()
    const parsed = publishStorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const {
      title,
      chapterTitle,
      content,
      description,
      categorySlug,
      tags,
      coverUrl,
      isMature,
      status,
    } = parsed.data

    // Find author user
    let authorId = session?.user?.id
    if (!authorId) {
      // Find default author or fallback
      const defaultAuthor = await prisma.user.findFirst({
        where: { role: 'AUTHOR' },
      })
      authorId = defaultAuthor?.id || 'demo-author-id'
    }

    // Find or connect category
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ slug: categorySlug }, { id: categorySlug }],
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'বিভাগ নির্বাচন করা সম্ভব হয়নি।' },
        { status: 400 }
      )
    }

    // Ensure unique slug
    const baseSlug = slugify(title) || `story-${Date.now()}`
    const existing = await prisma.story.findUnique({ where: { slug: baseSlug } })
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length

    // Create Story and Chapter 1 atomically
    const story = await prisma.story.create({
      data: {
        title,
        slug,
        description: description || title,
        coverUrl: coverUrl || null,
        status,
        isMature,
        tags,
        authorId,
        categoryId: category.id,
        chapters: {
          create: {
            chapterNumber: 1,
            title: chapterTitle || 'প্রথম অধ্যায়',
            content,
            wordCount,
            status,
          },
        },
      },
      include: {
        category: { select: { name: true, slug: true } },
        chapters: true,
      },
    })

    return NextResponse.json({ story, slug: story.slug }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/stories]', error)
    return NextResponse.json({ error: 'গল্প প্রকাশ করতে ত্রুটি হয়েছে' }, { status: 500 })
  }
}
