import {
  stripe,
  type StripeCustomerData,
  type StripePaymentIntentData,
  type StripeSubscriptionData,
  getPlanDetails,
  type Stripe,
} from "./stripe"
import type { Payment, Subscription } from "./payment-database"
interface PaymentIntentOptions {
  amount: number;
  currency: string;
  customer: string;
  metadata?: Record<string, string>; // ✅ allows any key/value
}
export interface Subscription {
  id: number;
  user_id: number;
  plan_type: "free" | "basic" | "pro" | "enterprise";
  status: "active" | "canceled" | "past_due" | "unpaid" | "incomplete" | "trialing";
  amount: number;
  currency: string;
  interval_type: "day" | "week" | "month" | "year";
  interval_count: number;

  // Add these fields
  current_period_start: string; // ISO date
  current_period_end: string;   // ISO date
  trial_start?: string;
  trial_end?: string;
  canceled_at?: string;

  metadata?: Record<string, string>;

  created_at: string;
  updated_at: string;
}


export async function createStripeCustomer(customerData: StripeCustomerData): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email: customerData.email,
      name: customerData.name,
      metadata: customerData.metadata || {},
    })
    return customer
  } catch (error) {
    console.error("Error creating Stripe customer:", error)
    throw new Error("Failed to create customer")
  }
}

export async function getStripeCustomer(customerId: string): Promise<Stripe.Customer | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    return customer as Stripe.Customer
  } catch (error) {
    console.error("Error retrieving Stripe customer:", error)
    return null
  }
}

export async function findCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
  try {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })
    return customers.data.length > 0 ? customers.data[0] : null
  } catch (error) {
    console.error("Error finding customer by email:", error)
    return null
  }
}

// Payment Intent utilities


export async function createPaymentIntent(
  paymentData: StripePaymentIntentData
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentData.amount,
      currency: paymentData.currency,
      customer: paymentData.customer,
      metadata: paymentData.metadata || {},
      automatic_payment_methods:
        paymentData.automatic_payment_methods || { enabled: true },
    });
    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
}

export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error("Error retrieving payment intent:", error)
    return null
  }
}

// Subscription utilities
export async function createSubscription(subscriptionData: StripeSubscriptionData): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: subscriptionData.customer,
      items: subscriptionData.items,
      payment_behavior: subscriptionData.payment_behavior || "default_incomplete",
      payment_settings: subscriptionData.payment_settings || {
        save_default_payment_method: "on_subscription",
      },
      expand: subscriptionData.expand || ["latest_invoice.payment_intent"],
      metadata: subscriptionData.metadata || {},
    })
    return subscription
  } catch (error) {
    console.error("Error creating subscription:", error)
    throw new Error("Failed to create subscription")
  }
}

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error("Error retrieving subscription:", error)
    return null
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error("Error canceling subscription:", error)
    throw new Error("Failed to cancel subscription")
  }
}

export async function updateSubscription(
  subscriptionId: string,
  updateData: Partial<Stripe.SubscriptionUpdateParams>,
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, updateData)
    return subscription
  } catch (error) {
    console.error("Error updating subscription:", error)
    throw new Error("Failed to update subscription")
  }
}

// Utility to convert Stripe payment intent to our Payment interface
export function stripePaymentToPayment(
  paymentIntent: Stripe.PaymentIntent,
  userEmail: string,
  userName: string,
): Omit<Payment, "id" | "created_at" | "updated_at"> {
  const paymentMethod = paymentIntent.payment_method as Stripe.PaymentMethod | null
  const card = paymentMethod?.card

  return {
    stripe_payment_id: paymentIntent.id,
    email: userEmail,
    full_name: userName,
    plan_type: (paymentIntent.metadata?.plan as Payment["plan_type"]) || "free",
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: mapStripeStatusToPaymentStatus(paymentIntent.status),
    billing_address: paymentMethod?.billing_details?.address?.line1 || undefined,
    billing_city: paymentMethod?.billing_details?.address?.city || undefined,
    billing_postal_code: paymentMethod?.billing_details?.address?.postal_code || undefined,
    billing_country: paymentMethod?.billing_details?.address?.country || undefined,
    card_last4: card?.last4 || undefined,
    card_brand: card?.brand || undefined,
    card_exp_month: card?.exp_month || undefined,
    card_exp_year: card?.exp_year || undefined,
    stripe_created_at: new Date(paymentIntent.created * 1000).toISOString(),
    metadata: paymentIntent.metadata,
  }
}

// Utility to convert Stripe subscription to our Subscription interface
export function stripeSubscriptionToSubscription(
  subscription: Stripe.Subscription,
  userId: number,
): Omit<Subscription, "id" | "created_at" | "updated_at"> {
  const priceId = subscription.items.data[0]?.price.id
  const planType =
    (Object.entries(getPlanDetails("pro")).find(
      ([_, plan]) => plan.stripe_price_id === priceId,
    )?.[0] as Payment["plan_type"]) || "free"

 return {
  stripe_subscription_id: subscription.id,
  user_id: userId,
  plan_type: planType,
  status: mapStripeSubscriptionStatusToSubscriptionStatus(subscription.status),
  trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : undefined,
  trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : undefined,
  canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : undefined,
  amount: subscription.items.data[0]?.price.unit_amount || 0,
  currency: subscription.items.data[0]?.price.currency || "usd",
  interval_type: (subscription.items.data[0]?.price.recurring?.interval as Subscription["interval_type"]) || "month",
  interval_count: subscription.items.data[0]?.price.recurring?.interval_count || 1,
  metadata: subscription.metadata,
};
}

// Helper functions to map Stripe statuses to our database statuses
function mapStripeStatusToPaymentStatus(stripeStatus: Stripe.PaymentIntent.Status): Payment["status"] {
  switch (stripeStatus) {
    case "succeeded":
      return "succeeded"
    case "processing":
    case "requires_payment_method":
    case "requires_confirmation":
    case "requires_action":
      return "pending"
    case "canceled":
      return "canceled"
    default:
      return "failed"
  }
}

function mapStripeSubscriptionStatusToSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status,
): Subscription["status"] {
  switch (stripeStatus) {
    case "active":
      return "active"
    case "canceled":
      return "canceled"
    case "past_due":
      return "past_due"
    case "unpaid":
      return "unpaid"
    case "incomplete":
    case "incomplete_expired":
      return "incomplete"
    case "trialing":
      return "trialing"
    default:
      return "canceled"
  }
}
