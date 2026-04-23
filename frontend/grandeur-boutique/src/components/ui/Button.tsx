import * as React from  "react"
import { cva, type VariantProps } from "class-variance-authority"
import {cn} from "@/lib/helpers" //Adjust path to your utils

const buttonVariants = cva(
    "inline-fles items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background trnsition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants:{
            variant:{
                default: "bg-[#005C29] text-white hover:bg-[#004A21] shadow-md",
                gold: "bg-[#D4AF37] text-black hover:bg-[#C5A028] shadow-md",
                outline: "border-2 border-[#005C29] text-[#005C29] hover:bg-[#005C29]/10",
                ghost: "hover:bg-gray-100 text-gray-700",
                link: "text-[#005C29] underline-offset-4 hoover:underline",
            },
            size:{
                default: "h-12 py-2 px-6",
                sm: "h-9 rounded-md py-2 px-3",
                lg: "h-14 rounded-xl py-3 px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants:{
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, ...props}, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className}))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"
export { Button, buttonVariants}