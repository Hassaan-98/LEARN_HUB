import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import {
  courses,
  users,
  courseReviews,
  modules,
  lessons,
  instructorProfiles,
  enrollments,
  courseMaterials,
} from "../../../../lib/schema";
import { eq, avg, count } from "drizzle-orm";

type ModuleWithLessons = {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  lessons?: any[]; 
};
export async function GET(
   request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const courseId = params.id;


  try {
    // 1. Fetch course with instructor info and aggregates
    const courseResult = await db
      .select({
        id: courses.id,
        title: courses.title,
        subtitle: courses.subtitle,
        description: courses.description,
        category: courses.category,
        level: courses.level,
        language: courses.language,
        price: courses.price,
        originalPrice: courses.originalPrice,
        duration: courses.duration,
        thumbnailUrl: courses.thumbnailUrl,
        isPublished: courses.isPublished,
        bestseller: courses.isPublished,
        whatYoullLearn: courses.whatYoullLearn,
        requirements: courses.requirements,
        createdAt: courses.createdAt,
        instructorId: courses.instructorId,
        instructorFirstName: users.firstName,
        instructorLastName: users.lastName,
        instructorProfileHeadline: instructorProfiles.headline,
        instructorProfileBio: instructorProfiles.bio,
        avgRating: avg(courseReviews.rating),
        studentCount: count(enrollments.id),
      })
      .from(courses)
      .leftJoin(users, eq(courses.instructorId, users.id))
      .leftJoin(instructorProfiles, eq(users.id, instructorProfiles.userId))
      .leftJoin(courseReviews, eq(courses.id, courseReviews.courseId))
      .leftJoin(enrollments, eq(courses.id, enrollments.course_id))
      .where(eq(courses.id, courseId))
      .groupBy(courses.id, users.id, instructorProfiles.id)
      .execute();

    const course = courseResult[0]; // because execute returns array

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 2. Fetch reviews
    const reviews = await db
      .select({
        id: courseReviews.id,
        authorFirstName: users.firstName,
        rating: courseReviews.rating,
        comment: courseReviews.comment,
        createdAt: courseReviews.createdAt,
      })
      .from(courseReviews)
      .leftJoin(users, eq(courseReviews.userId, users.id))
      .where(eq(courseReviews.courseId, courseId))
      .execute();

    // 3. Fetch modules
    const modulesData = await db
      .select({
        id: modules.id,
        title: modules.title,
        description: modules.description,
        orderIndex: modules.orderIndex,
      })
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(modules.orderIndex)
      .execute();

    // 4. Fetch lessons for each module
for (const module of modulesData as ModuleWithLessons[]) {
  const lessonsData = await db
    .select({
      id: lessons.id,
      title: lessons.title,
      description: lessons.description,
      duration: lessons.duration,
      videoUrl: lessons.videoUrl,
      isPreview: lessons.isPreview,
      orderIndex: lessons.orderIndex,
      playbackId: courseMaterials.playbackId,
    })
    .from(lessons)
    .leftJoin(courseMaterials, eq(lessons.id, courseMaterials.lessonId))
    .where(eq(lessons.moduleId, module.id))
    .orderBy(lessons.orderIndex)
    .execute();

  lessonsData.forEach((lesson: any) => {
    if (lesson.playbackId) {
      lesson.videoUrl = `https://stream.mux.com/${lesson.playbackId}.m3u8`;
    }
  });

  module.lessons = lessonsData;
}

    // Compose final response
    const response = {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      category: course.category,
      level: course.level,
      language: course.language,
      price: course.price,
      originalPrice: course.originalPrice,
      duration: course.duration,
      thumbnailUrl: course.thumbnailUrl,
      isPublished: course.isPublished,
      bestseller: course.bestseller,
      whatYoullLearn: course.whatYoullLearn,
      requirements: course.requirements,
      createdAt: course.createdAt,
      instructor: {
        id: course.instructorId,
        firstName: course.instructorFirstName,
        lastName: course.instructorLastName,
        headline: course.instructorProfileHeadline,
        bio: course.instructorProfileBio,
      },
      rating: Number(course.avgRating ?? 0),
      students: Number(course.studentCount ?? 0),
      reviews,
      curriculum: modulesData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course." },
      { status: 500 }
    );
  }
}
