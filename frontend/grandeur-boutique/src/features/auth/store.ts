import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// 1. Core User Types
export interface AuthUser {
  id: string;
  email?: string;
  phoneNumber?: string;
  name: string;
  role: "USER" | "ADMIN";
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

// 2. The Zustand Persist Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => 
        set({ user, token, isAuthenticated: true }),

      clearAuth: () => 
        set({ user: null, token: null, isAuthenticated: false }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "grandeur-auth-storage", // The key used in localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist the token and user data, nothing else
      partialize: (state) => ({ token: state.token, user: state.user }),
      // Hydration hook to ensure 'isAuthenticated' is accurately derived on load
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token
        }
      },
    }
  )
)