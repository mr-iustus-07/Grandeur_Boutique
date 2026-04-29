"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Search as SearchIcon, 
  Camera, 
  X, 
  Clock, 
  TrendingUp,
  ArrowRight
} from "lucide-react"

import { ProductSummary } from "@/types/product"
import { ProductCard } from "@/components/shared/ProductCard"

export default function SearchPage() {
  return (
    <React.Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </React.Suspense>
  )
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = React.useState(initialQuery)
  const [results, setResults] = React.useState<ProductSummary[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)

  // ✅ FIXED: Initialize from localStorage with lazy initialization
  const [recentSearches, setRecentSearches] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem("grandeur_recent_searches")
    return saved ? JSON.parse(saved) : []
  })

  // ✅ CLEAN EFFECT: Only handle search logic when query changes
  React.useEffect(() => {
    if (!query.trim()) {
    // ✅ move to async-safe pattern
        Promise.resolve().then(() => {
        setResults([])
        setHasSearched(false)
        })
        return
    }

    router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false })

    const performSearch = async () => {
        setIsSearching(true)

        await new Promise(r => setTimeout(r, 500))

        const data: ProductSummary[] = [
        {
            id: "1",
            slug: "test",
            name: "Test Product",
            category: "ANARKALIS", // Use the correct ProductCategory enum value here
            basePrice: 50000,
            originalPrice: 60000,
            primaryImageUrl: "/mock.jpg",
            images: ["/mock.jpg"],
            averageRating: 4,
            reviewCount: 10,
            isNewArrival: false
        }
        ]

    // ✅ all state updates inside async function
        setResults(data)
        setHasSearched(true)
        setIsSearching(false)
    }

    const timer = setTimeout(performSearch, 500)
    return () => clearTimeout(timer)

    }, [query, router])

  const handleSaveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return

    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm)
    ].slice(0, 5)

    setRecentSearches(updated)
    localStorage.setItem("grandeur_recent_searches", JSON.stringify(updated))
  }

  const handleVisualSearch = () => {
    alert("Enterprise Visual Search (Camera) API integration goes here.")
  }

  const clearSearch = () => {
    setQuery("")
  }

  const trendingSearches = ["Bridal Lehenga", "Silk Sarees", "Velvet Gowns", "Pastel Shades"]

  const categories = [
    { name: "New Arrivals", image: "/cat-new.jpg" },
    { name: "Bestsellers", image: "/cat-best.jpg" },
  ]

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-md mx-auto relative flex items-center">
          <SearchIcon size={20} className="absolute left-4 text-gray-400" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveSearch(query)}
            placeholder="Search Your Elegance..."
            className="w-full bg-gray-50 text-gray-900 border-none rounded-2xl py-3.5 pl-12 pr-20 focus:ring-2 focus:ring-[#005C29]/20 focus:bg-white transition-all text-sm font-medium"
            autoFocus
          />

          <div className="absolute right-3 flex items-center gap-2">
            {query ? (
              <button onClick={clearSearch} className="p-1 text-gray-400 hover:text-gray-900" aria-label="Clear Search">
                <X size={18} />
              </button>
            ) : (
              <button aria-label="Visual Search" onClick={handleVisualSearch} className="p-1.5 text-[#005C29] bg-[#005C29]/10 rounded-full hover:bg-[#005C29]/20 transition-colors">
                <Camera size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto p-4">

        {isSearching && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <SearchSkeleton />
            <SearchSkeleton />
          </div>
        )}

        {!isSearching && hasSearched && results.length > 0 && (
          <div className="mt-2 space-y-4">
            <p className="text-sm text-gray-500 font-medium">
              Showing results for {query}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {results.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  price={product.basePrice}
                  originalPrice={product.originalPrice}
                  imageUrl={product.images[0] || "/placeholder.jpg"}
                />
              ))}
            </div>
          </div>
        )}

        {!isSearching && hasSearched && results.length === 0 && (
          <div className="mt-16 text-center px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No matching elegance found
            </h3>
            <p className="text-sm text-gray-500">
              Try searching for different keywords, categories, or colors.
            </p>
          </div>
        )}

        {!query && (
          <div className="space-y-8 mt-2 animate-in fade-in duration-500">

            {recentSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Recent Searches
                  </h3>

                  <button
                    onClick={() => {
                      setRecentSearches([])
                      localStorage.removeItem("grandeur_recent_searches")
                    }}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setQuery(term)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors border border-gray-100"
                    >
                      <Clock size={14} className="text-gray-400" />
                      {term}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#D4AF37]" />
                Trending Now
              </h3>

              <div className="space-y-3">
                {trendingSearches.map((term, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setQuery(term)}
                    className="w-full flex items-center justify-between py-2 text-left group"
                  >
                    <span className="text-sm text-gray-600 group-hover:text-[#005C29] transition-colors">
                      {term}
                    </span>

                    <ArrowRight size={16} className="text-gray-300 group-hover:text-[#005C29] transition-colors" />
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Explore Categories
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer bg-gray-100">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-serif font-bold tracking-wide">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

      </main>
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full animate-pulse">
      <div className="w-full aspect-[4/5] bg-gray-100 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  )
}