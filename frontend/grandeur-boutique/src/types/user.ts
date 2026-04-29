// ============================================================================
// ENUMS & LITERALS
// ============================================================================

export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

export type AuthProvider = "PHONE" | "GOOGLE" | "EMAIL";

// ============================================================================
// CORE ENTITY
// ============================================================================

/**
 * The core User entity. 
 * Notice how we keep Address references external (as IDs or fetched separately) 
 * so the User object doesn't become a massive, unmanageable JSON blob.
 */
export interface User {
  id: string; // The internal FastAPI Database ID (UUID)
  firebaseUid: string; // The link to Firebase Authentication
  
  // Identity
  fullName: string;
  email?: string;
  phoneNumber?: string; // Optional if they signed up via Google instead of Phone
  avatarUrl?: string;
  
  // Security & Permissions
  role: UserRole;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  
  // Personalization & Luxury Profiling
  dob?: string; // ISO Date String
  anniversaryDate?: string; // For triggering automated "Anniversary Discount" emails
  
  // Preferences
  preferences: {
    newsletter: boolean;
    smsAlerts: boolean;
    whatsappUpdates: boolean; // Critical for Indian e-commerce
  };
  
  // Metrics (Good for Admin Dashboards / VIP logic)
  totalOrders: number;
  lifetimeValue: number; // Total amount spent in INR
  
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * The strict payload expected when a user updates their profile.
 */
export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  dob?: string;
  anniversaryDate?: string;
  preferences?: {
    newsletter?: boolean;
    smsAlerts?: boolean;
    whatsappUpdates?: boolean;
  };
}

/**
 * The minimal user data returned immediately upon login to hydrate the Zustand store.
 */
export interface AuthUser {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
}