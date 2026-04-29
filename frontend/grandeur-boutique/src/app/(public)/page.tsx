"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { ProductCard } from "@/components/shared/ProductCard"
import { ProductSummary } from "@/types/product"
// import { apiClient } from "@/lib/api-client"

// 1. Mock Data (Replace with API calls in production)
const HERO_SLIDES = [
  {
    id: 1,
    image: "/mock-hero-1.jpg", // Ensure you have high-res 4:5 or 16:9 images
    title: "The Royal Bridal Collection",
    subtitle: "Handcrafted elegance for your timeless moments.",
    cta: "Explore Collection",
    link: "/category/bridal"
  },
  {
    id: 2,
    image: "/mock-hero-2.jpg",
    title: "Velvet & Zardozi",
    subtitle: "Winter festive arrivals are here.",
    cta: "Shop New",
    link: "/category/new-arrivals"
  }
]

const CATEGORIES = [
  { id: "cat1", name: "Bridal Lehengas", image: "/mock-cat-1.jpg" },
  { id: "cat2", name: "Silk Sarees", image: "/mock-cat-2.jpg" },
  { id: "cat3", name: "Anarkalis", image: "/mock-cat-3.jpg" },
  { id: "cat4", name: "Gowns", image: "/mock-cat-4.jpg" },
]

export default function HomePage() {
  // 2. Hero Carousel State
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [trendingProducts, setTrendingProducts] = React.useState<ProductSummary[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // 3. Auto-play Hero Slider Engine
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000) // Change slide every 5 seconds
    return () => clearInterval(timer)
  }, [])

  // 4. Data Fetching
  React.useEffect(() => {
    // Production: await apiClient.get<ProductSummary[]>("/products/trending")
    setTimeout(() => {
      setTrendingProducts([
        { id: "1", name: "The Ivory Pearl Satin Anarkali", slug: "ivory-pearl-satin-anarkali", basePrice: 85000, category: "ANARKALIS", primaryImageUrl: "/mock-dress-1.jpg", images: ["/mock-dress-1.jpg"], averageRating: 4.8, reviewCount: 24, isNewArrival: true },
        { id: "2", name: "Emerald Velvet Lehenga", slug: "emerald-velvet-lehenga", basePrice: 120000, originalPrice: 150000, category: "BRIDAL_LEHENGAS", primaryImageUrl: "/mock-dress-2.jpg", images: ["/mock-dress-2.jpg"], averageRating: 4.9, reviewCount: 35, isNewArrival: true },
        { id: "3", name: "Midnight Blue Silk Saree", slug: "midnight-blue-silk-saree", basePrice: 45000, category: "SILK_SAREES", primaryImageUrl: "/mock-dress-3.jpg", images: ["/mock-dress-3.jpg"], averageRating: 4.7, reviewCount: 18, isNewArrival: true },
        { id: "4", name: "Rose Gold Reception Gown", slug: "rose-gold-reception-gown", basePrice: 95000, category: "EVENING_GOWNS", primaryImageUrl: "/mock-dress-4.jpg", images: ["/mock-dress-4.jpg"], averageRating: 4.6, reviewCount: 28, isNewArrival: true },
      ])
      setIsLoading(false)
    }, 800)
  }, [])

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 5. Edge-to-Edge Hero Carousel */}
      <section className="relative w-full h-[70vh] max-h-[800px] bg-gray-900 overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Fallback grey background if image fails/loads slow */}
            <div className="absolute inset-0 bg-gray-800" />
            {/* <Image src={slide.image} alt={slide.title} fill priority={index === 0} className="object-cover opacity-80" /> */}
            
            {/* Luxury Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 max-w-md mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-3 tracking-wide drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-white/90 text-sm mb-6 max-w-xs mx-auto drop-shadow-md">
                {slide.subtitle}
              </p>
              <Link 
                href={slide.link}
                className="inline-flex items-center justify-center h-12 px-8 bg-white text-gray-900 font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] hover:text-white transition-colors duration-300"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentSlide ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <main className="max-w-md mx-auto space-y-12 pt-10 px-4">
        
        {/* 6. Shop by Category (Horizontal Scroll) */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Shop by Category</h3>
          </div>
          
          {/* Note: In tailwind.config.js, add a plugin or CSS to hide scrollbars (.scrollbar-hide) */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
            {CATEGORIES.map((category) => (
              <Link 
                href={`/category/${category.id}`} 
                key={category.id}
                className="relative w-28 h-28 flex-shrink-0 rounded-full overflow-hidden group snap-start border border-gray-100 p-1"
              >
                <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100">
                  {/* <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" /> */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                {/* Category Label placed below the circle for a clean look */}
                <span className="absolute -bottom-6 left-0 right-0 text-center text-xs font-semibold text-gray-800">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
          {/* Spacer for category labels */}
          <div className="h-6"></div>
        </section>

        {/* 7. Brand Story / Trust Banner */}
        <section className="bg-[#005C29]/5 rounded-2xl p-6 border border-[#005C29]/10 text-center relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-[#D4AF37]/40" size={24} />
          <h3 className="font-serif text-xl text-[#005C29] font-bold mb-2">Bespoke Elegance</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Every piece at Grandeur is handcrafted by master artisans. Looking for a custom fit?
          </p>
          <Link 
            href="/custom-orders"
            className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-[#005C29] transition-colors border-b border-[#D4AF37] pb-1"
          >
            Explore Customization
          </Link>
        </section>

        {/* 8. Trending Collection (Grid) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Trending Now</h3>
            <Link href="/category/trending" className="text-sm text-[#005C29] font-medium flex items-center hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse flex flex-col gap-2">
                  <div className="aspect-[4/5] bg-gray-100 rounded-2xl w-full" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mt-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  price={product.basePrice}
                  originalPrice={product.originalPrice}
                  imageUrl={product.images[0]}
                  isWishlistedInitial={false}
                />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}