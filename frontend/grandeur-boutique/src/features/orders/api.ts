import { apiClient } from "@/lib/api-client"
import { Order } from "@/types/order"

// 1. Data Transfer Objects (DTOs)
export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string; // Optional filter (e.g., to show only "DELIVERED" orders)
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export const ordersApi = {
  /**
   * Fetch the user's order history with optional pagination
   */
  getOrders: (params?: GetOrdersParams) => {
    if (!params) {
        return apiClient.get<PaginatedOrders>("/users/me/orders")
    }

    const query = new URLSearchParams()

    if (params.page) query.append("page", String(params.page))
    if (params.limit) query.append("limit", String(params.limit))
    if (params.status) query.append("status", params.status)

    return apiClient.get<PaginatedOrders>(
        `/users/me/orders?${query.toString()}`
    )
    },

  /**
   * Fetch the deep-dive timeline and details for a specific order ID
   */
  getOrderDetails: (orderId: string) => {
    return apiClient.get<Order>(`/orders/${orderId}`)
  },

  /**
   * Request an order cancellation (Only valid if status is ORDER_PLACED)
   */
  cancelOrder: (orderId: string, reason: string) => {
    return apiClient.post<{ success: boolean; newStatus: string }>(`/orders/${orderId}/cancel`, { reason })
  },
}