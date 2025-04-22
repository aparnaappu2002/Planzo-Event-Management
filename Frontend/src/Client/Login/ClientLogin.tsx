"use client"

import  React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useClientLoginMutation,useClientGoogleLoginMutation } from "../../hooks/clientCustomHooks"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { UseDispatch } from "react-redux"
import { addClient } from "@/redux/slices/user/useSlice"
import { addToken } from "@/redux/slices/user/userToken"
import "./ClientLogin.css"
import { useDispatch } from "react-redux"
import {jwtDecode} from 'jwt-decode'
import { CredentialResponse,GoogleLogin } from "@react-oauth/google"
import { toast } from "react-toastify"

interface LoginFormData {
  email: string
  password: string
}

type GoogleAuth = {
  email: string;
  googleVerified: boolean;
  name: string;
  picture: string;
}
type Client = {
  email: string;
  googleVerified: boolean;
  name: string;
  profileImage: string
}

export const ClientLoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [googleLoading, setGoogleLoading] = useState(false)
  const googleLoginMutation = useClientGoogleLoginMutation();
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const loginMutation = useClientLoginMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const response = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      }) as LoginResponse
      console.log(response)

      // Map the response to the expected structure
    const token = response.accessToken; // Use accessToken instead of token
    const userData = response.client;   // Use client instead of user

    if (!token || !userData) {
      console.error("Invalid response structure:", response);
      throw new Error("Login successful but received invalid data");
    }

      // 1. Store the token in Redux
      dispatch(addToken(token))
      
      // 2. Store the client data in Redux
      dispatch(addClient(userData))

      
      // 3. Store token and client ID in localStorage for persistence
      localStorage.setItem('token', token)
      localStorage.setItem('clientId', userData.clientId || response.user._id || '')
      
      // Inside handleSubmit function, before navigate:
console.log("About to navigate to home page");
navigate('/');
console.log("Navigation executed");
    } catch (error) {
      // Error is already handled by the mutation
    }
  }

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      setGoogleLoading(true);
      
      
      
        try {
          console.log('clicked');
          if (credentialResponse.credential) {
            const credential: GoogleAuth = jwtDecode(credentialResponse.credential);
            console.log(credential);
            
            const client: Client = {
              email: credential.email,
              name: credential.name,
              googleVerified: true,
              profileImage: credential.picture
            };
            
            googleLoginMutation.mutate(client, {
              onSuccess: (data) => {
                console.log(data);
                dispatch(addClient(data.client));
                dispatch(addToken(data.accessToken));
                localStorage.setItem('id', data.client._id);
                toast.success('Login Successful');
                navigate('/', { replace: true });
                setGoogleLoading(false);
              },
              onError: (err) => {
                toast.error(err.message);
                setGoogleLoading(false);
              }
            });
          }
        } catch (error) {
          console.log('error while google login', error);
          setGoogleLoading(false);
        }
      
      
      
    } catch (error) {
      console.error("Google authentication error:", error);
      setGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <h1 className="logo">Planzo</h1>
          </div>
          <h2 className="welcome-text">Welcome back</h2>
          <p className="subtitle">Sign in to your account to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-container">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`form-input ${errors.password ? "input-error" : ""}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <div className="forgot-password-container">
            <a href="/forgotPassword" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="login-button" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <div >
                                        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log('login failed')} useOneTap={false}></GoogleLogin>

                                    </div>

          {loginMutation.isError && (
            <div className="api-error">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : "An error occurred during login. Please try again."}
            </div>
          )}
        </form>

        <div className="signup-prompt">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClientLoginPage
