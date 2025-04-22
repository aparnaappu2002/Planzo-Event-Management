"use client"

import type React from "react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Camera, Check, Eye, EyeOff, Lock, LogOut, Mail, Phone, User, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/Store"
import { ClientUpdateProfileEntity } from "@/types/clientUpdateProfileType"
import { useUpdateClientProfie,useChangePasswordClient,useUploadeImageToCloudinaryMutation } from "@/hooks/clientCustomHooks"
import { useDispatch } from "react-redux"
import { addClient } from "@/redux/slices/user/useSlice"
import { toast } from "react-toastify"

// Define the client entity type based on the schema
interface UserData {
    _id: string,
    clientId: string,
    email: string,
    name: string,
    phone: number,
    profileImage?: string,
    role: 'client',
    status: 'active' | 'block'
}

const UserProfile: React.FC = () => {
  // Mock user data based on the schema
  const client = useSelector((state: RootState) => state.clientSlice.client)
  const [userData, setUserData] = useState<UserData>(client as UserData)
  
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: userData.name,
    phone: userData.phone
  })
  const [profileSuccess, setProfileSuccess] = useState(false)
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Profile image state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  
  const updateProfileMutation = useUpdateClientProfie()
  const changePasswordMutation = useChangePasswordClient()
  const imageUploadMutation = useUploadeImageToCloudinaryMutation();


  const dispatch=useDispatch()

  // Handle profile form changes
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
    setProfileSuccess(false)
  }

  // Handle profile edit submission
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      // Prepare update data object according to your backend expectations
      const updateData: ClientUpdateProfileEntity = {
        _id: userData._id,
        name: profileForm.name,
        phone: Number(profileForm.phone)
      }
      
      // Call the update profile mutation with success and error callbacks
      updateProfileMutation.mutate(updateData, {
        onSuccess: (data) => {
          console.log(data);
          // Update Redux state with the updated profile
          const completeUpdatedProfile = {
            ...userData,  // Preserve existing fields including status
            ...data.updatedProfile  // Override with new data from API
          };
          
          // Update Redux state with the complete profile
          dispatch(addClient(completeUpdatedProfile));
          
          // Update local state
          setUserData(completeUpdatedProfile);
      
          
          // Show success toast
          toast.success(data.message);
          
          // Reset UI state
          setProfileSuccess(true);
          setIsEditing(false);
          
          // Clear success message after delay
          setTimeout(() => {
            setProfileSuccess(false);
          }, 2000);
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
          const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
          setProfileError(errorMessage);
          toast.error(errorMessage);
        }
      });
    } catch (error) {
      console.error("Error in profile update:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setProfileError(errorMessage);
      toast.error(errorMessage);
    }
  }



  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Discard changes when exiting edit mode
      setProfileForm({
        name: userData.name,
        phone: userData.phone
      })
    }
    setIsEditing(!isEditing)
    setProfileSuccess(false)
  }

  // Handle password change
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
    setPasswordError(null)
    setPasswordSuccess(false)
  }

  // Handle password form submission
  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    // Call the API to change password
    changePasswordMutation.mutate(
      {
        clientId: userData._id,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      },
      {
        onSuccess: (data) => {
          // Show success message
          setPasswordSuccess(true)
          
          // Reset form
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
          
          // Show success toast
          toast.success(data.message || "Password changed successfully")
          
          // Clear success message after some time
          setTimeout(() => {
            setPasswordSuccess(false)
          }, 3000)
        },
        onError: (error) => {
          console.error("Error changing password:", error)
          const errorMessage = error instanceof Error ? error.message : "Failed to change password"
          setPasswordError(errorMessage)
          toast.error(errorMessage)
        }
      }
    )
  }


  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setImageFile(file);
  
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
  
      setUploadSuccess(false);
    }
  };
  

  // Handle image upload submission
  const handleImageSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;
  
    try {
      // Create FormData to send to Cloudinary
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "Planzo"); // Replace with your upload preset if needed
      formData.append("cloud_name", "dzpf5joxo");
      // Upload image to Cloudinary
      imageUploadMutation.mutate(formData, {
        onSuccess: async (data) => {
          // Get the secure URL from the Cloudinary response
          const imageUrl = data.secure_url;
          
          // Prepare update data object for profile image
          const updateData: ClientUpdateProfileEntity = {
            _id: userData._id,
            profileImage: imageUrl,
            
          };
          
          // Call the update profile mutation to save the image URL
          updateProfileMutation.mutate(updateData, {
            onSuccess: (response) => {
              // Update the user data in local state
              setUserData((prev) => ({
                ...prev,
                profileImage: imageUrl,
              }));
              
              // Update Redux state with the updated profile
              const updatedProfile = {
                ...userData,
                profileImage: imageUrl
              };
              
              dispatch(addClient(updatedProfile));
              
              // Show success message
              setUploadSuccess(true);
              toast.success("Profile photo updated successfully");
              
              // Clear success message after delay
              setTimeout(() => {
                setUploadSuccess(false);
              }, 3000);
            },
            onError: (error) => {
              console.error("Error updating profile with new image:", error);
              const errorMessage = error instanceof Error ? error.message : "Failed to update profile image";
              toast.error(errorMessage);
            }
          });
        },
        onError: (error) => {
          console.error("Error uploading image to Cloudinary:", error);
          const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
          toast.error(errorMessage);
        }
      });
    } catch (error) {
      console.error("Error in image upload:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-800 mb-6">User Profile</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-amber-100 border-amber-300 border">
            <TabsTrigger value="profile" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Change Password
            </TabsTrigger>
            <TabsTrigger value="photo" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Profile Photo
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-amber-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={previewUrl || userData.profileImage || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="bg-amber-300 text-amber-800 text-2xl">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {previewUrl && (
  <div className="mt-4 text-center">
    <p className="text-sm font-medium text-amber-800 mb-2">Preview:</p>
    <div className="inline-block border-2 border-amber-300 rounded-md p-1 shadow-sm">
      <img 
        src={previewUrl} 
        alt="Preview" 
        className="max-h-40 rounded" 
      />
    </div>
    <p className="text-xs text-gray-500 mt-2">This is how your new profile photo will look</p>
  </div>
)}
                  <div className="text-center md:text-left">
                    <CardTitle className="text-2xl">{userData.name}</CardTitle>
                    <CardDescription className="text-amber-100">
                      <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                        <Badge className="bg-white text-amber-800">{userData.role}</Badge>
                        {/* <Badge className="bg-green-500 text-white">{userData.status}</Badge> */}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {profileSuccess && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your profile has been updated successfully.</AlertDescription>
                  </Alert>
                )}

                {isEditing ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-amber-800">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-amber-800">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={toggleEditMode}
                        className="border-amber-300 hover:bg-amber-100"
                      >
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                      <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                        <Check className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{userData.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Mail className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{userData.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Phone className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{userData.phone || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-amber-50 flex justify-end">
                <Button 
                  className={`${isEditing ? "bg-amber-300 hover:bg-amber-400" : "bg-amber-600 hover:bg-amber-700"}`}
                  onClick={toggleEditMode}
                >
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Password Change Tab */}
          <TabsContent value="password">
            <Card className="border-amber-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                <CardTitle>Change Password</CardTitle>
                <CardDescription className="text-amber-100">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {passwordError && (
                    <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>Your password has been updated successfully.</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-amber-800">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-amber-800">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-amber-800">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                      <Lock className="mr-2 h-4 w-4" /> Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Photo Tab */}
          <TabsContent value="photo">
            <Card className="border-amber-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription className="text-amber-100">Update your profile picture</CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleImageSubmit} className="space-y-6">
                  {uploadSuccess && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>Your profile photo has been updated successfully.</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-amber-200">
                        <AvatarImage src={userData.profileImage} />
                        <AvatarFallback className="bg-amber-300 text-amber-800 text-3xl">
                          {userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <Label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full cursor-pointer hover:bg-amber-600 transition-colors"
                      >
                        <Camera className="h-5 w-5" />
                      </Label>
                    </div>

                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">Allowed file types: JPG, PNG, GIF</p>
                      <p className="text-sm text-gray-500">Maximum file size: 5MB</p>
                    </div>

                    <Label
                      htmlFor="profile-image"
                      className="bg-amber-100 text-amber-800 px-4 py-2 rounded-md cursor-pointer hover:bg-amber-200 transition-colors inline-flex items-center"
                    >
                      <Camera className="mr-2 h-4 w-4" /> Choose New Photo
                    </Label>
                  </div>

                  <Separator className="bg-amber-100" />

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={!imageFile}>
                      Update Profile Photo
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default UserProfile