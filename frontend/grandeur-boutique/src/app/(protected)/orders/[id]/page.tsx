"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { 
  CheckCircle2, 
  MapPin, 
  Receipt, 
  Box, 
  Truck, 
  Home,
  Check
} from "lucide-react"

import { Order, OrderStatus } from "@/types/order"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = React.useState<Order | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Standard Delivery Steps
  const trackingSteps = [
    { status: "ORDER_PLACED", label: "Order Placed", icon: Receipt },
    { status: "CONFIRMED", label: "Confirmed", icon: Box },
    { status: "SHIPPED", label: "Shipped", icon: Truck },
    { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: MapPin },
    { status: "DELIVERED", label: "Delivered", icon: Home },
  ]

  React.useEffect(() => {
    // In production: Fetch specific order by ID
    // const data = await apiClient.get<Order>(`/orders/${params.id}`)
    
    // Mock Data mimicking a shipped order
    setTimeout(() => {
      setOrder({
        id: params.id as string,
        currentStatus: "SHIPPED",
        createdAt: new Date().toISOString(),
        expectedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        financials: { grandTotal: 2500, subtotal: 2500, shippingFee: 0, discountAmount: 0, taxAmount: 0 },
        payment: { method: "COD", status: "PENDING" },
        shippingAddress: { fullName: "Vijay", addressLine1: "123 Main St", city: "Chennai", state: "Tamil Nadu", pincode: "600001", phoneNumber: "9876543210", isGpsVerified: true },
        items: [
           { productId: "1", cartItemId: "1-M", title: "The Ivory Pearl Satin Anarkali", size: "M", quantity: 1, priceAtPurchase: 2500, imageUrl: "/mock-dress-1.jpg" }
        ],
        timeline: [
          { status: "ORDER_PLACED", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), description: "Your order has been placed." },
          { status: "CONFIRMED", timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), description: "Order confirmed by boutique." },
          { status: "SHIPPED", timestamp: new Date().toISOString(), description: "Package handed over to delivery partner." },
        ]
      } as Order)
      setIsLoading(false)
    }, 800)
  }, [params.id])

  const formatRupee = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
  }

  if (isLoading || !order) return <div className="min-h-screen bg-gray-50" /> // Standard skeleton state

  // Helper to determine step states
  const getStepState = (stepStatus: string) => {
    const stepIndex = trackingSteps.findIndex(s => s.status === stepStatus)
    const currentIndex = trackingSteps.findIndex(s => s.status === order.currentStatus)
    
    if (stepIndex < currentIndex) return "COMPLETED"
    if (stepIndex === currentIndex) return "ACTIVE"
    return "PENDING"
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Header Summary */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium mb-1">Order ID: {order.id}</p>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Arriving {new Intl.DateTimeFormat("en-IN", { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date(order.expectedDeliveryDate!))}
          </h2>
          
          {/* Items Preview */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
             <div className="w-16 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
             <div>
               <p className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{order.items[0].title}</p>
               <p className="text-xs text-gray-500">Size: {order.items[0].size} • Qty: {order.items[0].quantity}</p>
               <p className="font-bold text-gray-900 mt-2">{formatRupee(order.items[0].priceAtPurchase)}</p>
             </div>
          </div>
        </div>

        {/* Vertical Tracking Stepper */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Tracking Details</h3>
          
          <div className="relative pl-2">
            {/* The Vertical Line Connecting the dots */}
            <div className="absolute left-[19px] top-4 bottom-8 w-0.5 bg-gray-100"></div>
            
            <div className="space-y-8">
              {trackingSteps.map((step, index) => {
                const state = getStepState(step.status)
                const timelineEvent = order.timeline.find(t => t.status === step.status)
                const Icon = step.icon

                return (
                  <div key={index} className="relative flex items-start group">
                    
                    {/* The Dot / Checkmark */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4 transition-colors ${
                      state === "COMPLETED" ? "bg-[#005C29] text-white ring-4 ring-white" :
                      state === "ACTIVE" ? "bg-white border-2 border-[#005C29] text-[#005C29] ring-4 ring-white" :
                      "bg-white border-2 border-gray-200 text-gray-300 ring-4 ring-white"
                    }`}>
                      {state === "COMPLETED" ? <Check size={16} strokeWidth={3} /> : <Icon size={14} />}
                    </div>

                    {/* Step Content */}
                    <div className="pt-1 flex-1">
                      <p className={`text-sm font-bold ${
                        state === "PENDING" ? "text-gray-400" : "text-gray-900"
                      }`}>
                        {step.label}
                      </p>
                      
                      {/* Dynamic Description & Timestamp if active/completed */}
                      {timelineEvent && (
                        <div className="mt-1">
                          <p className="text-xs text-gray-500 leading-relaxed">{timelineEvent.description}</p>
                          <p className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                            {new Intl.DateTimeFormat("en-IN", { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short' }).format(new Date(timelineEvent.timestamp))}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</h3>
            <p className="text-sm font-medium text-gray-900">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600 mt-1">
              {order.shippingAddress.addressLine1},<br/>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Method</h3>
            <p className="text-sm text-gray-900 font-medium">{order.payment.method === "COD" ? "Cash on Delivery" : "Paid Online"}</p>
            <p className="text-xs text-gray-500 mt-0.5">Amount to pay: {formatRupee(order.financials.grandTotal)}</p>
          </div>
        </div>

      </main>
    </div>
  )
}