"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { 
  MapPin, 
  Receipt, 
  Box, 
  Truck, 
  Home,
  Check
} from "lucide-react"

import { Order } from "@/types/order"

export default function OrderDetailsPage() {
  const params = useParams()
  const [order, setOrder] = React.useState<Order | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const trackingSteps = [
    { status: "ORDER_PLACED", label: "Order Placed", icon: Receipt },
    { status: "CONFIRMED", label: "Confirmed", icon: Box },
    { status: "SHIPPED", label: "Shipped", icon: Truck },
    { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: MapPin },
    { status: "DELIVERED", label: "Delivered", icon: Home },
  ]

  React.useEffect(() => {
    setTimeout(() => {
      setOrder({
        id: params.id as string,
        userId: "user-123",

        status: "SHIPPED", // ✅ FIX
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        subtotal: 2500,
        taxTotal: 0,
        shippingFee: 0,
        discountTotal: 0, // ✅ FIX (was discountAmount)
        grandTotal: 2500,

        paymentMethod: "COD", // ✅ FIX
        paymentStatus: "PENDING", // ✅ FIX

        shippingAddress: {
            fullName: "Vijay",
            phoneNumber: "9876543210",
            addressLine1: "123 Main St", // ✅ FIX
            addressLine2: "Apartment 4B",
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600001", // ✅ FIX
            country: "India",
            id: "",
            userId: "",
            type: "HOME",
            isDefault: false,
            isGpsVerified: false,
            createdAt: "",
            updatedAt: ""
        },

        items: [
          {
            id: "1", // ✅ FIX (missing before)
            productId: "1",
            title: "The Ivory Pearl Satin Anarkali",
            size: "M",
            quantity: 1,
            priceAtPurchase: 2500,
            taxAmount: 0, // ✅ FIX (required)
            imageUrl: "/mock-dress-1.jpg"
          }
        ],

        timeline: [
          { status: "ORDER_PLACED", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), description: "Your order has been placed." },
          { status: "CONFIRMED", timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), description: "Order confirmed by boutique." },
          { status: "SHIPPED", timestamp: new Date().toISOString(), description: "Package handed over to delivery partner." },
        ]
      })
      setIsLoading(false)
    }, 800)
  }, [params.id])

  const formatRupee = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading || !order) return <div className="min-h-screen bg-gray-50" />

  const getStepState = (stepStatus: string) => {
    const stepIndex = trackingSteps.findIndex(s => s.status === stepStatus)
    const currentIndex = trackingSteps.findIndex(s => s.status === order.status) // ✅ FIX
    
    if (stepIndex < currentIndex) return "COMPLETED"
    if (stepIndex === currentIndex) return "ACTIVE"
    return "PENDING"
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <main className="max-w-md mx-auto p-4 space-y-6">

        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Order ID: {order.id}</p>
          <h2 className="text-xl font-bold mb-4">
            Status: {order.status} {/* ✅ FIX */}
          </h2>

          <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-16 h-20 bg-gray-200 rounded-lg"></div>
            <div>
              <p className="font-medium text-sm">{order.items[0].title}</p>
              <p className="text-xs text-gray-500">
                Size: {order.items[0].size} • Qty: {order.items[0].quantity}
              </p>
              <p className="font-bold mt-2">
                {formatRupee(order.items[0].priceAtPurchase)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="font-bold mb-6">Tracking Details</h3>

          <div className="space-y-6">
            {trackingSteps.map((step, index) => {
              const state = getStepState(step.status)
              const timelineEvent = order.timeline.find(t => t.status === step.status)
              const Icon = step.icon

              return (
                <div key={index} className="flex items-start gap-3">
                  <div>
                    {state === "COMPLETED" ? <Check size={16} /> : <Icon size={14} />}
                  </div>

                  <div>
                    <p className="font-bold">{step.label}</p>

                    {timelineEvent && (
                      <div>
                        <p className="text-xs">{timelineEvent.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(timelineEvent.timestamp).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border shadow-sm space-y-4">
          <div>
            <h3 className="text-xs uppercase mb-2">Delivery Address</h3>

            <p className="text-sm font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-sm">
              {order.shippingAddress.addressLine1},<br/>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-xs uppercase mb-2">Payment</h3>

            <p className="text-sm">
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"}
            </p>

            <p className="text-xs">
              Amount: {formatRupee(order.grandTotal)} {/* ✅ FIX */}
            </p>
          </div>
        </div>

      </main>
    </div>
  )
}