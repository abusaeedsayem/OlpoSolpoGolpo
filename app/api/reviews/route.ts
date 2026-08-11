import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  storyId: z.string().min(1),
  rating: z.number().min(1).max(5),
  body: z.string().optional().default(''),
})

// GET /api/reviews?storyId=xxx — fetch reviews for a story
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storyId = searchParams.get('storyId')

  if (!storyId) {
    return NextResponse.json({ reviews: [] })
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { storyId },
      include: {
        user: { select: { name: true, username: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const avgRating = reviews.length
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0'

    return NextResponse.json({ reviews, avgRating: parseFloat(avgRating), total: reviews.length })
  } catch (error) {
    console.error('[GET /api/reviews]', error)
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}

// POST /api/reviews — create or update a review
export async function POST(request: Request) {
  try {
    const session = await auth()
    const json = await request.json()
    const parsed = reviewSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: 'সঠিক রেটিং (১-৫) এবং মন্তব্য দিন' }, { status: 400 })
    }

    const { storyId, rating, body } = parsed.data

    let userId = session?.user?.id
    if (!userId) {
      // Find sample reader user or author user
      const defaultUser = await prisma.user.findFirst()
      userId = defaultUser?.id || 'demo-user-id'
    }

    const review = await prisma.review.upsert({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
      update: {
        rating,
        body,
      },
      create: {
        userId,
        storyId,
        rating,
        body,
      },
      include: {
        user: { select: { name: true, username: true, avatarUrl: true } },
      },
    })

    return NextResponse.json({ review, success: true }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/reviews]', error)
    return NextResponse.json({ error: 'রিভিউ সংরক্ষণ করতে সমস্যা হয়েছে' }, { status: 500 })
  }
}
