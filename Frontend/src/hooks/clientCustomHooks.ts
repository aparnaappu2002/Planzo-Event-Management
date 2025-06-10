import { useMutation,useQuery } from "@tanstack/react-query";
import { clientSignup,clientCreateAccount,
    clientResendOtp,clientLogin,
    clientGoogleLogin,updateProfileClient,
    changePasswordClient,clientForgetPasswordEmail,uploadImageCloudinary,clientForgetPassword,clientLogout }
 from "../../src/services/ApiServiceClients";
import { ClientUpdateProfileEntity } from "@/types/clientUpdateProfileType";

type LoginProps = {
    email: string;
    password: string;
};

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

export const useClientSignupMutation = (p0: { onSuccess: () => void; onError: (error: any) => void; }) => {
    return useMutation({
        mutationFn: (values: FormValues) => clientSignup(values)
    })
}

export const useCreateAccountMutation = () => {
    return useMutation({
        mutationFn: ({ formdata, otpString }: { formdata: Record<string, string | boolean | number>; otpString: string }) => clientCreateAccount({ formdata, otpString })

    })
}
export const useResendOtpClientMutation = () => {
    return useMutation({
        mutationFn: (email: string) => clientResendOtp(email)
    })
}

export const useClientLoginMutation = () => {
    return useMutation({
        mutationFn: ({ email, password }: LoginProps) => clientLogin({ email, password }),
    })
}

export const useClientGoogleLoginMutation = () => {
    return useMutation({
        mutationFn: (client: Client) => clientGoogleLogin(client)
    })
}
export const useUpdateClientProfie = () => {
    return useMutation({
        mutationFn: (client: ClientUpdateProfileEntity) => updateProfileClient(client)
    })
}
export const useChangePasswordClient = () => {
    return useMutation({
        mutationFn: ({ clientId, oldPassword, newPassword }: { clientId: string, oldPassword: string, newPassword: string }) => changePasswordClient(clientId, oldPassword, newPassword)
    })
}

export const useUploadeImageToCloudinaryMutation = () => {
    return useMutation({
        mutationFn: async (formData: FormData) => {
            return await uploadImageCloudinary(formData)

        },

    })
}

export const useClientRequestForgetPassword = () => {
    return useMutation({
        mutationFn: (email: string) => clientForgetPasswordEmail(email)
    })
}

export const useClientForgetPassword = () => {
    return useMutation({
        mutationFn: ({ 
          email, 
          newPassword, 
          token 
        }: { 
          email: string, 
          newPassword: string,
          token: string 
        }) => clientForgetPassword({ email, newPassword, token })
    })
}

export const useClientLogout = () => {
    return useMutation({
        mutationFn: () => clientLogout(),
    })
}