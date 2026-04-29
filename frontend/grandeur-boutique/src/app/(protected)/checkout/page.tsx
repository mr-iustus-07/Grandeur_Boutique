"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  ChevronRight 
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import { useCartStore } from "@/features/cart/store"
import { apiClient } from "@/lib/api-client"

// Define Payment Options
type PaymentMethod = "COD" | "ONLINE"

export default function CheckoutPage() {
  const router = useRouter()
  
  // 1. Local State
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("COD")
  const [isProcessing, setIsProcessing] = React.useState(false)
  
  // 2. Success State Management
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [generatedOrderId, setGeneratedOrderId] = React.useState<string | null>(null)

  // 3. Global Cart State
  const { items, getSubtotal, getTotalDiscount, clearCart } = useCartStore()

  // 4. Hydration & Security Check
  const isMounted= true

  const subtotal = getSubtotal()
  const applyDiscount = getTotalDiscount()
  const deliveryFee = subtotal > 10000 ? 0 : 150 // Free delivery over ₹10k
  const grandTotal = subtotal + deliveryFee

  const formatRupee = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // 5. The Transaction Handler
  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    try {
      if (paymentMethod === "COD") {
        // Mocking the FastAPI Backend Call for Cash On Delivery
        // const response = await apiClient.post("/orders", { items, paymentMethod: "COD" })
        
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))
        
        // Mock Response Data
        const mockOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
        
        // Trigger Success UI & Clear Cart
        setGeneratedOrderId(mockOrderId)
        setIsSuccess(true)
        clearCart()
        
      } else {
        // ONLINE PAYMENT LOGIC (Razorpay/Stripe)
        // 1. Call backend to create Razorpay Order ID
        // 2. Open Razorpay Window
        // 3. On success callback -> setIsSuccess(true) & clearCart()
        alert("Razorpay Integration goes here!")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Order creation failed", error)
      alert("Something went wrong. Please try again.")
      setIsProcessing(false)
    }
  }

  if (!isMounted) return null

  // ==========================================
  // VIEW: ORDER SUCCESS (Screen 11 Implementation)
  // ==========================================
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#005C29] flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
          <CheckCircle2 size={50} className="text-[#D4AF37]" />
        </div>
        
        <h1 className="text-3xl font-serif font-bold mb-2">Order Successful!</h1>
        <p className="text-[#D4AF37] font-medium mb-8">Thank you for your purchase.</p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm mb-8 border border-white/20">
          <p className="text-sm text-gray-200 mb-1">Order ID</p>
          <p className="text-xl font-bold tracking-wider">{generatedOrderId}</p>
        </div>

        <div className="space-y-4 w-full max-w-sm">
          <Button 
            className="w-full bg-[#D4AF37] text-black hover:bg-[#C5A028]"
            onClick={() => router.push(`/orders/${generatedOrderId}`)}
          >
            Track Order
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-white text-white hover:bg-white hover:text-[#005C29]"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  // ==========================================
  // VIEW: CHECKOUT SELECTION (Screen 8 Implementation)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="max-w-md mx-auto p-4 space-y-6">
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <p className="text-sm text-gray-500">Choose how you want to pay</p>
        </div>

        {/* Payment Selection Cards */}
        <div className="space-y-3">
          
          {/* Option 1: Online Payment */}
          <button
            onClick={() => setPaymentMethod("ONLINE")}
            className={`w-full flex items-center p-4 rounded-2xl border transition-all ${
              paymentMethod === "ONLINE" 
                ? "border-[#005C29] bg-[#005C29]/5" 
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              paymentMethod === "ONLINE" ? "bg-[#005C29] text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <CreditCard size={20} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Pay Online</h3>
              <p className="text-xs text-gray-500">UPI, Credit/Debit Cards, NetBanking</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "ONLINE" ? "border-[#005C29]" : "border-gray-300"
            }`}>
              {paymentMethod === "ONLINE" && <div className="w-2.5 h-2.5 bg-[#005C29] rounded-full" />}
            </div>
          </button>

          {/* Option 2: Cash on Delivery */}
          <button
            onClick={() => setPaymentMethod("COD")}
            className={`w-full flex items-center p-4 rounded-2xl border transition-all ${
              paymentMethod === "COD" 
                ? "border-[#005C29] bg-[#005C29]/5" 
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              paymentMethod === "COD" ? "bg-[#005C29] text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <Banknote size={20} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
              <p className="text-xs text-gray-500">Pay when you receive your order</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "COD" ? "border-[#005C29]" : "border-gray-300"
            }`}>
              {paymentMethod === "COD" && <div className="w-2.5 h-2.5 bg-[#005C29] rounded-full" />}
            </div>
          </button>
        </div>

        {/* Final Order Summary */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">Order Summary</h3>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Items ({items.length})</span>
            <span>{formatRupee(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery Fee</span>
            {deliveryFee === 0 ? (
               <span className="text-[#005C29] font-medium">Free</span>
            ) : (
               <span>{formatRupee(deliveryFee)}</span>
            )}
          </div>
          
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="font-bold text-gray-900">Amount to Pay</span>
            <span className="text-xl font-bold text-[#005C29]">{formatRupee(grandTotal)}</span>
          </div>
        </div>

      </main>

      {/* Sticky Place Order Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <div className="max-w-md mx-auto">
          <Button 
            className="w-full h-14 text-base tracking-wide flex items-center justify-center gap-2"
            onClick={handlePlaceOrder}
            isLoading={isProcessing}
          >
            <ShieldCheck size={18} />
            <span>{isProcessing ? "Processing..." : `Place Order • ${formatRupee(grandTotal)}`}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}