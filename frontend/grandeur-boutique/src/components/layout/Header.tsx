"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, Search, ArrowLeft, User } from "lucide-react"
import { cn } from "@/lib/helpers"

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Define which routes are "Root" (No back button needed)
  const isRootPage = pathname === "/" || pathname === "/home"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 max-w-md mx-auto">
        
        {/* LEFT: Dynamic Icon (Menu vs Back) */}
        <div className="flex items-center">
          {isRootPage ? (
            <button className="p-2 -ml-2 text-gray-800 hover:text-[#005C29] transition-colors" aria-label="Open Menu">
              <Menu size={24} strokeWidth={1.5} />
            </button>
          ) : (
            <button 
              onClick={() => router.back()} 
              className="p-2 -ml-2 text-gray-800 hover:text-[#005C29] transition-colors" 
              aria-label="Go Back"
            >
              <ArrowLeft size={24} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* CENTER: The Grandeur Brand (Script Logo Placeholder) */}
        <div className="flex-1 text-center">
          <Link href="/" className="inline-block">
            {/* Replace this text with your actual beautiful script logo SVG */}
            <h1 className="font-serif text-2xl tracking-wide text-[#005C29] font-bold">
              Grandeur
            </h1>
          </Link>
        </div>

        {/* RIGHT: Utility Icons */}
        <div className="flex items-center gap-2">
          <Link href="/search" className="p-2 text-gray-800 hover:text-[#005C29] transition-colors">
            <Search size={22} strokeWidth={1.5} />
          </Link>
          <Link href="/login" className="p-2 -mr-2 text-gray-800 hover:text-[#005C29] transition-colors">
            <User size={22} strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </header>
  )
}