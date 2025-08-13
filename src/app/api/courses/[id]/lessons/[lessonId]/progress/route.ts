import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../auth/[...nextauth]/route" // Adjust path if different
import { db } from "../../../../../../../lib/db"
import { lessonProgress } from "../../../../../../../lib/schema"
import { eq, and } from "drizzle-orm"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get("lessonId")

    if (!lessonId) {
      return NextResponse.json(
        { error: "Missing lessonId query parameter" },
        { status: 400 }
      )
    }

    const progress = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, session.user.id),
          eq(lessonProgress.lessonId, lessonId)
        )
      )
      .limit(1)

    return NextResponse.json(progress[0] || {})
  } catch (error) {
    console.error("GET lesson progress error:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { lessonId, progressPercentage, completed } = body

    if (!lessonId) {
      return NextResponse.json(
        { error: "Missing lessonId in request body" },
        { status: 400 }
      )
    }

    const existing = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, session.user.id),
          eq(lessonProgress.lessonId, lessonId)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // Update
      await db
        .update(lessonProgress)
        .set({
          progressPercentage,
          completed,
          completedAt: completed ? new Date() : null
        })
        .where(
          and(
            eq(lessonProgress.userId, session.user.id),
            eq(lessonProgress.lessonId, lessonId)
          )
        )
    } else {
      // Insert
      await db.insert(lessonProgress).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        lessonId,
        progressPercentage: progressPercentage || 0,
        completed: completed || false,
        completedAt: completed ? new Date() : null
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST lesson progress error:", error)
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    )
  }
}
