import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/helpers"

// 1. Strict Size Variants using CVA
// This allows the Price component to seamlessly fit in a tiny cart row or a massive PDP hero
const priceVariants = cva("flex flex-wrap items-baseline gap-2", {
  variants: {
    size: {
      sm: "text-sm",          // Used in Cart or dense grids
      default: "text-base",   // Used in standard Product Cards
      lg: "text-xl",          // Used in Checkout Summaries
      xl: "text-2xl",         // Used on the main Product Details Page (PDP)
    },
    layout: {
      row: "flex-row items-baseline",
      column: "flex-col items-start gap-1",
    }
  },
  defaultVariants: {
    size: "default",
    layout: "row",
  },
})

export interface PriceProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof priceVariants> {
  amount: number;
  originalAmount?: number;
  currencyCode?: string;
  locale?: string;
  showDiscountBadge?: boolean;
}

export const Price = React.forwardRef<HTMLDivElement, PriceProps>(
  ({ 
    className, 
    amount, 
    originalAmount, 
    size, 
    layout,
    currencyCode = "INR", 
    locale = "en-IN", 
    showDiscountBadge = true,
    ...props 
  }, ref) => {
    
    // 2. Enterprise Intl Formatter
    // Memoized to prevent unnecessary recalculations on re-renders
    const formatCurrency = React.useCallback(
      (value: number) => {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "INR",
          // Luxury rule: No decimals for high-ticket items unless absolutely necessary
          maximumFractionDigits: value % 1 === 0 ? 0 : 2,
          minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        }).format(value)
      },
      [locale, currencyCode]
    )

    // 3. Discount Calculation Engine
    const isOnSale = originalAmount !== undefined && originalAmount > amount
    const discountPercentage = isOnSale 
      ? Math.round(((originalAmount - amount) / originalAmount) * 100) 
      : 0

    return (
      <div 
        ref={ref} 
        className={cn(priceVariants({ size, layout, className }))} 
        {...props}
      >
        {/* Current / Sale Price */}
        <div className="flex items-baseline gap-1">
          <span className="sr-only">{isOnSale ? "Sale price:" : "Price:"}</span>
          <span className="font-bold text-gray-900 tracking-tight">
            {formatCurrency(amount)}
          </span>
        </div>

        {/* Original Price (Strike-through) */}
        {isOnSale && (
          <div className="flex items-center gap-2">
            <span className="sr-only">Original price:</span>
            <span 
              className={cn(
                "text-gray-400 line-through decoration-gray-300 font-medium",
                size === "sm" ? "text-xs" : 
                size === "xl" ? "text-lg" : 
                "text-sm"
              )}
            >
              {formatCurrency(originalAmount)}
            </span>

            {/* Dynamic Discount Badge */}
            {showDiscountBadge && discountPercentage > 0 && (
              <span 
                className={cn(
                  "font-bold uppercase tracking-wider text-[#005C29]",
                  size === "sm" ? "text-[10px]" : 
                  size === "xl" ? "text-sm" : 
                  "text-xs"
                )}
              >
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Price.displayName = "Price"