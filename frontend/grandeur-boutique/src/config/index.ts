import { z } from "zod"

// 1. Strict Environment Variable Schema
// This ensures your app NEVER boots in production missing a critical API key
const envSchema = z.object({
  // App
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  
  // Backend API
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8000/api/v1"),
  
  // Firebase Auth (Public Keys)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, "Firebase API Key is missing"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  
  // Payments (Razorpay)
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1, "Razorpay Key ID is missing"),
  
  // WhatsApp Business
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian number"),
})

// 2. Parse and Validate
// We use a try/catch so we can log exactly WHICH keys are missing in the terminal
const parseEnv = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:", error.flatten().fieldErrors)
      throw new Error("Missing or invalid environment variables. Check terminal logs.")
    }
    throw error
  }
}

const env = parseEnv()

// 3. The Global Configuration Object
// This is what you actually import into your components: `import { config } from "@/config"`
export const config = {
  app: {
    name: "Grandeur Boutique",
    description: "Luxury Handcrafted Elegance",
    url: env.NEXT_PUBLIC_APP_URL,
    isProduction: env.NODE_ENV === "production",
  },
  
  api: {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    // Add default pagination limits or timeout constraints here
    defaultPageSize: 12,
    timeoutMs: 10000, 
  },

  firebase: {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },

  payments: {
    razorpayKey: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    // Business logic constants
    freeShippingThreshold: 10000, // ₹10,000
    standardDeliveryFee: 150,     // ₹150
  },

  social: {
    whatsappNumber: env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    instagram: "https://instagram.com/grandeurboutique",
    supportEmail: "support@grandeurboutique.com",
  },

  // 4. Feature Flags
  // Easily turn off features during maintenance without rewriting UI code
  features: {
    enableRazorpay: true,
    enableCashOnDelivery: true,
    enableWhatsAppCustomization: true,
    enableGuestCheckout: false, // Luxury apps usually require accounts
  }
} as const;

// Export types for strict usage
export type Config = typeof config;