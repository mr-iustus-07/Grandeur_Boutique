"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/helpers"
import { Button } from "@/components/ui/Button"

// Define the precise data this card needs to render
export interface ProductCardProps {
  id: string;
  title: string; // The "Micro-Category" (e.g., "Emerald Georgette Saree")
  price: number;
  originalPrice?: number;
  imageUrl: string;
  isWishlistedInitial?: boolean;
  onAddToCart?: (id: string) => void;
  className?: string;
}

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  imageUrl,
  isWishlistedInitial = false,
  onAddToCart,
  className,
}: ProductCardProps) {
  // Optimistic UI State for the Wishlist
  const [isWishlisted, setIsWishlisted] = React.useState(isWishlistedInitial)

  // Enterprise Rupee Formatter
  const formatRupee = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate discount percentage dynamically
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault() // Prevents navigating to the PDP when clicking the heart
    setIsWishlisted(!isWishlisted)
    // TODO: Dispatch to backend/store here
  }

  return (
    <Link 
      href={`/product/${id}`}
      className={cn("group flex flex-col relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300", className)}
    >
      {/* 1. The Edge-to-Edge Image Container (4:5 Aspect Ratio for Fashion) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={false} // Only set to true if it's the first image above the fold
        />
        
        {/* The Wishlist Heart (Absolute positioning on top of image) */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all active:scale-90"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            size={18} 
            className={cn(
              "transition-colors duration-300", 
              isWishlisted ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-600"
            )} 
          />
        </button>

        {/* Optional: The Discount Tag */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* 2. The Content Area ("The Whisper" Strategy) */}
      <div className="p-4 flex flex-col gap-3">
        {/* The Micro-Category Title */}
        <h3 className="text-sm text-gray-700 font-medium line-clamp-1">
          {title}
        </h3>

        {/* The Pricing Line */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatRupee(price)}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatRupee(originalPrice)}
            </span>
          )}
        </div>

        {/* The Add to Cart Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-1 border-gray-200 text-gray-800 hover:border-[#005C29] hover:bg-[#005C29] hover:text-white transition-all group/btn"
          onClick={(e) => {
            e.preventDefault() // Prevents navigating to PDP
            if (onAddToCart) onAddToCart(id)
          }}
        >
          <ShoppingBag size={16} className="mr-2 group-hover/btn:animate-bounce" />
          Add to Cart
        </Button>
      </div>
    </Link>
  )
}