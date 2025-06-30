import React from "react"
import { X, AlertTriangle } from "lucide-react"

interface Vendor {
  _id: string  
  id?: string  
  vendorId?: string 
  name: string
  email: string
  phone?: string | number
  address?: string
  status: "active" | "inactive" | "pending" | "blocked"
  createdAt: string
}

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  vendor: Vendor | null
  action: "block" | "unblock"
  isLoading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  vendor, 
  action,
  isLoading = false
}) => {
  if (!isOpen || !vendor) return null

  const isBlocking = action === "block"
  const actionText = isBlocking ? "Block" : "Unblock"
  const actionColor = isBlocking ? "red" : "green"

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isLoading, onClose])

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className={`h-6 w-6 ${isBlocking ? 'text-red-500' : 'text-green-500'} mr-2`} />
              <h3 className="text-lg font-semibold text-gray-900">
                {actionText} Vendor
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to {action} this vendor?
            </p>
            
            {/* Vendor Info Card */}
            {/* <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="text-sm space-y-1">
                <div className="font-medium text-gray-900">{vendor.name}</div>
                <div className="text-gray-600">{vendor.email}</div>
                {vendor.phone && (
                  <div className="text-gray-600">Phone: {vendor.phone}</div>
                )}
                <div className="text-gray-500">
                  Current Status: {' '}
                  <span className={`font-medium capitalize px-2 py-1 rounded-full text-xs ${
                    vendor.status === 'active' ? 'bg-green-100 text-green-800' :
                    vendor.status === 'blocked' ? 'bg-red-100 text-red-800' :
                    vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vendor.status}
                  </span>
                </div>
              </div>
            </div> */}
            
            {/* Warning Message */}
            {/* {isBlocking && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> Blocking this vendor will prevent them from:
                </p>
                <ul className="text-sm text-red-600 mt-1 ml-4 list-disc">
                  <li>Accessing their account</li>
                  <li>Managing their products/services</li>
                  <li>Processing orders</li>
                  <li>Receiving payments</li>
                </ul>
              </div>
            )} */}

            {!isBlocking && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Note:</strong> Unblocking this vendor will restore their access to all account features and services.
                </p>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                isBlocking 
                  ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400' 
                  : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
              }`}
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              )}
              {isLoading ? `${actionText}ing...` : `${actionText} Vendor`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal