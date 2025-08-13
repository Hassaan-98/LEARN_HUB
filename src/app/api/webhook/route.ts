import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../lib/db";
import { enrollments, studentPaymentDetails, instructorPaymentDetails, courses, subscriptions } from "../../../lib/schema";
import { eq, inArray, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { buffer } from "node:stream/consumers";

const stripe = new Stripe("sk_test_51Rm2rz1CoNhvvcj3yfyZqYvD65wYHRhlVbEJ8qEVdFXrkcM4GcLSfH730ntlEUqAZggYlXZRyACp85LUDCfkPfDP00ox9RNiGO", {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = "whsec_0f97599198a21a71b7c7cf23f626d1688c46e86c5095ef5340777a188726d2c6";

  if (!sig || !webhookSecret) {
    console.error("Missing stripe-signature or webhook secret", { sig, webhookSecret });
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log("Webhook event received", { eventType: event.type, eventId: event.id });
  } catch (err: any) {
    console.error("Webhook signature verification failed:", {
      message: err.message,
      stack: err.stack,
    });
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type !== "payment_intent.succeeded") {
    console.log("Skipping non-relevant event", { eventType: event.type });
    return NextResponse.json({ received: true });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const courseId = intent.metadata?.courseId as string | undefined;
  const planId = intent.metadata?.planId as string | undefined;
  const userId = intent.metadata?.userId as string | undefined;

  if (!userId) {
    console.error("Webhook missing userId in metadata", { metadata: intent.metadata });
    return NextResponse.json({ error: "Missing userId in metadata" }, { status: 400 });
  }

  try {
    await db.transaction(async (tx) => {
      const amountPaid = Number(intent.amount) / 100;

      // Handle course purchase
      if (courseId) {
        const [course] = await tx
          .select()
          .from(courses)
          .where(eq(courses.id, courseId))
          .limit(1);

        if (!course) {
          console.error("Course not found in webhook", { courseId });
          throw new Error("Course not found");
        }

        // Check if user is already enrolled in the course
        const [existingEnrollment] = await tx
          .select()
          .from(enrollments)
          .where(
            and(
              eq(enrollments.user_id, userId),
              eq(enrollments.course_id, courseId)
            )
          )
          .limit(1);

        if (!existingEnrollment) {
          await tx.insert(enrollments).values({
            id: nanoid(),
            user_id: userId,
            course_id: courseId,
            amountPaid: amountPaid.toString(),
            enrollmentDate: new Date(),
            progress: 0,
            certificateIssued: false,
            completedAt: null,
          });
        }

        const [studentPayment] = await tx
          .select()
          .from(studentPaymentDetails)
          .where(eq(studentPaymentDetails.userId, userId))
          .limit(1);

        const updatedStudentCourseIds = studentPayment?.courseIds
          ? [...new Set([...(studentPayment.courseIds as string[]), courseId])]
          : [courseId];

        const paymentMethodDetails = intent.payment_method
          ? { id: intent.payment_method as string, type: intent.payment_method_types?.[0] || "unknown" }
          : {};

        if (studentPayment) {
          await tx
            .update(studentPaymentDetails)
            .set({
              courseIds: updatedStudentCourseIds,
              paymentMethod: paymentMethodDetails,
              isVerified: true,
              updatedAt: new Date(),
            })
            .where(eq(studentPaymentDetails.userId, userId));
        } else {
          await tx.insert(studentPaymentDetails).values({
            id: nanoid(),
            userId,
            stripeCustomerId: (intent.customer as string) || `cus_${nanoid()}`,
            paymentMethod: paymentMethodDetails,
            isVerified: true,
            courseIds: [courseId],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        const [instructorPayment] = await tx
          .select()
          .from(instructorPaymentDetails)
          .where(eq(instructorPaymentDetails.userId, course.instructorId))
          .limit(1);

        const instructorShare = amountPaid * 0.9;
        const updatedInstructorCourseIds = instructorPayment?.courseIds
          ? [...new Set([...(instructorPayment.courseIds as string[]), courseId])]
          : [courseId];

        const updatedBankAccountDetails = instructorPayment?.bankAccountDetails
          ? {
              ...instructorPayment.bankAccountDetails,
              earnings: ((instructorPayment.bankAccountDetails as any)?.earnings || 0) + instructorShare,
            }
          : { earnings: instructorShare };

        if (instructorPayment) {
          await tx
            .update(instructorPaymentDetails)
            .set({
              courseIds: updatedInstructorCourseIds,
              bankAccountDetails: updatedBankAccountDetails,
              updatedAt: new Date(),
            })
            .where(eq(instructorPaymentDetails.userId, course.instructorId));
        } else {
          await tx.insert(instructorPaymentDetails).values({
            id: nanoid(),
            userId: course.instructorId,
            stripeAccountId: `acct_${nanoid()}`,
            bankAccountDetails: updatedBankAccountDetails,
            isVerified: false,
            courseIds: [courseId],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        console.log("Course purchase processed successfully", {
          userId,
          courseId,
          amountPaid,
          instructorShare,
        });
      }

      // Handle plan subscription
      if (planId) {
        const [existingSubscription] = await tx
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, userId))
          .orderBy(subscriptions.createdAt)
          .limit(1);

        if (existingSubscription) {
          await tx
            .update(subscriptions)
            .set({
              planId,
              amountPaid: amountPaid.toFixed(2),
              status: "active",
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.userId, userId));
        } else {
          await tx.insert(subscriptions).values({
            id: nanoid(),
            userId,
            planId,
            amountPaid: amountPaid.toFixed(2),
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // Enroll user in all courses for "pro" or "team" plans
        if (["pro", "team"].includes(planId)) {
          const allCourses = await tx
            .select({ id: courses.id })
            .from(courses);

          const existingEnrollments = await tx
            .select({ course_id: enrollments.course_id })
            .from(enrollments)
            .where(eq(enrollments.user_id, userId));

          const enrolledCourseIds = new Set(existingEnrollments.map((e) => e.course_id));
          const coursesToEnroll = allCourses.filter((course) => !enrolledCourseIds.has(course.id));

          if (coursesToEnroll.length > 0) {
            const enrollmentValues = coursesToEnroll.map((course) => ({
              id: nanoid(),
              user_id: userId,
              course_id: course.id,
              amountPaid: "0", // No additional cost for subscription-based enrollment
              enrollmentDate: new Date(),
              progress: 0,
              certificateIssued: false,
              completedAt: null,
            }));

            await tx.insert(enrollments).values(enrollmentValues);

            // Update studentPaymentDetails with all course IDs
            const [studentPayment] = await tx
              .select()
              .from(studentPaymentDetails)
              .where(eq(studentPaymentDetails.userId, userId))
              .limit(1);

            const updatedStudentCourseIds = studentPayment?.courseIds
              ? [...new Set([...(studentPayment.courseIds as string[]), ...coursesToEnroll.map((c) => c.id)])]
              : coursesToEnroll.map((c) => c.id);

            if (studentPayment) {
              await tx
                .update(studentPaymentDetails)
                .set({
                  courseIds: updatedStudentCourseIds,
                  updatedAt: new Date(),
                })
                .where(eq(studentPaymentDetails.userId, userId));
            } else {
              await tx.insert(studentPaymentDetails).values({
                id: nanoid(),
                userId,
                stripeCustomerId: (intent.customer as string) || `cus_${nanoid()}`,
                paymentMethod: intent.payment_method
                  ? { id: intent.payment_method as string, type: intent.payment_method_types?.[0] || "unknown" }
                  : {},
                isVerified: true,
                courseIds: updatedStudentCourseIds,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          }

          console.log("User enrolled in all courses for plan", {
            userId,
            planId,
            enrolledCourses: coursesToEnroll.length,
          });
        }

        console.log("Plan subscription processed successfully", {
          userId,
          planId,
          amountPaid,
        });
      }
    });

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error handling payment_intent.succeeded webhook:", {
      message: error.message,
      stack: error.stack,
      courseId,
      planId,
      userId,
    });
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}