import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { db } from "../../../../lib/db"
import { enrollments } from "../../../../lib/schema"
import { eq, count, and } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total enrollments
    const [totalEnrollments] = await db
      .select({ count: count() })
      .from(enrollments)
      .where(eq(enrollments.user_id, session.user.id))

    // Get completed courses
    const [completedCourses] = await db
      .select({ count: count() })
      .from(enrollments)
      .where(and(eq(enrollments.user_id, session.user.id), eq(enrollments.progress, 100)))

    // Get certificates earned (completed courses with certificates)
    const [certificatesEarned] = await db
      .select({ count: count() })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.user_id, session.user.id),
          eq(enrollments.progress, 100),
          eq(enrollments.certificateIssued, true),
        ),
      )

    return NextResponse.json({
      totalEnrollments: totalEnrollments.count || 0,
      completedCourses: completedCourses.count || 0,
      certificatesEarned: certificatesEarned.count || 0,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
