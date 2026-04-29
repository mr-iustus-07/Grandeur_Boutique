// ============================================================================
// ENUMS & LITERALS
// ============================================================================

export type AddressType = "HOME" | "WORK" | "OTHER";

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

/**
 * The core Address entity as it exists in the database.
 */
export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  
  // Physical Address Data
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string; // Usually defaults to "India" for Grandeur Boutique
  
  // Metadata
  type: AddressType;
  isDefault: boolean;
  
  // Advanced Logistics (For hyper-local delivery accuracy)
  isGpsVerified: boolean;
  coordinates?: GeoCoordinates;
  
  createdAt: string; // ISO 8601 Date String
  updatedAt: string;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// Used when creating or mutating data (omitting server-generated fields like ID)
// ============================================================================

export type CreateAddressInput = Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">;
export type UpdateAddressInput = Partial<CreateAddressInput>;