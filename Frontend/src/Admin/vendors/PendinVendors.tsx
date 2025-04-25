"use client"

import { useState } from "react"
import { useFetchAllPendingVendorAdminQuery, useUpdatePendingVendorStatusAdmin, useRejectPendingVendor } from "@/hooks/adminCustomHooks"
import { AlertCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2, Eye } from "lucide-react"
import VendorDetailsModal from "./VendorDetails"
import { toast } from "react-toastify" // Assuming you're using react-hot-toast for notifications

// Define the vendor type based on the expected API response
interface Vendor {
  _id: string      // Changed from id to _id to match the API format
  vendorId: string
  name: string
  email: string
  phone?: string
  idProof?: string
  status: "pending"
  createdAt: string
  // Add other vendor properties as needed
}

interface PendingVendorsResponse {
  message: string
  pendingVendors: Vendor[]
  totalPages: number
}

export default function PendingVendorsAdmin() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [rejectionReason, setRejectionReason] = useState<string>("")
  const [update, setUpdate] = useState(false)
  const { data, isLoading, isError, error, refetch } = useFetchAllPendingVendorAdminQuery(currentPage)
  const updateVendorStatus = useUpdatePendingVendorStatusAdmin()
  const rejectVendor = useRejectPendingVendor()
  const response = data as PendingVendorsResponse | undefined

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (response && currentPage < response.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor)
  }

  const handleApproveVendor = (id: string) => {
    console.log(`Approving vendor ${id}`);
    updateVendorStatus.mutate({
      vendorId: id,
      newStatus: 'approved'
    }, {
      onSuccess: () => {
        refetch() // Refetch the data to update the UI
        toast.success('Vendor approved successfully')
        setSelectedVendor(null)
        setUpdate(!update) // Add this line to maintain consistency with your pattern
      },
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to approve vendor'
        toast.error(errorMessage)
        console.error('Error approving vendor:', err)
      }
    })
  }
  
  const handleRejectVendor = (vendorId: string, reason?: string) => {
    // Use the provided reason or the state value
    const rejectionReasonToUse = reason || rejectionReason
    
    if (!rejectionReasonToUse.trim()) {
      toast.error('Rejection reason is required')
      return
    }
    
    rejectVendor.mutate({
      vendorId,
      newStatus: 'rejected',
      rejectionReason: rejectionReasonToUse
    }, {
      onSuccess: () => {
        refetch() // Refetch the data to update the UI
        toast.success('Vendor rejected successfully')
        setSelectedVendor(null) // Close the modal
        setRejectionReason("") // Reset the rejection reason
        setUpdate(!update) // Add this line to maintain consistency with your pattern
      },
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to reject vendor'
        toast.error(errorMessage)
        console.error('Error rejecting vendor:', err)
      }
    })
  }

  // Helper function to render ID proof
  const renderIdProof = (vendor: Vendor) => {
    if (vendor.idProof) {
      return (
        <img 
          src={vendor.idProof} 
          alt="ID Proof" 
          className="h-12 w-12 object-cover rounded-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-id.png";
            target.alt = "ID image not available";
          }}
        />
      );
    }
    return <div className="text-sm text-gray-500">No ID Proof</div>;
  };

  // Helper function to render contact information
  const renderContactInfo = (vendor: Vendor) => {
    return (
      <>
        <div className="text-sm text-gray-700">{vendor.email}</div>
        <div className="text-sm text-gray-500">{vendor.phone || "No phone"}</div>
      </>
    );
  };

  // Helper function to render action buttons
  const renderActionButtons = (vendor: Vendor) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleViewDetails(vendor)}
          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 p-2 rounded-full"
          title="View Details"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleApproveVendor(vendor._id)}  // Changed from vendor.id to vendor._id
          disabled={updateVendorStatus.isPending}
          className={`bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-full ${
            updateVendorStatus.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Approve"
        >
          <CheckCircle className="h-5 w-5" />
        </button>
        <button 
          onClick={() => handleViewDetails(vendor)} // Open modal for rejection reason
          disabled={rejectVendor.isPending}
          className={`bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-full ${
            rejectVendor.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Reject"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border-t-4 border-yellow-500">
          <div className="bg-yellow-100 px-6 py-4 border-b border-yellow-200">
            <h1 className="text-2xl font-bold text-yellow-800">Pending Vendors</h1>
            <p className="text-yellow-700">Review and approve vendor applications</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
              <span className="ml-2 text-yellow-700">Loading vendors...</span>
            </div>
          ) : isError ? (
            <div className="bg-red-50 p-6 flex items-start">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error loading vendors</h3>
                <p className="mt-1 text-red-700">
                  {error instanceof Error ? error.message : "An unknown error occurred"}
                </p>
              </div>
            </div>
          ) : response?.pendingVendors.length === 0 ? (
            <div className="bg-yellow-50 p-6 text-center">
              <p className="text-yellow-700">No pending vendors found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-200">
                <thead className="bg-yellow-50">
                  <tr>
                    <th
                      key="header-vendor"
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      Vendor
                    </th>
                    <th
                      key="header-idproof"
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      ID Proof
                    </th>
                    <th
                      key="header-contact"
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      key="header-date"
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      Date Applied
                    </th>
                    <th
                      key="header-actions"
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-yellow-100">
                  {response?.pendingVendors.map((vendor) => (
                    <tr key={vendor._id || vendor.vendorId} className="hover:bg-yellow-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderIdProof(vendor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderContactInfo(vendor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{new Date(vendor.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {renderActionButtons(vendor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {response && response.totalPages > 0 && (
            <div className="bg-yellow-50 px-6 py-4 border-t border-yellow-200 flex items-center justify-between">
              <div className="text-sm text-yellow-700">
                Page {currentPage} of {response.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                  className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                    currentPage <= 1
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!response || currentPage >= response.totalPages}
                  className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                    !response || currentPage >= response.totalPages
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50"
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Vendor Details Modal */}
      {selectedVendor && (
        <VendorDetailsModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onApprove={handleApproveVendor}
          onReject={(vendorId, reason) => handleRejectVendor(vendorId, reason)}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          isApproving={updateVendorStatus.isPending}
          isRejecting={rejectVendor.isPending}
        />
      )}
    </div>
  )
}