import { apiClient } from "@/lib/api-client"
import { Address } from "@/types/order"

// 1. Data Transfer Objects /(DTOs)
// We extend the base ShippingAddress to include backend-specific fields like 'id' and 'isDefault'
export interface AddressDTO extends Address {
  id: string;
  isDefault: boolean;
}

// 2. API Methods encapsulated in an object for clean importing
export const addressApi = {
  /**
   * Fetch all saved addresses for the logged-in user
   */
  getAddresses: () => {
    return apiClient.get<AddressDTO[]>("/users/me/addresses")
  },

  /**
   * Create a new address
   */
  createAddress: (data: Omit<AddressDTO, "id" | "isDefault">) => {
    return apiClient.post<AddressDTO>("/users/me/addresses", data)
  },

  /**
   * Update an existing address
   */
  updateAddress: (id: string, data: Partial<AddressDTO>) => {
    return apiClient.patch<AddressDTO>(`/users/me/addresses/${id}`, data)
  },

  /**
   * Delete an address
   */
  deleteAddress: (id: string) => {
    return apiClient.delete(`/users/me/addresses/${id}`)
  },

  /**
   * Set an address as the default for future checkouts
   */
  setDefaultAddress: (id: string) => {
    return apiClient.post<AddressDTO>(`/users/me/addresses/${id}/default`, {})
  },
}