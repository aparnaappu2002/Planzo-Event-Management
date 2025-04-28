"use client"

import React, { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Calendar, Clock, MapPin, Users, X, Tag, DollarSign, Check } from "lucide-react"
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
        setStartTime(start.toISOString().split('T')[1].substring(0, 5))
      } catch (error) {
        console.error("Invalid start time format", error)
        setStartTime("")
      }
    }
    
    if (event.endTime) {
      try {
        const end = new Date(event.endTime)
        setEndTime(end.toISOString().split('T')[1].substring(0, 5))
      } catch (error) {
        console.error("Invalid end time format", error)
        setEndTime("")
      }
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
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
    
    if (eventDate && startTime) {
      const startDateTime = new Date(`${eventDate}T${startTime}:00`)
      update.startTime = startDateTime
    }
    
    if (eventDate && endTime) {
      const endDateTime = new Date(`${eventDate}T${endTime}:00`)
      update.endTime = endDateTime
    }
    
    // Call the update function
    onUpdate(event._id, update)
  }

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
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  required
                />
              </div>
              
              {/* Venue */}
              <div>
                <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">
                  Venue Name
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
                  Address
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
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Event Date
                </label>
                <div className="mt-1 flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <div className="mt-1 flex items-center">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <div className="mt-1 flex items-center">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      id="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Price and Tickets */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pricePerTicket" className="block text-sm font-medium text-gray-700">
                    Price Per Ticket (₹)
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
                      className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="totalTicket" className="block text-sm font-medium text-gray-700">
                    Total Tickets
                  </label>
                  <div className="mt-1 flex items-center">
                    <Users className="h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="totalTicket"
                      min="1"
                      value={totalTicket}
                      onChange={(e) => setTotalTicket(e.target.value)}
                      className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="maxTicketsPerUser" className="block text-sm font-medium text-gray-700">
                    Max Per User
                  </label>
                  <div className="mt-1 flex items-center">
                    <Users className="h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      id="maxTicketsPerUser"
                      min="1"
                      value={maxTicketsPerUser}
                      onChange={(e) => setMaxTicketsPerUser(e.target.value)}
                      className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1 flex items-center">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    required
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
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