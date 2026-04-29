import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { addressApi, AddressDTO } from "./api"
import { ApiError } from "@/lib/api-client"

// 1. Query Keys (Centralized for typo-free invalidation)
export const ADDRESS_KEYS = {
  all: ["addresses"] as const,
}

// 2. Fetch Hook (Used on the "Saved Addresses" list page)
export function useAddresses() {
  return useQuery({
    queryKey: ADDRESS_KEYS.all,
    queryFn: addressApi.getAddresses,
    // Stale time: Keep addresses fresh for 5 minutes before refetching
    staleTime: 5 * 60 * 1000, 
  })
}

// 3. Create Hook (Used on the Address Form page)
export function useAddAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addressApi.createAddress,
    onSuccess: () => {
      // Instantly refresh the address list in the background
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all })
      toast.success("Address saved successfully")
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to save address")
    },
  })
}

// 4. Update Hook
export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddressDTO> }) => 
      addressApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all })
      toast.success("Address updated")
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to update address")
    },
  })
}

// 5. Delete Hook (With Optimistic Update for Luxury UX)
export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addressApi.deleteAddress,
    
    // OPTIMISTIC UPDATE: Fires the exact millisecond the user clicks "Delete"
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ADDRESS_KEYS.all })

      // Snapshot the previous value in case the API fails
      const previousAddresses = queryClient.getQueryData<AddressDTO[]>(ADDRESS_KEYS.all)

      // Optimistically remove the address from the UI immediately
      if (previousAddresses) {
        queryClient.setQueryData<AddressDTO[]>(
          ADDRESS_KEYS.all,
          previousAddresses.filter((addr) => addr.id !== deletedId)
        )
      }

      // Return a context object with the snapshotted value
      return { previousAddresses }
    },
    
    // If the backend fails, roll back the UI to the snapshot
    onError: (err, deletedId, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(ADDRESS_KEYS.all, context.previousAddresses)
      }
      toast.error("Failed to delete address. Please try again.")
    },
    
    // Always refetch after error or success to ensure backend sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all })
    },
    
    onSuccess: () => {
      toast.success("Address removed")
    }
  })
}

// 6. Set Default Address Hook
export function useSetDefaultAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addressApi.setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all })
      toast.success("Default address updated")
    },
    onError: (error: ApiError) => {
      toast.error("Could not set default address")
    },
  })
}