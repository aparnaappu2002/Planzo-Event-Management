"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/Store"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Shield,
  Award,
  LogOut,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Save,
  X,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react"
import { addVendor, removeVendor } from "@/redux/slices/vendor/vendorSlice"
import { 
  useUpdateProfileImageMutation, 
  useUploadeImageToCloudinaryMutation,
  useUpdateVendorDetailsMutation,
  useReapplyVendor 
} from "@/hooks/vendorCustomHooks"
import ImageCropper from "../signup/ImageCropper"
import { removeVendorToken } from "@/redux/slices/vendor/vendorTokenSlice"

export default function VendorDashboard() {
  const vendor = useSelector((state: RootState) => state.vendorSlice.vendor)
  const [isPending, setIsPending] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [showCropper, setShowCropper] = useState<boolean>(false)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [changedProfile, setChangedProfile] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [connectionError, setConnectionError] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    about: "",
  })
  const activeSection = "profile"
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const uploadCloudinary = useUploadeImageToCloudinaryMutation()
  const updateVendorDetailsMutation = useUpdateVendorDetailsMutation()
  const reapplyVendorMutation = useReapplyVendor()

  useEffect(() => {
    if (vendor) {
      if (vendor?.vendorStatus === "pending") {
        setIsPending(true)
      } else if (vendor?.vendorStatus === "rejected") {
        setRejected(true)
      }

      // Initialize form data with vendor details
      setFormData({
        name: vendor?.name || "",
        phone: vendor?.phone || "",
        about: vendor?.about || "",
      })
    }
  }, [vendor])

  const updateImage = useUpdateProfileImageMutation()

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const imageString = URL.createObjectURL(file)
      setSelectedImage(imageString)
      setShowCropper(true)
      setChangedProfile(true)
    } catch (error) {
      handleError(error, "Error selecting image")
    }
  }

  const handleImageSave = async () => {
    try {
      if (!croppedImage) {
        toast.error("Please crop the image before uploading.")
        return
      }

      setIsUploading(true)

      // Create a FormData instance to upload to Cloudinary
      const formData = new FormData()
      formData.append("file", croppedImage)
      formData.append("upload_preset", "Planzo") // Set your Cloudinary upload preset

      // Upload to Cloudinary
      const cloudinaryData = await uploadCloudinary.mutateAsync(formData)

      // Check if the response contains a secure_url
      if (!cloudinaryData || !cloudinaryData.secure_url) {
        throw new Error("Failed to upload image to Cloudinary")
      }

      const imageUrl = cloudinaryData.secure_url

      if (vendor && vendor._id) {
        updateImage.mutate(
          { id: vendor._id, imageUrl },
          {
            onSuccess: (data) => {
              toast.success(data?.message || "Profile image updated")
              dispatch(addVendor(data.updatedVendor))
              setConnectionError(false)
            },
            onError: (err) => {
              handleError(err, "Error uploading profileImage in db")
            },
            onSettled: () => {
              setIsUploading(false)
              setChangedProfile(false)
            },
          },
        )
      }
    } catch (error) {
      setIsUploading(false)
      handleError(error, "Error uploading image")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileUpdate = async () => {
    try {
      if (!vendor?._id) {
        toast.error("Vendor ID not found")
        return
      }

      updateVendorDetailsMutation.mutate(
        {
          id: vendor._id,
          name: formData.name,
          phone: formData.phone,
          about: formData.about,
        },
        {
          onSuccess: (data) => {
            toast.success("Profile updated successfully")
            dispatch(addVendor({ ...vendor, ...formData }))
            setIsEditing(false)
            setConnectionError(false)
          },
          onError: (error) => {
            handleError(error, "Error updating profile")
          },
        },
      )
    } catch (error) {
      handleError(error, "Error updating profile")
    }
  }

  const handleError = (error: unknown, message: string) => {
    console.error(message, error)
    
    // Check for connection errors
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isConnectionError = errorMessage.includes('ERR_CONNECTION_REFUSED') || 
                             errorMessage.includes('ECONNREFUSED') ||
                             errorMessage.includes('Network Error') ||
                             errorMessage.includes('Failed to fetch')

    if (isConnectionError) {
      setConnectionError(true)
      toast.error("Cannot connect to server. Please check if the backend is running and try again.")
      return
    }

    if (error instanceof Error) {
      toast.error(error.message)
    } else if (isAxiosError(error)) {
      toast.error(error.response?.data.message || "An error occurred")
    } else {
      toast.error("An unexpected error occurred")
    }
  }

  const handleLogout = () => {
    navigate("/vendor/login")
    dispatch(removeVendor(null))
    dispatch(removeVendorToken(null))
    toast.success("Logout Successful")
  }

  const cancelEditing = () => {
    setIsEditing(false)
    // Reset form data to original values
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        phone: vendor.phone || "",
        about: vendor.about || "",
      })
    }
  }

 const handleReapply = async () => {
  // Early return for missing vendor ID
  if (!vendor?._id) {
    toast.error("Vendor ID not found");
    return;
  }

  // No need for try-catch since mutation handles errors
  reapplyVendorMutation.mutate(
    {
      vendorId: vendor._id,
      newStatus: "pending"
    },
    {
      onSuccess: (data) => {
        toast.success(
          data?.message || "Reapplication submitted successfully! Your application is now under review."
        );
        
        // Update local state
        dispatch(addVendor(data.updatedVendor));
        setRejected(false);
        setIsPending(true);
        setConnectionError(false);
      },
      onError: (error) => {
        handleError(error, "Error submitting reapplication");
      },
    }
  );
};

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      if (response.ok) {
        setConnectionError(false)
        toast.success("Connection restored!")
      }
    } catch (error) {
      toast.error("Backend server is still not responding. Please start your backend server.")
    }
  }

  // Connection Error Alert Component
  const ConnectionErrorAlert = () => (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <div className="flex items-start">
        <WifiOff className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
          <p className="text-sm text-red-700 mt-1">
            Cannot connect to the backend server. Please ensure your backend is running on localhost:3000.
          </p>
          <div className="mt-3 flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={checkBackendConnection}
              className="text-red-700 border-red-300 hover:bg-red-50"
            >
              <Wifi className="w-4 h-4 mr-1" />
              Retry Connection
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConnectionError(false)}
              className="text-gray-600 border-gray-300"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Mock components for conditional rendering
  const PendingRequest = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <Clock className="w-16 h-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your Application is Pending</h2>
          <p className="text-gray-600 mb-6">
            Your vendor application is currently under review. We'll notify you once it's approved.
          </p>
          <Button onClick={handleLogout} className="bg-yellow-500 hover:bg-yellow-600">
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  )

  const RejectedVendorPage = ({ reason }: { reason?: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Application Rejected</h2>
          <p className="text-gray-600 mb-6">
            {reason || "Your vendor application has been rejected. Please contact support for more information."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              onClick={handleReapply} 
              className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
              disabled={reapplyVendorMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 ${reapplyVendorMutation.isPending ? 'animate-spin' : ''}`} />
              {reapplyVendorMutation.isPending ? "Submitting..." : "Reapply"}
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      {connectionError && <ConnectionErrorAlert />}
      {isPending && <PendingRequest />}
      {rejected && <RejectedVendorPage reason={vendor?.rejectionReason} />}
      {showCropper && (
        <ImageCropper image={selectedImage} onCropComplete={setCroppedImage} showCropper={setShowCropper} />
      )}

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            <p className="text-gray-700 mt-3 text-lg">
              Welcome back, {vendor?.name || "Vendor"}! Here's your {activeSection} overview.
            </p>
          </header>

          <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-95">
            {activeSection === "profile" && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                  <div className="relative h-32 w-32 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 p-1 group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden relative group">
                      {vendor?.profileImage ? (
                        <img
                          src={croppedImage ? URL.createObjectURL(croppedImage) : vendor?.profileImage}
                          alt={vendor.name || "Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-yellow-500 text-3xl font-semibold">{vendor?.name?.charAt(0) || "V"}</span>
                      )}
                      <div className="absolute inset-0 bg-yellow-500 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                          <Upload className="w-6 h-6 mx-auto" />
                          Update Photo
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{vendor?.name}</h2>
                        <p className="text-yellow-600 font-medium mt-1">Professional Event Vendor</p>
                        <p className="text-sm text-gray-500 mt-2 flex pb-3 items-center">
                          <Award className="w-4 h-4 mr-2 text-yellow-500" />
                          Vendor ID: {vendor?.vendorId || "Not Available"}
                        </p>
                      </div>
                      {!isEditing && (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                    {changedProfile && (
                      <Button
                        onClick={handleImageSave}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Update Image"}
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="my-6 bg-yellow-200" />

                {isEditing ? (
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-sm border border-yellow-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Edit className="w-5 h-5 mr-2 text-yellow-500" />
                        Edit Profile
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          onClick={cancelEditing}
                          variant="outline"
                          size="sm"
                          className="text-gray-600 border-gray-300"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleProfileUpdate}
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          disabled={updateVendorDetailsMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {updateVendorDetailsMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Your full name"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                          About
                        </label>
                        <textarea
                          id="about"
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          rows={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                          placeholder="Tell clients about yourself and your services"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-sm border border-yellow-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-yellow-500" />
                        Contact Information
                      </h3>
                      <div className="space-y-3 text-gray-600">
                        <p className="flex items-center">
                          <span className="font-medium mr-2">Email:</span>
                          {vendor?.email || "Not Available"}
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium mr-2">Phone:</span>
                          {vendor?.phone || "Not Available"}
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium mr-2">Status:</span>
                          <span
                            className={`capitalize ${vendor?.status === "active" ? "text-green-600" : "text-red-600"} flex items-center`}
                          >
                            {vendor?.status === "active" ? (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 mr-1" />
                            )}
                            {vendor?.status || "Not Available"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-sm border border-yellow-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-yellow-500" />
                        Vendor Status
                      </h3>
                      <div className="space-y-3 text-gray-600">
                        <p className="flex items-center">
                          <span className="font-medium mr-2">Account Type:</span>
                          <span className="capitalize">{vendor?.role || "Not Available"}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium mr-2">Verification:</span>
                          <span
                            className={`capitalize flex items-center ${
                              vendor?.vendorStatus === "approved"
                                ? "text-green-600"
                                : vendor?.vendorStatus === "pending"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {vendor?.vendorStatus === "approved" ? (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            ) : vendor?.vendorStatus === "pending" ? (
                              <Clock className="w-4 h-4 mr-1" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 mr-1" />
                            )}
                            {vendor?.vendorStatus || "Not Available"}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium mr-2">ID:</span>
                          <span className="font-mono text-sm">{vendor?._id || "Not Available"}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-sm border border-yellow-200 mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-yellow-500" />
                      About Me
                    </h3>
                    <p className="text-gray-600">
                      {vendor?.about ||
                        "No information provided yet. Click 'Edit Profile' to add details about yourself."}
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-sm border border-yellow-200 mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-yellow-500" />
                    Account Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500">Total Events</h4>
                      <p className="text-2xl font-bold text-yellow-600">0</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500">Pending Events</h4>
                      <p className="text-2xl font-bold text-yellow-600">0</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500">Completed Events</h4>
                      <p className="text-2xl font-bold text-yellow-600">0</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button
                    onClick={handleLogout}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}