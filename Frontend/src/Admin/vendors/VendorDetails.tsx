"use client"

import { X } from "lucide-react"
import { useState } from "react"

interface Vendor {
  _id: string  // Changed from id to _id to match the API format
  name: string
  email: string
  phone?: string
  businessName?: string
  idProof?: string
  status: "pending"
  createdAt: string
  // Add other vendor properties as needed
}

interface VendorDetailsModalProps {
  vendor: Vendor | null
  onClose: () => void
  onApprove: (vendorId: string) => void
  onReject: (vendorId: string, reason: string) => void
  rejectionReason: string
  setRejectionReason: (reason: string) => void
  isApproving: boolean
  isRejecting: boolean
}

export default function VendorDetailsModal({ 
  vendor, 
  onClose, 
  onApprove, 
  onReject,
  rejectionReason,
  setRejectionReason,
  isApproving,
  isRejecting
}: VendorDetailsModalProps) {
  if (!vendor) return null

  const [showRejectionInput, setShowRejectionInput] = useState(false)

  const handleReject = () => {
    if (showRejectionInput) {
      if (!rejectionReason.trim()) {
        // Show inline validation error
        return
      }
      onReject(vendor._id, rejectionReason)
    } else {
      setShowRejectionInput(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-yellow-100 px-6 py-4 border-b border-yellow-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-yellow-800">Vendor Details</h2>
          <button onClick={onClose} className="text-yellow-700 hover:text-yellow-900">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Vendor Information</h3>
              <div className="mt-2 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{vendor.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{vendor.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Business Information</h3>
              <div className="mt-2 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Business Name</p>
                  <p className="text-sm font-medium text-gray-900">{vendor.businessName || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Application Date</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Review
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ID Proof Section */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">ID Proof</h3>
            <div className="mt-2">
              {vendor.idProof ? (
                <div className="border border-gray-200 rounded-md p-2">
                  <img 
                    src={vendor.idProof} 
                    alt="ID Proof" 
                    className="max-h-64 object-contain mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-id.png";
                      target.alt = "ID image not available";
                    }}
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-500 py-2">No ID proof provided</div>
              )}
            </div>
          </div>

          {/* Rejection Reason Input */}
          {showRejectionInput && (
            <div className="mt-6">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="rejectionReason"
                  name="rejectionReason"
                  rows={3}
                  className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Please provide a reason for rejecting this vendor"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                {rejectionReason.trim() === "" && showRejectionInput && (
                  <p className="mt-1 text-sm text-red-600">Rejection reason is required</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-3">
            {!showRejectionInput ? (
              <>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => onApprove(vendor._id)}  // Changed from vendor.id to vendor._id
                  disabled={isApproving}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                    isApproving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isApproving ? "Approving..." : "Approve Vendor"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectionInput(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isRejecting || !rejectionReason.trim()}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    (isRejecting || !rejectionReason.trim()) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}