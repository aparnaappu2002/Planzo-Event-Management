"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { useClientRequestForgetPassword } from "@/hooks/clientCustomHooks"
import { useNavigate } from "react-router-dom"

interface FormState {
  email: string
  message: string
  messageType: "success" | "error" | ""
}

const ForgotPassword: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    message: "",
    messageType: "",
  })

  const [errors, setErrors] = useState<{ email?: string }>({})
  const navigate=useNavigate()

  // Use the custom hook for API call
  const { mutate: requestOtp, isPending: isLoading } = useClientRequestForgetPassword()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormState((prev) => ({
      ...prev,
      email: value,
    }))

    // Clear errors when user starts typing
    if (errors.email) {
      setErrors({})
    }

    // Clear message when user starts typing
    if (formState.message) {
      setFormState((prev) => ({
        ...prev,
        message: "",
        messageType: "",
      }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate email
    const newErrors: { email?: string } = {}

    if (!formState.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formState.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors and message
    setErrors({})
    setFormState((prev) => ({
      ...prev,
      message: "",
      messageType: "",
    }))

    // Call the API using the custom hook
    requestOtp(formState.email, {
      onSuccess: (data) => {
        setFormState((prev) => ({
          ...prev,
          message: "Password reset instructions have been sent to your email address.",
          messageType: "success",
        }))
      },
      onError: (error) => {
        setFormState((prev) => ({
          ...prev,
          message: error.message || "An error occurred. Please try again.",
          messageType: "error",
        }))
      },
    })
  }

  const handleBackToLogin = () => {
    // This would typically navigate back to login page
    // Replace with your routing logic (React Router, etc.)
    console.log("Navigate back to login")
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586l4.293-4.293A6 6 0 0119 9z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
            <p className="mt-2 text-sm text-gray-600">
              No worries! Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {/* Success/Error Message */}
          {formState.message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                formState.messageType === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {formState.messageType === "success" ? (
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{formState.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-yellow-500"
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending Instructions...
                </div>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-sm text-yellow-600 hover:text-yellow-500 font-medium transition-colors duration-200"
            >
              ← Back to Login
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Still having trouble?{" "}
            <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword