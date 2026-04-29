import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Sparkles } from "lucide-react"

import { cn } from "@/lib/helpers"

// 1. Strict Size Variants
const loaderSizeVariants = cva("", {
  variants: {
    size: {
      sm: "w-4 h-4",
      default: "w-6 h-6",
      lg: "w-10 h-10",
      xl: "w-16 h-16",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loaderSizeVariants> {
  type?: "spinner" | "dots" | "brand"
  fullScreen?: boolean
  text?: string
  color?: "green" | "gold" | "white" | "gray"
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, type = "spinner", size, fullScreen = false, text, color = "gold", ...props }, ref) => {
    
    // 2. Dynamic Color Mapping
    const colorClasses = {
      green: "text-[#005C29]",
      gold: "text-[#D4AF37]",
      white: "text-white",
      gray: "text-gray-400",
    }
    const activeColor = colorClasses[color]

    // 3. Render Logic for Different Loader Types
    const renderLoaderContent = () => {
      switch (type) {
        case "dots":
          return (
            <div className={cn("flex items-center justify-center space-x-1.5", className)} {...props} ref={ref}>
              <div className={cn("rounded-full animate-bounce bg-current", loaderSizeVariants({ size }))} style={{ animationDelay: "0ms" }} />
              <div className={cn("rounded-full animate-bounce bg-current", loaderSizeVariants({ size }))} style={{ animationDelay: "150ms" }} />
              <div className={cn("rounded-full animate-bounce bg-current", loaderSizeVariants({ size }))} style={{ animationDelay: "300ms" }} />
              <span className="sr-only">Loading...</span>
            </div>
          )

        case "brand":
          return (
            <div className={cn("flex flex-col items-center justify-center space-y-4", className)} {...props} ref={ref}>
              <div className="relative flex items-center justify-center">
                {/* The glowing outer ring */}
                <div className={cn("absolute rounded-full border-2 border-current opacity-20 animate-ping", loaderSizeVariants({ size }))} />
                {/* The inner brand icon */}
                <Sparkles className={cn("animate-pulse", activeColor, loaderSizeVariants({ size }))} strokeWidth={1.5} />
              </div>
              {text && <p className="text-sm font-medium tracking-widest uppercase animate-pulse">{text}</p>}
              <span className="sr-only">{text || "Loading..."}</span>
            </div>
          )

        case "spinner":
        default:
          return (
            <div className={cn("flex flex-col items-center justify-center gap-3", className)} {...props} ref={ref}>
              <svg
                className={cn("animate-spin", activeColor, loaderSizeVariants({ size }))}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {text && <p className={cn("text-xs font-medium", activeColor)}>{text}</p>}
              <span className="sr-only">{text || "Loading..."}</span>
            </div>
          )
      }
    }

    // 4. Full-Screen Overlay Wrapper Logic
    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={activeColor}>
            {renderLoaderContent()}
          </div>
        </div>
      )
    }

    // Standard Inline Render
    return (
      <div className={activeColor}>
        {renderLoaderContent()}
      </div>
    )
  }
)

Loader.displayName = "Loader"