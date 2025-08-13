import { validateEmail, validateAmount, validateCurrency, validatePlanType } from "./stripe-errors"

// Payment data validation schemas
export interface PaymentValidationResult {
  isValid: boolean
  errors: string[]
}

export function validatePaymentData(data: {
  email?: string
  fullName?: string
  amount?: number
  currency?: string
  plan?: string
}): PaymentValidationResult {
  const errors: string[] = []

  // Email validation
  if (!data.email) {
    errors.push("Email is required")
  } else if (!validateEmail(data.email)) {
    errors.push("Please enter a valid email address")
  }

  // Full name validation
  if (!data.fullName) {
    errors.push("Full name is required")
  } else if (data.fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters long")
  }

  // Amount validation
  if (data.amount !== undefined) {
    if (!validateAmount(data.amount)) {
      errors.push("Invalid payment amount")
    }
  }

  // Currency validation
  if (data.currency && !validateCurrency(data.currency)) {
    errors.push("Unsupported currency")
  }

  // Plan validation
  if (data.plan && !validatePlanType(data.plan)) {
    errors.push("Invalid plan type")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateBillingAddress(address: {
  line1?: string
  city?: string
  postal_code?: string
  country?: string
}): PaymentValidationResult {
  const errors: string[] = []

  if (!address.line1 || address.line1.trim().length < 5) {
    errors.push("Please enter a valid billing address")
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push("Please enter a valid city")
  }

  if (!address.postal_code || address.postal_code.trim().length < 3) {
    errors.push("Please enter a valid postal code")
  }

  if (!address.country || address.country.length !== 2) {
    errors.push("Please select a valid country")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateCardData(card: {
  number?: string
  exp_month?: number
  exp_year?: number
  cvc?: string
}): PaymentValidationResult {
  const errors: string[] = []

  // Card number validation (basic)
  if (!card.number) {
    errors.push("Card number is required")
  } else {
    const cleanNumber = card.number.replace(/\s/g, "")
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      errors.push("Please enter a valid card number")
    }
  }

  // Expiry month validation
  if (!card.exp_month || card.exp_month < 1 || card.exp_month > 12) {
    errors.push("Please enter a valid expiry month")
  }

  // Expiry year validation
  if (!card.exp_year) {
    errors.push("Please enter a valid expiry year")
  } else {
    const currentYear = new Date().getFullYear()
    if (card.exp_year < currentYear || card.exp_year > currentYear + 20) {
      errors.push("Please enter a valid expiry year")
    }
  }

  // CVC validation
  if (!card.cvc) {
    errors.push("Security code is required")
  } else if (card.cvc.length < 3 || card.cvc.length > 4) {
    errors.push("Please enter a valid security code")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
