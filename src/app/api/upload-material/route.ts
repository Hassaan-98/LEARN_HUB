import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { courseMaterials } from "../../../lib/schema";
import { put } from "@vercel/blob";
import Mux from "@mux/mux-node";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const Video = mux.video;

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.userType !== "instructor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const filename = formData.get("filename") as string | null;
  const courseId = formData.get("courseId") as string | null;
  const moduleTitle = formData.get("moduleTitle") as string | null;
  const userId = session.user.id;

  if (!file || !filename || !courseId || !userId) {
    return NextResponse.json(
      { error: "File, filename, courseId, and userId are required." },
      { status: 400 }
    );
  }

  try {
    // Convert File to Buffer for Vercel Blob upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `${Date.now()}-${filename}`;
    const safeModuleTitle = moduleTitle
      ? moduleTitle.replace(/[^a-zA-Z0-9-_]/g, "_")
      : "no-module";
    const filePath = `course-materials/${userId}/${courseId}/${safeModuleTitle}/${uniqueFilename}`;
    let playbackId: string | null = null;

    // Upload file buffer to Vercel Blob
    const blob = await put(filePath, fileBuffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || "application/octet-stream",
    });

    // If file is a video, upload to Mux
    if (file.type.startsWith("video/")) {
      const asset = await Video.assets.create({
        inputs: [{ url: blob.url }],
        playback_policy: ["public"],
      });
      playbackId = asset.playback_ids?.[0]?.id || null;
    }

    // Save metadata to courseMaterials
    await db.insert(courseMaterials).values({
      id: crypto.randomUUID(),
      courseId: courseId,
      instructorId: userId,
      moduleTitle: moduleTitle || null,
      filename: filename,
      fileUrl: blob.url,
      fileType: file.type || "application/octet-stream",
      fileSize: Number(file.size),
      playbackId,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "File uploaded and metadata saved successfully!",
      url: blob.url,
      playbackId,
    });
  } catch (error) {
    console.error("Error uploading file or saving metadata:", error);
    return NextResponse.json(
      { error: "Failed to upload file or save metadata." },
      { status: 500 }
    );
  }
}
