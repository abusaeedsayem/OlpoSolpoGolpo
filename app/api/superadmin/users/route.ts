import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { stories: true, reviews: true, bookmarks: true },
        },
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('[SUPERADMIN_GET_USERS]', error)
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
    const { userId, role, newPassword, name, username, email } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID প্রয়োজন' }, { status: 400 })
    }

    const updateData: any = {}

    if (role && ['READER', 'AUTHOR', 'ADMIN'].includes(role)) {
      updateData.role = role
    }

    if (name && typeof name === 'string') {
      updateData.name = name.trim()
    }

    if (username && typeof username === 'string') {
      updateData.username = username.toLowerCase().trim()
    }

    if (email && typeof email === 'string') {
      updateData.email = email.toLowerCase().trim()
    }

    if (newPassword && typeof newPassword === 'string' && newPassword.length >= 6) {
      updateData.passwordHash = await bcrypt.hash(newPassword, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user: updatedUser, message: 'ব্যবহারকারীর তথ্য পরিবর্তন সফল' })
  } catch (error) {
    console.error('[SUPERADMIN_PATCH_USER]', error)
    return NextResponse.json({ error: 'পরিবর্তন ব্যর্থ হয়েছে' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'অনুমতি নেই' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID প্রয়োজন' }, { status: 400 })
    }

    // Do not allow deleting self
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'নিজের সুপার অ্যাডমিন অ্যাকাউন্ট মোছা যাবে না' }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ message: 'ব্যবহারকারী মুছে ফেলা হয়েছে' })
  } catch (error) {
    console.error('[SUPERADMIN_DELETE_USER]', error)
    return NextResponse.json({ error: 'মুছে ফেলা ব্যর্থ হয়েছে' }, { status: 500 })
  }
}
