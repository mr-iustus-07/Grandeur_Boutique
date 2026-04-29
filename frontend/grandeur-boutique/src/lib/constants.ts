// ============================================================================
// 1. REGEX PATTERNS (Enterprise Validation)
// ============================================================================
export const REGEX = {
  // Matches valid 10-digit Indian mobile numbers starting with 6-9
  INDIAN_PHONE: /^[6-9]\d{9}$/,
  // Matches valid 6-digit Indian PIN codes (cannot start with 0)
  INDIAN_PINCODE: /^[1-9][0-9]{5}$/,
  // Standard email validation RFC 5322
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Password: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  SECURE_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
} as const;

// ============================================================================
// 2. STORAGE KEYS (Prevents LocalStorage Typos)
// ============================================================================
export const STORAGE_KEYS = {
  AUTH_STORE: "grandeur-auth-storage",
  CART_STORE: "grandeur-cart-storage",
  RECENT_SEARCHES: "grandeur_recent_searches",
  THEME: "grandeur-theme",
} as const;

// ============================================================================
// 3. BUSINESS LOGIC & MATH MAGIC NUMBERS
// ============================================================================
export const BUSINESS_RULES = {
  // Indian Apparel GST (Items < 1000 = 5%, >= 1000 = 12%)
  TAX: {
    LUXURY_THRESHOLD: 1000,
    STANDARD_RATE: 0.05,
    LUXURY_RATE: 0.12,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50,
  },
  CART: {
    MAX_ITEMS_PER_PRODUCT: 5, // Prevents hoarding inventory
    EXPIRY_HOURS: 24, // Optional: for backend cron jobs
  }
} as const;

// ============================================================================
// 4. ORDER STATUS DICTIONARY (For UI Mapping)
// ============================================================================
// We map the raw backend enum to beautiful front-end labels and colors
export const ORDER_STATUS_MAP = {
  ORDER_PLACED: { label: "Processing", color: "text-blue-700", bg: "bg-blue-50" },
  CONFIRMED: { label: "Confirmed", color: "text-indigo-700", bg: "bg-indigo-50" },
  SHIPPED: { label: "Shipped", color: "text-yellow-700", bg: "bg-yellow-50" },
  REACHED_HUB: { label: "At Local Hub", color: "text-orange-700", bg: "bg-orange-50" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "text-[#005C29]", bg: "bg-[#005C29]/10" },
  DELIVERED: { label: "Delivered", color: "text-green-700", bg: "bg-green-50" },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50" },
} as const;

// Extracting types for TypeScript to use elsewhere
export type OrderStatusKey = keyof typeof ORDER_STATUS_MAP;

// ============================================================================
// 5. APPLICATION ROUTES (Single Source of Truth)
// ============================================================================
export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
    SEARCH: "/search",
    CATEGORY: (id: string) => `/category/${id}`,
    PRODUCT: (id: string) => `/product/${id}`,
  },
  PROTECTED: {
    PROFILE: "/profile",
    CART: "/cart",
    ADDRESS: "/address",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
    ORDER_DETAILS: (id: string) => `/orders/${id}`,
    ORDER_SUCCESS: (id: string) => `/orders/${id}/success`,
    WISHLIST: "/wishlist",
  }
} as const;