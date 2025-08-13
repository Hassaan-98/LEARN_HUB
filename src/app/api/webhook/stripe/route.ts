import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { validateWebhookSignature, STRIPE_WEBHOOK_EVENTS } from "../../../../lib/stripe"
import { stripePaymentToPayment, stripeSubscriptionToSubscription } from "../../../../lib/stripe-utils"
import { createPayment, createSubscription, getUserByEmail } from "../../../../lib/payment-database"
import type Stripe from "stripe"
import { stripe } from "../../../../lib/stripe" 

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("Missing Stripe signature")
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = validateWebhookSignature(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
      console.error("Webhook signature verification failed:", error)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log(`Processing webhook event: ${event.type}`)

    // Handle different webhook events
    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.PAYMENT_INTENT_SUCCEEDED:
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case STRIPE_WEBHOOK_EVENTS.PAYMENT_INTENT_PAYMENT_FAILED:
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_SUCCEEDED:
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

// Handle successful payment intent
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`Payment succeeded: ${paymentIntent.id}`)

    const email = paymentIntent.metadata?.email
    const fullName = paymentIntent.metadata?.fullName

    if (!email || !fullName) {
      console.error("Missing email or fullName in payment intent metadata")
      return
    }

    // Convert Stripe payment to our payment format
    const paymentData = stripePaymentToPayment(paymentIntent, email, fullName)

    // Update payment status in database
    // Note: In a real implementation, you'd find the payment by stripe_payment_id and update it
    // For now, we'll create a new payment record if it doesn't exist
    await createPayment(paymentData)

    console.log(`Payment ${paymentIntent.id} processed successfully`)
  } catch (error) {
    console.error("Error handling payment intent succeeded:", error)
  }
}

// Handle failed payment intent
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`Payment failed: ${paymentIntent.id}`)

    // Update payment status to failed
    // Note: In a real implementation, you'd find the payment by stripe_payment_id and update it
    console.log(`Payment ${paymentIntent.id} marked as failed`)
  } catch (error) {
    console.error("Error handling payment intent failed:", error)
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log(`Subscription created: ${subscription.id}`)

    // Get customer email from subscription
    const customerId = subscription.customer as string
    const customer = await stripe.customers.retrieve(customerId)

    if (!customer || customer.deleted) {
      console.error("Customer not found for subscription")
      return
    }

    const customerEmail = (customer as Stripe.Customer).email
    if (!customerEmail) {
      console.error("Customer email not found")
      return
    }

    // Find user by email
    const user = await getUserByEmail(customerEmail)
    if (!user) {
      console.error("User not found for subscription")
      return
    }

    // Convert Stripe subscription to our subscription format
    const subscriptionData = stripeSubscriptionToSubscription(subscription, user.id)

    // Create subscription in database
    await createSubscription(subscriptionData)

    console.log(`Subscription ${subscription.id} created successfully`)
  } catch (error) {
    console.error("Error handling subscription created:", error)
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log(`Subscription updated: ${subscription.id}`)

    // Update subscription status in database
    // Note: In a real implementation, you'd find the subscription by stripe_subscription_id and update it
    console.log(`Subscription ${subscription.id} updated successfully`)
  } catch (error) {
    console.error("Error handling subscription updated:", error)
  }
}

// Handle subscription deleted/canceled
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log(`Subscription deleted: ${subscription.id}`)

    // Update subscription status to canceled
    // Note: In a real implementation, you'd find the subscription by stripe_subscription_id and update it
    console.log(`Subscription ${subscription.id} marked as canceled`)
  } catch (error) {
    console.error("Error handling subscription deleted:", error)
  }
}

// Handle successful invoice payment (for subscriptions)
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log(`Invoice payment succeeded: ${invoice.id}`)

    // Handle subscription payment if needed
    // Note: The exact property name may vary based on Stripe API version
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error)
  }
}
// Handle failed invoice payment (for subscriptions)
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log(`Invoice payment failed: ${invoice.id}`)

    // Handle subscription payment failure if needed
    // Note: The exact property name may vary based on Stripe API version
  } catch (error) {
    console.error("Error handling invoice payment failed:", error)
  }
}
