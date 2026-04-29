import { OrderItem } from "@/types/order"
import { ProductSize } from "@/types/product"

interface CartItem {
  id: string
  cartItemId: string
  title: string
  size: ProductSize
  quantity: number
  price: number
  imageUrl: string
}

/**
 * Generates a unique composite ID for a cart item.
 * Why? If a user adds a Size M lehenga, and then a Size XL lehenga, 
 * they must exist as two separate rows in the cart, not merge into one.
 */
export const generateCartItemId = (productId: string, size: ProductSize): string => {
  return `${productId}_${size}`
}

/**
 * Enterprise Indian Apprel GST Calculation
 * Apparel < ₹1000 = 5% GST
 * Apparel >= ₹1000 = 12% GST
 */
export const calculateItemTaxes = (priceAtPurchase: number, quantity: number) => {
  const isLuxury = priceAtPurchase >= 1000
  const gstRate = isLuxury ? 0.12 : 0.05
  
  // E-commerce rule: Always calculate tax on the unit price first, then multiply by quantity
  // to avoid floating point rounding errors at scale.
  const taxPerUnit = priceAtPurchase * gstRate
  const totalTax = taxPerUnit * quantity
  
  return {
    gstRatePercentage: gstRate * 100,
    totalTaxAmount: Math.round(totalTax), // Round to nearest Rupee
  }
}

/**
 * Transforms the local Zustand Cart items into the strict Data Transfer Object (DTO)
 * required by your FastAPI Order endpoint.
 */
export const formatCartForCheckout = (cartItems: CartItem[]): OrderItem[] => {
  return cartItems.map(item => {
    const { gstRatePercentage, totalTaxAmount } = calculateItemTaxes(item.price, item.quantity)
    return {
      id: item.cartItemId,
      productId: item.id,
      cartItemId: item.cartItemId,
      title: item.title,
      size: item.size,
      quantity: item.quantity,
      priceAtPurchase: item.price, // Locks in the price at checkout
      imageUrl: item.imageUrl,
      taxAmount: totalTaxAmount,
    }
  })
}

/**
 * Validates if the cart meets the minimum threshold for processing.
 * e.g., Grandeur Boutique doesn't process orders under ₹500.
 */
export const validateCartThreshold = (subtotal: number): { isValid: boolean; message?: string } => {
  const MINIMUM_ORDER_VALUE = 500
  
  if (subtotal < MINIMUM_ORDER_VALUE) {
    return {
      isValid: false,
      message: `Minimum order value is ₹${MINIMUM_ORDER_VALUE}. Please add more items to your cart.`,
    }
  }
  return { isValid: true }
}