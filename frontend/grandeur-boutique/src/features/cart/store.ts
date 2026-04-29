import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { ProductSize} from "@/types/product" // Assuming you have this defined

// 1. Define the Cart Item
// We extend the base Product to include cart-specific data
export interface CartItem {
  id: string; // The base product ID
  cartItemId: string; // Composite ID: `${product.id}-${size}`
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  size: ProductSize; // e.g., "S", "M", "L", "XL"
  quantity: number;
}

// 2. Define the Store State & Actions
interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (product: Omit<CartItem, "cartItemId" | "quantity">, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  
  // Computed Getters (Useful for your UI)
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotalDiscount: () => number;
}

// 3. Create the Store with Persistence
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // ACTION: Add an item to the cart
      addItem: (product, quantity = 1) => {
        set((state) => {
          // Generate a unique ID based on product AND size
          const cartItemId = `${product.id}-${product.size}`
          const existingItemIndex = state.items.findIndex(
            (item) => item.cartItemId === cartItemId
          )

          // If exactly this item + size is already in the cart, just increase quantity
          if (existingItemIndex > -1) {
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += quantity
            return { items: updatedItems }
          }

          // Otherwise, add it as a new line item
          return {
            items: [...state.items, { ...product, cartItemId, quantity }],
          }
        })
      },

      // ACTION: Remove specific item
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }))
      },

      // ACTION: Update Quantity (e.g., clicking + or - in the UI)
      updateQuantity: (cartItemId, newQuantity) => {
        set((state) => {
          if (newQuantity <= 0) {
            // Remove item if quantity drops to 0
            return {
              items: state.items.filter((item) => item.cartItemId !== cartItemId),
            }
          }
          return {
            items: state.items.map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: newQuantity }
                : item
            ),
          }
        })
      },

      // ACTION: Clear the cart (Used after successful checkout)
      clearCart: () => set({ items: [] }),

      // COMPUTED: Get total number of items (for the header badge)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      // COMPUTED: Get subtotal (What the user actually pays)
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      // COMPUTED: Get total savings (To show "You saved ₹X!" at checkout)
      getTotalDiscount: () => {
        return get().items.reduce((total, item) => {
          if (!item.originalPrice) return total
          const discountPerItem = item.originalPrice - item.price
          return total + discountPerItem * item.quantity
        }, 0)
      },
    }),
    {
      name: "grandeur-cart-storage", // The name of the key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Optional: Only persist the 'items' array, not the computed functions
      partialize: (state) => ({ items: state.items }), 
    }
  )
)