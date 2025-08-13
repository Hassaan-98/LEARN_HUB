import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { courseReviews, enrollments } from "../../../../../lib/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { nanoid } from "nanoid";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id || session.user.userType !== "student") {
    return NextResponse.json({ error: "Only students can submit reviews" }, { status: 403 });
  }

  const userId = session.user.id;
  const courseId = params.courseId;
  const { rating, comment } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  try {


    await db.insert(courseReviews).values({
      id: nanoid(),
      userId,
      courseId,
      rating,
      comment: comment || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}