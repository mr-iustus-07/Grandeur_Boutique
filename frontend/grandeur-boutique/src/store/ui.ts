import { create } from "zustand"

interface UIState {
  // Mobile Navigation
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Global Search Overlay / Command Palette
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  
  // Page Transition State (Optional: for custom routing animations)
  isTransitioning: boolean;
  setIsTransitioning: (status: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  isTransitioning: false,
  setIsTransitioning: (status) => set({ isTransitioning: status }),
}))