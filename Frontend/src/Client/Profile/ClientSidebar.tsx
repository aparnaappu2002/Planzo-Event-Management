import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, User, BookOpen, Wallet, Lock, Calendar, LogOut, Menu, X } from 'lucide-react';

const ClientSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: User,
      label: "My Profile",
      path: "/profile/home",
    },
    {
      icon: BookOpen,
      label: "Bookings",
      path: "/profile/bookings",
    },
    {
      icon: Wallet,
      label: "Wallet",
      path: "/wallet",
    },
    {
      icon: Lock,
      label: "Change Password",
      path: "/profile/changePassword",
    },
    {
      icon: Calendar,
      label: "Booked Events",
      path: "/events",
    },
    {
      icon: LogOut,
      label: "Logout",
      path: "/profile/logout",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-amber-100 text-amber-800"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 z-10 w-64 transition-transform duration-300 ease-in-out transform bg-amber-50 shadow-lg 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="px-6 py-6">
            <h2 className="text-2xl font-bold text-amber-800">Dashboard</h2>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive ? 'bg-amber-200 text-amber-900' : 'text-amber-700 hover:bg-amber-100'}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-amber-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
                <User className="w-6 h-6 text-amber-700" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-900">User Name</p>
                <p className="text-xs text-amber-600">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      {/* <div className="flex-1 p-6 lg:ml-0 overflow-auto">
        <Outlet />
      </div> */}
    </div>
  );
};

export default ClientSidebar;