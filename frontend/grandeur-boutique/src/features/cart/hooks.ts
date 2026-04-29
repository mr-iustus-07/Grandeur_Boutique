import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCartStore } from "./store"
import { formatCartForCheckout } from "./utils"
import { ApiError, apiClient } from "@/lib/api-client"


// ✅ FIX: proper typing
type CartItemPayload = ReturnType<typeof formatCartForCheckout>[number]

// Mock API
const cartApi = {
  validateInventory: (items: CartItemPayload[]) =>
    apiClient.post("/inventory/validate", { items }),

  applyCoupon: (code: string) =>
    apiClient.post<{ discountValue: number }>("/coupons/apply", { code }),
}

/**
 * Validate cart inventory
 */
export function useValidateCartInventory() {
  const { items } = useCartStore()

  return useMutation({
    mutationFn: () => {


      const checkoutPayload = formatCartForCheckout(items)
      return cartApi.validateInventory(checkoutPayload)
    },

    onError: (error: ApiError) => {
      toast.error(error.message || "Some items in your cart are no longer available.")
    },
  })
}

/**
 * Apply promo code
 */
export function useApplyPromoCode() {
  const cartStore = useCartStore()

  return useMutation({
    mutationFn: (promoCode: string) =>
      cartApi.applyCoupon(promoCode.toUpperCase()),

    onSuccess: (data) => {
      // ✅ FIX: remove any completely
      if ("applyDiscount" in cartStore) {
        (cartStore as { applyDiscount: (value: number) => void })
          .applyDiscount(data.discountValue)
      }

      toast.success("Promo code applied successfully!")
    },

    onError: (error: ApiError) => {
      toast.error(error.message || "Invalid or expired promo code.")
    },
  })
}

/**
 * Sync cart to backend
 */
export function useSyncCartToServer() {
  const { items } = useCartStore()

  return useMutation({
    mutationFn: async () => {
      if (items.length === 0) return null

      const payload = formatCartForCheckout(items)

      return apiClient.post("/users/me/cart/sync", { items: payload })
    },

    onSuccess: () => {
      console.log("Cart successfully synced to cloud")
    },

    onError: () => {
      console.error("Failed to sync local cart to server")
    },
  })
}