import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { enrollments, subscriptions } from "../../../../../lib/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("Access check: No user session found");
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const courseId = params.id; // Extract courseId from dynamic route params
    const userId = session.user.id;

    if (!courseId) {
      console.log("Access check: Missing courseId", { userId, courseId });
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    console.log("Checking access", { userId, courseId });

    // Check if user has an active subscription (pro or team plan)
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    const hasValidSubscription = subscription && ["pro", "team"].includes(subscription.planId);

    // Check if user is enrolled in the course
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

    const hasAccess = hasValidSubscription || !!enrollment;

    if (!hasAccess) {
      console.log("Access denied: No subscription or enrollment found", { userId, courseId });
    }

    return NextResponse.json({ hasAccess });
  } catch (error: any) {
    console.error("Error checking access:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: "Failed to check access" }, { status: 500 });
  }
}