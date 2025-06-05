"use client"

import type React from "react"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useFetchClientAdminQuery, useBlockClient, useUnblockClient } from "@/hooks/adminCustomHooks"
import { toast } from "react-toastify"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Types
interface Client {
  _id: string
  name: string
  email: string
  isBlocked: boolean
  createdAt: string
}

const UserManagementPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  // Fetch clients data
  const { data, isLoading, error } = useFetchClientAdminQuery(currentPage)

  // Block/Unblock mutation hooks
  const blockClient = useBlockClient()
  const unblockClient = useUnblockClient()

  // Get clients from the query data
  const clientsData = data?.clients || []

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ userId: string; isCurrentlyBlocked: boolean } | null>(null)

  const handleBlockAndUnblock = async ({
    userId,
    isCurrentlyBlocked,
  }: { userId: string; isCurrentlyBlocked: boolean }) => {
    // Show confirmation dialog and store pending action
    setShowConfirmDialog(true)
    setPendingAction({ userId, isCurrentlyBlocked })
  }

  const confirmAction = async () => {
    if (!pendingAction) return

    const { userId, isCurrentlyBlocked } = pendingAction

    try {
      const queryKey = ["clients", currentPage]

      // Optimistically update the UI
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          clients: oldData.clients.map((client: Client) =>
            client._id === userId ? { ...client, isBlocked: !isCurrentlyBlocked } : client,
          ),
        }
      })

      if (!isCurrentlyBlocked) {
        // Block the user
        await blockClient.mutateAsync(userId, {
          onSuccess: (data) => {
            toast.success(data.message || "User blocked successfully")
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to block user")
            // Revert the optimistic update
            queryClient.invalidateQueries({ queryKey })
          },
        })
      } else {
        // Unblock the user
        await unblockClient.mutateAsync(userId, {
          onSuccess: (data) => {
            toast.success(data.message || "User unblocked successfully")
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to unblock user")
            // Revert the optimistic update
            queryClient.invalidateQueries({ queryKey })
          },
        })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update user status")
      // Ensure queries are invalidated on error
      queryClient.invalidateQueries({ queryKey: ["clients", currentPage] })
    } finally {
      // Close dialog and clear pending action
      setShowConfirmDialog(false)
      setPendingAction(null)
    }
  }

  const cancelAction = () => {
    setShowConfirmDialog(false)
    setPendingAction(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error instanceof Error ? error.message : "An error occurred"}</p>
          <p className="mt-2 text-sm">Please make sure your API server is running at localhost:3000</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-800">User Management</h1>
          <p className="text-yellow-700 mt-2">Manage your platform users</p>
        </header>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-yellow-100 border-b border-yellow-200">
            <h2 className="text-xl font-semibold text-yellow-800">Users List</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-yellow-200">
              <thead className="bg-yellow-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                  >
                    Joined Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-yellow-800 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-yellow-100">
                {clientsData.map((client) => (
                  <tr key={client._id} className="hover:bg-yellow-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {client.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          handleBlockAndUnblock({
                            userId: client._id,
                            isCurrentlyBlocked: client.isBlocked,
                          })
                        }
                        disabled={blockClient.isPending || unblockClient.isPending}
                        className={`px-3 py-1 rounded-md ${
                          client.isBlocked
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                        } transition-colors duration-200`}
                      >
                        {(blockClient.isPending && blockClient.variables === client._id) ||
                        (unblockClient.isPending && unblockClient.variables === client._id)
                          ? "Processing..."
                          : client.isBlocked
                            ? "Unblock"
                            : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 0 && (
            <div className="bg-yellow-50 px-4 py-3 flex items-center justify-between border-t border-yellow-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-yellow-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{data.totalPages}</span> pages
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-yellow-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? "text-yellow-300 cursor-not-allowed" : "text-yellow-500 hover:bg-yellow-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page numbers */}
                    {[...Array(data.totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-yellow-300 bg-white text-sm font-medium ${
                          currentPage === index + 1
                            ? "bg-yellow-100 text-yellow-800 z-10"
                            : "text-yellow-500 hover:bg-yellow-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === data.totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-yellow-300 bg-white text-sm font-medium ${
                        currentPage === data.totalPages
                          ? "text-yellow-300 cursor-not-allowed"
                          : "text-yellow-500 hover:bg-yellow-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{pendingAction?.isCurrentlyBlocked ? "Unblock User" : "Block User"}</DialogTitle>
              <DialogDescription>
                {pendingAction?.isCurrentlyBlocked
                  ? "Are you sure you want to unblock this user? They will regain access to the platform."
                  : "Are you sure you want to block this user? They will lose access to the platform."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <Button
                type="button"
                variant={pendingAction?.isCurrentlyBlocked ? "default" : "destructive"}
                onClick={confirmAction}
                disabled={blockClient.isPending || unblockClient.isPending}
              >
                {blockClient.isPending || unblockClient.isPending
                  ? "Processing..."
                  : pendingAction?.isCurrentlyBlocked
                    ? "Yes, Unblock"
                    : "Yes, Block"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={cancelAction}
                disabled={blockClient.isPending || unblockClient.isPending}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default UserManagementPage
