"use client"

import React, { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Calendar, Clock, MapPin, Users, X, Tag, DollarSign, Check, AlertCircle } from "lucide-react"
import { EventUpdateEntity } from "@/types/updateEventType"

// Use the EventType interface
interface EventType {
  _id: string
  title: string
  description: string
  location: {
    longitude: number,
    latitude: number
  }
  startTime: Date
  endTime: Date
  posterImage: File[] | string[] | null
  pricePerTicket: number
  maxTicketsPerUser: number
  totalTicket: number
  date: Date[]
  createdAt: Date
  ticketPurchased: number
  address?: string
  venueName?: string
  category: string
  hostedBy: string
  status: "upcoming" | "completed" | "cancelled"
}

interface EditEventModalProps {
  event: EventType
  isOpen: boolean
  onClose: () => void
  onUpdate: (eventId: string, update: EventUpdateEntity) => void
  isLoading: boolean
}

interface ValidationErrors {
  title?: string
  description?: string
  latitude?: string
  longitude?: string
  date?: string
  startTime?: string
  endTime?: string
  pricePerTicket?: string
  totalTicket?: string
  maxTicketsPerUser?: string
  category?: string
}

const categoryOptions = [
  "Music",
  "Arts",
  "Sports",
  "Food",
  "Business",
  "Education",
  "Technology",
  "Health",
  "Social",
  "Other"
]

