import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles, categories, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const dom = new JSDOM("about:blank");
const window = dom.window;
const purify = DOMPurify(window);

const sanitizeBengaliContent = (content: string): string => {
  if (!content) return content;

  // Use type assertion to bypass strict typing for ALLOWED_ATTR
  const config: any = {
    WHOLE_DOC: false,
    ALLOWED_TAGS: [
      "p",
      "br",
      "b",
      "i",
      "u",
      "strong",
      "em",
      "a",
      "span",
      "div",
    ],
    ALLOWED_ATTR: {
      p: ["class"],
      a: ["href", "title"],
      span: ["class"],
      div: ["class"],
    },
    ADDITIONAL_TAGS: [],
    RETURN_DOM: false,
  };

  return purify.sanitize(content, config) as unknown as string;
};

const ensurePoemStanzaClass = (content: string): string => {
  return content.replace(
    /<p[^>]*class="[^"]*poem-stanza[^"]*"[^>]*>/gi,
    (match) => match.replace(/ class="/g, ' class="poem-stanza"')
  );
};

export async function POST(
  request: NextRequest,
  { params }: { params: { } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { titleBn, contentBn, categoryId, excerptBn } = body;

    if (!titleBn || !contentBn) {
      return NextResponse.json(
        { error: "titleBn and contentBn are required" },
        { status: 400 }
      );
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let safeContentBn = sanitizeBengaliContent(contentBn);
    safeContentBn = ensurePoemStanzaClass(safeContentBn);

    let safeExcerptBn = excerptBn ? sanitizeBengaliContent(excerptBn) : null;

    const slug = `${titleBn
      .replace(/\s+/g, "-")
      .toLowerCase()
      .replace(/[^\w-]/g, "")
      .replace(/-+/g, "-")}-${Date.now()}`;

    const [newArticle] = await db.insert(articles).values({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      slug,
      titleBn,
      contentBn: safeContentBn,
      excerptBn: safeExcerptBn,
      categoryId: categoryId || null,
      authorId: user.id,
      status: "PENDING",
      isPaywalled: false,
      requiredTier: null,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({
      id: articles.id,
      slug: articles.slug,
      titleBn: articles.titleBn,
      contentBn: articles.contentBn,
      excerptBn: articles.excerptBn,
      categoryId: articles.categoryId,
      authorId: articles.authorId,
      status: articles.status,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newArticle.id,
          slug: newArticle.slug,
          titleBn: newArticle.titleBn,
          contentBn: newArticle.contentBn,
          excerptBn: newArticle.excerptBn,
          categoryId: newArticle.categoryId,
          authorId: newArticle.authorId,
          status: newArticle.status as 'PUBLISHED' | 'PENDING' | 'DRAFT' | 'SCHEDULED',
        },
        message: "Story submitted successfully and pending review",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating story submission:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}