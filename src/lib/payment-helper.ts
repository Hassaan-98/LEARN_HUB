import { formatAmountFromStripe, type PlanType } from "./stripe"
import { logPaymentEvent, retryOperation } from "./stripe-errors"

// Helper functions for common payment operations
export function formatCurrency(amount: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(formatAmountFromStripe(amount))
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Calculate prorated amount for plan changes
export function calculateProratedAmount(
  currentPlan: { amount: number; periodStart: number; periodEnd: number },
  newPlan: { amount: number },
  changeDate: number = Date.now() / 1000,
): number {
  const totalPeriodDuration = currentPlan.periodEnd - currentPlan.periodStart
  const remainingPeriodDuration = currentPlan.periodEnd - changeDate
  const proratedPercentage = remainingPeriodDuration / totalPeriodDuration

  const currentPlanRefund = Math.round(currentPlan.amount * proratedPercentage)
  const newPlanCharge = Math.round(newPlan.amount * proratedPercentage)

  return newPlanCharge - currentPlanRefund
}

// Generate invoice number
export function generateInvoiceNumber(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `INV-${timestamp}-${random}`
}

// Safe async operation wrapper
export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  fallbackValue?: T,
): Promise<T | null> {
  try {
    logPaymentEvent(`${operationName}_started`, { operation: operationName })
    const result = await retryOperation(operation, 3, 1000)
    logPaymentEvent(`${operationName}_completed`, { operation: operationName })
    return result
  } catch (error:any) {
    logPaymentEvent(`${operationName}_failed`, { operation: operationName, error: error.message }, "error")
    return fallbackValue || null
  }
}

// Plan comparison utilities
export function comparePlans(currentPlan: PlanType, newPlan: PlanType): "upgrade" | "downgrade" | "same" {
  const planHierarchy: Record<PlanType, number> = {
    free: 0,
    pro: 1,
    team: 2,
    enterprise: 3,
  }

  const currentLevel = planHierarchy[currentPlan]
  const newLevel = planHierarchy[newPlan]

  if (newLevel > currentLevel) return "upgrade"
  if (newLevel < currentLevel) return "downgrade"
  return "same"
}

// Webhook event utilities
export function isWebhookEventRecent(eventCreated: number, maxAgeMinutes = 5): boolean {
  const eventAge = (Date.now() / 1000 - eventCreated) / 60
  return eventAge <= maxAgeMinutes
}

export function extractMetadataFromWebhook(event: any): Record<string, any> {
  return {
    eventId: event.id,
    eventType: event.type,
    created: event.created,
    livemode: event.livemode,
    objectId: event.data?.object?.id,
    customerId: event.data?.object?.customer,
    metadata: event.data?.object?.metadata || {},
  }
}

// Rate limiting utilities
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, maxRequests = 10, windowMinutes = 1): boolean {
  const now = Date.now()
  const windowMs = windowMinutes * 60 * 1000
  const resetTime = now + windowMs

  const current = rateLimitMap.get(identifier)

  if (!current || now > current.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60000) // Clean up every minute
