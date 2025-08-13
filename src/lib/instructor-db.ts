import { db } from "./db"
import { users, instructorProfiles, courses, enrollments, courseReviews } from "./schema"
import { eq, sql, desc } from "drizzle-orm"

export async function getInstructorProfile(userId: string) {
  const instructor = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!instructor) return null

  const profile = await db.query.instructorProfiles.findFirst({
    where: eq(instructorProfiles.userId, userId),
  })

  return { ...instructor, profile }
}

export async function updateInstructorProfile(userId: string, data: any) {
  await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))

  return { success: true }
}

export async function getInstructorStats(userId: string) {
  // Get total courses
  const totalCourses = await db
    .select({ count: sql<number>`count(*)` })
    .from(courses)
    .where(eq(courses.instructorId, userId))

  // Get total students (enrollments)
  const totalStudents = await db
    .select({ count: sql<number>`count(distinct ${enrollments.userId})` })
    .from(enrollments)
    .innerJoin(courses, eq(courses.id, enrollments.courseId))
    .where(eq(courses.instructorId, userId))

  // Get total revenue
  const totalRevenue = await db
    .select({ sum: sql<number>`sum(${enrollments.amountPaid})` })
    .from(enrollments)
    .innerJoin(courses, eq(courses.id, enrollments.courseId))
    .where(eq(courses.instructorId, userId))

  // Get average rating
  const avgRating = await db
    .select({ avg: sql<number>`avg(${courseReviews.rating})` })
    .from(courseReviews)
    .innerJoin(courses, eq(courses.id, courseReviews.courseId))
    .where(eq(courses.instructorId, userId))

  return {
    totalCourses: totalCourses[0]?.count || 0,
    totalStudents: totalStudents[0]?.count || 0,
    totalRevenue: totalRevenue[0]?.sum || 0,
    averageRating: avgRating[0]?.avg || 0,
  }
}

export async function getInstructorCourses(userId: string) {
  const instructorCourses = await db.query.courses.findMany({
    where: eq(courses.instructorId, userId),
    orderBy: [desc(courses.createdAt)],
  })

  // Get enrollment counts for each course
  const coursesWithStats = await Promise.all(
    instructorCourses.map(async (course) => {
      const enrollmentCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(enrollments)
        .where(eq(enrollments.courseId, course.id))

      const avgRating = await db
        .select({ avg: sql<number>`avg(${courseReviews.rating})` })
        .from(courseReviews)
        .where(eq(courseReviews.courseId, course.id))

      const totalRevenue = await db
        .select({ sum: sql<number>`sum(${enrollments.amountPaid})` })
        .from(enrollments)
        .where(eq(enrollments.courseId, course.id))

      return {
        ...course,
        enrollmentCount: enrollmentCount[0]?.count || 0,
        averageRating: avgRating[0]?.avg || 0,
        totalRevenue: totalRevenue[0]?.sum || 0,
      }
    }),
  )

  return coursesWithStats
}

export async function getStudentProfile(userId: string) {
  const student = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!student) return null

  // Get enrolled courses
  const enrolledCourses = await db
    .select({
      course: courses,
      enrollment: enrollments,
    })
    .from(enrollments)
    .innerJoin(courses, eq(courses.id, enrollments.courseId))
    .where(eq(enrollments.userId, userId))
    .orderBy(desc(enrollments.enrollmentDate))

  return {
    ...student,
    enrolledCourses,
  }
}

export async function uploadProfilePhoto(userId: string, photoUrl: string) {
  await db
    .update(users)
    .set({
      profilePhoto: photoUrl,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))

  return { success: true, photoUrl }
}
