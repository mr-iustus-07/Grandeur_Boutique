import * as z from "zod"
import { REGEX } from "./constants"

// ============================================================================
// 1. REUSABLE PRIMITIVES
// These building blocks prevent us from writing the same regex 10 times.
// ============================================================================

const phoneSchema = z.string()
  .min(10, "Phone number is required")
  .regex(REGEX.INDIAN_PHONE, "Must be a valid 10-digit Indian mobile number")

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(REGEX.SECURE_PASSWORD, "Password must contain at least 1 uppercase, 1 lowercase, and 1 number")

const emailSchema = z.string()
  .email("Please enter a valid email address")
  .transform((val) => val.toLowerCase().trim()) // Auto-formats user input before submission

// ============================================================================
// 2. AUTHENTICATION SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  // Smart Identifier: Accepts either an Email OR an Indian Phone Number
  identifier: z.string()
    .min(1, "Email or Phone Number is required")
    .trim()
    .refine((val) => {
      const isEmail = REGEX.EMAIL.test(val)
      const isPhone = REGEX.INDIAN_PHONE.test(val)
      return isEmail || isPhone
    }, "Must be a valid email or 10-digit phone number"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Highlights the specific input box that failed
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

// ============================================================================
// 3. USER PROFILE SCHEMAS
// ============================================================================

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  // For luxury profiling:
  anniversaryDate: z.string().optional(), 
}).refine((data) => Object.keys(data).length > 0, {
  message: "Please change at least one field to update your profile",
})

// ============================================================================
// 4. E-COMMERCE SCHEMAS (Checkout & Cart)
// ============================================================================

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required").trim(),
  phoneNumber: phoneSchema,
  addressLine1: z.string().min(5, "Street address is required").trim(),
  addressLine2: z.string().trim().optional(),
  city: z.string().min(2, "City is required").trim(),
  state: z.string().min(2, "State is required").trim(),
  pincode: z.string().regex(REGEX.INDIAN_PINCODE, "Must be a valid 6-digit Pincode"),
  
  // GPS Tracking Fields (Hidden from UI, but strictly validated)
  isGpsVerified: z.boolean().default(false),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  }).optional()
})

export const promoCodeSchema = z.object({
  code: z.string()
    .min(3, "Promo code is too short")
    .max(15, "Promo code is too long")
    .transform((val) => val.toUpperCase().trim()) // Forces GRAND10 instead of grand10
})

// ============================================================================
// 5. TYPE INFERENCE EXPORTS
// Extracts the strict TypeScript Types directly from the Zod schemas so you 
// don't have to write them twice.
// ============================================================================

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type PromoCodeInput = z.infer<typeof promoCodeSchema>