import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ============================================================================
// 1. TAILWIND CSS CLASS MERGER (The most important function in your app)
// ============================================================================
/**
 * Intelligently merges Tailwind classes without specificity conflicts.
 * Example: cn("px-4 py-2 bg-blue-500", "bg-red-500") => "px-4 py-2 bg-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// 2. FINANCIAL & DATA FORMATTERS
// ============================================================================
/**
 * Formats a raw number into a localized currency string.
 * Used for toast messages, alerts, and non-component logic.
 */
export function formatCurrency(amount: number, locale = "en-IN", currency = "INR"): string {
  if (isNaN(amount)) return "₹0"
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

/**
 * Formats an ISO Date string into a beautiful readable format.
 * Example: "2026-04-23T10:00:00Z" => "23 Apr 2026"
 */
export function formatDate(dateString: string | Date, includeTime = false): string {
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
      ...(includeTime && { hour: "numeric", minute: "numeric", hour12: true }),
    };

    return new Intl.DateTimeFormat("en-IN", options).format(date);
  } catch (error) {
    return "Invalid Date";
  }
}

// ============================================================================
// 3. STRING MANIPULATION & SEO
// ============================================================================
/**
 * Converts any string into an SEO-friendly URL slug.
 * Example: "The Ivory Pearl Satin Anarkali!" => "the-ivory-pearl-satin-anarkali"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

/**
 * Safely truncates a string and adds an ellipsis.
 * Example: truncate("This is a very long description", 10) => "This is a..."
 */
export function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

// ============================================================================
// 4. BROWSER & ASYNC UTILS
// ============================================================================
/**
 * A simple promise-based delay function. 
 * Excellent for simulating network requests or delaying UI transitions.
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Safely reads from localStorage without throwing Next.js SSR hydration errors.
 */
export function getLocalStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}