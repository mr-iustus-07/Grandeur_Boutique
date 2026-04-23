"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/helpers"

export function BottomNav() {
  const pathname = usePathname()

  // Enterprise UX Rule: Hide bottom nav on specific deep-dive or auth screens
  const hiddenRoutes = ["/login", "/cart", "/checkout", "/address"]
  if (hiddenRoutes.some(route => pathname.startsWith(route))) {
    return null
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Category", href: "/category", icon: LayoutGrid },
    { name: "Cart", href: "/cart", icon: ShoppingBag },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Profile", href: "/profile", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex h-16 items-center justify-between px-6 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center w-full space-y-1"
            >
              <div 
                className={cn(
                  "p-1.5 rounded-full transition-all duration-300",
                  isActive ? "text-[#D4AF37] scale-110" : "text-gray-400 hover:text-gray-800"
                )}
              >
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2 : 1.5} 
                  className={cn(isActive && "fill-[#D4AF37]/10")} 
                />
              </div>
              {/* Optional: Tiny dot indicator for active state (Very premium UX) */}
              {isActive && (
                <span className="w-1 h-1 bg-[#D4AF37] rounded-full absolute bottom-2" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}