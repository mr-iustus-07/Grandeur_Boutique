"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Package, 
  MapPin, 
  Heart, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShieldQuestion,
  User as UserIcon
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import { apiClient } from "@/lib/api-client"
// Assuming you have a user store or context, we'll mock the hook here
// import { useAuthStore } from "@/features/auth/store"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  // In production, fetch from your global state/backend
  // const { user, logout } = useAuthStore()
  
  // Mock User Data for UI compilation
  const user = {
    name: "Vijay",
    phone: "+91 98765 43210",
    email: "vijay@example.com",
    stats: {
      orders: 12,
      wishlist: 5,
    }
  }

  // 1. The Menu Configuration Array
  // This keeps your JSX incredibly clean and makes adding new pages easy
  const menuGroups = [
    {
      title: "My Activity",
      items: [
        { icon: Package, label: "My Orders", href: "/orders", value: `${user.stats.orders} Orders` },
        { icon: Heart, label: "Wishlist", href: "/wishlist", value: `${user.stats.wishlist} Items` },
      ]
    },
    {
      title: "Account Settings",
      items: [
        { icon: MapPin, label: "Saved Addresses", href: "/address", value: "" },
        { icon: Bell, label: "Notifications", href: "/profile/notifications", value: "" },
        { icon: Settings, label: "App Settings", href: "/profile/settings", value: "" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: ShieldQuestion, label: "Help & Support", href: "/support", value: "" },
      ]
    }
  ]

  // 2. Secure Logout Handler
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // await apiClient.post("/auth/logout", {})
      // await logout() // Clear Zustand state
      // clear cart if strictly required on logout
      
      setTimeout(() => {
        router.push("/login")
      }, 800)
    } catch (error) {
      console.error("Logout failed", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      
      {/* 3. The Premium Green Header Area */}
      <div className="bg-[#005C29] pt-12 pb-24 px-6 relative rounded-b-[40px] shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-5 relative z-10">
          {/* Avatar Profile Picture */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#005C29]/50 overflow-hidden flex-shrink-0">
            <UserIcon size={32} className="text-[#005C29]" />
            {/* <Image src={user.avatar} alt="..." fill className="object-cover" /> */}
          </div>
          
          <div className="text-white">
            <h1 className="text-2xl font-bold tracking-wide">{user.name}</h1>
            <p className="text-[#D4AF37] text-sm font-medium mt-1">{user.phone}</p>
            <p className="text-white/70 text-sm mt-0.5">{user.email}</p>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 -mt-12 relative z-20 space-y-6">
        
        {/* 4. The Stats Card (Floating over the green header) */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex divide-x divide-gray-100">
          <Link href="/orders" className="flex-1 flex flex-col items-center justify-center py-2 group">
            <span className="text-2xl font-bold text-gray-900 group-hover:text-[#005C29] transition-colors">{user.stats.orders}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Orders</span>
          </Link>
          <Link href="/wishlist" className="flex-1 flex flex-col items-center justify-center py-2 group">
            <span className="text-2xl font-bold text-gray-900 group-hover:text-[#005C29] transition-colors">{user.stats.wishlist}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Wishlist</span>
          </Link>
        </div>

        {/* 5. The iOS-Style Seamless Navigation Lists */}
        <div className="space-y-6 pt-2">
          {menuGroups.map((group, index) => (
            <div key={index}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                {group.title}
              </h3>
              
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon
                  const isLast = itemIdx === group.items.length - 1

                  return (
                    <Link 
                      key={itemIdx} 
                      href={item.href}
                      className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#005C29]/10 group-hover:text-[#005C29] transition-colors">
                          <Icon size={18} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.value && (
                          <span className="text-xs text-gray-500 font-medium">{item.value}</span>
                        )}
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#005C29] transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 6. The Logout Button */}
        <div className="pt-4 pb-8">
          <Button 
            variant="ghost" 
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 h-14 bg-white border border-gray-100 shadow-sm rounded-2xl"
            onClick={handleLogout}
            isLoading={isLoggingOut}
          >
            <LogOut size={18} />
            <span className="font-semibold">Log Out</span>
          </Button>
          <p className="text-center text-xs text-gray-400 mt-6">
            Grandeur Boutique v1.0.0
          </p>
        </div>

      </main>
    </div>
  )
}