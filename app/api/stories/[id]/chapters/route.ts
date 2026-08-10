import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const chapterSchema = z.object({
  title: z.string().min(1, 'অধ্যায়ের শিরোনাম দিন'),
  content: z.string().min(1, 'বিষয়বস্তু দিন'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})

// GET /api/stories/[id]/chapters
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const chapters = await prisma.chapter.findMany({
      where: { storyId: id },
      orderBy: { chapterNumber: 'asc' },
    })
    return NextResponse.json({ chapters })
  } catch {
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}

// POST /api/stories/[id]/chapters
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const parsed = chapterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { title, content, status } = parsed.data
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length

    // Get next chapter number
    const lastChapter = await prisma.chapter.findFirst({
      where: { storyId: id },
      orderBy: { chapterNumber: 'desc' },
    })
    const chapterNumber = (lastChapter?.chapterNumber ?? 0) + 1

    const chapter = await prisma.chapter.create({
      data: { storyId: id, title, content, status, wordCount, chapterNumber },
    })

    return NextResponse.json({ chapter }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'সার্ভার ত্রুটি' }, { status: 500 })
  }
}
