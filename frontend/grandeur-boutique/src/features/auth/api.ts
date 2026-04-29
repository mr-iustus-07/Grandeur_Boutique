import { apiClient } from "@/lib/api-client"
import { AuthUser } from "./store"

// DTOs (Data Transfer Objects)
export interface LoginPayload {
  firebaseIdToken: string; // The token you get after Firebase OTP verification
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string; // Your FastAPI JWT
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export const authApi = {
  /**
   * Exchange a Firebase ID token for a FastAPI Backend JWT Session
   */
  login: (data: LoginPayload) => {
    return apiClient.post<AuthResponse>("/auth/login", data)
  },

  /**
   * Fetch the latest user profile data from the backend
   */
  getMe: () => {
    return apiClient.get<AuthUser>("/auth/me")
  },

  /**
   * Update the user's basic profile details
   */
  updateProfile: (data: UpdateProfilePayload) => {
    return apiClient.patch<AuthUser>("/auth/me", data)
  },

  /**
   * Invalidate the session on the backend
   */
  logout: () => {
    return apiClient.post("/auth/logout", {})
  },
}