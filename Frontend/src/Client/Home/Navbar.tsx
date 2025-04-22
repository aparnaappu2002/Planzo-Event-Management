"use client"

import  React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, ChevronDown, LogIn, Menu, Ticket, User, UserCircle, X } from "lucide-react"
import { useSelector } from "react-redux"

import { RootState } from "@/redux/Store"



export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate=useNavigate()
  
  const client = useSelector((state: RootState) => state.clientSlice.client)
  const isLoggedIn = !!client


  const handleLoginClick = () => {
    navigate('/login') 
  }

  const handleSignupClick = () => {
    navigate('/signup') 
  }
  const handleProfileClick = () => {
    navigate('/userProfile')
  }
  

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">Planzo</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary">
            Home
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary">
            Events
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary">
            About
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary">
            Contact
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Event Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Concerts</DropdownMenuItem>
              <DropdownMenuItem>Conferences</DropdownMenuItem>
              <DropdownMenuItem>Exhibitions</DropdownMenuItem>
              <DropdownMenuItem>Sports</DropdownMenuItem>
              <DropdownMenuItem>Theater</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View All Events</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <UserCircle className="w-5 h-5" />
                  <span>Profile</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Ticket className="w-4 h-4 mr-2" />
                  My Tickets
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem >Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-9" onClick={handleLoginClick}>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button className="h-9 bg-primary hover:bg-primary/90" onClick={handleSignupClick}>Sign Up</Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col w-full h-full pt-16 bg-white md:hidden">
          <div className="flex flex-col p-4 space-y-4 overflow-y-auto">
            <a href="#" className="py-2 text-lg font-medium border-b">
              Home
            </a>
            <a href="#" className="py-2 text-lg font-medium border-b">
              Events
            </a>
            <a href="#" className="py-2 text-lg font-medium border-b">
              About
            </a>
            <a href="#" className="py-2 text-lg font-medium border-b">
              Contact
            </a>

            <div className="py-2 text-lg font-medium border-b">
              <div className="flex items-center justify-between">
                <span>Book Tickets</span>
                <ChevronDown className="w-5 h-5" />
              </div>
              <div className="pl-4 mt-2 space-y-2">
                <a href="#" className="block py-1">
                  Concerts
                </a>
                <a href="#" className="block py-1">
                  Conferences
                </a>
                <a href="#" className="block py-1">
                  Exhibitions
                </a>
                <a href="#" className="block py-1">
                  Sports
                </a>
                <a href="#" className="block py-1">
                  Theater
                </a>
              </div>
            </div>

            {isLoggedIn ? (
              <div className="py-2 text-lg font-medium border-b">
                <div className="flex items-center justify-between">
                  <span>My Account</span>
                  <ChevronDown className="w-5 h-5" />
                </div>
                <div className="pl-4 mt-2 space-y-2">
                  <a href="/profile" className="block py-1">
                    Profile
                  </a>
                  <a href="#" className="block py-1">
                    My Tickets
                  </a>
                  <a href="#" className="block py-1">
                    Logout
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="outline" className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
