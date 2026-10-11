import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is ADMIN
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }
    
    const body = await request.json();
    const { status } = body;
    
    if (!status || !["DRAFT", "PENDING", "SCHEDULED", "PUBLISHED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    
    const updateData: any = { 
      status,
      updatedAt: new Date(),
    };
    
    if (status === "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    
    const { id } = await params;
await db.update(articles)
      .set(updateData)
      .where(eq(articles.id, id));
      
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
