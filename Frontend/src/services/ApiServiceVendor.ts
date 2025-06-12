import axios from '../axios/vendorAxios'
import clodAxios,{isAxiosError} from 'axios'
import { EventUpdateEntity } from '@/types/updateEventType';
import { EventType } from 'react-hook-form';
interface VendorData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    idProof: string;
}

export const vendorSignup = async (vendor: VendorData) => {
    try {
        console.log("Sending vendor data:", vendor);

        const response = await axios.post('/signup', vendor)
        
        return response.data
    } catch (error) {
        console.log('error while signup vendor', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw 'error while signup Vendor'
    }
}

export const verifyOtpVendor = async ({ formdata, otpString }: { formdata: Record<string, string | number | boolean>; otpString: string }) => {
    try {
        const response = await axios.post('/verify', { formdata, enteredOtp: otpString })
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "OTP verification failed"); // ✅ Throw the error
        }
        throw new Error("Unknown error occurred during OTP verification"); 

    }
}

export const resendOtpVendor = async (email: string) => {
    try {
        const response = await axios.post('/resendOtp', { email })
        return response.data
    } catch (error) {
        console.log('error while resending otp in vendor', error)
        if (isAxiosError(error)) {
            throw new Error(error?.response?.data?.error)
        }
        throw new Error('error while resending otp')
    }
}

export const vendorLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post('/login', { email, password })
        return response.data
    } catch (error) {
        console.log('error whilel vendor login', error)
        if (isAxiosError(error)) {
            throw new Error(error?.response?.data?.error)
        }
        throw new Error('error while login vendor')
    }
}
export const updateProfileImageVendor = async (id: string, imageUrl: string) => {
    try {
        const response = await axios.post('/updateProfileImage', { id, imageUrl })
        return response.data
    } catch (error) {
        console.log('error while updating image vendor side', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.error)
        }
        throw new Error('error while updating image vendor side')
    }
}
export const updateVendorDetails = async (id: string, about: string, phone: string, name: string) => {
    try {
        const response = await axios.patch('/updateDetailsVendor', { id, about, phone, name })
        return response.data
    } catch (error) {
        console.log('error while updating vendor details', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while updating vendor details')
    }
}
export const changePasswordVendor = async (userId: string, newPassword: string, oldPassword: string) => {
    try {
        const response = await axios.patch('/changePassword', { userId, oldPassword, newPassword })
        return response.data
    } catch (error) {
        console.log('error while changing password vendor', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error whiel changing password vendor')
    }
}
export const createEvent = async (event: EventType, vendorId: string) => {
    try {
        const response = await axios.post(`/createEvent/${vendorId}`, { event })
        return response.data
    } catch (error) {
        console.log('error while creating event', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('Error whilw creating event')
    }
}

export const findAllEventsInVendor = async (vendorId: string, pageNo: number) => {
    try {
        const response = await axios.get(`/showEvents/${pageNo}/${vendorId}`)
        return response.data
    } catch (error) {
        console.log('error while fetching events in vendor side', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while fetching events in vendor side')
    }
}

export const updateEvent = async (eventId: string, update: EventUpdateEntity) => {
    try {
        const response = await axios.put('/updateEvent', { eventId, update })
        return response.data
    } catch (error) {
        console.log('error while updating event', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('Error while updating event')
    }
}

export const vendorLogout = async () => {
    try {
        const response = await axios.post('/logout')
        return response.data
    } catch (error) {
        console.log('error while logout', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while logout')
    }
}

export const reapplyVendor = async ({ vendorId, newStatus }: { vendorId: string, newStatus: string }) => {
    try {
        const response = await axios.patch('/reapplyVendor', { vendorId, newStatus })
        console.log(response)
        return response.data
    } catch (error) {
        console.log('error while reapplying vendor', error)
        if (isAxiosError(error)) {
            throw new Error(error?.response?.data?.error)
        }
        throw new Error('error while reapplying vendor')
    }
}