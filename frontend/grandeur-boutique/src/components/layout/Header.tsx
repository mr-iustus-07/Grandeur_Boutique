"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/helpers"

interface HeaderProps {
    className?: string;
}


  // ... the rest of your header code ...
export function Header({ className }: HeaderProps) {
    const router = useRouter()
    const pathname = usePathname()

    if (pathname === "/login" || pathname === "/signup") {
        return null;
    }
    
    // Define which routes are "Root" (No back button needed)
    const isRootPage = pathname === "/" || pathname === "/home"

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full bg-[#005C29] shadow-md",
                className
            )}
        >
            {/* Increased height from h-20 to h-24 (96px) */}
            <div className="flex h-24 items-center justify-between px-4 max-w-md mx-auto">
                
                {/* LEFT: Fixed width container (w-20) to balance the right side */}
                <div className="flex items-center justify-start ">
                    {isRootPage ? (
                        <button type="button" className="p-2 -ml-2 transition-transform active:scale-95" aria-label="Open Menu">
                            <Image 
                                src="/images/menu-icon.png" 
                                alt="Menu" 
                                width={16}
                                height={33}
                                className="w-auto h-auto object-contain" 
                            />
                        </button>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => router.back()} 
                            className="p-1 -ml-2 transition-transform active:scale-95" 
                            aria-label="Go Back"
                        >
                            <Image 
                                src="/images/back-icon.png" 
                                alt="Back" 
                                width={32}
                                height={32}
                                className="h-full w-auto object-contain" 
                            />
                        </button>
                    )}
                </div>

                {/* CENTER: The Grandeur Brand Logo Image */}
                <div className="flex-1 flex justify-center items-center gap-2">
                    <Link href="/" className="inline-block transition-transform active:scale-95">
                        <Image 
                            src="/images/brand-logo-1.png" 
                            alt="Grandeur Boutique" 
                            width={200}
                            height={65}
                            className="h-full sm:h-full w-auto object-contain" 
                        />
                    </Link>
                </div>

                {/* RIGHT: Fixed width container (w-20) to balance the left side */}
                <div className="flex items-center justify-end gap-1 ">
                    <Link href="/search" className="p-2 transition-transform active:scale-95">
                        <Image 
                            src="/images/search-icon.png" 
                            alt="Search" 
                            width={16}
                            height={20}
                            className="h-auto w-auto object-contain" 
                        />
                    </Link>
                    <Link href="/profile" className="p-1 -mr-1 transition-transform active:scale-95">
                        <Image 
                            src="/images/profile-icon.png" 
                            alt="Profile" 
                            width={28}
                            height={28}
                            className="h-full w-auto object-contain" 
                        />
                    </Link>
                </div>

            </div>
        </header>
    )
}