"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import { useVendorForgetPassword } from "@/hooks/vendorCustomHooks"
import { useNavigate } from "react-router-dom"

interface FormState {
  newPassword: string
  confirmPassword: string
  message: string
  messageType: "success" | "error" | ""
}

interface FormErrors {
  newPassword?: string
  confirmPassword?: string
}

interface ResetPasswordProps {
  token?: string // Token can be passed as prop or extracted from URL
  email?: string // Email can be passed as prop or extracted from URL
  onSuccess?: () => void
  onBackToLogin?: () => void
}

const ResetPasswordVendor: React.FC<ResetPasswordProps> = ({ 
  token: propToken, 
  email: propEmail, 
  onSuccess, 
  onBackToLogin 
}) => {
  const [formState, setFormState] = useState<FormState>({
    newPassword: "",
    confirmPassword: "",
    message: "",
    messageType: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const navigate = useNavigate()

  // Use the custom hook
  const forgetPasswordMutation = useVendorForgetPassword()

  // Extract token and email from URL params or use props
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const urlToken = urlParams.get('token')
      const urlEmail = urlParams.get('email')
      
      setToken(propToken || urlToken || "")
      setEmail(propEmail || urlEmail || "")
    }
  }, [propToken, propEmail])

  const validatePassword = (password: string): string[] => {
    const issues: string[] = []

    if (password.length < 8) {
      issues.push("At least 8 characters")
    }
    if (!/[A-Z]/.test(password)) {
      issues.push("One uppercase letter")
    }
    if (!/[a-z]/.test(password)) {
      issues.push("One lowercase letter")
    }
    if (!/\d/.test(password)) {
      issues.push("One number")
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push("One special character")
    }

    return issues
  }

  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    const issues = validatePassword(password)
    const score = 5 - issues.length

    if (score === 5) return { strength: "Very Strong", color: "bg-green-500", width: "w-full" }
    if (score === 4) return { strength: "Strong", color: "bg-yellow-500", width: "w-4/5" }
    if (score === 3) return { strength: "Medium", color: "bg-yellow-400", width: "w-3/5" }
    if (score === 2) return { strength: "Weak", color: "bg-orange-500", width: "w-2/5" }
    return { strength: "Very Weak", color: "bg-red-500", width: "w-1/5" }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
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

  const navigateToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin()
    } else {
      // Use React Router navigate
      navigate("/vendor/login", { replace: true })
    }
  }

  const handleSubmit = async () => {
    // Check if token and email are available
    if (!token) {
      setFormState((prev) => ({
        ...prev,
        message: "Invalid or missing reset token. Please request a new password reset.",
        messageType: "error",
      }))
      return
    }

    if (!email) {
      setFormState((prev) => ({
        ...prev,
        message: "Invalid or missing email. Please request a new password reset.",
        messageType: "error",
      }))
      return
    }

    // Validate form
    const newErrors: FormErrors = {}

    // Validate new password
    const passwordIssues = validatePassword(formState.newPassword)
    if (passwordIssues.length > 0) {
      newErrors.newPassword = `Password must have: ${passwordIssues.join(", ")}`
    }

    // Validate confirm password
    if (!formState.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formState.newPassword !== formState.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors
    setErrors({})

    // Clear message
    setFormState((prev) => ({
      ...prev,
      message: "",
      messageType: "",
    }))

    try {
      // Use the mutation hook
      const result = await forgetPasswordMutation.mutateAsync({
        email,
        newPassword: formState.newPassword,
        token
      })

      setFormState((prev) => ({
        ...prev,
        message: result.message || "Your password has been reset successfully! Redirecting to login...",
        messageType: "success",
        newPassword: "",
        confirmPassword: "",
      }))
      
      // Call success callback if provided, otherwise navigate to login
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        // Navigate to login after 2 seconds
        setTimeout(() => {
          navigateToLogin()
        }, 2000)
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        message: error instanceof Error ? error.message : "An error occurred. Please try again.",
        messageType: "error",
      }))
    }
  }

  const handleBackToLogin = () => {
    navigateToLogin()
  }

  const passwordStrength = getPasswordStrength(formState.newPassword)

  // Show error if token or email is missing
  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
              <p className="mt-2 text-sm text-gray-600">
                This password reset link is invalid or has expired. Please request a new password reset.
              </p>
            </div>
            <button
              onClick={handleBackToLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-yellow-600 mb-2">Planzo</h1>
            <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
            <p className="mt-2 text-sm text-gray-600">Create a new secure password for your Planzo account</p>
            {email && (
              <p className="mt-1 text-xs text-gray-500">Resetting password for: {email}</p>
            )}
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

          {/* Form - Hide form after successful reset */}
          {formState.messageType !== "success" && (
            <div className="space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formState.newPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.newPassword ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-yellow-500"
                    }`}
                    placeholder="Enter your new password"
                    disabled={forgetPasswordMutation.isPending}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formState.newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.strength === "Very Strong"
                            ? "text-green-600"
                            : passwordStrength.strength === "Strong"
                              ? "text-yellow-600"
                              : passwordStrength.strength === "Medium"
                                ? "text-yellow-500"
                                : passwordStrength.strength === "Weak"
                                  ? "text-orange-600"
                                  : "text-red-600"
                        }`}
                      >
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                      ></div>
                    </div>
                  </div>
                )}

                {errors.newPassword && <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formState.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.confirmPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-yellow-500"
                    }`}
                    placeholder="Confirm your new password"
                    disabled={forgetPasswordMutation.isPending}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={forgetPasswordMutation.isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {forgetPasswordMutation.isPending ? (
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
                    Resetting Password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          )}

          {/* Show "Go to Login" button after successful reset */}
          {formState.messageType === "success" && (
            <div className="mt-6">
              <button
                onClick={navigateToLogin}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Back to Login - Show only when form is visible */}
          {formState.messageType !== "success" && (
            <div className="mt-6 text-center">
              <button
                onClick={handleBackToLogin}
                className="text-sm text-yellow-600 hover:text-yellow-500 font-medium transition-colors duration-200"
              >
                ← Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200">
              Contact Planzo Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordVendor