import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "../../../../lib/db";
import { subscriptions } from "../../../../lib/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.userType !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const [existingSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existingSubscription) {
      await db
        .update(subscriptions)
        .set({
          planId: "free",
          amountPaid: "0.00",
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, userId));
    } else {
      await db.insert(subscriptions).values({
        id: nanoid(),
        userId,
        planId: "free",
        amountPaid: "0.00",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error creating free subscription:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}