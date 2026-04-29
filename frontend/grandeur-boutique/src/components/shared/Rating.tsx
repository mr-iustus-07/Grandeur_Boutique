"use client"

import * as React from "react"
import { Star, StarHalf } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/helpers"

// 1. Size Variants using CVA
// Targets both the SVG size and the gap between stars
const ratingContainerVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "gap-0.5 text-xs",
      default: "gap-1 text-sm",
      lg: "gap-1.5 text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const starSizeVariants = cva("transition-all duration-200", {
  variants: {
    size: {
      sm: "w-3 h-3",
      default: "w-4 h-4",
      lg: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">, VariantProps<typeof ratingContainerVariants> {
  value: number; // The current rating (0-5)
  max?: number; // Usually 5
  reviewCount?: number; // Optional: To show "(124 Reviews)"
  isInteractive?: boolean; // Turns the component into an input for forms
  onChange?: (value: number) => void; // Callback for interactive mode
  showLabel?: boolean; // Whether to show the numerical text
  activeColor?: string; // Tailwind class for the filled star
  inactiveColor?: string; // Tailwind class for the empty star
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({
    className,
    value,
    max = 5,
    reviewCount,
    size,
    isInteractive = false,
    onChange,
    showLabel = true,
    activeColor = "text-[#D4AF37] fill-[#D4AF37]", // Grandeur Gold
    inactiveColor = "text-gray-200 fill-gray-200", // Soft Grey
    ...props
  }, ref) => {
    // State for interactive hover effects
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)

    // Calculate the visual value (Hover takes priority if interactive)
    const displayValue = hoverValue !== null ? hoverValue : value

    // 2. The Star Rendering Engine
    const renderStar = (index: number) => {
      // index represents the star number (1, 2, 3, 4, 5)
      const isFull = displayValue >= index
      const isHalf = displayValue >= index - 0.5 && displayValue < index

      const starClasses = cn(
        starSizeVariants({ size }),
        isFull || isHalf ? activeColor : inactiveColor,
        isInteractive && "cursor-pointer hover:scale-110"
      )

      // Handle Interactive Clicks
      const handleClick = () => {
        if (isInteractive && onChange) {
          onChange(index)
        }
      }

      const handleMouseEnter = () => {
        if (isInteractive) setHoverValue(index)
      }

      if (isHalf) {
        return (
          <div 
            key={index} 
            className="relative" 
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
          >
            {/* Background empty star */}
            <Star className={cn(starSizeVariants({ size }), inactiveColor)} />
            {/* Overlay half star */}
            <StarHalf className={cn("absolute top-0 left-0", starClasses)} />
          </div>
        )
      }

      return (
        <Star
          key={index}
          className={starClasses}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
        />
      )
    }

    return (
      <div 
        ref={ref} 
        className={cn(ratingContainerVariants({ size }), className)}
        onMouseLeave={() => isInteractive && setHoverValue(null)}
        {...props}
      >
        {/* Screen Reader Label */}
        <span className="sr-only">
          {value} out of {max} stars. {reviewCount ? `${reviewCount} reviews.` : ""}
        </span>

        {/* Render the Stars */}
        <div className="flex items-center" aria-hidden="true">
          {Array.from({ length: max }, (_, i) => renderStar(i + 1))}
        </div>

        {/* Optional Label rendering */}
        {showLabel && (
          <div className="flex items-center gap-1.5 ml-1.5 text-gray-500 font-medium">
            <span className={cn(value > 0 ? "text-gray-900" : "")}>
              {value > 0 ? value.toFixed(1) : "No ratings yet"}
            </span>
            {reviewCount !== undefined && reviewCount > 0 && (
              <span className="text-gray-400 font-normal">
                ({reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Rating.displayName = "Rating"