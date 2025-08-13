import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { db } from "../../../../lib/db"
import { enrollments, courses, users, courseReviews } from "../../../../lib/schema"
import { eq, desc, avg } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userEnrollments = await db
      .select({
        enrollment: enrollments,
        course: courses,
        instructor: {
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .innerJoin(users, eq(courses.instructorId, users.id))
      .where(eq(enrollments.userId, session.user.id))
      .orderBy(desc(enrollments.enrollmentDate))

    // Get ratings for each course
    const enrollmentsWithRatings = await Promise.all(
      userEnrollments.map(async (item) => {
        const [avgRating] = await db
          .select({ avg: avg(courseReviews.rating) })
          .from(courseReviews)
          .where(eq(courseReviews.courseId, item.course.id))

        return {
          ...item,
          averageRating: Number(avgRating.avg) || 0,
        }
      }),
    )

    return NextResponse.json(enrollmentsWithRatings)
  } catch (error) {
    console.error("Enrollments fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
