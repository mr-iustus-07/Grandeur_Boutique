"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { User, Lock, Eye, EyeOff, Smartphone } from "lucide-react"

import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // fake delay
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="h-screen w-full bg-[#005C29] flex flex-col justify-center px-5 pt-5 pb-0">

      {/* LOGO */}
      <div className="flex flex-col items-center  mt-1 mb-0">
        <img
          src="/images/brand-logo-1.png"
          alt="Grandeur Boutique Logo"
          className="w-full object-contain mx-auto mt-6 mb-6"
        />
      </div>

      {/* FORM */}
      <div className="w-full max-w-sm mx-auto space-y-5 mt-10 pt-0">

        <form onSubmit={handleLogin} className="space-y-4">

          {/* USERNAME */}
          <div className="relative">
            <Input
              placeholder="Username or Email id"
              className="w-full h-14 rounded-full bg-white pl-12 pr-4 text-center text-[#005C29] font-semibold shadow-lg border-0"
            />
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005C29]"
              size={22}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-14 rounded-full bg-white pl-12 pr-12 text-center text-[#005C29] font-semibold shadow-lg border-2 "
            />

            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#005C29]"
              size={22}
            />

            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#005C29]"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <Button
            type="submit"
            className="w-full h-14 rounded-full bg-gradient-to-b from-[#FFD700] to-[#E6B800] text-[#005C29] text-xl font-bold shadow-lg border-b-4 border-[#B89600] active:translate-y-1 active:border-b-0"
          >
            {isLoading ? "Logging in..." : "LOGIN"}
          </Button>

        </form>

        {/* SIGNUP */}
        <p className="text-center text-white text-sm">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-[#FFD700] font-semibold">
            Create One
          </Link>
        </p>

        {/* OR */}
        <p className="text-center text-white font-semibold">OR</p>

        {/* SOCIAL LOGIN */}
        <div className="flex justify-center gap-6">
          <button aria-label="Google" className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-[#005C29] hover:scale-105 transition-transform shadow-xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 12.25c0-.85-.08-1.66-.22-2.45H12v4.63h5.33c-.23 1.49-.89 2.75-1.92 3.6v3h3.11c1.82-1.68 2.98-4.15 2.98-7.78z" />
              <path d="M12 21.5c2.67 0 4.91-.88 6.55-2.4l-3.11-3c-.88.59-2 .95-3.44.95-2.65 0-4.89-1.79-5.69-4.2h-3.2v3.1A11.95 11.95 0 0012 21.5z" />
              <path d="M6.31 12.85A7.1 7.1 0 016.06 12c0-.29.03-.58.08-.85v-3.1h-3.2A11.97 11.97 0 002 12c0 1.93.46 3.75 1.29 5.35l3.02-4.5z" />
              <path d="M12 5.5c1.45 0 2.75.5 3.78 1.48l2.83-2.83C16.9 2.53 14.66 1.5 12 1.5 7.42 1.5 3.4 4.19 1.4 8.1l3.2 3.1c.8-2.41 3.04-4.2 5.69-4.2z" />
            </svg>
          </button>
          
          <button aria-label="Apple" className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-[#005C29] hover:scale-105 transition-transform shadow-xl">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.4 10.8c-.03-2.52 2.06-3.74 2.16-3.8-1.17-1.71-3-1.93-3.66-1.96-1.55-.16-3.03.91-3.83.91-.8 0-2-.88-3.28-.86-1.66.02-3.19.96-4.04 2.44-1.73 2.99-.44 7.42 1.25 9.85.83 1.19 1.8 2.51 3.09 2.46 1.25-.05 1.73-.81 3.25-.81 1.5 0 1.95.81 3.26.79 1.34-.03 2.18-1.21 3.01-2.42 1.05-1.53 1.48-3.01 1.5-3.09-.03-.01-2.68-1.02-2.71-3.51zM14.9 5.2c.69-.83 1.16-1.99 1.03-3.15-1.01.04-2.22.67-2.93 1.5-.64.74-1.2 1.93-1.04 3.06 1.13.09 2.25-.58 2.94-1.41z"/>
            </svg>
          </button>

          <button
            aria-label="Login with Phone"
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <Smartphone className="text-[#005C29]" size={26} />
          </button>

        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-6">
        <button
          onClick={() => router.push("/")}
          className="text-[#FFD700] font-medium"
        >
          Back to Home
        </button>
      </div>

    </div>
  )}