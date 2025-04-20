import { isAxiosError } from "axios";
import axios from "../axios/clientAxios"
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