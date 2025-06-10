"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import axios, { isAxiosError } from "axios"
import { toast } from "react-toastify"
import {
  User,
  CheckCircle,
  Briefcase,
  ImageIcon,
  Calendar,
  CalendarDays,
  Lock,
  Wallet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ListChecks
} from "lucide-react"

import { removeVendor } from "@/redux/slices/vendor/vendorSlice"
import { removeVendorToken } from "@/redux/slices/vendor/vendorTokenSlice"

// Define the menu item type
type MenuItem = {
  id: string
  label: string
  icon: React.ElementType
  path: string
}

// Props for the Sidebar component
interface SidebarProps {
  className?: string
  onLogout?: () => void
}

// Props for the SidebarItem component
interface SidebarItemProps {
  item: MenuItem
  isCollapsed: boolean
  isActive: boolean
}

const menuItems: MenuItem[] = [
  { id: "profile", label: "Profile", icon: User, path: "/vendor/home" },
  { id: "checkStatus", label: "Check Status", icon: CheckCircle, path: "/vendor/dashboard/status" },
  { id: "services", label: "Service", icon: Briefcase, path: "/vendor/dashboard/services" },
  { id: "workSamples", label: "Work Samples", icon: ImageIcon, path: "/vendor/dashboard/samples" },
  { id: "bookings", label: "Bookings", icon: Calendar, path: "/vendor/dashboard/bookings" },
  { id: "events", label: "Events", icon: CalendarDays, path: "/vendor/addEvents" },
  { id: "eventManagement", label: "Event Management", icon: ListChecks, path: "/vendor/manageEvents" },
  { id: "changePassword", label: "Change Password", icon: Lock, path: "/vendor/password" },
  { id: "wallet", label: "Wallet", icon: Wallet, path: "/vendor/dashboard/wallet" },
]

// SidebarItem component
const SidebarItem: React.FC<SidebarItemProps> = ({ item, isCollapsed, isActive }) => {
  const Icon = item.icon

  return (
    <li>
      <Link
        to={item.path}
        className={`
          flex items-center w-full p-3 rounded-lg transition-colors
          ${isActive ? "bg-yellow-500 text-white" : "text-gray-700 hover:bg-yellow-100"}
        `}
      >
        <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-yellow-600"}`} />
        {!isCollapsed && <span className="ml-3 text-sm font-medium transition-opacity duration-200">{item.label}</span>}
      </Link>
    </li>
  )
}

// Confirmation Modal Component
const LogoutConfirmationModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Logout</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout? You will need to sign in again to access your account.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main layout component with Sidebar and Outlet
export const VendorLayout: React.FC<SidebarProps> = ({ className = "", onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true)
      
      // Show loading toast
      const toastId = toast.loading("Logging out...")
      
      // Optional: Make API call to logout endpoint if you have one
      // await axios.post('/api/vendor/logout')
      
      // Clear Redux state
      dispatch(removeVendor({}))
      dispatch(removeVendorToken({}))
      
      // Clear any localStorage items if you have them
      localStorage.removeItem('vendorToken')
      localStorage.removeItem('vendorData')
      
      // Update toast to success
      toast.update(toastId, {
        render: "Logged out successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeButton: true
      })
      
      // Call onLogout prop if provided
      if (onLogout) {
        onLogout()
      }
      
      setShowLogoutModal(false)
      
      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate("/vendor/login")
      }, 1000)
      
    } catch (error) {
      console.error('Logout failed:', error)
      
      // Show error toast
      let errorMessage = "Logout failed. Please try again."
      
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      
      // Still close modal and navigate as fallback
      setShowLogoutModal(false)
      navigate("/vendor/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
    toast.info("Logout cancelled", {
      position: "top-right",
      autoClose: 2000,
    })
  }

  // Show toast when component mounts (optional - for welcome message)
  useEffect(() => {
    // You can add a welcome toast here if needed
    // toast.success("Welcome to Vendor Dashboard!", {
    //   position: "top-right",
    //   autoClose: 3000,
    // })
  }, [])

  return (
    <div className="flex h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {/* Sidebar */}
      <div
        className={`
          relative flex flex-col h-screen
          ${isCollapsed ? "w-16" : "w-64"}
          transition-all duration-300 ease-in-out
          bg-yellow-50 border-r border-yellow-200
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-200">
          {!isCollapsed && <h2 className="text-xl font-bold text-yellow-800">Vendor Panel</h2>}
          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed)
              // Optional: Show toast for sidebar toggle
              toast.info(isCollapsed ? "Sidebar expanded" : "Sidebar collapsed", {
                position: "bottom-left",
                autoClose: 1500,
              })
            }}
            className="p-1.5 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                isActive={location.pathname === item.path}
              />
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-yellow-200">
          <div
            className={`
              flex items-center 
              ${isCollapsed ? "justify-center" : "space-x-3"}
              mb-4
            `}
          >
            <div className="h-8 w-8 rounded-full bg-yellow-300 flex items-center justify-center">
              <User size={16} className="text-yellow-800" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-yellow-800">Vendor Name</span>
                <span className="text-xs text-yellow-600">Online</span>
              </div>
            )}
          </div>
          
          {/* Logout button */}
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className={`
              flex items-center w-full p-2 rounded-lg text-gray-700 hover:bg-yellow-100 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <LogOut className="h-5 w-5 text-yellow-600" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main content area with Outlet */}
      <main className={`flex-1 p-6 overflow-auto ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </div>
  )
}