import { Address } from "./address";
import { ProductSize } from "./product";

// ============================================================================
// ENUMS & LITERALS
// ============================================================================

export type PaymentMethod = "COD" | "ONLINE";

export type PaymentStatus = 
  | "PENDING"     // Order created, waiting for Razorpay callback
  | "PAID"        // Razorpay successful / COD collected
  | "FAILED"      // Credit card declined
  | "REFUNDED";   // Order cancelled and money returned

export type OrderStatus = 
  | "ORDER_PLACED" 
  | "CONFIRMED" 
  | "SHIPPED" 
  | "REACHED_HUB" 
  | "OUT_FOR_DELIVERY" 
  | "DELIVERED" 
  | "CANCELLED";

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * A snapshot of the product at the exact time of purchase.
 * We NEVER link directly to the live product price, because if the price 
 * goes up tomorrow, the user's historical receipt must remain unchanged.
 */
export interface OrderItem {
  id: string; // Unique ID for this specific row in the order
  productId: string;
  title: string;
  size: ProductSize;
  quantity: number;
  
  // Financial Snapshot
  priceAtPurchase: number; // The base price they paid
  taxAmount: number;       // The specific GST applied to this item
  
  imageUrl: string;
}

/**
 * For the Order Tracking UI. Represents a single event in the delivery lifecycle.
 */
export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string; // ISO 8601 Date String
  description: string; // e.g., "Package arrived at Chennai sorting facility"
  location?: string;
}

/**
 * The complete, deeply-nested Order object used on the Order Details Page.
 */
export interface Order {
  id: string; // Your internal order ID (e.g., ORD-2026-8921)
  userId: string;
  
  // Financials
  subtotal: number;
  taxTotal: number;
  shippingFee: number;
  discountTotal: number;
  grandTotal: number;
  
  // Payment Gateway Data
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string; // Links your DB to the Razorpay dashboard
  razorpayPaymentId?: string;
  
  // Fulfillment Data
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address; // If different from shipping
  items: OrderItem[];
  timeline: OrderTimelineEvent[]; // The chronological tracking history
  
  // Optional Metadata
  promoCodeApplied?: string;
  cancellationReason?: string;
  
  createdAt: string; 
  updatedAt: string;
}

// ============================================================================
// LIGHTWEIGHT SUMMARIES (For Lists)
// ============================================================================

/**
 * A stripped-down version of the Order used for the "My Orders" list page.
 * Prevents fetching massive arrays of timeline events when just listing history.
 */
export interface OrderSummary {
  id: string;
  status: OrderStatus;
  shippingAddress: Pick<Address, "city" | "state">; // Just show city & state in the list
  grandTotal: number;
  createdAt: string;
  itemCount: number;
  firstItemImageUrl: string; // Just to show a thumbnail in the list
}

export type { Address };
