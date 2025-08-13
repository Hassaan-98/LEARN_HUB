import Stripe from "stripe"

export { Stripe }

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
  typescript: true,
})


// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: "usd",
  payment_method_types: ["card"],
  automatic_payment_methods: {
    enabled: true,
  },
} as const

// Plan configurations with Stripe price IDs
export const PRICING_PLANS = {
  free: {
    name: "Free",
    price: 0,
    stripe_price_id: null,
    features: ["Basic features", "Limited usage"],
  },
  pro: {
    name: "Pro",
    price: 2900, // $29.00 in cents
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID,
    features: ["All basic features", "Advanced analytics", "Priority support"],
  },
  team: {
    name: "Team",
    price: 9900, // $99.00 in cents
    stripe_price_id: process.env.STRIPE_TEAM_PRICE_ID,
    features: ["All pro features", "Team collaboration", "Custom integrations"],
  },
  enterprise: {
    name: "Enterprise",
    price: 29900, // $299.00 in cents
    stripe_price_id: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: ["All team features", "Dedicated support", "Custom solutions"],
  },
} as const

export type PlanType = keyof typeof PRICING_PLANS

// Stripe webhook event types we handle
export const STRIPE_WEBHOOK_EVENTS = {
  PAYMENT_INTENT_SUCCEEDED: "payment_intent.succeeded",
  PAYMENT_INTENT_PAYMENT_FAILED: "payment_intent.payment_failed",
  CUSTOMER_SUBSCRIPTION_CREATED: "customer.subscription.created",
  CUSTOMER_SUBSCRIPTION_UPDATED: "customer.subscription.updated",
  CUSTOMER_SUBSCRIPTION_DELETED: "customer.subscription.deleted",
  INVOICE_PAYMENT_SUCCEEDED: "invoice.payment_succeeded",
  INVOICE_PAYMENT_FAILED: "invoice.payment_failed",
} as const

// Extended Stripe types for our application
export interface StripeCustomerData {
  email: string
  name: string
  metadata?: {
    userId?: string
    plan?: PlanType
  }
}


export interface StripePaymentIntentData {
  amount: number;
  currency: string;
  customer?: string;
  metadata?: Record<string, string>; // ✅ All values must be strings
  automatic_payment_methods?: {
    enabled: boolean;
  };
}

export interface StripeSubscriptionData {
  customer: string
  items: Array<{
    price: string
  }>
  payment_behavior?: "default_incomplete" | "allow_incomplete" | "error_if_incomplete"
  payment_settings?: {
    save_default_payment_method: "on_subscription" | "off"
  }
  expand?: string[]
  metadata?: {
    userId?: string
    plan?: PlanType
  }
}

// Utility function to format amount for Stripe (convert dollars to cents)
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100)
}

// Utility function to format amount for display (convert cents to dollars)
export function formatAmountFromStripe(amount: number): number {
  return amount / 100
}

// Validate Stripe webhook signature
export function validateWebhookSignature(payload: string | Buffer, signature: string, secret: string): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

// Get plan details by type
export function getPlanDetails(planType: PlanType) {
  return PRICING_PLANS[planType]
}

// Check if plan requires payment
export function isPaidPlan(planType: PlanType): boolean {
  return planType !== "free"
}
