import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq, desc } from "drizzle-orm";
import { db } from "../../../lib/db";
import { subscriptions } from "../../../lib/schema";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id || session.user.userType !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (!subscription.length) {
      return NextResponse.json(
        { status: "inactive", planId: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: subscription[0].status,
        planId: subscription[0].planId,
        createdAt: subscription[0].createdAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
