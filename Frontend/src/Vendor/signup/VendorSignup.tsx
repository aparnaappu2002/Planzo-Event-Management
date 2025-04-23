"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Upload } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ImageCropper from "./ImageCropper"
import OtpModal from "../../Client/Signup/OtpModal"
import VendorPendingModal from "./VenderPendingModal"
import { useVendorSignupMutation, useVendorVerifyOtpMutation } from "@/hooks/vendorCustomHooks"
import { vendorSignup } from "@/services/ApiServiceVendor"

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name should be more than 3 characters" })
      .max(15, { message: "Name should be less than 15 characters" }),
    email: z.string().email({ message: "Invalid email format" }),
    phone: z
      .string()
      .regex(/^[6789]\d{9}$/, { message: "Phone number must start with 6, 7, 8, or 9 and be 10 digits long" })
      .refine((val) => !/^(\d)\1{9}$/.test(val), { message: "Phone number cannot contain all identical digits" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must include uppercase, lowercase, number, and special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

interface VendorData extends FormValues {
  idProof: string
}

export default function VendorSignupForm() {
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  const [vendorData, setVendorData] = useState<VendorData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const sendOtpMutation = useVendorSignupMutation()
  const verifyOtpMutation = useVendorVerifyOtpMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: FormValues) {
    if (!croppedImage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an ID Proof",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate uploading to Cloudinary
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockImageUrl = "https://example.com/uploaded-image.jpg"

      // Set vendor data
      const vendor: VendorData = {
        ...values,
        idProof: mockImageUrl,
      }
      setVendorData(vendor)

      // First, send full signup data
      await vendorSignup(vendor)

      // Then, trigger OTP sending
      await sendOtpMutation.mutateAsync({ email: vendor.email })

      // Open OTP modal
      setIsOtpModalOpen(true)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
      setShowCropper(true)
    }
  }

  const handleOtpSuccess = () => {
    setIsOtpModalOpen(false)
    toast({
      title: "Success",
      description: "Account created successfully",
    })
    setIsPendingModalOpen(true)
  }

  const handleOtpError = (error: unknown) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : "An error occurred",
    })
  }

  const handleResendOtp = async () => {
    if (!vendorData?.email) return
    return await sendOtpMutation.mutateAsync({ email: vendorData.email })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md shadow-lg border-amber-200">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-amber-800">Planzo</CardTitle>
            <CardDescription className="text-amber-700">Create your vendor account to get started</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          className="border-amber-200 focus-visible:ring-amber-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800">Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone"
                          {...field}
                          className="border-amber-200 focus-visible:ring-amber-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          className="border-amber-200 focus-visible:ring-amber-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...field}
                            className="border-amber-200 focus-visible:ring-amber-500 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                            className="border-amber-200 focus-visible:ring-amber-500 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
                            onClick={toggleConfirmPasswordVisibility}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="idProof" className="text-amber-800">
                    Upload ID Proof
                  </Label>
                  <div className="flex items-center gap-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-200">
                      {croppedImage ? (
                        <img
                          className="h-14 w-14 rounded-full object-cover"
                          src={URL.createObjectURL(croppedImage) || "/placeholder.svg"}
                          alt="ID Preview"
                        />
                      ) : (
                        <Upload className="h-6 w-6 text-amber-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="idProof"
                        type="file"
                        accept="image/jpeg, image/png, application/pdf"
                        onChange={handleFileChange}
                        className="border-amber-200 focus-visible:ring-amber-500"
                      />
                      <p className="text-xs text-amber-600 mt-1">Upload a valid government ID proof</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-amber-100 pt-4">
            <p className="text-center text-sm text-amber-700">
              Already have an account?{" "}
              <Link to="/vendor/login" className="font-medium text-amber-600 hover:text-amber-800 transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {showCropper && (
        <ImageCropper image={selectedImage} onCropComplete={setCroppedImage} showCropper={setShowCropper} />
      )}

      {isOtpModalOpen && vendorData && (
        <OtpModal
          isOpen={isOtpModalOpen}
          setIsOpen={setIsOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          onVerify={() => {}} // This is handled internally
          onResend={handleResendOtp}
          data={vendorData}
          email={vendorData.email}
          handleSuccess={handleOtpSuccess}
          handleError={handleOtpError}
          mutation={verifyOtpMutation}
          resendOtp={sendOtpMutation}
        />
      )}

      <VendorPendingModal isOpen={isPendingModalOpen} setIsOpen={setIsPendingModalOpen} />
    </>
  )
}
