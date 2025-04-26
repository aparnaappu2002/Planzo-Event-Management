"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom"
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
  LogOut
} from "lucide-react"

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
  { id: "events", label: "Events", icon: CalendarDays, path: "/vendor/dashboard/events" },
  { id: "changePassword", label: "Change Password", icon: Lock, path: "/vendor/dashboard/password" },
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

// Main layout component with Sidebar and Outlet
export const VendorLayout: React.FC<SidebarProps> = ({ className = "", onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Default logout behavior
      navigate("/vendor/login")
    }
  }

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
            onClick={() => setIsCollapsed(!isCollapsed)}
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
            onClick={handleLogout}
            className={`
              flex items-center w-full p-2 rounded-lg text-gray-700 hover:bg-yellow-100 transition-colors
            `}
          >
            <LogOut className="h-5 w-5 text-yellow-600" />
            {!isCollapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content area with Outlet */}
      <main className={`flex-1 p-6 overflow-auto ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}


