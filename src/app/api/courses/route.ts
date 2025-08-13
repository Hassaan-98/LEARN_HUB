// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import {
  courses,
  modules,
  lessons,
  courseMaterials,
} from "../../../lib/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import Mux from "@mux/mux-node";
import { randomUUID } from "crypto";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
const { video } = mux;

function base64ToBuffer(base64String: string) {
  const base64Data = base64String.replace(/^data:.*;base64,/, "");
  return Buffer.from(base64Data, "base64");
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.userType !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const instructorId = session.user.id;
    if (!instructorId) {
      return NextResponse.json(
        { error: "Unauthorized - missing user id" },
        { status: 401 }
      );
    }

    const courseData: any = await request.json();

    if (!courseData?.title) {
      return NextResponse.json(
        { error: "Missing course title" },
        { status: 400 }
      );
    }

    // Upload thumbnail BEFORE transaction
    let thumbnailUrl: string | null = null;
    if (
      courseData.thumbnail &&
      typeof courseData.thumbnail.base64 === "string" &&
      courseData.thumbnail.name &&
      courseData.thumbnail.type
    ) {
      const buffer = base64ToBuffer(courseData.thumbnail.base64);
      const uniqueFilename = `${Date.now()}-${courseData.thumbnail.name}`;
      const filePath = `course-thumbnails/${instructorId}/${uniqueFilename}`;
      const blob = await put(filePath, buffer, {
        access: "public",
        addRandomSuffix: false,
        contentType: courseData.thumbnail.type || "image/jpeg",
      });
      thumbnailUrl = blob.url;
    }

    const result = await db.transaction(async (tx) => {
      const courseId = randomUUID();

      // Insert course with thumbnailUrl returned from Vercel Blob
      await tx.insert(courses).values({
        id: courseId,
        instructorId,
        title: courseData.title ?? "",
        subtitle: courseData.subtitle ?? null,
        description: courseData.description ?? null,
        category: courseData.category ?? null,
        level: courseData.level ?? null,
        language: courseData.language ?? null,
        price: courseData.price ? Number(courseData.price) : 0,
        originalPrice: courseData.originalPrice
          ? Number(courseData.originalPrice)
          : null,
        duration: courseData.duration ?? null,
        status: "draft",
        isPublished: false,
        whatYoullLearn: courseData.whatYoullLearn ?? [],
        requirements: courseData.requirements ?? [],
        thumbnailUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).execute();

      if (Array.isArray(courseData.modules)) {
        for (const [moduleIndex, module] of courseData.modules.entries()) {
          const moduleId = randomUUID();

          await tx
            .insert(modules)
            .values({
              id: moduleId,
              courseId,
              title: module.title ?? "",
              description: module.description ?? "",
              orderIndex: moduleIndex,
              createdAt: new Date(),
            })
            .execute();

          if (Array.isArray(module.lessons)) {
            for (const [lessonIndex, lesson] of module.lessons.entries()) {
              const lessonId = randomUUID();
              let videoUrl: string | null = null;
              let playbackId: string | null = null;

              // Upload video to Mux ONLY (no blob upload)
              if (
                lesson.videoFile &&
                typeof lesson.videoFile.base64 === "string" &&
                lesson.videoFile.name &&
                lesson.videoFile.type
              ) {
                const buffer = base64ToBuffer(lesson.videoFile.base64);

                // Upload video buffer to Vercel Blob temporarily (required because Mux needs a public URL)
                // You can optimize this by uploading direct to Mux using streaming or from your frontend.
                const uniqueFilename = `${Date.now()}-${lesson.videoFile.name}`;
                const tempBlobPath = `temp-videos/${instructorId}/${courseId}/${moduleId}/${uniqueFilename}`;
                const blob = await put(tempBlobPath, buffer, {
                  access: "public",
                  addRandomSuffix: false,
                  contentType: lesson.videoFile.type || "video/mp4",
                });

                // Create Mux asset from the public blob URL
                try {
                  const asset = await video.assets.create({
                    inputs: [{ url: blob.url }],
                    playback_policy: ["public"],
                  });
                  playbackId = asset.playback_ids?.[0]?.id ?? null;

                  // Store Mux playback URL, NOT blob URL for streaming
                  videoUrl = playbackId
                    ? `https://stream.mux.com/${playbackId}.m3u8`
                    : blob.url;
                } catch (muxErr) {
                  console.error("Mux upload error:", muxErr);
                  videoUrl = blob.url; // fallback to blob url if Mux fails
                }
              }

              await tx
                .insert(lessons)
                .values({
                  id: lessonId,
                  moduleId,
                  title: lesson.title ?? "",
                  description: lesson.description ?? "",
                  duration: lesson.duration ?? "",
                  videoUrl,
                  orderIndex: lessonIndex,
                  isPreview: false,
                  createdAt: new Date(),
                })
                .execute();

              // Upload lesson resources to Vercel Blob
              if (Array.isArray(lesson.resources)) {
                for (const resource of lesson.resources) {
                  if (
                    typeof resource.base64 === "string" &&
                    resource.name &&
                    resource.type
                  ) {
                    const buffer = base64ToBuffer(resource.base64);
                    const uniqueFilename = `${Date.now()}-${resource.name}`;
                    const filePath = `course-resources/${instructorId}/${courseId}/${moduleId}/${uniqueFilename}`;
                    const blob = await put(filePath, buffer, {
                      access: "public",
                      addRandomSuffix: false,
                      contentType: resource.type || "application/octet-stream",
                    });

                    await tx
                      .insert(courseMaterials)
                      .values({
                        id: randomUUID(),
                        courseId,
                        instructorId,
                        lessonId,
                        moduleTitle: module.title ?? "",
                        filename: resource.name ?? uniqueFilename,
                        fileUrl: blob.url,
                        fileType: resource.type || "application/octet-stream",
                        fileSize: Number(resource.size ?? 0),
                        playbackId,
                        createdAt: new Date(),
                      })
                      .execute();
                  }
                }
              }
            }
          }
        }
      }

      return {
        id: courseId,
        title: courseData.title ?? "",
        thumbnailUrl,
      };
    });

    return NextResponse.json(
      { message: "Course created successfully", course: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Failed to create course." }, { status: 500 });
  }
}

// src/app/api/courses/route.ts

export async function GET(request: Request) {
  try {
    // Fetch courses from database
    const allCourses = await db.select().from(courses).execute();

    return NextResponse.json(allCourses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}


