import { useState, useEffect, useRef } from "react"

// Re-export the UI store for easy importing: 
// import { useUIStore } from "@/store"
export { useUIStore } from "./ui"

/**
 * ENTERPRISE ZUSTAND HYDRATION FIX
 * * In Next.js, Zustand's persist middleware causes hydration mismatch errors 
 * because the server doesn't have access to localStorage.
 * * This custom hook acts as a safe wrapper. It returns `undefined` during the 
 * server render, and only returns the actual Zustand state once the component 
 * has safely mounted in the browser.
 * * @example
 * // Instead of:
 * // const items = useCartStore((state) => state.items) 
 * * // Use this:
 * // const items = useStore(useCartStore, (state) => state.items)
 */
export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F
  const [data, setData] = useState<F>()
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    queueMicrotask(() => {
      if (isMounted.current) {
        setData(result)
      }
    })
    
    return () => {
      isMounted.current = false
    }
  }, [result])

  return data
}