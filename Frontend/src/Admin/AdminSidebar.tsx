import React from "react"
import { NavLink } from "react-router-dom"

// Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const VendorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

interface MenuItem {
  title: string
  path: string
  icon: React.ReactNode
  submenu?: { title: string; path: string }[]
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
    },
    {
      title: "User Management",
      path: "/admin/userManagement",
      icon: <UserIcon />,
      submenu: [
        { title: "All Users", path: "/admin/users" },
        { title: "Add User", path: "/admin/users/add" },
        { title: "User Roles", path: "/admin/users/roles" },
      ],
    },
    {
      title: "Vendor Management",
      path: "/admin/vendorManagement",
      icon: <VendorIcon />,
      submenu: [
        { title: "Approved Vendors", path: "/admin/vendorManagement" },
        { title: "Rejected Vendors", path: "/admin/rejectedVendors" },
        { title: "Pending Vendors", path: "/admin/pendingVendors" },
      ],
    },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-16 bg-yellow-500 text-white">
          <div className="text-xl font-bold">Admin Portal</div>
        </div>

        <nav className="mt-5 px-2">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    isActive
                      ? "bg-yellow-100 text-yellow-700"
                      : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
                  }`
                }
                end={!item.submenu}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>

              {item.submenu && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? "bg-yellow-100 text-yellow-700"
                            : "text-gray-500 hover:bg-yellow-50 hover:text-yellow-600"
                        }`
                      }
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full">
          <div className="px-4 py-4 border-t border-gray-200">
            <button className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors">
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
