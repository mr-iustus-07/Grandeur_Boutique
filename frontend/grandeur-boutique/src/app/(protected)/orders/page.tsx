"use client"

import * as React from "react"
import Link from "next/link"
import { Package, ChevronRight, Clock } from "lucide-react"

import { Order, OrderStatus } from "@/types/order"

export default function OrdersListPage() {
  const [orders, setOrders] = React.useState<Order[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In production: const data = await apiClient.get<Order[]>("/orders")
        
        // Mocking the backend response for the frontend UI
        setTimeout(() => {
          setOrders([
            {
              id: "ORD-9938-XYZ",
              userId: "user_123",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: "SHIPPED",
              subtotal: 2500,
              taxTotal: 0,
              shippingFee: 0,
              discountTotal: 0,
              grandTotal: 2500,
              paymentMethod: "ONLINE",
              paymentStatus: "PAID",
              shippingAddress: {
                id: "addr_1",
                userId: "user_123",
                type: "HOME",
                isDefault: true,
                fullName: "John Doe",
                phoneNumber: "+91 9876543210",
                addressLine1: "123 Main Street",
                addressLine2: "Apartment 4B",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400001",
                country: "India",
                isGpsVerified: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              timeline: [],
              items: [
                {
                    id: "item-1",
                    productId: "1",
                    title: "The Ivory Pearl Satin Anarkali",
                    size: "M",
                    quantity: 1,
                    priceAtPurchase: 2500,
                    taxAmount: 0,
                    imageUrl: "/mock-dress-1.jpg"
            }
        ],
            }
          ])
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch orders", error)
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatRupee = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(isoString))
  }

  // Helper to render beautiful status badges
  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const statusConfig: Record<OrderStatus, { color: string, label: string }> = {
      ORDER_PLACED: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Processing" },
      CONFIRMED: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Confirmed" },
      SHIPPED: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Shipped" },
      REACHED_HUB: { color: "bg-orange-50 text-orange-700 border-orange-200", label: "At Local Hub" },
      OUT_FOR_DELIVERY: { color: "bg-[#005C29]/10 text-[#005C29] border-[#005C29]/20", label: "Out for Delivery" },
      DELIVERED: { color: "bg-green-50 text-green-700 border-green-200", label: "Delivered" },
      CANCELLED: { color: "bg-red-50 text-red-700 border-red-200", label: "Cancelled" },
    }
    const config = statusConfig[status] || statusConfig.ORDER_PLACED

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-[#005C29] border-t-transparent rounded-full animate-spin"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500">Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 text-sm">When you place an order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id} className="block group">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:border-[#005C29]/30">
                  
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Order #{order.id}</p>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                        <Clock size={14} className="text-gray-400" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Order Items Summary */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Image Stacking Logic for multiple items */}
                      <div className="flex -space-x-4">
                        {order.items.slice(0, 3).map((_, idx) => (
                          <div key={idx} className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden relative shadow-sm">
                             {/* Fallback styling for mock data */}
                             <div className="absolute inset-0 bg-gray-200"></div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm z-10">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-gray-900">{formatRupee(order.grandTotal)}</p>
                        <p className="text-gray-500">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-[#005C29] transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}