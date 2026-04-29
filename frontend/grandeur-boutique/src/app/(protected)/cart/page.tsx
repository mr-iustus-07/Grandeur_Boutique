"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { useCartStore } from "@/features/cart/store"

export default function CartPage() {
  const router = useRouter()
  
  // 1. The Hydration Fix
  const mountedRef = React.useRef(false)
  React.useEffect(() => {
    mountedRef.current = true
    return () => {
        mountedRef.current = false
    }
    }, [])
  // 2. Zustand State Connections
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getTotalDiscount 
  } = useCartStore()

  // 3. Financial Formatters
  const formatRupee = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const subtotal = getSubtotal()
  const discount = getTotalDiscount()
  
  // 4. Empty State UX
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs">
          Looks like you havent added any elegance to your cart yet.
        </p>
        <Link href="/">
          <Button className="px-8">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Note: Header with Back button is assumed to be in layout.tsx */}
      
      <main className="max-w-md mx-auto p-4 space-y-8">
        
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
          <p className="text-sm text-gray-500">{items.length} Items</p>
        </div>

        {/* 5. The Cart Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.cartItemId} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm relative group">
              
              {/* Product Thumbnail */}
              <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between flex-grow py-1">
                <div className="pr-8">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-1">
                    {item.title}
                  </h3>
                  
                  {/* The Size Indicator (From your Figma update) */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Size:</span>
                    <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-xs font-medium text-gray-700">
                      {item.size}
                    </span>
                  </div>
                </div>

                {/* Price & Quantity Controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{formatRupee(item.price)}</span>
                  </div>

                  {/* High-End Quantity Selector */}
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-2 text-gray-500 hover:text-black transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-2 text-gray-500 hover:text-black transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove Button (Top Right) */}
              <button 
                onClick={() => removeItem(item.cartItemId)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 bg-white/80 backdrop-blur-sm rounded-full transition-colors"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* 6. The Cross-Sell Section (You May Also Like) */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">You may also like</h3>
          {/* Scrollable horizontal list for cross-sells */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Placeholder for a cross-sell item - Replace with actual data mapping */}
            <div className="w-32 flex-shrink-0">
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 mb-2">
                {/* Dummy Image for now */}
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              </div>
              <h4 className="text-xs font-medium text-gray-900 line-clamp-1">Bridal Dupatta</h4>
              <p className="text-xs text-gray-500 font-bold mt-1">₹3,500</p>
            </div>
             <div className="w-32 flex-shrink-0">
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 mb-2">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              </div>
              <h4 className="text-xs font-medium text-gray-900 line-clamp-1">Kundan Necklace</h4>
              <p className="text-xs text-gray-500 font-bold mt-1">₹8,000</p>
            </div>
          </div>
        </div>

        {/* 7. Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatRupee(subtotal + discount)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-[#005C29] font-medium">
              <span>Discount</span>
              <span>- {formatRupee(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span className="text-[#005C29] font-medium">Free</span>
          </div>
          
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="text-lg font-bold text-gray-900">{formatRupee(subtotal)}</span>
          </div>
        </div>

        {/* Safe Area Spacer for scrolling past the sticky button */}
        <div className="h-6"></div> 
      </main>

      {/* 8. The Sticky Checkout Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <div className="max-w-md mx-auto flex gap-4 items-center">
          <Button 
            className="w-full h-14 text-base tracking-wide flex items-center justify-between px-6"
            onClick={() => router.push("/address")}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{formatRupee(subtotal)}</span>
              <ArrowRight size={18} />
            </div>
          </Button>
        </div>
      </div>

    </div>
  )
}