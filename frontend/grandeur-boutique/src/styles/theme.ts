// ============================================================================
// 1. STRICT TYPE DEFINITIONS
// Ensures auto-complete and prevents typos when accessing theme values
// ============================================================================

export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950?: string;
};

export type SemanticColors = {
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
};

export interface ThemeConfig {
  colors: {
    brand: {
      green: ColorScale;
      gold: ColorScale;
    };
    neutral: ColorScale;
    semantic: SemanticColors;
  };
  typography: {
    fontFamily: {
      sans: string;
      serif: string;
    };
    letterSpacing: {
      tighter: string;
      tight: string;
      normal: string;
      wide: string;
      wider: string;
      widest: string;
    };
  };
  effects: {
    shadows: {
      sm: string;
      DEFAULT: string;
      md: string;
      lg: string;
      xl: string;
      glass: string; // Custom luxury glassmorphism shadow
    };
    radii: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
  };
}

// ============================================================================
// 2. THE DESIGN TOKENS (Grandeur Boutique Identity)
// These should exactly mirror your tailwind.config.js configurations.
// ============================================================================

export const theme: ThemeConfig = {
  colors: {
    brand: {
      // The Grandeur Green Palette
      green: {
        50: "#e6efea",
        100: "#cce0d5",
        200: "#99c1aa",
        300: "#66a380",
        400: "#338455",
        500: "#005C29", // Base Brand Color
        600: "#004a21",
        700: "#003719",
        800: "#002510",
        900: "#001208",
        950: "#000904",
      },
      // The Grandeur Gold Palette
      gold: {
        50: "#fbf7eb",
        100: "#f7efd6",
        200: "#eedfac",
        300: "#e6cf83",
        400: "#ddbf59",
        500: "#D4AF37", // Base Brand Color
        600: "#aa8c2c",
        700: "#806921",
        800: "#554616",
        900: "#2a230b",
      },
    },
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712",
    },
    semantic: {
      success: "#10b981", // Emerald 500
      warning: "#f59e0b", // Amber 500
      error: "#ef4444",   // Red 500
      info: "#3b82f6",    // Blue 500
      background: "#ffffff",
      surface: "#f9fafb",
      textPrimary: "#111827",
      textSecondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: {
      // These map to the CSS variables injected by next/font in layout.tsx
      sans: "var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      serif: "var(--font-serif), ui-serif, Georgia, Cambria, Times New Roman, Times, serif",
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em", // Often used for uppercase luxury subheadings
    },
  },
  effects: {
    shadows: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      glass: "0 8px 32px 0 rgba(0, 92, 41, 0.05)", // Subtle green tint for glass panels
    },
    radii: {
      sm: "0.125rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      full: "9999px",
    },
  },
} as const;

// ============================================================================
// 3. UTILITY HELPER
// A safe accessor function for deep theme extraction
// ============================================================================

/**
 * Extracts a deeply nested value from the theme safely.
 * @example getThemeValue(theme.colors.brand.green[500])
 */
export const getThemeValue = <T>(value: T): T => value;