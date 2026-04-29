"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "next-themes"
import NextTopLoader from "nextjs-toploader"
import { Toaster } from "sonner"

// 1. Enterprise React Query Setup
// We ensure that we don't share the QueryClient across different users during SSR
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With Next.js App Router, we usually want to stale data a bit longer 
        // because we are fetching on the server where possible.
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false, // Prevents spamming your FastAPI server
        retry: 1, // Only retry failed requests once to prevent infinite loops
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  // 2. Initialize the Query Client safely
  const queryClient = getQueryClient()

  // 3. Hydration Fix Wrapper
  // This prevents the dreaded Next.js "Text content did not match server-rendered HTML" error
    const mountedRef = React.useRef(false)
    React.useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {/* 4. Theme Provider (Locked to Light Mode for Grandeur Boutique's luxury aesthetic) */}
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light" 
        enableSystem={false}
        disableTransitionOnChange
      >
        
        {/* 5. The Luxury Gold Loading Bar */}
        <NextTopLoader
          color="#D4AF37" /* Grandeur Gold */
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #D4AF37,0 0 5px #D4AF37"
          zIndex={1600}
        />
        
        {/* 6. Global Toast Notification System */}
        <Toaster 
          position="top-center"
          richColors
          toastOptions={{
            style: {
              background: '#005C29', /* Grandeur Green */
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'var(--font-sans)',
            },
          }}
        />

        {/* Render children only after mounting to ensure perfect hydration */}
        {mountedRef ? children : <div className="min-h-screen bg-gray-50 invisible" />}

      </ThemeProvider>

      {/* 7. React Query Devtools (Only visible in development mode) */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}