"use client"

import {
  useClientSignupMutation,
  useCreateAccountMutation,
  useResendOtpClientMutation,
} from "../../hooks/clientCustomHooks"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import type React from "react"
import { useState } from "react"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import OtpModal from "./OtpModal"

const Signup: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    console.log("Modal open state:", isOpen)
  }, [isOpen])

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
      isValid = false
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and a number"
      isValid = false
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear the error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    console.log("Submitting form...")
    try {
      signupMutation.mutate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: "",
        confirmPassword: formData.confirmPassword, // Fixed to use the actual confirm password
      })
      console.log("Mutation completed successfully")
      toast.success("Account created successfully!")
      setIsOpen(true)
    } catch (error) {
      console.log("Error while creating user", error)
      let message = "An unexpected error occurred"
      if (isAxiosError(error)) {
        message = error.response?.data?.message || "An error occurred"
      }
      toast.error(message)
    }
  }

  const signupMutation = useClientSignupMutation({
    onSuccess: () => {
      console.log("Signup success - should open modal")
      toast.success("Account created successfully!")
      setIsLoading(false)
      setIsOpen(true)
      //navigate("/", { replace: true })
    },
    onError: (error) => {
      let message = "An unexpected error occurred"
      if (isAxiosError(error)) {
        message = error.response?.data?.message || "An error occurred"
      } else {
        console.error("❌ Unknown error format:", error)
      }

      console.error("❌ Mutation error:", message)
      toast.error(message)
      setIsOpen(false)
      setIsLoading(false)
    },
    onSettled: () => {
      console.log("Mutation settled (completed, success or failure)")
      // This will run regardless of success or failure
      setIsLoading(false)
    },
  })
  const mutationCreateAccount = useCreateAccountMutation()
  const resendOtpMutation = useResendOtpClientMutation()
  const handleMutationSuccess = () => {
    toast.success("Account created successfully!")
    navigate("/login", { replace: true }) // Navigate on success
  }
  const handleMutationError = (error: unknown) => {
    let message = "An unexpected error occurred"
    if (isAxiosError(error)) {
      console.log(error)
      message = error.response?.data?.message || "An error occurred"
    }
    toast.error(message)
  }
  const handleVerify = (otp: string) => {
    // Implement your OTP verification logic here
    console.log("Verifying OTP:", otp)
  }

  // Function to handle OTP resend
  const handleResend = () => {
    // Implement your OTP resend logic here
    console.log("Resending OTP")
    return resendOtpMutation.mutateAsync(formData.email)
  }
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#fff9e6]">
      <div className="max-w-[550px] w-full px-8 py-7">
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(184,134,11,0.25)] overflow-hidden w-full transition-transform duration-300 hover:translate-y-[-5px]">
          <div className="bg-gradient-to-r from-[#d4a017] to-[#b8860b] text-white py-7 px-8 text-left">
            <div className="flex items-center gap-3 mb-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h1 className="text-[1.8rem] font-bold m-0 tracking-[-0.5px]">Planzo</h1>
            </div>
            <p className="m-0 opacity-90 text-base font-normal">Bringing Your Events to Life</p>
          </div>

          <div className="py-8 px-7">
            <form onSubmit={handleSubmit}>
              <div className="mb-5.5">
                <label htmlFor="name" className="block mb-2 text-[0.95rem] font-semibold text-gray-800">
                  Full Name
                </label>
                <div className="relative flex items-center w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b8860b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3.5 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full py-3.5 px-11 border ${errors.name ? "border-red-500" : "border-gray-200"} rounded-lg text-base transition-all duration-200 bg-white text-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.05)]`}
                  />
                </div>
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>

              <div className="mb-5.5">
                <label htmlFor="email" className="block mb-2 text-[0.95rem] font-semibold text-gray-800">
                  Email Address
                </label>
                <div className="relative flex items-center w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b8860b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3.5 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full py-3.5 px-11 border ${errors.email ? "border-red-500" : "border-gray-200"} rounded-lg text-base transition-all duration-200 bg-white text-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.05)]`}
                  />
                </div>
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
              </div>

              <div className="mb-5.5">
                <label htmlFor="password" className="block mb-2 text-[0.95rem] font-semibold text-gray-800">
                  Password
                </label>
                <div className="relative flex items-center w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b8860b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3.5 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full py-3.5 px-11 border ${errors.password ? "border-red-500" : "border-gray-200"} rounded-lg text-base transition-all duration-200 bg-white text-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.05)]`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer flex items-center justify-center text-gray-500 z-10 h-6 w-6"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showPassword ? (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                          <line x1="2" y1="22" x2="22" y2="2"></line>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
              </div>

              <div className="mb-5.5">
                <label htmlFor="confirmPassword" className="block mb-2 text-[0.95rem] font-semibold text-gray-800">
                  Confirm Password
                </label>
                <div className="relative flex items-center w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b8860b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3.5 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full py-3.5 px-11 border ${errors.confirmPassword ? "border-red-500" : "border-gray-200"} rounded-lg text-base transition-all duration-200 bg-white text-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.05)]`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer flex items-center justify-center text-gray-500 z-10 h-6 w-6"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showConfirmPassword ? (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                          <line x1="2" y1="22" x2="22" y2="2"></line>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#d4a017] to-[#b8860b] text-white border-none rounded-lg py-4 text-[1.05rem] font-semibold cursor-pointer transition-all duration-200 flex justify-center items-center mt-4 shadow-[0_4px_10px_rgba(184,134,11,0.3)] hover:from-[#c39516] hover:to-[#a67a0a] hover:translate-y-[-2px] hover:shadow-[0_6px_15px_rgba(184,134,11,0.35)] active:translate-y-[1px] disabled:from-[#e0c27e] disabled:to-[#ccab6a] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2.5">
                    <div className="w-[18px] h-[18px] border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2.5">
                    Create Account
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                )}
              </button>
            </form>
          </div>

          <div className="py-5 px-7 pb-7 text-center text-[0.95rem] text-gray-600 border-t border-gray-100">
            <p className="m-0">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#b8860b] no-underline font-semibold transition-colors duration-200 hover:text-[#d4a017] hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
      <OtpModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onVerify={handleVerify}
        onResend={handleResend}
        email={formData.email}
        data={formData}
        setIsOpen={setIsOpen}
        mutation={mutationCreateAccount}
        resendOtp={resendOtpMutation}
        handleError={handleMutationError}
        handleSuccess={handleMutationSuccess}
      />
    </div>
  )
}

export default Signup
