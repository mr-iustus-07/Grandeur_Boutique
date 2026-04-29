import { apiClient } from "@/lib/api-client"
import { Product, ProductCategory, ProductSummary } from "@/types/product"

// 1. DTOs for Advanced Filtering & Pagination
export interface GetProductsParams {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sortBy?: "price_asc" | "price_desc" | "newest" | "trending";
  cursor?: string; // For infinite scrolling (next page pointer)
  limit?: number;  // Default usually 12 or 24
}

export interface PaginatedProductsResponse {
  data: ProductSummary[];
  nextCursor: string | null; // Null if there are no more products
  totalCount: number;
}

// 2. The API Endpoints
export const productsApi = {
  /**
   * Fetch a paginated, filtered list of products (For Catalog / Search pages)
   */
  getProducts: (params?: GetProductsParams) => {
    if (!params) {
        return apiClient.get<PaginatedProductsResponse>("/products")
    }

    const query = new URLSearchParams()

    if (params.category) query.append("category", params.category)
    if (params.minPrice) query.append("minPrice", String(params.minPrice))
    if (params.maxPrice) query.append("maxPrice", String(params.maxPrice))
    if (params.sortBy) query.append("sortBy", params.sortBy)
    if (params.cursor) query.append("cursor", params.cursor)
    if (params.limit) query.append("limit", String(params.limit))

    if (params.tags && params.tags.length > 0) {
        params.tags.forEach(tag => query.append("tags", tag))
    }

    return apiClient.get<PaginatedProductsResponse>(`/products?${query.toString()}`)
    },

  /**
   * Fetch the full, deep-dive details of a single product (For PDP)
   */
  getProductDetails: (productId: string) => {
    return apiClient.get<Product>(`/products/${productId}`)
  },

  /**
   * Fetch a curated list of trending products (For Home Page)
   */
  getTrendingProducts: () => {
    return apiClient.get<ProductSummary[]>("/products/trending")
  },

  /**
   * Fetch related products based on a specific product's tags/category
   */
  getRelatedProducts: (productId: string) => {
    return apiClient.get<ProductSummary[]>(`/products/${productId}/related`)
  },
}