"use client"

import type React from "react"
import { useState } from "react"
import { useFindAllEventsVendorSide, useUpdateEvent } from "@/hooks/vendorCustomHooks"
import EditEventModal from "./EditEventModal"
import { Calendar, Edit, MapPin, Clock, Users, Tag } from "lucide-react"
import { EventUpdateEntity } from "@/types/updateEventType"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/Store"
import { toast } from "react-toastify"

// Import the EventType interface or use it directly as defined
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

// Helper function to format location data
const formatLocation = (location: EventType['location'], address?: string): string => {
  if (address) return address
  return `${location.latitude}, ${location.longitude}`
}

// Helper function to format date
const formatDate = (dates: Date[]): string => {
  if (!dates || dates.length === 0) return 'No date available'
  
  // Format the first date in the array
  if (typeof dates[0] === 'string') {
    const date = new Date(dates[0])
    return date.toLocaleDateString()
  }
  
  return dates[0] instanceof Date ? dates[0].toLocaleDateString() : 'Invalid date'
}

// Helper function to format time
const formatTime = (start: Date, end: Date): string => {
  if (!start || !end) return 'Time not specified'
  
  const startTime = new Date(start)
  const endTime = new Date(end)
  
  return `${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`
}

const EventManagementPage: React.FC = () => {
  // State for pagination and modal
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const vendorId = useSelector((state: RootState) => state.vendorSlice.vendor?._id)

  // Fetch events using the provided hook
  const { data, isLoading, isError, error } = useFindAllEventsVendorSide(vendorId, currentPage)

  // Update event mutation
  const updateEventMutation = useUpdateEvent()

  // Handle opening the edit modal
  const handleEditEvent = (event: EventType) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  // Handle event update
  const handleUpdateEvent = (eventId: string, update: EventUpdateEntity) => {
    updateEventMutation.mutate(
      { eventId, update },
      {
        onSuccess: () => {
          // Show simple success toast
          toast.success("Event updated successfully!")
          
          setIsModalOpen(false)
          setSelectedEvent(null)
        },
        onError: (error) => {
          // Show simple error toast
          toast.error("Failed to update event")
        }
      },
    )
  }

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="bg-yellow-100 p-8 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-yellow-800 font-medium">Loading events...</p>
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (isError) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="bg-red-100 p-8 rounded-lg shadow-md">
          <h2 className="text-red-800 font-bold text-xl mb-2">Error Loading Events</h2>
          <p className="text-red-700">{error instanceof Error ? error.message : "An unknown error occurred"}</p>
        </div>
      </div>
    )
  }

  // Extract events from data
  const events: EventType[] = data?.events || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-800">Event Management</h1>
          <p className="text-yellow-700 mt-2">Manage your events and keep track of all details</p>
        </header>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-200 hover:border-yellow-400 transition-all"
              >
                {event.posterImage && event.posterImage.length > 0 && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={typeof event.posterImage[0] === 'string' ? event.posterImage[0] : "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-yellow-800 mb-2">{event.title}</h2>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        event.status === "upcoming"
                          ? "bg-green-100 text-green-800"
                          : event.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-yellow-700 mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-yellow-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {event.venueName || event.address 
                          ? `${event.venueName || ''} ${event.venueName && event.address ? '- ' : ''}${event.address || ''}`
                          : formatLocation(event.location)}
                      </span>
                    </div>
                    <div className="flex items-center text-yellow-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-yellow-700">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatTime(event.startTime, event.endTime)}</span>
                    </div>
                    <div className="flex items-center text-yellow-700">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.ticketPurchased}/{event.totalTicket} tickets sold</span>
                    </div>
                    <div className="flex items-center text-yellow-700">
                      <Tag className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.category}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-yellow-800">
                    ₹
                    {typeof event.pricePerTicket === 'number' ? event.pricePerTicket.toFixed(2) : '0.00'}
                    </span>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-yellow-100 p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium text-yellow-800">No events found</h3>
              <p className="text-yellow-700 mt-2">Create your first event to get started</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {events.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-yellow-200 text-yellow-500 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-yellow-200 text-yellow-500 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedEvent(null)
          }}
          onUpdate={handleUpdateEvent}
          isLoading={updateEventMutation.isPending}
        />
      )}
    </div>
  )
}

export default EventManagementPage