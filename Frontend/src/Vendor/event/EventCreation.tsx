"use client"

import type React from "react"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useSelector } from "react-redux"
import { isAxiosError } from "axios"
import { toast } from "react-toastify"
import { RootState } from "@/redux/Store"

import { MapPin, Calendar, Image, Tag, Users, Check } from "lucide-react"
import { useCreateEvent,useUploadeImageToCloudinaryMutation } from "@/hooks/vendorCustomHooks" // Import the cloudinary upload hook

// Define the EventType based on the schema
interface EventType {
  title: string
  description: string
  category: string
  date: Date[]
  startTime: Date
  endTime: Date
  posterImage: string[] | File[]
  pricePerTicket: number
  totalTicket: number
  maxTicketsPerUser: number
  ticketPurchased: number
  location: {
    latitude: number
    longitude: number
  }
  address?: string
  venueName?: string
  status: "upcoming" | "completed" | "cancelled"
  createdAt?: Date
  attendees?: any[]
}



const categories = [
  "Music",
  "Conference",
  "Workshop",
  "Sports",
  "Art",
  "Food",
  "Technology",
  "Business",
  "Health",
  "Education",
  "Other",
]

const EventCreationForm: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  
  // Get vendorId from Redux store
  const vendorId = useSelector((state: RootState) => state.vendorSlice.vendor?._id || "")
  
  // Use the createEvent and cloudinary upload mutation hooks
  const createEventMutation = useCreateEvent()
  const uploadImageMutation = useUploadeImageToCloudinaryMutation()
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EventType>({
    defaultValues: {
      status: "upcoming",
      ticketPurchased: 0,
      date: [],
      posterImage: [],
      location: {
        latitude: 0,
        longitude: 0,
      },
      createdAt: new Date(),
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImagePreview: string[] = []
    const newImageFiles: File[] = []

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          newImagePreview.push(reader.result)
          newImageFiles.push(file)

          if (newImageFiles.length === files.length) {
            // Update the preview state
            setImagePreview([...imagePreview, ...newImagePreview])
            setImageFiles([...imageFiles, ...newImageFiles])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDateAdd = (date: Date) => {
    if (date) {
      const newDates = [...selectedDates, date]
      setSelectedDates(newDates)
      setValue("date", newDates)
    }
  }

  const handleDateRemove = (index: number) => {
    const newDates = selectedDates.filter((_, i) => i !== index)
    setSelectedDates(newDates)
    setValue("date", newDates)
  }

  const onSubmit = async (data: EventType) => {
    setErrorMessage("")
    setSuccessMessage("")

    if (!vendorId) {
      setErrorMessage("Vendor ID is missing. Please log in again.")
      toast.error("Please login to create an event")
      return
    }

    if (imageFiles.length === 0) {
      setErrorMessage("Please select at least one image.")
      toast.error("Please select at least one image")
      return
    }

    try {
      // Upload images to Cloudinary
      const imageUrls: string[] = []
      
      // Process each file and upload to Cloudinary
      for (const file of imageFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'Planzo')
        
        const result = await uploadImageMutation.mutateAsync(formData)
        imageUrls.push(result.secure_url)
      }

      // Create the event with uploaded image URLs
      const eventData = {
        ...data,
        date: selectedDates,
        posterImage: imageUrls,
        createdAt: new Date(),
        attendees: [],
        ticketPurchased: 0,
      }

      // Use the mutation to create the event
      await createEventMutation.mutateAsync({ event: eventData, vendorId })
      
      setSuccessMessage("Event created successfully!")
      toast.success("Event created successfully!")
      
      // Reset form after successful submission
      reset()
      setSelectedDates([])
      setImagePreview([])
      setImageFiles([])
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
        toast.error(error.message)
      } else {
        setErrorMessage("An unknown error occurred")
        toast.error("An unknown error occurred")
      }
    }
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-yellow-400 py-6 px-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-800 mt-2">Fill in the details to create your event</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="py-8 px-8">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-yellow-500" />
                Basic Information
              </h2>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Event Title*</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter event title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Category*</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Description*</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Describe your event"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Date and Time */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-yellow-500" />
                Date and Time
              </h2>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Event Dates*</label>
              <div className="flex items-center">
                <Controller
                  control={control}
                  name="date"
                  rules={{ required: "At least one date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      selected={null}
                      onChange={handleDateAdd}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholderText="Add event date"
                      minDate={new Date()}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => handleDateAdd(new Date())}
                  className="ml-2 px-3 py-2 bg-yellow-400 text-gray-800 rounded-md hover:bg-yellow-500"
                >
                  Add
                </button>
              </div>
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedDates.map((date, index) => (
                  <div key={index} className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                    <span className="text-sm">{date.toLocaleDateString()}</span>
                    <button
                      type="button"
                      onClick={() => handleDateRemove(index)}
                      className="ml-2 text-gray-600 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Start Time*</label>
                  <Controller
                    control={control}
                    name="startTime"
                    rules={{ required: "Start time is required" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholderText="Select time"
                      />
                    )}
                  />
                  {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">End Time*</label>
                  <Controller
                    control={control}
                    name="endTime"
                    rules={{ required: "End time is required" }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholderText="Select time"
                      />
                    )}
                  />
                  {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-yellow-500" />
                Location
              </h2>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Venue Name</label>
              <input
                type="text"
                {...register("venueName")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter venue name"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              <input
                type="text"
                {...register("address")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter address"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Latitude*</label>
              <input
                type="number"
                step="any"
                {...register("location.latitude", {
                  required: "Latitude is required",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter latitude"
              />
              {errors.location?.latitude && (
                <p className="text-red-500 text-sm mt-1">{errors.location.latitude.message}</p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Longitude*</label>
              <input
                type="number"
                step="any"
                {...register("location.longitude", {
                  required: "Longitude is required",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter longitude"
              />
              {errors.location?.longitude && (
                <p className="text-red-500 text-sm mt-1">{errors.location.longitude.message}</p>
              )}
            </div>

            {/* Tickets */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-yellow-500" />
                Tickets
              </h2>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Price Per Ticket*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("pricePerTicket", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="0.00"
                />
              </div>
              {errors.pricePerTicket && <p className="text-red-500 text-sm mt-1">{errors.pricePerTicket.message}</p>}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Total Tickets*</label>
              <input
                type="number"
                min="1"
                {...register("totalTicket", {
                  required: "Total tickets is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "At least 1 ticket is required" },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter total tickets"
              />
              {errors.totalTicket && <p className="text-red-500 text-sm mt-1">{errors.totalTicket.message}</p>}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Max Tickets Per User*</label>
              <input
                type="number"
                min="1"
                {...register("maxTicketsPerUser", {
                  required: "Max tickets per user is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "At least 1 ticket per user is required" },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter max tickets per user"
              />
              {errors.maxTicketsPerUser && (
                <p className="text-red-500 text-sm mt-1">{errors.maxTicketsPerUser.message}</p>
              )}
            </div>

            {/* Images */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4 flex items-center">
                <Image className="w-5 h-5 mr-2 text-yellow-500" />
                Event Images
              </h2>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Poster Images*</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {imagePreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPreview = imagePreview.filter((_, i) => i !== index)
                          setImagePreview(newPreview)
                          const newFiles = imageFiles.filter((_, i) => i !== index)
                          setImageFiles(newFiles)
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="col-span-2 mt-6">
              <button
                type="submit"
                disabled={createEventMutation.isPending || uploadImageMutation.isPending}
                className={`w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex items-center justify-center ${
                  (createEventMutation.isPending || uploadImageMutation.isPending) ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {(createEventMutation.isPending || uploadImageMutation.isPending) ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventCreationForm