import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { db } from "../../../../lib/db"
import { courses, enrollments, courseReviews } from "../../../../lib/schema"
import { eq, desc, count, avg, sum } from "drizzle-orm"
import pkg from "uuid";
const { v4: uuidv4 } = pkg;


export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const instructorCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, session.user.id))
      .orderBy(desc(courses.createdAt))

    // Get stats for each course
    const coursesWithStats = await Promise.all(
      instructorCourses.map(async (course) => {
        const [enrollmentCount] = await db
          .select({ count: count() })
          .from(enrollments)
          .where(eq(enrollments.courseId, course.id))

        const [avgRating] = await db
          .select({ avg: avg(courseReviews.rating) })
          .from(courseReviews)
          .where(eq(courseReviews.courseId, course.id))

        const [reviewCount] = await db
          .select({ count: count() })
          .from(courseReviews)
          .where(eq(courseReviews.courseId, course.id))

        const [totalRevenue] = await db
          .select({ sum: sum(enrollments.amountPaid) })
          .from(enrollments)
          .where(eq(enrollments.courseId, course.id))

        return {
          ...course,
          enrollmentCount: enrollmentCount.count || 0,
          averageRating: Number(avgRating.avg) || 0,
          reviewCount: reviewCount.count || 0,
          totalRevenue: Number(totalRevenue.sum) || 0,
          progress: course.status === "published" ? 100 : Math.floor(Math.random() * 80) + 20,
        }
      }),
    )

    return NextResponse.json(coursesWithStats)
  } catch (error) {
    console.error("Courses fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courseData = await request.json()

    const [newCourse] = await db.insert(courses).values({
      id: uuidv4(),
      instructorId: session.user.id,
      title: courseData.title,
      subtitle: courseData.subtitle,
      description: courseData.description,
      category: courseData.category,
      level: courseData.level,
      language: courseData.language,
      price: courseData.price,
      originalPrice: courseData.originalPrice,
      duration: courseData.duration,
      thumbnailUrl: courseData.thumbnailUrl,
      whatYoullLearn: courseData.whatYoullLearn,
      requirements: courseData.requirements,
      status: "draft",
    })

    return NextResponse.json(newCourse)
  } catch (error) {
    console.error("Course creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
