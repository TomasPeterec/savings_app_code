// src/components/lib/emailValidation.ts

export function myEmailValidation(value: string): string {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    if (!isValid && value !== "") {
      return "Invalid email."
    } else {
      return ""
    }
}


// src/lib/passwordValidation.ts

/**
 * Validates password strength.
 * 
 * Returns an error message if the password is weak,
 * or an empty string if it meets all conditions.
 * 
 * Rules:
 * - at least 8 characters
 * - at least one uppercase letter
 * - at least one lowercase letter
 * - at least one number
 * - at least one special character
 */
export function validatePassword(password: string): string {
  if (password.length < 8) return "Min 8 chars."
  
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNum = /[0-9]/.test(password)
  const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!hasUpper) return "Add uppercase."
  if (!hasLower) return "Add lowercase."
  if (!hasNum) return "Add number."
  if (!hasSpec) return "Add special char."

  return ""
}

