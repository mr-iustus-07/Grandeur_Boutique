import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ordersApi, GetOrdersParams } from "./api"
import { ApiError } from "@/lib/api-client"
import { Order } from "@/types/order" // ✅ ADDED

// 1. Query Keys (Centralized Dictionary)
export const ORDER_KEYS = {
  all: ["orders"] as const,
  list: (params: GetOrdersParams) => ["orders", "list", params] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
}

// 2. Fetch Order History (List)
export function useOrders(params: GetOrdersParams = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: () => ordersApi.getOrders(params),
    staleTime: 5 * 60 * 1000,

    // ✅ FIXED: correct placeholderData typing
    placeholderData: (previousData) => previousData,
  })
}

// 3. Fetch Specific Order Details (Tracking Screen)
export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: ORDER_KEYS.detail(orderId),
    queryFn: () => ordersApi.getOrderDetails(orderId),
    enabled: !!orderId,

    // ✅ FIXED: removed any + fixed status field
    refetchInterval: (query) => {
      const data = query.state.data as Order | undefined
      const status = data?.status

      const isComplete = status === "DELIVERED" || status === "CANCELLED"
      return isComplete ? false : 60000
    },
  })
}

// 4. Cancel Order Mutation
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    // ✅ FIXED: correct typing
    mutationFn: (variables: { orderId: string; reason: string }) => 
      ordersApi.cancelOrder(variables.orderId, variables.reason),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(variables.orderId) })
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all })

      toast.success("Order has been successfully cancelled.")
    },

    onError: (error: ApiError) => {
      toast.error(error.message || "We could not cancel this order. It may have already shipped.")
    },
  })
}
