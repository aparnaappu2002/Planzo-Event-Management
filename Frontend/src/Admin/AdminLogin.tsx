"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { useAdminLoginMutation } from "@/hooks/adminCustomHooks"
import { Eye, EyeOff } from "lucide-react" 
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addAdminToken } from "@/redux/slices/admin/adminToken"
import { isAxiosError } from "axios"
import { toast } from "react-toastify"

// Types

interface admin {
    email: string
    password: string
  }

const AdminLogin: React.FC = () => {
  // Form state
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  
  // Validation state
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  
  // Login mutation
  const loginMutation = useAdminLoginMutation()
  const loading = loginMutation.isPending
  const error = loginMutation.error?.message || null
  const navigate = useNavigate()
    const dispatch = useDispatch()

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  // Validate email
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      setEmailError("Email is required")
      return false
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  // Validate password
  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError("Password is required")
      return false
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return false
    }
    setPasswordError("")
    return true
  }


  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form inputs
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    
    if (!isEmailValid || !isPasswordValid) {
      return
    }
    
    // Prepare values object
    const values: admin = { email, password }
    console.log(values)
    
    // Use the mutation with callbacks
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        console.log(data)
        // Store token in Redux
        dispatch(addAdminToken(data.accessToken))
        
        // Store ID in localStorage (and token if remember me is checked)
        localStorage.setItem('id', data.id)
        if (rememberMe) {
          localStorage.setItem('adminAccessToken', data.accessToken)
        }
        
        // Show success message
        toast.success('Admin logged in successfully')
        
        // Navigate to dashboard
        navigate('/admin/dashboard', { replace: true })
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          console.log(error)
          toast.error(error?.response?.data?.error || 'Login failed')
        } else {
          console.log(error)
          toast.error(error.message || 'An error occurred during login')
        }
      }
    })
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-yellow-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">Enter your credentials to access the admin panel</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) validateEmail(e.target.value)
              }}
              onBlur={(e) => validateEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="admin@example.com"
              required
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) validatePassword(e.target.value)
                }}
                onBlur={(e) => validatePassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={20} className="h-5 w-5" />
                ) : (
                  <Eye size={20} className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span>Microsoft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin