import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authApi, LoginPayload } from "./api"
import { useAuthStore } from "./store"
import { useCartStore } from "@/features/cart/store"
import { ApiError } from "@/lib/api-client"

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
}

// 1. The Login Hook
export function useLogin() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (data) => {
      // 1. Save to Global Zustand Store
      setAuth(data.user, data.accessToken)
      
      // 2. Pre-populate React Query Cache with the user data
      queryClient.setQueryData(AUTH_KEYS.me, data.user)
      
      toast.success("Welcome to Grandeur Boutique")
      router.push("/")
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Authentication failed. Please try again.")
    },
  })
}

// 2. The Fetch User Hook (Session validation)
export function useCurrentUser() {
  const { isAuthenticated, clearAuth, updateUser } = useAuthStore()

  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.getMe,
    // Only run this query if the user actually has a token in Zustand
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // If it fails (e.g., 401 Unauthorized), don't keep trying
  })
}

// 3. The Logout Hook
export function useLogout() {
  const router = useRouter()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearCart = useCartStore((state) => state.clearCart) // Optional: clear cart on logout
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // 1. Clear Zustand Stores
      clearAuth()
      clearCart()
      
      // 2. Wipe all React Query caches to ensure no private data leaks
      queryClient.clear()
      
      toast.success("Logged out successfully")
      router.push("/login")
    },
  })
}