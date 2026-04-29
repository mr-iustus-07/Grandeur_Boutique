"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { MapPin, Navigation, User, Phone, Home, Building } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { apiClient } from "@/lib/api-client"
import { useCartStore } from "@/features/cart/store"

// 1. Zod Schema: Enterprise-grade form validation
const addressSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian number"),
  addressLine1: z.string().min(5, "Please enter your street address"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Must be a valid 6-digit Pincode"),
  isGpsVerified: z.boolean(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
})

type AddressFormValues = z.infer<typeof addressSchema>

export default function AddressPage() {
  const router = useRouter()
  const [isLocating, setIsLocating] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      isGpsVerified: false,
    }
  })

  // 2. The "Use My Location" GPS Feature
  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setIsLocating(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // In production, you would call your backend or Google Maps API here
          // const res = await apiClient.get(`/geocode?lat=${latitude}&lng=${longitude}`)
          
          // Mocking the reverse-geocode response for the frontend
          setValue("city", "Chennai", { shouldValidate: true })
          setValue("state", "Tamil Nadu", { shouldValidate: true })
          setValue("pincode", "600001", { shouldValidate: true })
          setValue("isGpsVerified", true)
          setValue("coordinates", { lat: latitude, lng: longitude })
          
        } catch (error) {
          console.error("Failed to fetch address details")
        } finally {
          setIsLocating(false)
        }
      },
      (error) => {
        alert("Please allow location access to use this feature.")
        setIsLocating(false)
      }
    )
  }

  // 3. Form Submission Handler
  const onSubmit = async (data: AddressFormValues) => {
    setIsSubmitting(true)
    try {
      // Send the validated address to your FastAPI backend
      // await apiClient.post("/users/me/addresses", data)
      
      // Optionally, save to local checkout state if needed
      // useCheckoutStore.getState().setAddress(data)
      
      // Route to the final Checkout / Payment Screen
      router.push("/checkout")
    } catch (error) {
      console.error("Failed to save address", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Note: Header with Back button is assumed to be in (protected)/layout.tsx */}
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Address</h1>
          <p className="text-sm text-gray-500">Where should we send your elegance?</p>
        </div>

        {/* The Magic GPS Button */}
        <Button 
          type="button" 
          variant="outline" 
          className="w-full h-14 bg-white text-[#005C29] border-[#005C29]/20 hover:bg-[#005C29]/5 shadow-sm"
          onClick={handleUseLocation}
          disabled={isLocating}
        >
          <Navigation size={18} className="mr-2" />
          {isLocating ? "Locating you..." : "Use My Current Location"}
        </Button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR ENTER MANUALLY</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <Input
            placeholder="Full Name"
            leftIcon={<User size={18} />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Input
            type="tel"
            placeholder="Phone Number"
            leftIcon={<Phone size={18} />}
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />

          <Input
            placeholder="Flat, House no., Building, Company"
            leftIcon={<Home size={18} />}
            error={errors.addressLine1?.message}
            {...register("addressLine1")}
          />

          <Input
            placeholder="Area, Street, Sector, Village (Optional)"
            leftIcon={<Building size={18} />}
            {...register("addressLine2")}
          />

          {/* Grid for City and Pincode to save vertical space */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="City"
              error={errors.city?.message}
              {...register("city")}
            />
            <Input
              placeholder="Pincode"
              maxLength={6}
              error={errors.pincode?.message}
              {...register("pincode")}
            />
          </div>

          <Input
            placeholder="State"
            leftIcon={<MapPin size={18} />}
            error={errors.state?.message}
            {...register("state")}
          />

          {/* Sticky Bottom Checkout Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe">
            <div className="max-w-md mx-auto">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                Save & Continue to Payment
              </Button>
            </div>
          </div>

        </form>
      </main>
    </div>
  )
}
