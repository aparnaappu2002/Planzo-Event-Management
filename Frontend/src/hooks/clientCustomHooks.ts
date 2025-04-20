import { useMutation,useQuery } from "@tanstack/react-query";
import { clientSignup } from "@/services/ApiServiceClients";

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