import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { enrollments, lessonProgress, lessons, modules, subscriptions } from "../../../../../lib/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { nanoid } from "nanoid";
import { sql } from "drizzle-orm";

// ✅ GET - Fetch all lesson progress for a course
export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = params.courseId;

    // Check if the user is enrolled in the course
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.user_id, userId),
          eq(enrollments.course_id, courseId)
        )
      )
      .limit(1);

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in course" }, { status: 403 });
    }

    // Fetch all lessons in the course
    const allLessons = await db
      .select({ lessonId: lessons.id })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, courseId));

    const lessonIds = allLessons.map(l => l.lessonId);

    if (lessonIds.length === 0) {
      return NextResponse.json({ progress: 0 });
    }

    // Count completed lessons
    const completedLessons = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.completed, true)
        )
      );

    const completedCount = completedLessons.filter(lp =>
      lessonIds.includes(lp.lessonId)
    ).length;

    const progress = Math.round((completedCount / lessonIds.length) * 100);

    return NextResponse.json({ progress });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST - Update or insert lesson progress
export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id || session.user.userType !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const userId = session.user.id;
  const courseId = params.courseId;

  const { lessonId, progress } = await req.json();

  try {
    // ✅ Verify enrollment or subscription access
    let enrollmentRecord = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.user_id, userId), eq(enrollments.course_id, courseId)))
      .limit(1);

    let enrollment = enrollmentRecord[0];

    // ✅ If no direct enrollment, check for subscription access
    if (!enrollment) {
      // Check for active subscription (pro or team plans)
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(subscriptions.createdAt)
        .limit(1);

      if (!(subscription && ["pro", "team"].includes(subscription.planId) && subscription.status === "active")) {
        return NextResponse.json({ error: "Not enrolled in course" }, { status: 403 });
      }
      
      // For subscription users, we'll create a temporary enrollment record
      const newEnrollment = {
        id: nanoid(),
        user_id: userId,
        course_id: courseId,
        enrollmentDate: new Date(),
        amountPaid: "0.00",
        progress: 0,
        completedAt: null,
        certificateIssued: false,
      };
      
      // Check if this enrollment already exists (in case of retries)
      const [existingEnrollment] = await db
        .select()
        .from(enrollments)
        .where(and(eq(enrollments.user_id, userId), eq(enrollments.course_id, courseId)))
        .limit(1);
      
      if (!existingEnrollment) {
        // Create the enrollment record for subscription user
        await db.insert(enrollments).values({
          id: newEnrollment.id,
          user_id: newEnrollment.user_id,
          course_id: newEnrollment.course_id,
          enrollmentDate: newEnrollment.enrollmentDate,
          amountPaid: newEnrollment.amountPaid,
          progress: newEnrollment.progress,
          completedAt: newEnrollment.completedAt,
          certificateIssued: newEnrollment.certificateIssued,
        });
      }
      
      enrollment = newEnrollment;
    }

    // ✅ Verify lesson belongs to course
    const [lesson] = await db
      .select()
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(and(eq(lessons.id, lessonId), eq(modules.courseId, courseId)))
      .limit(1);

    if (!lesson) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 });
    }

    // ✅ Update or insert lesson progress
    const [existingProgress] = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)))
      .limit(1);

    const isCompleted = progress >= 100;

    if (existingProgress) {
      await db
        .update(lessonProgress)
        .set({
          progressPercentage: progress,
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : existingProgress.completedAt,
        })
        .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)));
    } else {
      await db.insert(lessonProgress).values({
        id: nanoid(),
        userId,
        lessonId,
        progressPercentage: progress,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      });
    }

    // ✅ Calculate overall course progress
    const totalLessonsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, courseId));

    const totalLessons = Number(totalLessonsResult[0].count);

    const completedLessonsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(modules.courseId, courseId),
          eq(lessonProgress.completed, true)
        )
      );

    const completedCount = Number(completedLessonsResult[0].count);

    const courseProgress = Math.floor((completedCount / totalLessons) * 100) || 0;

    // ✅ Update course progress in enrollments
    await db
      .update(enrollments)
      .set({
        progress: courseProgress,
        completedAt:
          courseProgress === 100 && !enrollment.completedAt
            ? new Date()
            : enrollment.completedAt,
        certificateIssued:
          courseProgress === 100 ? true : enrollment.certificateIssued,
      })
      .where(and(eq(enrollments.user_id, userId), eq(enrollments.course_id, courseId)));

    return NextResponse.json({ success: true, courseProgress });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
