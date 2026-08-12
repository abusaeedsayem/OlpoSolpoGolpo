import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 403 })
    }

    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, username: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { chapters: true, reviews: true, bookmarks: true } },
      },
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('[SUPERADMIN_GET_STORIES]', error)
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 403 })
    }

    const body = await request.json()
    const { storyId, status, title, description, categoryId } = body

    if (!storyId) {
      return NextResponse.json({ error: 'Story ID প্রয়োজন' }, { status: 400 })
    }

    const updateData: any = {}

    if (status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      updateData.status = status
    }

    if (title && typeof title === 'string') {
      updateData.title = title.trim()
    }

    if (description && typeof description === 'string') {
      updateData.description = description.trim()
    }

    if (categoryId && typeof categoryId === 'string') {
      updateData.categoryId = categoryId
    }

    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, username: true } },
        category: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json({ story: updatedStory, message: 'গল্পের তথ্য আপডেট সফল' })
  } catch (error) {
    console.error('[SUPERADMIN_PATCH_STORY]', error)
    return NextResponse.json({ error: 'গল্প আপডেট ব্যর্থ হয়েছে' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const storyId = searchParams.get('storyId')

    if (!storyId) {
      return NextResponse.json({ error: 'Story ID প্রয়োজন' }, { status: 400 })
    }

    await prisma.story.delete({
      where: { id: storyId },
    })

    return NextResponse.json({ message: 'গল্পটি সফলভাবে মুছে ফেলা হয়েছে' })
  } catch (error) {
    console.error('[SUPERADMIN_DELETE_STORY]', error)
    return NextResponse.json({ error: 'গল্প মোছা ব্যর্থ হয়েছে' }, { status: 500 })
  }
}
