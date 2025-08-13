import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../lib/db";
import { enrollments, studentPaymentDetails, instructorPaymentDetails, courses } from "../../../../lib/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { nanoid } from "nanoid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const courseId = intent.metadata.courseId;
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId || !courseId) {
      return NextResponse.json({ error: "Invalid user or course ID" }, { status: 400 });
    }

    try {
      await db.transaction(async (tx) => {
        // Fetch course to get instructor ID, price, and current student count
        const [course] = await tx.select().from(courses).where(eq(courses.id, courseId)).limit(1);
        if (!course) {
          throw new Error("Course not found");
        }

        // Increment course enrollment count
        await tx
          .update(courses)
          .set({ students: (course.students || 0) + 1, updatedAt: new Date() })
          .where(eq(courses.id, courseId));

        // Create enrollment
        await tx.insert(enrollments).values({
          id: nanoid(),
          userId,
          courseId,
          amountPaid: (Number(intent.amount) / 100).toFixed(2), // Convert cents to dollars
          enrollmentDate: new Date(),
        });

        // Update student payment details
        const [studentPayment] = await tx
          .select()
          .from(studentPaymentDetails)
          .where(eq(studentPaymentDetails.userId, userId))
          .limit(1);

        const studentCourseIds = studentPayment?.courseIds
          ? [...(studentPayment.courseIds as string[]), courseId]
          : [courseId];

        const paymentMethodDetails = intent.payment_method
          ? { id: intent.payment_method, type: intent.payment_method_types[0] }
          : {};

        if (studentPayment) {
          await tx
            .update(studentPaymentDetails)
            .set({
              courseIds: studentCourseIds,
              paymentMethod: paymentMethodDetails,
              isVerified: true,
              updatedAt: new Date(),
            })
            .where(eq(studentPaymentDetails.userId, userId));
        } else {
          await tx.insert(studentPaymentDetails).values({
            id: nanoid(),
            userId,
            stripeCustomerId: intent.customer as string || `cus_${nanoid()}`,
            paymentMethod: paymentMethodDetails,
            isVerified: true,
            courseIds: [courseId],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // Update instructor payment details
        const [instructorPayment] = await tx
          .select()
          .from(instructorPaymentDetails)
          .where(eq(instructorPaymentDetails.userId, course.instructorId))
          .limit(1);

        const instructorShare = Number(intent.amount) * 0.9 / 100; // 90% of amount in dollars
        const instructorCourseIds = instructorPayment?.courseIds
          ? [...(instructorPayment.courseIds as string[]), courseId]
          : [courseId];

        if (instructorPayment) {
          const currentEarnings = Number(instructorPayment.totalEarnings) || 0;
          const newTotalEarnings = currentEarnings + instructorShare;

          await tx
            .update(instructorPaymentDetails)
            .set({
              courseIds: instructorCourseIds,
              totalEarnings: newTotalEarnings.toFixed(2),
              updatedAt: new Date(),
            })
            .where(eq(instructorPaymentDetails.userId, course.instructorId));
        } else {
          await tx.insert(instructorPaymentDetails).values({
            id: nanoid(),
            userId: course.instructorId,
            stripeAccountId: `acct_${nanoid()}`, // Placeholder; should be set up properly
            bankAccountDetails: {},
            isVerified: false,
            courseIds: [courseId],
            totalEarnings: instructorShare.toFixed(2),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });

      return NextResponse.json({ received: true });
    } catch (error: any) {
      console.error("Error handling payment success:", error);
      return NextResponse.json({ error: "Failed to process enrollment" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}