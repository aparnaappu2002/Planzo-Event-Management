import { AxiosResponse,isAxiosError } from "axios";
import axios from '../axios/adminAxios'
interface Login {
    email: string;
    password: string
}

export const adminLogin = async ({ email, password }: Login) => {
    try {
      const response = await axios.post('/login', { email, password });
      return response?.data;
    } catch (error) {
      console.log('❌ Error while admin login');
  
      if (isAxiosError(error)) {
        console.log('🧾 Axios error response:', error.response?.data);
  
        // Give fallback if `error.response?.data?.error` is undefined
        throw new Error(error.response?.data?.error || 'Something went wrong');
      }
  
      throw new Error(
        error instanceof Error ? error.message : 'Unknown error during admin login'
      );
    }
  };
  

export const fetchClientsAdmin = async (currentPage: number) => {
    try {
        const response: AxiosResponse = await axios.get('/clients', { params: { pageNo: currentPage } })
        return response.data
    } catch (error) {
        console.log('error while fetching Clients', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.error)
        }
        throw new Error('error while fetching clients')
    }
}

export const blockClient = async (clientId: string) => {
    try {
        const response = await axios.patch('/blockClient', { clientId })
        return response.data
    } catch (error) {
        console.log('error while blocking user', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while blocking user')
    }
}

export const unblockClient = async (clientId: string) => {
    try {
        const response = await axios.patch('/unblockClient', { clientId })
        return response.data
    } catch (error) {
        console.log('error while unblocking client', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while unblocking client')
    }
}

export const fetchVendorsAdmin = async (currentPage: number) => {
    try {
        const response: AxiosResponse = await axios.get('/vendors', { params: { pageNo: currentPage } })
        return response.data
    } catch (error) {
        console.log('error while fetching vendors', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.error)
        }
        throw new Error('error while fetching vendors')
    }
}

export const fetchPendingVendorsAdmin = async (currentPage: number) => {
    try {
        const response: AxiosResponse = await axios.get('/pendingVendors', { params: { pageNo: currentPage } })
        return response.data
    } catch (error) {
        console.log('error while fetching pendingVendors', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.error)
        }
        throw new Error('error while fetching pendingVendors')
    }
}

export const approvePendingVendor = async ({ vendorId, newStatus }: { vendorId: string, newStatus: string }) => {
    try {
        const response = await axios.patch('/updateVendorStatus', { vendorId, newStatus })
        console.log(response)
        return response.data
    } catch (error) {
        console.log('error while approving pending vendor', error)
        if (isAxiosError(error)) {
            throw new Error(error?.response?.data?.error)
        }
        throw new Error('error while approving pending vendor')
    }
}

export const rejectPendingVendor = async ({ vendorId, newStatus, rejectionReason }: { vendorId: string, newStatus: string, rejectionReason: string }) => {
    try {
        const response = await axios.patch('/rejectVendor', { vendorId, newStatus, rejectionReason })
        return response.data
    } catch (error) {
        console.log('error while rejecting vendor', error)
        if (isAxiosError(error)) {
            throw new Error(error?.response?.data?.error)
        }
        throw new Error('error while rejecting vendor')
    }
}

export const findAllRejectedVendor = async (currentPage: number) => {
    try {
        const response = await axios.get('/rejectedVendors', { params: { pageNo: currentPage } })
        return response.data
    } catch (error) {
        console.log('error while fetching rejected vendors', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message)
        }
        throw new Error('error while fetching rejected vendors')
    }
}
export const blockVendor = async (vendorId: string) => {
    try {
        const response = await axios.patch('/blockVendor', { vendorId })
        return response.data
    } catch (error) {
        console.log('error while blocking vendor', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while blocking vendor')
    }
}

export const unblockVendor = async (vendorId: string) => {
    try {
        const response = await axios.patch('/unblockVendor', { vendorId })
        return response.data
    } catch (error) {
        console.log('error while unblocking vendor', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while unblocking vendor')
    }
}