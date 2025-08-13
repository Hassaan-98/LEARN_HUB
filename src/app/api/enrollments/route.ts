import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { enrollments } from "../../../lib/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("Enrollment check: No user session found");
      return NextResponse.json({ hasEnrollment: false }, { status: 401 });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const courseId = url.searchParams.get("courseId");

    if (!userId || !courseId) {
      console.log("Enrollment check: Missing userId or courseId", { userId, courseId });
      return NextResponse.json({ error: "Missing userId or courseId" }, { status: 400 });
    }

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

    console.log("Enrollment check result", { userId, courseId, hasEnrollment: !!enrollment });

    return NextResponse.json({ hasEnrollment: !!enrollment });
  } catch (error: any) {
    console.error("Error checking enrollment:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: "Failed to check enrollment" }, { status: 500 });
  }
}