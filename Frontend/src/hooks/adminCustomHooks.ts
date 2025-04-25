import { adminLogin,approvePendingVendor,fetchClientsAdmin,
    fetchPendingVendorsAdmin,fetchVendorsAdmin,
    findAllRejectedVendor,rejectPendingVendor,
blockClient,unblockClient,blockVendor,unblockVendor } from "@/services/ApiServiceAdmin";
import { useMutation,useQuery } from "@tanstack/react-query";
export const useAdminLoginMutation = () => {
    return useMutation({
        mutationFn: ({ email, password }: Login) => adminLogin({ email, password })

    })
}

export const useFetchClientAdminQuery = (currentPage: number) => {
    return useQuery({
        queryKey: ['clients', currentPage],
        queryFn: () => {
            return fetchClientsAdmin(currentPage)
        },
        refetchOnWindowFocus: false
    })
}

export const useBlockClient = () => {
    return useMutation({
        mutationFn: (clientId: string) => blockClient(clientId)
    })
}

export const useUnblockClient = () => {
    return useMutation({
        mutationFn: (clientId: string) => unblockClient(clientId)
    })
}
export const useFetchVendorAdminQuery = (currentPage: number) => {
    return useQuery({
        queryKey: ['vendors', currentPage],
        queryFn: () => {
            return fetchVendorsAdmin(currentPage)
        },
        refetchOnWindowFocus: false
    })
}

export const useFetchAllPendingVendorAdminQuery = (currentPage: number) => {
    return useQuery({
        queryKey: ['pendingVendors', currentPage],
        queryFn: () => {
            return fetchPendingVendorsAdmin(currentPage)
        },
        refetchOnWindowFocus: false
    })
}

export const useUpdatePendingVendorStatusAdmin = () => {
    return useMutation({
        mutationFn: ({ vendorId, newStatus }: { vendorId: string, newStatus: string }) => {
            return approvePendingVendor({ vendorId, newStatus })
        }
    })
}
export const useRejectPendingVendor = () => {
    return useMutation({
        mutationFn: ({ vendorId, newStatus, rejectionReason }: { vendorId: string, newStatus: string, rejectionReason: string }) => rejectPendingVendor({ vendorId, newStatus, rejectionReason })
    })
}
export const useBlockVendor = () => {
    return useMutation({
        mutationFn: (vendorId: string) => blockVendor(vendorId)
    })
}

export const useUnblockVendor = () => {
    return useMutation({
        mutationFn: (vendorId: string) => unblockVendor(vendorId)
    })
}