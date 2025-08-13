"use server";

import { put } from "@vercel/blob";
import { db } from "../../lib/db";
import { courses } from "../../lib/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export interface ActionState {
  success: boolean;
  error?: string;
  message?: string;
  courseId?: number;
}

/**
 * Adds a new course to the database.
 * @param _state Not used, but required by useActionState signature.
 * @param formData FormData from the form submission.
 * @returns ActionState indicating success or failure.
 */
export async function addCourse(
  _state: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.userType !== "instructor") {
    return { success: false, error: "Unauthorized: Only instructors can add courses." };
  }

  const instructorId = session.user.id as string;

  // Extract fields from formData
  const courseTitle = formData.get("title") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;
  const price = formData.get("price") ? Number.parseFloat(formData.get("price") as string) : undefined;
  const originalPrice = formData.get("originalPrice")
    ? Number.parseFloat(formData.get("originalPrice") as string)
    : undefined;
  const duration = formData.get("duration") as string;
  const numLessons = formData.get("numLessons") ? Number.parseInt(formData.get("numLessons") as string) : undefined;
  const detailedDescription = formData.get("detailedDescription") as string;
  const curriculum = formData.get("curriculum") as string;
  const whatYoullLearn = formData.get("whatYoullLearn") as string;
  const courseImageFile = formData.get("courseImageFile") as File | null;

  if (!courseTitle || !category || !level || price === undefined || !duration || numLessons === undefined) {
    return { success: false, error: "Missing required course fields." };
  }

  let courseImageUrl: string | undefined;

  if (courseImageFile && courseImageFile.size > 0) {
    try {
      const blob = await put(courseImageFile.name, courseImageFile, {
        access: "public",
        addRandomSuffix: true,
      });
      courseImageUrl = blob.url;
    } catch (error) {
      console.error("Error uploading course image:", error);
      return { success: false, error: "Failed to upload course image." };
    }
  }

  try {
    let parsedCurriculum: unknown = null;
    let parsedWhatYoullLearn: unknown = null;

    if (curriculum) {
      try {
        parsedCurriculum = JSON.parse(curriculum);
      } catch (error) {
        console.error("Error parsing curriculum JSON:", error);
        return { success: false, error: "Invalid JSON format for curriculum." };
      }
    }

    if (whatYoullLearn) {
      try {
        parsedWhatYoullLearn = JSON.parse(whatYoullLearn);
      } catch (error) {
        console.error("Error parsing whatYoullLearn JSON:", error);
        return { success: false, error: "Invalid JSON format for whatYoullLearn." };
      }
    }

    // Insert course and get new course ID using $returningId() (MySQL)
    const newIds = await db
      .insert(courses)
      .values({
        title: courseTitle,
        instructorId,
        shortDescription,
        category,
        level,
        courseImage: courseImageUrl,
        price: Math.round(price * 100), // Store price in cents
        originalPrice: originalPrice ? Math.round(originalPrice * 100) : undefined,
        duration,
        numLessons,
        detailedDescription,
        curriculum: parsedCurriculum,
        whatYoullLearn: parsedWhatYoullLearn,
      })
      .$returningId();

    const newCourseId = typeof newIds[0] === "number" ? newIds[0] : newIds[0].id;

    revalidatePath("/dashboard/instructor");

    return {
      success: true,
      message: "Course created successfully!",
      courseId: newCourseId,
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Failed to create course." };
  }
}
