"use client"

import * as React from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp,
  Ruler
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import { useCartStore } from "@/features/cart/store"
import { Product, ProductSize } from "@/types/product"
// import { apiClient } from "@/lib/api-client"

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  
  // 1. Core State
  const [product, setProduct] = React.useState<Product | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  
  // 2. Interactive UI State
  const [activeImageIndex, setActiveImageIndex] = React.useState(0)
  const [selectedSize, setSelectedSize] = React.useState<ProductSize | null>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false)
  const [isAddingToCart, setIsAddingToCart] = React.useState(false)

  // 3. Global Cart Action
  const addItem = useCartStore((state) => state.addItem)

  React.useEffect(() => {
    // In production: await apiClient.get<Product>(`/products/${params.id}`)
    
    // Mocking high-end data
    setTimeout(() => {
      setProduct({
        id: params.id as string,
        slug: "crimson-royal-lehenga",
        name: "The Crimson Royal Silk Bridal Lehenga",

        description: "Handcrafted over 400 hours...",
        shortDescription: "Luxury bridal lehenga",

        category: "BRIDAL_LEHENGAS",
        tags: ["Bridal", "Red", "Silk"],

        basePrice: 85000,
        salePrice: 75000,
        isTaxable: true,
        sku: "SKU-LEH-001",
        status: "ACTIVE",

        availableSizes: ["S", "M", "L", "XL"],
        stockCount: 10,

        images: [
            {
            id: "img1",
            url: "/mock-lehenga-1.jpg",
            altText: "Lehenga Front",
            isPrimary: true,
            displayOrder: 1
            },
            {
            id: "img2",
            url: "/mock-lehenga-2.jpg",
            altText: "Lehenga Back",
            isPrimary: false,
            displayOrder: 2
            }
        ],

        fabric: "Raw Silk",
        careInstructions: "Dry Clean Only",
        deliveryTimelineDays: 14,

        averageRating: 4.5,
        reviewCount: 120,

        isCustomizable: true,
        isTrending: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        })
      setIsLoading(false)
    }, 600)
  }, [params.id])

  const formatRupee = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
  }

  // 4. Action Handlers
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.")
      return
    }
    
    setIsAddingToCart(true)
    
    // Simulate slight delay for premium feel
    setTimeout(() => {
      addItem({
        id: product!.id,
        title: product!.name,
        price: product!.salePrice ?? product!.basePrice,
        originalPrice: product!.basePrice,
        imageUrl: product!.images[0].url,
        size: selectedSize,
      })
      setIsAddingToCart(false)
      // Optional: Trigger a beautiful success toast here
      router.push("/cart")
    }, 400)
  }

  const handleWhatsAppCustomization = () => {
    const message = encodeURIComponent(
      `Hello Grandeur Boutique! I'm interested in customizing "${product?.name}" (ID: ${product?.id}). Could you share more details?`
    )
    // Replace with your Mom's actual WhatsApp Business Number
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank")
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-[#005C29] border-t-transparent rounded-full animate-spin"></span>
      </div>
    )
  }

  const discountPercentage = product.basePrice 
    ? Math.round(((product.basePrice - (product.salePrice ?? product.basePrice)) / product.basePrice) * 100) 
    : 0

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Note: The top-left Back Arrow header is handled by your global Layout.
        Ensure your Header component is transparent or unmounted here if you want 
        the image to go perfectly to the top of the screen like in iOS native apps.
      */}

      {/* 5. Edge-to-Edge Image Gallery */}
      <div className="relative w-full aspect-[4/5] bg-gray-50">
        <Image
          src={product.images[activeImageIndex].url}
          alt={product.name}
          fill
          priority
          className="object-cover transition-opacity duration-500"
        />
        
        {/* Floating Actions (Wishlist & Share) */}
        <div className="absolute top-4 right-4 flex flex-col gap-3">
          <button type="button" title="Add to wishlist" className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-sm hover:bg-white transition-colors">
            <Heart size={20} />
          </button>
          <button type="button" title="Share product" className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-sm hover:bg-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        {/* Gallery Pagination Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                title={`View image ${idx + 1}`}
                aria-label={`View image ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImageIndex === idx ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <main className="max-w-md mx-auto px-5 py-6 space-y-8">
        
        {/* 6. Title & Pricing Sector */}
        <div className="space-y-3">
          {product.isTrending && (
            <span className="px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider rounded-sm">
              Trending Boutique Pick
            </span>
          )}
          <h1 className="text-2xl font-serif font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-end gap-3 pt-1">
            <span className="text-2xl font-bold text-gray-900">
              {formatRupee(product.salePrice ?? product.basePrice)}
            </span>
            {product.basePrice && (
              <>
                <span className="text-base text-gray-400 line-through mb-0.5">
                  {formatRupee(product.basePrice)}
                </span>
                <span className="text-sm font-bold text-[#005C29] mb-0.5">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500">Inclusive of all taxes</p>
        </div>

        {/* 7. The Size Selector */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Select Size</h3>
            <button type="button" className="text-xs text-[#005C29] font-medium flex items-center gap-1 hover:underline">
              <Ruler size={14} /> Size Guide
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {product.availableSizes.map((size) => {
                const isSelected = selectedSize === size

                return (
                    <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    title={`Select size ${size}`}
                    aria-label={`Select size ${size}`}
                    className={`w-12 h-12 rounded-full ${
                        isSelected ? "bg-black text-white" : "bg-white"
                }`}
                    >
                    {size}
                    </button>
                )
    })}
          </div>
        </div>

        {/* 8. Collapsible Description */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="font-bold text-gray-900">Product Details</h3>
          <div className="relative">
            <p className={`text-sm text-gray-600 leading-relaxed ${!isDescriptionExpanded ? "line-clamp-3" : ""}`}>
              {product.description}
            </p>
            {/* Soft fade effect when collapsed */}
            {!isDescriptionExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          <button 
            type="button"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="text-sm font-semibold text-[#005C29] flex items-center gap-1"
          >
            {isDescriptionExpanded ? (
              <>Read Less <ChevronUp size={16} /></>
            ) : (
              <>Read More <ChevronDown size={16} /></>
            )}
          </button>
        </div>

      </main>

      {/* 9. The Dual-Action Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50 pb-safe">
        <div className="max-w-md mx-auto flex gap-3">
          
          {/* Customization Route (WhatsApp) */}
          {product.isCustomizable && (
            <Button 
              variant="outline"
              className="flex-1 h-14 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 gap-2"
              onClick={handleWhatsAppCustomization}
            >
              <MessageCircle size={20} />
              Customize
            </Button>
          )}

          {/* Direct Sales Route (Cart) */}
          <Button 
            className={`h-14 gap-2 transition-all ${product.isCustomizable ? "flex-1" : "w-full"}`}
            onClick={handleAddToCart}
            isLoading={isAddingToCart}
            disabled={!selectedSize && !isAddingToCart}
          >
            <ShoppingBag size={20} />
            {selectedSize ? "Add to Cart" : "Select Size"}
          </Button>
        </div>
      </div>

    </div>
  )
}