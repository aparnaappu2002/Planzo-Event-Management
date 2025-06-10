import { isAxiosError } from "axios";
import axios from "../axios/clientAxios"
import { ClientUpdateProfileEntity } from "@/types/clientUpdateProfileType";
import clodAxios from 'axios'


interface Login {
    email: string;
    password: string
}

interface FormValues {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

type Client = {
    email: string;
    googleVerified: boolean;
    name: string;
    profileImage: string
}

export const clientSignup = async (values: FormValues) => {
    try {
        const response = await axios.post('/signup', values)
        return response?.data
    } catch (error) {
        console.log('error while client signup', error)
        if (isAxiosError(error)) {
            throw new Error(error?.response?.data?.error)
        }
        throw new Error('error while client signup')
    }
}

export const clientCreateAccount = async ({ formdata, otpString }: { formdata: Record<string, string | number | boolean>; otpString: string }) => {
    try {
        // Fix the endpoint to match what the server expects
        const response = await axios.post('/createAccount', { formdata, otpString })
        return response.data
    } catch (error) {
        console.log('error while client create account', error)
        if (isAxiosError(error)) {
            // Extract more detailed error information
            throw new Error(error.response?.data?.error || "Failed to create account")
        }
        throw new Error('error while client create account')
    }
}

export const clientResendOtp = async (email: string) => {
    try {
        const response = await axios.post('/resendOtp', { email })
        return response.data
    } catch (error) {
        console.log('error while client resend otp', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client resend otp')
    }
}

export const clientLogin = async ({ email, password }: Login) => {
    try {
        const response = await axios.post('/login', { email, password })
        return response?.data
    } catch (error) {
        console.log('error while client login', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client login')
    }
}

export const clientGoogleLogin = async (client: Client) => {
    try {
        const response = await axios.post('/googleLogin', { client })
        return response.data
    } catch (error) {
        console.log('error while client google login', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client google login')
    }
}

export const updateProfileClient = async (client: ClientUpdateProfileEntity) => {
    try {
        const response = await axios.put('/updateProfileClient', { client })
        return response.data
    } catch (error) {
        console.log('error while udpating client profile', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while updating client profile')
    }
}
export const changePasswordClient = async (clientId: string, oldPassword: string, newPassword: string) => {
    try {
        const response = await axios.patch('/changePasswordClient', { clientId, oldPassword, newPassword })
        return response.data
    } catch (error) {
        console.log('error while changing password client', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while changing client password')
    }
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dzpf5joxo/image/upload";

export const uploadImageCloudinary = async (formdata: FormData) => {
    try {
        const response = await clodAxios.post(CLOUDINARY_URL, formdata)
        return response.data
    } catch (error) {
        console.log('error while uploding image', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw 'error while uploading image'
    }
}

export const clientForgetPasswordEmail = async (email: string) => {
    try {
        const response = await axios.post('/sendEmailForgetPassword', { email })
        return response.data
    } catch (error) {
        console.log('error while requesting otp for forget password', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while requesting for otp in forget password')
    }
}

export const clientForgetPassword = async ({ 
  email, 
  newPassword, 
  token 
}: { 
  email: string, 
  newPassword: string,
  token: string 
}) => {
    try {
        const response = await axios.post('/resetforgetPassword', { 
          email, 
          newPassword, 
          token 
        })
        return response.data
    } catch (error) {
        console.log('error while forget password', error)
        if (isAxiosError(error)) {
            throw new Error(error?.response?.data.error)
        }
        throw new Error('error while forget password')
    }
}

export const clientLogout = async () => {
    try {
        const response = await axios.post('/logout')
        return response.data
    } catch (error) {
        console.log('error while client logout', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while client logout')
    }
}