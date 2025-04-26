"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/Store"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, Award, LogOut, Upload, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { addVendor, removeVendor } from "@/redux/slices/vendor/vendorSlice"
import { useUpdateProfileImageMutation,useUploadeImageToCloudinaryMutation } from "@/hooks/vendorCustomHooks"
import ImageCropper from "../signup/ImageCropper"
import { removeVendorToken } from "@/redux/slices/vendor/vendorTokenSlice"

// Vendor type based on the provided code
interface Vendor {
  _id: string
  email: string
  name: string
  phone: string
  role: string,
  idProof: string,
  status: string
  vendorId: string
  vendorStatus: "pending" | "approved" | "rejected"
  rejectionReason?: string
  profileImage?: string
}

export default function VendorDashboard() {
  const vendor = useSelector((state: RootState) => state.vendorSlice.vendor)
  const [isPending, setIsPending] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [showCropper, setShowCropper] = useState<boolean>(false)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [changedProfile, setChangedProfile] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const activeSection = "profile"
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const uploadCloudinary = useUploadeImageToCloudinaryMutation()
  
  useEffect(() => {
    if (vendor) {
      if (vendor?.vendorStatus === "pending") {
        setIsPending(true)
      } else if (vendor?.vendorStatus === "rejected") {
        setRejected(true)
      }
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
      formData.append('file', croppedImage)
      formData.append('upload_preset', 'Planzo') // Set your Cloudinary upload preset
      
      // Upload to Cloudinary
      const cloudinaryData = await uploadCloudinary.mutateAsync(formData)
      
      // Check if the response contains a secure_url
      if (!cloudinaryData || !cloudinaryData.secure_url) {
        throw new Error('Failed to upload image to Cloudinary')
      }
      
      const imageUrl = cloudinaryData.secure_url
  
      if (vendor && vendor._id) {
        updateImage.mutate(
          { id: vendor._id, imageUrl },
          {
            onSuccess: (data) => {
              toast.success(data?.message || "Profile image updated")
              dispatch(addVendor(data.updatedVendor))
            },
            onError: (err) => {
              handleError(err, "Error uploading profileImage in db")
            },
            onSettled: () => {
              setIsUploading(false)
              setChangedProfile(false)
            }
          },
        )
      }
    } catch (error) {
      setIsUploading(false)
      handleError(error, "Error uploading image")
    }
  }

  const handleError = (error: unknown, message: string) => {
    console.error(message, error)
    if (error instanceof Error) {
      toast.error(error.message)
    }
    if (isAxiosError(error)) {
      toast.error(error.response?.data.message || "An error occurred")
    }
  }

  const handleLogout = () => {
    navigate("/vendor/login")
    dispatch(removeVendor(null))
    dispatch(removeVendorToken(null))
    toast.success("Logout Successful")
  }

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
          <Button onClick={handleLogout} className="bg-yellow-500 hover:bg-yellow-600">
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
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
                  <div className="mt-4 md:mt-0">
                    <h2 className="text-2xl font-bold text-gray-800">{vendor?.name}</h2>
                    <p className="text-yellow-600 font-medium mt-1">Professional Event Vendor</p>
                    <p className="text-sm text-gray-500 mt-2 flex pb-3 items-center">
                      <Award className="w-4 h-4 mr-2 text-yellow-500" />
                      Vendor ID: {vendor?.vendorId || "Not Available"}
                    </p>
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