// ============================================================================
// ENUMS & LITERALS
// ============================================================================

export type ProductCategory = 
  | "BRIDAL_LEHENGAS" 
  | "SILK_SAREES" 
  | "EVENING_GOWNS" 
  | "ANARKALIS" 
  | "ACCESSORIES";

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "CUSTOM_TAILORED";

export type ProductStatus = "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";

// ============================================================================
// SUB-ENTITIES (For clean nesting)
// ============================================================================

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean; // Determines which image shows on the catalog page
  displayOrder: number;
}

export interface ProductDimensions {
  weightInGrams: number;
  lengthInCm?: number;
  widthInCm?: number;
  heightInCm?: number;
}

// ============================================================================
// CORE ENTITY
// ============================================================================

/**
 * The complete, deeply-nested Product object used on the Product Details Page (PDP).
 */
export interface Product {
  isTrending: boolean;
  isCustomizable: boolean;
  id: string;
  slug: string; // e.g., "ivory-pearl-bridal-lehenga" (Crucial for SEO)
  name: string;
  description: string;
  shortDescription: string; // Used for meta tags and quick views
  
  // Categorization
  category: ProductCategory;
  tags: string[]; // e.g., ["Summer Wedding", "Pastel", "Hand-embroidered"]
  
  // Pricing & Inventory
  basePrice: number;
  salePrice?: number; // If present, the item is on sale
  isTaxable: boolean;
  sku: string; // Stock Keeping Unit (Internal barcode/identifier)
  status: ProductStatus;
  
  // Variants (Sizes available in stock)
  availableSizes: ProductSize[];
  stockCount: number; // Total units across all sizes, or define stock per size for extreme granularity
  
  // Media
  images: ProductImage[];
  videoUrl?: string; // High-end fashion often requires runway video clips
  
  // Luxury Metadata
  fabric: string; // e.g., "Pure Banarasi Silk"
  careInstructions: string; // e.g., "Dry Clean Only"
  deliveryTimelineDays: number; // e.g., 14 (Because bespoke items take time)
  
  // Social Proof
  averageRating: number;
  reviewCount: number;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// LIGHTWEIGHT SUMMARIES & DTOs
// ============================================================================

/**
 * Stripped-down version of the product for rendering the Infinite Scroll catalog.
 * Sending 100 full Product objects (with videos and dimensions) would crash mobile browsers.
 */
export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  salePrice?: number;
  originalPrice?: number  // Add these
  images: string[]
  primaryImageUrl: string;
  averageRating: number;
  reviewCount: number;
  isNewArrival: boolean; // Flag to render a "New" badge
}

export type CreateProductInput = Omit<Product, "id" | "slug" | "averageRating" | "reviewCount" | "createdAt" | "updatedAt">;
export type UpdateProductInput = Partial<CreateProductInput>;