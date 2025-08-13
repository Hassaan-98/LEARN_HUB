import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { db } from "../../../../lib/db"
import { courses, enrollments, courseReviews } from "../../../../lib/schema"
import { eq, count, sum, avg } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total courses
    const [totalCourses] = await db
      .select({ count: count() })
      .from(courses)
      .where(eq(courses.instructorId, session.user.id))

    // Get total students (enrollments)
    const [totalStudents] = await db
      .select({ count: count() })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.course_id, courses.id))
      .where(eq(courses.instructorId, session.user.id))

    // Get total revenue
    const [totalRevenue] = await db
      .select({ sum: sum(enrollments.amountPaid) })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.course_id, courses.id))
      .where(eq(courses.instructorId, session.user.id))

    // Get average rating
    const [averageRating] = await db
      .select({ avg: avg(courseReviews.rating) })
      .from(courseReviews)
      .innerJoin(courses, eq(courseReviews.courseId, courses.id))
      .where(eq(courses.instructorId, session.user.id))

    // Get total reviews
    const [totalReviews] = await db
      .select({ count: count() })
      .from(courseReviews)
      .innerJoin(courses, eq(courseReviews.courseId, courses.id))
      .where(eq(courses.instructorId, session.user.id))

    return NextResponse.json({
      totalCourses: totalCourses.count || 0,
      totalStudents: totalStudents.count || 0,
      totalRevenue: Number(totalRevenue.sum) || 0,
      averageRating: Number(averageRating.avg) || 0,
      totalReviews: totalReviews.count || 0,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
