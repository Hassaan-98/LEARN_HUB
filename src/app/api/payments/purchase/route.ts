import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../lib/db";
import { courses } from "../../../../lib/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.userType !== "student") {
    console.error("Unauthorized access attempt", { session });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, courseId } = await req.json();
    if (!courseId || !amount || amount <= 0) {
      console.error("Invalid request payload", { amount, courseId });
      return NextResponse.json(
        { error: "Invalid course ID or amount" },
        { status: 400 }
      );
    }

    // Fetch course to verify existence and price
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!course) {
      console.error("Course not found", { courseId });
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const coursePriceInCents = Number(course.price) * 100;
    if (Math.round(amount) !== Math.round(coursePriceInCents)) {
      console.error("Amount mismatch", { amount, coursePriceInCents });
      return NextResponse.json(
        { error: "Amount does not match course price" },
        { status: 400 }
      );
    }

    // Create Stripe payment intent with userId and courseId in metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "usd",
      metadata: { courseId, userId: session.user.id },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log("Payment intent created", {
      paymentIntentId: paymentIntent.id,
      metadata: paymentIntent.metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error.message, {
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}