import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/helpers" // Adjust path if your tailwind-merge utility is elsewhere

// 1. Define strict container variants
const containerVariants = cva(
  "mx-auto w-full px-4 sm:px-6 transition-all duration-300",
  {
    variants: {
      size: {
        // Mobile-first default to maintain the curated app-like feel on desktop
        default: "max-w-md", 
        sm: "max-w-sm",
        md: "max-w-2xl", // Useful for tablet-focused screens like checkout
        lg: "max-w-5xl", // For wider data grids or admin dashboards
        xl: "max-w-7xl",
        fluid: "max-w-full px-0 sm:px-0", // Edge-to-edge for hero carousels
      },
      // Optional vertical padding variant to keep spacing consistent
      spacing: {
        none: "py-0",
        sm: "py-4",
        default: "py-8",
        lg: "py-12 pb-32", // Accounts for the sticky bottom nav automatically
      }
    },
    defaultVariants: {
      size: "default",
      spacing: "none",
    },
  }
)

export interface ContainerProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof containerVariants> {
  as?: React.ElementType; // The Polymorphic prop
}

const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, size, spacing, as: Component = "div", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size, spacing, className }))}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Container.displayName = "Container"

export { Container, containerVariants }