// Make sure this component is properly exported
const EditEventModal: React.FC<EditEventModalProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  onUpdate, 
  isLoading 
}) => {
  // Form state
  const [title, setTitle] = useState(event.title || "")
  const [description, setDescription] = useState(event.description || "")
  const [address, setAddress] = useState(event.address || "")
  const [venueName, setVenueName] = useState(event.venueName || "")
  const [latitude, setLatitude] = useState(event.location?.latitude?.toString() || "0")
  const [longitude, setLongitude] = useState(event.location?.longitude?.toString() || "0")
  const [eventDate, setEventDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [pricePerTicket, setPricePerTicket] = useState(event.pricePerTicket?.toString() || "0")
  const [totalTicket, setTotalTicket] = useState(event.totalTicket?.toString() || "0")
  const [maxTicketsPerUser, setMaxTicketsPerUser] = useState(event.maxTicketsPerUser?.toString() || "1")
  const [category, setCategory] = useState(event.category || categoryOptions[0])
  const [status, setStatus] = useState<"upcoming" | "completed" | "cancelled">(event.status || "upcoming")
  
  // Validation state
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  // Helper functions for time format conversion
  const convert24To12Format = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    
    if (hour === 0) {
      return `12:${minutes} AM`;
    } else if (hour < 12) {
      return `${hour}:${minutes} AM`;
    } else if (hour === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hour - 12}:${minutes} PM`;
    }
  };
  
  const convert12To24Format = (time12: string): string => {
    if (!time12) return '';
    
    const [timePart, modifier] = time12.split(' ');
    let [hours, minutes] = timePart.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  // Convert date and time for form fields
  useEffect(() => {
    if (event.date && event.date.length > 0) {
      try {
        const date = new Date(event.date[0])
        setEventDate(date.toISOString().split('T')[0])
      } catch (error) {
        console.error("Invalid date format", error)
        setEventDate("")
      }
    }
    
    if (event.startTime) {
      try {
        const start = new Date(event.startTime)
        const time24 = start.toISOString().split('T')[1].substring(0, 5)
        setStartTime(convert24To12Format(time24))
      } catch (error) {
        console.error("Invalid start time format", error)
        setStartTime("")
      }
    }
    
    if (event.endTime) {
      try {
        const end = new Date(event.endTime)
        const time24 = end.toISOString().split('T')[1].substring(0, 5)
        setEndTime(convert24To12Format(time24))
      } catch (error) {
        console.error("Invalid end time format", error)
        setEndTime("")
      }
    }
  }, [event])

  // Validate the form data against schema requirements
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    
    // Title validation (required)
    if (!title.trim()) {
      newErrors.title = "Event title is required"
    }
    
    // Description validation (required)
    if (!description.trim()) {
      newErrors.description = "Event description is required"
    }
    
    // Location validation (required)
    if (!latitude || isNaN(parseFloat(latitude))) {
      newErrors.latitude = "Valid latitude is required"
    }
    
    if (!longitude || isNaN(parseFloat(longitude))) {
      newErrors.longitude = "Valid longitude is required"
    }
    
    // Date validation (required)
    if (!eventDate) {
      newErrors.date = "Event date is required"
    }
    
    // Time validation (required and format)
    const timeFormatRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM|am|pm)$/;
    
    if (!startTime) {
      newErrors.startTime = "Start time is required"
    } else if (!timeFormatRegex.test(startTime)) {
      newErrors.startTime = "Invalid time format. Use HH:MM AM/PM"
    }
    
    if (!endTime) {
      newErrors.endTime = "End time is required"
    } else if (!timeFormatRegex.test(endTime)) {
      newErrors.endTime = "Invalid time format. Use HH:MM AM/PM"
    } else if (startTime && endTime && timeFormatRegex.test(startTime) && timeFormatRegex.test(endTime)) {
      // Check if end time is after start time
      try {
        const startTime24 = convert12To24Format(startTime)
        const endTime24 = convert12To24Format(endTime)
        
        const startDateTime = new Date(`${eventDate}T${startTime24}:00`)
        const endDateTime = new Date(`${eventDate}T${endTime24}:00`)
        
        if (endDateTime <= startDateTime) {
          newErrors.endTime = "End time must be after start time"
        }
      } catch (error) {
        console.error("Time comparison error:", error)
        newErrors.endTime = "Invalid time format"
      }
    }
    
    // Price validation (required)
    if (pricePerTicket === "" || isNaN(parseFloat(pricePerTicket)) || parseFloat(pricePerTicket) < 0) {
      newErrors.pricePerTicket = "Valid ticket price is required (min: 0)"
    }
    
    // Total tickets validation (required)
    if (totalTicket === "" || isNaN(parseInt(totalTicket)) || parseInt(totalTicket) <= 0) {
      newErrors.totalTicket = "Valid total tickets value is required (min: 1)"
    }
    
    // Max tickets per user validation (required)
    if (maxTicketsPerUser === "" || isNaN(parseInt(maxTicketsPerUser)) || parseInt(maxTicketsPerUser) <= 0) {
      newErrors.maxTicketsPerUser = "Valid max tickets per user is required (min: 1)"
    } else if (parseInt(maxTicketsPerUser) > parseInt(totalTicket)) {
      newErrors.maxTicketsPerUser = "Max tickets per user cannot exceed total tickets"
    }
    
    // Category validation (required)
    if (!category) {
      newErrors.category = "Category is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Mark field as touched when it loses focus
  const handleBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    const isValid = validateForm()
    
    // Mark all fields as touched on submit attempt
    const allFields = [
      'title', 'description', 'latitude', 'longitude', 
      'date', 'startTime', 'endTime', 'pricePerTicket', 
      'totalTicket', 'maxTicketsPerUser', 'category'
    ]
    const allTouched = allFields.reduce((acc, field) => {
      acc[field] = true
      return acc
    }, {} as Record<string, boolean>)
    
    setTouchedFields(allTouched)
    
    if (!isValid) {
      return
    }
    
    // Create the update object
    const update: EventUpdateEntity = {
      title,
      description,
      location: {
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0
      },
      address,
      venueName,
      pricePerTicket: parseFloat(pricePerTicket) || 0,
      totalTicket: parseInt(totalTicket) || 0,
      maxTicketsPerUser: parseInt(maxTicketsPerUser) || 1,
      category,
      status
    }
    
    // Add date and time if provided
    if (eventDate) {
      const dateObj = new Date(eventDate)
      update.date = [dateObj]
    }
    
    // Convert 12-hour times to 24-hour format for backend storage
    if (eventDate && startTime) {
      const time24 = convert12To24Format(startTime)
      const startDateTime = new Date(`${eventDate}T${time24}:00`)
      update.startTime = startDateTime
    }
    
    if (eventDate && endTime) {
      const time24 = convert12To24Format(endTime)
      const endDateTime = new Date(`${eventDate}T${time24}:00`)
      update.endTime = endDateTime
    }
    
    // Call the update function
    onUpdate(event._id, update)
  }

  // Helper function to show error message if field is touched and has error
  const showError = (field: keyof ValidationErrors) => 
    touchedFields[field] && errors[field]

  // Simple modal version that doesn't rely on headlessui
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-yellow-50 px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-yellow-800">
                Edit Event
              </h3>
              <button
                type="button"
                className="rounded-md bg-yellow-50 text-yellow-700 hover:text-yellow-900 focus:outline-none"
                onClick={onClose}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => handleBlur('title')}
                  className={`mt-1 block w-full rounded-md border ${
                    showError('title') ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                />
                {showError('title') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => handleBlur('description')}
                  className={`mt-1 block w-full rounded-md border ${
                    showError('description') ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                />
                {showError('description') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>
              
              {/* Venue */}
              <div>
                <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">
                  Venue Name (Optional)
                </label>
                <div className="mt-1 flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="venueName"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
              </div>
              
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address (Optional)
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                />
              </div>
              
              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                    Latitude *
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    onBlur={() => handleBlur('latitude')}
                    className={`mt-1 block w-full rounded-md border ${
                      showError('latitude') ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                  />
                  {showError('latitude') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.latitude}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                    Longitude *
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    onBlur={() => handleBlur('longitude')}
                    className={`mt-1 block w-full rounded-md border ${
                      showError('longitude') ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                  />
                  {showError('longitude') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.longitude}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Event Date *
                </label>
                <div className="mt-1 flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    onBlur={() => handleBlur('date')}
                    className={`ml-2 block w-full rounded-md border ${
                      showError('date') ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                  />
                </div>
                {showError('date') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.date}
                  </p>
                )}
              </div>
              
              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time *
                  </label>
                  <div className="relative">
                    <div className="mt-1 flex items-center">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="startTime"
                        placeholder="e.g., 9:00 AM"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        onBlur={() => handleBlur('startTime')}
                        className={`ml-2 block w-full rounded-md border ${
                          showError('startTime') ? 'border-red-300' : 'border-gray-300'
                        } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Format: HH:MM AM/PM</p>
                  </div>
                  {showError('startTime') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.startTime}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time *
                  </label>
                  <div className="relative">
                    <div className="mt-1 flex items-center">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="endTime"
                        placeholder="e.g., 5:00 PM"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        onBlur={() => handleBlur('endTime')}
                        className={`ml-2 block w-full rounded-md border ${
                          showError('endTime') ? 'border-red-300' : 'border-gray-300'
                        } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Format: HH:MM AM/PM</p>
                  </div>
                  {showError('endTime') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Price and Tickets */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pricePerTicket" className="block text-sm font-medium text-gray-700">
                    Price Per Ticket (₹) *
                  </label>
                  <div className="mt-1 flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="pricePerTicket"
                      min="0"
                      step="0.01"
                      value={pricePerTicket}
                      onChange={(e) => setPricePerTicket(e.target.value)}
                      onBlur={() => handleBlur('pricePerTicket')}
                      className={`ml-2 block w-full rounded-md border ${
                        showError('pricePerTicket') ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                    />
                  </div>
                  {showError('pricePerTicket') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.pricePerTicket}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="totalTicket" className="block text-sm font-medium text-gray-700">
                    Total Tickets *
                  </label>
                  <div className="mt-1 flex items-center">
                    <Users className="h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="totalTicket"
                      min="1"
                      value={totalTicket}
                      onChange={(e) => setTotalTicket(e.target.value)}
                      onBlur={() => handleBlur('totalTicket')}
                      className={`ml-2 block w-full rounded-md border ${
                        showError('totalTicket') ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                    />
                  </div>
                  {showError('totalTicket') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.totalTicket}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="maxTicketsPerUser" className="block text-sm font-medium text-gray-700">
                    Max Per User *
                  </label>
                  <div className="mt-1 flex items-center">
                    <Users className="h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="maxTicketsPerUser"
                      min="1"
                      value={maxTicketsPerUser}
                      onChange={(e) => setMaxTicketsPerUser(e.target.value)}
                      onBlur={() => handleBlur('maxTicketsPerUser')}
                      className={`ml-2 block w-full rounded-md border ${
                        showError('maxTicketsPerUser') ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                    />
                  </div>
                  {showError('maxTicketsPerUser') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.maxTicketsPerUser}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <div className="mt-1 flex items-center">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onBlur={() => handleBlur('category')}
                    className={`ml-2 block w-full rounded-md border ${
                      showError('category') ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm`}
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {showError('category') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Status</label>
                <div className="mt-2 space-x-4">
                  <span className="relative flex items-center">
                    <input
                      id="upcoming"
                      name="status"
                      type="radio"
                      checked={status === "upcoming"}
                      onChange={() => setStatus("upcoming")}
                      className="h-4 w-4 border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <label htmlFor="upcoming" className="ml-2 block text-sm text-gray-700">
                      Upcoming
                    </label>
                  </span>
                  <span className="relative flex items-center">
                    <input
                      id="completed"
                      name="status"
                      type="radio"
                      checked={status === "completed"}
                      onChange={() => setStatus("completed")}
                      className="h-4 w-4 border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
                      Completed
                    </label>
                  </span>
                  <span className="relative flex items-center">
                    <input
                      id="cancelled"
                      name="status"
                      type="radio"
                      checked={status === "cancelled"}
                      onChange={() => setStatus("cancelled")}
                      className="h-4 w-4 border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <label htmlFor="cancelled" className="ml-2 block text-sm text-gray-700">
                      Cancelled
                    </label>
                  </span>
                </div>
              </div>
              
              {/* Required fields note */}
              <div className="text-sm text-gray-500 italic mt-4">
                * Required fields
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 mt-5 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                  isLoading
                    ? "bg-yellow-300 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    Update Event
                  </span>
                )}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Make sure to export the component properly
export default EditEventModal