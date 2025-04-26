"use client"

import { X } from "lucide-react"
import { useEffect, useRef } from "react"

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

interface VendorDetailModalProps {
  vendor: Vendor | null
  onClose: () => void
}

const RejectedVendorDetailModal = ({ vendor, onClose }: VendorDetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)

    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  if (!vendor) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-amber-200 bg-amber-50">
          <h2 className="text-xl font-bold text-amber-800">Vendor Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-amber-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-amber-600" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center">
              {vendor.idProof ? (
                <img
                  src={vendor.idProof || "/placeholder.svg"}
                  alt={vendor.name}
                  className="w-40 h-40 rounded-full object-cover border-4 border-amber-200"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 text-4xl font-bold">
                  {vendor.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-amber-900">{vendor.name}</h3>
                <p className="text-amber-600">{vendor.vendorId}</p>
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vendor.status === "active"
                        ? "bg-green-100 text-green-800"
                        : vendor.status === "inactive"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-amber-500">Email</p>
                  <p className="font-medium text-amber-900">{vendor.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-amber-500">Phone</p>
                  <p className="font-medium text-amber-900">{vendor.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-amber-500">Vendor Status</p>
                  <p className="font-medium text-red-600">Rejected</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-amber-500">Online Status</p>
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        vendor.onlineStatus === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    <p className="font-medium text-amber-900">{vendor.onlineStatus}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-amber-500">Last Login</p>
                  <p className="font-medium text-amber-900">{formatDate(vendor.lastLogin)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-amber-500">Rejected On</p>
                  <p className="font-medium text-amber-900">{formatDate(vendor.updatedAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-amber-500">Account Created</p>
                  <p className="font-medium text-amber-900">{formatDate(vendor.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-amber-500">ID Proof</p>
                  <p className="font-medium text-amber-900">{vendor.idProof}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-100">
                <h4 className="font-semibold text-amber-800 mb-2">Rejection Details</h4>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-amber-900">
                    This vendor was rejected due to incomplete documentation and verification issues. The vendor needs
                    to resubmit proper identification and business credentials for reconsideration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-amber-200 bg-amber-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-100 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
            Reconsider Vendor
          </button>
        </div>
      </div>
    </div>
  )
}

export default RejectedVendorDetailModal
