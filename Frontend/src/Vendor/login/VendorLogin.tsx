"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import axios from "../../axios/vendorAxios"
import { isAxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { addVendor } from "@/redux/slices/vendor/vendorSlice"
import { addVendorToken } from "@/redux/slices/vendor/vendorTokenSlice"
// You would replace this with your actual API base URL


interface LoginFormData {
  email: string
  password: string
}

export default function VendorLogin() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password === "*") {
      newErrors.password = "Password cannot be just '*'"
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post("/login", formData)

      // Store vendor data in localStorage or state management
      localStorage.setItem("id", response.data.vendor._id)
      dispatch(addVendorToken(response.data.accessToken))
      dispatch(addVendor(response.data.vendor))

      // Navigate to home page (you would use your router here)
      navigate('/vendor/home')

      // Show success message
      toast.success("Login Successfull")
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "Login failed")
      } else {
        toast.error("Error while logging in")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-yellow-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-800">Planzo</h1>
          <p className="mt-2 text-sm text-yellow-700">Sign in to your vendor account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-yellow-800 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-yellow-800 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-yellow-600 hover:text-yellow-800"
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-yellow-700">
                Remember me
              </label>
            </div>
            <a href="/vendor/forgotpassword" className="text-sm font-medium text-yellow-600 hover:text-yellow-800">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center text-sm mt-4">
            <span className="text-yellow-700">Don't have an account?</span>{" "}
            <a href="/vendor/signup" className="font-medium text-yellow-600 hover:text-yellow-800">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
