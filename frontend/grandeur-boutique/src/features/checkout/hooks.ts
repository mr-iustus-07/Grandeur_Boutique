// src/features/checkout/hooks.ts

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { apiClient, ApiError } from "@/lib/api-client"
import { useCartStore } from "@/features/cart/store"
import { config } from "@/config"
import { loadRazorpayScript, generateIdempotencyKey } from "./utils"
import { Address } from "@/types/address" // ✅ FIXED

// 1. DTOs (Data Transfer Objects)
interface CheckoutPayload {
  addressId?: string
  newAddress?: Address // ✅ FIXED
  paymentMethod: "COD" | "ONLINE"
  idempotencyKey: string
}

interface OrderVerificationPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

// ✅ FIX: Declare Razorpay types
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: OrderVerificationPayload) => void
  modal: {
    onDismiss: () => void
  }
  theme: {
    color: string
  }
}

interface RazorpayInstance {
  open: () => void
}

// 2. API Layer
const checkoutApi = {
  initiateOrder: (data: CheckoutPayload) => 
    apiClient.post<{ orderId: string; razorpayOrderId?: string; amount: number }>("/orders/initiate", data),
    
  verifyPayment: (data: OrderVerificationPayload) => 
    apiClient.post<{ success: boolean; orderId: string }>("/orders/verify", data),
}

// 3. Main Hook
export function useCheckoutFlow() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const clearCart = useCartStore((state) => state.clearCart)

  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const payloadWithKey = {
        ...payload,
        idempotencyKey: generateIdempotencyKey()
      }

      const initResponse = await checkoutApi.initiateOrder(payloadWithKey)

      // COD
      if (payload.paymentMethod === "COD") {
        return { orderId: initResponse.orderId, status: "SUCCESS" }
      }

      // ONLINE
      if (payload.paymentMethod === "ONLINE") {
        const isScriptLoaded = await loadRazorpayScript()
        if (!isScriptLoaded) {
          throw new Error("Payment gateway failed to load. Please check your connection.")
        }

        if (!initResponse.razorpayOrderId) {
          throw new Error("Failed to generate payment order. Please try again.")
        }

        return new Promise<{ orderId: string; status: string }>((resolve, reject) => {
          const options = {
            key: config.payments.razorpayKey,
            amount: initResponse.amount,
            currency: "INR",
            name: config.app.name,
            description: "Luxury Fashion Transaction",
            order_id: initResponse.razorpayOrderId as string,
            
            handler: async function (response: {
              razorpay_order_id: string
              razorpay_payment_id: string
              razorpay_signature: string
            }) { // ✅ FIXED (removed any)
              try {
                await checkoutApi.verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                })
                resolve({ orderId: initResponse.orderId, status: "SUCCESS" })
              } catch {
                reject(new Error("Payment verification failed. If money was deducted, it will be refunded."))
              }
            },
            
            modal: {
              onDismiss: function () {
                reject(new Error("Payment cancelled by user."))
              }
            },
            
            theme: {
              color: "#005C29"
            }
          }

          const Razorpay = window.Razorpay as unknown as new (options: RazorpayOptions) => RazorpayInstance
          const paymentObject = new Razorpay(options)
          paymentObject.open()
        })
      }
      
      throw new Error("Invalid payment method selected.")
    },

    onSuccess: (data) => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Order Placed Successfully!")
      router.push(`/orders/${data.orderId}/success`)
    },

    onError: (error: ApiError | Error) => {
      toast.error(error.message || "An error occurred during checkout.")
    }
  })
}