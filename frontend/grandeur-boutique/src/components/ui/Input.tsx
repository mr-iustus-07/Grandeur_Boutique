import * as React from "react"
import {cn} from "@/lib/helpers"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    propTypes?: unknown;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, propTypes, leftIcon, rightIcon, error, ...props}, ref)=> {
        return (
            <div className="w-full relative">
                {leftIcon && (
                    <div className = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 flex items-center justify-center">
                        {leftIcon}
                        </div>
                )}
                <input
                type={"text"}
                className={cn(
                    "flex h-14 w-full rounded-lg border bg-white px-4 py-2 text-sm text-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005C29] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    leftIcon ? "pl-10" : "",
                    rightIcon ? "pr-10" : "",
                    error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200",
                    className
                )}
                ref={ref}
                {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 flex items-center justify-center cursor-pointer hover:text-black transition-colors">
                        {rightIcon}
                    </div>
                )}
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        )
    }
)
Input.displayName = "Input"

export{Input}