// src/features/checkout/utils.ts

/**
 * Dynamically loads the Razorpay SDK script into the browser.
 * This prevents the heavy script from slowing down your homepage load times.
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // If it's already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    
    document.body.appendChild(script)
  })
}

/**
 * Generates an Idempotency Key (UUID v4).
 * Enterprise Rule: Always send this key to FastAPI when creating an order. 
 * If the user's internet lags and they click "Pay" twice, FastAPI will see the 
 * exact same Idempotency Key and safely ignore the second request, preventing double charges.
 */
export const generateIdempotencyKey = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Ensure TypeScript knows about the global Razorpay object injected by the script
declare global {
  interface Window {
    Razorpay: unknown; // You can replace 'any' with a more specific type if you have Razorpay's TypeScript definitions
  }
}