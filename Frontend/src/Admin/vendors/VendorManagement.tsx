"use client"

import type React from "react"
import { useState } from "react"
import { useFetchVendorAdminQuery, useBlockVendor, useUnblockVendor } from "../../hooks/adminCustomHooks"
import { ChevronLeft, ChevronRight, Search, RefreshCw, Ban, CheckCircle } from "lucide-react"
import { toast } from "react-toastify" 
import { useQueryClient } from "@tanstack/react-query"

interface Vendor {
  _id: string  // Backend appears to use _id rather than id
  id?: string  // Handle both formats just in case
  vendorId?: string // Some implementations might use vendorId
  name: string
  email: string
  phone?: string | number
  address?: string
  status: "active" | "inactive" | "pending" | "blocked"
  createdAt: string
}

const VendorListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const { data, isLoading, isError, error, refetch } = useFetchVendorAdminQuery(currentPage)
  const vendors: Vendor[] = data?.vendors || []
  const totalPages = data?.totalPages || 0

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const queryClient = useQueryClient()
  const blockVendor = useBlockVendor()
  const unblockVendor = useUnblockVendor()

  const handleBlockUnblock = (vendor: Vendor, action: "block" | "unblock") => {
    // Find the correct ID field - try multiple options as backends can differ
    const vendorId = vendor._id || vendor.id || vendor.vendorId
    
    console.log(`Attempting to ${action} vendor with ID:`, vendorId)
    console.log("Vendor object:", vendor)
    console.log("Current status:", vendor.status)
    
    if (!vendorId) {
      toast.error("Vendor ID is missing")
      return
    }
    
    if (action === "block") {
      blockVendor.mutate(vendorId, {
        onSuccess: (data) => {
          toast.success(data.message || "Vendor blocked successfully")
          queryClient.invalidateQueries({ queryKey: ["vendors", currentPage] })
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to block vendor")
          console.error("Block vendor error:", err)
        },
      })
    } else {
      unblockVendor.mutate(vendorId, {
        onSuccess: (data) => {
          toast.success(data.message || "Vendor unblocked successfully")
          queryClient.invalidateQueries({ queryKey: ["vendors", currentPage] })
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to unblock vendor")
          console.error("Unblock vendor error:", err)
        },
      })
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "blocked":
        return "bg-red-100 text-red-800 font-bold"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-yellow-200 bg-yellow-100">
            <h1 className="text-2xl font-bold text-yellow-900">Vendors Management</h1>
            <p className="text-yellow-700 mt-1">Manage all registered vendors in the system</p>
          </div>

          <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-yellow-500" />
              </div>
              <input
                type="text"
                className="bg-white border border-yellow-300 text-yellow-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 p-2.5"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : isError ? (
            <div className="p-8 text-center bg-white">
              <div className="mb-4 text-red-500 text-lg font-semibold">Error Loading Vendors</div>
              <p className="text-gray-600">
                {error instanceof Error ? error.message : "An error occurred while fetching vendors data."}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-8 text-center bg-white">
              <p className="text-gray-600">No vendors found{searchTerm ? " matching your search" : ""}.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-200">
                <thead className="bg-yellow-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      Vendor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      Joined Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-yellow-100">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor._id || vendor.id} className="hover:bg-yellow-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">ID: {vendor._id || vendor.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vendor.email}</div>
                        {vendor.phone && <div className="text-sm text-gray-500">{vendor.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(vendor.status)}`}
                        >
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vendor.status === "active" ? (
                          <button
                            onClick={() => handleBlockUnblock(vendor, "block")}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors mr-2"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockUnblock(vendor, "unblock")}
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Unblock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && totalPages > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-yellow-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span> pages
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-yellow-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-yellow-700 hover:bg-yellow-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Page numbers */}
                    {[...Array(totalPages).keys()].map((number) => {
                      const pageNumber = number + 1
                      // Only show current page, first, last, and adjacent pages
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNumber
                                ? "z-10 bg-yellow-100 border-yellow-500 text-yellow-800"
                                : "bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        )
                      }

                      // Show ellipsis for gaps
                      if (
                        (pageNumber === 2 && currentPage > 3) ||
                        (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span
                            key={`ellipsis-${pageNumber}`}
                            className="relative inline-flex items-center px-4 py-2 border border-yellow-300 bg-white text-sm font-medium text-yellow-700"
                          >
                            ...
                          </span>
                        )
                      }

                      return null
                    })}

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-yellow-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-yellow-700 hover:bg-yellow-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>

              {/* Mobile pagination */}
              <div className="flex items-center justify-between w-full sm:hidden">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-yellow-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-white text-gray-300 cursor-not-allowed"
                      : "bg-white text-yellow-700 hover:bg-yellow-50"
                  }`}
                >
                  Previous
                </button>
                <p className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </p>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-yellow-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-white text-gray-300 cursor-not-allowed"
                      : "bg-white text-yellow-700 hover:bg-yellow-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VendorListPage