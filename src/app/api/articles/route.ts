import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    
    // Build query conditions
    const conditions = [eq(articles.status, "PUBLISHED")];
    if (category) {
      conditions.push(eq(articles.categoryId, category));
    }
    
    const result = await db.query.articles.findMany({
      where: and(...conditions),
      orderBy: [desc(articles.publishedAt)],
      with: {
        author: {
          columns: {
            id: true,
            displayNameBn: true,
            image: true,
          }
        },
        category: {
          columns: {
            id: true,
            nameBn: true,
            slug: true,
          }
        }
      },
      limit: 20, // Default limit
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { titleBn, contentBn, categoryId, excerptBn } = body;
    
    if (!titleBn || !contentBn) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    
    const slug = `${titleBn.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    const newId = randomUUID();
    
    await db.insert(articles).values({
      id: newId,
      slug,
      titleBn,
      contentBn,
      excerptBn,
      categoryId,
      authorId: session.user.id,
      status: "PENDING",
    });
    
    return NextResponse.json({ success: true, id: newId, slug }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
