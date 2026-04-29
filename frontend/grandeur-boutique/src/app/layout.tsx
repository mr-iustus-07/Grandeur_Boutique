import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"

import { Header } from "@/components/layout/Header"
import { BottomNav } from "@/components/layout/BottomNav"
import { Providers } from "./providers"
import "./globals.css"

// 1. Next.js Native Font Optimization
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  display: "swap",
})

// 2. Mobile Native App Viewport Locking
export const viewport: Viewport = {
  themeColor: "#005C29", // Grandeur Green for the mobile browser status bar
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // CRITICAL: Prevents double-tap zoom on iOS
  userScalable: false,
}

// 3. Enterprise SEO & Metadata
export const metadata: Metadata = {
  title: {
    template: "%s | Grandeur Boutique",
    default: "Grandeur Boutique | Luxury Handcrafted Elegance",
  },
  description: "Discover be spoke bridal lehengas, silk sarees, and handcrafted luxury fashion.",
  metadataBase: new URL("https://grandeurboutique.com"),
  openGraph: {
    title: "Grandeur Boutique",
    description: "Luxury Handcrafted Elegance",
    url: "https://grandeurboutique.com",
    siteName: "Grandeur Boutique",
    images: [
      {
        url: "/og-image.jpg", // Create a beautiful 1200x630 banner for WhatsApp/iMessage sharing
        width: 1200,
        height: 630,
        alt: "Grandeur Boutique Luxury Fashion",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Providers>
          
          {/* Global Smart Navigation */}
          {/* These components internally decide when to hide themselves using usePathname */}
          <Header />
          
          {/* Main Content Render */}
          {/* We wrap children in a flex-grow container to push the footer down if needed */}
          <div className="flex-grow flex flex-col relative">
            {children}
          </div>
          
          <BottomNav />

        </Providers>
      </body>
    </html>
  )
}