// Custom error types for our application
export class PaymentError extends Error {
  public code: string
  public type: string
  public statusCode: number

  constructor(message: string, code: string, type: string, statusCode = 400) {
    super(message)
    this.name = "PaymentError"
    this.code = code
    this.type = type
    this.statusCode = statusCode
  }
}

export class SubscriptionError extends Error {
  public code: string
  public statusCode: number

  constructor(message: string, code: string, statusCode = 400) {
    super(message)
    this.name = "SubscriptionError"
    this.code = code
    this.statusCode = statusCode
  }
}

// Stripe error handling utility
export function handleStripeError(error: any): PaymentError {
  console.error("Stripe error:", error)

  if (error.type === "StripeCardError") {
    // Card was declined
    return new PaymentError(
      getUserFriendlyMessage(error.code) || "Your card was declined. Please try a different payment method.",
      error.code,
      "card_error",
      400,
    )
  }

  if (error.type === "StripeRateLimitError") {
    return new PaymentError("Too many requests. Please try again later.", "rate_limit", "rate_limit_error", 429)
  }

  if (error.type === "StripeInvalidRequestError") {
    return new PaymentError(
      "Invalid request. Please check your payment information.",
      "invalid_request",
      "invalid_request_error",
      400,
    )
  }

  if (error.type === "StripeAPIError") {
    return new PaymentError("Payment service temporarily unavailable. Please try again.", "api_error", "api_error", 500)
  }

  if (error.type === "StripeConnectionError") {
    return new PaymentError(
      "Network error. Please check your connection and try again.",
      "connection_error",
      "connection_error",
      500,
    )
  }

  if (error.type === "StripeAuthenticationError") {
    return new PaymentError("Authentication failed. Please contact support.", "auth_error", "auth_error", 401)
  }

  // Generic error
  return new PaymentError("An unexpected error occurred. Please try again.", "unknown_error", "generic_error", 500)
}

// User-friendly error messages for common Stripe error codes
function getUserFriendlyMessage(code: string): string | null {
  const errorMessages: Record<string, string> = {
    // Card errors
    card_declined: "Your card was declined. Please try a different payment method.",
    expired_card: "Your card has expired. Please use a different card.",
    incorrect_cvc: "Your card's security code is incorrect. Please check and try again.",
    incorrect_number: "Your card number is incorrect. Please check and try again.",
    insufficient_funds: "Your card has insufficient funds. Please use a different payment method.",
    invalid_cvc: "Your card's security code is invalid. Please check and try again.",
    invalid_expiry_month: "Your card's expiration month is invalid.",
    invalid_expiry_year: "Your card's expiration year is invalid.",
    invalid_number: "Your card number is invalid. Please check and try again.",
    processing_error: "An error occurred while processing your card. Please try again.",

    // Bank/account errors
    account_closed: "The bank account is closed. Please use a different payment method.",
    account_frozen: "The bank account is frozen. Please contact your bank.",
   

    // General errors
    amount_too_large: "The payment amount is too large. Please contact support.",
    amount_too_small: "The payment amount is too small.",
    currency_not_supported: "This currency is not supported.",
    duplicate_transaction: "This transaction appears to be a duplicate.",
    generic_decline: "Your payment was declined. Please try a different payment method.",
    invalid_account: "The account information is invalid.",
    lost_card: "This card has been reported as lost. Please use a different card.",
    merchant_blacklist: "Your payment was declined. Please contact support.",
    new_account_information_available: "New account information is available. Please update your payment method.",
    no_action_taken: "No action was taken on this payment.",
    not_permitted: "This payment is not permitted. Please contact support.",
    pickup_card: "This card cannot be used. Please use a different payment method.",
    restricted_card: "This card has restrictions. Please use a different payment method.",
    revoked_authorization: "The payment authorization was revoked.",
    security_violation: "Security violation detected. Please contact support.",
    service_not_allowed: "This service is not allowed for this payment method.",
    stolen_card: "This card has been reported as stolen. Please use a different card.",
    stop_payment_order: "A stop payment order is in place for this account.",
    testmode_decline: "This is a test payment that was declined.",
    transaction_not_allowed: "This transaction is not allowed.",
    try_again_later: "Please try again later.",
    withdrawal_count_limit_exceeded: "Withdrawal limit exceeded. Please try again later.",
  }

  return errorMessages[code] || null
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateAmount(amount: number): boolean {
  return amount > 0 && amount <= 99999999 // Max $999,999.99
}

export function validateCurrency(currency: string): boolean {
  const supportedCurrencies = ["usd", "eur", "gbp", "cad", "aud"]
  return supportedCurrencies.includes(currency.toLowerCase())
}

export function validatePlanType(plan: string): boolean {
  const validPlans = ["free", "pro", "team", "enterprise"]
  return validPlans.includes(plan)
}

// Retry utility for failed operations
export async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      console.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, error)

      if (attempt === maxRetries) {
        break
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }

  throw lastError!
}

// Logging utility for payment events
export function logPaymentEvent(event: string, data: any, level: "info" | "warn" | "error" = "info") {
  const timestamp = new Date().toISOString()
  const logData = {
    timestamp,
    event,
    data: typeof data === "object" ? JSON.stringify(data) : data,
    level,
  }

  switch (level) {
    case "error":
      console.error(`[PAYMENT ERROR] ${timestamp}:`, logData)
      break
    case "warn":
      console.warn(`[PAYMENT WARNING] ${timestamp}:`, logData)
      break
    default:
      console.log(`[PAYMENT INFO] ${timestamp}:`, logData)
  }

  // In production, you might want to send this to a logging service
  // like DataDog, LogRocket, or Sentry
}

// Format error response for API endpoints
export function formatErrorResponse(error: PaymentError | SubscriptionError | Error) {
  if (error instanceof PaymentError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        type: error.type,
      },
      statusCode: error.statusCode,
    }
  }

  if (error instanceof SubscriptionError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        type: "subscription_error",
      },
      statusCode: error.statusCode,
    }
  }

  // Generic error
  return {
    error: {
      message: "An unexpected error occurred. Please try again.",
      code: "unknown_error",
      type: "generic_error",
    },
    statusCode: 500,
  }
}
