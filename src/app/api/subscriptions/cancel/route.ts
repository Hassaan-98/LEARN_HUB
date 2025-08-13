import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq, desc } from "drizzle-orm";
import { db } from "../../../../lib/db";
import { subscriptions } from "../../../../lib/schema";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id || session.user.userType !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get the user's active subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    if (subscription.status !== "active") {
      return NextResponse.json({ error: "Subscription is not active" }, { status: 400 });
    }

    // Update subscription status in database
    await db
      .update(subscriptions)
      .set({
        status: "canceled",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));

    return NextResponse.json({
      success: true,
      message: "Subscription canceled successfully"
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}