"use client"

import type React from "react"
import { useState } from "react"
import { LockIcon, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useVendorChangePassword } from "@/hooks/vendorCustomHooks"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/Store"

// Define the props interface properly
interface ChangePasswordFormProps {
  userId?: string
}

export default function ChangePassword({ userId }: ChangePasswordFormProps) {
  // Get the vendorId from Redux store inside the component
  const vendorId = useSelector((state: RootState) => state.vendorSlice.vendor?._id)

  // Use the provided userId or fall back to vendorId from the store
  const effectiveUserId = userId || vendorId

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [success, setSuccess] = useState(false)

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const changePasswordMutation = useVendorChangePassword()

  const validatePasswords = () => {
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return false
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return false
    }

    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)

    if (!validatePasswords()) {
      return
    }

    if (!effectiveUserId) {
      setPasswordError("User ID not found. Please try again or contact support.")
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        userId: effectiveUserId,
        oldPassword,
        newPassword,
      })

      // Reset form on success
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSuccess(true)
    } catch (error) {
      if (error instanceof Error) {
        setPasswordError(error.message)
      } else {
        setPasswordError("Failed to change password. Please try again.")
      }
    }
  }

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    if (field === "old") {
      setShowOldPassword(!showOldPassword)
    } else if (field === "new") {
      setShowNewPassword(!showNewPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-50">
      <div className="w-full max-w-md border border-yellow-300 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-400 p-6">
          <div className="flex items-center gap-2">
            <LockIcon className="h-6 w-6 text-yellow-900" />
            <h2 className="text-xl font-bold text-yellow-900">Change Password</h2>
          </div>
          <p className="text-sm text-yellow-800 mt-1">Update your vendor account password</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {passwordError && (
              <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 rounded-md flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{passwordError}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 border border-green-300 bg-green-50 text-green-800 rounded-md flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Password changed successfully!</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="current-password" className="block text-sm font-medium text-yellow-900">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-yellow-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-yellow-700"
                    onClick={() => togglePasswordVisibility("old")}
                  >
                    {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="new-password" className="block text-sm font-medium text-yellow-900">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-yellow-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-yellow-700"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-yellow-900">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-yellow-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-yellow-700"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-yellow-100 p-4 flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={changePasswordMutation.isPending}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-yellow-950 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-70"
          >
            {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  )
}
