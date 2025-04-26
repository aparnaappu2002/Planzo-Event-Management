"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useFindRejectedVendors } from "@/hooks/adminCustomHooks"
import Pagination from "./Pagination"
import { Eye, MoreHorizontal, UserX } from "lucide-react"
import VendorDetailModal from "./RejectedVendorDetail"

interface Vendor {
  _id: string
  vendorId: string
  name: string
  email: string
  phone: number
  idProof: string
  role: "vendor"
  status: "active" | "inactive" | "blocked"
  vendorStatus: "pending" | "approved" | "rejected"
  onlineStatus: "online" | "offline"
  lastLogin: string
  createdAt: string
  updatedAt: string
  __v: number
  profileImage?: string
}

function RejectedVendors() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [rejectedVendors, setRejectedVendors] = useState<Vendor[]>([])
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const rejectedVendorsQuery = useFindRejectedVendors(currentPage)

  useEffect(() => {
    if (rejectedVendorsQuery?.data) {
      setTotalPages(rejectedVendorsQuery.data.totalPages)
      setRejectedVendors(rejectedVendorsQuery.data.rejectedVendors)
    }
  }, [rejectedVendorsQuery?.data])

  const blockAndUnblock = (vendorId: string, currentStatus: "active" | "inactive" | "blocked") => {
    // Implementation for blocking and unblocking vendors
    console.log(`Toggling status for vendor ${vendorId} from ${currentStatus}`)
  }

  const openVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor)
  }

  const closeVendorDetails = () => {
    setSelectedVendor(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <motion.h1
        className="text-2xl font-bold tracking-tight text-amber-800 mb-6"
        initial={{ opacity: 0, x: -20, y: -10, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", bounce: 0.4 }}
      >
        Rejected Vendors
      </motion.h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200">
        {rejectedVendorsQuery.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : rejectedVendorsQuery.isError ? (
          <div className="text-center p-6 text-red-500">
            Error loading vendors:{" "}
            {rejectedVendorsQuery.error instanceof Error ? rejectedVendorsQuery.error.message : "Unknown error"}
          </div>
        ) : rejectedVendors && rejectedVendors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-amber-100">
                <tr>
                  <th className="px-6 py-3 text-amber-800">Vendor ID</th>
                  <th className="px-6 py-3 text-amber-800">Name</th>
                  <th className="px-6 py-3 text-amber-800">Email</th>
                  <th className="px-6 py-3 text-amber-800">Phone</th>
                  <th className="px-6 py-3 text-amber-800">Status</th>
                  <th className="px-6 py-3 text-amber-800">Rejected On</th>
                  <th className="px-6 py-3 text-amber-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {rejectedVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 py-4 text-amber-900">{vendor.vendorId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {vendor.idProof ? (
                          <img
                            src={vendor.idProof || "/placeholder.svg"}
                            alt={vendor.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800">
                            {vendor.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-amber-900">{vendor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-amber-900">{vendor.email}</td>
                    <td className="px-6 py-4 text-amber-900">{vendor.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vendor.status === "active"
                            ? "bg-green-100 text-green-800"
                            : vendor.status === "inactive"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-amber-900">{formatDate(vendor.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 rounded-full hover:bg-amber-100 transition-colors"
                          title="View Details"
                          onClick={() => openVendorDetails(vendor)}
                        >
                          <Eye className="h-4 w-4 text-amber-600" />
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-10 text-amber-700">No rejected vendors found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination total={totalPages} current={currentPage} setPage={setCurrentPage} />
        </div>
      )}

      {selectedVendor && <VendorDetailModal vendor={selectedVendor} onClose={closeVendorDetails} />}
    </div>
  )
}

export default RejectedVendors
