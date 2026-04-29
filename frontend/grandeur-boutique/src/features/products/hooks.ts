import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { productsApi, GetProductsParams } from "./api"

// 1. Query Keys (Centralized Dictionary)
export const PRODUCT_KEYS = {
  all: ["products"] as const,
  list: (params: GetProductsParams) => ["products", "list", params] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  trending: () => ["products", "trending"] as const,
  related: (id: string) => ["products", "related", id] as const,
}

// 2. The Infinite Scroll Hook (Catalog & Category Pages)
export function useInfiniteProducts(params: Omit<GetProductsParams, "cursor">) {
  return useInfiniteQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: ({ pageParam = undefined }) => 
      productsApi.getProducts({ ...params, cursor: pageParam }),
    
    // React Query uses this to figure out what to pass as `pageParam` for the next fetch
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: undefined as string | undefined,
    
    // Keep the catalog fresh for 10 minutes to save DB reads
    staleTime: 10 * 60 * 1000, 
  })
}

// 3. The Deep Dive Hook (Product Details Page)
export function useProductDetails(productId: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(productId),
    queryFn: () => productsApi.getProductDetails(productId),
    enabled: !!productId,
    // PDP data rarely changes by the minute. Cache it heavily.
    staleTime: 15 * 60 * 1000, 
  })
}

// 4. The Home Page Curations
export function useTrendingProducts() {
  return useQuery({
    queryKey: PRODUCT_KEYS.trending(),
    queryFn: productsApi.getTrendingProducts,
    staleTime: 30 * 60 * 1000, // 30 minutes (trending items change slowly)
  })
}

export function useRelatedProducts(productId: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.related(productId),
    queryFn: () => productsApi.getRelatedProducts(productId),
    enabled: !!productId,
    staleTime: 30 * 60 * 1000,
  })
}

// 5. The Intelligent Prefetcher (Enterprise UX Trick)
/**
 * Call this function when a user simply HOVERS over a product card.
 * It quietly fetches the product details in the background so that when 
 * they actually click it, the Product Details Page loads in 0 milliseconds.
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient()

  const prefetchProduct = (productId: string) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_KEYS.detail(productId),
      queryFn: () => productsApi.getProductDetails(productId),
      staleTime: 5 * 60 * 1000,
    })
  }

  return prefetchProduct
}